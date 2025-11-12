from django.urls import path 
from .views import ConsentRequestView, RequestedConsentView, ConsentRevocationView, OrganizationAccessLog
from .trust_views import TrustRegistryView, OrganizationTrustScoreView, OrganizationTrustScoreDetailView, DataIntegrityView
from .report_views import PublicTransparencyReportView

urlpatterns = [
    path('consent/<uuid:user_id>/<int:consent_id>/request/', ConsentRequestView.as_view()),
    path('requested-consent/', RequestedConsentView.as_view()),
    path('consent/<int:access_id>/toggle-access/', ConsentRevocationView.as_view()),
    path('citizens/list/', OrganizationAccessLog.as_view()),
    # Trust Registry API endpoints
    path('trust/registry/', TrustRegistryView.as_view(), name='trust-registry'),
    path('trust/score/', OrganizationTrustScoreDetailView.as_view(), name='organization-trust-score'),
    path('trust/score/<int:org_id>/', OrganizationTrustScoreView.as_view(), name='organization-trust-score-detail'),
    path('trust/integrity/', DataIntegrityView.as_view(), name='data-integrity'),
    # Transparency Reports
    path('reports/transparency/', PublicTransparencyReportView.as_view(), name='transparency-report'),
]




