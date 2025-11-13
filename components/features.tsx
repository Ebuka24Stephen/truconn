"use client"

import { Shield, Eye, FileCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: Shield,
    title: "Consent Management",
    description:
      "Take full control of your personal data. Grant, modify, or revoke consent with clear transparency on what data is shared and with whom.",
    color: "#8B5CF6",
  },
  {
    icon: Eye,
    title: "Transparency Dashboard",
    description:
      "Real-time visibility into how your data is being accessed. View detailed logs of every organization that accesses your information and when.",
    color: "#06B6D4",
  },
  {
    icon: FileCheck,
    title: "Compliance Engine",
    description:
      "Organizations get automated compliance monitoring under NDPR standards. Receive alerts and recommendations to maintain data protection standards.",
    color: "#C084FC",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div
          className="text-center mb-16"
          data-aos="fade-up"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
            Empowered Data Control
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-300">
            Your right to data privacy and control. See, manage, and protect your personal information with complete
            transparency.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <Card 
                  className="h-full card-hover group bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-xl border-purple-500/20"
                >
                  <CardHeader className="space-y-4">
                    <div className="relative">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110"
                        style={{ 
                          background: `${feature.color}20`,
                          boxShadow: `0 0 20px ${feature.color}30`
                        }}
                      >
                        <Icon className="w-8 h-8" style={{ color: feature.color }} />
                      </div>
                    </div>
                    <CardTitle 
                      className="text-xl font-bold mb-2 text-white"
                    >
                      {feature.title}
                    </CardTitle>
                    <CardDescription 
                      className="text-base leading-relaxed text-gray-300"
                    >
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
