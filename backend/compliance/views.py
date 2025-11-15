from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.utils import timezone
from datetime import timedelta

from organization.models import Org
from organization.permissions import IsOrganization
from .rules_engine import NDPRRulesEngine
from .models import ComplianceAudit, ViolationReport
from .serializers import (
    ComplianceAuditSerializer, 
    ViolationReportSerializer,
    ComplianceScanResultSerializer
)


class ComplianceScanView(APIView):
    """
    Run compliance scan for an organization and return results.
    Ensures idempotent creation of audits and violation reports
    (prevents duplicates within 30 days).
    """
    permission_classes = [IsAuthenticated, IsOrganization]
    DUPLICATE_WINDOW_DAYS = 30

    def post(self, request):
        """Run a full compliance scan"""
        try:
            organization = get_object_or_404(Org, user=request.user)
            window_start = timezone.now() - timedelta(days=self.DUPLICATE_WINDOW_DAYS)

            # 1️⃣ Run compliance checks
            scan_result = NDPRRulesEngine.run_all_checks(organization)

            # Prepare violation entries
            violations_data = []
            for v in scan_result.get('violations', []):
                violation_type = v.get('violation_type')
                if not violation_type:
                    continue
                violations_data.append({
                    "violation_type": violation_type,
                    "description": v.get('description', ''),
                    "affected_users_count": v.get('affected_users_count', 0)
                })

            # Prepare audit entries
            audits_data = []
            for a in scan_result.get('audits', []):
                rule_name = a.get('rule_name')
                if not rule_name:
                    continue
                audits_data.append({
                    "rule_name": rule_name,
                    "rule_description": a.get('rule_description', ''),
                    "severity": a.get('severity', 'MEDIUM'),
                    "details": a.get('details', {}),
                    "recommendation": a.get('recommendation', '')
                })

            # 2️⃣ Idempotent creation of ComplianceAudit
            audit_records = []
            for audit in audits_data:
                exists = ComplianceAudit.objects.filter(
                    organization=organization,
                    rule_name=audit['rule_name'],
                    detected_at__gte=window_start
                ).exists()

                if not exists:
                    audit_obj = ComplianceAudit.objects.create(
                        organization=organization,
                        rule_name=audit['rule_name'],
                        rule_description=audit['rule_description'],
                        severity=audit['severity'],
                        status='PENDING',
                        details=audit['details'],
                        recommendation=audit['recommendation']
                    )
                    audit_records.append(audit_obj)

            # 3️⃣ Idempotent creation of ViolationReport
            violation_records = []
            for violation in violations_data:
                exists = ViolationReport.objects.filter(
                    organization=organization,
                    violation_type=violation['violation_type'],
                    detected_at__gte=window_start
                ).exists()

                if not exists:
                    violation_obj = ViolationReport.objects.create(
                        organization=organization,
                        violation_type=violation['violation_type'],
                        description=violation['description'],
                        affected_users_count=violation['affected_users_count'],
                        related_audit=None
                    )
                    violation_records.append(violation_obj)

            # Serialize records
            audit_serializer = ComplianceAuditSerializer(audit_records, many=True)
            violation_serializer = ViolationReportSerializer(violation_records, many=True)

            result_data = {
                'risk_score': scan_result.get('risk_score', 0),
                'total_violations': scan_result.get('total_violations', len(violations_data)),
                'critical_count': scan_result.get('critical_count', 0),
                'high_count': scan_result.get('high_count', 0),
                'medium_count': scan_result.get('medium_count', 0),
                'violations': violation_serializer.data,
                'audit_records': audit_serializer.data
            }

            serializer = ComplianceScanResultSerializer(result_data)
            return Response({
                'message': 'Compliance scan completed successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Compliance scan failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        """Get latest compliance scan results"""
        try:
            organization = get_object_or_404(Org, user=request.user)
            window_start = timezone.now() - timedelta(days=self.DUPLICATE_WINDOW_DAYS)

            audits = ComplianceAudit.objects.filter(
                organization=organization,
                detected_at__gte=window_start
            ).order_by('-detected_at')

            violations = ViolationReport.objects.filter(
                organization=organization,
                detected_at__gte=window_start
            ).order_by('-detected_at')

            # Compute risk score from pending audits
            pending_audits = audits.filter(status='PENDING')
            risk_score = 0

            if pending_audits.exists():
                rule_name_to_key = {v['name']: k for k, v in NDPRRulesEngine.RULES.items()}
                risk_score = NDPRRulesEngine.calculate_risk_score([
                    {
                        'rule': rule_name_to_key.get(audit.rule_name, 'UNKNOWN'),
                        'details': audit.details
                    }
                    for audit in pending_audits
                ])

            # Severity counts
            critical_count = pending_audits.filter(severity='CRITICAL').count()
            high_count = pending_audits.filter(severity='HIGH').count()
            medium_count = pending_audits.filter(severity='MEDIUM').count()

            # ✅ FIXED: return full records AND correct violation count
            return Response({
                'risk_score': risk_score,
                'total_violations': violations.count(),
                'critical_count': critical_count,
                'high_count': high_count,
                'medium_count': medium_count,
                'audits': ComplianceAuditSerializer(audits, many=True).data,
                'violations': ViolationReportSerializer(violations, many=True).data,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Failed to retrieve compliance data: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class ComplianceReportsView(APIView):
    """Get compliance reports for an organization"""
    permission_classes = [IsAuthenticated, IsOrganization]
    DUPLICATE_WINDOW_DAYS = 30

    def get(self, request, org_id=None):
        """Retrieve compliance reports"""
        try:
            if org_id:
                organization = get_object_or_404(Org, pk=org_id)
                if organization.user != request.user and not request.user.is_staff:
                    return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
            else:
                organization = get_object_or_404(Org, user=request.user)

            window_start = timezone.now() - timedelta(days=self.DUPLICATE_WINDOW_DAYS)

            audits = ComplianceAudit.objects.filter(
                organization=organization,
                detected_at__gte=window_start
            ).order_by('-detected_at')

            violations = ViolationReport.objects.filter(
                organization=organization,
                detected_at__gte=window_start
            ).order_by('-detected_at')

            total_audits = audits.count()
            pending_audits = audits.filter(status='PENDING').count()
            resolved_audits = audits.filter(status='RESOLVED').count()
            unresolved_violations = violations.filter(resolved=False).count()

            return Response({
                'organization': {
                    'id': organization.id,
                    'name': organization.name,
                },
                'statistics': {
                    'total_audits': total_audits,
                    'pending_audits': pending_audits,
                    'resolved_audits': resolved_audits,
                    'unresolved_violations': unresolved_violations,
                },
                'audits': ComplianceAuditSerializer(audits, many=True).data,
                'violations': ViolationReportSerializer(violations, many=True).data,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Failed to retrieve compliance reports: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class ComplianceAuditDetailView(APIView):
    """Manage individual compliance audit records"""
    permission_classes = [IsAuthenticated, IsOrganization]

    def get(self, request, audit_id):
        """Get audit details"""
        try:
            organization = get_object_or_404(Org, user=request.user)
            audit = get_object_or_404(
                ComplianceAudit,
                pk=audit_id,
                organization=organization
            )

            serializer = ComplianceAuditSerializer(audit)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Failed to retrieve audit: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, audit_id):
        """Update audit status"""
        try:
            organization = get_object_or_404(Org, user=request.user)
            audit = get_object_or_404(
                ComplianceAudit,
                pk=audit_id,
                organization=organization
            )

            new_status = request.data.get('status')
            if new_status in dict(ComplianceAudit.STATUS_CHOICES):
                audit.status = new_status
                if new_status == 'RESOLVED':
                    audit.resolved_at = timezone.now()
                audit.save()

            serializer = ComplianceAuditSerializer(audit)
            return Response({
                'message': 'Audit updated successfully',
                'data': serializer.data
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Failed to update audit: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
