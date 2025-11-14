"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Shield, Award, TrendingUp } from "lucide-react"
import { TrustAPI, type TrustRegistryEntry } from "@/lib/trust/api"
import { BackButton } from "@/components/back-button"
import { useAuth } from "@/lib/auth/context"
import { CitizenSidebar } from "@/components/citizen-sidebar"
import { OrganizationSidebar } from "@/components/organization-sidebar"

export default function TrustRegistryPage() {
  const { user, isAuthenticated } = useAuth()
  const SidebarComponent = user?.role === "organization" || user?.role === "ORGANIZATION" 
    ? OrganizationSidebar 
    : isAuthenticated 
      ? CitizenSidebar 
      : null
  const [isLoading, setIsLoading] = useState(true)
  const [organizations, setOrganizations] = useState<TrustRegistryEntry[]>([])
  const [error, setError] = useState("")

  useEffect(() => {
    loadTrustRegistry()
  }, [])

  const loadTrustRegistry = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await TrustAPI.getTrustRegistry(50)
      setOrganizations(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trust registry")
      console.error("Error loading trust registry:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case "EXCELLENT":
        return "bg-emerald-500 text-white"
      case "VERIFIED":
        return "bg-blue-500 text-white"
      case "GOOD":
        return "bg-amber-500 text-white"
      case "BASIC":
        return "bg-neutral-400 text-white"
      case "LOW":
        return "bg-red-500 text-white"
      default:
        return "bg-neutral-200 text-neutral-700"
    }
  }

  const getTrustLevelIcon = (level: string) => {
    switch (level) {
      case "EXCELLENT":
      case "VERIFIED":
        return <Award className="w-4 h-4" />
      default:
        return <Shield className="w-4 h-4" />
    }
  }

  return (
    <div className={`min-h-screen bg-neutral-50 ${SidebarComponent ? 'flex' : ''}`}>
      {SidebarComponent && <SidebarComponent />}
      <div className={`${SidebarComponent ? 'flex-1 overflow-auto' : ''} p-6`}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl font-bold text-primary">Trust Registry</h1>
            </div>
            <p className="text-neutral-600">
              Verified organizations ranked by trust score based on NDPR compliance, data integrity, and transparency
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Total Organizations</p>
                  <p className="text-2xl font-bold text-primary">{organizations.length}</p>
                </div>
                <Shield className="w-8 h-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Verified Organizations</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {organizations.filter((o) => o.trust_level === "VERIFIED" || o.trust_level === "EXCELLENT").length}
                  </p>
                </div>
                <Award className="w-8 h-8 text-emerald-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600">Average Trust Score</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {organizations.length > 0
                      ? Math.round(
                          organizations.reduce((sum, o) => sum + o.trust_score, 0) / organizations.length
                        )
                      : 0}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organizations List */}
        <Card>
          <CardHeader>
            <CardTitle>Organization Rankings</CardTitle>
            <CardDescription>Organizations ranked by trust score</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                {error}
              </div>
            )}
            {isLoading ? (
              <div className="text-center py-8 text-neutral-500">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                Loading trust registry...
              </div>
            ) : organizations.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <Shield className="w-12 h-12 text-neutral-400 mx-auto mb-2" />
                <p>No organizations found in trust registry</p>
              </div>
            ) : (
              <div className="space-y-3">
                {organizations.map((org, index) => (
                  <div
                    key={org.organization.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary">{org.organization.name}</h3>
                        <p className="text-sm text-neutral-600">{org.organization.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-neutral-600">Trust Score</p>
                        <p className="text-xl font-bold text-primary">{org.trust_score.toFixed(1)}</p>
                      </div>
                      <Badge className={getTrustLevelColor(org.trust_level)}>
                        <div className="flex items-center gap-1">
                          {getTrustLevelIcon(org.trust_level)}
                          {org.trust_level}
                        </div>
                      </Badge>
                    </div>
                  </div>
                ))};
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}

