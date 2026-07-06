"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Plus, ExternalLink, Play, Square, RotateCcw } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { App } from "@/lib/types"

export default function AppsPage() {
  const { user } = useAuth()
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setApps(user?.apps || [])
    setLoading(false)
  }, [user])

  const handleAction = async (action: "stop" | "start" | "restart", app: App) => {
    const fn = action === "stop" ? api.stopApp : action === "start" ? api.startApp : api.restartApp
    await fn({ id: app.id })
    setApps((prev) => prev.map((a) => a.id === app.id ? { ...a, status: action === "stop" ? "stopped" : "live" } : a))
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Apps</h1>
          <p className="text-sm text-gray-500">Manage your deployed applications</p>
        </div>
        <Link href="/apps/deploy"><Button size="sm"><Plus className="h-3.5 w-3.5" /> Deploy</Button></Link>
      </div>

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-lg">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse bg-gray-50 border-b border-gray-100 last:border-0" />)}
        </div>
      ) : apps.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Globe className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-900 mb-1">No apps yet</p>
            <p className="text-xs text-gray-500 mb-4">Deploy your first app from a GitHub repository</p>
            <Link href="/apps/deploy"><Button size="sm"><Plus className="h-3.5 w-3.5" /> Deploy an app</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {apps.map((app, i) => (
            <div key={app.id} className={cn(
              "flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors",
              i !== apps.length - 1 && "border-b border-gray-100"
            )}>
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="rounded-lg bg-indigo-50 p-2 shrink-0">
                  <Globe className="h-4 w-4 text-indigo-600" />
                </div>
                <div className="min-w-0">
                  <Link href={`/apps/${app.slug}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors">{app.name}</Link>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant={app.status === "live" ? "success" : app.status === "failed" ? "destructive" : "warning"} dot>{app.status}</Badge>
                    <span className="text-xs text-gray-400">{app.framework}</span>
                    <span className="text-xs text-gray-400">{app.branch}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {app.uri && (
                  <a href={`https://${app.uri}`} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-gray-600">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {app.status === "live" && (
                  <button onClick={() => handleAction("stop", app)} className="p-1.5 rounded text-red-500 hover:bg-red-50 cursor-pointer"><Square className="h-3.5 w-3.5" /></button>
                )}
                {app.status === "stopped" && (
                  <button onClick={() => handleAction("start", app)} className="p-1.5 rounded text-green-500 hover:bg-green-50 cursor-pointer"><Play className="h-3.5 w-3.5" /></button>
                )}
                <button onClick={() => handleAction("restart", app)} className="p-1.5 rounded text-gray-400 hover:bg-gray-100 cursor-pointer"><RotateCcw className="h-3.5 w-3.5" /></button>
                <span className="text-xs text-gray-400 ml-2">{formatDate(app.last_deployed)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
