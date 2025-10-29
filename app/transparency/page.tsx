"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AnalyticsCard } from "@/components/analytics-card"
import { Users, Building2, Shield, Map, CheckCircle2 } from "lucide-react"
import { mockStats } from "@/lib/mock-data"
import Link from "next/link"

export default function TransparencyPortal() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary-light text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Public Transparency Portal</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Open data showing the state of data protection and trust across Nigeria
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-neutral-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <AnalyticsCard
                title="Citizens Empowered"
                value={`${((mockStats.citizens / 200000) * 100).toFixed(1)}%`}
                description={`${mockStats.citizens.toLocaleString()} registered`}
                icon={Users}
              />
              <AnalyticsCard
                title="Organizations Verified"
                value={`${((mockStats.organizations / 1000) * 100).toFixed(1)}%`}
                description={`${mockStats.organizations.toLocaleString()} compliant`}
                icon={Building2}
              />
              <AnalyticsCard
                title="Total Active Consents"
                value={`${(mockStats.citizens * 2.5).toLocaleString()}`}
                description="Data access agreements"
                icon={Shield}
              />
              <AnalyticsCard
                title="Compliance Rate"
                value={`${mockStats.complianceRate}%`}
                description="National average"
                icon={CheckCircle2}
                trend={{ value: 2.1, isPositive: true }}
              />
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Compliance by Region</CardTitle>
                <CardDescription>Interactive map showing data protection compliance across Nigerian states</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300">
                  <div className="text-center">
                    <Map className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <p className="text-blue-700 font-semibold">Nigeria Map Placeholder</p>
                    <p className="text-sm text-blue-600 mt-2">
                      Interactive map showing compliance rates by state
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Is Your Organization Compliant?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Verify your organization's compliance status and ensure you're meeting NDPR requirements
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/get-started">Verify My Organization</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}


