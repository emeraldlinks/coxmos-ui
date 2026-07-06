"use client"

import Link from "next/link"
import { Terminal, Code, Package, ArrowRight, Copy, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const sdks = [
  {
    name: "Node.js / TypeScript",
    icon: Code,
    desc: "Deploy and manage your infrastructure from Node.js or TypeScript applications.",
    install: "npm install coxmos-sdk",
    usage: `import { Coxmos } from "coxmos-sdk"

const coxmos = new Coxmos({ apiKey: "your-api-key" })

// Deploy an app
const deploy = await coxmos.apps.deploy({
  name: "my-app",
  cloneUrl: "https://github.com/user/repo.git",
  branch: "main",
})

// List Redis instances
const redis = await coxmos.redis.list()

// Create a bucket
const bucket = await coxmos.storage.createBucket("my-bucket")`,
  },
  {
    name: "Python",
    icon: Terminal,
    desc: "Python SDK for programmatic access to the Coxmos Edge platform.",
    install: "pip install coxmos-sdk",
    usage: `from coxmos import Coxmos

coxmos = Coxmos(api_key="your-api-key")

# Deploy an app
deploy = coxmos.apps.deploy(
    name="my-app",
    clone_url="https://github.com/user/repo.git",
    branch="main",
)

# List databases
dbs = coxmos.databases.list()

# Get usage stats
usage = coxmos.billing.usage()`,
  },
  {
    name: "Go",
    icon: Package,
    desc: "Go client library for integrating Coxmos Edge into your Go services.",
    install: "go get github.com/cofoundr-ng/coxmos-sdk-go",
    usage: `package main

import (
    "context"
    "fmt"
    "github.com/cofoundr-ng/coxmos-sdk-go"
)

func main() {
    client := coxmos.NewClient("your-api-key")
    ctx := context.Background()

    // Deploy an app
    app, _ := client.DeployApp(ctx, &coxmos.DeployRequest{
        Name:     "my-app",
        CloneURL: "https://github.com/user/repo.git",
        Branch:   "main",
    })
    fmt.Printf("Deployed: %s\\n", app.URL)
}`,
  },
  {
    name: "CLI",
    icon: Terminal,
    desc: "Command-line interface for deploying and managing apps from your terminal.",
    install: "npm install -g coxmos-cli",
    usage: `# Login via device code
coxmos login

# Deploy an app
coxmos deploy --name my-app --repo https://github.com/user/repo.git

# List resources
coxmos apps list
coxmos redis list
coxmos storage list

# View logs
coxmos logs --app my-app

# Check usage
coxmos usage`,
  },
]

export default function SDKPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 mb-4 block">&larr; Back to home</Link>
          <h1 className="text-3xl font-bold text-gray-900">SDK & Tools</h1>
          <p className="mt-2 text-gray-500 max-w-xl">Integrate Coxmos Edge into your applications with our SDKs and CLI.</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {sdks.map((sdk, i) => (
          <section key={sdk.name}>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                <sdk.icon className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{sdk.name}</h2>
                <p className="text-sm text-gray-500">{sdk.desc}</p>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Install</span>
                <button
                  onClick={() => copyToClipboard(sdk.install, i * 2)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {copiedIndex === i * 2 ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <pre className="text-sm text-gray-900 font-mono">{sdk.install}</pre>
            </div>

            <div className="rounded-lg border border-gray-200 bg-[#1E1B2E] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Example</span>
                <button
                  onClick={() => copyToClipboard(sdk.usage, i * 2 + 1)}
                  className="text-gray-500 hover:text-gray-300 cursor-pointer"
                >
                  {copiedIndex === i * 2 + 1 ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
              <pre className="p-4 text-sm text-gray-300 font-mono overflow-x-auto whitespace-pre">{sdk.usage}</pre>
            </div>
          </section>
        ))}

        <section className="border-t border-gray-100 pt-12 text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Ready to build?</h2>
          <p className="text-sm text-gray-500 mb-6">Connect your GitHub repo and deploy in seconds.</p>
          <Link href="/register"><Button>Get Started Free <ArrowRight className="h-4 w-4" /></Button></Link>
        </section>
      </div>
    </div>
  )
}
