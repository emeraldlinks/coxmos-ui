"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/ui/statcard"
import { Globe, HardDrive, Server, Database, Plus } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { App } from "@/lib/types"

export default function DashboardOverview() {
  const { user } = useAuth()
  const [apps, setApps] = useState<App[]>([])

  useEffect(() => {
    if (user?.apps) setApps(user.apps)
  }, [user])

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Welcome back, {user?.first_name}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Monitor and manage your infrastructure</p>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Apps" value={user?.apps?.length || 0} accent="indigo" icon={Globe} />
        <StatCard label="Databases" value={user?.databases?.length || 0} accent="emerald" icon={Database} />
        <StatCard label="Redis" value={user?.redis_instances?.length || 0} accent="amber" icon={Server} />
        <StatCard label="Buckets" value={user?.buckets?.length || 0} accent="muted" icon={HardDrive} />
      </div>

      <Card>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Recent Apps</h3>
          <Link href="/apps/deploy">
            <Button size="sm"><Plus className="h-3.5 w-3.5" /> Deploy</Button>
          </Link>
        </div>
        <CardContent className="p-0">
          {apps.length > 0 ? (
            <div>
              {apps.slice(0, 5).map((app, i) => (
                <Link key={app.id} href={`/apps/${app.slug}`}>
                  <div className={cn(
                    "flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors",
                    i !== Math.min(apps.length, 5) - 1 && "border-b border-gray-100"
                  )}>
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-indigo-50 p-2">
                        <Globe className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{app.name}</p>
                        <p className="text-xs text-gray-400">{app.framework} &middot; {app.branch}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={app.status === "live" ? "success" : app.status === "failed" ? "destructive" : "warning"} dot>{app.status}</Badge>
                      <span className="text-xs text-gray-400">{formatDate(app.last_deployed)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Globe className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">No apps deployed</p>
              <p className="text-xs text-gray-500 mb-4">Deploy your first app from GitHub</p>
              <Link href="/apps/deploy"><Button size="sm"><Plus className="h-3.5 w-3.5" /> Deploy</Button></Link>
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
