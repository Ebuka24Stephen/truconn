"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { AuthAPI } from "@/lib/auth/api"
import { useAuth } from "@/lib/auth/context"

export default function SignUpPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [activeTab, setActiveTab] = useState("login")
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "citizen" as "citizen" | "organization",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const passwordRequirements = [
    { label: "At least 8 characters", met: formData.password.length >= 8 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(formData.password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(formData.password) },
    { label: "Contains number", met: /[0-9]/.test(formData.password) },
  ]

  const isPasswordValid = passwordRequirements.every((req) => req.met)
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password.length > 0

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.first_name || !formData.last_name || !formData.email) {
      setError("Please fill in all fields")
      return
    }

    if (!isPasswordValid) {
      setError("Password does not meet requirements")
      return
    }

    if (!passwordsMatch) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      // Map frontend role to backend role format
      const user_role = formData.role.toUpperCase() === "ORGANIZATION" ? "ORGANIZATION" : "CITIZEN"

      const signupData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password1: formData.password,
        password2: formData.confirmPassword,
        user_role: user_role as "CITIZEN" | "ORGANIZATION",
      }

      const response = await AuthAPI.signup(signupData)

      if (response.user) {
        // Map backend user to frontend format
        // Backend returns user_role field, and id should be included as primary key
        const userData = {
          id: String(response.user.id || ""), // Ensure id is a string
          first_name: response.user.first_name || formData.first_name,
          last_name: response.user.last_name || formData.last_name,
          email: response.user.email,
          role: (response.user.user_role || formData.role).toLowerCase(),
        }

        login(userData)

        // Redirect based on role
        if (formData.role === "citizen") {
          router.push("/onboarding")
        } else {
          router.push("/admin/organization")
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#004C9914' }}>
      {/* Watermark */}
      <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'url(/placeholder.svg)', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl mb-4">
            <span className="text-2xl font-bold" style={{ color: '#004C99' }}>✓</span>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#004C99' }}>TruCon NDTS</h1>
          <p className="text-[#4A4A4A]">Create your account</p>
        </div>

        {/* Form Card */}
        <Card className="bg-white/95 backdrop-blur-md border border-[#E0E4E8] shadow-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center" style={{ color: '#004C99' }}>Get Started</CardTitle>
            <CardDescription className="text-center">Join Nigeria Digital Trust System</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Trust-first notice */}
            <div className="mb-4 p-3 rounded-md border" style={{ background: '#F7F9FB', borderColor: '#E0E4E8' }}>
              <p className="text-xs" style={{ color: '#4A4A4A' }}>
                TruCon never accesses your personal information without your explicit consent. You decide what is shared,
                with whom, and for how long. You can manage and revoke consent anytime in your Dashboard.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="text-center mb-4">
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      Go to Login Page
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Error Message */}
                  {error && (
                    <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-down">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  {/* Role Selection */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{ color: '#004C99' }}>I am a</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{ borderColor: '#E0E4E8' }}
                    >
                      <option value="citizen">Citizen</option>
                      <option value="organization">Organization</option>
                    </select>
                  </div>

                  {/* First & Last Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: '#004C99' }}>First Name</label>
                      <Input
                        type="text"
                        name="first_name"
                        placeholder="John"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium" style={{ color: '#004C99' }}>Last Name</label>
                      <Input
                        type="text"
                        name="last_name"
                        placeholder="Doe"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{ color: '#004C99' }}>Email Address</label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Personal info removed as requested */}

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{ color: '#004C99' }}>Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-primary transition"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Password Requirements */}
                    <div className="mt-3 space-y-2">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center transition ${
                              req.met ? "bg-emerald-100" : "bg-neutral-200"
                            }`}
                          >
                            {req.met && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                          </div>
                          <span className={req.met ? "text-emerald-600" : "text-neutral-500"}>{req.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium" style={{ color: '#004C99' }}>Confirm Password</label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-primary transition"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.confirmPassword && (
                      <div className="flex items-center gap-2 text-xs mt-2">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center transition ${
                            passwordsMatch ? "bg-emerald-100" : "bg-red-100"
                          }`}
                        >
                          {passwordsMatch && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        </div>
                        <span className={passwordsMatch ? "text-emerald-600" : "text-red-600"}>
                          {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Terms Checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 mt-1" required />
                    <span className="text-sm" style={{ color: '#4A4A4A' }}>
                      I consent to TruCon’s data terms (manage in Dashboard).
                    </span>
                  </label>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !isPasswordValid || !passwordsMatch}
                    className="w-full"
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px" style={{ background: '#E0E4E8' }} />
              <span className="text-sm" style={{ color: '#8B95A1' }}>or</span>
              <div className="flex-1 h-px" style={{ background: '#E0E4E8' }} />
            </div>

            {/* Sign In Link */}
            <p className="text-center" style={{ color: '#4A4A4A' }}>
              Already have an account?{" "}
              <Link href="/login" className="font-semibold" style={{ color: '#004C99' }}>
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm" style={{ color: '#004C99' }}>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
