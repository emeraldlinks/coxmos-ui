"use client"

import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Users, ArrowLeft, Trash2, Loader2, Globe, Server, HardDrive, Database, Edit3, BarChart3, CreditCard } from "lucide-react"
import Link from "next/link"
import { formatNaira, formatDate } from "@/lib/utils"
import type { Organization, OrganizationMember, OrgResources, OrgUsageResponse } from "@/lib/types"

export default function OrgDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [org, setOrg] = useState<Organization | null>(null)
  const [resources, setResources] = useState<OrgResources | null>(null)
  const [usage, setUsage] = useState<OrgUsageResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [inviting, setInviting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editDesc, setEditDesc] = useState("")
  const [saving, setSaving] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [tierId, setTierId] = useState("")

  const load = async () => {
    try {
      const [orgRes, resRes] = await Promise.all([
        api.getOrg(id),
        api.orgResources(id),
        api.orgUsage(id).then(setUsage).catch(() => {}),
      ])
      setOrg(orgRes.organization)
      setResources(resRes)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  const handleInvite = async () => {
    if (!inviteEmail) return
    setInviting(true)
    try {
      await api.inviteMember(id, { email: inviteEmail, role: inviteRole })
      setInviteEmail("")
      load()
    } catch {}
    setInviting(false)
  }

  const handleRemoveMember = async (memberId: string) => {
    await api.removeMember(id, memberId)
    load()
  }

  const handleEdit = async () => {
    setSaving(true)
    try {
      await api.updateOrg(id, { name: editName, description: editDesc })
      setOrg((prev) => prev ? { ...prev, name: editName, description: editDesc } : prev)
      setEditing(false)
    } catch {}
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm("Delete this organization? This cannot be undone.")) return
    try { await api.deleteOrg(id); router.push("/orgs") } catch {}
  }

  const handleCheckout = async () => {
    if (!tierId) return
    setCheckoutLoading(true)
    try {
      const res = await api.orgCheckout(id, { tier_id: tierId })
      if (res.authorization_url) window.location.href = res.authorization_url
    } catch {}
    setCheckoutLoading(false)
  }

  const startEdit = () => {
    setEditName(org?.name || "")
    setEditDesc(org?.description || "")
    setEditing(true)
  }

  if (loading) return <div className="p-6 lg:p-8 max-w-6xl mx-auto text-center py-16"><div className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto" /></div>
  if (!org) return <div className="p-6 lg:p-8 max-w-6xl mx-auto text-center py-16 text-gray-500">Organization not found</div>

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/orgs" className="text-gray-400 hover:text-gray-600"><ArrowLeft className="h-4 w-4" /></Link>
        <div className="flex-1">
          {editing ? (
            <div className="flex items-center gap-2">
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="w-48" placeholder="Org name" />
              <Button size="sm" onClick={handleEdit} disabled={saving}>
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-gray-900">{org.name}</h1>
              <button onClick={startEdit} className="text-gray-400 hover:text-gray-600 cursor-pointer"><Edit3 className="h-3.5 w-3.5" /></button>
              <button onClick={handleDelete} className="text-red-400 hover:text-red-600 cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          )}
          <p className="text-sm text-gray-500">{org.description}</p>
        </div>
      </div>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card>
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Invite Member</h3>
            </div>
            <CardContent className="p-5">
              <div className="flex gap-3">
                <Input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email@example.com" className="flex-1" />
                <Select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="w-32">
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </Select>
                <Button onClick={handleInvite} disabled={inviting || !inviteEmail} size="sm">
                  {inviting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Invite"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Members ({org.members?.length || 0})</h3>
            </div>
            <CardContent className="p-0">
              {org.members?.map((m, i) => (
                <div key={m.id} className={cn(
                  "flex items-center justify-between px-6 py-4",
                  i !== (org.members?.length || 0) - 1 && "border-b border-gray-100"
                )}>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-medium text-indigo-600">
                      {m.user?.first_name?.[0]}{m.user?.last_name?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{m.user?.first_name} {m.user?.last_name}</p>
                      <p className="text-xs text-gray-400">{m.user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{m.role}</Badge>
                    {m.role !== "owner" && (
                      <button onClick={() => handleRemoveMember(m.id)} className="text-red-400 hover:text-red-600 cursor-pointer"><Trash2 className="h-3.5 w-3.5" /></button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          {resources && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Globe className="h-4 w-4 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-900">Apps</span>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{resources.apps?.length || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-gray-900">Databases</span>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{resources.databases?.length || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Server className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">Redis</span>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{resources.redis?.length || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <HardDrive className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-gray-900">Buckets</span>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{resources.buckets?.length || 0}</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="usage">
          <Card>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-600" />
              <h3 className="text-sm font-semibold text-gray-900">Organization Resource Usage</h3>
            </div>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Apps</p>
                  <p className="text-xl font-semibold text-gray-900">{usage?.apps || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Databases</p>
                  <p className="text-xl font-semibold text-gray-900">{usage?.databases || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Redis</p>
                  <p className="text-xl font-semibold text-gray-900">{usage?.redis || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Buckets</p>
                  <p className="text-xl font-semibold text-gray-900">{usage?.buckets || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Bandwidth</p>
                  <p className="text-xl font-semibold text-gray-900">{usage?.bandwidth_gb || 0} GB</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Storage</p>
                  <p className="text-xl font-semibold text-gray-900">{usage?.storage_gb || 0} GB</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-green-600" />
              <h3 className="text-sm font-semibold text-gray-900">Checkout</h3>
            </div>
            <CardContent className="p-6 space-y-3">
              <p className="text-sm text-gray-500">Create a checkout session for this organization.</p>
              <div className="flex gap-2">
                <Input value={tierId} onChange={(e) => setTierId(e.target.value)} placeholder="Tier ID" className="flex-1" />
                <Button onClick={handleCheckout} disabled={checkoutLoading || !tierId}>
                  {checkoutLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                  Create Checkout
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function formatBytes(bytes: number) {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(1) + " GB"
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " MB"
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + " KB"
  return bytes + " B"
}

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
