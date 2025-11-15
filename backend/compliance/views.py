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
    permission_classes = [IsAuthenticated, IsOrganization]
    DUPLICATE_WINDOW_DAYS = 30

    def post(self, request):
        try:
            organization = get_object_or_404(Org, user=request.user)
            scan_result = NDPRRulesEngine.run_all_checks(organization)
            audit_records = NDPRRulesEngine.create_audit_records(organization, scan_result)

            audit_serializer = ComplianceAuditSerializer(audit_records, many=True)
            violation_records = []
            for audit in audit_records:
                violation_records.extend(audit.violationreport_set.all())
            violation_serializer = ViolationReportSerializer(violation_records, many=True)

            result_data = {
                'risk_score': scan_result.get('risk_score', 0),
                'total_violations': scan_result.get('total_violations', len(violation_records)),
                'critical_count': scan_result.get('critical_count', 0),
                'high_count': scan_result.get('high_count', 0),
                'medium_count': scan_result.get('medium_count', 0),
                'audits': audit_serializer.data,
                'violations': violation_serializer.data,
            }

            serializer = ComplianceScanResultSerializer(result_data)
            return Response({'message': 'Compliance scan completed', 'data': serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        try:
            organization = get_object_or_404(Org, user=request.user)
            window_start = timezone.now() - timedelta(days=self.DUPLICATE_WINDOW_DAYS)
            audits = ComplianceAudit.objects.filter(organization=organization, detected_at__gte=window_start).order_by('-detected_at')
            violations = ViolationReport.objects.filter(organization=organization, detected_at__gte=window_start).order_by('-detected_at')

            pending_audits = audits.filter(status='PENDING')
            risk_score = NDPRRulesEngine.calculate_risk_score([{'rule': a.rule_name, 'details': a.details} for a in pending_audits])

            return Response({
                'risk_score': risk_score,
                'total_violations': pending_audits.count(),
                'critical_count': pending_audits.filter(severity='CRITICAL').count(),
                'high_count': pending_audits.filter(severity='HIGH').count(),
                'medium_count': pending_audits.filter(severity='MEDIUM').count(),
                'audits': ComplianceAuditSerializer(audits[:10], many=True).data,
                'violations': ViolationReportSerializer(violations[:10], many=True).data,
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ComplianceReportsView(APIView):
    """Get compliance reports for an organization"""
    permission_classes = [IsAuthenticated, IsOrganization]
    DUPLICATE_WINDOW_DAYS = 30

    def get(self, request, org_id=None):
        try:
            # Determine organization
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
                'organization': {'id': organization.id, 'name': organization.name},
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
        try:
            organization = get_object_or_404(Org, user=request.user)
            audit = get_object_or_404(ComplianceAudit, pk=audit_id, organization=organization)
            serializer = ComplianceAuditSerializer(audit)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': f'Failed to retrieve audit: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, audit_id):
        try:
            organization = get_object_or_404(Org, user=request.user)
            audit = get_object_or_404(ComplianceAudit, pk=audit_id, organization=organization)

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
