# 🇳🇬 TruCon NDTS – Nigeria Digital Trust System

### Building Trust in Nigeria’s Digital Economy  
*A Next.js + Django system for transparency, consent, and compliance.*

---

## 🧭 Overview

Across Nigeria, organizations collect massive amounts of personal data — from banking records to biometrics. Yet, citizens lack visibility and control over how that data is used.  
Frequent data breaches, weak consent systems, and unauthorized sharing erode public trust and slow Nigeria’s digital growth.

**TruCon NDTS (Nigeria Digital Trust System)** is a technology-driven platform that empowers citizens with transparency and control over their personal data, while enabling organizations to comply with **NDPR (Nigeria Data Protection Regulation)** and global privacy standards such as **GDPR**.

---

## 🎯 Core Objectives

- **Empower Citizens:** Give individuals control to view, manage, and revoke consent for data usage.  
- **Ensure Transparency:** Provide a visual audit trail of who accessed data, when, and why.  
- **Enable Compliance:** Offer organizations AI-assisted tools to detect and correct non-compliant practices.

---

## 🏗️ System Architecture Blueprint

### 1. Frontend (Next.js)
- Framework: **Next.js 15 (App Router)**
- Styling: **TailwindCSS + shadcn/ui + Framer Motion**
- Purpose: Client-side consent control, dashboards, and compliance views.
- Features:
  - Dynamic dashboards for citizens, organizations, and regulators.
  - Smooth animations and transitions for visual trust.
  - Modular UI components for reuse (`ConsentCard`, `TransparencyTable`, `TrustMeter`, etc.).

### 2. Backend (Django + DRF)
- Framework: **Django Rest Framework (DRF)**
- Database: **PostgreSQL**
- Core Services:
  - **Authentication & Role Management**: JWT-based auth for Citizens, Organizations, and Admins.
  - **Consent Service**: Create, update, revoke, and track user consents.
  - **Audit Log Service**: Store every access or data sharing event.
  - **Compliance Engine (AI-assisted)**: Detects potential NDPR/GDPR violations.
  - **Notification System**: Alerts users when their data is accessed or consent expires.
- Integration with AI engine for compliance checks and anomaly detection.

### 3. Data Flow Summary

1. **Citizen Registration:**  
   User signs up and defines what data categories (e.g., Financial, Biometric, Health) they own and wish to manage.

2. **Organization Request:**  
   Registered organizations request data access specifying purpose, data type, and duration.

3. **Consent Management:**  
   The citizen receives a prompt to approve or reject the request. Approved requests are stored in the consent ledger.

4. **Transparency Dashboard:**  
   Citizens can monitor data access history — who accessed what, when, and for what reason.

5. **Compliance Automation:**  
   The AI-driven compliance engine scans access logs to detect unusual or non-compliant activity, alerting both the citizen and NDPR regulators.

6. **Revocation & Notifications:**  
   Users can revoke access instantly; organizations are notified via API. Actions are logged immutably for audits.

---

## 🔍 Use-Case Specific Architecture

| Layer | Components | Description |
|-------|-------------|-------------|
| **Presentation Layer (Next.js)** | Dashboards, Forms, Charts | UI for citizens, organizations, and regulators |
| **Application Layer (Django)** | Consent Service, Transparency Log Service, Compliance Engine | Processes requests and enforces rules |
| **Data Layer (PostgreSQL)** | Tables: `users`, `consents`, `access_logs`, `organizations`, `violations` | Central repository for all operations |
| **Integration Layer** | REST APIs + Webhooks | Connects third-party organizations securely |
| **Security Layer** | Encryption (AES-256), OAuth2, JWT, Audit Trail | Ensures privacy and traceability |

---

## 🖥️ User Interfaces (UI Flow)

### **Citizen Portal**
- **Overview Dashboard:** Trust meter, active consents, revoked accesses.  
- **Consent Management:** Toggle permissions for each data type (Financial, Health, Biometric, etc.).  
- **Transparency Log:** Timeline showing who accessed their data, when, and why.  
- **Settings:** Manage account, revoke access, export data report.

### **Organization Dashboard**
- **Consent Requests:** View, approve, or reject citizen consent.  
- **Access Logs:** Full audit trail of all data usage.  
- **Compliance Scanner:** AI-generated report on compliance risks.  
- **Reports:** Generate NDPR compliance PDFs.

### **Regulator (Admin) Panel**
- **National Overview:** Total registered citizens and organizations, compliance score, and recent violations.  
- **Violation Management:** Review flagged organizations, assign penalties or audits.  
- **Analytics Dashboard:** Consent trends, breach patterns, and citizen empowerment rate.

---

## 🔐 Security and Trust Framework

- **Data Encryption:** All PII encrypted at rest and in transit using AES-256 and TLS 1.3.  
- **Immutable Audit Trail:** Every consent and access logged in append-only records.  
- **Zero-Knowledge Consent Revocation:** Citizens revoke without revealing additional data.  
- **Role-Based Access Control:** Strict user role isolation — no cross-access between roles.  
- **AI Compliance Layer:** Periodic scans for anomalies or NDPR violations.

---

## ⚙️ Key APIs (Backend Concept)

| Endpoint | Method | Role | Purpose |
|-----------|--------|------|----------|
| `/api/consent/` | GET/POST | Citizen | Manage or create new consents |
| `/api/access-log/` | GET | Citizen/Org | View data access events |
| `/api/compliance/scan` | POST | Admin | Trigger compliance check |
| `/api/notifications/` | GET | Citizen | Retrieve access notifications |

---

## 💡 Innovation Highlights

- **First Citizen-Centric Data Trust Interface** for Nigeria.  
- **AI-Driven Compliance Detection** automates NDPR enforcement.  
- **Transparency by Design:** Every data access is traceable and user-verifiable.  
- **Cross-Sector Adoption:** Financial, health, and telecom industries can integrate via APIs.  
- **Modular Architecture:** Designed for scalability and international expansion.

---

## 🧩 Future Extensions

- Blockchain-based immutable consent ledger (Hyperledger or Polygon ID).  
- Integration with Nigeria’s National Identity Management System (NIMC).  
- Multi-language support for nationwide inclusivity.  
- Public transparency API for national data trust metrics.

---

## 🧑‍💻 Tech Stack Summary

| Category | Technology |
|-----------|-------------|
| Frontend | Next.js, TailwindCSS, shadcn/ui, Framer Motion |
| Backend | Django + Django REST Framework |
| Database | PostgreSQL |
| Authentication | JWT + OAuth2 |
| AI Layer | Python (Scikit-learn / Transformers for anomaly detection) |
| Deployment | Docker, Nginx, Supabase Auth Integration |
| Hosting | Vercel (Frontend) + AWS EC2 / Railway (Backend) |

---

## 🧠 How It Works — Simplified Summary

1. **User signs up** → gets a digital trust ID.  
2. **Organizations request data** → citizen gets notified.  
3. **Citizen approves or denies** → consent recorded and auditable.  
4. **Transparency dashboard** updates in real-time.  
5. **AI compliance engine** continuously scans for violations.  
6. **Regulator dashboard** monitors national compliance health.  

Result: **A transparent, citizen-first digital ecosystem that builds national trust.**

---

## 🏁 Conclusion

**TruCon NDTS** bridges the trust gap between citizens and organizations by giving power back to the data owner.  
Through transparency, consent, and compliance automation, it redefines how digital data should be handled in Africa’s largest digital economy.

> “Trust isn’t just a feature — it’s infrastructure.”

---

**Developed by:**  
👤 **[Your Name / Team Name]**  
Pro Full-Stack Engineer | Next.js & Django Specialist  
📍 Nigeria | 🌐 Global Hackathon Challenge





**Auth System**
TruConn’s authentication service provides a secure and extensible user management system built with Django REST Framework and Session Authentication.
It enables citizens and organizations to register, log in, and manage their profiles seamlessly while maintaining secure session-based authentication.
**🚀 Features**
✅ User Registration — citizens or organizations can sign up easily
🔑 Session-Based Login — uses Django’s secure session authentication
👤 Profile Auto-Creation — a profile is automatically generated for each user
🧱 Role Support — supports user roles like CITIZEN, ORGANIZATION, etc.
🧩 Modular Architecture — easily extendable for consent, data management, and more


**Login --- https://truconn.onrender.com/api/auth/login/**
------------------------------------------------------------------------------------------------
Request Body:
{
  "email": "janedoe@example.com",
  "password": "StrongPassword123!"
}

Response (200 ok)
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "janedoe@example.com",
    "role": "CITIZEN"
  }
}
---------------------------------------------------------------------------------------------------


**Signup --- https://truconn.onrender.com/api/auth/signup/**
------------------------------------------------------------------------------------------
Request Body:
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "janedoe@example.com",
  "password1": "StrongPassword123!",
  "password2": "StrongPassword123!",
  "user_role": "CITIZEN"
}

Response (201 created)
{
  "user": {
    "first_name": "Jane",
    "last_name": "Doe",
    "email": "janedoe@example.com",
    "user_role": "CITIZEN"
  },
  "profile": {
    "id": 1,
    "user": 1,
    "bio": "",
    "avatar": null
  }
}


**Profile**
GET /api/auth/profile/

**Updating profile**
PUT /api/auth/profile

GET /api/consents/ 
**It lists all available consent categories**

POST /api/consents/consent_id/toggle/
**Authenticated users can grant or revoke consent**



 POST /api/organization/consent/<uuid:user_id>/<int:consent_id>/request/
**Organization sends a request for data access to a specified user as long as the user allows access to the data. But if the user doesn't allow access, it throws a 404 Not Found and and error message: "error": "User has not granted this consent."**

GET /api/organization/requested-consent/
**Authenticated users can check to see which organization sent a request for data access**

POST /api/organization/consent/<int:access_id>/toggle-access/
**Users can Approve or Revoke requests sent by organizations depending on its status**