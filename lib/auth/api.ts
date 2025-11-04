const API_BASE_URL = "https://truconn.onrender.com/api/auth"

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  first_name: string
  last_name: string
  email: string
  password1: string
  password2: string
  user_role: "CITIZEN" | "ORGANIZATION"
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

export class AuthAPI {
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
        // Add credentials for CORS
        credentials: "omit",
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

      return await response.json()
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        // Add credentials for CORS
        credentials: "omit",
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
}

