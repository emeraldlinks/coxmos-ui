"use client"

import { use, useEffect, useState, useRef } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HardDrive, ArrowLeft, Download, Copy, Upload, Trash2, Link2, Loader2 } from "lucide-react"
import { formatBytes, formatDate } from "@/lib/utils"
import type { ObjectInfo } from "@/lib/types"

export default function BucketDetailPage({ params }: { params: Promise<{ bucket: string }> }) {
  const { bucket } = use(params)
  const [objects, setObjects] = useState<ObjectInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [presignKey, setPresignKey] = useState("")
  const [presignUrl, setPresignUrl] = useState("")
  const [generating, setGenerating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const load = () => {
    setLoading(true)
    api.listObjects(bucket).then((res) => setObjects(res.objects)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [bucket])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const res = await api.uploadObject(bucket, file.name, file)
      setMessage(`Uploaded ${res.key}`)
      load()
    } catch { setMessage("Upload failed") }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleDelete = async (key: string) => {
    try {
      await api.deleteObject(bucket, key)
      setMessage(`Deleted ${key}`)
      setObjects((prev) => prev.filter((o) => o.key !== key))
    } catch { setMessage("Delete failed") }
  }

  const handlePresign = async () => {
    if (!presignKey) return
    setGenerating(true)
    try {
      const res = await api.presignObject({ bucket, key: presignKey })
      setPresignUrl(res.url)
      navigator.clipboard.writeText(res.url)
      setMessage(`Presigned URL copied (expires in ${res.expires_in}s)`)
    } catch { setMessage("Failed to generate presigned URL") }
    setGenerating(false)
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/storage" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-4 w-4" /></Link>
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">{bucket}</h1>
          <p className="text-sm text-gray-500">{objects.length} objects</p>
        </div>
        <div className="flex items-center gap-2">
          <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" />
          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="gap-1.5">
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            Upload
          </Button>
        </div>
      </div>

      {message && (
        <div className="rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-3 text-sm text-indigo-700 flex items-center gap-2">
          {message}
          <button onClick={() => setMessage("")} className="ml-auto text-indigo-400 hover:text-indigo-600 cursor-pointer">&times;</button>
        </div>
      )}

      <Card>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Objects</h3>
        </div>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse bg-gray-50 rounded-md" />)}</div>
          ) : objects.length === 0 ? (
            <div className="text-center py-12">
              <HardDrive className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">This bucket is empty</p>
              <p className="text-xs text-gray-400 mt-1">Upload a file to get started</p>
            </div>
          ) : (
            <div>
              {objects.map((obj, i) => (
                <div key={obj.key} className={cn(
                  "flex items-center justify-between px-6 py-3 hover:bg-gray-50",
                  i !== objects.length - 1 && "border-b border-gray-100"
                )}>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <HardDrive className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-900 truncate">{obj.key}</span>
                    <span className="text-xs text-gray-400 shrink-0">{formatBytes(obj.size)}</span>
                    {obj.lastModified && <span className="text-xs text-gray-400 shrink-0">{formatDate(obj.lastModified)}</span>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {obj.url && <a href={obj.url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-gray-600"><Download className="h-3.5 w-3.5" /></a>}
                    {obj.url && <button onClick={() => navigator.clipboard.writeText(obj.url)} className="p-1.5 text-gray-400 hover:text-gray-600 cursor-pointer"><Copy className="h-3.5 w-3.5" /></button>}
                    <button onClick={() => handleDelete(obj.key)} className="p-1.5 text-red-400 hover:text-red-600 cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Generate Presigned URL</h3>
        </div>
        <CardContent className="p-6">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Object key"
              value={presignKey}
              onChange={(e) => setPresignKey(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline" size="sm" onClick={handlePresign} disabled={generating || !presignKey} className="gap-1.5">
              {generating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Link2 className="h-3.5 w-3.5" />}
              Generate & Copy
            </Button>
          </div>
          {presignUrl && (
            <div className="mt-3 rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500 mb-1">Presigned URL (copied to clipboard):</p>
              <code className="text-xs font-mono text-gray-900 break-all">{presignUrl}</code>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
