from .models import Org, AccessRequest
from rest_framework import serializers
from accounts.models import CustomUser


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Org
        fields = '__all__'


class AccessRequestSerializer(serializers.ModelSerializer):
    organization_name = serializers.SerializerMethodField()
    consent_name = serializers.SerializerMethodField()
    class Meta:
        model = AccessRequest
        fields = ['organization_name', 'consent_name', 'requested_at', 'purpose', 'status']

    def get_organization_name(self, obj):
        return obj.organization.name

    def get_consent_name(self, obj):
        return obj.consent.name
    
class CitizenListSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    access_requests = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'full_name', 'access_requests']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def get_access_requests(self, obj):
        request = self.context.get('request')
        organization = Org.objects.get(user=request.user)

        requests = AccessRequest.objects.filter(user=obj, organization=organization)

        result = []
        for r in requests:
            result.append({
                'consent': r.consent.name,
                'purpose': r.purpose,
                'status': r.status,
                'requested_at': r.requested_at
            })
        return result
