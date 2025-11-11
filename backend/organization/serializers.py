from .models import Org, AccessRequest
from rest_framework import serializers
from accounts.models import CustomUser


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Org
        fields = '__all__'

class AccessRequestSerializer(serializers.ModelSerializer):
    organizationName = serializers.SerializerMethodField()
    organizationId = serializers.SerializerMethodField()
    dataType = serializers.SerializerMethodField()
    consentId = serializers.SerializerMethodField()
    lastAccessed = serializers.SerializerMethodField()

    class Meta:
        model = AccessRequest
        fields = [
            'id',
            'organizationId',
            'organizationName',
            'dataType',
            'lastAccessed',
            'purpose',
            'status',
            'consentId',
        ]

    def get_organizationName(self, obj):
        return obj.organization.name

    def get_organizationId(self, obj):
        return obj.organization.id

    def get_dataType(self, obj):
        return obj.consent.name

    def get_consentId(self, obj):
        return obj.consent.id

    def get_lastAccessed(self, obj):
        # You can map this to requested_at or actual last access
        return obj.requested_at


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
