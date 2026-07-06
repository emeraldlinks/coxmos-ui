"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Database, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function NewDatabasePage() {
  const router = useRouter()
  const [dbType, setDbType] = useState("postgres")
  const [kind, setKind] = useState("isolated")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await api.createDatabase({ db_type: dbType, name, kind })
      router.push("/databases")
    } catch (err: any) {
      setError(err.message || "Failed to create database")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/databases" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-4 w-4" /></Link>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">New Database</h1>
          <p className="text-sm text-gray-500">Provision a managed database</p>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Database type</label>
            <Select value={dbType} onChange={(e) => setDbType(e.target.value)}>
              <option value="postgres">PostgreSQL</option>
              <option value="mysql">MySQL</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Plan</label>
            <Select value={kind} onChange={(e) => setKind(e.target.value)}>
              <option value="isolated">Isolated (dedicated)</option>
              <option value="provisioned">Provisioned (shared)</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Database name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="my-database" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</> : <><Database className="h-4 w-4" /> Create Database</>}
          </Button>
        </form>
      </div>
    </div>
  )
}
