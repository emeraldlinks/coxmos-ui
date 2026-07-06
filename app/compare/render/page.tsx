"use client"

import Link from "next/link"
import { Check, X, Zap, Heart, DollarSign } from "lucide-react"

const comparisons = [
  { feature: "Global Edge Network", us: true, them: true },
  { feature: "Managed PostgreSQL", us: true, them: true },
  { feature: "Managed Redis", us: true, them: true },
  { feature: "Object Storage (S3)", us: true, them: false },
  { feature: "Custom Domains & DNS", us: true, them: true },
  { feature: "Email (Mailu)", us: true, them: false },
  { feature: "Free Tier (no credit card)", us: true, them: true },
  { feature: "Nigerian Payment Gateways", us: true, them: false },
  { feature: "NGN Pricing", us: true, them: false },
  { feature: "Device-Code CLI Auth", us: true, them: false },
  { feature: "Organization & Teams", us: true, them: true },
  { feature: "Webhook Support", us: true, them: true },
  { feature: "Docker Deployment", us: true, them: true },
  { feature: "Git-based Deploy", us: true, them: true },
  { feature: "Automatic HTTPS/SSL", us: true, them: true },
  { feature: "Blue/Green Deployments", us: true, them: true },
  { feature: "Background Workers", us: true, them: true },
  { feature: "Built for African Devs", us: true, them: false },
]

export default function CompareRenderPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/" className="text-xs text-gray-400 hover:text-indigo-600 mb-4 inline-block">&larr; Back to home</Link>
          <h1 className="text-3xl font-bold text-gray-900">Coxmos Edge vs Render</h1>
          <p className="mt-2 text-gray-500 max-w-xl">Why more developers are switching from Render to Coxmos Edge.</p>
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
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Render</th>
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

        <section className="grid md:grid-cols-2 gap-6">
          <div className="border border-indigo-100 rounded-xl p-6 bg-indigo-50/50">
            <Heart className="h-5 w-5 text-indigo-600 mb-3" />
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Why Coxmos Edge Wins</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> <strong>Storage included</strong> — S3-compatible object storage, not available on Render</li>
              <li className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> <strong>Email built-in</strong> — Mailu email accounts, no separate service needed</li>
              <li className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> <strong>Pay in NGN</strong> — Paystack & PayRouter, no forex fees</li>
              <li className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> <strong>DNS management</strong> — integrated domain registration & verification</li>
              <li className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" /> <strong>Device-code auth</strong> — authenticate from any headless environment</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded-xl p-6">
            <DollarSign className="h-5 w-5 text-gray-400 mb-3" />
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Pricing Comparison</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Free Tier</span>
                <div className="text-right">
                  <span className="text-emerald-600 font-semibold">Always free</span>
                  <span className="text-gray-400 mx-2">vs</span>
                  <span className="text-gray-500">Limited free</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Starter (monthly)</span>
                <div className="text-right">
                  <span className="text-emerald-600 font-semibold">~₦5,000</span>
                  <span className="text-gray-400 mx-2">vs</span>
                  <span className="text-gray-500">$7 (~₦10,500)</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Pro (monthly)</span>
                <div className="text-right">
                  <span className="text-emerald-600 font-semibold">~₦20,000</span>
                  <span className="text-gray-400 mx-2">vs</span>
                  <span className="text-gray-500">$25 (~₦37,500)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center">
          <Link href="/register" className="inline-flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 rounded-lg px-6 py-3 hover:bg-indigo-700 transition-colors">
            <Zap className="h-4 w-4" /> Start Free on Coxmos Edge
          </Link>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
