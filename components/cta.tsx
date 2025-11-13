"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-20 md:py-32 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-900/30 via-gray-900/50 to-violet-900/30 p-12 md:p-16 text-center overflow-hidden backdrop-blur-xl"
          data-aos="fade-up"
        >
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" data-aos="fade-up" data-aos-delay="100">Ready to Build Trust?</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8" data-aos="fade-up" data-aos-delay="200">
              Join thousands of citizens and organizations already using TruCon to create transparent, meaningful
              connections.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="300">
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
        </div>
      </div>
    </section>
  )
}
