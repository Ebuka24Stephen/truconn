"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BackButton } from "@/components/back-button"
import { useAuth } from "@/lib/auth/context"
import { CitizenSidebar } from "@/components/citizen-sidebar"
import { OrganizationSidebar } from "@/components/organization-sidebar"

export default function HelpPage() {
  const { user, isAuthenticated } = useAuth()
  const SidebarComponent = user?.role === "organization" || user?.role === "ORGANIZATION" 
    ? OrganizationSidebar 
    : isAuthenticated 
      ? CitizenSidebar 
      : null
  const faqs = [
    { q: 'What is TruCon?', a: 'TruCon is a citizen-first data trust platform enabling transparent consent and secure data access for Nigerians.' },
    { q: 'How does consent work?', a: 'You can grant, modify, or revoke consent for specific data categories. Every action is logged for transparency.' },
    { q: 'What is NDPR?', a: 'NDPR is the Nigeria Data Protection Regulation which protects citizens’ personal data rights.' },
    { q: 'Can I revoke access at any time?', a: 'Yes. Revocations are instant and recorded in the transparency ledger.' },
  ]

  return (
    <div className={`min-h-screen ${SidebarComponent ? 'flex' : ''}`} style={{ background: '#F7F9FB' }}>
      {SidebarComponent && <SidebarComponent />}
      <div className={`${SidebarComponent ? 'flex-1 overflow-auto' : ''} px-4 py-10`}>
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#004C99' }}>Help & Trust Education</h1>
            <p className="mt-2" style={{ color: '#4A4A4A' }}>Learn how TruCon protects your data and empowers your choices.</p>
          </div>

        <Card>
          <CardHeader>
            <CardTitle>How TruCon Protects You</CardTitle>
            <CardDescription>Simple explanation of data trust principles</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2" style={{ color: '#4A4A4A' }}>
              <li>Transparent consent for each data category</li>
              <li>Complete access history in your Transparency Log</li>
              <li>Revocation at any time with instant effect</li>
              <li>Compliance checks aligned with NDPR</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Quick answers to common questions</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="py-3 border-b text-left font-semibold" style={{ color: '#222222' }}>{item.q}</AccordionTrigger>
                  <AccordionContent className="py-3 text-sm" style={{ color: '#4A4A4A' }}>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}
