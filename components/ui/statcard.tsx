import * as React from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  label: string
  value: number
  accent?: "indigo" | "emerald" | "amber" | "muted"
  icon?: LucideIcon
  className?: string
}

const accentMap: Record<string, { bg: string; text: string; iconBg: string }> = {
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", iconBg: "bg-indigo-100" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", iconBg: "bg-emerald-100" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", iconBg: "bg-amber-100" },
  muted: { bg: "bg-gray-50", text: "text-gray-600", iconBg: "bg-gray-100" },
}

const StatCard = ({ label, value, accent = "muted", icon: Icon, className }: StatCardProps) => {
  const colors = accentMap[accent] || accentMap.muted

  return (
    <div className={cn("rounded-lg border border-border bg-surface p-4 shadow-sm", className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", colors.iconBg)}>
            <Icon className={cn("h-5 w-5", colors.text)} />
          </div>
        )}
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-semibold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  )
}

export { StatCard }
