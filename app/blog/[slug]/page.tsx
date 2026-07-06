"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const posts: Record<string, { title: string; content: string[]; author: string; published_at: string }> = {
  "deploy-at-the-edge": {
    title: "Deploy at the Edge: A New Architecture for Serverless",
    content: [
      "## Per-Route Serverless Architecture",
      "",
      "Traditional serverless platforms deploy entire applications as monolithic functions. Coxmos Edge takes a different approach: per-route serverless.",
      "",
      "### How It Works",
      "",
      "When you deploy an app, our pipeline:",
      "",
      "1. **Clones** your repository from GitHub with an installation token for private repos",
      "2. **Builds** each route independently — static assets go to RustFS, functions are compiled into Deno V8 isolates or Node.js workers",
      "3. **Registers** each route with Caddy for automatic SSL and routing",
      "4. **Scales** each route independently — high-traffic routes get more isolates, idle routes scale to zero",
      "",
      "### Cold Starts",
      "",
      "Deno V8 isolates start in under 1ms. Node.js workers require ~50ms. Both are significantly faster than traditional VM-based cold starts.",
      "",
      "### Global Distribution",
      "",
      "Routes are distributed across edge locations. Each request is routed to the nearest available isolate.",
      "",
      "### Framework Support",
      "",
      "- **Edge Functions**: Deno V8 isolates for maximum performance",
      "- **Node.js**: Node.js workers for npm ecosystem compatibility",
      "- **Next.js**: Full Next.js server support with automatic port allocation",
    ],
    author: "Engineering Team",
    published_at: "2026-06-15",
  },
  "managed-redis-deep-dive": {
    title: "Managed Redis on Coxmos: Architecture & Resource Limits",
    content: [
      "## Managed Redis on Coxmos",
      "",
      "Every Redis instance runs in its own Docker container with resource limits derived from your billing tier.",
      "",
      "### Resource Limits",
      "",
      "- **Memory**: Configurable per instance, capped by your tier's maximum",
      "- **CPU**: Fractional CPU limits for cost-efficient multi-tenancy",
      "- **PIDs**: Process count limits to prevent fork bombs",
      "- **Disk**: Ephemeral storage with periodic RDB snapshots",
      "",
      "### Networking",
      "",
      "Each instance gets:",
      "- A unique host port mapped to Redis's internal 6379 port",
      "- A Caddy TCP route for SNI-based routing",
      "- A connection URI: redis://<public-host>:<port>",
      "",
      "### Monitoring",
      "",
      "Stats are collected via docker stats and include:",
      "- CPU and memory usage percentage",
      "- Network I/O (RX/TX)",
      "- Block I/O (read/write)",
      "- Current process count",
    ],
    author: "Infrastructure Team",
    published_at: "2026-06-10",
  },
  "github-deploy-workflow": {
    title: "From GitHub to Live in 30 Seconds",
    content: [
      "## The Deploy Pipeline",
      "",
      "### 1. GitHub OAuth",
      "Users authorize via GitHub OAuth. We store the access token and installation ID for private repo access.",
      "",
      "### 2. App Creation",
      "When you deploy, we create or find an App record with its slug, Git URL, branch, and assigned subdomain.",
      "",
      "### 3. Pipeline",
      "Clone -> Build -> Upload Static -> Load Isolates/VMs -> Register Caddy Routes",
      "",
      "### 4. Automatic Redeploys",
      "A GitHub webhook listens for push events on your repository. When a push matches your app's branch, we automatically trigger a new deployment.",
      "",
      "### 5. Next.js Support",
      "Next.js apps are detected during build. We start a persistent Node.js server and route all traffic through it.",
    ],
    author: "Platform Team",
    published_at: "2026-06-05",
  },
  "s3-compatible-storage": {
    title: "S3-Compatible Object Storage with RustFS",
    content: [
      "## Object Storage with RustFS",
      "",
      "Our storage layer is built on RustFS, a high-performance, S3-compatible object store written in Rust.",
      "",
      "### Features",
      "",
      "- **S3 API Compatible**: Use any S3 SDK to interact with buckets",
      "- **Presigned URLs**: Generate time-limited URLs for secure sharing (default 15 minutes)",
      "- **S3 Proxy**: A built-in proxy at /s3/proxy/* that authenticates via JWT or API key",
      "- **Per-Bucket Isolation**: Each user's buckets are isolated",
      "",
      "### API Endpoints",
      "",
      "GET /s3/buckets - List buckets",
      "POST /s3/buckets - Create bucket",
      "DELETE /s3/buckets/:bucket - Delete bucket",
      "GET /s3/buckets/:bucket/objects - List objects",
      "POST /s3/buckets/:bucket/objects/*key - Upload object",
      "GET /s3/buckets/:bucket/objects/*key - Get object",
      "DELETE /s3/buckets/:bucket/objects/*key - Delete object",
      "POST /s3/presign - Generate presigned URL",
      "ANY /s3/proxy/*path - S3 proxy with auth",
    ],
    author: "Storage Team",
    published_at: "2026-05-28",
  },
  "dns-dkim-management": {
    title: "DNS Management & DKIM Signing for Custom Domains",
    content: [
      "## DNS Management",
      "",
      "Custom domains are managed via our DNS API and Caddy integration.",
      "",
      "### Setup Flow",
      "",
      "1. **Register Domain**: Add your domain to our DNS provider",
      "2. **Verify Ownership**: Add a TXT record with your verification token",
      "3. **Setup Nameservers**: Point your domain to our nameservers",
      "4. **Attach to App**: Link the domain to your deployed app",
      "",
      "### DKIM Records",
      "",
      "For email authentication, add DKIM records via POST /api/v1/dns/dkim",
      "",
      "### API Reference",
      "",
      "POST /api/v1/dns/setup-nameservers",
      "POST /api/v1/dns/register",
      "POST /api/v1/dns/dkim",
      "DELETE /api/v1/dns/:domain",
      "POST /api/v1/dns/verify",
      "POST /api/v1/dns/verify/check",
      "GET /api/v1/dns/:domain/records",
      "POST /api/v1/dns/domains/attach",
    ],
    author: "DNS Team",
    published_at: "2026-05-20",
  },
  "paystack-payrouter-billing": {
    title: "Billing in Nigeria: Paystack & PayRouter Integration",
    content: [
      "## Billing Architecture",
      "",
      "Coxmos supports two payment gateways for Nigerian NGN payments: PayRouter (primary) and Paystack (fallback).",
      "",
      "### Payment Flow",
      "",
      "1. User selects a tier and clicks Subscribe",
      "2. We try PayRouter first: creates a mobile money debit request, user confirms on phone",
      "3. If PayRouter fails, we fall back to Paystack: generate authorization URL, user pays in browser",
      "4. Webhook confirms payment, tier is assigned",
      "",
      "### Tiers",
      "",
      "Tiers define resource limits: max apps, databases, Redis, buckets, bandwidth, storage, team members.",
      "",
      "### Webhooks",
      "",
      "POST /webhook/paystack - Paystack charge success/failure",
      "POST /webhook/payrouter - PayRouter transaction status",
    ],
    author: "Finance Team",
    published_at: "2026-05-15",
  },
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = posts[slug]

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-900">Post not found</h1>
          <Link href="/blog"><Button variant="outline" size="sm" className="mt-4"><ArrowLeft className="h-3.5 w-3.5" /> Back to blog</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/blog" className="text-xs text-gray-400 hover:text-gray-600 mb-6 inline-flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Back to blog</Link>
        <article className="mt-4">
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            <span>{post.published_at}</span>
            <span>{post.author}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{post.title}</h1>
          <div className="mt-6 space-y-3 text-sm text-gray-600 leading-relaxed">
            {post.content.map((line, i) => {
              if (line.startsWith("## ")) return <h2 key={i} className="text-lg font-semibold text-gray-900 mt-8 mb-3">{line.slice(3)}</h2>
              if (line.startsWith("### ")) return <h3 key={i} className="text-base font-semibold text-gray-900 mt-6 mb-2">{line.slice(4)}</h3>
              if (line.startsWith("- **")) {
                const m = line.match(/- \*\*(.+?)\*\*[:：]?\s*(.*)/)
                if (m) return <li key={i} className="ml-4 mb-1"><strong>{m[1]}</strong>: {m[2]}</li>
              }
              if (line.startsWith("- ")) return <li key={i} className="ml-4 mb-1">{line.slice(2)}</li>
              if (line.trim() === "") return <div key={i} className="h-2" />
              if (line.match(/^\d+\./)) return <li key={i} className="ml-4 mb-1 list-decimal">{line.replace(/^\d+\.\s*/, "")}</li>
              return <p key={i}>{line}</p>
            })}
          </div>
        </article>
      </div>
    </div>
  )
}
