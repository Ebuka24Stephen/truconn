"""
Data Integrity Verification System
Implements checksum verification and cryptographic integrity validation
"""
import hashlib
import json
from datetime import datetime
from django.utils import timezone
from .models import AccessRequest, Org, IntegrityRecord


class DataIntegrityChecker:
    """Checks data integrity using checksums and cryptographic validation"""
    
    @staticmethod
    def generate_checksum(data: dict) -> str:
        """Generate SHA-256 checksum for data"""
        # Convert dict to sorted JSON string for consistent hashing
        data_str = json.dumps(data, sort_keys=True, default=str)
        return hashlib.sha256(data_str.encode('utf-8')).hexdigest()
    
    @staticmethod
    def verify_checksum(data: dict, expected_checksum: str) -> bool:
        """Verify data integrity by comparing checksums"""
        actual_checksum = DataIntegrityChecker.generate_checksum(data)
        return actual_checksum == expected_checksum
    
    @staticmethod
    def create_access_request_integrity(access_request: AccessRequest) -> dict:
        """Create integrity record for an access request"""
        # Create data snapshot
        data_snapshot = {
            'id': str(access_request.id),
            'organization_id': access_request.organization.id,
            'organization_name': access_request.organization.name,
            'user_id': str(access_request.user.id),
            'user_email': access_request.user.email,
            'consent_id': access_request.consent.id,
            'consent_name': access_request.consent.name,
            'status': access_request.status,
            'purpose': access_request.purpose,
            'requested_at': access_request.requested_at.isoformat(),
        }
        
        # Generate checksum
        checksum = DataIntegrityChecker.generate_checksum(data_snapshot)
        
        return {
            'data_snapshot': data_snapshot,
            'checksum': checksum,
            'timestamp': timezone.now().isoformat(),
        }
    
    @staticmethod
    def verify_access_request_integrity(access_request: AccessRequest, stored_checksum: str) -> dict:
        """Verify integrity of an access request"""
        integrity_record = DataIntegrityChecker.create_access_request_integrity(access_request)
        is_valid = integrity_record['checksum'] == stored_checksum
        
        return {
            'is_valid': is_valid,
            'current_checksum': integrity_record['checksum'],
            'stored_checksum': stored_checksum,
            'verified_at': timezone.now().isoformat(),
        }
    
    @classmethod
    def verify_organization_data_integrity(cls, organization: Org) -> dict:
        """Verify integrity of all data for an organization"""
        access_requests = AccessRequest.objects.filter(organization=organization)
        
        total_requests = access_requests.count()
        verified_count = 0
        integrity_issues = []
        
        for request in access_requests:
            # For now, we'll verify based on data consistency
            # In production, checksums would be stored when requests are created
            try:
                # Check if request data is consistent
                if (request.organization and 
                    request.user and 
                    request.consent and 
                    request.purpose):
                    verified_count += 1
                else:
                    integrity_issues.append({
                        'request_id': request.id,
                        'issue': 'Missing required fields',
                    })
            except Exception as e:
                integrity_issues.append({
                    'request_id': request.id,
                    'issue': f'Verification error: {str(e)}',
                })
        
        integrity_score = (verified_count / total_requests * 100) if total_requests > 0 else 100
        
        return {
            'organization_id': organization.id,
            'organization_name': organization.name,
            'total_requests': total_requests,
            'verified_count': verified_count,
            'integrity_score': round(integrity_score, 2),
            'issues': integrity_issues,
            'verified_at': timezone.now().isoformat(),
        }

