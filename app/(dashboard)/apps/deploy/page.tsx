"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Globe, Github, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

export default function DeployPage() {
  const router = useRouter()
  const [repos, setRepos] = useState<{ name: string; full_name: string; clone_url: string; ssh_url: string; default_branch: string }[]>([])
  const [loadingRepos, setLoadingRepos] = useState(true)
  const [name, setName] = useState("")
  const [selectedRepo, setSelectedRepo] = useState("")
  const [branch, setBranch] = useState("main")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    api.githubRepos().then((res) => setRepos(res.repos)).catch(() => {}).finally(() => setLoadingRepos(false))
  }, [])

  const handleRepoSelect = (fullName: string) => {
    setSelectedRepo(fullName)
    const repo = repos.find((r) => r.full_name === fullName)
    if (repo) {
      setName(repo.name)
      setBranch(repo.default_branch)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const repo = repos.find((r) => r.full_name === selectedRepo)
      if (!repo) throw new Error("Select a repository")
      const res = await api.deploy({ name, clone_url: repo.clone_url, ssh_url: repo.ssh_url, branch })
      router.push(`/apps/${res.app_id}`)
    } catch (err: any) {
      setError(err.message || "Deploy failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/apps" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-4 w-4" /></Link>
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Deploy an App</h1>
          <p className="text-sm text-gray-500">Deploy from a GitHub repository</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Repository</label>
            {loadingRepos ? (
              <div className="flex items-center gap-2 text-sm text-gray-400 h-9"><Loader2 className="h-4 w-4 animate-spin" /> Loading repositories...</div>
            ) : repos.length === 0 ? (
              <div className="rounded-md border border-gray-200 p-4 text-center">
                <Github className="h-6 w-6 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500 mb-3">No repositories found</p>
                <Button type="button" variant="outline" size="sm" onClick={() => api.githubLogin()}>Connect GitHub</Button>
              </div>
            ) : (
              <Select value={selectedRepo} onChange={(e) => handleRepoSelect(e.target.value)}>
                <option value="">Select a repository...</option>
                {repos.map((repo) => <option key={repo.full_name} value={repo.full_name}>{repo.full_name}</option>)}
              </Select>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">App name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="my-app" required />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Branch</label>
            <Input value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="main" />
          </div>

          <Button type="submit" className="w-full" disabled={loading || !selectedRepo}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Deploying...</> : <><Globe className="h-4 w-4" /> Deploy</>}
          </Button>
        </form>
      </div>
    </div>
  )
}
