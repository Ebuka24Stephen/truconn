"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ConsentToggleProps {
  category: string
  allowed: boolean
  onToggle: (allowed: boolean) => void
  details?: string
  organizations?: string[]
  duration?: string
}

export function ConsentToggle({
  category,
  allowed,
  onToggle,
  details,
  organizations = [],
  duration,
}: ConsentToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-neutral-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Label htmlFor={`consent-${category}`} className="font-semibold text-primary cursor-pointer">
            {category}
          </Label>
          <Dialog>
            <DialogTrigger asChild>
              <button className="text-neutral-500 hover:text-primary transition">
                <Info className="w-4 h-4" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{category} Data Access</DialogTitle>
                <DialogDescription>
                  Manage your consent settings for {category.toLowerCase()} data
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {details && (
                  <div>
                    <h4 className="font-semibold mb-2">Data Included</h4>
                    <p className="text-sm text-neutral-600">{details}</p>
                  </div>
                )}
                {organizations.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Organizations with Access</h4>
                    <ul className="list-disc list-inside text-sm text-neutral-600">
                      {organizations.map((org, idx) => (
                        <li key={idx}>{org}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {duration && (
                  <div>
                    <h4 className="font-semibold mb-2">Duration</h4>
                    <p className="text-sm text-neutral-600">{duration}</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-sm text-neutral-500 mt-1">
          {allowed ? "Access granted" : "Access denied"}
        </p>
      </div>
      <Switch id={`consent-${category}`} checked={allowed} onCheckedChange={onToggle} />
    </div>
  )
}

