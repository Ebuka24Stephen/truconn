import { getApiHeaders } from "@/lib/utils"
import { ApiInterceptor } from "@/lib/api-interceptor"

const API_BASE_URL = "https://truconn.onrender.com/api"

export interface TrustScore {
  overall_score: number
  trust_level: "EXCELLENT" | "VERIFIED" | "GOOD" | "BASIC" | "LOW"
  components: {
    compliance: number
    data_integrity: number
    consent_respect: number
    transparency: number
    user_satisfaction: number
  }
  certificate_issued: boolean
  certificate_issued_at?: string
  last_calculated: string
}

export interface OrganizationTrustData {
  organization: {
    id: number
    name: string
    email?: string
    website?: string
  }
  trust_score: number
  trust_level: string
  components: TrustScore["components"]
  certificate_issued: boolean
  certificate_issued_at?: string
  last_calculated: string
  data_integrity?: {
    organization_id: number
    organization_name: string
    total_requests: number
    verified_count: number
    integrity_score: number
    issues: Array<{
      request_id: number
      issue: string
    }>
    verified_at: string
  }
}

export interface TrustRegistryEntry {
  organization: {
    id: number
    name: string
    email: string
  }
  trust_score: number
  trust_level: string
}

export interface TrustRegistryResponse {
  count: number
  results: TrustRegistryEntry[]
}

export class TrustAPI {
  /**
   * Get public trust registry (ranked organizations)
   * GET /api/organization/trust/registry/
   */
  static async getTrustRegistry(limit: number = 10): Promise<TrustRegistryResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/organization/trust/registry/?limit=${limit}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 502) {
          throw new Error("Backend service is currently unavailable. Please try again later.")
        }

        let errorData
        try {
          errorData = await response.json()
        } catch {
          throw new Error(`Failed to get trust registry: ${response.status}`)
        }

        const errorMessage = errorData.error || errorData.detail || errorData.message || "Failed to get trust registry"
        throw new Error(errorMessage)
      }

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
   * Get trust score for a specific organization (public)
   * GET /api/organization/trust/score/<org_id>/
   */
  static async getOrganizationTrustScore(orgId: number): Promise<OrganizationTrustData> {
    try {
      const response = await fetch(`${API_BASE_URL}/organization/trust/score/${orgId}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 502) {
          throw new Error("Backend service is currently unavailable. Please try again later.")
        }

        let errorData
        try {
          errorData = await response.json()
        } catch {
          throw new Error(`Failed to get trust score: ${response.status}`)
        }

        const errorMessage = errorData.error || errorData.detail || errorData.message || "Failed to get trust score"
        throw new Error(errorMessage)
      }

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
   * Get own organization's trust score (authenticated)
   * GET /api/organization/trust/score/
   */
  static async getMyTrustScore(): Promise<OrganizationTrustData> {
    try {
      const response = await fetch(`${API_BASE_URL}/organization/trust/score/`, {
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
          throw new Error(`Failed to get trust score: ${response.status}`)
        }

        const errorMessage = errorData.error || errorData.detail || errorData.message || "Failed to get trust score"
        throw new Error(errorMessage)
      }

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
   * Get data integrity status for organization
   * GET /api/organization/trust/integrity/
   */
  static async getDataIntegrity(): Promise<OrganizationTrustData["data_integrity"]> {
    try {
      const response = await fetch(`${API_BASE_URL}/organization/trust/integrity/`, {
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
          throw new Error(`Failed to get data integrity: ${response.status}`)
        }

        const errorMessage = errorData.error || errorData.detail || errorData.message || "Failed to get data integrity"
        throw new Error(errorMessage)
      }

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

