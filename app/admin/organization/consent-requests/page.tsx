"use client"

import { OrganizationSidebar } from "@/components/organization-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle2, X, MessageSquare } from "lucide-react"
import { mockConsentRequests } from "@/lib/mock-data"

export default function ConsentRequestsPage() {
  const handleApprove = (id: string) => {
    console.log("Approving request:", id)
    // Implement approval logic
  }

  const handleReject = (id: string) => {
    console.log("Rejecting request:", id)
    // Implement rejection logic
  }

  const handleClarify = (id: string) => {
    console.log("Requesting clarification:", id)
    // Implement clarification request logic
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      <OrganizationSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 p-6 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-primary">Consent Requests</h1>
            <p className="text-neutral-600 mt-1">Manage citizen consent requests for data access</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pending</CardTitle>
                  <CardDescription>
                    {mockConsentRequests.filter((r) => r.status === "pending").length} requests
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Approved</CardTitle>
                  <CardDescription>
                    {mockConsentRequests.filter((r) => r.status === "approved").length} requests
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revoked</CardTitle>
                  <CardDescription>
                    {mockConsentRequests.filter((r) => r.status === "revoked").length} requests
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Requests Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Consent Requests</CardTitle>
                <CardDescription>
                  Review and manage requests from citizens for data access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Citizen Name</TableHead>
                      <TableHead>Data Type</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Requested At</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockConsentRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-semibold">{request.citizenName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{request.dataType}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{request.purpose}</TableCell>
                        <TableCell className="text-sm text-neutral-500">
                          {new Date(request.requestedAt).toLocaleString()}
                        </TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {request.status === "pending" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleClarify(request.id)}
                                >
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Clarify
                                </Button>
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleApprove(request.id)}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  Approve
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}


