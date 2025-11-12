"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface AnalyticsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
}

export function AnalyticsCard({ title, value, description, icon: Icon, trend }: AnalyticsCardProps) {
  return (
    <Card className="bg-gradient-to-br from-gray-900/70 to-gray-900/40 border-purple-500/30 backdrop-blur-xl hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-400">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-purple-400" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-purple-300">{value}</div>
        {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
        {trend && (
          <p className={`text-xs mt-2 ${trend.isPositive ? "text-emerald-400" : "text-red-400"}`}>
            {trend.isPositive ? "+" : "-"}
            {Math.abs(trend.value)}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  )
}


