"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, BookOpen, Download, Play, Shield, Key, Webhook, FileCode } from "lucide-react"
import Link from "next/link"
import { BackButton } from "@/components/back-button"
import { useAuth } from "@/lib/auth/context"
import { OrganizationSidebar } from "@/components/organization-sidebar"
import { CitizenSidebar } from "@/components/citizen-sidebar"

export default function DeveloperPortalPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { user, isAuthenticated } = useAuth()
  // Developer portal is primarily for organizations, but citizens can view it
  const SidebarComponent = user?.role === "organization" || user?.role === "ORGANIZATION" 
    ? OrganizationSidebar 
    : isAuthenticated 
      ? CitizenSidebar 
      : null

  const apiEndpoints = [
    {
      method: "POST",
      path: "/api/auth/signup/",
      description: "Register a new organization",
      auth: "None",
    },
    {
      method: "POST",
      path: "/api/auth/login/",
      description: "Authenticate and get session",
      auth: "None",
    },
    {
      method: "GET",
      path: "/api/organization/trust/registry/",
      description: "Get public trust registry (ranked organizations)",
      auth: "Public",
    },
    {
      method: "GET",
      path: "/api/organization/trust/score/<org_id>/",
      description: "Get organization trust score",
      auth: "Public",
    },
    {
      method: "POST",
      path: "/api/organization/consent/<user_id>/<consent_id>/request/",
      description: "Request consent from a user",
      auth: "Organization",
    },
    {
      method: "GET",
      path: "/api/compliance/scan/",
      description: "Run compliance scan",
      auth: "Organization",
    },
    {
      method: "GET",
      path: "/api/organization/trust/integrity/",
      description: "Get data integrity status",
      auth: "Organization",
    },
  ]

  const codeExamples = {
    javascript: `// Example: Get Trust Score for Organization
const response = await fetch('https://truconn.onrender.com/api/organization/trust/score/1/', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});

const data = await response.json();
console.log('Trust Score:', data.trust_score);
console.log('Trust Level:', data.trust_level);`,

    python: `# Example: Request Consent
import requests

url = "https://truconn.onrender.com/api/organization/consent/{user_id}/{consent_id}/request/"
headers = {
    "Authorization": "Bearer YOUR_JWT_TOKEN",
    "Content-Type": "application/json"
}

response = requests.post(url, headers=headers)
data = response.json()
print(f"Request Status: {data['message']}")`,

    curl: `# Example: Get Trust Registry
curl -X GET "https://truconn.onrender.com/api/organization/trust/registry/?limit=10" \\
  -H "Content-Type: application/json"`,
  }

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
                <Code className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-primary">Developer Portal</h1>
                <p className="text-neutral-600 mt-2">
                  Integrate TruCon into your application with our comprehensive API and SDKs
                </p>
              </div>
            </div>
          </div>

        {/* Quick Start */}
        <Card className="bg-gradient-to-r from-primary/10 to-blue-50 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              Quick Start
            </CardTitle>
            <CardDescription>Get started with TruCon API in minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Register Your Organization</h3>
                  <p className="text-sm text-neutral-600">
                    Create an account and get your API credentials
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Authenticate</h3>
                  <p className="text-sm text-neutral-600">
                    Use JWT tokens or session cookies for authentication
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Request Consent</h3>
                  <p className="text-sm text-neutral-600">
                    Send consent requests to users and handle responses
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold">Monitor Compliance</h3>
                  <p className="text-sm text-neutral-600">
                    Use compliance scanner to ensure NDPR adherence
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="endpoints">API Endpoints</TabsTrigger>
            <TabsTrigger value="examples">Code Examples</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Overview</CardTitle>
                <CardDescription>Understanding the TruCon API</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Base URL
                  </h3>
                  <code className="bg-neutral-100 px-3 py-1 rounded text-sm">
                    https://truconn.onrender.com/api
                  </code>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    Authentication
                  </h3>
                  <p className="text-sm text-neutral-600">
                    TruCon supports both JWT tokens and session-based authentication. Include your
                    credentials in the Authorization header or use session cookies.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <FileCode className="w-4 h-4" />
                    Response Format
                  </h3>
                  <p className="text-sm text-neutral-600">
                    All API responses are in JSON format. Success responses include a data field,
                    while errors include an error field with a descriptive message.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoints</CardTitle>
                <CardDescription>Complete list of available endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {apiEndpoints.map((endpoint, idx) => (
                    <div
                      key={idx}
                      className="p-4 border rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              endpoint.method === "GET"
                                ? "default"
                                : endpoint.method === "POST"
                                  ? "success"
                                  : "warning"
                            }
                          >
                            {endpoint.method}
                          </Badge>
                          <code className="text-sm font-mono">{endpoint.path}</code>
                        </div>
                        <Badge variant="outline">{endpoint.auth}</Badge>
                      </div>
                      <p className="text-sm text-neutral-600">{endpoint.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="examples" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Code Examples</CardTitle>
                <CardDescription>Sample code for common operations</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="javascript" className="w-full">
                  <TabsList>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                  </TabsList>
                  <TabsContent value="javascript">
                    <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{codeExamples.javascript}</code>
                    </pre>
                  </TabsContent>
                  <TabsContent value="python">
                    <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{codeExamples.python}</code>
                    </pre>
                  </TabsContent>
                  <TabsContent value="curl">
                    <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
                      <code>{codeExamples.curl}</code>
                    </pre>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="w-5 h-5" />
                  Webhooks
                </CardTitle>
                <CardDescription>Receive real-time notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Setting Up Webhooks</h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Configure your webhook URL in your organization settings to receive real-time
                    notifications about consent changes.
                  </p>
                  <div className="bg-neutral-100 p-4 rounded-lg">
                    <p className="text-sm font-mono mb-2">Webhook Events:</p>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>consent_changed - When a user grants or revokes consent</li>
                      <li>consent_expired - When a consent expires</li>
                      <li>violation_detected - When a compliance violation is detected</li>
                      <li>trust_score_updated - When your organization's trust score changes</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Webhook Payload Example</h3>
                  <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`{
  "event": "consent_changed",
  "timestamp": "2025-12-11T10:30:00Z",
  "organization_id": 1,
  "user_id": "uuid-here",
  "consent_type": "Financial",
  "action": "revoked",
  "access_request_id": 123
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* SDKs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              SDKs & Libraries
            </CardTitle>
            <CardDescription>Official SDKs for popular languages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">JavaScript/TypeScript</h3>
                <p className="text-sm text-neutral-600 mb-3">
                  Official SDK for Node.js and browser environments
                </p>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Python</h3>
                <p className="text-sm text-neutral-600 mb-3">
                  Python SDK for server-side integrations
                </p>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">PHP</h3>
                <p className="text-sm text-neutral-600 mb-3">
                  PHP SDK for web applications
                </p>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sandbox */}
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5 text-amber-700" />
              Testing Sandbox
            </CardTitle>
            <CardDescription>Test your integration in a safe environment</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-neutral-700 mb-4">
              Use our sandbox environment to test your integration without affecting production data.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <span className="text-sm font-medium">Sandbox Base URL</span>
                <code className="text-xs bg-neutral-100 px-2 py-1 rounded">
                  https://sandbox.truconn.onrender.com/api
                </code>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <span className="text-sm font-medium">Test Credentials</span>
                <Badge variant="outline">Available in Dashboard</Badge>
              </div>
            </div>
            <Button className="mt-4" variant="outline" disabled>
              Access Sandbox (Coming Soon)
            </Button>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  )
}

