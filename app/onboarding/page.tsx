"use client"

import { OnboardingStepper } from '@/components/onboarding-stepper'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/lib/auth/context'
import { AuthAPI } from '@/lib/auth/api'

export default function OnboardingPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/onboarding')
    }
  }, [isLoading, isAuthenticated, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-600 to-violet-700 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/50 mb-4 animate-pulse">
            <span className="text-2xl font-bold text-white">✓</span>
          </div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated (redirect will happen)
  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10 relative z-10">
        <div className="flex items-center gap-2 mb-8" data-aos="fade-up">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-violet-700 shadow-lg shadow-purple-500/50">
            <span className="text-white font-bold">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-white">TruCon Onboarding</h1>
        </div>
        <OnboardingStepper 
          user={user} 
          onFinish={() => {
            // Mark onboarding as completed
            localStorage.setItem('onboarding_completed', 'true')
            // Redirect based on role
            if (user.role === 'organization' || user.role === 'ORGANIZATION') {
              router.push('/admin/organization')
            } else {
              router.push('/dashboard')
            }
          }} 
        />
      </div>
    </div>
  )
}
