"use client"

import Link from "next/link"
import { Globe, Server, Shield, Zap, Users, Heart, Linkedin, Twitter, Mail } from "lucide-react"

const team = [
  { name: "Emeka Okafor", role: "Founder & CEO", initials: "EO" },
  { name: "Amara Nwosu", role: "CTO", initials: "AN" },
  { name: "Chidi Obi", role: "Head of Engineering", initials: "CO" },
  { name: "Zainab Abdullah", role: "Product Designer", initials: "ZA" },
]

const values = [
  { icon: Zap, title: "Speed", desc: "Deploy in seconds, not hours. Optimized CI/CD with edge delivery." },
  { icon: Shield, title: "Reliability", desc: "99.9% uptime SLA with automated failover and multi-region support." },
  { icon: Server, title: "Simplicity", desc: "No vendor lock-in. Deploy from any Git provider, scale effortlessly." },
  { icon: Heart, title: "Developer First", desc: "Built by developers for developers. CLI, SDKs, and a clean API." },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Link href="/" className="text-xs text-gray-400 hover:text-indigo-600 mb-6 inline-block">&larr; Back to home</Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Coxmos Edge</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            We&apos;re building the fastest edge deployment platform for modern applications — from static sites to full-stack apps with databases, Redis, storage, and more.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <section className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            To democratize edge computing by making it as simple as pushing to Git. We believe every developer should have access to 
            world-class infrastructure — global CDN, managed databases, auto-scaling — without the complexity of Kubernetes or the 
            cost of enterprise platforms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="border border-gray-200 rounded-xl p-6 hover:border-indigo-200 hover:shadow-sm transition-all">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 mb-4">
                  <v.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{v.title}</h3>
                <p className="text-sm text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">Our Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m) => (
              <div key={m.name} className="text-center">
                <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold text-white mx-auto mb-3">
                  {m.initials}
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{m.name}</h3>
                <p className="text-xs text-gray-500">{m.role}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-gray-50 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Join Us</h2>
          <p className="text-sm text-gray-500 mb-6">We&apos;re hiring! Help us build the future of edge computing.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 rounded-lg px-5 py-2.5 hover:bg-indigo-700 transition-colors">
            View Open Positions
          </Link>
        </section>
      </div>
    </div>
  )
}
