"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Database, Shield, FileText, Settings, LogOut, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth/context"

export function CitizenSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

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
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/data-access", label: "My Data Access", icon: Database },
    { href: "/dashboard/consent", label: "Consent Management", icon: Shield },
    { href: "/dashboard/transparency", label: "Transparency Log", icon: FileText },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  // Removed public pages - they're accessible from landing page
  // Public pages like /trust-registry, /developers, /transparency-reports, /help are accessible from landing page only

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-950 to-black border-r border-purple-900/30 h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-purple-900/30">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-violet-700 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
            <span className="text-lg font-bold text-white">✓</span>
          </div>
          <span className="text-xl font-bold text-white">TruCon NDTS</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            // Use startsWith for nested routes, exact match for root routes
            const isActive = item.href === "/dashboard" 
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


