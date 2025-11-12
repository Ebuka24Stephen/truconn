"use client"

import { useState, useEffect } from "react"
import { CitizenSidebar } from "@/components/citizen-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConsentToggle } from "@/components/consent-toggle"
import { Badge } from "@/components/ui/badge"
import { ConsentsAPI, type Consent } from "@/lib/consents/api"
import { AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { useRouter } from "next/navigation"
import { BackButton } from "@/components/back-button"

interface ConsentWithStatus extends Consent {
  allowed: boolean
  organizations: string[]
  duration: string
  details: string
}

export default function ConsentManagementPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [consents, setConsents] = useState<ConsentWithStatus[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard/consent")
      return
    }

    // Only load data if authenticated
    if (isAuthenticated) {
      loadConsents()
    }
  }, [isAuthenticated, authLoading, router])

  const loadConsents = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      // Fetch consents with user status
      const consentsWithStatus = await ConsentsAPI.getUserConsentsStatus()
      
      // Map backend consents to frontend format
      const mappedConsents: ConsentWithStatus[] = consentsWithStatus.map((consent) => ({
        id: consent.id,
        name: consent.name,
        allowed: consent.access,
        organizations: [],
        duration: "Ongoing",
        details: `Manage access to your ${consent.name.toLowerCase()} data`,
      }))
      
      setConsents(mappedConsents)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load consents")
      console.error("Error loading consents:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggle = async (id: number, newAllowed: boolean) => {
    const consent = consents.find((c) => c.id === id)
    if (!consent) return

    const previousAllowed = consent.allowed

    try {
      setError("")
      // Optimistically update UI
      setConsents((prev) =>
        prev.map((c) => (c.id === id ? { ...c, allowed: newAllowed } : c))
      )

      // Call API to toggle consent
      const response = await ConsentsAPI.toggleConsent(id)
      
      // Update with actual response
      setConsents((prev) =>
        prev.map((c) => (c.id === id ? { ...c, allowed: response.access } : c))
      )
    } catch (err) {
      // Revert on error
      setConsents((prev) =>
        prev.map((c) => (c.id === id ? { ...c, allowed: previousAllowed } : c))
      )
      setError(err instanceof Error ? err.message : "Failed to toggle consent")
      console.error("Error toggling consent:", err)
    }
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      <CitizenSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 p-6 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <BackButton href="/dashboard" className="mb-4" />
            <h1 className="text-3xl font-bold text-primary">Consent Management</h1>
            <p className="text-neutral-600 mt-1">Control what data categories can be accessed</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Error Message */}
            {error && (
              <Card className="bg-red-50 border-red-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-900">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <p className="text-sm text-blue-900">
                  <strong>Your Right to Control:</strong> Under NDPR, you have the right to grant, modify, or revoke
                  consent for your personal data at any time. Changes take effect immediately.
                </p>
              </CardContent>
            </Card>

            {/* Loading State */}
            {isLoading ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-neutral-500">Loading consents...</p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Consent Categories */}
                {consents.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-center text-neutral-500">No consent categories available</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                {consents.map((consent, index) => (
                      <Card key={`${consent.id}-${index}`}>
                        <CardContent className="pt-6">
                          <ConsentToggle
                            category={consent.name as "Financial" | "Biometric" | "Health" | "Identity"}
                            allowed={consent.allowed}
                            onToggle={(allowed) => handleToggle(consent.id, allowed)}
                            details={consent.details}
                            organizations={consent.organizations}
                            duration={consent.duration}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Consent Summary</CardTitle>
                <CardDescription>Overview of your current consent settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-neutral-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{consents.length}</div>
                    <div className="text-sm text-neutral-600 mt-1">Total Categories</div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">
                      {consents.filter((c) => c.allowed).length}
                    </div>
                    <div className="text-sm text-neutral-600 mt-1">Granted</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {consents.filter((c) => !c.allowed).length}
                    </div>
                    <div className="text-sm text-neutral-600 mt-1">Denied</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {consents.reduce((acc, c) => acc + (c.allowed ? c.organizations.length : 0), 0)}
                    </div>
                    <div className="text-sm text-neutral-600 mt-1">Organizations</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}


