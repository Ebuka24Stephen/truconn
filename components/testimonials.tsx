"use client"

import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Community Organizer",
    content: "TruCon has transformed how we engage with local government. The transparency is incredible.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "City Administrator",
    content: "Finally, a platform that makes citizen engagement meaningful and measurable.",
    rating: 5,
  },
  {
    name: "Elena Rodriguez",
    role: "Nonprofit Director",
    content: "The verification system gives us confidence that we're connecting with real community members.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-20 md:py-32 bg-gradient-to-b from-gray-950 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div
          className="text-center mb-16"
          data-aos="fade-up"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Trusted by Communities</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            See what users are saying about their TruCon experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-900/70 to-gray-900/40 border border-purple-500/30 rounded-xl p-8 backdrop-blur-xl hover:border-purple-500/50 transition-all"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-purple-400 text-purple-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>

              {/* Author */}
              <div>
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-sm text-gray-400">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
