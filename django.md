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
**Organization sends a request for data access to a specified user as long as the user allows access to the data. But if the user doesn't allow access, it throws a 400 BAD Request and and error message: "error": "User has not granted this consent."**

GET /api/organization/requested-consent/
**Authenticated users can check to see which organization sent a request for data access**

POST /api/organization/consent/<int:access_id>/toggle-access/
**Users can Approve or Revoke requests sent by organizations depending on its status**

GET /api/consents/transparency-log/
**Lists all access requests made by organizations to the logged-in user**






{
    "message": "Consent requests retrieved successfully.",
    "count": 1,
    "data": [
        {
            "id": 7,
            "organizationId": 1,
            "organizationName": "Akube Holdings",
            "dataType": "Fianacial",
            "lastAccessed": "2025-11-11T17:54:38.626650Z",
            "purpose": "for auth",
            "status": "PENDING",
            "consentId": 1
        }
    ]
}