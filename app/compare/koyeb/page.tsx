"use client"

import Link from "next/link"
import { Check, X, Zap } from "lucide-react"

const comparisons = [
  { feature: "Global Edge Network", us: true, them: true },
  { feature: "Managed PostgreSQL", us: true, them: true },
  { feature: "Managed Redis", us: true, them: true },
  { feature: "Object Storage (S3)", us: true, them: true },
  { feature: "Custom Domains & DNS", us: true, them: true },
  { feature: "Email (Mailu)", us: true, them: false },
  { feature: "CLI + Dashboard", us: true, them: true },
  { feature: "Device-Code Auth", us: true, them: false },
  { feature: "Organization & Teams", us: true, them: true },
  { feature: "Nigerian Payment Gateways", us: true, them: false },
  { feature: "Paystack & PayRouter", us: true, them: false },
  { feature: "Free Tier (always)", us: true, them: false },
  { feature: "Docker/Isolate Deployment", us: true, them: true },
  { feature: "Git-based Deploy", us: true, them: true },
  { feature: "Webhook Support", us: true, them: true },
  { feature: "NGN Pricing", us: true, them: false },
  { feature: "Built for African Devs", us: true, them: false },
]

export default function CompareKoyebPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/" className="text-xs text-gray-400 hover:text-indigo-600 mb-4 inline-block">&larr; Back to home</Link>
          <h1 className="text-3xl font-bold text-gray-900">Coxmos Edge vs Koyeb</h1>
          <p className="mt-2 text-gray-500 max-w-xl">Why developers choose Coxmos Edge over Koyeb for deployment in Africa and beyond.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Feature Comparison</h2>
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Feature</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-indigo-600 uppercase tracking-wider">Coxmos Edge</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Koyeb</th>
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
                      {c.them === true ? <Check className="h-4 w-4 text-emerald-500 mx-auto" /> :
                       <X className="h-4 w-4 text-red-300 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="border border-indigo-100 rounded-xl p-6 bg-indigo-50/50">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Why developers choose Coxmos Edge over Koyeb</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
            <div className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> Pay in NGN with Paystack & PayRouter</div>
            <div className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> Always-free tier with real resources</div>
            <div className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> Built-in email (Mailu) included</div>
            <div className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> Designed for African developer workflows</div>
            <div className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> Device-code CLI auth for headless environments</div>
            <div className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> Integrated DNS & domain management</div>
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
