import logging
from django.conf import settings
from django.core.mail import send_mail
from .models import CustomUser

"""

logger = logging.getLogger(__name__)

@shared_task
def send_verification_mail(user_id):
    try:
        user = CustomUser.objects.get(id=user_id)
    except CustomUser.DoesNotExist:
        logger.error(f"User {user_id} does not exist")
        return

    code = generate_otp()
    EmailVerificationOtp.objects.create(user=user, code=code)

    try:
        send_mail(
            subject="Email Verification OTP",
            message=f"Your OTP is {code}",  # plain text fallback
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )
        logger.info(f"OTP sent to {user.email}")
    except Exception as e:
        logger.error(f"Failed to send OTP to {user.email}: {e}")
"""
