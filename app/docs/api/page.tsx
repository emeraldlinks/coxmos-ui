"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const endpoints = [
  { method: "GET", path: "/ping", auth: false, desc: "Health check" },
  { method: "GET", path: "/health", auth: false, desc: "Platform health with version info" },
  { method: "POST", path: "/auth/register", auth: false, desc: "Register a new user (email, password, first_name, last_name)" },
  { method: "POST", path: "/auth/login", auth: false, desc: "Login with email & password, returns JWT token" },
  { method: "GET", path: "/auth/me", auth: true, desc: "Get current user profile" },
  { method: "POST", path: "/auth/api-keys", auth: true, desc: "Create a new API key" },
  { method: "GET", path: "/auth/api-keys", auth: true, desc: "List API keys" },
  { method: "DELETE", path: "/auth/api-keys/:id", auth: true, desc: "Revoke an API key" },
  { method: "POST", path: "/auth/api-keys/verify", auth: false, desc: "Verify an API key" },
  { method: "POST", path: "/auth/cli/register", auth: false, desc: "Register a CLI device code" },
  { method: "POST", path: "/auth/cli/claim", auth: true, desc: "Claim a device code (authenticate CLI)" },
  { method: "POST", path: "/auth/cli/poll", auth: false, desc: "Poll device code status" },
  { method: "GET", path: "/auth/github/login", auth: false, desc: "Redirect to GitHub OAuth" },
  { method: "GET", path: "/auth/github/callback", auth: false, desc: "GitHub OAuth callback" },
  { method: "GET", path: "/github/user", auth: true, desc: "Get linked GitHub user info" },
  { method: "GET", path: "/github/repos", auth: true, desc: "List user's GitHub repositories" },
  { method: "GET", path: "/github/install", auth: true, desc: "Redirect to GitHub App install" },
  { method: "GET", path: "/github/callback", auth: true, desc: "GitHub App install callback" },
  { method: "GET", path: "/github/installations/:id/token", auth: true, desc: "Get installation token" },
  { method: "POST", path: "/apps/deploy", auth: true, desc: "Deploy an app from GitHub repo" },
  { method: "GET", path: "/apps/stats", auth: true, desc: "Get app/isolate stats" },
  { method: "GET", path: "/apps/logs", auth: true, desc: "Get deployment build logs" },
  { method: "POST", path: "/apps/stop", auth: true, desc: "Stop an app" },
  { method: "POST", path: "/apps/start", auth: true, desc: "Start an app (isolate apps auto-start)" },
  { method: "POST", path: "/apps/restart", auth: true, desc: "Restart an app (re-trigger last deployment)" },
  { method: "POST", path: "/redis/new", auth: true, desc: "Create a new Redis instance" },
  { method: "GET", path: "/redis/stats", auth: true, desc: "List or get Redis instance stats" },
  { method: "GET", path: "/redis/logs", auth: true, desc: "Get Redis container info" },
  { method: "POST", path: "/redis/stop", auth: true, desc: "Stop a Redis instance" },
  { method: "POST", path: "/redis/start", auth: true, desc: "Start a Redis instance" },
  { method: "POST", path: "/redis/restart", auth: true, desc: "Restart a Redis instance" },
  { method: "POST", path: "/databases/new", auth: true, desc: "Create a new database" },
  { method: "GET", path: "/databases", auth: true, desc: "List databases" },
  { method: "DELETE", path: "/databases/:id", auth: true, desc: "Delete a database" },
  { method: "GET", path: "/s3/buckets", auth: true, desc: "List S3 buckets" },
  { method: "POST", path: "/s3/buckets", auth: true, desc: "Create a bucket" },
  { method: "DELETE", path: "/s3/buckets/:bucket", auth: true, desc: "Delete a bucket" },
  { method: "GET", path: "/s3/buckets/:bucket/objects", auth: true, desc: "List objects in a bucket" },
  { method: "POST", path: "/s3/buckets/:bucket/objects/*key", auth: true, desc: "Upload an object" },
  { method: "GET", path: "/s3/buckets/:bucket/objects/*key", auth: true, desc: "Download an object" },
  { method: "DELETE", path: "/s3/buckets/:bucket/objects/*key", auth: true, desc: "Delete an object" },
  { method: "POST", path: "/s3/presign", auth: true, desc: "Generate presigned URL" },
  { method: "ANY", path: "/s3/proxy/*path", auth: true, desc: "S3 proxy (authenticated via JWT or API key)" },
  { method: "POST", path: "/orgs", auth: true, desc: "Create organization" },
  { method: "GET", path: "/orgs", auth: true, desc: "List organizations" },
  { method: "GET", path: "/orgs/:id", auth: true, desc: "Get organization details" },
  { method: "PUT", path: "/orgs/:id", auth: true, desc: "Update organization" },
  { method: "DELETE", path: "/orgs/:id", auth: true, desc: "Delete organization" },
  { method: "POST", path: "/orgs/:id/invite", auth: true, desc: "Invite a member" },
  { method: "DELETE", path: "/orgs/:id/members/:member_id", auth: true, desc: "Remove a member" },
  { method: "GET", path: "/orgs/:id/members", auth: true, desc: "List members" },
  { method: "GET", path: "/orgs/:id/resources", auth: true, desc: "List org resources" },
  { method: "GET", path: "/orgs/:id/usage", auth: true, desc: "Get org usage" },
  { method: "POST", path: "/orgs/:id/checkout", auth: true, desc: "Create org checkout" },
  { method: "GET", path: "/billing/tiers", auth: true, desc: "List billing tiers" },
  { method: "GET", path: "/billing/subscription", auth: true, desc: "Get current subscription" },
  { method: "POST", path: "/billing/checkout", auth: true, desc: "Create checkout session" },
  { method: "GET", path: "/billing/usage", auth: true, desc: "Get current usage" },
  { method: "POST", path: "/api/v1/dns/setup-nameservers", auth: false, desc: "Setup DNS nameservers" },
  { method: "POST", path: "/api/v1/dns/register", auth: false, desc: "Register a domain" },
  { method: "POST", path: "/api/v1/dns/dkim", auth: false, desc: "Add DKIM record" },
  { method: "DELETE", path: "/api/v1/dns/:domain", auth: false, desc: "Remove a domain" },
  { method: "POST", path: "/api/v1/dns/verify", auth: false, desc: "Add verification record" },
  { method: "POST", path: "/api/v1/dns/verify/check", auth: false, desc: "Check domain ownership" },
  { method: "GET", path: "/api/v1/dns/:domain/records", auth: false, desc: "Get DNS records" },
  { method: "POST", path: "/api/v1/dns/domains/attach", auth: true, desc: "Attach domain to app" },
  { method: "POST", path: "/caddy/init", auth: false, desc: "Initialize Caddy" },
  { method: "POST", path: "/caddy/routes", auth: false, desc: "Add Caddy route" },
  { method: "DELETE", path: "/caddy/routes/:domain", auth: false, desc: "Delete Caddy route" },
  { method: "PUT", path: "/caddy/routes/:domain/headers", auth: false, desc: "Set Caddy route headers" },
  { method: "POST", path: "/caddy/tcp", auth: false, desc: "Add TCP route" },
  { method: "DELETE", path: "/caddy/tcp/:domain", auth: false, desc: "Delete TCP route" },
  { method: "POST", path: "/mail/accounts", auth: false, desc: "Create email account" },
  { method: "POST", path: "/mail/domains", auth: false, desc: "Add mail domain" },
  { method: "POST", path: "/mail/domains/:domain/verify", auth: false, desc: "Verify mail domain" },
  { method: "GET", path: "/platform/health", auth: true, desc: "Platform health with isolate/VM info" },
]

export default function DocsAPIPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/docs" className="text-xs text-gray-400 hover:text-gray-600 mb-4 inline-flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Back to docs</Link>
          <h1 className="text-2xl font-bold text-gray-900">REST API Reference</h1>
          <p className="mt-2 text-sm text-gray-500">Complete API reference for the Coxmos Edge platform.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900 w-20">Method</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Path</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 w-24">Auth</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((ep, i) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className={cn(
                      "inline-block rounded px-2 py-0.5 text-xs font-mono font-medium",
                      ep.method === "GET" && "bg-blue-50 text-blue-700",
                      ep.method === "POST" && "bg-green-50 text-green-700",
                      ep.method === "DELETE" && "bg-red-50 text-red-700",
                      ep.method === "PUT" && "bg-amber-50 text-amber-700",
                      ep.method === "ANY" && "bg-purple-50 text-purple-700",
                    )}>{ep.method}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-900">{ep.path}</td>
                  <td className="py-3 px-4">
                    {ep.auth ? (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-600">JWT</span>
                    ) : (
                      <span className="rounded-full bg-gray-50 px-2 py-0.5 text-[11px] text-gray-400">Public</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{ep.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
