"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Play, Square, RotateCcw, ExternalLink, GitBranch, ArrowLeft, Terminal, Activity, Loader2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { App, AppDeployment, AppStats } from "@/lib/types"

export default function AppDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { user } = useAuth()
  const [app, setApp] = useState<App | null>(null)
  const [stats, setStats] = useState<AppStats | null>(null)
  const [selectedDeploy, setSelectedDeploy] = useState<AppDeployment | null>(null)
  const [logContent, setLogContent] = useState("")
  const [loadingLog, setLoadingLog] = useState(false)

  useEffect(() => {
    if (user?.apps) {
      const found = user.apps.find((a) => a.slug === slug)
      if (found) setApp(found)
    }
  }, [user, slug])

  useEffect(() => {
    api.appStats(slug).then(setStats).catch(() => {})
  }, [slug])

  const handleViewLogs = async (dep: AppDeployment) => {
    setSelectedDeploy(dep)
    setLoadingLog(true)
    try {
      const blob = await api.appLogs(dep.id)
      const text = await blob.text()
      setLogContent(text.replace(/^data:\s*/gm, ""))
    } catch { setLogContent("Failed to load logs") }
    setLoadingLog(false)
  }

  if (!app) return <div className="p-6 lg:p-8 max-w-6xl mx-auto text-center py-16 text-gray-500">App not found</div>

  const handleAction = async (action: "stop" | "start" | "restart") => {
    const fn = action === "stop" ? api.stopApp : action === "start" ? api.startApp : api.restartApp
    await fn({ id: app.id })
    setApp({ ...app, status: action === "stop" ? "stopped" : "live" })
  }

  const deploys = app.deployments || []

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/apps" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-4 w-4" /></Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-gray-900">{app.name}</h1>
            <Badge variant={app.status === "live" ? "success" : app.status === "failed" ? "destructive" : "warning"} dot>{app.status}</Badge>
          </div>
          <div className="flex items-center gap-3 mt-0.5 text-sm text-gray-400">
            <span className="flex items-center gap-1"><GitBranch className="h-3 w-3" /> {app.branch}</span>
            <span>{app.framework}</span>
            {app.uri && <a href={`https://${app.uri}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-600 hover:underline"><ExternalLink className="h-3 w-3" /> {app.uri}</a>}
          </div>
        </div>
        <div className="flex gap-2">
          {app.status === "live" && <Button variant="destructive" size="sm" onClick={() => handleAction("stop")}><Square className="h-3.5 w-3.5" /> Stop</Button>}
          {app.status === "stopped" && <Button size="sm" onClick={() => handleAction("start")}><Play className="h-3.5 w-3.5" /> Start</Button>}
          <Button variant="outline" size="sm" onClick={() => handleAction("restart")}><RotateCcw className="h-3.5 w-3.5" /> Restart</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Git URL</p>
            <p className="text-sm font-mono text-gray-900 break-all">{app.git_url}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Last Deployed</p>
            <p className="text-sm text-gray-900">{formatDate(app.last_deployed)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Deployments</p>
            <p className="text-2xl font-semibold text-gray-900">{deploys.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Active Isolates</p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats?.isolates ? (Array.isArray(stats.isolates) ? stats.isolates.length : 0) : "-"}
            </p>
          </CardContent>
        </Card>
      </div>

      {deploys.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Deployments</h3>
            </div>
            <CardContent className="p-0 max-h-80 overflow-y-auto">
              {deploys.map((d, i) => (
                <div key={d.id} className={cn(
                  "flex items-center justify-between px-6 py-3 hover:bg-gray-50 cursor-pointer",
                  i !== deploys.length - 1 && "border-b border-gray-100",
                  selectedDeploy?.id === d.id && "bg-indigo-50"
                )} onClick={() => handleViewLogs(d)}>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gray-300" />
                    <div>
                      <p className="text-sm font-mono text-gray-900">{d.commit_sha?.slice(0, 7)}</p>
                      <p className="text-xs text-gray-400">{d.commit_message || "No message"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={d.status === "live" ? "success" : "destructive"} dot>{d.status}</Badge>
                    <span className="text-xs text-gray-400">{formatDate(d.created_at)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Terminal className="h-4 w-4 text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-900">Build Logs</h3>
              {loadingLog && <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />}
            </div>
            <CardContent className="p-0">
              {selectedDeploy ? (
                <pre className="p-4 text-xs font-mono text-gray-300 bg-[#1E1B2E] max-h-80 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                  {logContent || (loadingLog ? "Loading..." : "No log output")}
                </pre>
              ) : (
                <div className="text-center py-12">
                  <Terminal className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Select a deployment to view logs</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {deploys.length === 0 && (
        <Card>
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Deployments</h3>
          </div>
          <CardContent className="p-12 text-center">
            <Activity className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No deployments yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
