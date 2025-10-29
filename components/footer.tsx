"use client"

import Link from "next/link"
import { Mail, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary mb-4">
              <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              TruCon
            </Link>
            <p className="text-foreground/60 text-sm">Where trust meets connection.</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="text-foreground/60 hover:text-foreground transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-foreground/60 hover:text-foreground transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-foreground/60 hover:text-foreground transition">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-foreground/60 hover:text-foreground transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-foreground/60 hover:text-foreground transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/60 hover:text-foreground transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal & Compliance</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-foreground/60 hover:text-foreground transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-foreground/60 hover:text-foreground transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/ndpr" className="text-foreground/60 hover:text-foreground transition">
                  NDPR Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* NDPR Notice */}
        <div className="border-t border-border pt-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>NDPR Compliance Notice:</strong> TruCon NDTS operates in accordance with the Nigeria Data
              Protection Regulation (NDPR) 2019. All data processing activities are conducted with explicit consent and
              in compliance with applicable data protection laws.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-foreground/60">© 2025 TruCon NDTS. All rights reserved.</p>
            <p className="text-xs text-foreground/50 mt-1">Nigeria Digital Trust System • Government Accredited</p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-foreground/60 hover:text-foreground transition">
              <Mail size={18} />
            </Link>
            <Link href="#" className="text-foreground/60 hover:text-foreground transition">
              <Twitter size={18} />
            </Link>
            <Link href="#" className="text-foreground/60 hover:text-foreground transition">
              <Linkedin size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
