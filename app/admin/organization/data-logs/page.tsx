"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { OrganizationSidebar } from "@/components/organization-sidebar"
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
import { Search, Download, Filter } from "lucide-react"
import { OrganizationAPI } from "@/lib/organization/api"
import { useAuth } from "@/lib/auth/context"
import { BackButton } from "@/components/back-button"

interface AccessLog {
  id: number
  citizenId: number
  citizenName: string
  dataType: string
  timestamp: string
  action: string
  purpose: string
}

export default function DataAccessLogsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [logs, setLogs] = useState<AccessLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "organization")) {
      router.push("/login?redirect=/admin/organization/data-logs")
      return
    }
    if (!isAuthenticated || user?.role !== "organization") return
    loadLogs()
  }, [isAuthenticated, authLoading, user, router])

  const loadLogs = async () => {
    try {
      setIsLoading(true)
      const citizens = await OrganizationAPI.getCitizens()
      const accessLogs: AccessLog[] = []
      
      citizens.forEach((citizen) => {
        citizen.access_requests.forEach((request) => {
          accessLogs.push({
            id: accessLogs.length + 1,
            citizenId: citizen.id,
            citizenName: citizen.full_name,
            dataType: request.consent,
            timestamp: request.requested_at,
            action: request.status === "APPROVED" ? "Read" : request.status === "REVOKED" ? "Delete" : "Pending",
            purpose: request.purpose || "Data access",
          })
        })
      })
      
      // Sort by most recent
      accessLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setLogs(accessLogs)
    } catch (err) {
      console.error("Error loading data logs:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      log.citizenName.toLowerCase().includes(search) ||
      log.citizenId.toString().includes(search) ||
      log.dataType.toLowerCase().includes(search) ||
      log.purpose.toLowerCase().includes(search)
    )
  })
  return (
    <div className="flex h-screen bg-neutral-50">
      <OrganizationSidebar />

      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 p-6 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <BackButton href="/admin/organization" className="mb-4" />
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-primary">Data Access Logs</h1>
                <p className="text-neutral-600 mt-1">Full audit trail of data transactions</p>
              </div>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Logs
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <Input 
                      type="text" 
                      placeholder="Search by citizen ID, data type..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>Complete history of data access and modifications</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Citizen ID</TableHead>
                      <TableHead>Data Type</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Purpose</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                          Loading logs...
                        </TableCell>
                      </TableRow>
                    ) : filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                          {searchTerm ? "No logs match your search" : "No access logs found"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">
                            {log.citizenName} (#{log.citizenId})
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.dataType}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(log.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={log.action === "Read" ? "success" : log.action === "Delete" ? "destructive" : "warning"}>
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">{log.purpose}</TableCell>
                        </TableRow>
                      ))
                    )}
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


