"use client"

import { useState } from "react"
import { CitizenSidebar } from "@/components/citizen-sidebar"
import { AnalyticsCard } from "@/components/analytics-card"
import { TrustMeter } from "@/components/trust-meter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, Database, Shield, TrendingUp, Users, AlertCircle } from "lucide-react"
import { mockDataAccess, mockConsents, mockAccessLogs } from "@/lib/mock-data"
import Link from "next/link"

export default function CitizenDashboard() {
  const activeConsents = mockConsents.filter((c) => c.allowed).length
  const revokedAccesses = mockDataAccess.filter((a) => a.status === "revoked").length
  const organizationsCount = new Set(mockDataAccess.map((a) => a.organizationId)).size

  // Calculate trust score based on data exposure
  const totalAccesses = mockDataAccess.length
  const activeAccesses = mockDataAccess.filter((a) => a.status === "active").length
  const trustScore = Math.max(0, 100 - (activeAccesses / totalAccesses) * 60)

  return (
    <div className="flex h-screen bg-neutral-50">
      <CitizenSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 p-6 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Overview</h1>
                <p className="text-neutral-600 mt-1">Manage your personal data and consent</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/notifications">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Link>
                </Button>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">JD</span>
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
                value={organizationsCount}
                description={`${mockDataAccess.filter((a) => a.status === "active").length} active accesses`}
                icon={Users}
              />
              <AnalyticsCard
                title="Active Consents"
                value={activeConsents}
                description="Data categories with granted access"
                icon={Shield}
              />
              <AnalyticsCard
                title="Revoked Accesses"
                value={revokedAccesses}
                description="Successfully revoked data access"
                icon={Database}
              />
              <AnalyticsCard
                title="Compliance Score"
                value={`${Math.round(trustScore)}%`}
                description="Your data exposure level"
                icon={TrendingUp}
                trend={{ value: 5, isPositive: true }}
              />
            </div>

            {/* Trust Meter & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Exposure Level</CardTitle>
                  <CardDescription>Your current privacy and data exposure risk</CardDescription>
                </CardHeader>
                <CardContent>
                  <TrustMeter value={trustScore} />
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Data Categories Shared</span>
                      <Badge variant="outline">{activeConsents}/4</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-neutral-600">Active Organizations</span>
                      <Badge variant="outline">{organizationsCount}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest data access events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAccessLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-start justify-between pb-4 border-b last:border-0">
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-primary">{log.organizationName}</p>
                          <p className="text-xs text-neutral-500 mt-1">{log.purpose}</p>
                          <p className="text-xs text-neutral-400 mt-1">{new Date(log.dateTime).toLocaleString()}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {log.accessType}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" asChild>
                    <Link href="/dashboard/transparency">View All Logs</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto flex-col py-6 gap-2" asChild>
                    <Link href="/dashboard/data-access">
                      <Database className="w-6 h-6" />
                      <span className="font-semibold">Manage Data Access</span>
                      <span className="text-xs text-neutral-500">View and revoke access</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col py-6 gap-2" asChild>
                    <Link href="/dashboard/consent">
                      <Shield className="w-6 h-6" />
                      <span className="font-semibold">Manage Consents</span>
                      <span className="text-xs text-neutral-500">Grant or revoke consent</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col py-6 gap-2" asChild>
                    <Link href="/settings">
                      <AlertCircle className="w-6 h-6" />
                      <span className="font-semibold">Account Settings</span>
                      <span className="text-xs text-neutral-500">Update preferences</span>
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
