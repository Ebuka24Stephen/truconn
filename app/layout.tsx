"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { useEffect } from "react"
import "./globals.css"
import "aos/dist/aos.css"
import { MobileNav } from "@/components/mobile-nav"
import { AuthProvider } from "@/lib/auth/context"
import { ApiInterceptor } from "@/lib/api-interceptor"
import AOS from "aos"

const inter = Inter({ subsets: ["latin"] })

function ApiInterceptorInit() {
  useEffect(() => {
    // Initialize API interceptor for activity tracking and auto-logout
    ApiInterceptor.init()
    return () => {
      ApiInterceptor.cleanup()
    }
  }, [])
  return null
}

function AOSInit() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    })
  }, [])
  return null
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground pb-16 md:pb-0`}>
        <AOSInit />
        <AuthProvider>
          <ApiInterceptorInit />
          {children}
          <MobileNav />
        </AuthProvider>
      </body>
    </html>
  )
}
