"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Stepper } from "@/components/ui/stepper"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Building2, Shield, Code, Webhook, FileText } from "lucide-react"

interface OnboardingData {
  organizationName: string
  email: string
  cacNumber: string
  description: string
  webhookUrl: string
  apiKey: string
  complianceLevel: string
}

export default function OrganizationOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({
    organizationName: "",
    email: "",
    cacNumber: "",
    description: "",
    webhookUrl: "",
    apiKey: "",
    complianceLevel: "BASIC",
  })

  const steps = [
    { id: "welcome", title: "Welcome", description: "Get started with TruCon" },
    { id: "organization", title: "Organization Info", description: "Basic organization details" },
    { id: "compliance", title: "Compliance Setup", description: "NDPR compliance configuration" },
    { id: "integration", title: "Integration", description: "API and webhook setup" },
    { id: "review", title: "Review", description: "Review and complete" },
  ]

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      // Mark onboarding as completed
      localStorage.setItem("onboarding_completed", "true")
      localStorage.removeItem("onboarding_skipped")
      // Complete onboarding
      router.push("/admin/organization")
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const canContinue = () => {
    switch (step) {
      case 0:
        return true
      case 1:
        return data.organizationName && data.email && data.cacNumber
      case 2:
        return data.complianceLevel !== ""
      case 3:
        return true // Webhook and API key are optional
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h1 className="text-3xl font-bold text-primary mb-2">Organization Onboarding</h1>
          <p className="text-neutral-600">
            Complete these steps to set up your organization on TruCon
          </p>
        </div>

        <Stepper steps={steps} currentStep={step} onStepChange={setStep} className="mb-6" />

        <Card>
          <CardHeader>
            <CardTitle>{steps[step].title}</CardTitle>
            <CardDescription>{steps[step].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {step === 0 && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Building2 className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-primary mb-2">
                    Welcome to TruCon for Organizations
                  </h2>
                  <p className="text-neutral-600 mb-6">
                    This wizard will guide you through setting up your organization account,
                    configuring compliance settings, and integrating with our API.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    <div className="p-4 border rounded-lg">
                      <Shield className="w-8 h-8 text-primary mb-2" />
                      <h3 className="font-semibold mb-1">NDPR Compliance</h3>
                      <p className="text-sm text-neutral-600">
                        Automated compliance scanning and reporting
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <Code className="w-8 h-8 text-primary mb-2" />
                      <h3 className="font-semibold mb-1">API Integration</h3>
                      <p className="text-sm text-neutral-600">
                        RESTful API for seamless integration
                      </p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <Webhook className="w-8 h-8 text-primary mb-2" />
                      <h3 className="font-semibold mb-1">Real-time Notifications</h3>
                      <p className="text-sm text-neutral-600">
                        Webhooks for consent changes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="orgName">Organization Name *</Label>
                  <Input
                    id="orgName"
                    value={data.organizationName}
                    onChange={(e) => setData({ ...data, organizationName: e.target.value })}
                    placeholder="Acme Corporation"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Contact Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData({ ...data, email: e.target.value })}
                    placeholder="contact@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="cac">CAC Registration Number *</Label>
                  <Input
                    id="cac"
                    value={data.cacNumber}
                    onChange={(e) => setData({ ...data, cacNumber: e.target.value })}
                    placeholder="RC123456"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Organization Description</Label>
                  <textarea
                    id="description"
                    className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    placeholder="Brief description of your organization..."
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <p className="text-sm text-neutral-600 mb-4">
                  Select your initial compliance level. You can upgrade later as you complete
                  compliance requirements.
                </p>
                <div className="space-y-3">
                  {[
                    { value: "BASIC", label: "Basic", desc: "Starting level, minimal requirements" },
                    { value: "GOOD", label: "Good", desc: "Standard compliance practices" },
                    { value: "VERIFIED", label: "Verified", desc: "Full NDPR compliance" },
                    { value: "EXCELLENT", label: "Excellent", desc: "Exemplary compliance" },
                  ].map((level) => (
                    <div
                      key={level.value}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        data.complianceLevel === level.value
                          ? "border-primary bg-primary/5"
                          : "hover:bg-neutral-50"
                      }`}
                      onClick={() => setData({ ...data, complianceLevel: level.value })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{level.label}</h3>
                          <p className="text-sm text-neutral-600">{level.desc}</p>
                        </div>
                        {data.complianceLevel === level.value && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="webhook">Webhook URL (Optional)</Label>
                  <Input
                    id="webhook"
                    type="url"
                    value={data.webhookUrl}
                    onChange={(e) => setData({ ...data, webhookUrl: e.target.value })}
                    placeholder="https://your-domain.com/webhook"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Receive real-time notifications about consent changes
                  </p>
                </div>
                <div>
                  <Label htmlFor="apiKey">API Key (Optional)</Label>
                  <Input
                    id="apiKey"
                    value={data.apiKey}
                    onChange={(e) => setData({ ...data, apiKey: e.target.value })}
                    placeholder="Will be generated after setup"
                    disabled
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Your API key will be generated after completing onboarding
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Integration Resources
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Visit the Developer Portal for API documentation</li>
                    <li>• Use the Sandbox environment for testing</li>
                    <li>• Check webhook examples in the docs</li>
                  </ul>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-green-900 mb-2">Ready to Complete!</h3>
                  <p className="text-green-800 mb-4">Review your information below:</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-neutral-50 rounded">
                    <span className="font-medium">Organization Name:</span>
                    <span>{data.organizationName}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-neutral-50 rounded">
                    <span className="font-medium">Email:</span>
                    <span>{data.email}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-neutral-50 rounded">
                    <span className="font-medium">CAC Number:</span>
                    <span>{data.cacNumber}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-neutral-50 rounded">
                    <span className="font-medium">Compliance Level:</span>
                    <Badge>{data.complianceLevel}</Badge>
                  </div>
                  {data.webhookUrl && (
                    <div className="flex justify-between p-3 bg-neutral-50 rounded">
                      <span className="font-medium">Webhook URL:</span>
                      <span className="text-sm text-neutral-600">{data.webhookUrl}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handleBack} disabled={step === 0}>
                Back
              </Button>
              <Button onClick={handleNext} disabled={!canContinue()}>
                {step === steps.length - 1 ? "Complete Setup" : "Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

