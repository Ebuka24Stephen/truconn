"""
Community transparency reports generation
Monthly public-facing reports on platform metrics
"""
from django.db.models import Count, Q, Avg
from django.utils import timezone
from datetime import timedelta
from .models import Org, AccessRequest
from consents.models import UserConsent, ConsentHistory
from compliance.models import ComplianceAudit, ViolationReport
from accounts.models import CustomUser


class TransparencyReportGenerator:
    """Generate community transparency reports"""
    
    @staticmethod
    def generate_monthly_report(year=None, month=None):
        """Generate monthly transparency report"""
        if not year or not month:
            now = timezone.now()
            year = now.year
            month = now.month
        
        start_date = timezone.datetime(year, month, 1, tzinfo=timezone.get_current_timezone())
        if month == 12:
            end_date = timezone.datetime(year + 1, 1, 1, tzinfo=timezone.get_current_timezone())
        else:
            end_date = timezone.datetime(year, month + 1, 1, tzinfo=timezone.get_current_timezone())
        
        # Total users
        total_users = CustomUser.objects.filter(user_role='CITIZEN').count()
        new_users = CustomUser.objects.filter(
            user_role='CITIZEN',
            date_joined__gte=start_date,
            date_joined__lt=end_date
        ).count()
        
        # Total organizations
        total_orgs = Org.objects.count()
        new_orgs = Org.objects.filter(
            created_at__gte=start_date,
            created_at__lt=end_date
        ).count()
        
        # Consent statistics
        total_consents = UserConsent.objects.count()
        active_consents = UserConsent.objects.filter(access=True).count()
        revoked_consents = UserConsent.objects.filter(access=False).count()
        
        consent_changes = ConsentHistory.objects.filter(
            changed_at__gte=start_date,
            changed_at__lt=end_date
        ).count()
        
        # Access requests
        total_requests = AccessRequest.objects.count()
        requests_this_month = AccessRequest.objects.filter(
            requested_at__gte=start_date,
            requested_at__lt=end_date
        ).count()
        
        approved_requests = AccessRequest.objects.filter(status='APPROVED').count()
        revoked_requests = AccessRequest.objects.filter(status='REVOKED').count()
        
        # Compliance statistics
        total_audits = ComplianceAudit.objects.count()
        audits_this_month = ComplianceAudit.objects.filter(
            created_at__gte=start_date,
            created_at__lt=end_date
        ).count()
        
        critical_violations = ComplianceAudit.objects.filter(
            severity='CRITICAL',
            status='OPEN'
        ).count()
        
        resolved_violations = ComplianceAudit.objects.filter(
            status='RESOLVED',
            resolved_at__gte=start_date,
            resolved_at__lt=end_date
        ).count()
        
        # Trust scores
        orgs_with_scores = Org.objects.exclude(trust_score=0.0)
        avg_trust_score = orgs_with_scores.aggregate(Avg('trust_score'))['trust_score__avg'] or 0
        
        trust_level_distribution = Org.objects.values('trust_level').annotate(
            count=Count('id')
        )
        
        # Top organizations by trust score
        top_orgs = Org.objects.exclude(trust_score=0.0).order_by('-trust_score')[:10]
        
        return {
            'period': {
                'year': year,
                'month': month,
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat(),
            },
            'users': {
                'total': total_users,
                'new_this_month': new_users,
            },
            'organizations': {
                'total': total_orgs,
                'new_this_month': new_orgs,
            },
            'consents': {
                'total': total_consents,
                'active': active_consents,
                'revoked': revoked_consents,
                'changes_this_month': consent_changes,
            },
            'access_requests': {
                'total': total_requests,
                'this_month': requests_this_month,
                'approved': approved_requests,
                'revoked': revoked_requests,
            },
            'compliance': {
                'total_audits': total_audits,
                'audits_this_month': audits_this_month,
                'critical_violations_open': critical_violations,
                'violations_resolved_this_month': resolved_violations,
            },
            'trust': {
                'average_trust_score': round(avg_trust_score, 2),
                'trust_level_distribution': list(trust_level_distribution),
                'top_organizations': [{
                    'id': org.id,
                    'name': org.name,
                    'trust_score': org.trust_score,
                    'trust_level': org.trust_level,
                } for org in top_orgs],
            },
            'generated_at': timezone.now().isoformat(),
        }
    
    @staticmethod
    def generate_public_summary():
        """Generate public summary (no sensitive data)"""
        report = TransparencyReportGenerator.generate_monthly_report()
        
        # Remove sensitive information
        public_report = {
            'period': report['period'],
            'users': {
                'total': report['users']['total'],
                'new_this_month': report['users']['new_this_month'],
            },
            'organizations': {
                'total': report['organizations']['total'],
                'new_this_month': report['organizations']['new_this_month'],
            },
            'consents': {
                'total': report['consents']['total'],
                'active': report['consents']['active'],
                'changes_this_month': report['consents']['changes_this_month'],
            },
            'access_requests': {
                'this_month': report['access_requests']['this_month'],
            },
            'compliance': {
                'audits_this_month': report['compliance']['audits_this_month'],
                'violations_resolved_this_month': report['compliance']['violations_resolved_this_month'],
            },
            'trust': {
                'average_trust_score': report['trust']['average_trust_score'],
                'trust_level_distribution': report['trust']['trust_level_distribution'],
                'top_organizations': report['trust']['top_organizations'],
            },
            'generated_at': report['generated_at'],
        }
        
        return public_report

