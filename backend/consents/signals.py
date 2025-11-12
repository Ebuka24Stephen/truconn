"""
Django signals for consent management
Handles notifications and history tracking
"""
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import UserConsent, ConsentHistory
from django.utils import timezone


@receiver(pre_save, sender=UserConsent)
def track_consent_changes(sender, instance, **kwargs):
    """Track consent changes before saving"""
    if instance.pk:
        try:
            old_instance = UserConsent.objects.get(pk=instance.pk)
            instance._old_access = old_instance.access
        except UserConsent.DoesNotExist:
            instance._old_access = False
    else:
        instance._old_access = False


@receiver(post_save, sender=UserConsent)
def create_consent_history(sender, instance, created, **kwargs):
    """Create history record when consent changes"""
    if created:
        # New consent
        action = 'GRANTED' if instance.access else 'REVOKED'
        ConsentHistory.objects.create(
            user_consent=instance,
            action=action,
            new_value=instance.access,
            reason='Initial consent creation'
        )
    elif hasattr(instance, '_old_access'):
        # Consent changed
        old_access = instance._old_access
        if old_access != instance.access:
            action = 'GRANTED' if instance.access else 'REVOKED'
            ConsentHistory.objects.create(
                user_consent=instance,
                action=action,
                previous_value=old_access,
                new_value=instance.access,
                reason='User consent change'
            )

