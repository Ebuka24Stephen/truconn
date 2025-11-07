from django.shortcuts import render, get_object_or_404
from .models import Consent, UserConsent
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import ConsentSerializer, UserConsentSerializer
from rest_framework import status


class ConsentApiView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        consent = Consent.objects.all()
        consent_serializer = ConsentSerializer(consent, many=True)
        return Response(consent_serializer.data, status=status.HTTP_200_OK)


class UserConsentView(APIView):
    def post(self, request, consent_id):
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
    
