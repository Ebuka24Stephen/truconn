from django.db import models, transaction
from django.conf import settings
from django.utils import timezone
from datetime import timedelta

# -------------------------------
# Consent model
# -------------------------------
class Consent(models.Model):
    name = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# -------------------------------
# UserConsent model
# -------------------------------
class UserConsent(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_consents'
    )
    consent = models.ForeignKey(Consent, on_delete=models.CASCADE)
    access = models.BooleanField(default=False)  # True = granted, False = revoked
    granted_at = models.DateTimeField(null=True, blank=True)
    revoked_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(
        null=True, blank=True, help_text="Optional expiry date for consent"
    )
    duration_days = models.IntegerField(
        null=True, blank=True, help_text="Consent duration in days (null = indefinite)"
    )

    class Meta:
        indexes = [
            models.Index(fields=['user', '-granted_at']),
            models.Index(fields=['expires_at']),
        ]
        # Optional: PostgreSQL only active uniqueness
        # constraints = [
        #     models.UniqueConstraint(
        #         fields=['user', 'consent'],
        #         condition=models.Q(access=True),
        #         name='unique_active_user_consent'
        #     )
        # ]

    def __str__(self):
        return f"{self.user.first_name} --- {self.consent.name} --- Access: {self.access}"

    def save(self, *args, **kwargs):
        """
        Ensures only one active consent per user/consent type.
        Automatically sets timestamps and expiry.
        """
        now = timezone.now()

        with transaction.atomic():
            if self.access:
                # Revoke any other active consent for same user & type
                UserConsent.objects.filter(
                    user=self.user, consent=self.consent, access=True
                ).exclude(pk=self.pk).update(access=False, revoked_at=now)

                if not self.granted_at:
                    self.granted_at = now
                self.revoked_at = None
                if self.duration_days and not self.expires_at:
                    self.expires_at = now + timedelta(days=self.duration_days)
            else:
                if not self.revoked_at:
                    self.revoked_at = now

            super().save(*args, **kwargs)

    # -------------------------------
    # Convenience methods
    # -------------------------------
    @property
    def is_active(self):
        """Check if consent is currently active and not expired"""
        if not self.access:
            return False
        if self.expires_at and timezone.now() > self.expires_at:
            return False
        return True

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
        return max(delta.days, 0)


# -------------------------------
# ConsentHistory model
# -------------------------------
class ConsentHistory(models.Model):
    """Audit trail for consent changes"""
    ACTION_CHOICES = [
        ('GRANTED', 'Granted'),
        ('REVOKED', 'Revoked'),
        ('EXPIRED', 'Expired'),
        ('MODIFIED', 'Modified'),
    ]

    user_consent = models.ForeignKey(
        UserConsent,
        on_delete=models.CASCADE,
        related_name='history'
    )
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    changed_at = models.DateTimeField(auto_now_add=True)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
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
