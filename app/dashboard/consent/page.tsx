"use client"

import { useState } from "react"
import { CitizenSidebar } from "@/components/citizen-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConsentToggle } from "@/components/consent-toggle"
import { Badge } from "@/components/ui/badge"
import { mockConsents } from "@/lib/mock-data"

export default function ConsentManagementPage() {
  const [consents, setConsents] = useState(mockConsents)

  const handleToggle = (id: string, allowed: boolean) => {
    setConsents((prev) => prev.map((c) => (c.id === id ? { ...c, allowed } : c)))
  }

  return (
    <div className="flex h-screen bg-neutral-50">
      <CitizenSidebar />

      <main className="flex-1 overflow-auto">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 p-6 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-primary">Consent Management</h1>
            <p className="text-neutral-600 mt-1">Control what data categories can be accessed</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <p className="text-sm text-blue-900">
                  <strong>Your Right to Control:</strong> Under NDPR, you have the right to grant, modify, or revoke
                  consent for your personal data at any time. Changes take effect immediately.
                </p>
              </CardContent>
            </Card>

            {/* Consent Categories */}
            <div className="space-y-4">
              {consents.map((consent) => (
                <Card key={consent.id}>
                  <CardContent className="pt-6">
                    <ConsentToggle
                      category={consent.category}
                      allowed={consent.allowed}
                      onToggle={(allowed) => handleToggle(consent.id, allowed)}
                      details={consent.details}
                      organizations={consent.organizations}
                      duration={consent.duration}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Consent Summary</CardTitle>
                <CardDescription>Overview of your current consent settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-neutral-50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{consents.length}</div>
                    <div className="text-sm text-neutral-600 mt-1">Total Categories</div>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">
                      {consents.filter((c) => c.allowed).length}
                    </div>
                    <div className="text-sm text-neutral-600 mt-1">Granted</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {consents.filter((c) => !c.allowed).length}
                    </div>
                    <div className="text-sm text-neutral-600 mt-1">Denied</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {consents.reduce((acc, c) => acc + (c.allowed ? c.organizations.length : 0), 0)}
                    </div>
                    <div className="text-sm text-neutral-600 mt-1">Organizations</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}


