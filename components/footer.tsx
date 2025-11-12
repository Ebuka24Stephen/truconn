"use client"

import Link from "next/link"
import { Mail, Linkedin, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-purple-900/30 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white mb-4 hover:text-purple-300 transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-violet-700 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              TruCon
            </Link>
            <p className="text-gray-400 text-sm">Where trust meets connection.</p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#features" className="text-gray-400 hover:text-purple-400 transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-gray-400 hover:text-purple-400 transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-purple-400 transition">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-purple-400 transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-purple-400 transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-purple-400 transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal & Compliance</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-purple-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-purple-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/ndpr" className="text-gray-400 hover:text-purple-400 transition">
                  NDPR Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* NDPR Notice */}
        <div className="border-t border-purple-900/30 pt-6 mb-6">
          <div className="bg-purple-950/30 border border-purple-500/30 rounded-lg p-4">
            <p className="text-sm text-purple-200">
              <strong>NDPR Compliance Notice:</strong> TruCon NDTS operates in accordance with the Nigeria Data
              Protection Regulation (NDPR) 2019. All data processing activities are conducted with explicit consent and
              in compliance with applicable data protection laws.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-purple-900/30 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">© 2025 TruCon NDTS. All rights reserved.</p>
            <p className="text-xs text-gray-500 mt-1">Nigeria Digital Trust System • Government Accredited</p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-gray-400 hover:text-purple-400 transition">
              <Mail size={18} />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-purple-400 transition">
              <Twitter size={18} />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-purple-400 transition">
              <Linkedin size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
