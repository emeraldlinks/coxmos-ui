"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Cpu, Plus, Trash2, Loader2, Check, Globe, Shield, Copy, ExternalLink } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { DNSRecord, Domain } from "@/lib/types"

export default function DNSPage() {
  const [domain, setDomain] = useState("")
  const [domains, setDomains] = useState<Domain[]>([])
  const [records, setRecords] = useState<DNSRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState<"register" | "verify" | "dkim" | "records">("register")
  const [token, setToken] = useState("")
  const [dkimSelector, setDkimSelector] = useState("default")
  const [dkimKey, setDkimKey] = useState("")
  const [appId, setAppId] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    api.listDomains().then((res) => setDomains(res.domains || [])).catch(() => {})
  }, [])

  const handleSetupNameservers = async () => {
    setLoading(true)
    try { const res = await api.setupNameservers(); setMessage(res.message) }
    catch { setMessage("Failed to setup nameservers") }
    setLoading(false)
  }

  const handleRegister = async () => {
    if (!domain) return
    setLoading(true)
    try {
      const res = await api.registerDomain({ domain })
      setMessage(`Domain ${res.domain} registered`)
      const d = await api.listDomains()
      setDomains(d.domains || [])
    } catch { setMessage("Registration failed") }
    setLoading(false)
  }

  const handleRemoveDomain = async (d: string) => {
    if (!confirm(`Remove ${d}?`)) return
    try {
      await api.removeDomain(d)
      setDomains((prev) => prev.filter((x) => x.name !== d))
      setMessage(`Domain ${d} removed`)
    } catch { setMessage("Failed to remove domain") }
  }

  const handleAddVerification = async () => {
    if (!domain || !token) return
    setLoading(true)
    try { const res = await api.addVerificationRecord({ domain, token }); setMessage(res.message) }
    catch { setMessage("Failed to add verification record") }
    setLoading(false)
  }

  const handleVerify = async () => {
    if (!domain || !token) return
    setLoading(true)
    try {
      const res = await api.verifyDomainOwnership({ domain, token })
      setMessage(res.verified ? "Domain verified!" : "Verification check: domain not yet verified")
    } catch { setMessage("Verification check failed") }
    setLoading(false)
  }

  const handleAddDKIM = async () => {
    if (!domain || !dkimKey) return
    setLoading(true)
    try { const res = await api.addDKIMRecord({ domain, selector: dkimSelector, key: dkimKey }); setMessage(res.message) }
    catch { setMessage("Failed to add DKIM record") }
    setLoading(false)
  }

  const handleFetchRecords = async () => {
    if (!domain) return
    setLoading(true)
    try { const res = await api.getDNSRecords(domain); setRecords(res.records); setMessage(`Found ${res.records.length} records`) }
    catch { setMessage("Failed to fetch records") }
    setLoading(false)
  }

  const handleAttach = async () => {
    if (!domain || !appId) return
    setLoading(true)
    try { const res = await api.attachDomain({ domain, app_id: appId }); setMessage(`Domain attached to app ${res.app_id}`) }
    catch { setMessage("Failed to attach domain") }
    setLoading(false)
  }

  const tabs = [
    { id: "register" as const, label: "Register" },
    { id: "verify" as const, label: "Verify" },
    { id: "dkim" as const, label: "DKIM" },
    { id: "records" as const, label: "Records" },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">DNS Management</h1>
          <p className="text-sm text-gray-500">Manage domains, verification, DKIM, and DNS records</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleSetupNameservers} disabled={loading}>
          <Globe className="h-3.5 w-3.5" /> Setup Nameservers
        </Button>
      </div>

      {message && (
        <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm text-indigo-700 flex items-center gap-2">
          <Check className="h-4 w-4" /> {message}
          <button onClick={() => setMessage("")} className="ml-auto text-indigo-400 hover:text-indigo-600 cursor-pointer">&times;</button>
        </div>
      )}

      {domains.length > 0 && (
        <Card>
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Your Domains</h3>
          </div>
          <CardContent className="p-0">
            {domains.map((d, i) => (
              <div key={d.name} className={cn(
                "flex items-center justify-between px-6 py-3",
                i !== domains.length - 1 && "border-b border-gray-100"
              )}>
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium text-gray-900">{d.name}</span>
                  <Badge variant={d.status === "active" ? "success" : "warning"}>{d.status === "active" ? "Verified" : "Pending"}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{formatDate(d.created_at)}</span>
                  <button onClick={() => handleRemoveDomain(d.name)} className="text-red-400 hover:text-red-600 cursor-pointer">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
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

      <Card>
        <CardContent className="p-6 space-y-4">
          <Input placeholder="example.com" value={domain} onChange={(e) => setDomain(e.target.value)} />

          {tab === "register" && (
            <Button onClick={handleRegister} disabled={loading || !domain} className="w-full">
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
              Register Domain
            </Button>
          )}

          {tab === "verify" && (
            <div className="space-y-3">
              <Input placeholder="Verification token" value={token} onChange={(e) => setToken(e.target.value)} />
              <div className="flex gap-2">
                <Button onClick={handleAddVerification} disabled={loading || !domain || !token} className="flex-1">
                  Add TXT Record
                </Button>
                <Button onClick={handleVerify} disabled={loading || !domain || !token} variant="outline" className="flex-1">
                  <Shield className="h-3.5 w-3.5" /> Verify
                </Button>
              </div>
            </div>
          )}

          {tab === "dkim" && (
            <div className="space-y-3">
              <Input placeholder="Selector (default: default)" value={dkimSelector} onChange={(e) => setDkimSelector(e.target.value)} />
              <Input placeholder="DKIM public key" value={dkimKey} onChange={(e) => setDkimKey(e.target.value)} />
              <Button onClick={handleAddDKIM} disabled={loading || !domain || !dkimKey} className="w-full">
                Add DKIM Record
              </Button>
            </div>
          )}

          {tab === "records" && (
            <div className="space-y-3">
              <Button onClick={handleFetchRecords} disabled={loading || !domain} variant="outline" className="w-full">
                Fetch DNS Records
              </Button>
              {records.length > 0 && (
                <div className="rounded-lg border border-gray-200 divide-y divide-gray-100">
                  {records.map((r, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 text-sm">
                      <Badge variant="outline" className="font-mono text-[11px]">{r.type}</Badge>
                      <span className="font-mono text-gray-900 flex-1">{r.name}</span>
                      <span className="text-gray-500 font-mono text-xs truncate max-w-[200px]">{r.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Attach Domain to App</h3>
        </div>
        <CardContent className="p-6">
          <div className="flex gap-2">
            <Input placeholder="App ID" value={appId} onChange={(e) => setAppId(e.target.value)} className="flex-1" />
            <Button onClick={handleAttach} disabled={loading || !domain || !appId}>
              Attach
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
