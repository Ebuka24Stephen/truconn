// Mock data for TruCon NDTS

export interface Organization {
  id: string
  name: string
  type: string
  status: "verified" | "pending" | "revoked"
  dataTypes: string[]
  lastAccessed: string
  purpose: string
}

export interface DataAccess {
  id: string
  organizationId: string
  organizationName: string
  dataType: "Financial" | "Biometric" | "Health" | "Identity" | "Contact"
  lastAccessed: string
  purpose: string
  status: "active" | "revoked"
}

export interface Consent {
  id: string
  category: "Financial" | "Biometric" | "Health" | "Identity"
  allowed: boolean
  organizations: string[]
  duration: string
  details: string
}

export interface AccessLog {
  id: string
  organizationName: string
  dateTime: string
  purpose: string
  accessType: "Read" | "Write"
}

export interface ConsentRequest {
  id: string
  citizenName: string
  dataType: string
  purpose: string
  status: "pending" | "approved" | "revoked"
  requestedAt: string
}

export interface Violation {
  id: string
  orgName: string
  issueType: string
  date: string
  status: "investigating" | "resolved" | "pending"
  actionTaken: string
}

// Mock Organizations
export const mockOrganizations: Organization[] = [
  {
    id: "1",
    name: "First Bank of Nigeria",
    type: "Banking",
    status: "verified",
    dataTypes: ["Financial", "Identity"],
    lastAccessed: "2025-01-15",
    purpose: "Account verification",
  },
  {
    id: "2",
    name: "Lagos State Health Services",
    type: "Healthcare",
    status: "verified",
    dataTypes: ["Health", "Identity"],
    lastAccessed: "2025-01-14",
    purpose: "Medical records access",
  },
  {
    id: "3",
    name: "Nigerian Immigration Service",
    type: "Government",
    status: "verified",
    dataTypes: ["Biometric", "Identity"],
    lastAccessed: "2025-01-10",
    purpose: "Identity verification",
  },
  {
    id: "4",
    name: "University of Lagos",
    type: "Education",
    status: "pending",
    dataTypes: ["Identity", "Contact"],
    lastAccessed: "2025-01-12",
    purpose: "Student enrollment",
  },
]

// Mock Data Access
export const mockDataAccess: DataAccess[] = [
  {
    id: "1",
    organizationId: "1",
    organizationName: "First Bank of Nigeria",
    dataType: "Financial",
    lastAccessed: "2025-01-15T10:30:00",
    purpose: "Account verification",
    status: "active",
  },
  {
    id: "2",
    organizationId: "2",
    organizationName: "Lagos State Health Services",
    dataType: "Health",
    lastAccessed: "2025-01-14T14:20:00",
    purpose: "Medical records access",
    status: "active",
  },
  {
    id: "3",
    organizationId: "3",
    organizationName: "Nigerian Immigration Service",
    dataType: "Biometric",
    lastAccessed: "2025-01-10T09:15:00",
    purpose: "Identity verification",
    status: "active",
  },
  {
    id: "4",
    organizationId: "4",
    organizationName: "University of Lagos",
    dataType: "Identity",
    lastAccessed: "2025-01-12T11:45:00",
    purpose: "Student enrollment",
    status: "revoked",
  },
]

// Mock Consents
export const mockConsents: Consent[] = [
  {
    id: "1",
    category: "Financial",
    allowed: true,
    organizations: ["First Bank of Nigeria", "GTBank"],
    duration: "1 year",
    details: "Bank account details, transaction history",
  },
  {
    id: "2",
    category: "Biometric",
    allowed: true,
    organizations: ["Nigerian Immigration Service"],
    duration: "2 years",
    details: "Fingerprint, facial recognition data",
  },
  {
    id: "3",
    category: "Health",
    allowed: true,
    organizations: ["Lagos State Health Services"],
    duration: "Ongoing",
    details: "Medical records, health history",
  },
  {
    id: "4",
    category: "Identity",
    allowed: false,
    organizations: [],
    duration: "-",
    details: "National ID, passport information",
  },
]

// Mock Access Logs
export const mockAccessLogs: AccessLog[] = [
  {
    id: "1",
    organizationName: "First Bank of Nigeria",
    dateTime: "2025-01-15T10:30:00",
    purpose: "Account verification",
    accessType: "Read",
  },
  {
    id: "2",
    organizationName: "Lagos State Health Services",
    dateTime: "2025-01-14T14:20:00",
    purpose: "Medical records access",
    accessType: "Read",
  },
  {
    id: "3",
    organizationName: "Nigerian Immigration Service",
    dateTime: "2025-01-10T09:15:00",
    purpose: "Identity verification",
    accessType: "Read",
  },
  {
    id: "4",
    organizationName: "GTBank",
    dateTime: "2025-01-08T16:45:00",
    purpose: "Loan application",
    accessType: "Read",
  },
]

// Mock Consent Requests (for Organization dashboard)
export const mockConsentRequests: ConsentRequest[] = [
  {
    id: "1",
    citizenName: "Adebayo Johnson",
    dataType: "Financial",
    purpose: "Loan application",
    status: "pending",
    requestedAt: "2025-01-15T08:00:00",
  },
  {
    id: "2",
    citizenName: "Chinwe Okafor",
    dataType: "Identity",
    purpose: "Employment verification",
    status: "approved",
    requestedAt: "2025-01-14T10:30:00",
  },
  {
    id: "3",
    citizenName: "Emeka Okonkwo",
    dataType: "Health",
    purpose: "Insurance enrollment",
    status: "pending",
    requestedAt: "2025-01-13T14:20:00",
  },
]

// Mock Violations (for Admin dashboard)
export const mockViolations: Violation[] = [
  {
    id: "1",
    orgName: "QuickFinance Ltd",
    issueType: "Unauthorized Data Access",
    date: "2025-01-10",
    status: "investigating",
    actionTaken: "Access suspended pending investigation",
  },
  {
    id: "2",
    orgName: "MediCare Hospital",
    issueType: "Consent Expiration",
    date: "2025-01-08",
    status: "resolved",
    actionTaken: "Consent renewal requested and approved",
  },
]

// Analytics data
export const mockStats = {
  citizens: 125000,
  organizations: 850,
  complianceRate: 94.5,
  violations: 12,
}
