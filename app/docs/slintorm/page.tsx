"use client"

import Link from "next/link"
import { ArrowLeft, Copy, Check, Database, Feather, Zap, GitCommit, Layers, Shield, Box } from "lucide-react"
import { useState } from "react"

export default function DocsSlintormPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div className="relative rounded-lg bg-[#1A1A2E] border border-purple-500/20 p-4 my-3">
      <button onClick={() => copy(code, id)} className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 cursor-pointer">
        {copied === id ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <pre className="text-sm text-gray-300 font-mono overflow-x-auto whitespace-pre">{code}</pre>
    </div>
  )

  const features = [
    { icon: Database, title: "Auto Migrations", desc: "Zero-config table creation from TypeScript interfaces — no schema DSL needed" },
    { icon: Zap, title: "Query Builder", desc: "Full SQL builder with joins, preloads, aggregates, subqueries, HAVING, and window functions" },
    { icon: GitCommit, title: "Relationships", desc: "1:1, 1:N, and N:M with nested eager loading — no N+1" },
    { icon: Layers, title: "Multi-DB", desc: "SQLite, PostgreSQL, MySQL, and MongoDB from the same API" },
    { icon: Shield, title: "Soft Deletes", desc: "Built-in trashed/withTrashed/onlyTrashed scopes" },
    { icon: Box, title: "Edge Ready", desc: "V8 isolates, Cloudflare Workers, Vercel Edge via HTTP proxy" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-purple-100 bg-purple-50/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/docs" className="text-xs text-gray-400 hover:text-emerald-600 mb-4 inline-flex items-center gap-1"><ArrowLeft className="h-3 w-3" /> Back to docs</Link>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
              <Feather className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">SlintORM</h1>
          </div>
          <p className="text-sm text-gray-500">Lightweight, GORM-inspired TypeScript ORM — zero dependencies, automatic migrations, full SQL query builder.</p>
          <div className="flex gap-3 mt-4">
            <a href="https://github.com/emeraldlinks/slintorm" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 border border-emerald-200 rounded-lg px-3 py-1.5 hover:bg-emerald-50 transition-colors">GitHub →</a>
            <span className="text-xs text-gray-400 py-1.5">Stars: 8</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Why SlintORM?</h2>
          <div className="grid grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f.title} className="border border-purple-100 rounded-lg p-4 bg-white/80">
                <f.icon className="h-4 w-4 text-emerald-500 mb-2" />
                <h3 className="text-sm font-semibold text-gray-900 mb-0.5">{f.title}</h3>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Installation</h2>
          <CodeBlock code="npm install slintorm" id="install" />
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Quick Start</h2>
          <p className="text-sm text-gray-600 mb-2">Define a model, migrate, and query — all TypeScript, no schema DSL.</p>
          <CodeBlock code={`import ORMManager from "slintorm"

const orm = new ORMManager({
  driver: "sqlite",
  databaseUrl: "./myapp.db",
  dir: "src",
})

await orm.migrate()

const Users = await orm.defineModel<User>("users", "User")
const active = await Users.query().where("status", "=", "active").get()`} id="quickstart" />
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Model Definition</h2>
          <p className="text-sm text-gray-600 mb-2">Metadata lives in comments above each field — no decorators, no separate schema file.</p>
          <CodeBlock code={`interface User {
  // @index;auto
  id?: number
  // @unique;length:100
  email?: string
  // @nullable
  name?: string
  // @relation onetomany:Post;foreignKey:userId
  posts?: Post[]
  // @softDelete
  deletedAt?: string
  // @enum:(active,inactive,banned)
  status?: "active" | "inactive" | "banned"
}`} id="model" />
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">CRUD & Query Builder</h2>
          <CodeBlock code={`// Insert
await Users.insert({ name: "Joe", email: "joe@example.com" })

// Get (returns hydrated model with .update()/.delete()/.refresh())
const user = await Users.get({ id: 1 })
await user?.update({ name: "New Name" })

// Query builder with joins, preloads, aggregates
const posts = await Posts.query()
  .preload("user")
  .preload("user.profile")
  .where("status", "=", "published")
  .orderBy("createdAt", "desc")
  .get()

// Aggregates
await Users.count({ status: "active" })
await Users.sum("score")

// Pagination
const { data, total, page, lastPage } = await Users.query()
  .where("status", "=", "active")
  .getPaginated(1, 20)`} id="crud" />
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Relationships</h2>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-purple-200">
                <th className="text-left py-2 text-gray-500 font-medium">Type</th>
                <th className="text-left py-2 text-gray-500 font-medium">Annotation</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100"><td className="py-2 text-gray-900">One-to-Many</td><td className="py-2 text-emerald-700 font-mono text-xs">@relation onetomany:Post;foreignKey:userId</td></tr>
              <tr className="border-b border-gray-100"><td className="py-2 text-gray-900">Many-to-One</td><td className="py-2 text-emerald-700 font-mono text-xs">@relation manytoone:User;foreignKey:userId</td></tr>
              <tr className="border-b border-gray-100"><td className="py-2 text-gray-900">One-to-One</td><td className="py-2 text-emerald-700 font-mono text-xs">@relationship onetoone:Profile;foreignKey:userId</td></tr>
              <tr className="border-b border-gray-100"><td className="py-2 text-gray-900">Many-to-Many</td><td className="py-2 text-emerald-700 font-mono text-xs">@relation manytomany:Team;through:team_members;foreignKey:userId;relatedKey:teamId</td></tr>
            </tbody>
          </table>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Supported Databases</h2>
          <div className="flex gap-2">
            {["SQLite", "PostgreSQL", "MySQL", "MongoDB"].map((db) => (
              <span key={db} className="text-xs font-medium bg-purple-50 text-gray-700 border border-purple-100 rounded-full px-3 py-1">{db}</span>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-2">Edge / Serverless</h2>
          <p className="text-sm text-gray-600 mb-2">Use the HTTP proxy for V8 isolates where TCP is unavailable:</p>
          <CodeBlock code={`import ORMManager from "slintorm/browser"
import { proxyExec } from "slintorm/proxy"
import schema from "./schema/generated.json"

const orm = new ORMManager({
  exec: proxyExec({ endpoint: "https://db-proxy.myapp.com/query" }),
  schema,
})`} id="edge" />
        </section>

        <section className="bg-purple-50 border border-emerald-100 rounded-lg p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Learn More</h2>
          <p className="text-xs text-gray-500 mb-3">Full documentation at the SlintORM repository.</p>
          <a href="https://github.com/emeraldlinks/slintorm" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 border border-emerald-200 rounded-lg px-3 py-1.5 hover:bg-emerald-50 transition-colors">
            <Feather className="h-3 w-3" /> github.com/emeraldlinks/slintorm
          </a>
        </section>
      </div>
    </div>
  )
}
