from django.urls import path 
from .views import ConsentRequestView, RequestedConsentView, ConsentRevocationView

urlpatterns = [
    path('consent/<uuid:user_id>/<int:consent_id>/request/', ConsentRequestView.as_view()),
    path('requested-consent/', RequestedConsentView.as_view()),
    path('consent/<int:access_id>/toggle-access/', ConsentRevocationView.as_view())
]




