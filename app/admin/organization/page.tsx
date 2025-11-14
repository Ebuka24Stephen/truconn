"use client"

import { OrganizationSidebar } from "@/components/organization-sidebar"
import { AnalyticsCard } from "@/components/analytics-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, X, CheckCircle2, AlertCircle, FileCheck } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { OrganizationAPI } from "@/lib/organization/api"
import { TrustAPI, type OrganizationTrustData } from "@/lib/trust/api"
import { TrustScoreCard } from "@/components/trust-score-card"
import { DataIntegrityBadge } from "@/components/data-integrity-badge"
import { useAuth } from "@/lib/auth/context"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function OrganizationDashboard() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [recentRows, setRecentRows] = useState<Array<{ id: string; citizenName: string; requestedAt: string; status: string }>>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [activeConsents, setActiveConsents] = useState(0)
  const [revokedAccesses, setRevokedAccesses] = useState(0)
  const [complianceScore, setComplianceScore] = useState(0)
  const [trustData, setTrustData] = useState<OrganizationTrustData | null>(null)
  const [isLoadingTrust, setIsLoadingTrust] = useState(true)

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "organization")) {
      router.push("/login?redirect=/admin/organization")
      return
    }
    if (!isAuthenticated || user?.role !== "organization") return
    const load = async () => {
      try {
        setIsLoading(true)
        const list = await OrganizationAPI.getCitizens()
        const rows: Array<{ id: string; citizenName: string; requestedAt: string; status: string }> = []
        let pending = 0
        let active = 0
        let revoked = 0
        
        list.forEach((c) => {
          c.access_requests.forEach((r, idx) => {
            const status = r.status.toLowerCase()
            if (status === "pending") pending += 1
            if (status === "approved") active += 1
            if (status === "revoked") revoked += 1
            rows.push({
              id: `${c.id}-${idx}-${r.requested_at}`,
              citizenName: c.full_name,
              requestedAt: r.requested_at,
              status,
            })
          })
        })
        // Sort most recent
        rows.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime())
        setRecentRows(rows.slice(0, 5))
        setPendingCount(pending)
        setActiveConsents(active)
        setRevokedAccesses(revoked)
        
        // Calculate compliance score (higher is better)
        const total = active + revoked + pending
        const score = total > 0 ? Math.round((active / total) * 100) : 100
        setComplianceScore(score)
        
        // Load trust score
        try {
          const trust = await TrustAPI.getMyTrustScore()
          setTrustData(trust)
        } catch (err) {
          console.error("Error loading trust score:", err)
        } finally {
          setIsLoadingTrust(false)
        }
      } catch {
        // keep defaults on error
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [isAuthenticated, authLoading, user, router])

  const pendingRequests = pendingCount

  return (
    <div className="flex h-screen bg-black">
      <OrganizationSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 glass-effect border-b border-purple-900/30 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-gray-400 mt-1">Monitor compliance and data usage</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-700 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
                  <span className="text-white font-semibold">ORG</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Trust Score Card */}
            {trustData && (
              <TrustScoreCard
                trustScore={{
                  overall_score: trustData.trust_score,
                  trust_level: trustData.trust_level as any,
                  components: trustData.components,
                  certificate_issued: trustData.certificate_issued,
                  certificate_issued_at: trustData.certificate_issued_at,
                  last_calculated: trustData.last_calculated,
                }}
                organizationName={trustData.organization.name}
              />
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnalyticsCard
                title="Active Consents"
                value={isLoading ? "..." : activeConsents}
                description={isLoading ? "Loading..." : "Citizens with granted access"}
                icon={CheckCircle2}
                trend={isLoading ? undefined : { value: 12, isPositive: true }}
              />
              <AnalyticsCard
                title="Revoked Accesses"
                value={isLoading ? "..." : revokedAccesses}
                description={isLoading ? "Loading..." : "Consent revocations"}
                icon={X}
                trend={isLoading ? undefined : { value: -5, isPositive: false }}
              />
              <AnalyticsCard
                title="Pending Requests"
                value={isLoading ? "..." : pendingRequests}
                description={isLoading ? "Loading..." : "Awaiting approval"}
                icon={FileCheck}
              />
              <AnalyticsCard
                title="Compliance Score"
                value={isLoading ? "..." : `${complianceScore}%`}
                description={isLoading ? "Loading..." : "NDPR compliance rating"}
                icon={TrendingUp}
                trend={isLoading ? undefined : { value: 2.5, isPositive: true }}
              />
            </div>

            {/* Data Integrity Badge */}
            {trustData?.data_integrity && (
              <Card className="bg-gradient-to-br from-gray-900/70 to-gray-900/40 border-purple-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Data Integrity Status</CardTitle>
                  <CardDescription className="text-gray-400">Cryptographic verification of data integrity</CardDescription>
                </CardHeader>
                <CardContent>
                  <DataIntegrityBadge
                    integrityScore={trustData.data_integrity.integrity_score}
                    verifiedCount={trustData.data_integrity.verified_count}
                    totalCount={trustData.data_integrity.total_requests}
                    showDetails={true}
                  />
                  {trustData.data_integrity.issues.length > 0 && (
                    <div className="mt-4 p-3 bg-red-900/30 border border-red-500/50 rounded">
                      <p className="text-sm font-medium text-red-400 mb-2">Integrity Issues Detected:</p>
                      <ul className="text-sm text-red-300 space-y-1">
                        {trustData.data_integrity.issues.map((issue, idx) => (
                          <li key={idx}>• Request #{issue.request_id}: {issue.issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Data Access Chart Placeholder & Recent Requests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-gray-900/70 to-gray-900/40 border-purple-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Data Access Frequency</CardTitle>
                  <CardDescription className="text-gray-400">Access by data type (last 30 days)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { type: "Financial", count: 145, color: "bg-blue-500" },
                      { type: "Identity", count: 89, color: "bg-emerald-500" },
                      { type: "Health", count: 67, color: "bg-purple-500" },
                      { type: "Biometric", count: 34, color: "bg-amber-500" },
                    ].map((item) => (
                      <div key={item.type}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-300">{item.type}</span>
                          <span className="text-sm text-gray-400">{item.count}</span>
                        </div>
                        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full`}
                            style={{ width: `${(item.count / 145) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900/70 to-gray-900/40 border-purple-500/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Recent Consent Requests</CardTitle>
                  <CardDescription className="text-gray-400">Latest requests requiring action</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentRows.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-start justify-between pb-4 border-b border-purple-900/30 last:border-0"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-purple-300">{request.citizenName}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Recent consent request
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(request.requestedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant={
                            request.status === "approved"
                              ? "success"
                              : request.status === "pending"
                                ? "warning"
                                : "destructive"
                          }
                          className={
                            request.status === "approved"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                              : request.status === "pending"
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/50"
                                : "bg-red-500/20 text-red-400 border-red-500/50"
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4 border-purple-500/50 text-purple-300 hover:bg-purple-500/20" asChild>
                    <Link href="/admin/organization/consent-requests">View All Requests</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Alert */}
            <Card className="bg-amber-900/20 border-amber-500/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-300 mb-2">Compliance Reminder</h3>
                    <p className="text-sm text-amber-200">
                      Your organization has {pendingRequests} pending consent requests. Ensure timely processing to
                      maintain NDPR compliance.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20" asChild>
                    <Link href="/admin/organization/consent-requests">Review Now</Link>
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


