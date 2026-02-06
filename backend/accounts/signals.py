from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction

from .models import CustomUser, Profile

@receiver(post_save, sender=CustomUser)
def create_user_profile(sender, instance, created, **kwargs):
    if not created:
        return

    # Only citizens get Profile
    if instance.user_role != "CITIZEN":
        return

    # Make it idempotent so it never crashes with duplicates
    def _create():
        Profile.objects.get_or_create(user=instance)

    # Ensure it runs only after the user save transaction commits
    transaction.on_commit(_create)
