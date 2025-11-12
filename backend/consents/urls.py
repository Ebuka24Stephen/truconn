from django.urls import path 
from .views import ConsentApiView, UserConsentView, CitizenTransparencyLog, UserConsentsStatusView, ConsentHistoryView, ConsentExpiryView


urlpatterns = [
    path('consents/', ConsentApiView.as_view()),
    path('consents/status/', UserConsentsStatusView.as_view()),
    path('consents/<int:consent_id>/toggle/', UserConsentView.as_view()),
    path('consents/transparency-log/', CitizenTransparencyLog.as_view()),
    path('consents/history/', ConsentHistoryView.as_view()),
    path('consents/history/<int:consent_id>/', ConsentHistoryView.as_view()),
    path('consents/expiry/', ConsentExpiryView.as_view()),
]