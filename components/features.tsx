"use client"

import { motion } from "framer-motion"
import { Shield, Eye, FileCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Shield,
    title: "Consent Management",
    description:
      "Take full control of your personal data. Grant, modify, or revoke consent with clear transparency on what data is shared and with whom.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: Eye,
    title: "Transparency Dashboard",
    description:
      "Real-time visibility into how your data is being accessed. View detailed logs of every organization that accesses your information and when.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
  {
    icon: FileCheck,
    title: "Compliance Engine",
    description:
      "Organizations get automated compliance monitoring under NDPR standards. Receive alerts and recommendations to maintain data protection standards.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-4">
            Empowered Data Control
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Your right to data privacy and control. See, manage, and protect your personal information with complete
            transparency.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-2 hover:border-accent/50 transition-all duration-300 hover:shadow-xl group">
                  <CardHeader>
                    <div className={`mb-4 inline-flex p-4 rounded-xl ${feature.bgColor} group-hover:scale-110 transition-transform`}>
                      <Icon className={feature.color} size={32} />
                    </div>
                    <CardTitle className="text-xl font-bold text-primary mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed text-neutral-600">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
