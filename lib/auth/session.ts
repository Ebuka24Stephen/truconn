"use client"

import { User } from "./api"

const USER_KEY = "truconn_user"
const TOKEN_KEY = "truconn_token" // legacy CSRF or misc token
const JWT_TOKEN_KEY = "truconn_jwt"
const COOKIE_USER_KEY = "truconn_user"

export interface SessionData {
  user: User
  token?: string
}

export class SessionManager {
  static setUser(user: User): void {
    if (typeof window !== "undefined") {
      // Store in localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      
      // Also set cookie for server-side middleware access
      const expires = new Date()
      expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days
      document.cookie = `${COOKIE_USER_KEY}=${encodeURIComponent(JSON.stringify(user))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
    }
  }

  static getUser(): User | null {
    if (typeof window === "undefined") return null
    
    try {
      // Try localStorage first
      const userStr = localStorage.getItem(USER_KEY)
      if (userStr) {
        return JSON.parse(userStr) as User
      }
      
      // Fallback to cookie
      const cookies = document.cookie.split(";")
      const userCookie = cookies.find((c) => c.trim().startsWith(`${COOKIE_USER_KEY}=`))
      if (userCookie) {
        const userValue = decodeURIComponent(userCookie.split("=")[1])
        const user = JSON.parse(userValue) as User
        // Sync to localStorage
        localStorage.setItem(USER_KEY, userValue)
        return user
      }
      
      return null
    } catch {
      return null
    }
  }

  static setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token)
    }
  }

  static setJwtToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(JWT_TOKEN_KEY, token)
    }
  }

  static getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(TOKEN_KEY)
  }

  static getJwtToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(JWT_TOKEN_KEY)
  }

  static clearSession(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(JWT_TOKEN_KEY)
      
      // Clear cookie
      document.cookie = `${COOKIE_USER_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    }
  }

  static isAuthenticated(): boolean {
    return this.getUser() !== null
  }
}

