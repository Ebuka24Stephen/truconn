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
    // Organization fields
    name: "",
    website: "",
    address: "",
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

    // Validate based on role
    if (formData.role === "citizen") {
      if (!formData.first_name || !formData.last_name || !formData.email) {
        setError("Please fill in all required fields")
        return
      }
    } else if (formData.role === "organization") {
      if (!formData.name || !formData.email || !formData.address) {
        setError("Please fill in all required fields (Company name, Email, and Address)")
        return
      }
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

      const signupData: any = {
        email: formData.email,
        password1: formData.password,
        password2: formData.confirmPassword,
        user_role: user_role as "CITIZEN" | "ORGANIZATION",
      }

      // Add role-specific fields
      if (formData.role === "citizen") {
        signupData.first_name = formData.first_name
        signupData.last_name = formData.last_name
      } else {
        signupData.name = formData.name
        signupData.website = formData.website || ""
        signupData.address = formData.address
      }

      const response = await AuthAPI.signup(signupData)

      if (response.user) {
        // Normalize role
        const normalizedRole = (response.user.user_role || formData.role).toLowerCase()

        // Immediately log the user in to establish a session (cookies)
        try {
          await AuthAPI.login({ email: formData.email, password: formData.password })
        } catch {
          // If auto-login fails, fallback to login page
          router.push("/login")
          return
        }

        // Set frontend session user
        const userData = {
          id: String(response.user.id || ""),
          first_name: response.user.first_name || (formData.role === "citizen" ? formData.first_name : ""),
          last_name: response.user.last_name || (formData.role === "citizen" ? formData.last_name : ""),
          email: response.user.email,
          role: normalizedRole,
        }
        login(userData)

        // Redirect based on role
        if (normalizedRole === "organization") {
          router.push("/admin/organization")
        } else {
          router.push("/onboarding")
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="w-full max-w-md relative z-10" data-aos="fade-up">
        {/* Logo */}
        <div className="text-center mb-8" data-aos="fade-up" data-aos-delay="100">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-600 to-violet-700 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 mb-4">
            <span className="text-2xl font-bold text-white">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">TruCon NDTS</h1>
          <p className="text-gray-300">Create your account</p>
        </div>

        {/* Form Card */}
        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 backdrop-blur-xl border-purple-500/30 shadow-2xl max-h-[90vh] overflow-y-auto" data-aos="fade-up" data-aos-delay="200">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-white">Get Started</CardTitle>
            <CardDescription className="text-center text-gray-300">Join Nigeria Digital Trust System</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Trust-first notice */}
            <div className="mb-4 p-3 rounded-md border bg-purple-950/30 border-purple-500/30">
              <p className="text-xs text-purple-200">
                TruCon never accesses your personal information without your explicit consent. You decide what is shared,
                with whom, and for how long. You can manage and revoke consent anytime in your Dashboard.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-800/50 border border-purple-500/30">
                <TabsTrigger value="login" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-300 text-gray-400">Login</TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-purple-600/30 data-[state=active]:text-purple-300 text-gray-400">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="text-center mb-4" data-aos="fade-up">
                  <Link href="/login">
                    <Button variant="outline" className="w-full border-purple-500/50 text-purple-300 hover:bg-purple-500/20">
                      Go to Login Page
                    </Button>
                  </Link>
                </div>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Error Message */}
                  {error && (
                    <div className="flex gap-3 p-4 bg-red-900/30 border border-red-500/50 rounded-lg" data-aos="fade-up">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-300">{error}</p>
                    </div>
                  )}

                  {/* Role Selection */}
                  <div className="space-y-2" data-aos="fade-up" data-aos-delay="300">
                    <label className="block text-sm font-medium text-purple-300">I am a</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-white text-black"
                    >
                      <option value="citizen">Citizen</option>
                      <option value="organization">Organization</option>
                    </select>
                  </div>

                  {/* Citizen Fields */}
                  {formData.role === "citizen" && (
                    <>
                      {/* First & Last Name Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" data-aos="fade-up" data-aos-delay="400">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-purple-300">First Name</label>
                          <Input
                            type="text"
                            name="first_name"
                            placeholder="John"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                            className="w-full border-purple-500/30 bg-white text-black placeholder:text-gray-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-purple-300">Last Name</label>
                          <Input
                            type="text"
                            name="last_name"
                            placeholder="Doe"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                            className="w-full border-purple-500/30 bg-white text-black placeholder:text-gray-500"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* Organization Fields */}
                  {formData.role === "organization" && (
                    <>
                      {/* Company Name */}
                      <div className="space-y-2" data-aos="fade-up" data-aos-delay="400">
                        <label className="block text-sm font-medium text-purple-300">Company Name</label>
                        <Input
                          type="text"
                          name="name"
                          placeholder="Samixtech Solutions"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full border-purple-500/30 bg-white text-black placeholder:text-gray-500"
                        />
                      </div>
                    </>
                  )}

                  {/* Email Field */}
                  <div className="space-y-2" data-aos="fade-up" data-aos-delay="500">
                    <label className="block text-sm font-medium text-purple-300">Email Address</label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="samixtech@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border-purple-500/30 bg-white text-black placeholder:text-gray-500"
                    />
                  </div>

                  {/* Organization-specific fields */}
                  {formData.role === "organization" && (
                    <>
                      {/* Website Field */}
                      <div className="space-y-2" data-aos="fade-up" data-aos-delay="600">
                        <label className="block text-sm font-medium text-purple-300">Website</label>
                        <Input
                          type="url"
                          name="website"
                          placeholder="https://www.companyadress.com"
                          value={formData.website}
                          onChange={handleChange}
                          className="w-full border-purple-500/30 bg-white text-black placeholder:text-gray-500"
                        />
                      </div>

                      {/* Address Field */}
                      <div className="space-y-2" data-aos="fade-up" data-aos-delay="700">
                        <label className="block text-sm font-medium text-purple-300">Address</label>
                        <Input
                          type="text"
                          name="address"
                          placeholder="123 Mainland, City, State, ZIP"
                          value={formData.address}
                          onChange={handleChange}
                          required
                          className="w-full border-purple-500/30 bg-white text-black placeholder:text-gray-500"
                        />
                      </div>
                    </>
                  )}

                  {/* Personal info removed as requested */}

                  {/* Password Field */}
                  <div className="space-y-2" data-aos="fade-up" data-aos-delay="800">
                    <label className="block text-sm font-medium text-purple-300">Password</label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full pr-10 border-purple-500/30 bg-white text-black placeholder:text-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 transition"
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
                              req.met ? "bg-emerald-500/30 border border-emerald-500/50" : "bg-gray-700 border border-gray-600"
                            }`}
                          >
                            {req.met && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                          </div>
                          <span className={req.met ? "text-emerald-400" : "text-gray-400"}>{req.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2" data-aos="fade-up" data-aos-delay="900">
                    <label className="block text-sm font-medium text-purple-300">Confirm Password</label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full pr-10 border-purple-500/30 bg-white text-black placeholder:text-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 transition"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.confirmPassword && (
                      <div className="flex items-center gap-2 text-xs mt-2">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center transition ${
                            passwordsMatch ? "bg-emerald-500/30 border border-emerald-500/50" : "bg-red-500/30 border border-red-500/50"
                          }`}
                        >
                          {passwordsMatch && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        </div>
                        <span className={passwordsMatch ? "text-emerald-400" : "text-red-400"}>
                          {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Terms Checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer" data-aos="fade-up" data-aos-delay="1000">
                    <input type="checkbox" className="w-4 h-4 rounded border-purple-500/50 bg-white mt-1" required />
                    <span className="text-sm text-gray-300">
                      I consent to TruCon's data terms (manage in Dashboard).
                    </span>
                  </label>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !isPasswordValid || !passwordsMatch}
                    className="w-full trust-button"
                    data-aos="fade-up"
                    data-aos-delay="1100"
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-purple-900/30" />
              <span className="text-sm text-gray-400">or</span>
              <div className="flex-1 h-px bg-purple-900/30" />
            </div>

            {/* Sign In Link */}
            <p className="text-center text-gray-300">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-purple-400 hover:text-purple-300 transition">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6" data-aos="fade-up" data-aos-delay="1200">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
