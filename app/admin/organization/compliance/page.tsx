"use client"

import { OrganizationSidebar } from "@/components/organization-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react"

export default function ComplianceScannerPage() {
  const issues = [
    {
      id: "1",
      type: "Unverified Access Detected",
      severity: "high",
      description: "Access attempt from unverified device",
      recommendation: "Enable two-factor authentication",
    },
    {
      id: "2",
      type: "Consent Expiration Warning",
      severity: "medium",
      description: "5 consents expiring within 30 days",
      recommendation: "Send renewal requests",
    },
    {
      id: "3",
      type: "Data Retention Policy",
      severity: "low",
      description: "Review data retention schedules",
      recommendation: "Archive old records",
    },
  ]

  const riskScore = 72 // Out of 100, lower is better

  return (
    <div className="flex h-screen bg-neutral-50">
      <OrganizationSidebar />

      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 p-6 shadow-sm">
          <div className="max-w-7xl mx-auto">
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

            {/* Detected Issues */}
            <Card>
              <CardHeader>
                <CardTitle>Detected Issues</CardTitle>
                <CardDescription>
                  {issues.length} compliance issue{issues.length !== 1 ? "s" : ""} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="p-4 border rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          {issue.severity === "high" ? (
                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          ) : issue.severity === "medium" ? (
                            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          )}
                          <div>
                            <h4 className="font-semibold text-primary">{issue.type}</h4>
                            <p className="text-sm text-neutral-600 mt-1">{issue.description}</p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            issue.severity === "high"
                              ? "destructive"
                              : issue.severity === "medium"
                                ? "warning"
                                : "default"
                          }
                        >
                          {issue.severity}
                        </Badge>
                      </div>
                      <div className="ml-8 mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm font-medium text-blue-900 mb-1">Recommended Action:</p>
                        <p className="text-sm text-blue-800">{issue.recommendation}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4">Run Full Compliance Scan</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}


