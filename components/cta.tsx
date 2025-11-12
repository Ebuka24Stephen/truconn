"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-20 md:py-32 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="relative rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/30 via-gray-900/50 to-violet-900/30 p-12 md:p-16 text-center overflow-hidden backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
              animate={{ x: [0, 50, 0], y: [0, -50, 0] }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl"
              animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
              transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Ready to Build Trust?</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Join thousands of citizens and organizations already using TruCon to create transparent, meaningful
              connections.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="gap-2 trust-button">
                <Link href="/get-started">
                  Get Started Free
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-purple-500 text-purple-300 hover:bg-purple-500/20">
                <Link href="/contact">Contact Sales</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
