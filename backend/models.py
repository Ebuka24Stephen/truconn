"""

from sqlalchemy import Column, String, Text, Enum, TIMESTAMP, JSON, ForeignKey, Integer
from sqlalchemy.ext.declarative import declarative_base
import enum

Base = declarative_base()

class UserRoleEnum(str, enum.Enum):
    citizen = 'citizen'
    org_admin = 'org_admin'
    super_admin = 'super_admin'

class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True)
    full_name = Column(String)
    email = Column(String, unique=True)
    national_id = Column(String)
    password_hash = Column(Text)
    user_role = Column(Enum(UserRoleEnum))
    created_at = Column(TIMESTAMP)
    updated_at = Column(TIMESTAMP)

class Organization(Base):
    __tablename__ = 'organizations'
    id = Column(String, primary_key=True)
    org_name = Column(String)
    cac_number = Column(String)
    verification_status = Column(Enum('pending', 'verified', 'revoked', name='verification_status'))
    contact_email = Column(String)
    created_at = Column(TIMESTAMP)

class Consent(Base):
    __tablename__ = 'consents'
    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey('users.id'))
    org_id = Column(String, ForeignKey('organizations.id'))
    data_scope = Column(JSON)
    consent_status = Column(Enum('granted', 'revoked', 'expired', name='consent_status'))
    timestamp = Column(TIMESTAMP)

class AuditLog(Base):
    __tablename__ = 'audit_logs'
    id = Column(Integer, primary_key=True)
    entity_type = Column(Enum('user', 'org', 'consent', name='entity_type'))
    entity_id = Column(String)
    action = Column(String)
    performed_by = Column(String)
    created_at = Column(TIMESTAMP)
    metadata = Column(JSON)
"""
