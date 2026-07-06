"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function NewOrgPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await api.createOrg({ name, description })
      router.push("/orgs")
    } catch (err: any) {
      setError(err.message || "Failed to create organization")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-lg mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/orgs" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-4 w-4" /></Link>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">New Organization</h1>
          <p className="text-sm text-gray-500">Create a team organization</p>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Organization name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Team" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Description (optional)</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Team description" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</> : <><Users className="h-4 w-4" /> Create Organization</>}
          </Button>
        </form>
      </div>
    </div>
  )
}
