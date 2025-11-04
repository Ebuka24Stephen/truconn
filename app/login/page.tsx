"use client"

import type React from "react"
import { useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { AuthAPI } from "@/lib/auth/api"
import { useAuth } from "@/lib/auth/context"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await AuthAPI.login({ email, password })
      
      if (response.user) {
        // Map backend user role to match frontend expectations
        const userData = {
          ...response.user,
          role: response.user.role?.toLowerCase() || "citizen",
        }
        login(userData)
        
        // Check for redirect parameter
        const redirectTo = searchParams.get("redirect")
        if (redirectTo) {
          router.push(redirectTo)
        } else {
          // Redirect based on role
          if (userData.role === "organization" || userData.role === "ORGANIZATION") {
            router.push("/admin/organization")
          } else {
            router.push("/dashboard")
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl mb-4">
            <span className="text-2xl font-bold text-primary">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">TruCon</h1>
          <p className="text-white/80">Sign in to your account</p>
        </div>

        {/* Form Card */}
        <Card className="bg-white/95 backdrop-blur-md border-white/20 shadow-2xl p-6 sm:p-8">
          {/* Trust-first notice */}
          <div className="mb-4 p-3 rounded-md border bg-neutral-50 border-neutral-200">
            <p className="text-xs text-neutral-700">
              TruCon never accesses your personal information without your explicit consent. Manage what your information
              is used for in your Dashboard at any time.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-down">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-primary">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-primary transition"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-neutral-300" />
                <span className="text-neutral-600">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:text-primary-light transition font-medium">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-neutral-300" />
            <span className="text-sm text-neutral-500">or</span>
            <div className="flex-1 h-px bg-neutral-300" />
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-neutral-600">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:text-primary-light font-semibold transition">
              Sign up
            </Link>
          </p>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-white/80 hover:text-white transition text-sm">
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
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary-light to-primary flex items-center justify-center p-4">
        <div className="w-full max-w-md relative z-10 animate-fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl mb-4">
              <span className="text-2xl font-bold text-primary">✓</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">TruCon</h1>
            <p className="text-white/80">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
