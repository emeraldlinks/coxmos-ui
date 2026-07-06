"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Shield } from "lucide-react"

const webhooks = [
  {
    name: "GitHub",
    endpoint: "POST /webhook/github",
    desc: "Receives push events from GitHub repositories. Triggers automatic redeployments when code is pushed to the app's branch.",
    auth: "HMAC-SHA256 signature (X-Hub-Signature-256)",
    icon: Globe,
  },
  {
    name: "Paystack",
    endpoint: "POST /webhook/paystack",
    desc: "Receives payment events from Paystack (charge.success, charge.failed). Processes subscription activations and failures.",
    auth: "x-paystack-signature verification",
    icon: Shield,
  },
  {
    name: "PayRouter",
    endpoint: "POST /webhook/payrouter",
    desc: "Receives transaction status updates from PayRouter. Verifies transaction status before processing subscription assignments.",
    auth: "IP allowlist + merchant reference matching",
    icon: Shield,
  },
]

export default function WebhooksPage() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Webhooks</h1>
        <p className="text-sm text-gray-500 mt-0.5">Incoming webhook endpoints for GitHub, Paystack, and PayRouter.</p>
      </div>

      <div className="space-y-4">
        {webhooks.map((wh) => (
          <Card key={wh.name}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-indigo-50 p-2.5 shrink-0">
                  <wh.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{wh.name}</h3>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <code className="text-xs font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{wh.endpoint}</code>
                  <p className="text-sm text-gray-600 mt-2">{wh.desc}</p>
                  <p className="text-xs text-gray-400 mt-1.5">Auth: {wh.auth}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Configuration</h3>
        </div>
        <CardContent className="p-6 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">GitHub Webhook</h4>
            <p className="text-xs text-gray-500 mb-2">Configure in your GitHub repository settings under Settings &rarr; Webhooks.</p>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500 mb-1">Payload URL:</p>
              <code className="text-xs font-mono text-gray-900">{process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/webhook/github</code>
              <p className="text-xs text-gray-500 mt-2 mb-1">Content type:</p>
              <code className="text-xs font-mono text-gray-900">application/json</code>
              <p className="text-xs text-gray-500 mt-2 mb-1">Secret:</p>
              <code className="text-xs font-mono text-gray-900">GITHUB_WEBHOOK_SECRET (env)</code>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Paystack Webhook</h4>
            <p className="text-xs text-gray-500 mb-2">Configure in your Paystack dashboard under Settings &rarr; Webhooks.</p>
            <div className="rounded-lg bg-gray-50 p-3">
              <code className="text-xs font-mono text-gray-900">{process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/webhook/paystack</code>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">PayRouter Webhook</h4>
            <p className="text-xs text-gray-500 mb-2">Set as the callback URL when creating transactions via PayRouter API.</p>
            <div className="rounded-lg bg-gray-50 p-3">
              <code className="text-xs font-mono text-gray-900">{process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/webhook/payrouter</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
