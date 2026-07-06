"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { Github } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      router.push("/overview")
    } catch (err: any) {
      setError(err.message || "Invalid credentials")
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
          <h1 className="text-lg font-semibold text-gray-900">Sign in to Coxmos</h1>
          <p className="text-sm text-gray-500 mt-1">Enter your credentials to continue</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">or</span></div>
          </div>

          <Button variant="outline" className="w-full" onClick={() => api.githubLogin()}>
            <Github className="h-4 w-4" /> Continue with GitHub
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don&apos;t have an account? <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-700">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
