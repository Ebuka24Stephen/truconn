from rest_framework.permissions import BasePermission
from .models import Org

class IsOrganization(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_role == 'ORGANIZATION'
class IsCitizen(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_role == "CITIZEN"