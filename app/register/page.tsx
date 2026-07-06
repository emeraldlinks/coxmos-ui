"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await register(email, password, firstName, lastName)
      router.push("/")
    } catch (err: any) {
      setError(err.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 mb-4">
            <span className="text-sm font-bold text-white">C</span>
          </div>
          <h1 className="text-lg font-semibold text-gray-900">Create an account</h1>
          <p className="text-sm text-gray-500 mt-1">Get started with Coxmos Edge</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">First name</label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Last name</label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-700">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
