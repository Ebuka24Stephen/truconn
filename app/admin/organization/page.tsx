"use client"

import { OrganizationSidebar } from "@/components/organization-sidebar"
import { AnalyticsCard } from "@/components/analytics-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, X, CheckCircle2, AlertCircle, FileCheck } from "lucide-react"
import { mockConsentRequests } from "@/lib/mock-data"
import Link from "next/link"

export default function OrganizationDashboard() {
  const activeConsents = 342
  const revokedAccesses = 28
  const pendingRequests = mockConsentRequests.filter((r) => r.status === "pending").length
  const complianceScore = 94.5

  return (
    <div className="flex h-screen bg-neutral-50">
      <OrganizationSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 p-6 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Dashboard Overview</h1>
                <p className="text-neutral-600 mt-1">Monitor compliance and data usage</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">ORG</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <AnalyticsCard
                title="Active Consents"
                value={activeConsents}
                description="Citizens with granted access"
                icon={CheckCircle2}
                trend={{ value: 12, isPositive: true }}
              />
              <AnalyticsCard
                title="Revoked Accesses"
                value={revokedAccesses}
                description="Consent revocations this month"
                icon={X}
                trend={{ value: -5, isPositive: false }}
              />
              <AnalyticsCard
                title="Pending Requests"
                value={pendingRequests}
                description="Awaiting approval"
                icon={FileCheck}
              />
              <AnalyticsCard
                title="Compliance Score"
                value={`${complianceScore}%`}
                description="NDPR compliance rating"
                icon={TrendingUp}
                trend={{ value: 2.5, isPositive: true }}
              />
            </div>

            {/* Data Access Chart Placeholder & Recent Requests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Access Frequency</CardTitle>
                  <CardDescription>Access by data type (last 30 days)</CardDescription>
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
                          <span className="text-sm font-medium">{item.type}</span>
                          <span className="text-sm text-neutral-500">{item.count}</span>
                        </div>
                        <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
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

              <Card>
                <CardHeader>
                  <CardTitle>Recent Consent Requests</CardTitle>
                  <CardDescription>Latest requests requiring action</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockConsentRequests.slice(0, 5).map((request) => (
                      <div
                        key={request.id}
                        className="flex items-start justify-between pb-4 border-b last:border-0"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-primary">{request.citizenName}</p>
                          <p className="text-xs text-neutral-500 mt-1">
                            {request.dataType} • {request.purpose}
                          </p>
                          <p className="text-xs text-neutral-400 mt-1">
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
                        >
                          {request.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/admin/organization/consent-requests">View All Requests</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Alert */}
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-amber-900 mb-2">Compliance Reminder</h3>
                    <p className="text-sm text-amber-800">
                      Your organization has {pendingRequests} pending consent requests. Ensure timely processing to
                      maintain NDPR compliance.
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
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


