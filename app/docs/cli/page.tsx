"use client"

import Link from "next/link"
import { ArrowLeft, Copy, Check } from "lucide-react"
import { useState } from "react"

export default function DocsCLIPage() {
  const [copied, setCopied] = useState<string | null>(null)

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
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
          <h1 className="text-2xl font-bold text-gray-900">CLI Reference</h1>
          <p className="mt-2 text-sm text-gray-500">Deploy and manage apps from your terminal using the Coxmos CLI.</p>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Installation</h2>
          <CodeBlock code="npm install -g coxmos-cli" id="install" />
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Authentication</h2>
          <p className="text-sm text-gray-600 mb-2">Use device-code flow to authenticate from the CLI:</p>
          <CodeBlock code={`coxmos login\n\n# Opens a browser. Enter the displayed code to authenticate.`} id="login" />
          <p className="text-sm text-gray-600 mt-2">Or set your API key directly:</p>
          <CodeBlock code="export COXMOS_API_KEY=your-api-key" id="apikey" />
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Commands</h2>
          <div className="space-y-4">
            {[
              { cmd: "coxmos deploy", desc: "Deploy a new app from a GitHub repository", args: "--name, --repo, --branch" },
              { cmd: "coxmos apps list", desc: "List all deployed apps", args: "" },
              { cmd: "coxmos apps logs", desc: "View deployment logs for an app", args: "--app" },
              { cmd: "coxmos apps stop", desc: "Stop an app", args: "--app" },
              { cmd: "coxmos apps restart", desc: "Restart an app", args: "--app" },
              { cmd: "coxmos redis list", desc: "List Redis instances", args: "" },
              { cmd: "coxmos redis create", desc: "Create a new Redis instance", args: "--name" },
              { cmd: "coxmos storage list", desc: "List S3 buckets", args: "" },
              { cmd: "coxmos storage create", desc: "Create a new bucket", args: "--name" },
              { cmd: "coxmos storage upload", desc: "Upload a file to a bucket", args: "--bucket, --key, --file" },
              { cmd: "coxmos dns list", desc: "List DNS records for a domain", args: "--domain" },
              { cmd: "coxmos dns register", desc: "Register a new domain", args: "--domain" },
              { cmd: "coxmos org list", desc: "List organizations", args: "" },
              { cmd: "coxmos org create", desc: "Create an organization", args: "--name" },
              { cmd: "coxmos billing usage", desc: "View current billing usage", args: "" },
              { cmd: "coxmos billing tiers", desc: "List available billing tiers", args: "" },
            ].map((item) => (
              <div key={item.cmd} className="border border-gray-200 rounded-lg p-4">
                <code className="text-sm font-mono text-indigo-600 font-medium">{item.cmd}</code>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                {item.args && <p className="text-xs text-gray-400 mt-0.5">Arguments: {item.args}</p>}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Device Code Flow</h2>
          <p className="text-sm text-gray-600 mb-2">
            The CLI uses a device-code flow for authentication. Here&apos;s how it works:
          </p>
          <ol className="list-decimal ml-5 text-sm text-gray-600 space-y-2">
            <li>Run <code className="text-xs font-mono bg-gray-100 px-1.5 py-0.5 rounded">coxmos login</code></li>
            <li>The CLI generates a code and shows it in the terminal</li>
            <li>Open the provided URL in a browser</li>
            <li>Enter the code to authenticate with your Coxmos account</li>
            <li>The CLI receives a JWT token and stores it locally</li>
          </ol>
        </section>
      </div>
    </div>
  )
}
