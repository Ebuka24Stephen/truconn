from django.db import models
from django.conf import settings
from accounts.models import CustomUser, Profile
from consents.models import Consent, UserConsent


class Org(models.Model):
    name = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    website = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name


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
    purpose = models.CharField(max_length=40)
    class Meta:
        unique_together = ('organization', 'user', 'consent')
        ordering = ['-requested_at']

    def __str__(self):
        return f"{self.organization.name} → {self.user.email} ({self.status})"
