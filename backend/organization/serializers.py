from .models import Org, AccessRequest
from rest_framework import serializers



class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Org
        fields = '__all__'


class AccessRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessRequest
        fields = '__all__'