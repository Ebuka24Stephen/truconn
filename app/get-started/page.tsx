"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Eye, FileCheck } from "lucide-react"

export default function GetStartedPage() {
  const features = [
    { icon: Shield, color: 'purple', title: 'Consent You Control', description: 'Grant or revoke access by category: Financial, Biometric, Health, Identity.' },
    { icon: Eye, color: 'cyan', title: 'Full Transparency', description: 'See who accessed your data, when, and why — in real time.' },
    { icon: FileCheck, color: 'violet', title: 'Built for NDPR', description: 'Compliance-first workflows aligned to Nigeria's data laws.' },
  ]

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }

  const getIconColor = (color: string) => {
    switch (color) {
      case 'purple':
        return 'text-purple-400'
      case 'cyan':
        return 'text-cyan-400'
      case 'violet':
        return 'text-violet-400'
      default:
        return 'text-purple-400'
    }
  }

  const getIconBg = (color: string) => {
    switch (color) {
      case 'purple':
        return 'bg-purple-500/20'
      case 'cyan':
        return 'bg-cyan-500/20'
      case 'violet':
        return 'bg-violet-500/20'
      default:
        return 'bg-purple-500/20'
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
            Your Data. Your Choice. Your Trust.
          </h1>
          <p className="text-xl mb-8 mx-auto max-w-2xl text-gray-300">
            TruCon NDTS empowers Nigerians with transparent consent and secure data verification, built for NDPR.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/onboarding">
              <Button size="lg" className="px-8 trust-button">Start Onboarding</Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="px-8 border-purple-500/50 text-purple-300 hover:bg-purple-500/20">
                Create Account
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div className="grid md:grid-cols-3 gap-8 mt-20" variants={containerVariants} initial="hidden" animate="visible">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div 
                key={index} 
                className="p-8 rounded-xl bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-purple-500/30 backdrop-blur-xl hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20" 
                variants={itemVariants}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${getIconBg(feature.color)}`}>
                  <Icon className={`w-7 h-7 ${getIconColor(feature.color)}`} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 mt-1">{feature.description}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* Assurance Section */}
      <section className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-purple-900/30 via-gray-900/50 to-violet-900/30 border border-purple-500/30 rounded-2xl p-12 backdrop-blur-xl">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-300 to-violet-300 bg-clip-text text-transparent">
              Built for Nigerians. Powered by Trust.
            </h2>
            <p className="text-lg mx-auto max-w-2xl text-gray-300">
              Designed with government-level reliability and citizen-first transparency. Calm motion, clear hierarchy, and consistent UI build confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
        <div className="bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-purple-500/30 rounded-2xl p-12 backdrop-blur-xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to take control?</h2>
          <p className="text-xl mb-8 mx-auto max-w-2xl text-gray-300">
            Start the onboarding flow to set your preferences and manage your data trusts.
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="px-8 trust-button">Begin Now</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
