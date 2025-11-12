"""
Views for transparency reports
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .reports import TransparencyReportGenerator


class PublicTransparencyReportView(APIView):
    """Public transparency report (no authentication required)"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        """Get public transparency report"""
        try:
            year = request.query_params.get('year', None)
            month = request.query_params.get('month', None)
            
            if year:
                year = int(year)
            if month:
                month = int(month)
            
            report = TransparencyReportGenerator.generate_public_summary()
            
            return Response(report, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': f'Failed to generate report: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

