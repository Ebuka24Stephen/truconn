import { getApiHeaders } from "@/lib/utils"
import { ApiInterceptor } from "@/lib/api-interceptor"

const API_BASE_URL = "https://truconn.onrender.com/api"

export interface AccessRequest {
  id: number
  organizationId: number
  organizationName: string
  dataType: string
  lastAccessed: string
  purpose: string
  status: "PENDING" | "APPROVED" | "REVOKED"
  consentId: number
}

export interface RequestedConsentResponse {
  message: string
  count?: number
  data: AccessRequest[]
}

export interface ConsentRequestResponse {
  message: string
  data: AccessRequest
}

export interface ToggleAccessResponse {
  message: string
}

export interface OrganizationData {
  id: number
  name: string
  email: string
  website: string | null
  address: string
  trust_score: number | null
  trust_level: string
}

export interface OrganizationDetailResponse {
  organization: OrganizationData
}

export class OrganizationAPI {
  /**
   * Get current organization's data
   * GET /api/organization/detail/
   */
  static async getOrganizationDetail(): Promise<OrganizationDetailResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/organization/detail/`, {
        method: "GET",
        headers: getApiHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401) {
          await ApiInterceptor.handleSessionExpired()
          throw new Error("Your session has expired. Please log in again.")
        }
        if (response.status === 403) {
          throw new Error("Organization access required")
        }
        if (response.status === 404) {
          throw new Error("Organization not found")
        }
        if (response.status === 502) {
          throw new Error("Backend service is currently unavailable. Please try again later.")
        }
        
        let errorData
        try {
          errorData = await response.json()
        } catch {
          throw new Error(`Failed to fetch organization: ${response.status}`)
        }
        
        const errorMessage = errorData.error || errorData.detail || errorData.message || "Failed to fetch organization"
        throw new Error(errorMessage)
      }

      // Update activity on successful API call
      const data = await response.json()
      if (typeof window !== "undefined") {
        const now = Date.now()
        localStorage.setItem('last_activity', now.toString())
      }
      return data
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Failed to connect to server. Please check your internet connection.")
      }
      throw error
    }
  }

  static async getCitizens(): Promise<Array<{ id: number; full_name: string; access_requests: Array<{ consent: string; purpose: string; status: string; requested_at: string }> }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/organization/citizens/list/`, {
        method: "GET",
        headers: getApiHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401) {
          await ApiInterceptor.handleSessionExpired()
          throw new Error("Your session has expired. Please log in again.")
        }
        let errorData
        try { errorData = await response.json() } catch { throw new Error(`Failed to fetch citizens: ${response.status}`) }
        throw new Error(errorData.error || errorData.detail || errorData.message || "Failed to fetch citizens")
      }

      // Update activity on successful API call
      const data = await response.json()
      if (typeof window !== "undefined") {
        const now = Date.now()
        localStorage.setItem('last_activity', now.toString())
      }
      return Array.isArray(data) ? data : []
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Failed to connect to server. Please check your internet connection.")
      }
      throw error
    }
  }
  /**
   * Get all consent requests for the authenticated user
   * GET /api/organization/requested-consent/
   */
  static async getRequestedConsents(): Promise<RequestedConsentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/organization/requested-consent/`, {
        method: "GET",
        headers: getApiHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401) {
          await ApiInterceptor.handleSessionExpired()
          throw new Error("Your session has expired. Please log in again.")
        }
        if (response.status === 502) {
          throw new Error("Backend service is currently unavailable. Please try again later.")
        }
        
        let errorData
        try {
          errorData = await response.json()
        } catch {
          throw new Error(`Failed to fetch consent requests: ${response.status}`)
        }
        
        const errorMessage = errorData.error || errorData.detail || errorData.message || "Failed to fetch consent requests"
        throw new Error(errorMessage)
      }

      // Update activity on successful API call
      const data = await response.json()
      if (typeof window !== "undefined") {
        const now = Date.now()
        localStorage.setItem('last_activity', now.toString())
      }
      return data
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Failed to connect to server. Please check your internet connection.")
      }
      throw error
    }
  }

  /**
   * Request access to a user's consent
   * POST /api/organization/consent/<user_id>/<consent_id>/request/
   */
  static async requestConsent(userId: string, consentId: number, purpose: string): Promise<ConsentRequestResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/organization/consent/${userId}/${consentId}/request/`, {
        method: "POST",
        headers: getApiHeaders(),
        body: JSON.stringify({ purpose }),
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 400) {
          let errorData
          try {
            errorData = await response.json()
          } catch {
            throw new Error("User has not granted this consent.")
          }
          throw new Error(errorData.error || "User has not granted this consent.")
        }
        if (response.status === 401) {
          await ApiInterceptor.handleSessionExpired()
          throw new Error("Your session has expired. Please log in again.")
        }
        if (response.status === 403) {
          throw new Error("Only organizations can request access")
        }
        if (response.status === 502) {
          throw new Error("Backend service is currently unavailable. Please try again later.")
        }
        
        let errorData
        try {
          errorData = await response.json()
        } catch {
          throw new Error(`Failed to request consent: ${response.status}`)
        }
        
        const errorMessage = errorData.error || errorData.detail || errorData.message || "Failed to request consent"
        throw new Error(errorMessage)
      }

      // Update activity on successful API call
      const data = await response.json()
      if (typeof window !== "undefined") {
        const now = Date.now()
        localStorage.setItem('last_activity', now.toString())
      }
      return data
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Failed to connect to server. Please check your internet connection.")
      }
      throw error
    }
  }

  /**
   * Toggle access request (approve or revoke)
   * POST /api/organization/consent/<access_id>/toggle-access/
   */
  static async toggleAccess(accessId: number): Promise<ToggleAccessResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/organization/consent/${accessId}/toggle-access/`, {
        method: "POST",
        headers: getApiHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401) {
          await ApiInterceptor.handleSessionExpired()
          throw new Error("Your session has expired. Please log in again.")
        }
        if (response.status === 404) {
          throw new Error("Access request not found")
        }
        if (response.status === 502) {
          throw new Error("Backend service is currently unavailable. Please try again later.")
        }
        
        let errorData
        try {
          errorData = await response.json()
        } catch {
          throw new Error(`Failed to toggle access: ${response.status}`)
        }
        
        const errorMessage = errorData.error || errorData.detail || errorData.message || "Failed to toggle access"
        throw new Error(errorMessage)
      }

      // Update activity on successful API call
      const data = await response.json()
      if (typeof window !== "undefined") {
        const now = Date.now()
        localStorage.setItem('last_activity', now.toString())
      }
      return data
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Failed to connect to server. Please check your internet connection.")
      }
      throw error
    }
  }
}


