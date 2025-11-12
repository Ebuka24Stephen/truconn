"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Award, CheckCircle2, AlertTriangle } from "lucide-react"
import { type TrustScore } from "@/lib/trust/api"

interface TrustScoreCardProps {
  trustScore: TrustScore
  showDetails?: boolean
  organizationName?: string
}

export function TrustScoreCard({ trustScore, showDetails = true, organizationName }: TrustScoreCardProps) {
  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case "EXCELLENT":
        return "bg-emerald-500 text-white"
      case "VERIFIED":
        return "bg-blue-500 text-white"
      case "GOOD":
        return "bg-amber-500 text-white"
      case "BASIC":
        return "bg-neutral-400 text-white"
      case "LOW":
        return "bg-red-500 text-white"
      default:
        return "bg-neutral-200 text-neutral-700"
    }
  }

  const getTrustLevelIcon = (level: string) => {
    switch (level) {
      case "EXCELLENT":
      case "VERIFIED":
        return <Award className="w-5 h-5" />
      default:
        return <Shield className="w-5 h-5" />
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-600"
    if (score >= 75) return "text-blue-600"
    if (score >= 60) return "text-amber-600"
    if (score >= 40) return "text-neutral-600"
    return "text-red-600"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Trust Score
            </CardTitle>
            {organizationName && <CardDescription>{organizationName}</CardDescription>}
          </div>
          <Badge className={getTrustLevelColor(trustScore.trust_level)}>
            <div className="flex items-center gap-1">
              {getTrustLevelIcon(trustScore.trust_level)}
              {trustScore.trust_level}
            </div>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Score */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-neutral-600">Overall Score</span>
              <span className={`text-3xl font-bold ${getScoreColor(trustScore.overall_score)}`}>
                {trustScore.overall_score.toFixed(1)}
              </span>
            </div>
            <div className="w-full h-4 bg-neutral-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  trustScore.overall_score >= 90
                    ? "bg-emerald-500"
                    : trustScore.overall_score >= 75
                      ? "bg-blue-500"
                      : trustScore.overall_score >= 60
                        ? "bg-amber-500"
                        : trustScore.overall_score >= 40
                          ? "bg-neutral-400"
                          : "bg-red-500"
                }`}
                style={{ width: `${trustScore.overall_score}%` }}
              />
            </div>
          </div>

          {/* Certificate Status */}
          {trustScore.certificate_issued && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-emerald-900">Trust Certificate Issued</p>
                {trustScore.certificate_issued_at && (
                  <p className="text-xs text-emerald-700">
                    Issued: {new Date(trustScore.certificate_issued_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Component Scores */}
          {showDetails && (
            <div className="space-y-2 pt-2 border-t">
              <p className="text-sm font-semibold text-neutral-700 mb-3">Component Scores</p>
              {Object.entries(trustScore.components).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600 capitalize">
                    {key.replace(/_/g, " ")}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">{value.toFixed(0)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Last Calculated */}
          <div className="text-xs text-neutral-500 pt-2 border-t">
            Last calculated: {new Date(trustScore.last_calculated).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

