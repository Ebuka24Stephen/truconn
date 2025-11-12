"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Bell, ShieldAlert, AlertTriangle, CheckCircle, Clock, Building2 } from "lucide-react"
import { CitizenSidebar } from "@/components/citizen-sidebar"
import { OrganizationSidebar } from "@/components/organization-sidebar"
import { useAuth } from "@/lib/auth/context"

interface Notification {
  id: string
  type: "data_access" | "consent_expiry" | "org_request" | "violation" | "revocation"
  title: string
  description: string
  meta?: string
  timestamp: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "data_access",
    title: "First Bank of Nigeria",
    description: "Accessed your Financial data for account verification",
    meta: "Read access • Financial",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "consent_expiry",
    title: "Consent expiring soon",
    description: "Health data consent will expire in 7 days",
    meta: "Health • Lagos State Health Services",
    timestamp: "4 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "org_request",
    title: "New data request",
    description: "GTBank requested access to your Identity data",
    meta: "Purpose: KYC • Duration: 1 year",
    timestamp: "1 day ago",
    read: true,
  },
  {
    id: "4",
    type: "violation",
    title: "Compliance alert",
    description: "Unusual access pattern detected by Compliance Scanner",
    meta: "Risk Score: Medium",
    timestamp: "2 days ago",
    read: true,
  },
  {
    id: "5",
    type: "revocation",
    title: "Access revoked",
    description: "You revoked Identity data access from University of Lagos",
    meta: "Effective immediately",
    timestamp: "2 days ago",
    read: true,
  },
]

export default function NotificationsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [notifications, setNotifications] = useState(mockNotifications)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/notifications")
      return
    }
  }, [isAuthenticated, authLoading, router])

  if (authLoading || !isAuthenticated) {
    return null
  }

  // Determine which sidebar to use based on user role
  const SidebarComponent = user?.role === "organization" || user?.role === "ORGANIZATION" 
    ? OrganizationSidebar 
    : CitizenSidebar

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "data_access":
        return <Building2 className="w-5 h-5 text-[#004C99]" />
      case "consent_expiry":
        return <Clock className="w-5 h-5 text-[#F9C80E]" />
      case "org_request":
        return <Bell className="w-5 h-5 text-[#00B38F]" />
      case "violation":
        return <AlertTriangle className="w-5 h-5 text-red-600" />
      case "revocation":
        return <CheckCircle className="w-5 h-5 text-[#00B38F]" />
      default:
        return <Bell className="w-5 h-5 text-gray-600" />
    }
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <div className="flex h-screen bg-background">
      <SidebarComponent />
      <main className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto p-4 md:p-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 rounded-lg" style={{ background: '#004C991A' }}>
                <ShieldAlert className="w-6 h-6" style={{ color: '#004C99' }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
                <p className="text-sm text-muted-foreground">{notifications.filter((n) => !n.read).length} unread</p>
              </div>
            </div>

            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-muted-foreground">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`flex items-start gap-4 p-4 rounded-lg border transition-all ${
                      notification.read ? "bg-background border-border" : "bg-white border-[#E0E4E8]"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#F0F2F5' }}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-foreground">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">{notification.description}</p>
                          {notification.meta && (
                            <p className="text-xs text-muted-foreground mt-1">{notification.meta}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-1 rounded transition-colors"
                              title="Mark as read"
                              style={{ color: '#004C99' }}
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-1 rounded transition-colors"
                            title="Delete"
                            style={{ color: '#E74C3C' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
