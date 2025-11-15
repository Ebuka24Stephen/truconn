"""
NDPR Compliance Rules Engine
Implements automated checks based on Nigeria Data Protection Regulation
Optimized for efficiency and idempotency
"""
from datetime import timedelta
from django.utils import timezone
from organization.models import AccessRequest, Org
from consents.models import UserConsent
from .models import ComplianceAudit, ViolationReport


class NDPRRulesEngine:
    """Engine for checking NDPR compliance rules"""

    # NDPR Rule Definitions
    RULES = {
        'CONSENT_VALIDITY': {
            'name': 'Consent Validity Check',
            'description': 'Ensures all data access has valid, explicit consent',
            'severity': 'HIGH',
        },
        'PURPOSE_LIMITATION': {
            'name': 'Purpose Limitation',
            'description': 'Data access must align with stated purpose',
            'severity': 'HIGH',
        },
        'DATA_MINIMIZATION': {
            'name': 'Data Minimization',
            'description': 'Organizations should only request necessary data',
            'severity': 'MEDIUM',
        },
        'RETENTION_POLICY': {
            'name': 'Data Retention Policy',
            'description': 'Data should not be retained beyond stated purpose',
            'severity': 'MEDIUM',
        },
        'ACCESS_CONTROL': {
            'name': 'Access Control',
            'description': 'Unauthorized access attempts detected',
            'severity': 'CRITICAL',
        },
        'AUDIT_TRAIL': {
            'name': 'Audit Trail Completeness',
            'description': 'All data access must be logged and auditable',
            'severity': 'HIGH',
        },
        'REVOCATION_HANDLING': {
            'name': 'Consent Revocation Handling',
            'description': 'Revoked consents must be respected immediately',
            'severity': 'CRITICAL',
        },
        'EXCESSIVE_REQUESTS': {
            'name': 'Excessive Data Requests',
            'description': 'Unusual pattern of data access requests detected',
            'severity': 'MEDIUM',
        },
    }

    # -------------------- Helper Methods --------------------

    @staticmethod
    def fetch_approved_requests(organization: Org):
        """Fetch all approved access requests once"""
        return AccessRequest.objects.filter(
            organization=organization,
            status='APPROVED'
        ).select_related('user', 'consent')

    @staticmethod
    def fetch_user_consents(user):
        """Fetch all user consents once"""
        return {uc.consent_id: uc for uc in UserConsent.objects.filter(user=user)}

    # -------------------- Rule Checks --------------------

    @classmethod
    def check_consent_validity(cls, organization: Org) -> list:
        """Check that all approved access requests have valid user consent"""
        violations = []
        approved_requests = cls.fetch_approved_requests(organization)

        for req in approved_requests:
            user_consents = cls.fetch_user_consents(req.user)
            uc = user_consents.get(req.consent_id)
            if not uc or not uc.access:
                violations.append({
                    'rule': 'CONSENT_VALIDITY',
                    'details': {
                        'access_request_id': req.id,
                        'user_id': req.user.id,
                        'consent_type': req.consent.name,
                        'issue': 'Access approved but user consent revoked',
                    },
                    'recommendation': f'Revoke access request #{req.id} as user has revoked consent for {req.consent.name}',
                })
        return violations

    @staticmethod
    def check_purpose_limitation(organization: Org) -> list:
        """Check that access purposes are clear and specific"""
        violations = []
        requests = AccessRequest.objects.filter(organization=organization)
        vague_purposes = ['general', 'testing', 'research', 'other', '']
        for req in requests:
            if req.purpose.lower() in vague_purposes or len(req.purpose.strip()) < 10:
                violations.append({
                    'rule': 'PURPOSE_LIMITATION',
                    'details': {
                        'access_request_id': req.id,
                        'purpose': req.purpose,
                        'issue': 'Purpose is too vague or insufficient',
                    },
                    'recommendation': 'Specify clear, specific purpose for data access (minimum 10 characters)',
                })
        return violations

    @staticmethod
    def check_data_minimization(organization: Org) -> list:
        """Check if organization requests excessive data types"""
        violations = []
        approved_requests = AccessRequest.objects.filter(
            organization=organization,
            status='APPROVED'
        )
        unique_users = approved_requests.values('user').distinct().count()
        consent_types = approved_requests.values('consent').distinct().count()
        avg_consents_per_user = consent_types / unique_users if unique_users else 0

        if avg_consents_per_user >= 3.5:
            violations.append({
                'rule': 'DATA_MINIMIZATION',
                'details': {
                    'unique_users': unique_users,
                    'consent_types_accessed': consent_types,
                    'avg_consents_per_user': round(avg_consents_per_user, 2),
                    'issue': 'Accessing multiple data types per user may violate data minimization',
                },
                'recommendation': 'Review if all requested data types are necessary for stated purpose',
            })
        return violations

    @staticmethod
    def check_retention_policy(organization: Org) -> list:
        """Check for old approved requests violating retention"""
        violations = []
        one_year_ago = timezone.now() - timedelta(days=365)
        old_approved = AccessRequest.objects.filter(
            organization=organization,
            status='APPROVED',
            requested_at__lt=one_year_ago
        )
        if old_approved.exists():
            violations.append({
                'rule': 'RETENTION_POLICY',
                'details': {
                    'old_requests_count': old_approved.count(),
                    'oldest_request_date': old_approved.order_by('requested_at').first().requested_at.date().isoformat(),
                    'issue': f'{old_approved.count()} approved access requests older than 1 year',
                },
                'recommendation': 'Review and archive data access older than retention period (1 year)',
            })
        return violations

    @staticmethod
    def check_access_control(organization: Org) -> list:
        """Check for patterns indicating unauthorized access"""
        violations = []
        revoked_after_approval = AccessRequest.objects.filter(
            organization=organization,
            status='REVOKED'
        )
        if revoked_after_approval.count() > 10:
            violations.append({
                'rule': 'ACCESS_CONTROL',
                'details': {
                    'revoked_count': revoked_after_approval.count(),
                    'issue': 'High number of revoked access requests may indicate access control issues',
                },
                'recommendation': 'Review access control policies and ensure revoked access is immediately enforced',
            })
        return violations

    @staticmethod
    def check_audit_trail(organization: Org) -> list:
        """Ensure all access requests are properly logged"""
        violations = []
        missing_purpose = AccessRequest.objects.filter(
            organization=organization,
            purpose__isnull=True
        ).count()
        if missing_purpose > 0:
            violations.append({
                'rule': 'AUDIT_TRAIL',
                'details': {
                    'missing_purpose_count': missing_purpose,
                    'issue': 'Some access requests lack purpose documentation',
                },
                'recommendation': 'Ensure all access requests have clear purpose documented',
            })
        return violations

    @classmethod
    def check_revocation_handling(cls, organization: Org) -> list:
        """Ensure revoked consents are enforced"""
        violations = []
        approved_requests = cls.fetch_approved_requests(organization)
        for req in approved_requests:
            user_consents = cls.fetch_user_consents(req.user)
            uc = user_consents.get(req.consent_id)
            if not uc or not uc.access:
                violations.append({
                    'rule': 'REVOCATION_HANDLING',
                    'details': {
                        'access_request_id': req.id,
                        'user_id': req.user.id,
                        'consent_type': req.consent.name,
                        'issue': 'Access approved but consent is missing or revoked',
                    },
                    'recommendation': f'IMMEDIATELY revoke access request #{req.id}',
                })
        return violations

    @staticmethod
    def check_excessive_requests(organization: Org) -> list:
        """Detect unusual access patterns"""
        violations = []
        thirty_days_ago = timezone.now() - timedelta(days=30)
        recent_requests = AccessRequest.objects.filter(
            organization=organization,
            requested_at__gte=thirty_days_ago
        )
        if recent_requests.count() > 100:
            violations.append({
                'rule': 'EXCESSIVE_REQUESTS',
                'details': {
                    'requests_count': recent_requests.count(),
                    'period_days': 30,
                    'issue': 'Unusually high number of data access requests',
                },
                'recommendation': 'Review if all requests are necessary and legitimate',
            })
        return violations

    # -------------------- Main Execution --------------------

    @classmethod
    def run_all_checks(cls, organization: Org) -> dict:
        """Run all rules and calculate overall risk"""
        all_violations = []
        all_violations.extend(cls.check_consent_validity(organization))
        all_violations.extend(cls.check_purpose_limitation(organization))
        all_violations.extend(cls.check_data_minimization(organization))
        all_violations.extend(cls.check_retention_policy(organization))
        all_violations.extend(cls.check_access_control(organization))
        all_violations.extend(cls.check_audit_trail(organization))
        all_violations.extend(cls.check_revocation_handling(organization))
        all_violations.extend(cls.check_excessive_requests(organization))

        return {
            'violations': all_violations,
            'risk_score': cls.calculate_risk_score(all_violations),
            'total_violations': len(all_violations),
            'critical_count': len([v for v in all_violations if cls.RULES.get(v['rule'], {}).get('severity') == 'CRITICAL']),
            'high_count': len([v for v in all_violations if cls.RULES.get(v['rule'], {}).get('severity') == 'HIGH']),
            'medium_count': len([v for v in all_violations if cls.RULES.get(v['rule'], {}).get('severity') == 'MEDIUM']),
        }

    @staticmethod
    def calculate_risk_score(violations: list) -> int:
        """Calculate NDPR risk score (0-100)"""
        score = 0
        for v in violations:
            severity = NDPRRulesEngine.RULES.get(v['rule'], {}).get('severity', 'MEDIUM')
            if severity == 'CRITICAL':
                score += 20
            elif severity == 'HIGH':
                score += 15
            elif severity == 'MEDIUM':
                score += 10
            else:
                score += 5
        return min(score, 100)

    @classmethod
    def create_audit_records(cls, organization: Org, scan_result: dict) -> list:
        """Create audits and violation reports idempotently"""
        audit_records = []
        for violation in scan_result.get('violations', []):
            rule_info = cls.RULES.get(violation['rule'], {})
            audit, _ = ComplianceAudit.objects.get_or_create(
                organization=organization,
                rule_name=rule_info.get('name', violation['rule']),
                defaults={
                    'rule_description': rule_info.get('description', ''),
                    'severity': rule_info.get('severity', 'MEDIUM'),
                    'details': violation.get('details', {}),
                    'recommendation': violation.get('recommendation', ''),
                    'status': 'PENDING',
                }
            )
            audit_records.append(audit)

            if rule_info.get('severity') in ['CRITICAL', 'HIGH']:
                ViolationReport.objects.get_or_create(
                    organization=organization,
                    violation_type=violation.get('rule', 'PRIVACY_BREACH'),
                    related_audit=audit,
                    defaults={
                        'description': violation.get('recommendation', rule_info.get('description', '')),
                        'affected_users_count': 1 if 'user_id' in violation.get('details', {}) else 0,
                        'reported_to_dpo': rule_info.get('severity') == 'CRITICAL',
                    }
                )
        return audit_records
