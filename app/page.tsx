"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Globe, Server, Database, HardDrive, Zap, Shield, Cpu, ArrowRight, Check, Menu, X, Github, Mail, BookOpen, Terminal } from "lucide-react"

const features = [
  { icon: Zap, title: "Edge Deployments", desc: "Deploy globally in seconds. Deno & Node.js isolates on the edge for sub-millisecond cold starts." },
  { icon: Server, title: "Redis", desc: "Managed Redis instances with resource limits, auto-backups, and per-instance TCP routing via Caddy." },
  { icon: Database, title: "Databases", desc: "Provision Postgres & MySQL databases in one click. Isolated or provisioned tiers." },
  { icon: HardDrive, title: "Object Storage", desc: "S3-compatible storage with presigned URLs, RustFS-backed, with a built-in proxy." },
  { icon: Shield, title: "DNS & SSL", desc: "Automatic DNS management, DKIM records, domain verification, and Let's Encrypt via Caddy." },
  { icon: Cpu, title: "CLI & API", desc: "Full REST API, device-code CLI auth, and SDKs for Node.js, Python, Go — deploy from your terminal." },
]

const pricingPlans = [
  { name: "Hobby", price: "Free", desc: "Perfect for side projects", features: ["1 App", "1 Database", "1 Redis instance", "1 Bucket (1 GB)", "Basic support"], cta: "Get Started", href: "/register", popular: false },
  { name: "Pro", price: "$29", desc: "For growing projects", features: ["10 Apps", "3 Databases", "3 Redis instances", "5 Buckets (10 GB)", "Priority support", "Team members"], cta: "Subscribe", href: "/billing", popular: true },
  { name: "Team", price: "$99", desc: "For teams and businesses", features: ["Unlimited Apps", "10 Databases", "10 Redis instances", "Unlimited Buckets", "Dedicated support", "Advanced DNS"], cta: "Subscribe", href: "/billing", popular: false },
]

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!loading && user) router.push("/overview")
  }, [user, loading, router])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full" /></div>
  if (user) return null

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                <span className="text-xs font-bold text-white">C</span>
              </div>
              <span className="font-semibold text-gray-900">Coxmos Edge</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a>
              <Link href="/docs" className="text-sm text-gray-600 hover:text-gray-900">Docs</Link>
              <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900">Blog</Link>
              <Link href="/sdk" className="text-sm text-gray-600 hover:text-gray-900">SDK</Link>
            </nav>
            <div className="hidden md:flex items-center gap-3">
              <Link href="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
              <Link href="/register"><Button size="sm">Get Started</Button></Link>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-gray-600 cursor-pointer">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#pricing" className="block text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <Link href="/docs" className="block text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Docs</Link>
            <Link href="/blog" className="block text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
            <Link href="/sdk" className="block text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>SDK</Link>
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <Link href="/login"><Button variant="outline" size="sm" className="w-full">Sign in</Button></Link>
              <Link href="/register"><Button size="sm" className="w-full">Get Started</Button></Link>
            </div>
          </div>
        )}
      </header>

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gray-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-medium text-indigo-700 mb-8">
            <Zap className="h-3.5 w-3.5" /> Serverless edge platform — deploy from GitHub
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 max-w-3xl mx-auto leading-tight">
            Deploy apps at the{" "}
            <span className="text-indigo-600">edge</span>
            , not in a VM
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Coxmos Edge is a per-route serverless platform. Deploy from GitHub, get auto-scaling isolates on the edge,
            managed Redis, databases, S3 storage, and DNS — all in one dashboard.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register"><Button size="lg" className="gap-2">Get Started Free <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="/docs"><Button variant="outline" size="lg">Read the Docs</Button></Link>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><Github className="h-4 w-4" /> GitHub Deploy</span>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4" /> Edge Isolates</span>
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> Auto SSL</span>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to ship</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">Edge computing, databases, storage, and DNS — managed from one dashboard.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md transition-shadow">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 mb-4">
                  <f.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">Deploy your app in 3 steps.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Connect GitHub", desc: "Authorize with GitHub OAuth and select a repository to deploy." },
              { step: "02", title: "Configure & Deploy", desc: "Choose your branch, set environment variables, and deploy. We build and run the pipeline." },
              { step: "03", title: "Scale at the Edge", desc: "Your app runs in Deno/Node.js isolates on the edge. Every route is independently scalable." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-sm mb-5">{item.step}</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Simple, transparent pricing</h2>
            <p className="mt-3 text-gray-500 max-w-xl mx-auto">Start free. Scale as you grow. No hidden fees.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={cn(
                "rounded-xl border bg-white p-8 flex flex-col",
                plan.popular && "ring-2 ring-indigo-500 relative"
              )}>
                {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-500 px-3 py-0.5 text-xs font-medium text-white">Most Popular</span>}
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{plan.desc}</p>
                <div className="mt-4 mb-6">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== "Free" && <span className="text-sm text-gray-500 ml-1">/month</span>}
                </div>
                <ul className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className="mt-8 block">
                  <Button className="w-full" variant={plan.popular ? "default" : "outline"}>{plan.cta}</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to deploy at the edge?</h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">Connect your GitHub repo and deploy in seconds. No credit card required.</p>
          <Link href="/register"><Button size="lg" className="gap-2">Start Free <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </section>

      <footer className="border-t border-gray-100 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
                  <span className="text-[10px] font-bold text-white">C</span>
                </div>
                <span className="font-semibold text-sm text-gray-900">Coxmos Edge</span>
              </div>
              <p className="text-xs text-gray-400">Serverless edge platform for modern apps.</p>
            </div>
            {[
              { title: "Product", links: [{ label: "Features", href: "#features" }, { label: "Pricing", href: "#pricing" }, { label: "Docs", href: "/docs" }, { label: "SDK", href: "/sdk" }] },
              { title: "Resources", links: [{ label: "Blog", href: "/blog" }, { label: "API Reference", href: "/docs/api" }, { label: "CLI Guide", href: "/docs/cli" }, { label: "GitHub", href: "https://github.com/Cofoundr-Ng/coxmos-edge-v2" }] },
              { title: "Company", links: [{ label: "About", href: "#" }, { label: "Contact", href: "mailto:hello@coxmos.io" }, { label: "Status", href: "/health" }] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-gray-500 hover:text-gray-700">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Coxmos Edge. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/Cofoundr-Ng/coxmos-edge-v2" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600"><Github className="h-4 w-4" /></a>
              <a href="mailto:hello@coxmos.io" className="text-gray-400 hover:text-gray-600"><Mail className="h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
