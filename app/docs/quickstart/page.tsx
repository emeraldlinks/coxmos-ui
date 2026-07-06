"use client"

import Link from "next/link"
import { ArrowLeft, Copy, Check } from "lucide-react"
import { useState } from "react"

export default function DocsQuickstartPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const Code = ({ code, id }: { code: string; id: string }) => (
    <div className="relative rounded-lg bg-[#1E1B2E] p-4 my-3">
      <button onClick={() => copy(code, id)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 cursor-pointer">
        {copied === id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <pre className="text-sm text-gray-300 font-mono overflow-x-auto whitespace-pre">{code}</pre>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/docs" className="text-xs text-gray-400 hover:text-gray-600 mb-4 inline-flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Back to docs</Link>
          <h1 className="text-2xl font-bold text-gray-900">Quickstart Guide</h1>
          <p className="mt-2 text-sm text-gray-500">Deploy your first app on Coxmos Edge in 5 minutes.</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">1. Create an Account</h2>
          <p className="text-sm text-gray-600 mb-2">Sign up with your email and password, or use GitHub OAuth for one-click registration.</p>
          <Link href="/register" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">Create account &rarr;</Link>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">2. Connect GitHub</h2>
          <p className="text-sm text-gray-600 mb-2">Authorize Coxmos to access your GitHub repositories. This lets us deploy your code and set up webhooks for automatic redeploys.</p>
          <Code code={`# Click "Connect GitHub" in the dashboard\n# or use the direct OAuth URL:\n${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/auth/github/login`} id="github" />
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">3. Deploy an App</h2>
          <p className="text-sm text-gray-600 mb-2">Choose a GitHub repository, set your branch, and deploy. The pipeline will:</p>
          <ul className="list-disc ml-5 text-sm text-gray-600 space-y-1 mb-3">
            <li>Clone your repository</li>
            <li>Detect the framework (static, Node.js, Deno, Next.js)</li>
            <li>Build and compile each route</li>
            <li>Upload static assets to RustFS storage</li>
            <li>Register routes with Caddy for SSL and routing</li>
            <li>Load functions as Deno V8 isolates or Node.js workers</li>
          </ul>
          <Code code={`POST /apps/deploy\n{\n  "name": "my-app",\n  "clone_url": "https://github.com/username/repo.git",\n  "branch": "main"\n}`} id="deploy" />
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">4. Add a Database</h2>
          <p className="text-sm text-gray-600 mb-2">Provision a Postgres or MySQL database in one click:</p>
          <Code code={`POST /databases/new\n{\n  "db_type": "postgres",\n  "name": "my-db",\n  "kind": "isolated"\n}`} id="db" />
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">5. Add Redis</h2>
          <p className="text-sm text-gray-600 mb-2">Create a managed Redis instance with resource limits:</p>
          <Code code={`POST /redis/new\n{\n  "name": "my-redis",\n  "memory_limit_mb": 256,\n  "cpu_limit": 0.5\n}`} id="redis" />
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">6. Create a Storage Bucket</h2>
          <p className="text-sm text-gray-600 mb-2">S3-compatible object storage for assets, uploads, and backups:</p>
          <Code code={`POST /s3/buckets\n{\n  "name": "my-assets"\n}`} id="bucket" />
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">7. Set Up a Custom Domain</h2>
          <p className="text-sm text-gray-600 mb-2">Point your domain to your deployed app:</p>
          <ol className="list-decimal ml-5 text-sm text-gray-600 space-y-2 mb-3">
            <li>Register your domain in the DNS panel</li>
            <li>Add a TXT verification record</li>
            <li>Verify ownership</li>
            <li>Attach the domain to your app</li>
          </ol>
          <Code code={`POST /api/v1/dns/register     { "domain": "example.com" }\nPOST /api/v1/dns/verify       { "domain": "example.com", "token": "..." }\nPOST /api/v1/dns/verify/check { "domain": "example.com", "token": "..." }\nPOST /api/v1/dns/domains/attach { "domain": "example.com", "app_id": "..." }`} id="dns" />
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">Next Steps</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/docs/cli" className="text-indigo-600 hover:text-indigo-700 font-medium">CLI Reference &rarr;</Link> <span className="text-gray-500">- Deploy from your terminal</span></li>
            <li><Link href="/docs/api" className="text-indigo-600 hover:text-indigo-700 font-medium">API Reference &rarr;</Link> <span className="text-gray-500">- Full REST API docs</span></li>
            <li><Link href="/sdk" className="text-indigo-600 hover:text-indigo-700 font-medium">SDK Overview &rarr;</Link> <span className="text-gray-500">- Node.js, Python, Go SDKs</span></li>
          </ul>
        </section>
      </div>
    </div>
  )
}
