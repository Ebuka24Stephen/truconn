"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Show splash screen for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center overflow-hidden relative">
        {/* Animated background glows */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse-glow"
            style={{
              transform: "translate(-50%, -50%)",
            }}
          />
          <div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl animate-pulse-glow"
            style={{
              animationDelay: "0.5s",
            }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-glow"
            style={{
              animationDelay: "1s",
            }}
          />
        </div>

        {/* Logo and text */}
        <div className="relative z-10 text-center animate-fade-in">
          <div className="mb-6 animate-bounce-subtle">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-600 to-violet-700 rounded-full flex items-center justify-center shadow-2xl web3-glow">
              <span className="text-3xl font-bold text-white">✓</span>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-white mb-2">TruCon</h1>
          <p className="text-lg text-purple-300">Where Trust Meets Connection</p>

          {/* Loading indicator */}
          <div className="mt-8 flex justify-center gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-purple-400 rounded-full animate-pulse-glow"
                style={{
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}
