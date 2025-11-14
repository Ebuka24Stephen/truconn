"use client"

import { useState, useEffect } from "react"
import { CitizenSidebar } from "@/components/citizen-sidebar"
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
import { Input } from "@/components/ui/input"
import { Search, X, FileEdit, AlertCircle } from "lucide-react"
import { OrganizationAPI, type AccessRequest } from "@/lib/organization/api"
import { ConsentsAPI } from "@/lib/consents/api"
import { useAuth } from "@/lib/auth/context"
import { useRouter } from "next/navigation"
import { BackButton } from "@/components/back-button"

interface DataAccessItem {
  id: number
  organizationId: number
  organizationName: string
  dataType: string
  lastAccessed: string
  purpose: string
  status: "active" | "revoked" | "pending"
  consentId: number
}

export default function DataAccessPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "revoked" | "pending">("all")
  const [dataAccess, setDataAccess] = useState<DataAccessItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [consentMap, setConsentMap] = useState<Record<number, string>>({})

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard/data-access")
      return
    }

    // Only load data if authenticated
    if (isAuthenticated) {
      const initialize = async () => {
        await loadConsents()
        await loadDataAccess()
      }
      initialize()
    }
  }, [isAuthenticated, authLoading, router])

  const loadConsents = async () => {
    try {
      const consents = await ConsentsAPI.getConsents()
      const map: Record<number, string> = {}
      consents.forEach((consent) => {
        map[consent.id] = consent.name
      })
      setConsentMap(map)
      return map
    } catch (err) {
      console.error("Error loading consents:", err)
      return {}
    }
  }

  const loadDataAccess = async () => {
    try {
      setIsLoading(true)
      setError("")
      
      // Ensure consents are loaded
      const map = Object.keys(consentMap).length > 0 ? consentMap : await loadConsents()
      
      const response = await OrganizationAPI.getRequestedConsents()
      const list: AccessRequest[] = response.data || []
      
      // Backend serializer already returns the correct format
      const mappedData: DataAccessItem[] = list.map((request: AccessRequest) => ({
        id: request.id,
        organizationId: request.organizationId,
        organizationName: request.organizationName,
        dataType: request.dataType,
        lastAccessed: request.lastAccessed,
        purpose: request.purpose || "Data access request",
        status: request.status === "APPROVED" ? "active" : request.status === "REVOKED" ? "revoked" : "pending",
        consentId: request.consentId,
      }))
      
      setDataAccess(mappedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data access requests")
      console.error("Error loading data access:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredData = dataAccess.filter((item) => {
    const matchesSearch =
      item.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dataType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = 
      selectedStatus === "all" || 
      (selectedStatus === "active" && item.status === "active") ||
      (selectedStatus === "revoked" && item.status === "revoked") ||
      (selectedStatus === "pending" && item.status === "pending")

    return matchesSearch && matchesStatus
  })

  const handleRevoke = async (id: number) => {
    try {
      setError("")
      await OrganizationAPI.toggleAccess(id)
      // Reload data to get updated status
      await loadDataAccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to toggle access")
      console.error("Error toggling access:", err)
    }
  }

  const handleModify = (id: number) => {
    // TODO: Implement modify logic (might need a separate endpoint or modal)
    console.log("Modifying consent:", id)
  }

  return (
    <div className="flex h-screen bg-black">
      <CitizenSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 glass-effect border-b border-purple-900/30 p-6">
          <div className="max-w-7xl mx-auto">
            <BackButton href="/dashboard" className="mb-4" />
            <h1 className="text-3xl font-bold text-white">My Data Access</h1>
            <p className="text-gray-400 mt-1">View and manage organizations accessing your data</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Filters */}
            <Card className="bg-gradient-to-br from-gray-900/70 to-gray-900/40 border-purple-500/30 backdrop-blur-xl">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by organization, data type, or purpose..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white text-black placeholder:text-gray-500 border-purple-500/30"
                    />
                  </div>
                  <div className="flex gap-2">
                    {(["all", "active", "revoked", "pending"] as const).map((status) => (
                      <Button
                        key={status}
                        variant={selectedStatus === status ? "default" : "outline"}
                        onClick={() => setSelectedStatus(status)}
                        className={selectedStatus === status ? "trust-button capitalize" : "border-purple-500/50 text-purple-300 hover:bg-purple-500/20 capitalize"}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Message */}
            {error && (
              <Card className="bg-red-900/30 border-red-500/50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Table */}
            <Card className="bg-gradient-to-br from-gray-900/70 to-gray-900/40 border-purple-500/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Data Access Requests</CardTitle>
                <CardDescription className="text-gray-400">
                  {isLoading
                    ? "Loading..."
                    : `${filteredData.length} organization${filteredData.length !== 1 ? "s" : ""} with access to your data`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-gray-400">Loading data access requests...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-purple-900/30">
                        <TableHead className="text-gray-300">Organization Name</TableHead>
                        <TableHead className="text-gray-300">Data Type</TableHead>
                        <TableHead className="text-gray-300">Requested At</TableHead>
                        <TableHead className="text-gray-300">Purpose</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-right text-gray-300">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.length === 0 ? (
                        <TableRow className="border-purple-900/30">
                          <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                            No data access records found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredData.map((item) => (
                          <TableRow key={item.id} className="border-purple-900/30 hover:bg-purple-900/10">
                            <TableCell className="font-semibold text-white">{item.organizationName}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-purple-500/50 text-purple-300">{item.dataType}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-400">
                              {item.lastAccessed ? new Date(item.lastAccessed).toLocaleDateString() : "N/A"}
                            </TableCell>
                            <TableCell className="text-sm text-gray-300">{item.purpose}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.status === "active"
                                    ? "success"
                                    : item.status === "pending"
                                      ? "warning"
                                      : "destructive"
                                }
                                className={
                                  item.status === "active"
                                    ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                                    : item.status === "pending"
                                      ? "bg-amber-500/20 text-amber-400 border-amber-500/50"
                                      : "bg-red-500/20 text-red-400 border-red-500/50"
                                }
                              >
                                {item.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {(item.status === "active" || item.status === "pending") && (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleRevoke(item.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    <X className="w-4 h-4 mr-1" />
                                    {item.status === "pending" ? "Reject" : "Revoke"}
                                  </Button>
                                )}
                                {item.status === "pending" && (
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => handleRevoke(item.id)}
                                    className="trust-button"
                                  >
                                    Approve
                                  </Button>
                                )}
                              </div>
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


