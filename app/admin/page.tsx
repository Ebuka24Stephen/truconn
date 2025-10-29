"use client"

import { useState } from "react"
import { AnalyticsCard } from "@/components/analytics-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, Building2, AlertTriangle, TrendingUp, Settings, Search } from "lucide-react"
import { mockStats, mockViolations } from "@/lib/mock-data"

export default function AdminControlPanel() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 p-6 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">Admin Control Panel</h1>
              <p className="text-neutral-600 mt-1">National oversight of the digital trust system</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">AD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="citizens">Citizens</TabsTrigger>
              <TabsTrigger value="organizations">Organizations</TabsTrigger>
              <TabsTrigger value="violations">Violations</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Global Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnalyticsCard
                  title="Total Citizens"
                  value={mockStats.citizens.toLocaleString()}
                  description="Registered users"
                  icon={Users}
                />
                <AnalyticsCard
                  title="Total Organizations"
                  value={mockStats.organizations.toLocaleString()}
                  description="Verified entities"
                  icon={Building2}
                />
                <AnalyticsCard
                  title="Compliance Rate"
                  value={`${mockStats.complianceRate}%`}
                  description="National average"
                  icon={TrendingUp}
                  trend={{ value: 2.1, isPositive: true }}
                />
                <AnalyticsCard
                  title="Violations (30 days)"
                  value={mockStats.violations}
                  description="Under investigation"
                  icon={AlertTriangle}
                />
              </div>

              {/* Recent Violations */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Violations</CardTitle>
                  <CardDescription>Latest compliance issues requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Organization</TableHead>
                        <TableHead>Issue Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockViolations.map((violation) => (
                        <TableRow key={violation.id}>
                          <TableCell className="font-semibold">{violation.orgName}</TableCell>
                          <TableCell>{violation.issueType}</TableCell>
                          <TableCell className="text-sm text-neutral-500">{violation.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                violation.status === "resolved"
                                  ? "success"
                                  : violation.status === "investigating"
                                    ? "warning"
                                    : "destructive"
                              }
                            >
                              {violation.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{violation.actionTaken}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Citizens Tab */}
            <TabsContent value="citizens" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Citizens</CardTitle>
                  <CardDescription>Overview of citizen registration and engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                    <p className="text-neutral-600">Citizen management interface</p>
                    <p className="text-sm text-neutral-500 mt-2">
                      View, search, and manage registered citizens
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Organizations Tab */}
            <TabsContent value="organizations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Organizations</CardTitle>
                  <CardDescription>Manage organization registrations and verifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Building2 className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                    <p className="text-neutral-600">Organization management interface</p>
                    <p className="text-sm text-neutral-500 mt-2">
                      Review and verify organization applications
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Violations Tab */}
            <TabsContent value="violations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Compliance Violations</CardTitle>
                  <CardDescription>All recorded violations and their resolution status</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Organization</TableHead>
                        <TableHead>Issue Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action Taken</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockViolations.map((violation) => (
                        <TableRow key={violation.id}>
                          <TableCell className="font-semibold">{violation.orgName}</TableCell>
                          <TableCell>{violation.issueType}</TableCell>
                          <TableCell className="text-sm text-neutral-500">{violation.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                violation.status === "resolved"
                                  ? "success"
                                  : violation.status === "investigating"
                                    ? "warning"
                                    : "destructive"
                              }
                            >
                              {violation.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{violation.actionTaken}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance Trend</CardTitle>
                    <CardDescription>Monthly compliance rate over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <TrendingUp className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                      <p className="text-neutral-600">Compliance chart placeholder</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Consent Revocation Rate</CardTitle>
                    <CardDescription>Citizen consent revocation trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <TrendingUp className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                      <p className="text-neutral-600">Revocation chart placeholder</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Data Breach Occurrences</CardTitle>
                    <CardDescription>Security incidents tracking</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <AlertTriangle className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                      <p className="text-neutral-600">Breach tracking chart placeholder</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
