
from django.shortcuts import render, get_object_or_404
from .models import AccessRequest, Org
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import AccessRequestSerializer, OrganizationSerializer, CitizenListSerializer
from rest_framework import status
from consents.models import Consent, UserConsent
from accounts.models import CustomUser
from .permissions import IsOrganization, IsCitizen
from .send_mail import send_access_request_email, notify_organization_approval


class ConsentRequestView(APIView):
    permission_classes = [IsAuthenticated, IsOrganization]
    def post(self, request, consent_id, user_id):
        target_user = get_object_or_404(CustomUser, pk=user_id, user_role='CITIZEN')
        consent = get_object_or_404(Consent, pk=consent_id)
        user_consent = UserConsent.objects.filter(consent=consent, user=target_user, access=True).first()
        if not user_consent:
            return Response(
                {"error": "User has not granted this consent."},
                status=status.HTTP_400_BAD_REQUEST
            )
        organization = Org.objects.get(user=request.user)
        access_request, created = AccessRequest.objects.get_or_create(
            organization=organization,
            user = target_user,
            consent=consent,
            defaults={'status': 'PENDING'},
        )
        
        access_request.save()
        send_access_request_email(organization_id=organization.id,user_id=target_user.id,consent_id=consent.id)

        serializer = AccessRequestSerializer(access_request)
        return Response({
            "message": "Access request sent successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)

#Authenticated users can check to see which organization sent a request for data access
class RequestedConsentView(APIView):
    permission_classes = [IsAuthenticated, IsCitizen]

    def get(self, request):
        access_requests = AccessRequest.objects.filter(user=request.user)
        if not access_requests.exists():
            return Response(
                {"message": "No consent requests found."},
                status=status.HTTP_200_OK
            )
        serializer = AccessRequestSerializer(access_requests, many=True)
        return Response({
            "message": "Consent requests retrieved successfully.",
            "count": access_requests.count(),
            "data": serializer.data
        }, status=status.HTTP_200_OK)


#users can choose to approve or revoke organization's request
#For citizen 
class ConsentRevocationView(APIView):
    permission_classes = [IsAuthenticated, IsCitizen]
    def post(self, request, access_id):
        access_requests = get_object_or_404(AccessRequest, pk=access_id, user=request.user)
        if access_requests.status != 'APPROVED':
            access_requests.status = 'APPROVED'
            access_requests.save()
            organization = access_requests.organization
            notify_organization_approval(
                organization_email=organization.email,
                organization_name=organization.name,
                access_request_id=access_requests.id
            )
            access_requests_serializer = AccessRequestSerializer(access_requests)
            return Response({'message':'Consent Granted!'})
        
        else:
            access_requests.status = 'REVOKED'
            access_requests.save()
            access_requests_serializer = AccessRequestSerializer(access_requests)
            return Response({'message':'Consent Revoked!'})




class OrganizationAccessLog(APIView):
    permission_classes = [IsAuthenticated, IsOrganization]

    def get(self, request):
        org = get_object_or_404(Org, user=request.user)

        access_requests = AccessRequest.objects.filter(organization=org)

        if not access_requests.exists():
            return Response(
                {"message": "You have not requested consent from any citizen."},
                status=status.HTTP_200_OK
            )

        citizens = CustomUser.objects.filter(
            id__in=access_requests.values_list("user_id", flat=True),
            user_role="CITIZEN"
        )

        serializer = CitizenListSerializer(
            citizens, 
            many=True,
            context={'request': request}
        )

        return Response(serializer.data, status=status.HTTP_200_OK)


class OrganizationDetailView(APIView):
    """Get current organization's detail information"""
    permission_classes = [IsAuthenticated, IsOrganization]

    def get(self, request):
        try:
            org = get_object_or_404(Org, user=request.user)
            serializer = OrganizationSerializer(org)
            return Response({
                "organization": serializer.data
            }, status=status.HTTP_200_OK)
        except Org.DoesNotExist:
            return Response(
                {"error": "Organization not found"},
                status=status.HTTP_404_NOT_FOUND
            )