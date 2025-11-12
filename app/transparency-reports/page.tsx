"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, Shield, TrendingUp, AlertTriangle, CheckCircle2, BarChart3 } from "lucide-react"
import { BackButton } from "@/components/back-button"
import { useAuth } from "@/lib/auth/context"
import { CitizenSidebar } from "@/components/citizen-sidebar"
import { OrganizationSidebar } from "@/components/organization-sidebar"

const API_BASE_URL = "https://truconn.onrender.com/api"

interface TransparencyReport {
  period: {
    year: number
    month: number
  }
  users: {
    total: number
    new_this_month: number
  }
  organizations: {
    total: number
    new_this_month: number
  }
  consents: {
    total: number
    active: number
    changes_this_month: number
  }
  access_requests: {
    this_month: number
  }
  compliance: {
    audits_this_month: number
    violations_resolved_this_month: number
  }
  trust: {
    average_trust_score: number
    trust_level_distribution: Array<{ trust_level: string; count: number }>
    top_organizations: Array<{
      id: number
      name: string
      trust_score: number
      trust_level: string
    }>
  }
  generated_at: string
}

export default function TransparencyReportsPage() {
  const { user, isAuthenticated } = useAuth()
  const SidebarComponent = user?.role === "organization" || user?.role === "ORGANIZATION" 
    ? OrganizationSidebar 
    : isAuthenticated 
      ? CitizenSidebar 
      : null
  const [report, setReport] = useState<TransparencyReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReport()
  }, [])

  const fetchReport = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/organization/reports/transparency/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch transparency report")
      }

      const data = await response.json()
      setReport(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load report")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`min-h-screen bg-neutral-50 ${SidebarComponent ? 'flex' : ''}`}>
        {SidebarComponent && <SidebarComponent />}
        <div className={`${SidebarComponent ? 'flex-1 overflow-auto' : ''} p-6 flex items-center justify-center`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-neutral-600">Loading transparency report...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className={`min-h-screen bg-neutral-50 ${SidebarComponent ? 'flex' : ''}`}>
        {SidebarComponent && <SidebarComponent />}
        <div className={`${SidebarComponent ? 'flex-1 overflow-auto' : ''} p-6 flex items-center justify-center`}>
          <Card className="max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-600">{error || "Failed to load report"}</p>
                <button
                  onClick={fetchReport}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  Retry
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  return (
    <div className={`min-h-screen bg-neutral-50 ${SidebarComponent ? 'flex' : ''}`}>
      {SidebarComponent && <SidebarComponent />}
      <div className={`${SidebarComponent ? 'flex-1 overflow-auto' : ''} p-6`}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            {isAuthenticated && <BackButton href={user?.role === "organization" ? "/admin/organization" : "/dashboard"} className="mb-4" />}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2">Community Transparency Report</h1>
                <p className="text-neutral-600">
                  {monthNames[report.period.month - 1]} {report.period.year} - Public Platform Metrics
                </p>
              </div>
              <Badge variant="outline" className="text-sm">
                Public Report
              </Badge>
            </div>
          </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-600 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{report.users.total.toLocaleString()}</div>
              <p className="text-xs text-neutral-500 mt-1">
                +{report.users.new_this_month} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-600 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Organizations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{report.organizations.total.toLocaleString()}</div>
              <p className="text-xs text-neutral-500 mt-1">
                +{report.organizations.new_this_month} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-600 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Active Consents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{report.consents.active.toLocaleString()}</div>
              <p className="text-xs text-neutral-500 mt-1">
                {report.consents.changes_this_month} changes this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-neutral-600 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Avg Trust Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{report.trust.average_trust_score}</div>
              <p className="text-xs text-neutral-500 mt-1">Platform average</p>
            </CardContent>
          </Card>
        </div>

        {/* Trust Level Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Trust Level Distribution
            </CardTitle>
            <CardDescription>Organizations by trust level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {report.trust.trust_level_distribution.map((item) => (
                <div key={item.trust_level} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">{item.count}</div>
                  <div className="text-sm text-neutral-600 mt-1">{item.trust_level}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Organizations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Top Organizations by Trust Score
            </CardTitle>
            <CardDescription>Highest rated organizations this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {report.trust.top_organizations.map((org, idx) => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{org.name}</h3>
                      <Badge variant="outline" className="mt-1">
                        {org.trust_level}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{org.trust_score.toFixed(1)}</div>
                    <div className="text-xs text-neutral-500">Trust Score</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Compliance Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {report.compliance.audits_this_month}
                  </div>
                  <p className="text-sm text-neutral-600">Compliance audits this month</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {report.compliance.violations_resolved_this_month}
                  </div>
                  <p className="text-sm text-neutral-600">Violations resolved this month</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Access Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {report.access_requests.this_month.toLocaleString()}
              </div>
              <p className="text-sm text-neutral-600 mt-2">Data access requests this month</p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <Card className="bg-neutral-50 border-neutral-200">
          <CardContent className="pt-6">
            <p className="text-sm text-neutral-600 text-center">
              Report generated on {new Date(report.generated_at).toLocaleString()}
            </p>
            <p className="text-xs text-neutral-500 text-center mt-2">
              This is a public transparency report. All data is aggregated and anonymized.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

