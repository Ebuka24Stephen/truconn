"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, FileCheck, Database, Shield, FileText, Settings, LogOut, User, BookOpen, Code, ShieldCheck, BarChart3, HelpCircle, Rocket } from "lucide-react"
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

  // Public pages accessible to organizations (developer portal is org-focused)
  const publicPages = [
    { href: "/developers", label: "Developer Portal", icon: Code },
    { href: "/learn", label: "Learn & Education", icon: BookOpen },
    { href: "/trust-registry", label: "Trust Registry", icon: ShieldCheck },
    { href: "/transparency-reports", label: "Transparency Reports", icon: BarChart3 },
    { href: "/help", label: "Help & FAQ", icon: HelpCircle },
  ]

  // Check if onboarding is needed
  const needsOnboarding = typeof window !== "undefined" && 
    !localStorage.getItem("onboarding_completed") && 
    !localStorage.getItem("onboarding_skipped")

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-neutral-200">
        <Link href="/admin/organization" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-white">✓</span>
          </div>
          <span className="text-xl font-bold text-primary">TruCon NDTS</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Onboarding Link (if needed) */}
        {needsOnboarding && (
          <Link
            href="/admin/organization/onboarding"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2",
              pathname === "/admin/organization/onboarding"
                ? "bg-amber-100 text-amber-700 font-semibold border border-amber-300"
                : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200",
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
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-neutral-600 hover:bg-neutral-100",
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Public Pages Section */}
        <div className="pt-4 mt-4 border-t border-neutral-200">
          <p className="px-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            Resources
          </p>
          <div className="space-y-1">
            {publicPages.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-neutral-600 hover:bg-neutral-100",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-neutral-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}


