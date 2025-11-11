from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CustomUser, Profile
from .serializers import LoginSerializer, RegisterSerializer, ProfileSerializer
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token

class SignUpView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            profile, created = Profile.objects.get_or_create(user=user)
            profile_serializer = ProfileSerializer(profile)
            return Response({
                "user": serializer.data,
                "profile": profile_serializer.data,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            if user is not None:
                login(request, user)
                csrf_token = get_token(request)
                # Issue JWT tokens for API clients
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)

                return Response({
                    "user": {
                        "id": user.id,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                        "role": user.user_role
                    },
                    "csrfToken": csrf_token,
                    "access": access_token,
                    "refresh": str(refresh)

                }, status=status.HTTP_200_OK)
            return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ProfileView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        profile = get_object_or_404(Profile.objects.select_related('user'), user=request.user)
        profile_serializer = ProfileSerializer(profile)
        return Response(profile_serializer.data, status=status.HTTP_200_OK)
 
    def put(self, request):
        profile = get_object_or_404(Profile.objects.select_related('user'), user=request.user)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@method_decorator(ensure_csrf_cookie, name='dispatch')
class CsrfTokenView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        # The ensure_csrf_cookie decorator above ensures the csrftoken cookie is set
        return Response({"detail": "CSRF cookie set"}, status=status.HTTP_200_OK)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"detail": "Logged out"}, status=status.HTTP_200_OK)

