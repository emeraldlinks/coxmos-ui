"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Key, Plus, Trash2, Copy, Loader2, Eye, EyeOff } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { APIKey } from "@/lib/types"

export default function APIKeysPage() {
  const [keys, setKeys] = useState<APIKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState("")
  const [newService, setNewService] = useState("")
  const [creating, setCreating] = useState(false)
  const [newKeyData, setNewKeyData] = useState<APIKey | null>(null)

  const load = () => {
    setLoading(true)
    api.listAPIKeys().then((res) => setKeys(res.keys)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleCreate = async () => {
    if (!newName) return
    setCreating(true)
    try {
      const data = await api.createAPIKey({ name: newName, service: newService || undefined })
      setNewKeyData(data)
      setShowNew(false)
      setNewName("")
      setNewService("")
      load()
    } catch {}
    setCreating(false)
  }

  const handleRevoke = async (id: string) => {
    if (!confirm("Revoke this API key?")) return
    await api.revokeAPIKey(id)
    load()
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">API Keys</h1>
          <p className="text-sm text-gray-500">Manage API keys for programmatic access</p>
        </div>
        <Button size="sm" onClick={() => { setShowNew(true); setNewKeyData(null) }}><Plus className="h-3.5 w-3.5" /> New Key</Button>
      </div>

      {newKeyData && (
        <Card className="border-green-200 bg-green-50">
          <div className="px-6 py-4 border-b border-green-200">
            <h3 className="text-sm font-semibold text-green-900">Key Created — Copy it now!</h3>
          </div>
          <CardContent className="p-5 space-y-3">
            <p className="text-sm text-green-700">You won&apos;t be able to see the secret again.</p>
            <div className="flex gap-2">
              <code className="flex-1 rounded-md border border-green-200 bg-white px-3 py-2 text-sm font-mono break-all">{newKeyData.key}...{newKeyData.secret}</code>
              <Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(`${newKeyData.key}.${newKeyData.secret}`)}><Copy className="h-3.5 w-3.5" /></Button>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setNewKeyData(null)}>Dismiss</Button>
          </CardContent>
        </Card>
      )}

      {showNew && (
        <Card>
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">New API Key</h3>
          </div>
          <CardContent className="p-5">
            <div className="flex gap-3 items-end">
              <div className="flex-1 space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Name</label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="my-key" />
              </div>
              <div className="w-32 space-y-1.5">
                <label className="text-xs font-medium text-gray-700">Service</label>
                <Select value={newService} onChange={(e) => setNewService(e.target.value)}>
                  <option value="">All</option>
                  <option value="s3">S3</option>
                  <option value="database">Database</option>
                  <option value="deploy">Deploy</option>
                  <option value="redis">Redis</option>
                </Select>
              </div>
              <Button onClick={handleCreate} disabled={creating || !newName} size="sm">
                {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Create"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowNew(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-16 bg-white border border-gray-200 rounded-lg animate-pulse" />)}</div>
      ) : keys.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Key className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-900 mb-1">No API keys</p>
            <p className="text-xs text-gray-500 mb-4">Create an API key for programmatic access</p>
            <Button size="sm" onClick={() => setShowNew(true)}><Plus className="h-3.5 w-3.5" /> Create Key</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">API Keys ({keys.length})</h3>
          </div>
          <CardContent className="p-0">
            {keys.map((key, i) => (
              <div key={key.id} className={cn(
                "flex items-center justify-between px-6 py-4",
                i !== keys.length - 1 && "border-b border-gray-100"
              )}>
                <div className="flex items-center gap-3">
                  <Key className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{key.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>{key.service || "all"}</span>
                      {key.secret_hint && <span className="font-mono">...{key.secret_hint}</span>}
                      {key.last_used_at && <span>Last used {formatDate(key.last_used_at)}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Created {formatDate(key.created_at)}</span>
                  <button onClick={() => handleRevoke(key.id)} className="text-red-400 hover:text-red-600 cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
