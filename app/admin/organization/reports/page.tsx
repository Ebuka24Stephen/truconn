"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { OrganizationSidebar } from "@/components/organization-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Calendar } from "lucide-react"
import { useAuth } from "@/lib/auth/context"
import { BackButton } from "@/components/back-button"

export default function ReportsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "organization")) {
      router.push("/login?redirect=/admin/organization/reports")
      return
    }
  }, [isAuthenticated, authLoading, user, router])

  if (authLoading || !isAuthenticated || user?.role !== "organization") {
    return null
  }
  const reports = [
    { id: "1", name: "Daily Access Report", type: "Daily", date: "2025-01-15", size: "2.4 MB" },
    { id: "2", name: "Monthly Compliance Report", type: "Monthly", date: "2025-01-01", size: "5.1 MB" },
    { id: "3", name: "NDPR Compliance Report", type: "Quarterly", date: "2024-12-31", size: "8.7 MB" },
    { id: "4", name: "Data Access Audit", type: "On-Demand", date: "2025-01-10", size: "3.2 MB" },
  ]

  return (
    <div className="flex h-screen bg-neutral-50">
      <OrganizationSidebar />

      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 p-6 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <BackButton href="/admin/organization" className="mb-4" />
            <h1 className="text-3xl font-bold text-primary">Reports & Analytics</h1>
            <p className="text-neutral-600 mt-1">Download compliance and analytics reports</p>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <FileText className="w-8 h-8 text-primary" />
                    <Badge variant="outline">Daily</Badge>
                  </div>
                  <CardTitle className="mt-4">Generate Daily Report</CardTitle>
                  <CardDescription>Access logs and activity summary</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Generate Now</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Calendar className="w-8 h-8 text-primary" />
                    <Badge variant="outline">Monthly</Badge>
                  </div>
                  <CardTitle className="mt-4">Generate Monthly Report</CardTitle>
                  <CardDescription>Comprehensive monthly analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Generate Now</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <FileText className="w-8 h-8 text-primary" />
                    <Badge variant="outline">NDPR</Badge>
                  </div>
                  <CardTitle className="mt-4">NDPR Compliance Report</CardTitle>
                  <CardDescription>Regulatory compliance documentation</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Generate Now</Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Available Reports</CardTitle>
                <CardDescription>Download previously generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary">{report.name}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-neutral-500">
                            <span>{report.type}</span>
                            <span>•</span>
                            <span>{report.date}</span>
                            <span>•</span>
                            <span>{report.size}</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

