"""
Auto-notification system for consent changes
Sends emails and webhooks when consent status changes
"""
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from organization.models import Org, AccessRequest
from accounts.models import CustomUser
from consents.models import UserConsent, Consent
import requests
import json


def send_consent_change_notification(user_consent: UserConsent, old_access: bool, new_access: bool):
    """Send notification when user consent changes"""
    user = user_consent.user
    consent = user_consent.consent
    
    # Get all affected organizations
    affected_orgs = AccessRequest.objects.filter(
        user=user,
        consent=consent,
        status='APPROVED'
    ).select_related('organization')
    
    action = "granted" if new_access else "revoked"
    
    # Email to user
    subject = f"Consent {action.capitalize()}: {consent.name}"
    message = f"""
Hello {user.first_name},

Your consent for {consent.name} has been {action}.

Status: {"✅ Granted" if new_access else "❌ Revoked"}
Date: {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}

Affected Organizations: {affected_orgs.count()}

This change affects the following organizations:
{chr(10).join([f"- {org.organization.name}" for org in affected_orgs[:5]])}
{f"... and {affected_orgs.count() - 5} more" if affected_orgs.count() > 5 else ""}

You can manage your consents at any time in your TruCon dashboard.

TruCon – Your Data, Your Control.
"""
    
    try:
        send_mail(
            subject,
            message,
            getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@truconn.com'),
            [user.email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Failed to send email to {user.email}: {e}")
    
    # Notify affected organizations
    for access_request in affected_orgs:
        notify_organization_consent_change(
            organization=access_request.organization,
            user=user,
            consent=consent,
            action=action,
            access_request=access_request
        )


def notify_organization_consent_change(organization: Org, user: CustomUser, consent: Consent, action: str, access_request: AccessRequest):
    """Notify organization when user consent changes"""
    org_user = organization.user
    
    subject = f"User Consent {action.capitalize()}: {consent.name}"
    message = f"""
Hello {organization.name} Team,

A user has {action} consent for {consent.name}:

User: {user.first_name} {user.last_name} ({user.email})
Consent Type: {consent.name}
Action: {action.capitalize()}
Date: {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}

Access Request ID: {access_request.id}
Current Status: {access_request.status}

{"⚠️ IMPORTANT: If this consent was revoked, you must immediately stop accessing this user's data for this consent type." if action == "revoked" else "✅ You can now access this user's data for this consent type."}

Please review your data access policies and ensure compliance with NDPR regulations.

TruCon Compliance Team
"""
    
    try:
        send_mail(
            subject,
            message,
            getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@truconn.com'),
            [org_user.email, organization.email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Failed to send email to organization {organization.name}: {e}")
    
    # Send webhook if configured
    send_webhook_notification(organization, user, consent, action, access_request)


def send_webhook_notification(organization: Org, user: CustomUser, consent: Consent, action: str, access_request: AccessRequest):
    """Send webhook notification to organization's webhook URL"""
    # Check if organization has webhook URL configured
    # For now, we'll check a future webhook_url field or use a default pattern
    # In production, organizations would configure their webhook URLs
    
    webhook_url = getattr(organization, 'webhook_url', None)
    if not webhook_url:
        return  # No webhook configured
    
    payload = {
        'event': 'consent_changed',
        'timestamp': timezone.now().isoformat(),
        'organization_id': organization.id,
        'organization_name': organization.name,
        'user_id': str(user.id),
        'user_email': user.email,
        'consent_type': consent.name,
        'action': action,  # 'granted' or 'revoked'
        'access_request_id': access_request.id,
        'access_request_status': access_request.status,
    }
    
    try:
        response = requests.post(
            webhook_url,
            json=payload,
            headers={'Content-Type': 'application/json'},
            timeout=5
        )
        response.raise_for_status()
    except Exception as e:
        print(f"Failed to send webhook to {webhook_url}: {e}")


def send_violation_alert(organization: Org, violation_type: str, details: dict):
    """Send alert for consent violations"""
    org_user = organization.user
    
    subject = f"⚠️ NDPR Compliance Alert: {violation_type}"
    message = f"""
Hello {organization.name} Team,

A compliance violation has been detected:

Violation Type: {violation_type}
Date: {timezone.now().strftime('%Y-%m-%d %H:%M:%S')}

Details:
{json.dumps(details, indent=2)}

This is a critical compliance issue that requires immediate attention.
Please review your data access policies and ensure all access requests
are properly handled according to NDPR regulations.

TruCon Compliance Team
"""
    
    try:
        send_mail(
            subject,
            message,
            getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@truconn.com'),
            [org_user.email, organization.email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Failed to send violation alert: {e}")

