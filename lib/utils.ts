import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get CSRF token from cookies
 * Django sets the CSRF token in a cookie named 'csrftoken'
 */
export function getCsrfToken(): string | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  const csrfCookie = cookies.find((c) => c.trim().startsWith('csrftoken='))
  
  if (csrfCookie) {
    return decodeURIComponent(csrfCookie.split('=')[1])
  }
  
  return null
}

/**
 * Get default headers for API requests
 * Includes CSRF token if available
 */
export function getApiHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  // Prefer JWT Bearer token; fallback to CSRF for session-based endpoints
  if (typeof window !== 'undefined') {
    try {
      const jwt = window.localStorage.getItem('truconn_jwt')
      if (jwt) {
        headers['Authorization'] = `Bearer ${jwt}`
      } else {
        // Legacy token (may contain CSRF from earlier versions)
        const legacy = window.localStorage.getItem('truconn_token')
        const csrfToken = getCsrfToken() || legacy || null
        if (csrfToken) {
          headers['X-CSRFToken'] = csrfToken
        }
      }
    } catch {
      // ignore storage errors
    }
  }
  
  return headers
}