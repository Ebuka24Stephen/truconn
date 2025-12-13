from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from .models import Profile, CustomUser, OrgProfile
from organization.models import Org
from django.db import transaction
class RegisterSerializer(serializers.Serializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    user_role = serializers.ChoiceField(choices=CustomUser.USER_ROLE_CHOICES)

    # Organization fields
    name = serializers.CharField(required=False)
    website = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)

    

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError("Passwords do not match!")
        validate_password(attrs['password1'])

        if attrs['user_role'] == 'CITIZEN':
            if not attrs.get('first_name') or not attrs.get('last_name'):
                raise serializers.ValidationError("First name and last name are required for citizens.")
        elif attrs['user_role'] == 'ORGANIZATION':
            if not attrs.get('name'):
                raise serializers.ValidationError("Organization name is required.")

        return attrs

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already in use")
        return value
    @transaction.atomic()
    def create(self, validated_data):
        password = validated_data.pop('password1')
        validated_data.pop('password2')
        user_role = validated_data.pop('user_role')

        if user_role == 'CITIZEN':
            # Use create_user to handle password hashing
            user = CustomUser.objects.create_user(
                email=validated_data['email'],
                password=password,
                first_name=validated_data.get('first_name'),
                last_name=validated_data.get('last_name'),
                user_role='CITIZEN'
            )
            # Create citizen profile
            Profile.objects.create(user=user)

        else:
            # Organization user
            user = CustomUser.objects.create_user(
                email=validated_data['email'],
                password=password,
                user_role='ORGANIZATION'
            )

            Org.objects.create(
                user=user,
                name=validated_data.get('name'),
                website=validated_data.get('website', ''),
                address=validated_data.get('address', ''),
                email=validated_data.get('email')
            )

            OrgProfile.objects.create(
                user=user,
                name=validated_data.get('name'),
                email=validated_data.get('email'),
                website=validated_data.get('website', ''),
                address=validated_data.get('address', '')
            )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs.get('email'), password=attrs.get('password'))
        if not user:
            raise serializers.ValidationError("Invalid email or password")
        if not user.is_active:
            raise serializers.ValidationError("User account is disabled")
        attrs['user'] = user
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class OrgProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrgProfile
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
