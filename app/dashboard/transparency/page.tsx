"use client"

import { useEffect, useState } from "react"
import { CitizenSidebar } from "@/components/citizen-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
import { Search, Filter, Download, AlertCircle } from "lucide-react"
import { ConsentsAPI } from "@/lib/consents/api"
import { useAuth } from "@/lib/auth/context"
import { useRouter } from "next/navigation"
import { BackButton } from "@/components/back-button"

interface TransparencyItem {
  id: number
  organizationName: string
  dateTime: string
  purpose: string
  accessType: "Read" | "Write" | "Delete"
}

export default function TransparencyLogPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOrg, setFilterOrg] = useState("all")
  const [filterPeriod, setFilterPeriod] = useState("all")
  const [logs, setLogs] = useState<TransparencyItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard/transparency")
      return
    }
    if (isAuthenticated) {
      loadLogs()
    }
  }, [isAuthenticated, authLoading, router])

  const loadLogs = async () => {
    try {
      setIsLoading(true)
      setError("")
      const response = await ConsentsAPI.getTransparencyLog()
      const items: TransparencyItem[] = (response.data || []).map((item: any) => ({
        id: item.id,
        organizationName: item.organizationName || `Organization ${item.organizationId || 'Unknown'}`,
        dateTime: item.lastAccessed || item.requested_at,
        purpose: item.purpose || "Data access",
        accessType: item.status === "APPROVED" ? "Read" : item.status === "REVOKED" ? "Delete" : "Read",
      }))
      setLogs(items)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transparency log")
      // keep logs as-is on error
    } finally {
      setIsLoading(false)
    }
  }

  const uniqueOrgs = Array.from(new Set(logs.map((log) => log.organizationName)))

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.purpose.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesOrg = filterOrg === "all" || log.organizationName === filterOrg
    return matchesSearch && matchesOrg
  })

  return (
    <div className="flex h-screen bg-black">
      <CitizenSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 glass-effect border-b border-purple-900/30 p-6">
          <div className="max-w-7xl mx-auto">
            <BackButton href="/dashboard" className="mb-4" />
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Transparency Log</h1>
                <p className="text-gray-400 mt-1">Complete audit trail of data access events</p>
              </div>
              <Button variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/20">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
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

            {/* Filters */}
            <Card className="bg-gradient-to-br from-gray-900/70 to-gray-900/40 border-purple-500/30 backdrop-blur-xl">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by organization or purpose..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white text-black placeholder:text-gray-500 border-purple-500/30"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterOrg}
                      onChange={(e) => setFilterOrg(e.target.value)}
                      className="px-4 py-2 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-gray-900 text-gray-300"
                    >
                      <option value="all">All Organizations</option>
                      {uniqueOrgs.map((org) => (
                        <option key={org} value={org}>
                          {org}
                        </option>
                      ))}
                    </select>
                    <select
                      value={filterPeriod}
                      onChange={(e) => setFilterPeriod(e.target.value)}
                      className="px-4 py-2 border border-purple-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 bg-gray-900 text-gray-300"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logs Table */}
            <Card className="bg-gradient-to-br from-gray-900/70 to-gray-900/40 border-purple-500/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white">Access Events</CardTitle>
                <CardDescription className="text-gray-400">
                  {isLoading
                    ? "Loading..."
                    : `${filteredLogs.length} access event${filteredLogs.length !== 1 ? "s" : ""} recorded`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8 text-gray-400">Loading transparency log...</div>
                ) : (
                  <Table>
                  <TableHeader>
                    <TableRow className="border-purple-900/30">
                      <TableHead className="text-gray-300">Organization Name</TableHead>
                      <TableHead className="text-gray-300">Date/Time</TableHead>
                      <TableHead className="text-gray-300">Purpose</TableHead>
                      <TableHead className="text-gray-300">Access Type</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow className="border-purple-900/30">
                        <TableCell colSpan={4} className="text-center py-8 text-gray-400">
                          No access logs found matching your filters
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log) => (
                        <TableRow key={log.id} className="border-purple-900/30 hover:bg-purple-900/10">
                          <TableCell className="font-semibold text-white">{log.organizationName}</TableCell>
                          <TableCell className="text-sm text-gray-400">
                            {new Date(log.dateTime).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-gray-300">{log.purpose}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={log.accessType === "Read" ? "success" : "warning"}
                              className={log.accessType === "Read" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" : "bg-amber-500/20 text-amber-400 border-amber-500/50"}
                            >
                              {log.accessType}
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


