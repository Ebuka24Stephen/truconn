"""
Trust Registry API Views
Public and authenticated endpoints for accessing organization trust scores
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Org
from .trust_engine import TrustScoreEngine
from .integrity import DataIntegrityChecker
from .serializers import OrganizationSerializer
from django.db.models import Q


class TrustRegistryView(APIView):
    """Public API to get organization trust scores and rankings"""
    permission_classes = [AllowAny]  # Public access
    
    def get(self, request):
        """Get ranked list of organizations by trust score"""
        try:
            limit = int(request.query_params.get('limit', 10))
            limit = min(limit, 100)  # Cap at 100
            
            # Get rankings
            rankings = TrustScoreEngine.get_organization_ranking(limit=limit)
            
            return Response({
                'count': len(rankings),
                'results': rankings,
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': f'Failed to retrieve trust registry: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OrganizationTrustScoreView(APIView):
    """Get trust score for a specific organization (public)"""
    permission_classes = [AllowAny]
    
    def get(self, request, org_id=None):
        """Get trust score details for an organization"""
        try:
            if org_id:
                organization = get_object_or_404(Org, pk=org_id)
            else:
                # If no org_id, try to get from query params
                org_name = request.query_params.get('name')
                if org_name:
                    organization = get_object_or_404(Org, name=org_name)
                else:
                    return Response({
                        'error': 'Organization ID or name required'
                    }, status=status.HTTP_400_BAD_REQUEST)
            
            # Calculate trust score
            trust_data = TrustScoreEngine.calculate_trust_score(organization)
            
            # Update stored score
            organization.update_trust_score()
            
            return Response({
                'organization': {
                    'id': organization.id,
                    'name': organization.name,
                    'email': organization.email,
                    'website': organization.website,
                },
                'trust_score': trust_data['overall_score'],
                'trust_level': trust_data['trust_level'],
                'components': trust_data['components'],
                'certificate_issued': organization.trust_certificate_issued,
                'certificate_issued_at': organization.trust_certificate_issued_at.isoformat() if organization.trust_certificate_issued_at else None,
                'last_calculated': trust_data['last_calculated'],
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': f'Failed to retrieve trust score: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OrganizationTrustScoreDetailView(APIView):
    """Get detailed trust score for authenticated organization"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get own organization's trust score with details"""
        try:
            from .permissions import IsOrganization
            permission = IsOrganization()
            if not permission.has_permission(request, self):
                return Response({
                    'error': 'Organization access required'
                }, status=status.HTTP_403_FORBIDDEN)
            
            organization = get_object_or_404(Org, user=request.user)
            
            # Calculate trust score
            trust_data = TrustScoreEngine.calculate_trust_score(organization)
            
            # Get integrity check
            integrity_data = DataIntegrityChecker.verify_organization_data_integrity(organization)
            
            # Update stored score
            organization.update_trust_score()
            
            return Response({
                'organization': {
                    'id': organization.id,
                    'name': organization.name,
                },
                'trust_score': trust_data['overall_score'],
                'trust_level': trust_data['trust_level'],
                'components': trust_data['components'],
                'data_integrity': integrity_data,
                'certificate_issued': organization.trust_certificate_issued,
                'certificate_issued_at': organization.trust_certificate_issued_at.isoformat() if organization.trust_certificate_issued_at else None,
                'last_calculated': trust_data['last_calculated'],
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': f'Failed to retrieve trust score: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class DataIntegrityView(APIView):
    """Verify data integrity for an organization"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get data integrity status"""
        try:
            from .permissions import IsOrganization
            permission = IsOrganization()
            if not permission.has_permission(request, self):
                return Response({
                    'error': 'Organization access required'
                }, status=status.HTTP_403_FORBIDDEN)
            
            organization = get_object_or_404(Org, user=request.user)
            
            # Verify integrity
            integrity_data = DataIntegrityChecker.verify_organization_data_integrity(organization)
            
            return Response(integrity_data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'error': f'Failed to verify data integrity: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

