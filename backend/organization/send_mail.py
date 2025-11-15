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



def notify_organization_approval(organization_email, organization_name, access_request_id):
    """
    Send an email to the organization notifying them that their access request has been approved.

    Args:
        organization_email (str): The organization's email address.
        organization_name (str): The name of the organization.
        access_request_id (int): The ID of the approved access request.
    """
    subject = f"Access Request Approved - Request #{access_request_id}"
    message = (
        f"Hello {organization_name},\n\n"
        f"Your access request with ID #{access_request_id} has been approved.\n\n"
        f"You can now access the resources as per your request.\n\n"
        f"Thank you,\n"
        f"The Compliance Team"
    )
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [organization_email]

    send_mail(subject, message, from_email, recipient_list)