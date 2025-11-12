"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CitizenSidebar } from "@/components/citizen-sidebar"
import { AnalyticsCard } from "@/components/analytics-card"
import { TrustMeter } from "@/components/trust-meter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Database, Shield, TrendingUp, Users, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth/context"
import { OrganizationAPI } from "@/lib/organization/api"
import { ConsentsAPI } from "@/lib/consents/api"

export default function CitizenDashboard() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [activeConsents, setActiveConsents] = useState(0)
  const [revokedAccesses, setRevokedAccesses] = useState(0)
  const [organizationsCount, setOrganizationsCount] = useState(0)
  const [trustScore, setTrustScore] = useState(0)
  const [recentActivity, setRecentActivity] = useState<Array<{ id: number; organizationName: string; purpose: string; dateTime: string; accessType: string }>>([])

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard")
      return
    }

    // Only load data if authenticated
    if (isAuthenticated) {
      loadDashboardData()
    }
  }, [isAuthenticated, authLoading, router])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Load consents with status
      const consentsWithStatus = await ConsentsAPI.getUserConsentsStatus()
      const active = consentsWithStatus.filter((c) => c.access).length
      setActiveConsents(active)

      // Load data access requests
      const accessResponse = await OrganizationAPI.getRequestedConsents()
      const accessList = accessResponse.data || []
      const revoked = accessList.filter((a) => a.status === "REVOKED").length
      const activeAccesses = accessList.filter((a) => a.status === "APPROVED").length
      setRevokedAccesses(revoked)
      setOrganizationsCount(new Set(accessList.map((a) => a.organizationId)).size)

      // Calculate trust score
      const totalAccesses = accessList.length
      const calculatedTrustScore = totalAccesses > 0 
        ? Math.max(0, 100 - (activeAccesses / totalAccesses) * 60)
        : 100
      setTrustScore(calculatedTrustScore)

      // Get recent activity (last 5)
      const recent = accessList
        .sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime())
        .slice(0, 5)
        .map((item) => ({
          id: item.id,
          organizationName: item.organizationName,
          purpose: item.purpose || "Data access",
          dateTime: item.lastAccessed,
          accessType: item.status === "APPROVED" ? "Read" : item.status === "REVOKED" ? "Delete" : "Pending",
        }))
      setRecentActivity(recent)
    } catch (err) {
      console.error("Error loading dashboard data:", err)
      // Keep default values on error
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-black">
      <CitizenSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 glass-effect border-b border-purple-900/30 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Overview</h1>
                <p className="text-gray-400 mt-1">Manage your personal data and consent</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20">
                  <Link href="/notifications">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Link>
                </Button>
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-700 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <span className="text-white font-semibold">JD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnalyticsCard
                title="Organizations Accessing My Data"
                value={isLoading ? "..." : organizationsCount}
                description={isLoading ? "Loading..." : `${organizationsCount} organization${organizationsCount !== 1 ? "s" : ""} with access`}
                icon={Users}
              />
              <AnalyticsCard
                title="Active Consents"
                value={isLoading ? "..." : activeConsents}
                description={isLoading ? "Loading..." : "Data categories with granted access"}
                icon={Shield}
              />
              <AnalyticsCard
                title="Revoked Accesses"
                value={isLoading ? "..." : revokedAccesses}
                description={isLoading ? "Loading..." : "Successfully revoked data access"}
                icon={Database}
              />
              <AnalyticsCard
                title="Compliance Score"
                value={isLoading ? "..." : `${Math.round(trustScore)}%`}
                description={isLoading ? "Loading..." : "Your data exposure level"}
                icon={TrendingUp}
                trend={isLoading ? undefined : { value: 5, isPositive: true }}
              />
            </div>

            {/* Trust Meter & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-gray-900/70 to-gray-900/40 border-purple-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Data Exposure Level</CardTitle>
                  <CardDescription className="text-gray-400">Your current privacy and data exposure risk</CardDescription>
                </CardHeader>
                <CardContent>
                  <TrustMeter value={trustScore} />
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Data Categories Shared</span>
                      <Badge variant="outline" className="border-purple-500/50 text-purple-300">{isLoading ? "..." : `${activeConsents}`}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">Active Organizations</span>
                      <Badge variant="outline" className="border-purple-500/50 text-purple-300">{isLoading ? "..." : organizationsCount}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900/70 to-gray-900/40 border-purple-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-400">Latest data access events</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8 text-gray-400">Loading recent activity...</div>
                  ) : recentActivity.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">No recent activity</div>
                  ) : (
                    <div className="space-y-4">
                      {recentActivity.map((log) => (
                        <div key={log.id} className="flex items-start justify-between pb-4 border-b border-purple-900/30 last:border-0">
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-purple-400">{log.organizationName}</p>
                            <p className="text-xs text-gray-400 mt-1">{log.purpose}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {log.dateTime ? new Date(log.dateTime).toLocaleString() : "N/A"}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs border-cyan-500/50 text-cyan-400">
                            {log.accessType}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                  <Button variant="outline" className="w-full mt-4 border-purple-500/50 text-purple-300 hover:bg-purple-500/20" asChild>
                    <Link href="/dashboard/transparency">View All Logs</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-gray-900/70 to-gray-900/40 border-purple-500/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-400">Common tasks and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto flex-col py-6 gap-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:border-purple-400" asChild>
                    <Link href="/dashboard/data-access">
                      <Database className="w-6 h-6" />
                      <span className="font-semibold">Manage Data Access</span>
                      <span className="text-xs text-gray-400">View and revoke access</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col py-6 gap-2 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400" asChild>
                    <Link href="/dashboard/consent">
                      <Shield className="w-6 h-6" />
                      <span className="font-semibold">Manage Consents</span>
                      <span className="text-xs text-gray-400">Grant or revoke consent</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col py-6 gap-2 border-violet-500/50 text-violet-300 hover:bg-violet-500/20 hover:border-violet-400" asChild>
                    <Link href="/settings">
                      <AlertCircle className="w-6 h-6" />
                      <span className="font-semibold">Account Settings</span>
                      <span className="text-xs text-gray-400">Update preferences</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
