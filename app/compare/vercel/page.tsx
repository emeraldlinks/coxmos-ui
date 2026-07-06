"use client"

import Link from "next/link"
import { Check, X, Zap, Globe, Server, Heart, Database, CreditCard } from "lucide-react"

const comparisons = [
  { feature: "Global Edge Network", us: true, them: true },
  { feature: "Managed PostgreSQL", us: true, them: false },
  { feature: "Managed Redis", us: true, them: false },
  { feature: "Object Storage (S3)", us: true, them: false },
  { feature: "Custom Domains & DNS", us: true, them: true },
  { feature: "Email (Mailu)", us: true, them: false },
  { feature: "Free Tier (no credit card)", us: true, them: true },
  { feature: "Nigerian Payment Gateways", us: true, them: false },
  { feature: "NGN Pricing", us: true, them: false },
  { feature: "Serverless Functions", us: true, them: true },
  { feature: "Edge Functions", us: true, them: true },
  { feature: "Docker/Isolate Deployment", us: true, them: false },
  { feature: "Background Workers", us: true, them: false },
  { feature: "Cron / Scheduled Jobs", us: true, them: false },
  { feature: "Git-based Deploy", us: true, them: true },
  { feature: "Preview Deployments", us: true, them: true },
  { feature: "Automatic HTTPS/SSL", us: true, them: true },
  { feature: "Analytics & Logs", us: true, them: true },
  { feature: "Built for African Devs", us: true, them: false },
]

export default function CompareVercelPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/" className="text-xs text-gray-400 hover:text-indigo-600 mb-4 inline-block">&larr; Back to home</Link>
          <h1 className="text-3xl font-bold text-gray-900">Coxmos Edge vs Vercel</h1>
          <p className="mt-2 text-gray-500 max-w-xl">Full-stack deployment platform that goes beyond frontend — with databases, Redis, storage, and email built in.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Feature Comparison</h2>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Feature</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-indigo-600 uppercase">Coxmos Edge</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Vercel</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((c, i) => (
                  <tr key={c.feature} className={cn("border-b border-gray-100", i % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                    <td className="px-5 py-3 text-sm text-gray-900">{c.feature}</td>
                    <td className="px-5 py-3 text-center">
                      {c.us === true ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> : <X className="h-4 w-4 text-red-300 mx-auto" />}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {c.them === true ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> : <X className="h-4 w-4 text-red-300 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border border-indigo-100 rounded-xl p-6 bg-indigo-50/50">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Why full-stack teams choose Coxmos Edge over Vercel</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> <strong>Managed PostgreSQL</strong> — Vercel uses Neon/KV, no native SQL</div>
            <div className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> <strong>Managed Redis</strong> — built-in, no Upstash add-on needed</div>
            <div className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> <strong>S3 Storage</strong> — native object storage for files & assets</div>
            <div className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> <strong>Docker deployment</strong> — run any runtime, not just serverless</div>
            <div className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> <strong>Background workers & cron</strong> — Vercel lacks background jobs</div>
            <div className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> <strong>Pay in NGN</strong> — no forex markup on subscription fees</div>
            <div className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> <strong>Built-in email</strong> — Mailu accounts, no Resend/SendGrid</div>
            <div className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> <strong>Integrated DNS</strong> — manage domains directly on platform</div>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-xl p-6">
            <Database className="h-5 w-5 text-indigo-600 mb-3" />
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Coxmos Edge is a full-stack platform</h3>
            <p className="text-sm text-gray-500">Vercel excels at frontend deployment. Coxmos Edge does that <em>plus</em> gives you databases, Redis, storage, email, DNS, and background workers — everything you need to ship a complete application without stitching together 5 different services.</p>
          </div>
          <div className="border border-gray-200 rounded-xl p-6">
            <CreditCard className="h-5 w-5 text-indigo-600 mb-3" />
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Pricing for African developers</h3>
            <p className="text-sm text-gray-500">Vercel charges in USD with Pro at $20/mo. Coxmos Edge offers NGN pricing starting at ~₦5,000/mo with a genuinely free tier — no credit card required, always free resources, not a time-limited trial.</p>
          </div>
        </section>

        <div className="text-center">
          <Link href="/register" className="inline-flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 rounded-lg px-6 py-3 hover:bg-indigo-700 transition-colors">
            <Zap className="h-4 w-4" /> Deploy on Coxmos Edge — Free Tier Available
          </Link>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
