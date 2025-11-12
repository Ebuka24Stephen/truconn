"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-border/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white hover:text-purple-300 transition-colors">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-violet-700 shadow-lg shadow-purple-500/50">
            <span className="text-white text-lg font-bold">✓</span>
          </div>
          <span className="font-bold">TruCon</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-purple-400 text-gray-300">
            Home
          </Link>
          <Link href="/learn" className="text-sm font-medium transition-colors hover:text-purple-400 text-gray-300">
            Learn
          </Link>
          <Link href="/developers" className="text-sm font-medium transition-colors hover:text-purple-400 text-gray-300">
            Developers
          </Link>
          <Link href="/trust-registry" className="text-sm font-medium transition-colors hover:text-purple-400 text-gray-300">
            Trust Registry
          </Link>
          <Link href="/transparency-reports" className="text-sm font-medium transition-colors hover:text-purple-400 text-gray-300">
            Reports
          </Link>
          <Link href="/help" className="text-sm font-medium transition-colors hover:text-purple-400 text-gray-300">
            Help
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild className="text-gray-300 hover:text-white hover:bg-white/10">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild className="trust-button">
            <Link href="/get-started">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-border/50 glass-effect">
          <div className="px-4 py-4 space-y-4">
            <Link href="#features" className="block text-gray-300 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="block text-gray-300 hover:text-white transition-colors">
              How It Works
            </Link>
            <Link href="#testimonials" className="block text-gray-300 hover:text-white transition-colors">
              Testimonials
            </Link>
            <div className="pt-4 space-y-2 border-t border-border/50">
              <Button variant="outline" className="w-full bg-transparent border-purple-500 text-purple-300 hover:bg-purple-500/20" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button className="w-full trust-button" asChild>
                <Link href="/get-started">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
