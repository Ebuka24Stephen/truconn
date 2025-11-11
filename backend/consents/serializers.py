from .models import Consent, UserConsent
from rest_framework import serializers


class ConsentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consent 
        fields = ['id', 'name', 'created_at']

class UserConsentSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserConsent
        fields = '__all__'