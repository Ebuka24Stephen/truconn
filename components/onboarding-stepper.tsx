"use client"

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Stepper } from '@/components/ui/stepper'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { User } from '@/lib/auth/api'
import { AuthAPI } from '@/lib/auth/api'
import { AlertCircle, CheckCircle2, Lock } from 'lucide-react'

interface OnboardingStepperProps {
  user: User
  onFinish?: () => void
}

interface OnboardingData {
  // Common fields
  email: string
  phone: string
  website: string
  location: string
  bio: string
  
  // Citizen fields
  firstName: string
  lastName: string
  title: string
  company: string
  
  // Organization fields
  organizationName: string
  address: string
}

export function OnboardingStepper({ user, onFinish }: OnboardingStepperProps) {
  const isOrganization = user.role === 'organization' || user.role === 'ORGANIZATION'
  const normalizedRole = isOrganization ? 'organization' : 'citizen'
  
  const [step, setStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<any>(null)
  
  // Track which fields were provided during signup (read-only)
  const [providedFields, setProvidedFields] = useState<Record<string, boolean>>({})
  
  // Initialize data with user data (read-only fields pre-filled)
  const [data, setData] = useState<OnboardingData>({
    email: user.email || '',
    phone: '',
    website: '',
    location: '',
    bio: '',
    firstName: user.first_name || '',
    lastName: user.last_name || '',
    title: '',
    company: '',
    organizationName: '',
    address: '',
  })

  // Load signup data and existing profile
  useEffect(() => {
    loadSignupData()
    loadProfile()
    if (isOrganization) {
      loadOrganizationData()
    }
  }, [user])

  const loadSignupData = () => {
    try {
      const signupDataStr = localStorage.getItem('signup_data')
      if (signupDataStr) {
        const signupData = JSON.parse(signupDataStr)
        setProvidedFields(signupData.providedFields || {})
        
        // Pre-fill data from signup
        setData(prev => ({
          ...prev,
          email: signupData.email || prev.email,
          firstName: signupData.firstName || prev.firstName,
          lastName: signupData.lastName || prev.lastName,
          organizationName: signupData.organizationName || prev.organizationName,
          website: signupData.website || prev.website,
          address: signupData.address || prev.address,
        }))
      }
    } catch (err) {
      console.log('No signup data found')
    }
  }

  const loadOrganizationData = async () => {
    try {
      const { OrganizationAPI } = await import('@/lib/organization/api')
      const orgData = await OrganizationAPI.getOrganizationDetail()
      const org = orgData.organization
      
      // Pre-fill organization data from backend
      setData(prev => ({
        ...prev,
        organizationName: org.name || prev.organizationName,
        website: org.website || prev.website,
        address: org.address || prev.address,
        email: org.email || prev.email,
      }))
      
      // Mark fields as provided if they exist in backend
      if (org.name) {
        setProvidedFields(prev => ({ ...prev, organizationName: true }))
      }
      if (org.website) {
        setProvidedFields(prev => ({ ...prev, website: true }))
      }
      if (org.address) {
        setProvidedFields(prev => ({ ...prev, address: true }))
      }
    } catch (err) {
      // Organization data doesn't exist yet, that's okay
      console.log('No organization data found')
    }
  }

  const loadProfile = async () => {
    try {
      const profileData = await AuthAPI.getProfile()
      setProfile(profileData)
      // Pre-fill with existing profile data
      setData(prev => ({
        ...prev,
        phone: profileData.phone_no || prev.phone,
        website: profileData.url || prev.website,
        location: (profileData as any).location || prev.location,
        bio: profileData.about || prev.bio,
        title: profileData.title || prev.title,
        company: profileData.company || prev.company,
      }))
    } catch (err) {
      // Profile doesn't exist yet, that's okay
      console.log('No existing profile found')
    }
  }

  const steps = isOrganization
    ? [
        { id: 'welcome', title: 'Welcome', description: 'Complete your organization profile' },
        { id: 'info', title: 'Organization Info', description: 'Update your organization details' },
        { id: 'contact', title: 'Contact & Location', description: 'Add contact information' },
        { id: 'review', title: 'Review', description: 'Review and complete' },
      ]
    : [
        { id: 'welcome', title: 'Welcome', description: 'Complete your profile' },
        { id: 'info', title: 'Personal Info', description: 'Update your personal details' },
        { id: 'contact', title: 'Contact & Bio', description: 'Add contact and bio information' },
        { id: 'review', title: 'Review', description: 'Review and complete' },
      ]

  const canContinue = () => {
    if (step === 0) return true
    if (step === 1) {
      if (isOrganization) {
        // Organization name is required, but if it was provided during signup and is read-only, it should be valid
        return data.organizationName.trim().length > 0 || providedFields.organizationName
      } else {
        // First and last name are required, but if provided during signup and read-only, they should be valid
        return (data.firstName.trim().length > 0 || providedFields.firstName) && 
               (data.lastName.trim().length > 0 || providedFields.lastName)
      }
    }
    if (step === 2) return true // Contact fields are optional
    if (step === 3) return true // Review step
    return false
  }

  const handleChange = (field: keyof OnboardingData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      setError('')
      
      // Update profile via API
      const updateData: any = {
        title: data.title || '',
        company: data.company || '',
        url: data.website || '',
        phone_no: data.phone || '',
        about: data.bio || '',
      }
      
      // Add location if provided
      if (data.location) {
        updateData.location = data.location
      }
      
      await AuthAPI.updateProfile(updateData)
      
      // For organizations, update organization data if it was changed
      if (isOrganization) {
        try {
          const { OrganizationAPI } = await import('@/lib/organization/api')
          // Check if organization data needs to be updated
          // Note: Organization name, website, address are stored in Org model
          // We might need an update endpoint for this, but for now, we'll just update the profile
          // The organization data (name, website, address) should be updated separately via organization management
        } catch (orgErr) {
          // Organization update is optional, don't fail if it doesn't work
          console.log('Organization data update skipped:', orgErr)
        }
      }
      
      // Clear signup data from localStorage after onboarding
      localStorage.removeItem('signup_data')
      
      // Mark onboarding as completed
      localStorage.setItem('onboarding_completed', 'true')
      
      // Call onFinish callback
      onFinish?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile. Please try again.')
      console.error('Error updating profile:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const next = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const back = () => setStep(Math.max(0, step - 1))

  return (
    <div className="max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
      <Stepper steps={steps} currentStep={step} onStepChange={setStep} className="mb-8" />

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg" data-aos="fade-up">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Step Content */}
      <Card className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 backdrop-blur-xl border-purple-500/30 shadow-2xl">
        <CardContent className="p-6 sm:p-8">
          {/* Welcome Step */}
          {step === 0 && (
            <div className="text-center space-y-4" data-aos="fade-up">
              <h2 className="text-2xl font-bold text-white">Welcome to TruCon</h2>
              <p className="text-gray-300">
                {isOrganization 
                  ? 'Complete your organization profile to get started with TruCon.'
                  : 'Complete your profile to get started with TruCon.'}
              </p>
              <div className="mt-6 text-left bg-purple-950/30 border border-purple-500/30 rounded-md p-4">
                <p className="text-sm text-purple-200">
                  TruCon does not access your personal information without your explicit consent. You decide what is shared,
                  with whom, and for how long. You can revoke access at any time, and every action is recorded in your
                  Transparency Log.
                </p>
              </div>
            </div>
          )}

          {/* Info Step */}
          {step === 1 && (
            <div className="space-y-4" data-aos="fade-up">
              {isOrganization ? (
                <>
                  <div>
                    <Label htmlFor="orgName" className="text-purple-300 flex items-center gap-2">
                      Organization Name * 
                      {providedFields.organizationName && (
                        <>
                          <Lock className="w-3 h-3" /> 
                          <span className="text-xs text-gray-400">(Read-only)</span>
                        </>
                      )}
                    </Label>
                    <Input
                      id="orgName"
                      value={data.organizationName}
                      onChange={(e) => handleChange('organizationName', e.target.value)}
                      placeholder="Acme Corporation"
                      disabled={providedFields.organizationName}
                      className={`mt-2 border-purple-500/30 placeholder:text-gray-500 ${
                        providedFields.organizationName 
                          ? 'bg-gray-800 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-black'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-purple-300 flex items-center gap-2">
                      Email <Lock className="w-3 h-3" /> <span className="text-xs text-gray-400">(Read-only)</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      disabled
                      className="mt-2 border-purple-500/30 bg-gray-800 text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-purple-300 flex items-center gap-2">
                      Address
                      {providedFields.address && (
                        <>
                          <Lock className="w-3 h-3" /> 
                          <span className="text-xs text-gray-400">(Read-only)</span>
                        </>
                      )}
                    </Label>
                    <Input
                      id="address"
                      value={data.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="123 Main St, City, State"
                      disabled={providedFields.address}
                      className={`mt-2 border-purple-500/30 placeholder:text-gray-500 ${
                        providedFields.address 
                          ? 'bg-gray-800 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-black'
                      }`}
                    />
                  </div>

                  <div>
                    <Label htmlFor="website" className="text-purple-300 flex items-center gap-2">
                      Website
                      {providedFields.website && (
                        <>
                          <Lock className="w-3 h-3" /> 
                          <span className="text-xs text-gray-400">(Read-only)</span>
                        </>
                      )}
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={data.website}
                      onChange={(e) => handleChange('website', e.target.value)}
                      placeholder="https://example.com"
                      disabled={providedFields.website}
                      className={`mt-2 border-purple-500/30 placeholder:text-gray-500 ${
                        providedFields.website 
                          ? 'bg-gray-800 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-black'
                      }`}
                    />
                  </div>

                  <div>
                    <Label htmlFor="title" className="text-purple-300">Job Title</Label>
                    <Input
                      id="title"
                      value={data.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="CEO, Director, etc."
                      className="mt-2 border-purple-500/30 bg-white text-black placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-purple-300">Company</Label>
                    <Input
                      id="company"
                      value={data.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      placeholder="Company name"
                      className="mt-2 border-purple-500/30 bg-white text-black placeholder:text-gray-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Label htmlFor="firstName" className="text-purple-300 flex items-center gap-2">
                      First Name 
                      {providedFields.firstName && (
                        <>
                          <Lock className="w-3 h-3" /> 
                          <span className="text-xs text-gray-400">(Read-only)</span>
                        </>
                      )}
                    </Label>
                    <Input
                      id="firstName"
                      value={data.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      disabled={providedFields.firstName}
                      className={`mt-2 border-purple-500/30 ${
                        providedFields.firstName 
                          ? 'bg-gray-800 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-black'
                      }`}
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-purple-300 flex items-center gap-2">
                      Last Name 
                      {providedFields.lastName && (
                        <>
                          <Lock className="w-3 h-3" /> 
                          <span className="text-xs text-gray-400">(Read-only)</span>
                        </>
                      )}
                    </Label>
                    <Input
                      id="lastName"
                      value={data.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      disabled={providedFields.lastName}
                      className={`mt-2 border-purple-500/30 ${
                        providedFields.lastName 
                          ? 'bg-gray-800 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-black'
                      }`}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-purple-300 flex items-center gap-2">
                      Email <Lock className="w-3 h-3" /> <span className="text-xs text-gray-400">(Read-only)</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      disabled
                      className="mt-2 border-purple-500/30 bg-gray-800 text-gray-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="title" className="text-purple-300">Job Title</Label>
                    <Input
                      id="title"
                      value={data.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="Software Engineer, Teacher, etc."
                      className="mt-2 border-purple-500/30 bg-white text-black placeholder:text-gray-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="company" className="text-purple-300">Company</Label>
                    <Input
                      id="company"
                      value={data.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      placeholder="Company or organization name"
                      className="mt-2 border-purple-500/30 bg-white text-black placeholder:text-gray-500"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Contact Step */}
          {step === 2 && (
            <div className="space-y-4" data-aos="fade-up">
              <div>
                <Label htmlFor="phone" className="text-purple-300">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={data.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="mt-2 border-purple-500/30 bg-white text-black placeholder:text-gray-500"
                />
              </div>

              {/* Only show website in contact step if it wasn't shown in info step (for organizations) */}
              {(!isOrganization || !providedFields.website) && (
                <div>
                  <Label htmlFor="websiteContact" className="text-purple-300">Website</Label>
                  <Input
                    id="websiteContact"
                    type="url"
                    value={data.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    placeholder="https://example.com"
                    className="mt-2 border-purple-500/30 bg-white text-black placeholder:text-gray-500"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="location" className="text-purple-300">Location</Label>
                <Input
                  id="location"
                  value={data.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="Lagos, Nigeria"
                  className="mt-2 border-purple-500/30 bg-white text-black placeholder:text-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="bio" className="text-purple-300">Bio / About</Label>
                <Textarea
                  id="bio"
                  value={data.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder={isOrganization 
                    ? 'Tell us about your organization...'
                    : 'Tell us about yourself...'}
                  className="mt-2 border-purple-500/30 bg-white text-black placeholder:text-gray-500 min-h-[100px]"
                />
              </div>
            </div>
          )}

          {/* Review Step */}
          {step === 3 && (
            <div className="space-y-4" data-aos="fade-up">
              <h3 className="text-lg font-semibold text-white mb-4">Review Your Information</h3>
              
              <div className="space-y-3">
                {isOrganization ? (
                  <>
                    <div className="flex justify-between py-2 border-b border-purple-900/30">
                      <span className="text-gray-400">Organization Name:</span>
                      <span className="text-white">{data.organizationName || 'Not provided'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-purple-900/30">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{data.email}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-purple-900/30">
                      <span className="text-gray-400">Address:</span>
                      <span className="text-white">{data.address || 'Not provided'}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between py-2 border-b border-purple-900/30">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white">{data.firstName} {data.lastName}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-purple-900/30">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{data.email}</span>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between py-2 border-b border-purple-900/30">
                  <span className="text-gray-400">Title:</span>
                  <span className="text-white">{data.title || 'Not provided'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-purple-900/30">
                  <span className="text-gray-400">Company:</span>
                  <span className="text-white">{data.company || 'Not provided'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-purple-900/30">
                  <span className="text-gray-400">Phone:</span>
                  <span className="text-white">{data.phone || 'Not provided'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-purple-900/30">
                  <span className="text-gray-400">Website:</span>
                  <span className="text-white">{data.website || 'Not provided'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-purple-900/30">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">{data.location || 'Not provided'}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-400">Bio:</span>
                  <span className="text-white text-right max-w-md">{data.bio || 'Not provided'}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-purple-950/30 border border-purple-500/30 rounded-md">
                <p className="text-sm text-purple-200">
                  By completing onboarding, you acknowledge that TruCon processes your data in accordance with the Nigeria Data Protection
                  Regulation (NDPR). You may update your profile at any time.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={back}
              disabled={step === 0 || isLoading}
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={next}
              disabled={!canContinue() || isLoading}
              className="trust-button"
            >
              {isLoading ? 'Saving...' : step === steps.length - 1 ? 'Complete' : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
