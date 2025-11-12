"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { OrganizationSidebar } from "@/components/organization-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react"
import { ComplianceAPI, type ComplianceAudit } from "@/lib/compliance/api"
import { useAuth } from "@/lib/auth/context"
import { BackButton } from "@/components/back-button"

export default function ComplianceScannerPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isScanning, setIsScanning] = useState(false)
  const [riskScore, setRiskScore] = useState(0)
  const [audits, setAudits] = useState<ComplianceAudit[]>([])
  const [error, setError] = useState("")
  const [statistics, setStatistics] = useState({
    total_violations: 0,
    critical_count: 0,
    high_count: 0,
    medium_count: 0,
  })

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "organization")) {
      router.push("/login?redirect=/admin/organization/compliance")
      return
    }
    if (!isAuthenticated || user?.role !== "organization") return
    loadComplianceData()
  }, [isAuthenticated, authLoading, user, router])

  const loadComplianceData = async () => {
    try {
      setIsLoading(true)
      setError("")
      const data = await ComplianceAPI.getScanResults()
      setRiskScore(data.risk_score)
      setAudits(data.audits || [])
      setStatistics({
        total_violations: data.total_violations,
        critical_count: data.critical_count,
        high_count: data.high_count,
        medium_count: data.medium_count,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load compliance data")
      console.error("Error loading compliance data:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRunScan = async () => {
    try {
      setIsScanning(true)
      setError("")
      const result = await ComplianceAPI.runScan()
      setRiskScore(result.data.risk_score)
      setAudits(result.data.audit_records || [])
      setStatistics({
        total_violations: result.data.total_violations,
        critical_count: result.data.critical_count,
        high_count: result.data.high_count,
        medium_count: result.data.medium_count,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run compliance scan")
      console.error("Error running compliance scan:", err)
    } finally {
      setIsScanning(false)
    }
  }

  const handleUpdateAuditStatus = async (auditId: number, newStatus: string) => {
    try {
      await ComplianceAPI.updateAuditStatus(auditId, newStatus)
      // Reload compliance data to reflect the change
      await loadComplianceData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update audit status")
      console.error("Error updating audit status:", err)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      case "HIGH":
        return <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
      case "MEDIUM":
        return <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      default:
        return <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
    }
  }

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "destructive"
      case "HIGH":
        return "destructive"
      case "MEDIUM":
        return "warning"
      default:
        return "default"
    }
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      <OrganizationSidebar />

      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 p-6 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <BackButton href="/admin/organization" className="mb-4" />
            <h1 className="text-3xl font-bold text-primary">Compliance Scanner</h1>
            <p className="text-neutral-600 mt-1">AI-driven compliance check and recommendations</p>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Risk Score */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Risk Score</CardTitle>
                <CardDescription>Overall NDPR compliance assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Risk Score</span>
                    <Badge variant={riskScore < 30 ? "success" : riskScore < 70 ? "warning" : "destructive"}>
                      {riskScore}/100
                    </Badge>
                  </div>
                  <div className="w-full h-4 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        riskScore < 30
                          ? "bg-emerald-500"
                          : riskScore < 70
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      style={{ width: `${riskScore}%` }}
                    />
                  </div>
                  <p className="text-sm text-neutral-600">
                    {riskScore < 30
                      ? "Low risk - Excellent compliance"
                      : riskScore < 70
                        ? "Moderate risk - Some areas need attention"
                        : "High risk - Immediate action required"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
            {statistics.total_violations > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{statistics.critical_count}</p>
                      <p className="text-sm text-neutral-600">Critical Issues</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">{statistics.high_count}</p>
                      <p className="text-sm text-neutral-600">High Priority</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-600">{statistics.medium_count}</p>
                      <p className="text-sm text-neutral-600">Medium Priority</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-primary">{statistics.total_violations}</p>
                      <p className="text-sm text-neutral-600">Total Issues</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Detected Issues */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Detected Issues</CardTitle>
                    <CardDescription>
                      {isLoading ? "Loading..." : `${audits.length} compliance issue${audits.length !== 1 ? "s" : ""} found`}
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={handleRunScan} 
                    disabled={isScanning || isLoading}
                    variant="outline"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      "Run Full Compliance Scan"
                    )}
                  </Button>
                </div>
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
                    Loading compliance data...
                  </div>
                ) : audits.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p>No compliance issues detected!</p>
                    <p className="text-sm mt-2">Run a scan to check for compliance violations.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {audits.map((audit) => (
                      <div
                        key={audit.id}
                        className="p-4 border rounded-lg hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            {getSeverityIcon(audit.severity)}
                            <div>
                              <h4 className="font-semibold text-primary">{audit.rule_name}</h4>
                              <p className="text-sm text-neutral-600 mt-1">{audit.rule_description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={getSeverityBadgeVariant(audit.severity)}>
                              {audit.severity}
                            </Badge>
                            <Badge variant={audit.status === "RESOLVED" ? "success" : "warning"}>
                              {audit.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="ml-8 mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="text-sm font-medium text-blue-900 mb-1">Recommended Action:</p>
                          <p className="text-sm text-blue-800">{audit.recommendation}</p>
                        </div>
                        {Object.keys(audit.details || {}).length > 0 && (
                          <div className="ml-8 mt-2 text-xs text-neutral-500">
                            Detected: {new Date(audit.detected_at).toLocaleString()}
                          </div>
                        )}
                        {audit.status !== "RESOLVED" && (
                          <div className="ml-8 mt-3 flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateAuditStatus(audit.id, "RESOLVED")}
                              className="text-xs"
                            >
                              Mark as Resolved
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUpdateAuditStatus(audit.id, "INVESTIGATING")}
                              className="text-xs"
                            >
                              Mark as Investigating
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}


