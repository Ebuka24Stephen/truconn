"use client"

import { motion } from "framer-motion"

interface TrustMeterProps {
  value: number // 0-100
  label?: string
}

export function TrustMeter({ value, label = "Data Exposure Level" }: TrustMeterProps) {
  const percentage = Math.min(100, Math.max(0, value))
  const color = percentage <= 30 ? "emerald" : percentage <= 70 ? "amber" : "red"

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-neutral-600">{label}</span>
        <span className={`text-sm font-bold ${getColorClass(color)}`}>{percentage}%</span>
      </div>
      <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getBgColorClass(color)}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-neutral-500">
        <span>Low Risk</span>
        <span>High Risk</span>
      </div>
    </div>
  )
}

function getColorClass(color: string) {
  switch (color) {
    case "emerald":
      return "text-emerald-600"
    case "amber":
      return "text-amber-600"
    case "red":
      return "text-red-600"
    default:
      return "text-neutral-600"
  }
}

function getBgColorClass(color: string) {
  switch (color) {
    case "emerald":
      return "bg-emerald-500"
    case "amber":
      return "bg-amber-500"
    case "red":
      return "bg-red-500"
    default:
      return "bg-neutral-500"
  }
}


