from django.db import models
from django.conf import settings
from django.utils import timezone
from accounts.models import CustomUser, Profile
from consents.models import Consent, UserConsent
from django.contrib.auth import get_user_model
from django.conf import settings 

class Org(models.Model):
    TRUST_LEVEL_CHOICES = [
        ('EXCELLENT', 'Excellent'),
        ('VERIFIED', 'Verified'),
        ('GOOD', 'Good'),
        ('BASIC', 'Basic'),
        ('LOW', 'Low'),
    ]
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,limit_choices_to={'user_role': 'organization'}
)

    name = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    website = models.URLField(blank=True, null=True)
    address = models.CharField(max_length=700)
    
    # Trust Score Fields
    trust_score = models.FloatField(default=0.0, help_text="Overall trust score (0-100)")
    trust_level = models.CharField(max_length=20, choices=TRUST_LEVEL_CHOICES, default='BASIC')
    trust_score_last_calculated = models.DateTimeField(null=True, blank=True)
    trust_certificate_issued = models.BooleanField(default=False)
    trust_certificate_issued_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-trust_score', 'name']
        indexes = [
            models.Index(fields=['-trust_score']),
            models.Index(fields=['trust_level']),
        ]
    
    def __str__(self):
        return self.name
    
    def update_trust_score(self):
        """Update trust score for this organization"""
        from .trust_engine import TrustScoreEngine
        trust_data = TrustScoreEngine.calculate_trust_score(self)
        self.trust_score = trust_data['overall_score']
        self.trust_level = trust_data['trust_level']
        self.trust_score_last_calculated = timezone.now()
        
        # Auto-issue certificate if score >= 75 (VERIFIED or EXCELLENT)
        if trust_data['overall_score'] >= 75 and not self.trust_certificate_issued:
            self.trust_certificate_issued = True
            self.trust_certificate_issued_at = timezone.now()
        elif trust_data['overall_score'] < 75:
            self.trust_certificate_issued = False
            self.trust_certificate_issued_at = None
        
        self.save()
        return trust_data


class AccessRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REVOKED', 'Revoked'),
    ]

    organization = models.ForeignKey(Org, on_delete=models.CASCADE, related_name='access_requests')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='access_requests')
    consent = models.ForeignKey(Consent, on_delete=models.CASCADE, related_name='access_requests')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    requested_at = models.DateTimeField(auto_now_add=True)
    purpose = models.CharField(max_length=40, blank=False, null=False)
    class Meta:
        unique_together = ('organization', 'user', 'consent')
        ordering = ['-requested_at']

    def __str__(self):
        return f"{self.organization.name} → {self.user.email} ({self.status})"


class IntegrityRecord(models.Model):
    """Store integrity records for audit trail"""
    organization = models.ForeignKey(Org, on_delete=models.CASCADE, related_name='integrity_records')
    entity_type = models.CharField(max_length=50)  # 'access_request', 'consent', etc.
    entity_id = models.CharField(max_length=100)
    data_snapshot = models.JSONField()
    checksum = models.CharField(max_length=64)  # SHA-256 hex = 64 chars
    created_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    is_valid = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['organization', '-created_at']),
            models.Index(fields=['entity_type', 'entity_id']),
        ]
    
    def __str__(self):
        return f"{self.organization.name} - {self.entity_type} - {self.checksum[:8]}"
