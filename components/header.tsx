"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl" style={{ color: '#004C99' }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#004C99' }}>
            <span className="text-white text-lg font-bold">✓</span>
          </div>
          <span className="font-bold">TruCon</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary" style={{ color: '#4A4A4A' }}>
            Home
          </Link>
          <Link href="/learn" className="text-sm font-medium transition-colors hover:text-primary" style={{ color: '#4A4A4A' }}>
            Learn
          </Link>
          <Link href="/developers" className="text-sm font-medium transition-colors hover:text-primary" style={{ color: '#4A4A4A' }}>
            Developers
          </Link>
          <Link href="/trust-registry" className="text-sm font-medium transition-colors hover:text-primary" style={{ color: '#4A4A4A' }}>
            Trust Registry
          </Link>
          <Link href="/transparency-reports" className="text-sm font-medium transition-colors hover:text-primary" style={{ color: '#4A4A4A' }}>
            Reports
          </Link>
          <Link href="/help" className="text-sm font-medium transition-colors hover:text-primary" style={{ color: '#4A4A4A' }}>
            Help
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild>
            <Link href="/get-started">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-4">
            <Link href="#features" className="block text-foreground/70 hover:text-foreground">
              Features
            </Link>
            <Link href="#how-it-works" className="block text-foreground/70 hover:text-foreground">
              How It Works
            </Link>
            <Link href="#testimonials" className="block text-foreground/70 hover:text-foreground">
              Testimonials
            </Link>
            <div className="pt-4 space-y-2 border-t border-border">
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/get-started">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
