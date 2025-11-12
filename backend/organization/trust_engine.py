"""
Trust Score Calculation Engine for Organizations
Calculates trust scores based on compliance, data handling, and user feedback
"""
from django.utils import timezone
from datetime import timedelta
from .models import Org, AccessRequest
from compliance.models import ComplianceAudit, ViolationReport
from consents.models import UserConsent


class TrustScoreEngine:
    """Engine for calculating organization trust scores"""
    
    # Trust score components and weights
    COMPONENT_WEIGHTS = {
        'compliance': 0.40,      # 40% - NDPR compliance score
        'data_integrity': 0.25,  # 25% - Data integrity checks
        'consent_respect': 0.20,  # 20% - How well consent is respected
        'transparency': 0.10,    # 10% - Transparency in data access
        'user_satisfaction': 0.05, # 5% - User feedback (future)
    }
    
    # Trust level thresholds
    TRUST_LEVELS = {
        'EXCELLENT': (90, 100),   # 90-100
        'VERIFIED': (75, 89),     # 75-89
        'GOOD': (60, 74),         # 60-74
        'BASIC': (40, 59),        # 40-59
        'LOW': (0, 39),           # 0-39
    }
    
    @classmethod
    def calculate_compliance_score(cls, organization: Org) -> float:
        """Calculate compliance component (0-100)"""
        from compliance.rules_engine import NDPRRulesEngine
        
        # Run compliance checks
        scan_result = NDPRRulesEngine.run_all_checks(organization)
        risk_score = scan_result.get('risk_score', 100)
        
        # Convert risk score (0-100, higher = worse) to trust score (0-100, higher = better)
        compliance_score = max(0, 100 - risk_score)
        
        return compliance_score
    
    @classmethod
    def calculate_data_integrity_score(cls, organization: Org) -> float:
        """Calculate data integrity component (0-100)"""
        # Check for data integrity violations
        # This will be enhanced with checksum verification
        access_requests = AccessRequest.objects.filter(organization=organization)
        
        if not access_requests.exists():
            return 100  # No data access = perfect integrity
        
        # Check for missing integrity checks
        total_requests = access_requests.count()
        # For now, assume all have integrity (will be enhanced with checksums)
        integrity_score = 100
        
        # Deduct points for violations
        violations = ViolationReport.objects.filter(
            organization=organization,
            violation_type__in=['PRIVACY_BREACH', 'AUDIT_FAILURE'],
            resolved=False
        ).count()
        
        if violations > 0:
            integrity_score = max(0, 100 - (violations * 10))
        
        return integrity_score
    
    @classmethod
    def calculate_consent_respect_score(cls, organization: Org) -> float:
        """Calculate how well organization respects user consent (0-100)"""
        access_requests = AccessRequest.objects.filter(organization=organization)
        
        if not access_requests.exists():
            return 100
        
        total_requests = access_requests.count()
        approved_requests = access_requests.filter(status='APPROVED')
        
        # Check how many approved requests have valid consent
        valid_consent_count = 0
        for request in approved_requests:
            user_consent = UserConsent.objects.filter(
                user=request.user,
                consent=request.consent,
                access=True
            ).first()
            if user_consent:
                valid_consent_count += 1
        
        if total_requests == 0:
            return 100
        
        # Calculate percentage of requests with valid consent
        consent_respect_score = (valid_consent_count / total_requests) * 100
        
        # Penalize revoked access that was previously approved
        revoked_after_approval = access_requests.filter(status='REVOKED').count()
        if revoked_after_approval > 0:
            penalty = min(20, (revoked_after_approval / total_requests) * 100)
            consent_respect_score = max(0, consent_respect_score - penalty)
        
        return consent_respect_score
    
    @classmethod
    def calculate_transparency_score(cls, organization: Org) -> float:
        """Calculate transparency component (0-100)"""
        access_requests = AccessRequest.objects.filter(organization=organization)
        
        if not access_requests.exists():
            return 100
        
        total = access_requests.count()
        
        # Check for requests with clear purposes
        clear_purposes = access_requests.exclude(
            purpose__isnull=True
        ).exclude(
            purpose=''
        ).exclude(
            purpose__in=['general', 'testing', 'other']
        ).filter(
            purpose__length__gte=10
        ).count()
        
        # Check for recent activity (shows active transparency)
        thirty_days_ago = timezone.now() - timedelta(days=30)
        recent_activity = access_requests.filter(
            requested_at__gte=thirty_days_ago
        ).count()
        
        # Calculate transparency score
        purpose_score = (clear_purposes / total) * 70 if total > 0 else 0
        activity_score = min(30, (recent_activity / max(1, total)) * 30)
        
        transparency_score = purpose_score + activity_score
        
        return min(100, transparency_score)
    
    @classmethod
    def calculate_user_satisfaction_score(cls, organization: Org) -> float:
        """Calculate user satisfaction component (0-100) - placeholder for future"""
        # This will be implemented with user feedback/ratings
        # For now, return a default score
        return 85.0
    
    @classmethod
    def calculate_trust_score(cls, organization: Org) -> dict:
        """Calculate overall trust score for an organization"""
        # Calculate each component
        compliance_score = cls.calculate_compliance_score(organization)
        integrity_score = cls.calculate_data_integrity_score(organization)
        consent_score = cls.calculate_consent_respect_score(organization)
        transparency_score = cls.calculate_transparency_score(organization)
        satisfaction_score = cls.calculate_user_satisfaction_score(organization)
        
        # Calculate weighted average
        weights = cls.COMPONENT_WEIGHTS
        overall_score = (
            compliance_score * weights['compliance'] +
            integrity_score * weights['data_integrity'] +
            consent_score * weights['consent_respect'] +
            transparency_score * weights['transparency'] +
            satisfaction_score * weights['user_satisfaction']
        )
        
        # Round to 2 decimal places
        overall_score = round(overall_score, 2)
        
        # Determine trust level
        trust_level = cls.get_trust_level(overall_score)
        
        return {
            'overall_score': overall_score,
            'trust_level': trust_level,
            'components': {
                'compliance': round(compliance_score, 2),
                'data_integrity': round(integrity_score, 2),
                'consent_respect': round(consent_score, 2),
                'transparency': round(transparency_score, 2),
                'user_satisfaction': round(satisfaction_score, 2),
            },
            'last_calculated': timezone.now().isoformat(),
        }
    
    @classmethod
    def get_trust_level(cls, score: float) -> str:
        """Get trust level based on score"""
        for level, (min_score, max_score) in cls.TRUST_LEVELS.items():
            if min_score <= score <= max_score:
                return level
        return 'LOW'
    
    @classmethod
    def get_organization_ranking(cls, limit: int = 10) -> list:
        """Get ranked list of organizations by trust score"""
        organizations = Org.objects.all()
        rankings = []
        
        for org in organizations:
            trust_data = cls.calculate_trust_score(org)
            rankings.append({
                'organization': {
                    'id': org.id,
                    'name': org.name,
                    'email': org.email,
                },
                'trust_score': trust_data['overall_score'],
                'trust_level': trust_data['trust_level'],
            })
        
        # Sort by trust score (descending)
        rankings.sort(key=lambda x: x['trust_score'], reverse=True)
        
        return rankings[:limit]

