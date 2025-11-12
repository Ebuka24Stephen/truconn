"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, Shield } from "lucide-react"

interface DataIntegrityBadgeProps {
  integrityScore: number
  verifiedCount: number
  totalCount: number
  showDetails?: boolean
}

export function DataIntegrityBadge({
  integrityScore,
  verifiedCount,
  totalCount,
  showDetails = false,
}: DataIntegrityBadgeProps) {
  const getIntegrityColor = (score: number) => {
    if (score >= 95) return "bg-emerald-500 text-white"
    if (score >= 80) return "bg-blue-500 text-white"
    if (score >= 60) return "bg-amber-500 text-white"
    return "bg-red-500 text-white"
  }

  const getIntegrityIcon = (score: number) => {
    if (score >= 95) return <CheckCircle2 className="w-4 h-4" />
    if (score >= 80) return <Shield className="w-4 h-4" />
    return <AlertTriangle className="w-4 h-4" />
  }

  return (
    <div className="flex items-center gap-2">
      <Badge className={getIntegrityColor(integrityScore)}>
        <div className="flex items-center gap-1">
          {getIntegrityIcon(integrityScore)}
          <span>Integrity: {integrityScore.toFixed(1)}%</span>
        </div>
      </Badge>
      {showDetails && (
        <span className="text-xs text-neutral-600">
          {verifiedCount}/{totalCount} verified
        </span>
      )}
    </div>
  )
}

