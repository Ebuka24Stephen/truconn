from django.urls import path 
from .views import ConsentRequestView, RequestedConsentView

urlpatterns = [
    path('consent/<uuid:user_id>/<int:consent_id>/request/', ConsentRequestView.as_view()),
    path('requested-consent/', RequestedConsentView.as_view())
]