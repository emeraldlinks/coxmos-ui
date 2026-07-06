"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Plus, ChevronRight } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Organization } from "@/lib/types"

export default function OrgsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.listOrgs().then((res) => setOrgs(res.organizations)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Organizations</h1>
          <p className="text-sm text-gray-500">Manage teams and organizations</p>
        </div>
        <Link href="/orgs/new"><Button size="sm"><Plus className="h-3.5 w-3.5" /> New Org</Button></Link>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-20 bg-white border border-gray-200 rounded-lg animate-pulse" />)}</div>
      ) : orgs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Users className="h-10 w-10 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-900 mb-1">No organizations</p>
            <p className="text-xs text-gray-500 mb-4">Create your first organization</p>
            <Link href="/orgs/new"><Button size="sm"><Plus className="h-3.5 w-3.5" /> Create Org</Button></Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orgs.map((org) => (
            <Link key={org.id} href={`/orgs/${org.id}`}>
              <Card className="hover:border-gray-300 transition-colors cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-indigo-50 p-2.5">
                        <Users className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{org.name}</p>
                        <p className="text-xs text-gray-400">{org.members?.length || 0} members &middot; Created {formatDate(org.created_at)}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
