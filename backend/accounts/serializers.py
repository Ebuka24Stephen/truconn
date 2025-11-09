from rest_framework import serializers
from .models import Profile, CustomUser
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from organization.models import Org


class RegisterSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    user_role = serializers.ChoiceField(choices=CustomUser.USER_ROLE_CHOICES)

    # Organization fields (optional for citizens)
    name = serializers.CharField(required=False)
    website = serializers.CharField(required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = CustomUser
        fields = [
            'first_name', 'last_name', 'email', 'password1', 'password2',
            'user_role', 'name', 'website', 'address'
        ]

    def validate(self, attrs):
        if attrs['password1'] != attrs['password2']:
            raise serializers.ValidationError('Passwords do not match!')
        validate_password(attrs['password1'])

        if attrs['user_role'] == 'CITIZEN':
            if not attrs.get('first_name') or not attrs.get('last_name'):
                raise serializers.ValidationError('First name and last name are required for citizens.')
        elif attrs['user_role'] == 'ORGANIZATION':
            if not attrs.get('name'):
                raise serializers.ValidationError('Organization name is required.')

        return attrs

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError('Email already in use')
        return value

    def create(self, validated_data):
        password = validated_data.pop('password1')
        validated_data.pop('password2')
        user_role = validated_data.pop('user_role')

        if user_role == 'CITIZEN':
            user = CustomUser.objects.create(
                email=validated_data['email'],
                first_name=validated_data.get('first_name'),
                last_name=validated_data.get('last_name'),
                user_role='CITIZEN'
            )
        else:
            user = CustomUser.objects.create(
                email=validated_data['email'],
                user_role='ORGANIZATION'
            )
            Org.objects.create(
                user=user,
                name=validated_data.get('name'),
                website=validated_data.get('website', ''),
                address=validated_data.get('address', ''),
                email=validated_data['email']
            )

        user.set_password(password)
        user.save()
        return user
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        user = authenticate(username=email, password=password)
        if not user:
            raise serializers.ValidationError('Invalid email or password')
        if not user.is_active:
            raise serializers.ValidationError('User account is disabled')

        attrs['user'] = user
        return attrs
    

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'