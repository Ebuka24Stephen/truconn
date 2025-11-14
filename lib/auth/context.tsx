"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { User } from "./api"
import { SessionManager } from "./session"
import { AuthAPI } from "./api"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load user from session on mount
    const loadUser = () => {
      const savedUser = SessionManager.getUser()
      if (savedUser) {
        setUser(savedUser)
      } else {
        setUser(null)
      }
      setIsLoading(false)
    }
    loadUser()

    // Listen for storage changes (e.g., when another tab logs out)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "truconn_user" || e.key === null) {
        const savedUser = SessionManager.getUser()
        if (savedUser) {
          setUser(savedUser)
        } else {
          setUser(null)
        }
      }
    }

    if (typeof window !== "undefined") {
      window.addEventListener('storage', handleStorageChange)
      return () => window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const login = (userData: User) => {
    // Set new user data first, then clear only if necessary
    // This prevents race conditions where the session is cleared before it's set
    try {
      SessionManager.setUser(userData)
      setUser(userData)
      // Trigger storage event to sync across tabs
      if (typeof window !== "undefined") {
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'truconn_user',
          newValue: JSON.stringify(userData)
        }))
      }
    } catch (error) {
      console.error("Error setting user session:", error)
      // Only clear if setting failed
      SessionManager.clearSession()
      setUser(null)
    }
  }

  const logout = async () => {
    try {
      // Call backend logout API to clear server session
      await AuthAPI.logout()
    } catch (error) {
      // Continue with local logout even if backend call fails
      console.error("Logout API call failed:", error)
    } finally {
      // Always clear local session
      SessionManager.clearSession()
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

