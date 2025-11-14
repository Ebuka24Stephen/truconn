# 🔗 Citizen-Organization Connection Flow

## Visual Connection Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    TRUCON CONNECTION FLOW                                │
│         How Citizens and Organizations Interact Through TruCon           │
└──────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────┐
                                    │   TruCon     │
                                    │   Platform   │
                                    └──────┬───────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    │                                             │
           ┌────────▼────────┐                        ┌──────────▼─────────┐
           │    CITIZEN      │                        │   ORGANIZATION     │
           │   (Jane Doe)    │                        │   (ABC Bank)       │
           └────────┬────────┘                        └──────────┬─────────┘
                    │                                             │
                    │  STEP 1: REGISTRATION & CONSENT            │
                    │                                             │
    ┌───────────────┴───────────────┐              ┌─────────────┴─────────────┐
    │ 1. Sign Up                    │              │ 1. Sign Up                │
    │    POST /api/auth/signup/     │              │    POST /api/auth/signup/ │
    │    role: CITIZEN              │              │    role: ORGANIZATION     │
    └───────────────┬───────────────┘              └─────────────┬─────────────┘
                    │                                             │
    ┌───────────────┴───────────────┐              ┌─────────────┴─────────────┐
    │ 2. Complete Onboarding        │              │ 2. Complete Onboarding    │
    │    PUT /api/auth/profile/     │              │    PUT /api/auth/profile/ │
    └───────────────┬───────────────┘              └─────────────┬─────────────┘
                    │                                             │
    ┌───────────────┴───────────────┐                            │
    │ 3. Grant Consent              │                            │
    │    POST /api/consents/1/      │                            │
    │         toggle/               │                            │
    │    ✓ Financial consent ON     │                            │
    │    ✗ Health consent OFF       │                            │
    │    ✓ Identity consent ON      │                            │
    │    ✗ Biometric consent OFF    │                            │
    └───────────────┬───────────────┘                            │
                    │                                             │
                    │  STEP 2: ORGANIZATION DISCOVERS CITIZEN    │
                    │                                             │
                                    ┌──────────────┐             │
                                    │ GET /api/    │             │
                                    │ organization/│             │
                                    │ citizens/    │             │
                                    │ list/        │             │
                                    └──────┬───────┘             │
                                           │                     │
                                    Returns list of             │
                                    citizens with their          │
                                    active consents              │
                                    ┌──────────────┐             │
                                    │ Jane Doe     │             │
                                    │ ✓ Financial  │             │
                                    │ ✓ Identity   │             │
                                    │ ✗ Health     │             │
                                    │ ✗ Biometric  │             │
                                    └──────────────┘             │
                                           │                     │
                                           │                     │
                    ┌──────────────────────┴─────────────────────┐
                    │  STEP 3: ACCESS REQUEST                    │
                    │                                             │
    ┌───────────────┴───────────────┐              ┌─────────────┴─────────────┐
    │ Waiting...                    │              │ 3. Request Access         │
    │ (No action needed)            │              │    POST /api/organization/│
    │                               │              │         consent/{user_id}/ │
    │                               │              │         {consent_id}/      │
    │                               │              │         request/           │
    │                               │              │    Purpose: "Loan app..." │
    └───────────────┬───────────────┘              └─────────────┬─────────────┘
                    │                                             │
                    │         ┌─────────────────────────┐        │
                    │         │  System Validation      │        │
                    │         │  ✓ Org authenticated    │        │
                    │         │  ✓ User exists          │        │
                    │         │  ✓ User has granted     │        │
                    │         │    Financial consent    │        │
                    │         │  ✓ Create AccessRequest │        │
                    │         │    (status='PENDING')   │        │
                    │         │  ✓ Send email to Jane   │        │
                    │         └──────────┬──────────────┘        │
                    │                    │                       │
                    │                    ↓                       │
    ┌───────────────┴───────────────┐              ┌─────────────┴─────────────┐
    │ 4. Receive Email Notification │              │ 4. Request Sent           │
    │    "ABC Bank requested access"│              │    Response: Success      │
    └───────────────┬───────────────┘              └─────────────┬─────────────┘
                    │                                             │
                    │  STEP 4: CITIZEN REVIEW & APPROVAL         │
                    │                                             │
    ┌───────────────┴───────────────┐              ┌─────────────┴─────────────┐
    │ 5. Login & View Request       │              │ Waiting for approval...   │
    │    GET /api/organization/     │              │                            │
    │         requested-consent/    │              │                            │
    │                               │              │                            │
    │    Sees:                      │              │                            │
    │    • ABC Bank                 │              │                            │
    │    • Financial Data           │              │                            │
    │    • Purpose: Loan app...     │              │                            │
    │    • Status: PENDING          │              │                            │
    │                               │              │                            │
    │ 6. Approve Request            │              │                            │
    │    POST /api/organization/    │              │                            │
    │         consent/101/          │              │                            │
    │         toggle-access/        │              │                            │
    │                               │              │                            │
    │    Status: PENDING → APPROVED │              │                            │
    └───────────────┬───────────────┘              └─────────────┬─────────────┘
                    │                                             │
                    │         ┌─────────────────────────┐        │
                    │         │  System Processing      │        │
                    │         │  ✓ Update AccessRequest │        │
                    │         │    status='APPROVED'    │        │
                    │         │  ✓ Log in audit trail   │        │
                    │         │  ✓ Send email to ABC    │        │
                    │         │    Bank                 │        │
                    │         └──────────┬──────────────┘        │
                    │                    │                       │
                    │                    ↓                       │
    ┌───────────────┴───────────────┐              ┌─────────────┴─────────────┐
    │ 7. Request Approved           │              │ 7. Receive Approval Email │
    │    UI updated: APPROVED       │              │    "Access Approved!"     │
    │                               │              │                            │
    │ 8. Can view in Transparency   │              │ 8. Can Now Access Data    │
    │    GET /api/consents/         │              │    GET /api/organization/ │
    │         transparency-log/     │              │         requested-consent/ │
    │                               │              │                            │
    │    Sees complete audit trail  │              │    Status: APPROVED       │
    └───────────────┬───────────────┘              └─────────────┬─────────────┘
                    │                                             │
                    │  STEP 5: DATA ACCESS & MONITORING          │
                    │                                             │
    ┌───────────────┴───────────────┐              ┌─────────────┴─────────────┐
    │ 9. Monitor Access             │              │ 9. Access Jane's Data     │
    │    • Who: ABC Bank            │              │    • Financial data        │
    │    • What: Financial          │              │    • For loan processing   │
    │    • When: Dec 15, 10:30 AM   │              │    • All access logged     │
    │    • Why: Loan app...         │              │                            │
    │    • Status: APPROVED         │              │                            │
    └───────────────┬───────────────┘              └─────────────┬─────────────┘
                    │                                             │
                    │  STEP 6: REVOCATION (Citizen Control)      │
                    │                                             │
    ┌───────────────┴───────────────┐              ┌─────────────┴─────────────┐
    │ 10. Revoke Access             │              │ 10. Receive Revocation    │
    │     POST /api/organization/   │              │     Email                 │
    │          consent/101/         │              │     "Access Revoked!"     │
    │          toggle-access/       │              │                            │
    │                               │              │     Must:                 │
    │     Status: APPROVED →        │              │     • Stop accessing data │
    │              REVOKED          │              │     • Delete cached copies│
    │                               │              │     • Update records      │
    └───────────────┬───────────────┘              └─────────────┬─────────────┘
                    │                                             │
                    │  STEP 7: COMPLIANCE & TRUST                │
                    │                                             │
    ┌───────────────┴───────────────┐              ┌─────────────┴─────────────┐
    │ 11. View Trust Registry       │              │ 11. Run Compliance Scan   │
    │     GET /api/organization/    │              │     POST /api/compliance/ │
    │          trust/registry/      │              │          scan/            │
    │                               │              │                            │
    │     Sees:                     │              │     Detects:              │
    │     • ABC Bank Trust Score    │              │     • CRITICAL violation   │
    │     • Trust Level: GOOD       │              │     • Revocation handling  │
    │     • Certificate status      │              │                            │
    │                               │              │     Trust Score: 74.25     │
    │ 12. All access logged         │              │     Level: GOOD            │
    │     Complete transparency     │              │     Action: Required       │
    └───────────────┬───────────────┘              └─────────────┬─────────────┘
                    │                                             │
                    └─────────────────────┬───────────────────────┘
                                          │
                          ┌───────────────▼───────────────┐
                          │    COMPLETE AUDIT TRAIL       │
                          │                               │
                          │  • Every request logged       │
                          │  • Every approval logged      │
                          │  • Every revocation logged    │
                          │  • Every access logged        │
                          │  • Compliance violations      │
                          │    detected & reported        │
                          │  • Trust scores updated       │
                          │                               │
                          │  ✅ Full Transparency         │
                          │  ✅ Citizen Control           │
                          │  ✅ NDPR Compliance           │
                          └───────────────────────────────┘
```

---

## 🔄 State Transitions

### **AccessRequest Status Flow**

```
┌─────────┐
│ PENDING │  ← Created when organization requests access
└────┬────┘
     │
     │ Citizen approves
     ↓
┌─────────┐
│APPROVED │  ← Organization can access data
└────┬────┘
     │
     │ Citizen revokes
     ↓
┌─────────┐
│ REVOKED │  ← Organization must stop accessing
└─────────┘
```

### **UserConsent Access Flow**

```
┌─────────┐
│  OFF    │  ← Default state (access=False)
└────┬────┘
     │
     │ Citizen toggles ON
     ↓
┌─────────┐
│   ON    │  ← Organizations can request
└────┬────┘
     │
     │ Citizen toggles OFF
     ↓
┌─────────┐
│  OFF    │  ← Organizations cannot request
└─────────┘    Existing requests may be flagged
```

---

## 📋 Complete Interaction Matrix

| Action | Citizen | Organization | System Response |
|--------|---------|--------------|-----------------|
| **Registration** | Sign up as CITIZEN | Sign up as ORGANIZATION | Creates user + profile/org |
| **Consent Management** | Toggle consent ON/OFF | Cannot modify citizen consent | Updates UserConsent.access |
| **Access Request** | Cannot request | Request access (if consent granted) | Creates AccessRequest (PENDING) |
| **Approval** | Approve/Deny request | Cannot approve own requests | Updates status (APPROVED/REVOKED) |
| **Data Access** | View audit trail | Access data (if APPROVED) | Logs all access |
| **Revocation** | Revoke at any time | Must comply with revocation | Updates status to REVOKED |
| **Transparency** | View complete log | View own access requests | Returns filtered audit trail |
| **Compliance** | View trust registry | Run compliance scan | Detects violations, updates trust |

---

## 🎯 Key Protection Points

### **Point 1: Consent Validation**
```python
# Before allowing request:
if not UserConsent.objects.filter(
    user=citizen,
    consent=consent_type,
    access=True  # ← MUST be True
).exists():
    return 400 "User has not granted this consent"
```

### **Point 2: Explicit Approval**
```python
# All requests start as PENDING:
AccessRequest.objects.create(
    organization=org,
    user=citizen,
    consent=consent,
    status='PENDING'  # ← Requires citizen approval
)
```

### **Point 3: Revocation Enforcement**
```python
# Citizen can revoke:
access_request.status = 'REVOKED'
# System immediately enforces
# Organization notified
# Compliance scan detects violation if still accessing
```

### **Point 4: Audit Trail**
```python
# Every action logged:
- Consent changes → ConsentHistory
- Access requests → AccessRequest
- Status changes → Logged with timestamps
- Compliance violations → ComplianceAudit
```

---

## 📊 Connection Summary

**Citizen → Organization Connection:**
1. ✅ Citizen grants consent → Organization can request
2. ✅ Organization requests → Citizen receives notification
3. ✅ Citizen approves → Organization can access
4. ✅ Organization accesses → All logged for citizen
5. ✅ Citizen revokes → Organization must stop

**Organization → Citizen Connection:**
1. ✅ Organization registers → Gets trust score
2. ✅ Organization requests → Must have consent
3. ✅ Organization accesses → Must be approved
4. ✅ Organization violates → Trust score drops
5. ✅ Organization complies → Trust score improves

**System Protection:**
1. ✅ Consent-first access (no consent = no request)
2. ✅ Explicit approval required (no auto-approval)
3. ✅ Revocable at any time (citizen control)
4. ✅ Complete transparency (audit trail)
5. ✅ Compliance monitoring (violation detection)
6. ✅ Trust scoring (public reputation)
7. ✅ Automated enforcement (system validation)

---

*This connection flow demonstrates how TruCon protects citizen data while enabling legitimate organizational access with full transparency and NDPR compliance.*

