"use client"

import { useEffect, useMemo, useState } from "react"
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
import { CheckCircle2, MessageSquare, Send } from "lucide-react"
import { OrganizationAPI, type AccessRequest } from "@/lib/organization/api"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth/context"
import { useRouter } from "next/navigation"
import { BackButton } from "@/components/back-button"

interface Citizen {
  id: number
  full_name: string
  access_requests: Array<{ consent: string; purpose: string; status: string; requested_at: string }>
}

export default function ConsentRequestsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [citizens, setCitizens] = useState<Citizen[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [requestPurpose, setRequestPurpose] = useState("")
  const [requestConsentId, setRequestConsentId] = useState<number | "">("")
  const [requestCitizenId, setRequestCitizenId] = useState<number | "">("")

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "organization")) {
      router.push("/login?redirect=/admin/organization/consent-requests")
      return
    }
    if (!isAuthenticated || user?.role !== "organization") return
    const load = async () => {
      try {
        setIsLoading(true)
        setError("")
        const list = await OrganizationAPI.getCitizens()
        setCitizens(list)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load citizens")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [isAuthenticated, authLoading, user, router])

  const flattened: Array<{
    id: string
    citizenId: number
    citizenName: string
    dataType: string
    purpose: string
    requestedAt: string
    status: string
  }> = useMemo(() => {
    const rows: any[] = []
    if (Array.isArray(citizens)) {
      citizens.forEach((c) => {
        (c.access_requests || []).forEach((r, idx) => {
          rows.push({
            id: `${c.id}-${idx}-${r.requested_at}`,
            citizenId: c.id,
            citizenName: c.full_name,
            dataType: r.consent,
            purpose: r.purpose,
            requestedAt: r.requested_at,
            status: (r.status || "").toLowerCase(),
          })
        })
      })
    }
    return rows
  }, [citizens])

  const handleSendRequest = async () => {
    if (!requestCitizenId || !requestConsentId || !requestPurpose) return
    try {
      setError("")
      await OrganizationAPI.requestConsent(String(requestCitizenId), Number(requestConsentId), requestPurpose)
      setRequestPurpose("")
      setRequestConsentId("")
      setRequestCitizenId("")
      // Reload list
      const list = await OrganizationAPI.getCitizens()
      setCitizens(list)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send request")
    }
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      <OrganizationSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 p-6 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <BackButton href="/admin/organization" className="mb-4" />
            <h1 className="text-3xl font-bold text-primary">Consent Requests</h1>
            <p className="text-neutral-600 mt-1">Manage citizen consent requests for data access</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Send Request */}
            <Card>
              <CardHeader>
                <CardTitle>Send Consent Request</CardTitle>
                <CardDescription>Request access to a citizen's data category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <Input
                    placeholder="Citizen ID"
                    value={requestCitizenId ?? ""}
                    onChange={(e) => setRequestCitizenId(Number(e.target.value) || "")}
                  />
                  <Input
                    placeholder="Consent ID (e.g., 1)"
                    value={requestConsentId ?? ""}
                    onChange={(e) => setRequestConsentId(Number(e.target.value) || "")}
                  />
                  <Input
                    placeholder="Purpose (e.g., KYC verification)"
                    value={requestPurpose}
                    onChange={(e) => setRequestPurpose(e.target.value)}
                  />
                  <Button onClick={handleSendRequest}>
                    <Send className="w-4 h-4 mr-2" /> Send
                  </Button>
                </div>
                {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
              </CardContent>
            </Card>

            {/* Requests Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Consent Requests</CardTitle>
                <CardDescription>Review requests sent to citizens</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-neutral-500">Loading...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Citizen (ID)</TableHead>
                        <TableHead>Data Type</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Requested At</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {flattened.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                            No requests found
                          </TableCell>
                        </TableRow>
                      ) : (
                        flattened.map((request) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-semibold">
                              {request.citizenName} (#{request.citizenId})
                            </TableCell>
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
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}


