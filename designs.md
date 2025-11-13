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