
from django.shortcuts import render, get_object_or_404
from .models import AccessRequest, Org
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import AccessRequestSerializer, OrganizationSerializer
from rest_framework import status
from consents.models import Consent, UserConsent
from accounts.models import CustomUser
from .permissions import IsOrganization  



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

        serializer = AccessRequestSerializer(access_request)
        return Response({
            "message": "Access approved successfully.",
            "data": serializer.data
        }, status=status.HTTP_200_OK)



class RequestedConsentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        access_requests = AccessRequest.objects.filter(user=request.user)

        if not access_requests.exists():
            return Response(
                {"message": "No consent requests found for this user."},
                status=status.HTTP_200_OK
            )

        serializer = AccessRequestSerializer(access_requests, many=True)
        return Response({
            "message": "Consent requests retrieved successfully.",
            "count": access_requests.count(),
            "data": serializer.data
        }, status=status.HTTP_200_OK)


class ConsentRevocationView(APIView):
    def post(self, request, access_id):
        access_requests = get_object_or_404(AccessRequest, pk=access_id, user=request.user)
        if access_requests.status != 'APPROVED':
            access_requests.status = 'APPROVED'
            access_requests.save()
            access_requests_serializer = AccessRequestSerializer(access_requests)
            return Response({'message':'Consent Granted!'})
        
        else:
            access_requests.status = 'REVOKED'
            access_requests.save()
            access_requests_serializer = AccessRequestSerializer(access_requests)
            return Response({'message':'Consent Revoked!'})
