import { getApiHeaders } from "@/lib/utils"
import type { AccessRequest } from "@/lib/organization/api"

const API_BASE_URL = "https://truconn.onrender.com/api"

export interface Consent {
  id: number
  name: string
  created_at?: string
}

export interface UserConsentResponse {
  consent: string
  access: boolean
}

export interface ConsentWithStatus {
  id: number
  name: string
  access: boolean
}

export class ConsentsAPI {
  /**
   * Get all available consent categories
   * GET /api/consents/
   */
  static async getConsents(): Promise<Consent[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/consents/`, {
        method: "GET",
        headers: getApiHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to view consents")
        }
        if (response.status === 502) {
          throw new Error("Backend service is currently unavailable. Please try again later.")
        }
        
        let errorData
        try {
          errorData = await response.json()
        } catch {
          throw new Error(`Failed to fetch consents: ${response.status}`)
        }
        
        const errorMessage = errorData.error || errorData.detail || errorData.message || "Failed to fetch consents"
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Failed to connect to server. Please check your internet connection.")
      }
      throw error
    }
  }

  /**
   * Get user consent status for all consents
   * GET /api/consents/status/
   */
  static async getUserConsentsStatus(): Promise<ConsentWithStatus[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/consents/status/`, {
        method: "GET",
        headers: getApiHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to view your consent status")
        }
        if (response.status === 502) {
          throw new Error("Backend service is currently unavailable. Please try again later.")
        }
        
        let errorData
        try {
          errorData = await response.json()
        } catch {
          throw new Error(`Failed to fetch consent status: ${response.status}`)
        }
        
        const errorMessage = errorData.error || errorData.detail || errorData.message || "Failed to fetch consent status"
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Failed to connect to server. Please check your internet connection.")
      }
      throw error
    }
  }

  /**
   * Get citizen transparency log
   * GET /api/consents/transparency-log/
   */
  static async getTransparencyLog(): Promise<{ data: AccessRequest[]; message?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/consents/transparency-log/`, {
        method: "GET",
        headers: getApiHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to view your transparency log")
        }
        if (response.status === 502) {
          throw new Error("Backend service is currently unavailable. Please try again later.")
        }

        let errorData
        try {
          errorData = await response.json()
        } catch {
          throw new Error(`Failed to fetch transparency log: ${response.status}`)
        }

        const errorMessage = errorData.error || errorData.detail || errorData.message || "Failed to fetch transparency log"
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Failed to connect to server. Please check your internet connection.")
      }
      throw error
    }
  }

  /**
   * Toggle consent (grant or revoke)
   * POST /api/consents/<consent_id>/toggle/
   */
  static async toggleConsent(consentId: number): Promise<UserConsentResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/consents/${consentId}/toggle/`, {
        method: "POST",
        headers: getApiHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to manage consents")
        }
        if (response.status === 502) {
          throw new Error("Backend service is currently unavailable. Please try again later.")
        }
        
        let errorData
        try {
          errorData = await response.json()
        } catch {
          throw new Error(`Failed to toggle consent: ${response.status}`)
        }
        
        const errorMessage = errorData.error || errorData.detail || errorData.message || "Failed to toggle consent"
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Failed to connect to server. Please check your internet connection.")
      }
      throw error
    }
  }
}


