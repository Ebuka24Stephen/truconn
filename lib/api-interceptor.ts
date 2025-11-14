"use client"

import { SessionManager } from "./auth/session"
import { AuthAPI } from "./auth/api"

/**
 * Centralized API response handler that automatically logs out on 401
 * and tracks user activity to reset session timeout
 */
export class ApiInterceptor {
  private static lastActivityTime: number = Date.now()
  private static activityCheckInterval: NodeJS.Timeout | null = null
  private static readonly INACTIVITY_TIMEOUT = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds (matches refresh token)

  /**
   * Initialize activity tracking
   */
  static init() {
    if (typeof window === "undefined") return

    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    const updateActivity = () => {
      this.lastActivityTime = Date.now()
      // Store last activity in localStorage for persistence across tabs
      localStorage.setItem('last_activity', this.lastActivityTime.toString())
    }

    events.forEach(event => {
      window.addEventListener(event, updateActivity, { passive: true })
    })

    // Check for inactivity periodically
    this.activityCheckInterval = setInterval(() => {
      this.checkInactivity()
    }, 60000) // Check every minute

    // Load last activity time from localStorage
    const savedActivity = localStorage.getItem('last_activity')
    if (savedActivity) {
      this.lastActivityTime = parseInt(savedActivity, 10)
    }
  }

  /**
   * Check if user has been inactive for too long
   */
  private static async checkInactivity() {
    const now = Date.now()
    const timeSinceActivity = now - this.lastActivityTime

    if (timeSinceActivity >= this.INACTIVITY_TIMEOUT) {
      // User has been inactive for 5 hours, log them out
      await this.handleSessionExpired()
    }
  }

  /**
   * Handle session expiration - automatically log out
   */
  static async handleSessionExpired() {
    // Clear activity tracking
    localStorage.removeItem('last_activity')
    
    // Clear session
    SessionManager.clearSession()
    
    // Try to call backend logout (but don't wait for it)
    AuthAPI.logout().catch(() => {
      // Ignore errors - we're logging out anyway
    })

    // Redirect to login with session expired message
    if (typeof window !== "undefined") {
      window.location.href = "/login?expired=true"
    }
  }

  /**
   * Handle API response - check for 401 and auto-logout
   */
  static async handleResponse<T>(response: Response, apiCall: () => Promise<T>): Promise<T> {
    if (response.status === 401) {
      // Session expired - automatically log out
      await this.handleSessionExpired()
      throw new Error("Your session has expired. Please log in again.")
    }

    // Update activity on successful API call
    this.lastActivityTime = Date.now()
    localStorage.setItem('last_activity', this.lastActivityTime.toString())

    return apiCall()
  }

  /**
   * Cleanup activity tracking
   */
  static cleanup() {
    if (this.activityCheckInterval) {
      clearInterval(this.activityCheckInterval)
      this.activityCheckInterval = null
    }
  }
}

