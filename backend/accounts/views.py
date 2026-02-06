from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import CustomUser, Profile, OrgProfile
from .serializers import LoginSerializer, RegisterSerializer, ProfileSerializer, OrgProfileSerializer
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

            # Choose profile based on user role
            if user.user_role == "CITIZEN":
                    profile_instance, _ = Profile.objects.get_or_create(user=user)
                    profile_data = ProfileSerializer(profile_instance).data
            else:
                profile_instance, _ = OrgProfile.objects.get_or_create(user=user)
                profile_data = OrgProfileSerializer(profile_instance).data

            return Response({
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "role": user.user_role
                },
                "profile": profile_data,
                
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            if user is not None:
                
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
                    "access": access_token,
                    "refresh": str(refresh)

                }, status=status.HTTP_200_OK)
            return Response({"error": "Invalid email or password."}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.user_role == "CITIZEN":
            # Safely get or create the profile
            profile_instance, _ = Profile.objects.get_or_create(user=user)
            serializer = ProfileSerializer(profile_instance)
        else:  # Organization
            profile_instance, _ = OrgProfile.objects.get_or_create(user=user)
            serializer = OrgProfileSerializer(profile_instance)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request):
        user = request.user

        if user.user_role == "CITIZEN":
            profile_instance, _ = Profile.objects.get_or_create(user=user)
            serializer = ProfileSerializer(profile_instance, data=request.data, partial=True)
        else:  # Organization
            profile_instance, _ = OrgProfile.objects.get_or_create(user=user)
            serializer = OrgProfileSerializer(profile_instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"detail": "Logged out"}, status=status.HTTP_200_OK)
    






