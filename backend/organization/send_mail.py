from django.core.mail import send_mail
from organization.models import Org, AccessRequest
from django.conf import settings  
from django.shortcuts import get_object_or_404
from accounts.models import CustomUser
from consents.models import UserConsent, Consent


def send_access_request_email(organization_id, user_id, consent_id):
    organization = get_object_or_404(Org, id=organization_id)
    user = get_object_or_404(CustomUser, id=user_id)
    consent = get_object_or_404(Consent, id=consent_id)

    user_consent = get_object_or_404(UserConsent, consent=consent, user=user)

    access_request = AccessRequest.objects.filter(
        organization=organization,
        user=user
    ).first()

    subject = f"{organization.name} Requests Access to Your Data"

    message = f"""
Hello {user.first_name},

{organization.name} has requested access to your data:

Consent Type: {consent.name}
Description: {access_request.purpose}
Current Status: PENDING.
Why they need it:
{access_request.purpose if access_request else "No reason provided."}

Please log in to your Truconn dashboard to approve or deny this request.

Truconn – Your Data, Your Control.
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )

    return {"message": "Email sent successfully"}


def access_granted(organization_id, access_request_id, consent_id, user_id):
    organization = get_object_or_404(Org, id=organization_id)
    user = get_object_or_404(CustomUser, id=user_id)
    consent = get_object_or_404(Consent, id=consent_id)
    user_consent = get_object_or_404(UserConsent, consent=consent, user=user)

    access_request = get_object_or_404(
        AccessRequest,
        id=access_request_id,
        organization=organization,
        user=user,
        consent=consent
    )

    subject = f"{organization.name} - Data Access Approved"
    message = f"""
Hello {organization.name},

{user.first_name} has granted access to their data.

Consent Type: {consent.name}
Consent Description: {consent.description if hasattr(consent, 'description') else 'N/A'}
Access Request Status: {access_request.status}

Truconn – Your Data, Your Control.
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [organization.email],
        fail_silently=False,
    )

    return {"message": "Email sent successfully"}