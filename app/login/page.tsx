"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { AuthAPI } from "@/lib/auth/api"
import { useAuth } from "@/lib/auth/context"
import { SessionManager } from "@/lib/auth/session"
import { getCsrfToken } from "@/lib/utils"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Check for session expired message
  useEffect(() => {
    const expired = searchParams.get("expired")
    if (expired === "true") {
      setError("Your session has expired due to inactivity. Please log in again.")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await AuthAPI.login({ email, password })
      
      if (response.user) {
        // Normalize role to lowercase exactly once
        const normalizedRole = (response.user.role || "citizen").toLowerCase()
        const userData = {
          ...response.user,
          role: normalizedRole,
        }
        
        // Persist JWT access token FIRST (before setting user to prevent conflicts)
        if ((response as any).access) {
          // Store JWT for Authorization header
          SessionManager.setJwtToken((response as any).access)
        } else {
          // Fallback: persist CSRF token for session-based POST/PUT if needed
          const csrf = getCsrfToken()
          if (csrf) {
            SessionManager.setToken(csrf)
          }
        }
        
        // Set user data AFTER token is stored to ensure session is complete
        login(userData)
        
        // Small delay to ensure state is set before redirect
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Check for redirect parameter
        const redirectTo = searchParams.get("redirect")
        
        // For organizations, check if onboarding is needed
        if (normalizedRole === "organization" && !redirectTo) {
          // Check if organization has completed onboarding
          // This is a simple check - you can enhance it with an API call
          const onboardingCompleted = localStorage.getItem("onboarding_completed")
          
          if (!onboardingCompleted) {
            // Show onboarding option modal or redirect
            const shouldOnboard = window.confirm(
              "Welcome! Would you like to complete your organization setup now? " +
              "You can skip this and do it later from your dashboard."
            )
            
            if (shouldOnboard) {
              window.location.href = "/admin/organization/onboarding"
              return
            } else {
              // Mark as skipped (user can access it later from sidebar)
              localStorage.setItem("onboarding_skipped", "true")
            }
          }
        }
        
        if (redirectTo) {
          // Use window.location for hard redirect to clear any cached state
          window.location.href = redirectTo
        } else {
          // Redirect based on role - use hard redirect to ensure fresh state
          if (normalizedRole === "organization") {
            window.location.href = "/admin/organization"
          } else {
            window.location.href = "/dashboard"
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="w-full max-w-md relative z-10" data-aos="fade-up">
        {/* Logo */}
        <div className="text-center mb-8" data-aos="fade-up" data-aos-delay="100">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-600 to-violet-700 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 mb-4">
            <span className="text-2xl font-bold text-white">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">TruCon</h1>
          <p className="text-gray-300">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 backdrop-blur-xl border-purple-500/30 shadow-2xl p-6 sm:p-8" data-aos="fade-up" data-aos-delay="200">
          {/* Trust-first notice */}
          <div className="mb-4 p-3 rounded-md border bg-purple-950/30 border-purple-500/30">
            <p className="text-xs text-purple-200">
              TruCon never accesses your personal information without your explicit consent. Manage what your information
              is used for in your Dashboard at any time.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex gap-3 p-4 bg-red-900/30 border border-red-500/50 rounded-lg" data-aos="fade-up">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2" data-aos="fade-up" data-aos-delay="300">
              <label className="block text-sm font-medium text-purple-300">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white text-black placeholder:text-gray-500"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2" data-aos="fade-up" data-aos-delay="400">
              <label className="block text-sm font-medium text-purple-300">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white text-black placeholder:text-gray-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm" data-aos="fade-up" data-aos-delay="500">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-purple-500/50 bg-white" />
                <span className="text-gray-300">Remember me</span>
              </label>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading} className="w-full trust-button" data-aos="fade-up" data-aos-delay="600">
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-purple-900/30" />
            <span className="text-sm text-gray-400">or</span>
            <div className="flex-1 h-px bg-purple-900/30" />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-300">
            Don't have an account?{" "}
            <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-semibold transition">
              Sign up
            </Link>
          </p>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6" data-aos="fade-up" data-aos-delay="700">
          <Link href="/" className="text-gray-400 hover:text-white transition text-sm">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-600 to-violet-700 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 mb-4">
              <span className="text-2xl font-bold text-white">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">TruCon</h1>
            <p className="text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
