"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, BookOpen, FileText, AlertCircle, CheckCircle2, Lock, Eye, Users } from "lucide-react"
import Link from "next/link"
import { BackButton } from "@/components/back-button"
import { useAuth } from "@/lib/auth/context"
import { CitizenSidebar } from "@/components/citizen-sidebar"
import { OrganizationSidebar } from "@/components/organization-sidebar"

export default function EducationalPortalPage() {
  const { user, isAuthenticated } = useAuth()
  const SidebarComponent = user?.role === "organization" || user?.role === "ORGANIZATION" 
    ? OrganizationSidebar 
    : isAuthenticated 
      ? CitizenSidebar 
      : null
  const privacyRights = [
    {
      title: "Right to Access",
      description: "You have the right to know what personal data organizations hold about you and how it's being used.",
      icon: Eye,
      color: "text-blue-600",
    },
    {
      title: "Right to Rectification",
      description: "You can request correction of inaccurate or incomplete personal data at any time.",
      icon: FileText,
      color: "text-emerald-600",
    },
    {
      title: "Right to Erasure",
      description: "You can request deletion of your personal data when it's no longer necessary or you withdraw consent.",
      icon: Lock,
      color: "text-red-600",
    },
    {
      title: "Right to Object",
      description: "You can object to processing of your personal data for specific purposes.",
      icon: AlertCircle,
      color: "text-amber-600",
    },
    {
      title: "Right to Data Portability",
      description: "You can request your data in a structured, machine-readable format.",
      icon: FileText,
      color: "text-purple-600",
    },
    {
      title: "Right to Withdraw Consent",
      description: "You can withdraw consent at any time, and it must be respected immediately.",
      icon: CheckCircle2,
      color: "text-green-600",
    },
  ]

  const guides = [
    {
      title: "Understanding NDPR",
      description: "Learn about Nigeria Data Protection Regulation and how it protects your rights.",
      link: "#ndpr-guide",
      category: "Legal",
    },
    {
      title: "Managing Your Consents",
      description: "Step-by-step guide on how to grant, modify, or revoke consent for your data.",
      link: "#consent-guide",
      category: "Tutorial",
    },
    {
      title: "Reading Your Transparency Log",
      description: "Understand how to interpret your data access history and identify suspicious activity.",
      link: "#transparency-guide",
      category: "Tutorial",
    },
    {
      title: "Trust Scores Explained",
      description: "Learn how organization trust scores are calculated and what they mean for you.",
      link: "#trust-guide",
      category: "Education",
    },
    {
      title: "Data Breach Response",
      description: "What to do if you suspect your data has been misused or breached.",
      link: "#breach-guide",
      category: "Security",
    },
    {
      title: "Best Practices for Data Privacy",
      description: "Tips and best practices to protect your personal information online.",
      link: "#best-practices",
      category: "Security",
    },
  ]

  const faqs = [
    {
      q: "What is NDPR?",
      a: "NDPR (Nigeria Data Protection Regulation) is a comprehensive data protection law that governs how organizations collect, process, and store personal data of Nigerian citizens. It gives you rights over your personal information.",
    },
    {
      q: "How do I revoke consent?",
      a: "You can revoke consent at any time through your TruCon dashboard. Simply toggle off the consent for the data type you want to revoke. The organization will be notified immediately and must stop accessing your data.",
    },
    {
      q: "What happens when I revoke consent?",
      a: "When you revoke consent, the organization is immediately notified via email and webhook. They must stop accessing your data for that consent type. Any existing access requests are automatically revoked.",
    },
    {
      q: "How is my data protected?",
      a: "TruCon uses end-to-end encryption, cryptographic integrity checks, and maintains an immutable audit trail. All data access is logged and can be verified through checksums.",
    },
    {
      q: "Can organizations see my personal data?",
      a: "Organizations can only access data types for which you have granted explicit consent. You can see exactly what data they access and when through your transparency log.",
    },
    {
      q: "What is a trust score?",
      a: "Trust scores are calculated based on an organization's compliance with NDPR, data integrity, consent respect, and transparency. Higher scores indicate better data handling practices.",
    },
    {
      q: "How do I report a violation?",
      a: "If you suspect a violation, you can contact the Data Protection Office through your dashboard. TruCon automatically flags critical violations and notifies the DPO.",
    },
    {
      q: "Is my data stored securely?",
      a: "Yes. All data is encrypted at rest and in transit. We use cryptographic checksums to verify data integrity and maintain an immutable audit trail of all access.",
    },
  ]

  return (
    <div className={`min-h-screen bg-neutral-50 ${SidebarComponent ? 'flex' : ''}`}>
      {SidebarComponent && <SidebarComponent />}
      <div className={`${SidebarComponent ? 'flex-1 overflow-auto' : ''} p-6`}>
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
            <div className="flex items-center gap-4 mb-4">
              {isAuthenticated && <BackButton href={user?.role === "organization" ? "/admin/organization" : "/dashboard"} className="mb-4" />}
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-primary">Educational Portal</h1>
                <p className="text-neutral-600 mt-2">
                  Learn about your data rights, privacy protection, and how to use TruCon effectively
                </p>
              </div>
            </div>
          </div>

        {/* Privacy Rights */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Your Data Protection Rights (NDPR)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {privacyRights.map((right, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <right.icon className={`w-6 h-6 ${right.color}`} />
                    <CardTitle className="text-lg">{right.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-neutral-600">{right.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Guides */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Guides & Tutorials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle>{guide.title}</CardTitle>
                    <Badge variant="outline">{guide.category}</Badge>
                  </div>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href={guide.link}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    Read Guide →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Frequently Asked Questions
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border-b last:border-0 pb-6 last:pb-0">
                    <h3 className="font-semibold text-primary mb-2">{faq.q}</h3>
                    <p className="text-neutral-600 text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Ready to Take Control?</CardTitle>
            <CardDescription>Start managing your data privacy today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/dashboard/consent"
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Manage Consents
              </Link>
              <Link
                href="/dashboard/transparency"
                className="px-4 py-2 bg-white border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
              >
                View Transparency Log
              </Link>
              <Link
                href="/trust-registry"
                className="px-4 py-2 bg-white border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
              >
                Browse Trust Registry
              </Link>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
