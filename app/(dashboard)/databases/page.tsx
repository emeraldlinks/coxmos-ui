"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Database, Plus, Trash2, Copy } from "lucide-react"
import type { Database as DB } from "@/lib/types"

export default function DatabasesPage() {
  const [databases, setDatabases] = useState<DB[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.listDatabases().then((res) => setDatabases(res.databases)).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this database?")) return
    await api.deleteDatabase(id)
    load()
  }

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Databases</h1>
          <p className="text-sm text-gray-500">Managed database instances</p>
        </div>
        <Link href="/databases/new"><Button size="sm"><Plus className="h-3.5 w-3.5" /> New Database</Button></Link>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">{[1, 2].map((i) => <div key={i} className="h-24 bg-white border border-gray-200 rounded-lg animate-pulse" />)}</div>
      ) : databases.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Database className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-900 mb-1">No databases</p>
            <p className="text-xs text-gray-500 mb-4">Create your first database</p>
            <Link href="/databases/new"><Button size="sm"><Plus className="h-3.5 w-3.5" /> Create Database</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {databases.map((db) => (
            <Card key={db.id}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-purple-50 p-2"><Database className="h-4 w-4 text-purple-600" /></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{db.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline">{db.db_type}</Badge>
                        <Badge variant="outline">{db.kind}</Badge>
                      </div>
                    </div>
                  </div>
                  <Badge variant={db.status === "running" ? "success" : "warning"} dot>{db.status}</Badge>
                </div>
                <div className="text-xs text-gray-400 font-mono mb-3 truncate">{db.host}:{db.port}</div>
                <div className="flex items-center gap-2">
                  {db.connection_string && (
                    <button onClick={() => navigator.clipboard.writeText(db.connection_string)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 cursor-pointer"><Copy className="h-3 w-3" /> Connection string</button>
                  )}
                  <button onClick={() => handleDelete(db.id)} className="ml-auto text-red-400 hover:text-red-600 cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
