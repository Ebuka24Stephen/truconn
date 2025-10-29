"use client"

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
import { mockAccessLogs } from "@/lib/mock-data"

export default function DataAccessLogsPage() {
  return (
    <div className="flex h-screen bg-neutral-50">
      <OrganizationSidebar />

      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 p-6 shadow-sm">
          <div className="max-w-7xl mx-auto">
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
                    <Input type="text" placeholder="Search by citizen ID, data type..." className="pl-10" />
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
                    {mockAccessLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">CID-{log.id.padStart(6, "0")}</TableCell>
                        <TableCell>
                          <Badge variant="outline">Identity</Badge>
                        </TableCell>
                        <TableCell className="text-sm">{new Date(log.dateTime).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={log.accessType === "Read" ? "success" : "warning"}>
                            {log.accessType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{log.purpose}</TableCell>
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


