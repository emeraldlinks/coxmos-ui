"use client"

import { useState } from "react"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Globe, Plus, Trash2, Loader2, Check, Server, ArrowLeftRight } from "lucide-react"

export default function CaddyPage() {
  const [tab, setTab] = useState<"routes" | "tcp" | "headers">("routes")
  const [domain, setDomain] = useState("")
  const [slug, setSlug] = useState("")
  const [port, setPort] = useState("80")
  const [upstream, setUpstream] = useState("")
  const [headerDomain, setHeaderDomain] = useState("")
  const [reqHeaders, setReqHeaders] = useState("")
  const [resHeaders, setResHeaders] = useState("")
  const [removeDomain, setRemoveDomain] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleInit = async () => {
    setLoading(true)
    try { const res = await api.initCaddy(); setMessage(res.message) }
    catch { setMessage("Failed to initialize Caddy") }
    setLoading(false)
  }

  const handleAddRoute = async () => {
    if (!domain || !slug) return
    setLoading(true)
    try {
      const res = await api.addCaddyRoute({ domain, slug, port: port ? parseInt(port) : undefined })
      setMessage(`Route added for ${res.domain}`)
    } catch { setMessage("Failed to add route") }
    setLoading(false)
  }

  const handleDeleteRoute = async () => {
    if (!removeDomain) return
    setLoading(true)
    try { const res = await api.deleteCaddyRoute(removeDomain); setMessage(res.message) }
    catch { setMessage("Failed to delete route") }
    setLoading(false)
  }

  const handleAddTCP = async () => {
    if (!domain || !upstream) return
    setLoading(true)
    try {
      const res = await api.addCaddyTCPRoute({ domain, upstream, port: port ? parseInt(port) : undefined })
      setMessage(`TCP route added for ${res.domain}`)
    } catch { setMessage("Failed to add TCP route") }
    setLoading(false)
  }

  const handleDeleteTCP = async () => {
    if (!removeDomain) return
    setLoading(true)
    try { const res = await api.deleteCaddyTCPRoute(removeDomain); setMessage(res.message) }
    catch { setMessage("Failed to delete TCP route") }
    setLoading(false)
  }

  const handleSetHeaders = async () => {
    if (!headerDomain) return
    setLoading(true)
    try {
      const body: Record<string, Record<string, string>> = {}
      if (reqHeaders) body.request_headers = Object.fromEntries(reqHeaders.split(",").map((s) => s.trim().split(":", 2) as [string, string]))
      if (resHeaders) body.response_headers = Object.fromEntries(resHeaders.split(",").map((s) => s.trim().split(":", 2) as [string, string]))
      const res = await api.setCaddyHeaders(headerDomain, body as any)
      setMessage(res.message)
    } catch { setMessage("Failed to set headers") }
    setLoading(false)
  }

  const tabs = [
    { id: "routes" as const, label: "HTTP Routes" },
    { id: "tcp" as const, label: "TCP Routes" },
    { id: "headers" as const, label: "Headers" },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Caddy</h1>
          <p className="text-sm text-gray-500">Manage HTTP routes, TCP routes, and headers</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleInit} disabled={loading}>
          <Server className="h-3.5 w-3.5" /> Initialize Caddy
        </Button>
      </div>

      {message && (
        <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm text-indigo-700 flex items-center gap-2">
          <Check className="h-4 w-4" /> {message}
          <button onClick={() => setMessage("")} className="ml-auto text-indigo-400 hover:text-indigo-600 cursor-pointer">&times;</button>
        </div>
      )}

      <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
              tab === t.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsContent value="routes">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Add Route</h3>
              </div>
              <CardContent className="p-5 space-y-3">
                <Input placeholder="Domain (e.g. app.example.com)" value={domain} onChange={(e) => setDomain(e.target.value)} />
                <Input placeholder="Slug (e.g. my-app)" value={slug} onChange={(e) => setSlug(e.target.value)} />
                <Input placeholder="Port (default: 80)" value={port} onChange={(e) => setPort(e.target.value)} />
                <Button onClick={handleAddRoute} disabled={loading || !domain || !slug} className="w-full">
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                  Add HTTP Route
                </Button>
              </CardContent>
            </Card>

            <Card>
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Remove Route</h3>
              </div>
              <CardContent className="p-5 space-y-3">
                <Input placeholder="Domain to remove" value={removeDomain} onChange={(e) => setRemoveDomain(e.target.value)} />
                <Button onClick={handleDeleteRoute} disabled={loading || !removeDomain} variant="destructive" className="w-full">
                  <Trash2 className="h-3.5 w-3.5" /> Delete Route
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tcp">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Add TCP Route</h3>
              </div>
              <CardContent className="p-5 space-y-3">
                <Input placeholder="Domain" value={domain} onChange={(e) => setDomain(e.target.value)} />
                <Input placeholder="Upstream (e.g. localhost:3000)" value={upstream} onChange={(e) => setUpstream(e.target.value)} />
                <Input placeholder="Port (default: 80)" value={port} onChange={(e) => setPort(e.target.value)} />
                <Button onClick={handleAddTCP} disabled={loading || !domain || !upstream} className="w-full">
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowLeftRight className="h-3.5 w-3.5" />}
                  Add TCP Route
                </Button>
              </CardContent>
            </Card>

            <Card>
              <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900">Remove TCP Route</h3>
              </div>
              <CardContent className="p-5 space-y-3">
                <Input placeholder="Domain to remove" value={removeDomain} onChange={(e) => setRemoveDomain(e.target.value)} />
                <Button onClick={handleDeleteTCP} disabled={loading || !removeDomain} variant="destructive" className="w-full">
                  <Trash2 className="h-3.5 w-3.5" /> Delete TCP Route
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="headers">
          <Card>
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Set Custom Headers</h3>
            </div>
            <CardContent className="p-5 space-y-3">
              <Input placeholder="Domain" value={headerDomain} onChange={(e) => setHeaderDomain(e.target.value)} />
              <Input placeholder="Request headers (key:val,key2:val2)" value={reqHeaders} onChange={(e) => setReqHeaders(e.target.value)} />
              <Input placeholder="Response headers (key:val,key2:val2)" value={resHeaders} onChange={(e) => setResHeaders(e.target.value)} />
              <Button onClick={handleSetHeaders} disabled={loading || !headerDomain} className="w-full">
                {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Set Headers
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
