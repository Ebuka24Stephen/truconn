┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                           │
│                    (Next.js 15 App Router)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Citizen    │  │ Organization │  │   Public     │        │
│  │  Dashboard   │  │  Dashboard   │  │   Portal     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  • Consent Management    • Access Requests   • Trust Registry  │
│  • Transparency Log      • Data Logs         • Public Reports  │
│  • Data Access Control   • Compliance Scan                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                          │
│                    (Django REST Framework)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │  Auth API    │  │ Consent API  │  │ Organization │        │
│  │              │  │              │  │     API      │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ Compliance   │  │  Trust API   │  │ Transparency │        │
│  │     API      │  │              │  │     API      │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  • JWT Authentication  • Role-Based Permissions  • CORS        │
│  • Session Management  • Error Handling          • Logging     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                     BUSINESS LOGIC LAYER                        │
│                         (Django Apps)                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Accounts   │  │   Consents   │  │ Organization │        │
│  │              │  │              │  │              │        │
│  │ • Auth       │  │ • Consent    │  │ • Access     │        │
│  │ • Profiles   │  │   Management │  │   Requests   │        │
│  │ • Users      │  │ • History    │  │ • Trust      │        │
│  │              │  │              │  │   Scores     │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │ Compliance   │  │  Integrity   │                            │
│  │              │  │              │                            │
│  │ • Rules      │  │ • Checksums  │                            │
│  │ • Audits     │  │ • Validation │                            │
│  │ • Violations │  │              │                            │
│  └──────────────┘  └──────────────┘                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                               │
│                    (PostgreSQL Database)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐     │
│  │  Core Models                                         │     │
│  │  • CustomUser (Citizen/Organization)                 │     │
│  │  • Profile (User profiles)                           │     │
│  │  • Consent (Data types)                              │     │
│  │  • UserConsent (User consent status)                 │     │
│  │  • AccessRequest (Data access requests)              │     │
│  │  • Org (Organization details + trust scores)         │     │
│  │  • ComplianceAudit (Compliance violations)           │     │
│  │  • ViolationReport (Regulatory reports)              │     │
│  │  • IntegrityRecord (Checksum records)                │     │
│  │  • ConsentHistory (Consent change audit)             │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘


Component Architecture
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYERS                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER (Frontend)                                 │
├─────────────────────────────────────────────────────────────────┤
│  • Next.js Pages (app/*/page.tsx)                              │
│  • React Components (components/*.tsx)                          │
│  • API Clients (lib/*/api.ts)                                   │
│  • State Management (lib/auth/context.tsx)                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  API LAYER (Backend Views)                                     │
├─────────────────────────────────────────────────────────────────┤
│  • accounts/views.py       - Authentication & Profiles          │
│  • consents/views.py       - Consent Management                 │
│  • organization/views.py   - Access Requests & Trust            │
│  • compliance/views.py     - Compliance Scans                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  BUSINESS LOGIC LAYER                                           │
├─────────────────────────────────────────────────────────────────┤
│  • organization/trust_engine.py     - Trust Score Calculation   │
│  • organization/integrity.py        - Data Integrity Checks     │
│  • compliance/rules_engine.py       - NDPR Compliance Rules     │
│  • consents/notifications.py        - Email Notifications       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  DATA ACCESS LAYER (Models)                                    │
├─────────────────────────────────────────────────────────────────┤
│  • accounts/models.py       - CustomUser, Profile               │
│  • consents/models.py       - Consent, UserConsent, History     │
│  • organization/models.py   - Org, AccessRequest, Integrity     │
│  • compliance/models.py     - ComplianceAudit, ViolationReport  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  DATABASE LAYER (PostgreSQL)                                   │
├─────────────────────────────────────────────────────────────────┤
│  • Relational database with indexed queries                     │
│  • Transaction support for data consistency                     │
│  • Audit trail with timestamps                                  │
└─────────────────────────────────────────────────────────────────┘


User Flows:
┌─────────────┐
│   Citizen   │
└──────┬──────┘
       │
       │ 1. Visits TruCon Landing Page
       ↓
┌─────────────────────────────────┐
│   /signup (Signup Page)         │
│   • Email, Password, Role       │
└──────┬────────────────────────────┘
       │
       │ 2. Submits Registration
       ↓
┌─────────────────────────────────┐
│   POST /api/auth/signup/        │
│   • Creates CustomUser          │
│   • Creates Profile             │
│   • Auto-login                  │
└──────┬────────────────────────────┘
       │
       │ 3. Redirect to Onboarding
       ↓
┌─────────────────────────────────┐
│   /onboarding (Onboarding Page) │
│   • Pre-fills signup data       │
│   • Complete profile            │
│   • Set initial consent         │
└──────┬────────────────────────────┘
       │
       │ 4. Save Profile & Consent
       ↓
┌─────────────────────────────────┐
│   PUT /api/auth/profile/        │
│   POST /api/consents/{id}/      │
│        toggle/                  │
│   • Update profile              │
│   • Grant/revoke consents       │
└──────┬────────────────────────────┘
       │
       │ 5. Complete Onboarding
       ↓
┌─────────────────────────────────┐
│   /dashboard (Citizen Dashboard)│
│   • View active consents        │
│   • See trust score             │
│   • Manage data access          │
└─────────────────────────────────┘

Flow 2: Organization Request & Citizen Approval
┌──────────────────┐              ┌─────────────┐
│  Organization    │              │   Citizen   │
└────────┬─────────┘              └──────┬──────┘
         │                               │
         │ 1. Browse Citizens            │
         │    GET /api/organization/     │
         │         citizens/list/        │
         │                               │
         │ 2. Request Access             │
         │    POST /api/organization/    │
         │         consent/{user_id}/    │
         │         {consent_id}/request/ │
         │                               │
         │    System Validates:          │
         │    ✓ Organization authenticated│
         │    ✓ User has granted consent │
         │    ✓ Create AccessRequest     │
         │      (status='PENDING')       │
         │                               │
         │                               │ 3. Receive Email
         │                               │    Notification
         │                               ↓
         │                      ┌────────────────────┐
         │                      │  Email: "New       │
         │                      │  Access Request"   │
         │                      └──────┬─────────────┘
         │                             │
         │                             │ 4. Login & View Request
         │                             ↓
         │                      ┌────────────────────┐
         │                      │  /dashboard/       │
         │                      │  data-access       │
         │                      │  • View requests   │
         │                      │  • Approve/Deny    │
         │                      └──────┬─────────────┘
         │                             │
         │                             │ 5. Approve/Revoke
         │                             ↓
         │                      ┌────────────────────┐
         │                      │  POST /api/        │
         │                      │  organization/     │
         │                      │  consent/{id}/     │
         │                      │  toggle-access/    │
         │                      │  • Update status   │
         │                      │  • Log in audit    │
         │                      └──────┬─────────────┘
         │                             │
         │                             │ 6. Email Notification
         │                             │    to Organization
         │                             │
         │                             │ 7. Organization Access
         │                             │    (if APPROVED)
         ↓                             ↓
┌─────────────────────────────────────────────────────────────┐
│  AccessRequest.status = 'APPROVED'                          │
│  • Organization can access data                             │
│  • All access logged in transparency log                    │
│  • Citizen can revoke at any time                           │
└─────────────────────────────────────────────────────────────┘

Flow 3: Consent Management Flow
┌─────────────┐
│   Citizen   │
└──────┬──────┘
       │
       │ 1. View Consent Settings
       ↓
┌─────────────────────────────────┐
│   /dashboard/consent            │
│   • List all consent types      │
│   • Show current status         │
│   • Toggle buttons           │
└──────┬──────────────────────────────┘
       │
       │ 2. Toggle Consent
       │    (e.g., Grant Financial)
       ↓
┌─────────────────────────────────┐
│   POST /api/consents/{id}/      │
│        toggle/                  │
│   • Toggle UserConsent.access   │
│   • Log in ConsentHistory       │
│   • Send notification           │
└──────┬────────────────────────────┘
       │
       │ 3. Update UI
       ↓
┌─────────────────────────────────┐
│   UserConsent.access = True     │
│   • Consent granted             │
│   • Organizations can request   │
│   • History logged              │
└──────┬────────────────────────────┘
       │
       │ 4. Revoke Consent
       ↓
┌─────────────────────────────────┐
│   POST /api/consents/{id}/      │
│        toggle/                  │
│   • UserConsent.access = False  │
│   • Revoke all active access    │
│   • Notify organizations        │
└─────────────────────────────────┘

Flow 4: Transparency & Audit Trail
┌─────────────┐
│   Citizen   │
└──────┬──────┘
       │
       │ 1. View Transparency Log
       ↓
┌─────────────────────────────────┐
│   /dashboard/transparency       │
│   • View all access logs        │
│   • Filter by organization      │
│   • Filter by date              │
└──────┬────────────────────────────┘
       │
       │ 2. Fetch Transparency Data
       ↓
┌─────────────────────────────────┐
│   GET /api/consents/            │
│        transparency-log/        │
│   • Returns AccessRequest list  │
│   • Includes:                   │
│     - Organization name         │
│     - Consent type              │
│     - Status                    │
│     - Purpose                   │
│     - Timestamp                 │
└──────┬────────────────────────────┘
       │
       │ 3. Display Audit Trail
       ↓
┌─────────────────────────────────┐
│   Transparency Dashboard        │
│   • Who accessed (org)          │
│   • What data (consent type)    │
│   • When (timestamp)            │
│   • Why (purpose)               │
│   • Status (APPROVED/REVOKED)   │
└─────────────────────────────────┘

Flow 5: Trust Score & Compliance
┌──────────────────┐              ┌─────────────┐
│  Organization    │              │   Citizen   │
└────────┬─────────┘              └──────┬──────┘
         │                               │
         │ 1. Run Compliance Scan        │
         ↓                               │
┌─────────────────────────────────┐     │
│   POST /api/compliance/scan/    │     │
│   • Run NDPR rules engine       │     │
│   • Check 8 compliance rules    │     │
│   • Calculate risk score        │     │
│   • Create audit records        │     │
└──────┬──────────────────────────┘     │
       │                                 │
       │ 2. Update Trust Score           │
       ↓                                 │
┌─────────────────────────────────┐     │
│   TrustScoreEngine.calculate()  │     │
│   • Compliance (40%)            │     │
│   • Data Integrity (25%)        │     │
│   • Consent Respect (20%)       │     │
│   • Transparency (10%)          │     │
│   • User Satisfaction (5%)      │     │
└──────┬──────────────────────────┘     │
       │                                 │
       │ 3. Auto-Issue Certificate       │
       │    (if score >= 75)             │
       ↓                                 │
┌─────────────────────────────────┐     │
│   Org.trust_certificate_issued  │     │
│         = True                  │     │
│   Org.trust_level = 'VERIFIED'  │     │
└──────┬──────────────────────────┘     │
       │                                 │
       │ 4. Public Trust Registry        │
       ↓                                 │
┌─────────────────────────────────┐     │
│   GET /api/organization/        │     │
│        trust/registry/          │     │
│   • View organization rankings  │     │
│   • See trust scores            │     │
│   • Check certificates          │     │
└─────────────────────────────────┘     │
-----------------------------------------