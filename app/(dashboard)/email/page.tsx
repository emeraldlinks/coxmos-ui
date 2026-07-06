"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Plus, Globe, Loader2, Check, Server, Copy, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import type { EmailServerConfig } from "@/lib/types"

export default function EmailPage() {
  const [accounts, setAccounts] = useState<{ email: string; name: string }[]>([])
  const [domains, setDomains] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newName, setNewName] = useState("")
  const [newDomain, setNewDomain] = useState("")
  const [creating, setCreating] = useState(false)
  const [addingDomain, setAddingDomain] = useState(false)
  const [verifying, setVerifying] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  const [serverConfig, setServerConfig] = useState<EmailServerConfig | null>(null)
  const [configLoading, setConfigLoading] = useState(false)

  const loadServerConfig = async () => {
    setConfigLoading(true)
    try {
      const res = await api.emailServerConfig()
      setServerConfig(res)
    } catch { setMessage("Failed to load server config") }
    setConfigLoading(false)
  }

  useEffect(() => { loadServerConfig() }, [])

  const handleCreateAccount = async () => {
    if (!newEmail || !newPassword) return
    setCreating(true)
    try {
      const res = await api.createEmailAccount({ email: newEmail, password: newPassword, name: newName || undefined })
      setAccounts((prev) => [...prev, { email: res.email, name: newName }])
      setNewEmail(""); setNewPassword(""); setNewName("")
      setMessage(`Account ${res.email} created`)
    } catch { setMessage("Failed to create account") }
    setCreating(false)
  }

  const handleAddDomain = async () => {
    if (!newDomain) return
    setAddingDomain(true)
    try {
      const res = await api.addMailDomain({ domain: newDomain })
      setDomains((prev) => [...prev, res.domain])
      setNewDomain("")
      setMessage(`Domain ${res.domain} added`)
    } catch { setMessage("Failed to add domain") }
    setAddingDomain(false)
  }

  const handleVerifyDomain = async (domain: string) => {
    setVerifying(domain)
    try {
      const res = await api.verifyMailDomain(domain)
      setMessage(res.verified ? `Domain ${domain} verified` : "Verification failed")
    } catch { setMessage("Verification request failed") }
    setVerifying(null)
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Email (Mailu)</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage email accounts and domains via Mailu integration.</p>
      </div>

      {message && (
        <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm text-indigo-700 flex items-center gap-2">
          <Check className="h-4 w-4" /> {message}
          <button onClick={() => setMessage("")} className="ml-auto text-indigo-400 hover:text-indigo-600 cursor-pointer">&times;</button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-semibold text-gray-900">Email Accounts</h3>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="space-y-3">
              <Input placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              <Input placeholder="Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <Input placeholder="Display name (optional)" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <Button size="sm" className="w-full gap-1.5" disabled={creating || !newEmail || !newPassword} onClick={handleCreateAccount}>
                {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                Create Account
              </Button>
            </div>
            {accounts.length > 0 && (
              <div className="mt-4 space-y-2">
                {accounts.map((acc, i) => (
                  <div key={i} className="rounded-lg bg-gray-50 p-3 text-sm">
                    <p className="font-medium text-gray-900">{acc.email}</p>
                    {acc.name && <p className="text-xs text-gray-500">{acc.name}</p>}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-semibold text-gray-900">Mail Domains</h3>
            </div>
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Input placeholder="example.com" value={newDomain} onChange={(e) => setNewDomain(e.target.value)} />
              <Button size="sm" disabled={addingDomain || !newDomain} className="gap-1.5" onClick={handleAddDomain}>
                {addingDomain ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                Add
              </Button>
            </div>
            <div className="mt-4 space-y-2">
              {domains.map((domain) => (
                <div key={domain} className="rounded-lg bg-gray-50 p-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{domain}</span>
                  <Button variant="outline" size="sm" disabled={verifying === domain} onClick={() => handleVerifyDomain(domain)}>
                    {verifying === domain ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    Verify
                  </Button>
                </div>
              ))}
              {domains.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-4">No domains added yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-semibold text-gray-900">Server Configuration</h3>
          </div>
          <Button variant="outline" size="sm" onClick={loadServerConfig} disabled={configLoading}>
            <RefreshCw className={cn("h-3.5 w-3.5", configLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
        <CardContent className="p-6">
          {serverConfig ? (
            <div className="space-y-6">
              {[
                { label: "SMTP", data: serverConfig.smtp, defaultPort: "587" },
                { label: "IMAP", data: serverConfig.imap, defaultPort: "993" },
                { label: "POP3", data: serverConfig.pop3, defaultPort: "995" },
              ].map((proto) => (
                <div key={proto.label}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">{proto.label}</span>
                    <div className="h-px flex-1 bg-gray-100" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Host</p>
                      <p className="font-mono text-gray-900">{proto.data.host}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Port</p>
                      <p className="font-mono text-gray-900">{proto.data.port}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Encryption</p>
                      <p className="font-mono text-gray-900">{proto.data.tls ? "TLS" : proto.data.starttls ? "STARTTLS" : "None"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Auth</p>
                      <p className="font-mono text-gray-900">{proto.data.auth.join(", ") || "None"}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Webmail:</span>
                  <a href={serverConfig.webmail_url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline font-mono">{serverConfig.webmail_url}</a>
                  <button onClick={() => navigator.clipboard.writeText(serverConfig.webmail_url)} className="text-gray-400 hover:text-gray-600 cursor-pointer"><Copy className="h-3.5 w-3.5" /></button>
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 text-xs text-gray-500 space-y-1">
                <p className="font-medium text-gray-700 mb-1">DNS records required for email delivery:</p>
                <p className="font-mono">MX  10 mail.{serverConfig.smtp.host.replace(/^smtp\./, "")}</p>
                <p className="font-mono">TXT v=spf1 mx ~all</p>
                <p className="font-mono">TXT default._domainkey (DKIM public key)</p>
              </div>
            </div>
          ) : configLoading ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-gray-400" /></div>
          ) : (
            <div className="text-center py-8">
              <Server className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Unable to load server configuration</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={loadServerConfig}>Retry</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
