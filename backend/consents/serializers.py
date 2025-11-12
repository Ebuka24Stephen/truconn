from .models import Consent, UserConsent, ConsentHistory
from rest_framework import serializers


class ConsentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consent 
        fields = ['id', 'name', 'created_at']

class UserConsentSerializer(serializers.ModelSerializer):
    consent_name = serializers.CharField(source='consent.name', read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    days_until_expiry = serializers.IntegerField(read_only=True, allow_null=True)
    
    class Meta:
        model = UserConsent
        fields = [
            'id', 'user', 'consent', 'consent_name', 'access',
            'granted_at', 'revoked_at', 'expires_at', 'duration_days',
            'is_expired', 'days_until_expiry'
        ]
        read_only_fields = ['granted_at', 'revoked_at']


class ConsentHistorySerializer(serializers.ModelSerializer):
    consent_type = serializers.CharField(source='user_consent.consent.name', read_only=True)
    user_email = serializers.CharField(source='user_consent.user.email', read_only=True)
    
    class Meta:
        model = ConsentHistory
        fields = [
            'id', 'user_consent', 'consent_type', 'user_email',
            'action', 'changed_at', 'changed_by', 'previous_value',
            'new_value', 'reason', 'metadata'
        ]
        read_only_fields = ['changed_at']