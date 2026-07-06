"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function GitHubCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState("Completing GitHub authentication...")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get("token")
    if (token) {
      localStorage.setItem("token", token)
      setStatus("Authentication successful! Redirecting...")
      setTimeout(() => router.push("/overview"), 1000)
    } else {
      setStatus("Authentication failed. Please try again.")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-sm text-gray-600">{status}</p>
      </div>
    </div>
  )
}
