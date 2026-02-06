"use client"

import { User } from "./api"

// Storage keys
const USER_KEY = "truconn_user"

// Legacy / misc token (keep for backwards compatibility if some parts still use it)
const TOKEN_KEY = "truconn_token"

// JWT tokens (recommended)
const JWT_ACCESS_KEY = "truconn_jwt_access"
const JWT_REFRESH_KEY = "truconn_jwt_refresh"

// Minimal cookie keys (avoid storing full user JSON in cookies)
const COOKIE_ROLE_KEY = "truconn_role"
const COOKIE_UID_KEY = "truconn_uid"

export interface SessionData {
  user: User
  token?: string
}

export class SessionManager {
  /**
   * Store user in localStorage ONLY.
   * (Avoid storing full JSON user object in cookies—size/encoding issues and unreliable.)
   */
  static setUser(user: User): void {
    if (typeof window === "undefined") return
    localStorage.setItem(USER_KEY, JSON.stringify(user))

    // If you need something for middleware/server-side checks, store SMALL pieces only:
    const expires = new Date()
    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const uid = (user as any)?.id ?? (user as any)?.pk ?? ""
    const role = (user as any)?.role ?? (user as any)?.user_role ?? ""

    if (uid !== undefined) {
      document.cookie = `${COOKIE_UID_KEY}=${encodeURIComponent(String(uid))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
    }
    if (role) {
      document.cookie = `${COOKIE_ROLE_KEY}=${encodeURIComponent(String(role))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`
    }
  }

  static getUser(): User | null {
    if (typeof window === "undefined") return null
    try {
      const userStr = localStorage.getItem(USER_KEY)
      if (!userStr) return null
      return JSON.parse(userStr) as User
    } catch {
      return null
    }
  }

  /**
   * Legacy token setter/getter (keep if older code uses it).
   */
  static setToken(token: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem(TOKEN_KEY, token)
  }

  static getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(TOKEN_KEY)
  }

  /**
   * JWT token storage (preferred).
   * Store access + refresh (refresh optional depending on backend).
   */
  static setJwtTokens(access: string, refresh?: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem(JWT_ACCESS_KEY, access)
    if (refresh) localStorage.setItem(JWT_REFRESH_KEY, refresh)
  }

  static setJwtAccessToken(access: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem(JWT_ACCESS_KEY, access)
  }

  static getJwtAccessToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(JWT_ACCESS_KEY)
  }

  static getJwtRefreshToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(JWT_REFRESH_KEY)
  }

  /**
   * Backwards-compatible alias (if other parts call getJwtToken()).
   * Returns ACCESS token.
   */
  static getJwtToken(): string | null {
    return this.getJwtAccessToken()
  }

  /**
   * Clear everything this app uses for auth/session.
   */
  static clearSession(): void {
    if (typeof window === "undefined") return

    // localStorage
    localStorage.removeItem(USER_KEY)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(JWT_ACCESS_KEY)
    localStorage.removeItem(JWT_REFRESH_KEY)

    // cookies (include Django cookies if they exist)
    const cookiesToClear = [
      COOKIE_UID_KEY,
      COOKIE_ROLE_KEY,
      "sessionid", // Django session cookie
      "csrftoken", // CSRF token cookie
    ]

    cookiesToClear.forEach((cookieName) => {
      // Clear for current path
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
      // Clear for root domain (some deployments)
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname};`
      // Clear variants (helps across browsers/envs)
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=None; Secure`
    })
  }

  /**
   * IMPORTANT: Authenticated should mean "JWT exists" (and optionally user exists).
   * This prevents the "user exists but not logged in" false-positive.
   */
  static isAuthenticated(): boolean {
    return this.getUser() !== null && !!this.getJwtAccessToken()
  }
}
