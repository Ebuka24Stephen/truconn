"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 lg:py-40 bg-gradient-to-br from-white via-blue-50/30 to-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20">
              <ShieldCheck className="w-4 h-4" />
              <span>NDPR Compliant • Government Accredited</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6"
          >
            Rebuilding Trust in{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Nigeria's Digital Economy
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-600 leading-relaxed max-w-3xl mx-auto mb-8"
          >
            TruCon NDTS empowers citizens to control how their personal data is collected, shared, and used — while
            giving organizations compliance visibility under NDPR and global data standards.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
          >
            <Button size="lg" asChild className="gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base">
              <Link href="/get-started">
                Get Started
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8 py-6 text-base border-primary text-primary">
              <Link href="#features">Learn More</Link>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 pt-8 border-t border-neutral-200"
          >
            <p className="text-sm text-neutral-500 mb-4">Trusted by organizations across Nigeria</p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <div className="text-sm font-semibold text-neutral-600">Banking Sector</div>
              <div className="text-sm font-semibold text-neutral-600">Healthcare</div>
              <div className="text-sm font-semibold text-neutral-600">Government Agencies</div>
              <div className="text-sm font-semibold text-neutral-600">Educational Institutions</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
