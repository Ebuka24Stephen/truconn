"use client"

import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Create Account",
    description: "Sign up as a citizen or organization with verified credentials.",
  },
  {
    number: "02",
    title: "Build Profile",
    description: "Complete your profile with relevant information and verification details.",
  },
  {
    number: "03",
    title: "Connect & Engage",
    description: "Start connecting with organizations or citizens in your community.",
  },
  {
    number: "04",
    title: "Track Impact",
    description: "Monitor engagement, feedback, and community impact in real-time.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-gradient-to-b from-black to-gray-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">How TruCon Works</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Get started in four simple steps and begin building trust in your community.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-6 md:gap-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-3 text-purple-500/50">
                  <ArrowRight size={24} />
                </div>
              )}

              <div className="bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-purple-500/30 rounded-xl p-6 h-full backdrop-blur-xl hover:border-purple-500/50 transition-colors">
                <div className="text-4xl font-bold text-purple-400/50 mb-4">{step.number}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
