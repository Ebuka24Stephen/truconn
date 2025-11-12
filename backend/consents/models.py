from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

class Consent(models.Model):
    name = models.CharField(max_length=50)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    

class UserConsent(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_consents')
    consent = models.ForeignKey(Consent, on_delete=models.CASCADE)
    access = models.BooleanField(default=False)  # True = granted, False = revoked
    granted_at = models.DateTimeField(null=True, blank=True)
    revoked_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True, help_text="Optional expiry date for consent")
    duration_days = models.IntegerField(null=True, blank=True, help_text="Consent duration in days (null = indefinite)")

    class Meta:
        unique_together = ('user', 'consent')
        indexes = [
            models.Index(fields=['user', '-granted_at']),
            models.Index(fields=['expires_at']),
        ]
    
    def __str__(self):
        return f"{self.user.first_name} --- Data type: {self.consent.name} --- Access: {self.access}"
    
    def save(self, *args, **kwargs):
        # Track consent changes for notifications
        if self.pk:
            old_instance = UserConsent.objects.get(pk=self.pk)
            old_access = old_instance.access
            
            # Update timestamps
            if self.access and not old_access:
                # Consent granted
                self.granted_at = timezone.now()
                self.revoked_at = None
                # Set expiry if duration is specified
                if self.duration_days:
                    self.expires_at = timezone.now() + timedelta(days=self.duration_days)
            elif not self.access and old_access:
                # Consent revoked
                self.revoked_at = timezone.now()
        else:
            # New consent
            if self.access:
                self.granted_at = timezone.now()
                if self.duration_days:
                    self.expires_at = timezone.now() + timedelta(days=self.duration_days)
            old_access = False
        
        super().save(*args, **kwargs)
        
        # Send notifications if access changed
        if self.pk and hasattr(self, '_old_access'):
            if self._old_access != self.access:
                from .notifications import send_consent_change_notification
                send_consent_change_notification(self, self._old_access, self.access)
    
    def is_expired(self):
        """Check if consent has expired"""
        if not self.expires_at:
            return False
        return timezone.now() > self.expires_at
    
    def days_until_expiry(self):
        """Get days until consent expires"""
        if not self.expires_at:
            return None
        delta = self.expires_at - timezone.now()
        return delta.days if delta.days > 0 else 0


class ConsentHistory(models.Model):
    """Audit trail for consent changes"""
    ACTION_CHOICES = [
        ('GRANTED', 'Granted'),
        ('REVOKED', 'Revoked'),
        ('EXPIRED', 'Expired'),
        ('MODIFIED', 'Modified'),
    ]
    
    user_consent = models.ForeignKey(UserConsent, on_delete=models.CASCADE, related_name='history')
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    changed_at = models.DateTimeField(auto_now_add=True)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    previous_value = models.BooleanField(null=True, blank=True)
    new_value = models.BooleanField(null=True, blank=True)
    reason = models.TextField(blank=True, help_text="Reason for the change")
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        ordering = ['-changed_at']
        indexes = [
            models.Index(fields=['user_consent', '-changed_at']),
            models.Index(fields=['action', '-changed_at']),
        ]
    
    def __str__(self):
        return f"{self.user_consent.user.email} - {self.action} - {self.changed_at.date()}"