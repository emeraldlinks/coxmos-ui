"use client"

import { useState, useEffect } from "react"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Terminal, Copy, Check, ArrowRight, Loader2 } from "lucide-react"

export default function CLIAuthPage() {
  const [codeHash, setCodeHash] = useState("")
  const [codePrefix, setCodePrefix] = useState("")
  const [displayCode, setDisplayCode] = useState("")
  const [claimCode, setClaimCode] = useState("")
  const [copied, setCopied] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [expiresIn, setExpiresIn] = useState<number | null>(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    registerNewCode()
  }, [])

  const registerNewCode = async () => {
    setRegistering(true)
    try {
      const raw = "coxmos-" + Math.random().toString(36).slice(2, 10).toUpperCase()
      const encoder = new TextEncoder()
      const data = encoder.encode(raw)
      const hash = await crypto.subtle.digest("SHA-256", data)
      const hashHex = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("")
      const prefix = raw.slice(0, 8)

      const res = await api.cliRegisterDevice({ code_hash: hashHex, code_prefix: prefix })
      setCodeHash(hashHex)
      setCodePrefix(prefix)
      setDisplayCode(raw)
      setExpiresIn(res.expires_in)
      setMessage("New device code generated")
    } catch {
      // Fallback: display a code even if server unavailable
      const fallback = "coxmos-" + Math.random().toString(36).slice(2, 10).toUpperCase()
      setDisplayCode(fallback)
      setCodePrefix(fallback.slice(0, 8))
      setMessage("Could not register with server — showing demo code")
    }
    setRegistering(false)
  }

  const handleClaim = async () => {
    if (!claimCode) return
    setClaiming(true)
    try {
      const res = await api.cliClaimDevice({ code: claimCode })
      setMessage("Device code claimed successfully!")
      setClaimCode("")
    } catch (e: any) {
      setMessage(e.message || "Failed to claim code")
    }
    setClaiming(false)
  }

  const copyCode = async () => {
    await navigator.clipboard.writeText(displayCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">CLI Authentication</h1>
        <p className="text-sm text-gray-500 mt-0.5">Use device-code flow to authenticate the Coxmos CLI.</p>
      </div>

      {message && (
        <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm text-indigo-700 flex items-center gap-2">
          <Check className="h-4 w-4" /> {message}
          <button onClick={() => setMessage("")} className="ml-auto text-indigo-400 hover:text-indigo-600 cursor-pointer">&times;</button>
        </div>
      )}

      <Card>
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Device Code Flow</h3>
        </div>
        <CardContent className="p-6 space-y-6">
          <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-4">
            <div className="flex items-start gap-3">
              <Terminal className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-indigo-900 mb-1">Run this command in your terminal:</p>
                <code className="text-sm text-indigo-700 font-mono">coxmos login</code>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 block">
              Your one-time code {expiresIn ? `(expires in ${expiresIn}s)` : ""}
            </label>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-mono text-gray-900">
                {registering ? "Generating..." : displayCode}
              </code>
              <Button variant="outline" size="sm" onClick={copyCode} className="gap-1.5" disabled={registering}>
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button variant="outline" size="sm" onClick={registerNewCode} disabled={registering}>
                {registering ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                Regenerate
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Claim a code (authenticated)</h4>
            <p className="text-xs text-gray-500 mb-3">If someone gave you a CLI code, enter it here to authorize their session.</p>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Enter device code..."
                value={claimCode}
                onChange={(e) => setClaimCode(e.target.value)}
              />
              <Button disabled={claiming || !claimCode} onClick={handleClaim} className="gap-1.5">
                {claiming ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowRight className="h-3.5 w-3.5" />}
                Claim
              </Button>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">How it works</h4>
            <ol className="list-decimal ml-4 text-sm text-gray-600 space-y-1.5">
              <li>Install the CLI: <code className="text-xs bg-gray-200 px-1.5 py-0.5 rounded font-mono">npm install -g coxmos-cli</code></li>
              <li>Run <code className="text-xs bg-gray-200 px-1.5 py-0.5 rounded font-mono">coxmos login</code> in your terminal</li>
              <li>Copy the code shown above and enter it at the prompt</li>
              <li>The CLI receives a JWT token and authenticates all subsequent requests</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
