import { getApiHeaders } from "@/lib/utils"

const API_BASE_URL = "https://truconn.onrender.com/api/auth"

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  first_name?: string
  last_name?: string
  email: string
  password1: string
  password2: string
  user_role: "CITIZEN" | "ORGANIZATION"
  // Organization fields
  name?: string
  website?: string
  address?: string
}

export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  role: string
}

export interface LoginResponse {
  user: User
  access?: string
  refresh?: string
  csrfToken?: string
}

export interface SignupResponse {
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
    user_role: string
  }
  profile: {
    id: string
    user: string
    title: string
    company: string
    url: string
    phone_no: string
    about: string
    profile_pic: string | null
  }
}

export interface Profile {
  id: number
  user: string
  title: string
  company: string
  url: string
  phone_no: string
  about: string
  profile_pic: string | null
}

export interface UpdateProfileData {
  title?: string
  company?: string
  url?: string
  phone_no?: string
  about?: string
}

export class AuthAPI {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: getApiHeaders(),
        body: JSON.stringify(credentials),
        credentials: "include",
      })

      // Handle network errors
      if (!response.ok) {
        // Check for 502 Bad Gateway (backend down)
        if (response.status === 502) {
          throw new Error("Backend service is currently unavailable. Please try again later or check if the backend is running.")
        }
        
        let errorData
        try {
          errorData = await response.json()
        } catch {
          // If response is not JSON, check status
          if (response.status === 0 || response.status >= 500) {
            throw new Error("Server error. The backend service may be down. Please check if the backend is running.")
          }
          throw new Error(`Request failed with status ${response.status}`)
        }
        
        const errorMessage = errorData.error || errorData.detail || errorData.message || "Login failed"
        throw new Error(errorMessage)
      }

      const data = await response.json()
      return data
    } catch (error) {
      // Handle network/CORS errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Failed to connect to server. Please check your internet connection and ensure the backend is running.")
      }
      throw error
    }
  }

  static async signup(data: SignupData): Promise<SignupResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/signup/`, {
        method: "POST",
        headers: getApiHeaders(),
        body: JSON.stringify(data),
        credentials: "include",
      })

      // Handle network errors
      if (!response.ok) {
        // Check for 502 Bad Gateway (backend down)
        if (response.status === 502) {
          throw new Error("Backend service is currently unavailable. Please try again later or check if the backend is running.")
        }
        
        let errorData
        try {
          errorData = await response.json()
        } catch {
          // If response is not JSON, check status
          if (response.status === 0 || response.status >= 500) {
            throw new Error("Server error. The backend service may be down. Please check if the backend is running.")
          }
          throw new Error(`Request failed with status ${response.status}`)
        }
        
        const errorMessage = 
          errorData.email?.[0] || 
          errorData.password1?.[0] || 
          errorData.non_field_errors?.[0] || 
          errorData.error || 
          errorData.detail ||
          "Signup failed"
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      // Handle network/CORS errors
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error("Failed to connect to server. Please check your internet connection and ensure the backend is running.")
      }
      throw error
    }
  }

  /**
   * Get user profile
   * GET /api/auth/profile/
   */
  static async getProfile(): Promise<Profile> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        method: "GET",
        headers: getApiHeaders(),
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to view your profile")
        }
        if (response.status === 502) {
          throw new Error("Backend service is currently unavailable. Please try again later.")
        }
        
        let errorData
        try {
          errorData = await response.json()
        } catch {
          throw new Error(`Failed to fetch profile: ${response.status}`)
        }
        
        const errorMessage = errorData.error || errorData.detail || errorData.message || "Failed to fetch profile"
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
   * Update user profile
   * PUT /api/auth/profile/
   */
  static async updateProfile(data: UpdateProfileData): Promise<Profile> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        method: "PUT",
        headers: getApiHeaders(),
        body: JSON.stringify(data),
        credentials: "include",
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to update your profile")
        }
        if (response.status === 502) {
          throw new Error("Backend service is currently unavailable. Please try again later.")
        }
        
        let errorData
        try {
          errorData = await response.json()
        } catch {
          throw new Error(`Failed to update profile: ${response.status}`)
        }
        
        const errorMessage = 
          errorData.title?.[0] ||
          errorData.company?.[0] ||
          errorData.url?.[0] ||
          errorData.phone_no?.[0] ||
          errorData.about?.[0] ||
          errorData.error || 
          errorData.detail || 
          errorData.message || 
          "Failed to update profile"
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
   * Logout current session
   * POST /api/auth/logout/
   */
  static async logout(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/logout/`, {
        method: "POST",
        headers: getApiHeaders(),
        credentials: "include",
      })
      if (!response.ok) {
        throw new Error("Failed to log out")
      }
    } catch (error) {
      // swallow errors to avoid trapping user in logged-in UI if server failed
      // Consumers may choose to ignore logout failures
      throw error
    }
  }
}

