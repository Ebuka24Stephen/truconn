"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumbs from pathname if not provided
  const breadcrumbs: BreadcrumbItem[] = items || (() => {
    const paths = pathname.split("/").filter(Boolean)
    const crumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }]
    
    let currentPath = ""
    paths.forEach((path, index) => {
      currentPath += `/${path}`
      // Convert path to readable label
      const label = path
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      
      crumbs.push({ label, href: currentPath })
    })
    
    return crumbs
  })()

  if (breadcrumbs.length <= 1) return null

  return (
    <nav className={cn("flex items-center gap-2 text-sm text-neutral-600", className)} aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1
        return (
          <div key={item.href} className="flex items-center gap-2">
            {index === 0 ? (
              <Link
                href={item.href}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Home className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "hover:text-primary transition-colors",
                  isLast && "text-primary font-medium"
                )}
              >
                {item.label}
              </Link>
            )}
            {!isLast && <ChevronRight className="w-4 h-4 text-neutral-400" />}
          </div>
        )
      })}
    </nav>
  )
}

