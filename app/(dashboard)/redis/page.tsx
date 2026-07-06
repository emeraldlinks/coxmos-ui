"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Server, Plus, Play, Square, RotateCcw, Copy, Terminal, Loader2 } from "lucide-react"
import { formatBytes } from "@/lib/utils"
import type { RedisInstance } from "@/lib/types"

export default function RedisPage() {
  const [instances, setInstances] = useState<RedisInstance[]>([])
  const [loading, setLoading] = useState(true)
  const [logDialogOpen, setLogDialogOpen] = useState(false)
  const [logInstance, setLogInstance] = useState<string | null>(null)
  const [logContent, setLogContent] = useState("")
  const [logLoading, setLogLoading] = useState(false)

  const load = () => {
    setLoading(true)
    api.redisStats().then((res) => setInstances(res.instances || [])).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleAction = async (action: "stop" | "start" | "restart", id: string) => {
    const fn = action === "stop" ? api.stopRedis : action === "start" ? api.startRedis : api.restartRedis
    await fn({ id })
    load()
  }

  const handleViewLogs = async (containerName: string) => {
    setLogInstance(containerName)
    setLogDialogOpen(true)
    setLogLoading(true)
    try {
      const blob = await api.redisLogs(containerName)
      setLogContent(await blob.text())
    } catch { setLogContent("Failed to load logs") }
    setLogLoading(false)
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Redis</h1>
          <p className="text-sm text-gray-500">Managed Redis instances</p>
        </div>
        <Link href="/redis/new"><Button size="sm"><Plus className="h-3.5 w-3.5" /> New Instance</Button></Link>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">{[1, 2].map((i) => <div key={i} className="h-32 bg-white border border-gray-200 rounded-lg animate-pulse" />)}</div>
      ) : instances.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Server className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-900 mb-1">No Redis instances</p>
            <p className="text-xs text-gray-500 mb-4">Create your first Redis instance</p>
            <Link href="/redis/new"><Button size="sm"><Plus className="h-3.5 w-3.5" /> Create Redis</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {instances.map((inst) => (
            <Card key={inst.id}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-50 p-2"><Server className="h-4 w-4 text-green-600" /></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{inst.container_name}</p>
                      <p className="text-xs text-gray-400">Port {inst.host_port}</p>
                    </div>
                  </div>
                  <Badge variant={inst.status === "running" ? "success" : "warning"} dot>{inst.status}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div><span className="text-xs text-gray-400">Memory</span><p className="text-sm font-medium text-gray-900">{inst.memory_usage_mb.toFixed(0)}MB / {inst.memory_limit_mb}MB</p></div>
                  <div><span className="text-xs text-gray-400">CPU</span><p className="text-sm font-medium text-gray-900">{(inst.cpu_percent * 100).toFixed(1)}%</p></div>
                  <div><span className="text-xs text-gray-400">Network RX</span><p className="text-sm font-medium text-gray-900">{formatBytes(inst.network_rx_mb * 1024 * 1024)}</p></div>
                  <div><span className="text-xs text-gray-400">Network TX</span><p className="text-sm font-medium text-gray-900">{formatBytes(inst.network_tx_mb * 1024 * 1024)}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  {inst.status === "running" && <Button variant="destructive" size="xs" onClick={() => handleAction("stop", inst.id)}><Square className="h-3 w-3" /> Stop</Button>}
                  {inst.status === "stopped" && <Button size="xs" onClick={() => handleAction("start", inst.id)}><Play className="h-3 w-3" /> Start</Button>}
                  <Button variant="outline" size="xs" onClick={() => handleAction("restart", inst.id)}><RotateCcw className="h-3 w-3" /> Restart</Button>
                  {inst.status === "running" && <Button variant="outline" size="xs" onClick={() => handleViewLogs(inst.container_name)}><Terminal className="h-3 w-3" /> Logs</Button>}
                  <button onClick={() => navigator.clipboard.writeText(inst.uri)} className="ml-auto text-gray-400 hover:text-gray-600 cursor-pointer"><Copy className="h-3.5 w-3.5" /></button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Terminal className="h-4 w-4" /> Logs: {logInstance}
              {logLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-500" />}
            </DialogTitle>
          </DialogHeader>
          <pre className="p-4 text-xs font-mono text-gray-300 bg-[#1E1B2E] rounded-lg max-h-96 overflow-y-auto leading-relaxed whitespace-pre-wrap">
            {logLoading ? "Loading..." : logContent || "No log output"}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  )
}
