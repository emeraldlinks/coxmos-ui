"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Loader2, Check, ExternalLink, BarChart3 } from "lucide-react"
import { formatNaira, formatDate, formatBytes } from "@/lib/utils"
import type { BillingTier, UserTier, Usage } from "@/lib/types"

export default function BillingPage() {
  const [tiers, setTiers] = useState<BillingTier[]>([])
  const [subscription, setSubscription] = useState<UserTier | null>(null)
  const [usage, setUsage] = useState<Usage | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      api.listTiers().then((r) => setTiers(r.tiers)),
      api.getSubscription().then((r) => setSubscription(r.subscription)),
      api.getUsage().then(setUsage).catch(() => {}),
    ]).finally(() => setLoading(false))
  }, [])

  const handleCheckout = async (tierId: string) => {
    setCheckoutLoading(tierId)
    try {
      const res = await api.createCheckout({ tier_id: tierId })
      if (res.authorization_url) {
        window.location.href = res.authorization_url
      } else {
        alert(res.instructions || "Checkout created. Check your phone for payment instructions.")
      }
    } catch { alert("Checkout failed") }
    setCheckoutLoading(null)
  }

  const currentTierId = subscription?.tier_id
  const currentTier = tiers.find((t) => t.id === currentTierId)

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Billing</h1>
        <p className="text-sm text-gray-500">Manage your subscription and usage</p>
      </div>

      {subscription && (
        <Card>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Current Plan</h3>
            <Badge variant={subscription.status === "active" ? "success" : "warning"}>{subscription.status}</Badge>
          </div>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-gray-900">{currentTier?.name || "Custom"}</p>
              <p className="text-sm text-gray-500">{currentTier?.description}</p>
              {subscription.current_period_start && (
                <p className="text-xs text-gray-400 mt-1">Since {formatDate(subscription.current_period_start)}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{currentTier ? formatNaira(currentTier.price) : "-"}</p>
              <p className="text-xs text-gray-400">/month</p>
            </div>
          </CardContent>
        </Card>
      )}

      {usage && (
        <Card>
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-indigo-600" />
            <h3 className="text-sm font-semibold text-gray-900">Current Billing Cycle Usage</h3>
            <span className="text-xs text-gray-400 ml-auto">Started {formatDate(usage.billing_cycle_start)}</span>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Requests</p>
                <p className="text-xl font-semibold text-gray-900">{usage.request_count?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Bandwidth</p>
                <p className="text-xl font-semibold text-gray-900">{usage.bandwidth_bytes ? formatBytes(usage.bandwidth_bytes) : "0 B"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Invocations</p>
                <p className="text-xl font-semibold text-gray-900">{usage.invocation_count?.toLocaleString() || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Edge Invocations</p>
                <p className="text-xl font-semibold text-gray-900">{usage.edge_invocations?.toLocaleString() || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Available Plans</h3>
        {loading ? (
          <div className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin text-indigo-500 mx-auto" /></div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tiers.filter((t) => t.is_active).map((tier) => (
              <Card key={tier.id} className={cn(tier.id === currentTierId && "ring-2 ring-indigo-500")}>
                <CardContent className="p-6 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">{tier.name}</h4>
                    {tier.id === currentTierId && <Badge variant="success">Current</Badge>}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{formatNaira(tier.price)}<span className="text-sm font-normal text-gray-400">/month</span></p>
                  <p className="text-xs text-gray-500 mb-4">{tier.description}</p>
                  <div className="space-y-1.5 text-sm text-gray-600 flex-1">
                    <p>{tier.max_apps} Apps</p>
                    <p>{tier.max_databases} Databases</p>
                    <p>{tier.max_redis} Redis</p>
                    <p>{tier.max_buckets} Buckets</p>
                    <p>{tier.max_bandwidth_gb}GB Bandwidth</p>
                    <p>{tier.max_team_members} Team members</p>
                  </div>
                  <Button
                    className="mt-4 w-full"
                    variant={tier.id === currentTierId ? "outline" : "default"}
                    disabled={checkoutLoading === tier.id || tier.id === currentTierId}
                    onClick={() => handleCheckout(tier.id)}
                  >
                    {checkoutLoading === tier.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                    {tier.id === currentTierId ? "Current Plan" : "Subscribe"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}
