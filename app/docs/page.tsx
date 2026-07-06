"use client"

import Link from "next/link"
import { BookOpen, Terminal, Code, Globe, Server, Database, HardDrive, Cpu, Mail, CreditCard, Shield, Feather, Cloud } from "lucide-react"

const categories = [
  {
    title: "Getting Started",
    icon: BookOpen,
    links: [
      { href: "/docs/quickstart", label: "Quickstart Guide" },
      { href: "/docs/cli", label: "CLI Reference" },
      { href: "/docs/sdk", label: "SDK Overview" },
    ],
  },
  {
    title: "Platform",
    icon: Globe,
    links: [
      { href: "/docs/deploy", label: "Deploying Apps" },
      { href: "/docs/domains", label: "Custom Domains & DNS" },
      { href: "/docs/environments", label: "Environment Variables" },
    ],
  },
  {
    title: "Services",
    icon: Server,
    links: [
      { href: "/docs/redis", label: "Managed Redis" },
      { href: "/docs/databases", label: "Databases" },
      { href: "/docs/storage", label: "Object Storage (S3)" },
      { href: "/docs/email", label: "Email (Mailu)" },
    ],
  },
  {
    title: "API Reference",
    icon: Code,
    links: [
      { href: "/docs/api", label: "REST API Reference" },
      { href: "/docs/api/auth", label: "Authentication" },
      { href: "/docs/api/apps", label: "Apps API" },
      { href: "/docs/api/storage", label: "Storage API" },
    ],
  },
  {
    title: "Tools & SDKs",
    icon: Feather,
    links: [
      { href: "/docs/slintorm", label: "SlintORM" },
      { href: "/docs/cloudust", label: "Cloudust SDK" },
      { href: "/docs/cli", label: "Coxmos CLI" },
    ],
  },
  {
    title: "Billing & Admin",
    icon: CreditCard,
    links: [
      { href: "/docs/billing", label: "Plans & Pricing" },
      { href: "/docs/payments", label: "Payment Gateways" },
      { href: "/docs/quotas", label: "Resource Quotas" },
    ],
  },
]

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 mb-4 block">&larr; Back to home</Link>
          <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
          <p className="mt-2 text-gray-500 max-w-xl">Everything you need to build and deploy on Coxmos Edge.</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.title}>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                  <cat.icon className="h-4 w-4 text-indigo-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{cat.title}</h3>
              </div>
              <ul className="space-y-2">
                {cat.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
