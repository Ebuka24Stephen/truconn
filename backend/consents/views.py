"""
Consent management views
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import UserConsent, Consent, ConsentHistory
from accounts.models import CustomUser
from .serializers import ConsentSerializer, UserConsentSerializer, ConsentHistorySerializer
from organization.permissions import IsCitizen
from organization.models import AccessRequest
from django.utils import timezone


class ConsentApiView(APIView):
    """Get all available consent types"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get all consent types"""
        try:
            consents = Consent.objects.all()
            serializer = ConsentSerializer(consents, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': f'Failed to retrieve consents: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserConsentsStatusView(APIView):
    """Get user consent status for all consents"""
    permission_classes = [IsAuthenticated, IsCitizen]
    
    def get(self, request):
        """Get consent status"""
        try:
            consents = Consent.objects.all()
            status_data = []
            
            for consent in consents:
                user_consent = UserConsent.objects.filter(
                    user=request.user,
                    consent=consent
                ).first()
                
                status_data.append({
                    'id': consent.id,
                    'name': consent.name,
                    'access': user_consent.access if user_consent else False,
                })
            
            return Response(status_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': f'Failed to retrieve consent status: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UserConsentView(APIView):
    """Toggle user consent"""
    permission_classes = [IsAuthenticated, IsCitizen]
    
    def post(self, request, consent_id):
        """Toggle consent (grant/revoke)"""
        try:
            consent = get_object_or_404(Consent, pk=consent_id)
            user_consent, created = UserConsent.objects.get_or_create(
                user=request.user,
                consent=consent,
                defaults={'access': False}
            )
            
            # Toggle access
            user_consent.access = not user_consent.access
            user_consent.save()
            
            return Response({
                'consent': consent.name,
                'access': user_consent.access,
                'message': f'Consent {"granted" if user_consent.access else "revoked"}'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': f'Failed to toggle consent: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CitizenTransparencyLog(APIView):
    """Get transparency log for citizen"""
    permission_classes = [IsAuthenticated, IsCitizen]
    
    def get(self, request):
        """Get access request log"""
        try:
            access_requests = AccessRequest.objects.filter(
                user=request.user
            ).select_related('organization', 'consent').order_by('-requested_at')
            
            log_data = [{
                'id': req.id,
                'organizationId': req.organization.id,
                'organizationName': req.organization.name,
                'consentType': req.consent.name,
                'status': req.status,
                'purpose': req.purpose,
                'requestedAt': req.requested_at.isoformat(),
                'lastAccessed': req.requested_at.isoformat(),  # Using requested_at as lastAccessed
            } for req in access_requests]
            
            return Response({
                'data': log_data,
                'message': 'Transparency log retrieved successfully'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': f'Failed to retrieve transparency log: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ConsentHistoryView(APIView):
    """Get consent history for a user"""
    permission_classes = [IsAuthenticated, IsCitizen]
    
    def get(self, request, consent_id=None):
        """Get consent history"""
        try:
            if consent_id:
                consent = get_object_or_404(Consent, pk=consent_id)
                user_consent = get_object_or_404(UserConsent, user=request.user, consent=consent)
                history = ConsentHistory.objects.filter(user_consent=user_consent).order_by('-changed_at')
            else:
                # Get all consent history for user
                user_consents = UserConsent.objects.filter(user=request.user)
                history = ConsentHistory.objects.filter(
                    user_consent__in=user_consents
                ).order_by('-changed_at')
            
            serializer = ConsentHistorySerializer(history, many=True)
            
            return Response({
                'count': len(serializer.data),
                'history': serializer.data
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': f'Failed to retrieve consent history: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ConsentExpiryView(APIView):
    """Check and handle consent expiry"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get expiring consents"""
        try:
            user_consents = UserConsent.objects.filter(
                user=request.user,
                access=True,
                expires_at__isnull=False
            )
            
            expiring_soon = []
            expired = []
            
            for consent in user_consents:
                if consent.is_expired():
                    expired.append({
                        'id': consent.id,
                        'consent_type': consent.consent.name,
                        'expired_at': consent.expires_at.isoformat(),
                    })
                    # Auto-revoke expired consent
                    consent.access = False
                    consent.save()
                elif consent.days_until_expiry() and consent.days_until_expiry() <= 7:
                    expiring_soon.append({
                        'id': consent.id,
                        'consent_type': consent.consent.name,
                        'expires_at': consent.expires_at.isoformat(),
                        'days_remaining': consent.days_until_expiry(),
                    })
            
            return Response({
                'expired': expired,
                'expiring_soon': expiring_soon,
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': f'Failed to check consent expiry: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
