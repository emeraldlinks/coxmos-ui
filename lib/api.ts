"use client"

import type { User, APIKey, App, AppDeployment, RedisInstance, Bucket, ObjectInfo, Database, Organization, OrganizationMember, BillingTier, UserTier, Payment, Usage, OrgResources, AppStats, DeployResponse, DeviceCodeRegisterResponse, DeviceCodeClaimResponse, DeviceCodePollResponse, VerifyAPIKeyResponse, DNSRecord, Domain, OrgCheckoutResponse, OrgUsageResponse, PresignResponse, S3UploadResponse, HealthResponse, CaddyRouteRequest, CaddyTCPRouteRequest, CaddyHeadersRequest, MailAccountRequest, MailDomainRequest, EmailServerConfig } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  }
  const isFormData = options.body instanceof FormData
  if (!isFormData) {
    headers["Content-Type"] = "application/json"
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (!res.ok) {
    const body = await res.text()
    throw new ApiError(body || res.statusText, res.status)
  }
  return res.json()
}

async function requestBlob(path: string, options: RequestInit = {}): Promise<Blob> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  const headers: Record<string, string> = { ...(options.headers as Record<string, string>) }
  if (token) headers["Authorization"] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (!res.ok) {
    const body = await res.text()
    throw new ApiError(body || res.statusText, res.status)
  }
  return res.blob()
}

export const api = {
  // ─── Health ────────────────────────────────────────────────────────────────
  ping: () => request<{ message: string }>("/ping"),
  health: () => request<HealthResponse>("/health"),

  // ─── Auth ───────────────────────────────────────────────────────────────────
  register: (body: { email: string; password: string; first_name: string; last_name: string }) =>
    request<{ token: string; user: User }>("/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  me: () => request<{ user: User }>("/auth/me"),

  verifyAPIKey: (body: { key: string }) =>
    request<VerifyAPIKeyResponse>("/auth/api-keys/verify", { method: "POST", body: JSON.stringify(body) }),

  // ─── CLI Device Code Auth ──────────────────────────────────────────────────
  cliRegisterDevice: (body: { code_hash: string; code_prefix?: string }) =>
    request<DeviceCodeRegisterResponse>("/auth/cli/register", { method: "POST", body: JSON.stringify(body) }),

  cliClaimDevice: (body: { code: string }) =>
    request<DeviceCodeClaimResponse>("/auth/cli/claim", { method: "POST", body: JSON.stringify(body) }),

  cliPollDevice: (body: { code: string }) =>
    request<DeviceCodePollResponse>("/auth/cli/poll", { method: "POST", body: JSON.stringify(body) }),

  // ─── GitHub OAuth ──────────────────────────────────────────────────────────
  githubLogin: () => { window.location.href = `${API_BASE}/auth/github/login` },
  githubUser: () => request<{ username: string; avatar: string; url: string }>("/github/user"),
  githubRepos: () => request<{ repos: { name: string; full_name: string; clone_url: string; ssh_url: string; default_branch: string }[] }>("/github/repos"),
  githubInstall: () => { window.location.href = `${API_BASE}/github/install` },
  githubAppInstalled: () => request<{ message: string }>("/github/callback"),
  githubInstallationToken: (installId: string) =>
    request<{ token: string }>(`/github/installations/${installId}/token`),

  // ─── Apps (Deployments) ────────────────────────────────────────────────────
  deploy: (body: { name: string; clone_url: string; ssh_url?: string; branch?: string; environments?: string[]; organization_id?: string }) =>
    request<DeployResponse>("/apps/deploy", { method: "POST", body: JSON.stringify(body) }),

  appStats: (slug?: string) =>
    request<AppStats>(slug ? `/apps/stats?slug=${encodeURIComponent(slug)}` : "/apps/stats"),

  appLogs: (id: string) =>
    requestBlob(`/apps/logs?id=${encodeURIComponent(id)}`),

  stopApp: (body: { id: string }) => request<{ message: string }>("/apps/stop", { method: "POST", body: JSON.stringify(body) }),

  startApp: (body: { id: string }) => request<{ message: string }>("/apps/start", { method: "POST", body: JSON.stringify(body) }),

  restartApp: (body: { id: string }) => request<{ message: string }>("/apps/restart", { method: "POST", body: JSON.stringify(body) }),

  // ─── Platform ──────────────────────────────────────────────────────────────
  platformHealth: () => request<HealthResponse>("/platform/health"),

  // ─── Billing ────────────────────────────────────────────────────────────────
  listTiers: () => request<{ tiers: BillingTier[] }>("/billing/tiers"),
  getSubscription: () => request<{ subscription: UserTier | null }>("/billing/subscription"),
  createCheckout: (body: { tier_id: string; gateway?: string }) =>
    request<{ gateway: string; authorization_url?: string; reference?: string; merchant_reference?: string; status?: string; instructions?: string }>("/billing/checkout", { method: "POST", body: JSON.stringify(body) }),
  getUsage: () => request<Usage>("/billing/usage"),

  // ─── Organizations ──────────────────────────────────────────────────────────
  listOrgs: () => request<{ organizations: Organization[] }>("/orgs"),
  createOrg: (body: { name: string; description?: string }) =>
    request<{ organization: Organization }>("/orgs", { method: "POST", body: JSON.stringify(body) }),
  getOrg: (id: string) => request<{ organization: Organization }>(`/orgs/${id}`),
  updateOrg: (id: string, body: { name?: string; description?: string }) =>
    request<{ organization: Organization }>(`/orgs/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteOrg: (id: string) => request<{ message: string }>(`/orgs/${id}`, { method: "DELETE" }),

  inviteMember: (id: string, body: { email: string; role?: string }) =>
    request<{ member: OrganizationMember }>(`/orgs/${id}/invite`, { method: "POST", body: JSON.stringify(body) }),
  removeMember: (orgId: string, memberId: string) =>
    request<{ message: string }>(`/orgs/${orgId}/members/${memberId}`, { method: "DELETE" }),
  listMembers: (id: string) =>
    request<{ members: OrganizationMember[] }>(`/orgs/${id}/members`),
  orgResources: (id: string) => request<OrgResources>(`/orgs/${id}/resources`),
  orgUsage: (id: string) => request<OrgUsageResponse>(`/orgs/${id}/usage`),
  orgCheckout: (id: string, body: { tier_id: string; gateway?: string }) =>
    request<OrgCheckoutResponse>(`/orgs/${id}/checkout`, { method: "POST", body: JSON.stringify(body) }),

  // ─── Redis ──────────────────────────────────────────────────────────────────
  newRedis: (body: { name: string; memory_limit_mb?: number; cpu_limit?: number; disk_limit_mb?: number; pids_limit?: number; organization_id?: string }) =>
    request<{ instance: RedisInstance }>("/redis/new", { method: "POST", body: JSON.stringify(body) }),
  redisLogs: (id: string) => requestBlob(`/redis/logs?id=${encodeURIComponent(id)}`),
  redisStats: (id?: string) => {
    const qs = id ? `?id=${encodeURIComponent(id)}` : ""
    return request<{ instances?: RedisInstance[]; instance?: RedisInstance; stats?: unknown }>(`/redis/stats${qs}`)
  },
  stopRedis: (body: { id: string }) => request<{ message: string }>("/redis/stop", { method: "POST", body: JSON.stringify(body) }),
  startRedis: (body: { id: string }) => request<{ message: string }>("/redis/start", { method: "POST", body: JSON.stringify(body) }),
  restartRedis: (body: { id: string }) => request<{ message: string }>("/redis/restart", { method: "POST", body: JSON.stringify(body) }),

  // ─── S3 Storage ────────────────────────────────────────────────────────────
  listBuckets: () => request<{ buckets: Bucket[] }>("/s3/buckets"),
  newBucket: (body: { name: string; organization_id?: string }) =>
    request<{ bucket: Bucket }>("/s3/buckets", { method: "POST", body: JSON.stringify(body) }),
  deleteBucket: (name: string) =>
    request<{ message: string }>(`/s3/buckets/${name}`, { method: "DELETE" }),
  listObjects: (bucket: string) =>
    request<{ objects: ObjectInfo[] }>(`/s3/buckets/${bucket}/objects`),

  uploadObject: (bucket: string, key: string, file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    return request<S3UploadResponse>(`/s3/buckets/${bucket}/objects/${encodeURIComponent(key)}`, {
      method: "POST",
      body: formData,
    })
  },

  getObject: (bucket: string, key: string) =>
    requestBlob(`/s3/buckets/${bucket}/objects/${encodeURIComponent(key)}`),

  deleteObject: (bucket: string, key: string) =>
    request<{ message: string }>(`/s3/buckets/${bucket}/objects/${encodeURIComponent(key)}`, { method: "DELETE" }),

  presignObject: (body: { bucket: string; key: string; expires?: number }) =>
    request<PresignResponse>("/s3/presign", { method: "POST", body: JSON.stringify(body) }),

  s3Proxy: (method: string, path: string, body?: BodyInit) =>
    request(`/s3/proxy/${path}`, { method, body }),

  // ─── Databases ──────────────────────────────────────────────────────────────
  listDatabases: () => request<{ databases: Database[] }>("/databases"),
  createDatabase: (body: { db_type: string; name: string; kind: string; organization_id?: string; memory_mb?: number; cpu?: number }) =>
    request<{ database: Database }>("/databases/new", { method: "POST", body: JSON.stringify(body) }),
  deleteDatabase: (id: string) => request<{ message: string }>(`/databases/${id}`, { method: "DELETE" }),

  // ─── DNS ────────────────────────────────────────────────────────────────────
  listDomains: () =>
    request<{ domains: Domain[] }>("/api/v1/dns/domains"),
  setupNameservers: () =>
    request<{ message: string }>("/api/v1/dns/setup-nameservers", { method: "POST" }),
  registerDomain: (body: { domain: string }) =>
    request<{ domain: string }>("/api/v1/dns/register", { method: "POST", body: JSON.stringify(body) }),
  addDKIMRecord: (body: { domain: string; selector: string; key: string }) =>
    request<{ message: string }>("/api/v1/dns/dkim", { method: "POST", body: JSON.stringify(body) }),
  removeDomain: (domain: string) =>
    request<{ message: string }>(`/api/v1/dns/${domain}`, { method: "DELETE" }),
  addVerificationRecord: (body: { domain: string; token: string }) =>
    request<{ message: string }>("/api/v1/dns/verify", { method: "POST", body: JSON.stringify(body) }),
  verifyDomainOwnership: (body: { domain: string; token: string }) =>
    request<{ verified: boolean }>("/api/v1/dns/verify/check", { method: "POST", body: JSON.stringify(body) }),
  getDNSRecords: (domain: string) =>
    request<{ records: DNSRecord[] }>(`/api/v1/dns/${domain}/records`),
  attachDomain: (body: { domain: string; app_id: string }) =>
    request<{ domain: string; app_id: string }>("/api/v1/dns/domains/attach", { method: "POST", body: JSON.stringify(body) }),

  // ─── Caddy ──────────────────────────────────────────────────────────────────
  initCaddy: () =>
    request<{ message: string }>("/caddy/init", { method: "POST" }),
  addCaddyRoute: (body: CaddyRouteRequest) =>
    request<{ domain: string }>("/caddy/routes", { method: "POST", body: JSON.stringify(body) }),
  deleteCaddyRoute: (domain: string) =>
    request<{ message: string }>(`/caddy/routes/${domain}`, { method: "DELETE" }),
  setCaddyHeaders: (domain: string, body: CaddyHeadersRequest) =>
    request<{ message: string }>(`/caddy/routes/${domain}/headers`, { method: "PUT", body: JSON.stringify(body) }),
  addCaddyTCPRoute: (body: CaddyTCPRouteRequest) =>
    request<{ domain: string }>("/caddy/tcp", { method: "POST", body: JSON.stringify(body) }),
  deleteCaddyTCPRoute: (domain: string) =>
    request<{ message: string }>(`/caddy/tcp/${domain}`, { method: "DELETE" }),

  // ─── Email (Mailu) ─────────────────────────────────────────────────────────
  createEmailAccount: (body: MailAccountRequest) =>
    request<{ email: string }>("/mail/accounts", { method: "POST", body: JSON.stringify(body) }),
  addMailDomain: (body: MailDomainRequest) =>
    request<{ domain: string }>("/mail/domains", { method: "POST", body: JSON.stringify(body) }),
  verifyMailDomain: (domain: string) =>
    request<{ verified: boolean }>(`/mail/domains/${domain}/verify`, { method: "POST" }),
  emailServerConfig: () =>
    request<EmailServerConfig>("/mail/config"),

  // ─── Webhooks ───────────────────────────────────────────────────────────────
  triggerGithubWebhook: () => request<unknown>("/webhook/github", { method: "POST" }),
  triggerPaystackWebhook: () => request<unknown>("/webhook/paystack", { method: "POST" }),
  triggerPayRouterWebhook: () => request<unknown>("/webhook/payrouter", { method: "POST" }),

  // ─── API Keys ───────────────────────────────────────────────────────────────
  listAPIKeys: () => request<{ keys: APIKey[] }>("/auth/api-keys"),
  createAPIKey: (body: { name: string; service?: string; resource?: string; expires_in?: number }) =>
    request<APIKey>("/auth/api-keys", { method: "POST", body: JSON.stringify(body) }),
  revokeAPIKey: (id: string) => request<{ message: string }>(`/auth/api-keys/${id}`, { method: "DELETE" }),
}
