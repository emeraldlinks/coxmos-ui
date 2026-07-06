"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight, Search } from "lucide-react"

const posts = [
  { slug: "deploy-at-the-edge", title: "Deploy at the Edge: A New Architecture for Serverless", excerpt: "How Coxmos Edge uses per-route serverless isolates to achieve sub-millisecond cold starts and global scale.", author: "Engineering Team", published_at: "2026-06-15", tags: ["architecture", "edge"] },
  { slug: "managed-redis-deep-dive", title: "Managed Redis on Coxmos: Architecture & Resource Limits", excerpt: "A deep dive into how we provision, monitor, and auto-scale Redis instances with per-instance resource limits.", author: "Infrastructure Team", published_at: "2026-06-10", tags: ["redis", "infrastructure"] },
  { slug: "github-deploy-workflow", title: "From GitHub to Live in 30 Seconds", excerpt: "How the deploy pipeline works — clone, build, upload, register routes, and go live — all from a git push.", author: "Platform Team", published_at: "2026-06-05", tags: ["deploy", "github"] },
  { slug: "s3-compatible-storage", title: "S3-Compatible Object Storage with RustFS", excerpt: "Why we built our storage layer on RustFS and how it compares to AWS S3, MinIO, and other alternatives.", author: "Storage Team", published_at: "2026-05-28", tags: ["storage", "s3"] },
  { slug: "dns-dkim-management", title: "DNS Management & DKIM Signing for Custom Domains", excerpt: "How to set up custom domains, verification records, and DKIM for email authentication on Coxmos.", author: "DNS Team", published_at: "2026-05-20", tags: ["dns", "dkim", "domains"] },
  { slug: "paystack-payrouter-billing", title: "Billing in Nigeria: Paystack & PayRouter Integration", excerpt: "How we handle NGN payments through Paystack and PayRouter with automatic fallback.", author: "Finance Team", published_at: "2026-05-15", tags: ["billing", "paystack", "payrouter"] },
]

export default function BlogPage() {
  const [search, setSearch] = useState("")

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tags.some(t => t.includes(search.toLowerCase()))
  )

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 mb-4 block">&larr; Back to home</Link>
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="mt-2 text-gray-500">Engineering deep-dives, product updates, and platform guides.</p>
          <div className="mt-6 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {filtered.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="group border-b border-gray-100 pb-8 last:border-0">
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.published_at}</span>
                  <span>{post.author}</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{post.title}</h2>
                <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{post.excerpt}</p>
                <div className="flex gap-2 mt-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">{tag}</span>
                  ))}
                </div>
              </article>
            </Link>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm text-gray-500">No posts found matching &ldquo;{search}&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  )
}
