from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from django.db import transaction

from .models import Profile, CustomUser, OrgProfile
from organization.models import Org


class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    email = serializers.EmailField(required=True)
    user_role = serializers.ChoiceField(choices=CustomUser.USER_ROLE_CHOICES, required=True)

    password1 = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    name = serializers.CharField(required=False, allow_blank=True)
    website = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        value = value.lower().strip()
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already in use")
        return value

    def validate(self, attrs):
        if attrs["password1"] != attrs["password2"]:
            raise serializers.ValidationError({"password2": "Passwords do not match!"})

        validate_password(attrs["password1"])

        role = attrs.get("user_role")

        if role == "CITIZEN":
            if not (attrs.get("first_name") or "").strip():
                raise serializers.ValidationError({"first_name": "First name is required for citizens."})
            if not (attrs.get("last_name") or "").strip():
                raise serializers.ValidationError({"last_name": "Last name is required for citizens."})

        elif role == "ORGANIZATION":
            if not (attrs.get("name") or "").strip():
                raise serializers.ValidationError({"name": "Organization name is required."})
            
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        email = validated_data["email"].lower().strip()
        role = validated_data["user_role"]

        password = validated_data.pop("password1")
        validated_data.pop("password2", None)

        first_name = (validated_data.get("first_name") or "").strip()
        last_name = (validated_data.get("last_name") or "").strip()

        org_name = (validated_data.get("name") or "").strip()
        org_website = (validated_data.get("website") or "").strip()
        org_address = (validated_data.get("address") or "").strip()

        if role == "CITIZEN":
            user = CustomUser.objects.create_user(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                user_role="CITIZEN",
            )
            # Profile.objects.get_or_create(user=user)

            return user

        # ORGANIZATION
        user = CustomUser.objects.create_user(
            email=email,
            password=password,
            user_role="ORGANIZATION",
        )

        Org.objects.create(
            user=user,
            name=org_name,
            website=org_website,
            address=org_address,
            email=email,
        )

        OrgProfile.objects.create(
            user=user,
            name=org_name,
            email=email,
            website=org_website,
            address=org_address,
        )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, attrs):
        email = (attrs.get("email") or "").lower().strip()
        password = attrs.get("password")

        user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password")
        if not user.is_active:
            raise serializers.ValidationError("User account is disabled")

        attrs["user"] = user
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = "__all__"


class OrgProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrgProfile
        fields = "__all__"
        read_only_fields = ["user", "created_at", "updated_at"]
