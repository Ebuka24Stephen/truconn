"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, FileCheck, Database, Shield, FileText, Settings, LogOut, User, Rocket } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/context"

export function OrganizationSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      // Force a hard reload to clear any cached state
      window.location.href = "/login"
    } catch (error) {
      // Even if logout fails, redirect to login
      window.location.href = "/login"
    }
  }

  const navItems = [
    { href: "/admin/organization", label: "Dashboard Overview", icon: LayoutDashboard },
    { href: "/admin/organization/consent-requests", label: "Consent Requests", icon: FileCheck },
    { href: "/admin/organization/data-logs", label: "Data Access Logs", icon: Database },
    { href: "/admin/organization/compliance", label: "Compliance Scanner", icon: Shield },
    { href: "/admin/organization/reports", label: "Reports & Analytics", icon: FileText },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  // Removed public pages - they're accessible from landing page
  // Public pages like /trust-registry, /developers, /transparency-reports, /help are accessible from landing page only

  // Check if onboarding is needed
  const needsOnboarding = typeof window !== "undefined" && 
    !localStorage.getItem("onboarding_completed") && 
    !localStorage.getItem("onboarding_skipped")

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-950 to-black border-r border-purple-900/30 h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-purple-900/30">
        <Link href="/admin/organization" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-700 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
            <span className="text-lg font-bold text-white">✓</span>
          </div>
          <span className="text-xl font-bold text-white">TruCon NDTS</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Onboarding Link (if needed) */}
        {needsOnboarding && (
          <Link
            href="/admin/organization/onboarding"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 mb-2",
              pathname === "/admin/organization/onboarding"
                ? "bg-gradient-to-r from-amber-600/30 to-yellow-600/30 text-amber-300 font-semibold border border-amber-500/50 shadow-lg shadow-amber-500/20"
                : "bg-amber-900/20 text-amber-400 hover:bg-amber-900/30 border border-amber-500/30",
            )}
          >
            <Rocket className="w-5 h-5" />
            <span>Complete Onboarding</span>
          </Link>
        )}

        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            // Use startsWith for nested routes, exact match for root routes
            const isActive = item.href === "/admin/organization" 
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-purple-600/30 to-violet-600/30 text-purple-300 font-semibold border border-purple-500/50 shadow-lg shadow-purple-500/20"
                    : "text-gray-400 hover:bg-purple-900/20 hover:text-purple-300",
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-purple-900/30">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}


