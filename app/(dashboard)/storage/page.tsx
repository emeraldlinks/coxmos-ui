"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HardDrive, Plus, Trash2, ExternalLink } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Bucket } from "@/lib/types"

export default function StoragePage() {
  const [buckets, setBuckets] = useState<Bucket[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.listBuckets().then((res) => setBuckets(res.buckets)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete bucket "${name}"?`)) return
    await api.deleteBucket(name)
    load()
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Storage</h1>
          <p className="text-sm text-gray-500">S3-compatible object storage buckets</p>
        </div>
        <Link href="/storage/new"><Button size="sm"><Plus className="h-3.5 w-3.5" /> New Bucket</Button></Link>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 bg-white border border-gray-200 rounded-lg animate-pulse" />)}</div>
      ) : buckets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <HardDrive className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-900 mb-1">No buckets</p>
            <p className="text-xs text-gray-500 mb-4">Create your first storage bucket</p>
            <Link href="/storage/new"><Button size="sm"><Plus className="h-3.5 w-3.5" /> Create Bucket</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {buckets.map((bucket) => (
            <Card key={bucket.id} className="hover:border-gray-300 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-amber-50 p-2"><HardDrive className="h-4 w-4 text-amber-600" /></div>
                    <div>
                      <Link href={`/storage/${bucket.name}`} className="text-sm font-medium text-gray-900 hover:text-indigo-600">{bucket.name}</Link>
                      <p className="text-xs text-gray-400">{formatDate(bucket.created_at)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <a href={bucket.endpoint} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"><ExternalLink className="h-3 w-3" /> Endpoint</a>
                  <button onClick={() => handleDelete(bucket.name)} className="text-red-400 hover:text-red-600 cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
