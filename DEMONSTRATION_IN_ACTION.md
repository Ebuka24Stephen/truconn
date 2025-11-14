# 🎬 TruCon in Action: Citizen-Organization Connection Demonstration

This document demonstrates how TruCon connects citizens and organizations with real-world scenarios, API calls, database changes, and UI interactions.

---

## 📖 Scenario Overview

**Jane Doe** (Citizen) wants to use a financial service from **ABC Bank** (Organization). Let's see how TruCon protects Jane's data while enabling ABC Bank to access it with her explicit consent.

---

## 🎯 Complete Interaction Flow

### **Phase 1: Citizen Registration & Consent Setup**

#### Step 1: Jane Signs Up as a Citizen

**Frontend Action:**
```
Jane visits: https://truconn.onrender.com/signup
```

**UI State:**
```
┌─────────────────────────────────────────┐
│  TruCon Signup                          │
│  ───────────────────────────────────    │
│  Role: [ ] Citizen  [ ] Organization    │
│  First Name: Jane                       │
│  Last Name: Doe                         │
│  Email: jane.doe@example.com            │
│  Password: ********                     │
│  Confirm Password: ********             │
│                                         │
│  [ Create Account ]                     │
└─────────────────────────────────────────┘
```

**API Call:**
```http
POST /api/auth/signup/
Content-Type: application/json

{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane.doe@example.com",
  "password1": "SecurePass123!",
  "password2": "SecurePass123!",
  "user_role": "CITIZEN"
}
```

**Response:**
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "jane.doe@example.com",
    "user_role": "CITIZEN"
  },
  "profile": {
    "id": 1,
    "user": "550e8400-e29b-41d4-a716-446655440000",
    "bio": "",
    "avatar": null
  }
}
```

**Database Changes:**
```sql
-- CustomUser table
INSERT INTO accounts_customuser (
  id, first_name, last_name, email, 
  password, user_role, is_active, created_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Jane', 'Doe', 'jane.doe@example.com',
  '<hashed_password>', 'CITIZEN', true, NOW()
);

-- Profile table (auto-created via signal)
INSERT INTO accounts_profile (
  user_id, phone_no, about, location
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  '', '', ''
);
```

**System State:**
- ✅ Jane is authenticated
- ✅ Profile created automatically
- ⏳ No consents granted yet (default: all false)

---

#### Step 2: Jane Completes Onboarding & Grants Consent

**Frontend Action:**
```
Jane redirected to: /onboarding
```

**UI State:**
```
┌─────────────────────────────────────────┐
│  TruCon Onboarding                      │
│  ───────────────────────────────────    │
│  Step 1: Personal Information          │
│  ✓ First Name: Jane (Read-only)        │
│  ✓ Last Name: Doe (Read-only)          │
│  Email: jane.doe@example.com (Read-only)│
│  Title: Software Engineer               │
│  Company: Tech Corp                     │
│                                         │
│  Step 2: Contact Information            │
│  Phone: +234 801 234 5678              │
│  Website: jane.doe.com                  │
│  Location: Lagos, Nigeria               │
│                                         │
│  [ Continue ]  [ Back ]                 │
└─────────────────────────────────────────┘
```

**Jane Completes Onboarding:**
```http
PUT /api/auth/profile/
Content-Type: application/json

{
  "title": "Software Engineer",
  "company": "Tech Corp",
  "phone_no": "+2348012345678",
  "url": "https://jane.doe.com",
  "location": "Lagos, Nigeria",
  "about": "Software engineer passionate about data privacy"
}
```

**Response:**
```json
{
  "id": 1,
  "user": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Software Engineer",
  "company": "Tech Corp",
  "phone_no": "+2348012345678",
  "url": "https://jane.doe.com",
  "location": "Lagos, Nigeria",
  "about": "Software engineer passionate about data privacy"
}
```

**Jane Navigates to Consent Management:**
```
/dashboard/consent
```

**UI State:**
```
┌─────────────────────────────────────────┐
│  Consent Management                     │
│  ───────────────────────────────────    │
│                                         │
│  Financial Data                         │
│  [ ○ ] OFF  [ ● ] ON                   │
│  Manage access to your financial data   │
│                                         │
│  Health Data                            │
│  [ ● ] OFF  [ ○ ] ON                   │
│  Manage access to your health data      │
│                                         │
│  Identity Data                          │
│  [ ○ ] OFF  [ ● ] ON                   │
│  Manage access to your identity data    │
│                                         │
│  Biometric Data                         │
│  [ ● ] OFF  [ ○ ] ON                   │
│  Manage access to your biometric data   │
└─────────────────────────────────────────┘
```

**Jane Grants Financial Consent:**
```http
POST /api/consents/1/toggle/
```

**System Processing:**
```python
# Backend: consents/views.py - UserConsentView
1. Fetch Consent (id=1, name="Financial")
2. Get or create UserConsent for Jane and Financial consent
3. Toggle access: False → True
4. Update timestamps:
   - granted_at = NOW()
   - revoked_at = None
5. Log in ConsentHistory:
   - action = 'GRANTED'
   - changed_at = NOW()
6. Trigger notification (if orgs have pending requests)
```

**Response:**
```json
{
  "consent": "Financial",
  "access": true,
  "message": "Consent granted"
}
```

**Database Changes:**
```sql
-- UserConsent table
INSERT INTO consents_userconsent (
  user_id, consent_id, access, granted_at, revoked_at
) VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  1,  -- Financial consent
  true, NOW(), NULL
) ON CONFLICT (user_id, consent_id) 
UPDATE SET access = true, granted_at = NOW(), revoked_at = NULL;

-- ConsentHistory table
INSERT INTO consents_consenthistory (
  user_consent_id, action, changed_at, 
  previous_value, new_value
) VALUES (
  <user_consent_id>, 'GRANTED', NOW(),
  false, true
);
```

**System State After Jane Grants Financial Consent:**
- ✅ Jane has granted Financial consent
- ✅ Organizations can now request Financial data
- ✅ Consent history logged
- ✅ Jane can see consent status in dashboard

---

### **Phase 2: Organization Registration**

#### Step 3: ABC Bank Signs Up as Organization

**Frontend Action:**
```
ABC Bank visits: https://truconn.onrender.com/signup
```

**API Call:**
```http
POST /api/auth/signup/
Content-Type: application/json

{
  "name": "ABC Bank",
  "email": "admin@abcbank.com",
  "password1": "BankSecure123!",
  "password2": "BankSecure123!",
  "user_role": "ORGANIZATION",
  "website": "https://abcbank.com",
  "address": "123 Bank Street, Lagos, Nigeria"
}
```

**Response:**
```json
{
  "user": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "email": "admin@abcbank.com",
    "user_role": "ORGANIZATION"
  },
  "organization": {
    "id": 1,
    "name": "ABC Bank",
    "email": "admin@abcbank.com",
    "website": "https://abcbank.com",
    "address": "123 Bank Street, Lagos, Nigeria",
    "trust_score": 0.0,
    "trust_level": "BASIC"
  }
}
```

**Database Changes:**
```sql
-- CustomUser table
INSERT INTO accounts_customuser (
  id, email, password, user_role, is_active, created_at
) VALUES (
  '660e8400-e29b-41d4-a716-446655440001',
  'admin@abcbank.com', '<hashed_password>', 
  'ORGANIZATION', true, NOW()
);

-- Org table
INSERT INTO organization_org (
  user_id, name, email, website, address,
  trust_score, trust_level, trust_certificate_issued
) VALUES (
  '660e8400-e29b-41d4-a716-446655440001',
  'ABC Bank', 'admin@abcbank.com',
  'https://abcbank.com', '123 Bank Street, Lagos, Nigeria',
  0.0, 'BASIC', false
);
```

**System State:**
- ✅ ABC Bank registered as Organization
- ✅ Initial trust score: 0.0 (BASIC level)
- ✅ No trust certificate issued yet

---

### **Phase 3: Organization Requests Access**

#### Step 4: ABC Bank Finds Jane & Requests Financial Data

**Frontend Action:**
```
ABC Bank visits: /admin/organization/consent-requests
```

**UI State:**
```
┌─────────────────────────────────────────┐
│  Browse Citizens                        │
│  ───────────────────────────────────    │
│  Search: [__________________] [Search]  │
│                                         │
│  Jane Doe                               │
│  jane.doe@example.com                   │
│  Software Engineer at Tech Corp         │
│                                         │
│  Active Consents:                       │
│  ✓ Financial                            │
│  ✗ Health                               │
│  ✓ Identity                             │
│  ✗ Biometric                            │
│                                         │
│  [ Request Financial Data Access ]      │
└─────────────────────────────────────────┘
```

**ABC Bank Clicks "Request Financial Data Access"**

**UI Modal:**
```
┌─────────────────────────────────────────┐
│  Request Data Access                    │
│  ───────────────────────────────────    │
│  Citizen: Jane Doe                      │
│  Data Type: Financial                   │
│  Purpose: [Loan application processing] │
│                                         │
│  [ Cancel ]  [ Send Request ]           │
└─────────────────────────────────────────┘
```

**API Call:**
```http
POST /api/organization/consent/550e8400-e29b-41d4-a716-446655440000/1/request/
Content-Type: application/json
Authorization: Bearer <abc_bank_jwt_token>

{
  "purpose": "Loan application processing"
}
```

**System Processing:**
```python
# Backend: organization/views.py - ConsentRequestView
1. Validate Organization Authentication
   ✓ User authenticated
   ✓ User role = 'ORGANIZATION'
   
2. Validate Target User
   ✓ User exists: Jane Doe
   ✓ User role = 'CITIZEN'
   
3. Validate Consent
   ✓ Consent exists: Financial (id=1)
   
4. CRITICAL: Check User Consent
   user_consent = UserConsent.objects.filter(
       user=jane,
       consent=financial_consent,
       access=True  # ← KEY CHECK
   ).first()
   
   ✓ user_consent found (Jane granted Financial consent)
   
5. Create AccessRequest
   AccessRequest.objects.get_or_create(
       organization=abc_bank,
       user=jane,
       consent=financial_consent,
       defaults={'status': 'PENDING', 'purpose': '...'}
   )
   
6. Send Email Notification to Jane
   send_access_request_email(
       organization_id=abc_bank.id,
       user_id=jane.id,
       consent_id=1
   )
```

**Response (Success):**
```json
{
  "message": "Access request sent successfully.",
  "data": {
    "id": 101,
    "organization": {
      "id": 1,
      "name": "ABC Bank"
    },
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "jane.doe@example.com"
    },
    "consent": {
      "id": 1,
      "name": "Financial"
    },
    "status": "PENDING",
    "purpose": "Loan application processing",
    "requested_at": "2024-12-15T10:30:00Z"
  }
}
```

**Database Changes:**
```sql
-- AccessRequest table
INSERT INTO organization_accessrequest (
  id, organization_id, user_id, consent_id,
  status, purpose, requested_at
) VALUES (
  101, 1, '550e8400-e29b-41d4-a716-446655440000',
  1, 'PENDING', 'Loan application processing', NOW()
);
```

**Email Sent to Jane:**
```
To: jane.doe@example.com
Subject: New Data Access Request from ABC Bank

Hello Jane Doe,

ABC Bank has requested access to your Financial data.

Purpose: Loan application processing
Requested: December 15, 2024 at 10:30 AM

[ View Request in Dashboard ]
[ Approve ] [ Deny ]

---

This is an automated message from TruCon.
Your data privacy matters.
```

**System State:**
- ✅ AccessRequest created (status='PENDING')
- ✅ Email notification sent to Jane
- ✅ ABC Bank sees request as "Pending"
- ⏳ Waiting for Jane's approval

**What if Jane Hadn't Granted Financial Consent?**

If Jane hadn't granted Financial consent:
```json
{
  "error": "User has not granted this consent.",
  "status": 400
}
```

ABC Bank cannot request access without Jane's explicit consent grant.

---

### **Phase 4: Citizen Reviews & Approves Request**

#### Step 5: Jane Receives Notification & Reviews Request

**Frontend Action:**
```
Jane logs in and visits: /dashboard/data-access
```

**UI State:**
```
┌─────────────────────────────────────────┐
│  My Data Access                         │
│  ───────────────────────────────────    │
│                                         │
│  Filter: [All ▼] Search: [_____]       │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ABC Bank                          │ │
│  │ Financial Data                    │ │
│  │ Purpose: Loan application         │ │
│  │ Status: PENDING                   │ │
│  │ Requested: Dec 15, 2024 10:30 AM │ │
│  │                                   │ │
│  │ [ Approve ]  [ Deny ]             │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Jane Clicks "Approve"**

**API Call:**
```http
POST /api/organization/consent/101/toggle-access/
Authorization: Bearer <jane_jwt_token>
```

**System Processing:**
```python
# Backend: organization/views.py - ConsentRevocationView
1. Validate Citizen Authentication
   ✓ User authenticated
   ✓ User role = 'CITIZEN'
   
2. Fetch AccessRequest
   access_request = AccessRequest.objects.get(
       id=101,
       user=jane  # ← Ensures citizen can only approve their own requests
   )
   
3. Toggle Status
   if access_request.status != 'APPROVED':
       access_request.status = 'APPROVED'
       access_request.save()
       
4. Log in Audit Trail
   - Status change logged
   - Timestamp recorded
   
5. Send Email to ABC Bank
   "Your access request has been approved"
```

**Response:**
```json
{
  "message": "Consent Granted!"
}
```

**Database Changes:**
```sql
-- AccessRequest table
UPDATE organization_accessrequest
SET status = 'APPROVED'
WHERE id = 101;
```

**Email Sent to ABC Bank:**
```
To: admin@abcbank.com
Subject: Data Access Approved - Jane Doe

Hello ABC Bank,

Jane Doe has approved your request to access her Financial data.

Purpose: Loan application processing
Approved: December 15, 2024 at 11:15 AM

You can now access this data through our API.
Remember to respect data minimization principles.

---

This is an automated message from TruCon.
```

**System State:**
- ✅ AccessRequest status = 'APPROVED'
- ✅ ABC Bank can now access Jane's Financial data
- ✅ Email notification sent to ABC Bank
- ✅ Jane sees status updated in dashboard
- ✅ All changes logged in audit trail

---

### **Phase 5: Organization Accesses Data**

#### Step 6: ABC Bank Accesses Jane's Financial Data

**API Call (ABC Bank's Backend System):**
```http
GET /api/organization/requested-consent/
Authorization: Bearer <abc_bank_jwt_token>
```

**Response:**
```json
{
  "message": "Consent requests retrieved successfully.",
  "count": 1,
  "data": [
    {
      "id": 101,
      "organization": {
        "id": 1,
        "name": "ABC Bank"
      },
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "jane.doe@example.com",
        "first_name": "Jane",
        "last_name": "Doe"
      },
      "consent": {
        "id": 1,
        "name": "Financial"
      },
      "status": "APPROVED",
      "purpose": "Loan application processing",
      "requested_at": "2024-12-15T10:30:00Z"
    }
  ]
}
```

**ABC Bank's System:**
- ✅ Validates access request status = 'APPROVED'
- ✅ Retrieves Jane's Financial data (via their own system)
- ✅ Processes loan application
- ✅ All access logged automatically

**System State:**
- ✅ ABC Bank has active access to Jane's Financial data
- ✅ Access logged in transparency dashboard
- ✅ Jane can see access history

---

### **Phase 6: Transparency & Monitoring**

#### Step 7: Jane Views Transparency Log

**Frontend Action:**
```
Jane visits: /dashboard/transparency
```

**API Call:**
```http
GET /api/consents/transparency-log/
Authorization: Bearer <jane_jwt_token>
```

**Response:**
```json
{
  "data": [
    {
      "id": 101,
      "organizationId": 1,
      "organizationName": "ABC Bank",
      "consentType": "Financial",
      "status": "APPROVED",
      "purpose": "Loan application processing",
      "requestedAt": "2024-12-15T10:30:00Z",
      "lastAccessed": "2024-12-15T10:30:00Z"
    }
  ],
  "message": "Transparency log retrieved successfully"
}
```

**UI State:**
```
┌─────────────────────────────────────────┐
│  Transparency Log                       │
│  ───────────────────────────────────    │
│                                         │
│  Filter: [All Organizations ▼]         │
│  Date Range: [Dec 1] to [Dec 15]       │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ ABC Bank                          │ │
│  │ Financial Data                    │ │
│  │ Status: ✓ APPROVED                │ │
│  │ Purpose: Loan application         │ │
│  │ Requested: Dec 15, 2024 10:30 AM │ │
│  │                                   │ │
│  │ [ View Details ] [ Revoke Access ]│ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Jane Can See:**
- ✅ Who accessed: ABC Bank
- ✅ What data: Financial
- ✅ When: December 15, 2024 at 10:30 AM
- ✅ Why: Loan application processing
- ✅ Status: APPROVED

---

### **Phase 7: Consent Revocation**

#### Step 8: Jane Revokes Access

**Jane Clicks "Revoke Access"**

**API Call:**
```http
POST /api/organization/consent/101/toggle-access/
Authorization: Bearer <jane_jwt_token>
```

**System Processing:**
```python
# Backend: organization/views.py - ConsentRevocationView
1. Fetch AccessRequest (status is now 'APPROVED')
2. Toggle to 'REVOKED'
   access_request.status = 'REVOKED'
   access_request.save()
   
3. Log revocation in audit trail
4. Send email notification to ABC Bank
5. Update compliance records (if applicable)
```

**Response:**
```json
{
  "message": "Consent Revoked!"
}
```

**Database Changes:**
```sql
-- AccessRequest table
UPDATE organization_accessrequest
SET status = 'REVOKED'
WHERE id = 101;
```

**Email Sent to ABC Bank:**
```
To: admin@abcbank.com
Subject: Data Access Revoked - Jane Doe

Hello ABC Bank,

Jane Doe has revoked your access to her Financial data.

Effective immediately, you must:
- Stop accessing this data
- Delete any cached copies
- Update your records

Original Purpose: Loan application processing
Revoked: December 15, 2024 at 2:45 PM

If you need to access this data again, please submit a new request.

---

This is an automated message from TruCon.
NDPR Compliance Required.
```

**System State:**
- ✅ AccessRequest status = 'REVOKED'
- ✅ ABC Bank must stop accessing Jane's data
- ✅ Email notification sent
- ✅ Revocation logged in audit trail
- ✅ Compliance system notified (violation check if ABC Bank continues accessing)

---

### **Phase 8: Trust & Compliance**

#### Step 9: Compliance Scan & Trust Score Update

**ABC Bank Runs Compliance Scan:**

**API Call:**
```http
POST /api/compliance/scan/
Authorization: Bearer <abc_bank_jwt_token>
```

**System Processing:**
```python
# Backend: compliance/rules_engine.py - NDPRRulesEngine
1. Check Consent Validity
   ✓ All APPROVED requests have valid consent
   
2. Check Revocation Handling
   ⚠️ Found: Access request #101 still APPROVED but user revoked consent
   → CRITICAL VIOLATION detected!
   
3. Calculate Risk Score
   - CRITICAL violation: +20 points
   - Risk Score: 20/100
   
4. Create ComplianceAudit records
5. Create ViolationReport (CRITICAL → auto-report to DPO)
```

**Response:**
```json
{
  "message": "Compliance scan completed successfully",
  "data": {
    "risk_score": 20,
    "total_violations": 1,
    "critical_count": 1,
    "high_count": 0,
    "medium_count": 0,
    "violations": [
      {
        "rule": "REVOCATION_HANDLING",
        "details": {
          "access_request_id": 101,
          "user_id": "550e8400-e29b-41d4-a716-446655440000",
          "consent_type": "Financial",
          "issue": "CRITICAL: Access still approved but user consent is missing or revoked"
        },
        "recommendation": "IMMEDIATELY revoke access request #101 - user consent is missing or revoked"
      }
    ],
    "audit_records": [...]
  }
}
```

**Trust Score Update:**
```python
# Backend: organization/trust_engine.py
TrustScoreEngine.calculate_trust_score(abc_bank):
- Compliance: 80 (100 - 20 risk score)
- Data Integrity: 100
- Consent Respect: 20 (penalty for revocation issue)
- Transparency: 90
- User Satisfaction: 85 (default)

Overall Score = (80 × 0.40) + (100 × 0.25) + (20 × 0.20) + (90 × 0.10) + (85 × 0.05)
              = 32 + 25 + 4 + 9 + 4.25
              = 74.25 → Trust Level: "GOOD"
```

**Database Changes:**
```sql
-- ComplianceAudit table
INSERT INTO compliance_complianceaudit (
  organization_id, rule_name, rule_description,
  severity, status, details, recommendation
) VALUES (
  1, 'Consent Revocation Handling',
  'Revoked consents must be respected immediately',
  'CRITICAL', 'PENDING',
  '{"access_request_id": 101, ...}',
  'IMMEDIATELY revoke access request #101'
);

-- ViolationReport table
INSERT INTO compliance_violationreport (
  organization_id, violation_type, description,
  affected_users_count, reported_to_dpo
) VALUES (
  1, 'CONSENT_VIOLATION',
  'Access still approved but user consent revoked',
  1, true  -- Auto-reported to DPO for CRITICAL
);

-- Org table (trust score update)
UPDATE organization_org
SET 
  trust_score = 74.25,
  trust_level = 'GOOD',
  trust_score_last_calculated = NOW(),
  trust_certificate_issued = false  -- Below 75 threshold
WHERE id = 1;
```

**System State:**
- ⚠️ CRITICAL violation detected
- ⚠️ Trust score dropped to 74.25 (GOOD level)
- ⚠️ Trust certificate revoked (wasn't issued, but would be if it was)
- ⚠️ Violation auto-reported to Data Protection Office
- ✅ ABC Bank notified to take immediate action

---

## 📊 Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    TRUCON DATA PROTECTION FLOW                  │
└─────────────────────────────────────────────────────────────────┘

STEP 1: CITIZEN REGISTRATION
┌──────────┐
│   Jane   │ → POST /api/auth/signup/ → CustomUser created
└────┬─────┘                                      ↓
     │                                      Profile created
     │                                            ↓
     └────────────────────────────────────→ Onboarding completed

STEP 2: CONSENT MANAGEMENT
┌──────────┐
│   Jane   │ → POST /api/consents/1/toggle/ → UserConsent.access = True
└────┬─────┘                                      ↓
     │                                    ConsentHistory logged
     │                                            ↓
     └────────────────────────────────────→ Financial consent granted

STEP 3: ORGANIZATION REGISTRATION
┌──────────┐
│ABC Bank  │ → POST /api/auth/signup/ → CustomUser + Org created
└────┬─────┘                                      ↓
     │                                    Trust score initialized
     │                                            ↓
     └────────────────────────────────────→ Organization ready

STEP 4: ACCESS REQUEST
┌──────────┐              ┌─────────────┐
│ABC Bank  │ → Request →  │   System    │ → Validate:
└──────────┘              └──────┬──────┘   ✓ Org authenticated
                                    │       ✓ User granted consent
                                    ↓       ✓ Create AccessRequest
                            AccessRequest    ✓ Send email to Jane
                            (status='PENDING')
                                    
STEP 5: CITIZEN APPROVAL
                            ┌─────────────┐
       ┌──────────────────→ │   System    │ ← Approve
       │                    └──────┬──────┘
┌──────┴──────┐                   ↓
│    Jane     │         AccessRequest.status
└─────────────┘         = 'APPROVED'
                              ↓
                      Email to ABC Bank
                              ↓
                      Access granted!

STEP 6: DATA ACCESS
┌──────────┐
│ABC Bank  │ → Access Financial Data → All access logged
└────┬─────┘                                    ↓
     │                              Transparency Log updated
     │                                    ↓
     └────────────────────────────→ Jane can see access

STEP 7: REVOCATION
┌──────────┐              ┌─────────────┐
│   Jane   │ → Revoke →   │   System    │ → Update status
└──────────┘              └──────┬──────┘   = 'REVOKED'
                                    │       ✓ Email ABC Bank
                                    ↓       ✓ Log in audit
                            AccessRequest    ✓ Compliance check
                            (status='REVOKED')
                                    
STEP 8: COMPLIANCE & TRUST
┌──────────┐              ┌─────────────┐
│ABC Bank  │ → Scan →     │ Compliance  │ → Check violations
└──────────┘              └──────┬──────┘   ✓ CRITICAL found
                                    │       ✓ Trust score updated
                                    ↓       ✓ DPO notified
                            Trust Score: 74.25 (GOOD)
                            Violation: CRITICAL
                            Action: Required
```

---

## 🔐 Protection Mechanisms Demonstrated

### **1. Consent-First Access**
- ✅ ABC Bank cannot request without Jane's consent
- ✅ System validates `UserConsent.access = True` before allowing request
- ✅ Returns 400 error if consent not granted

### **2. Explicit Approval Required**
- ✅ AccessRequest created with status='PENDING'
- ✅ Jane must explicitly approve (not auto-approved)
- ✅ Email notification ensures Jane is aware

### **3. Revocable Access**
- ✅ Jane can revoke access at any time
- ✅ Status changes from 'APPROVED' to 'REVOKED'
- ✅ ABC Bank immediately notified

### **4. Full Transparency**
- ✅ All access requests logged
- ✅ Jane can see who, what, when, why
- ✅ Transparency dashboard shows complete history

### **5. Compliance Monitoring**
- ✅ Automated compliance scan detects violations
- ✅ CRITICAL violations auto-flagged
- ✅ Trust score automatically adjusted

### **6. Trust Framework**
- ✅ Organizations scored on 5 components
- ✅ Trust levels visible to citizens
- ✅ Low trust scores affect reputation

### **7. Audit Trail**
- ✅ Every action logged with timestamp
- ✅ ConsentHistory tracks all changes
- ✅ ComplianceAudit records violations
- ✅ AccessRequest status changes tracked

---

## 📧 Notification Flow

```
┌──────────────────────────────────────────────────────────────┐
│                 NOTIFICATION TIMELINE                        │
└──────────────────────────────────────────────────────────────┘

T+0:00  ABC Bank requests access
        ↓
        Email sent to Jane: "New Access Request"

T+0:45  Jane approves request
        ↓
        Email sent to ABC Bank: "Access Approved"

T+2:15  Jane revokes access
        ↓
        Email sent to ABC Bank: "Access Revoked"

T+3:00  ABC Bank runs compliance scan
        ↓
        CRITICAL violation detected
        ↓
        Email sent to ABC Bank: "Compliance Violation Detected"
        Email sent to DPO: "CRITICAL Violation Report"
```

---

## 🎯 Key Demonstrations

### **Demonstration 1: Consent Protection**
```
❌ Organization tries to request without consent:
   POST /api/organization/consent/{user_id}/1/request/
   → Response: 400 "User has not granted this consent."

✅ Organization requests after consent granted:
   POST /api/organization/consent/{user_id}/1/request/
   → Response: 200 "Access request sent successfully."
```

### **Demonstration 2: Citizen Control**
```
✅ Citizen can approve:
   POST /api/organization/consent/101/toggle-access/
   → Status: PENDING → APPROVED

✅ Citizen can revoke:
   POST /api/organization/consent/101/toggle-access/
   → Status: APPROVED → REVOKED
```

### **Demonstration 3: Transparency**
```
✅ Citizen views all access:
   GET /api/consents/transparency-log/
   → Returns complete audit trail
   → Shows who, what, when, why
```

### **Demonstration 4: Compliance Enforcement**
```
✅ System detects violation:
   POST /api/compliance/scan/
   → Detects CRITICAL violation
   → Updates trust score
   → Notifies DPO
```

---

## 🏁 Summary: How TruCon Protects Citizen Data

1. **Consent-First**: Organizations cannot request without explicit citizen consent
2. **Approval Required**: All requests start as PENDING, require citizen approval
3. **Revocable**: Citizens can revoke access at any time, immediately enforced
4. **Transparent**: Complete audit trail visible to citizens
5. **Monitored**: Automated compliance checks detect violations
6. **Trust-Based**: Organizations scored and ranked publicly
7. **Enforced**: Violations detected, trust scores adjusted, DPO notified

**Result**: Jane maintains complete control over her data while ABC Bank can access it transparently and compliantly under NDPR regulations.

---

*This demonstration shows TruCon in action, protecting citizen data while enabling legitimate organizational access with full transparency and compliance.*

