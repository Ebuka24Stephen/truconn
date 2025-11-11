from django.shortcuts import render, get_object_or_404
from .models import Consent, UserConsent
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import ConsentSerializer, UserConsentSerializer
from rest_framework import status
from organization.models import AccessRequest
from organization.serializers import AccessRequestSerializer

class ConsentApiView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        consent = Consent.objects.all()
        consent_serializer = ConsentSerializer(consent, many=True)
        return Response(consent_serializer.data, status=status.HTTP_200_OK)


class UserConsentView(APIView):
    permission_classes = []
    def post(self, request, consent_id):
        if not request.user.is_authenticated:
            return Response({"error": "Please log in to manage consents"}, status=status.HTTP_401_UNAUTHORIZED)
        consent = get_object_or_404(Consent, pk=consent_id)
        user_consent, created = UserConsent.objects.get_or_create(
            consent=consent,
            user=request.user,
            defaults={'access': True}

        )
        if not created:
            user_consent.access = not user_consent.access
            user_consent.save()
        return Response({
            'consent': consent.name,
            'access': user_consent.access
        }, status=status.HTTP_200_OK)
    


class CitizenTransparencyLog(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        access_requests = AccessRequest.objects.filter(user=request.user)

        if not access_requests.exists():
            return Response(
                {"message": "No consent requests found for this user."},
                status=status.HTTP_200_OK
            )

        serializer = AccessRequestSerializer(access_requests, many=True)
        return Response({
            "data": serializer.data
        }, status=status.HTTP_200_OK)