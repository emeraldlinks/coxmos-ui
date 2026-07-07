export interface User {
  id: string
  created_at: string
  updated_at: string
  role: "user" | "admin" | "superadmin"
  suspended: boolean
  email: string
  first_name: string
  last_name: string
  phone: string
  bio: string
  git_url: string
  git_username: string
  git_user_id: string | null
  git_avatar: string
  git_install_id: string
  verified: boolean
  redis_instances?: RedisInstance[]
  api_keys?: APIKey[]
  buckets?: Bucket[]
  databases?: Database[]
  apps?: App[]
  user_tier?: UserTier
  payments?: Payment[]
}

export interface APIKey {
  id: string
  created_at: string
  updated_at: string
  name: string
  service: string
  resource: string
  scoped: boolean
  expires_at: string | null
  last_used_at: string | null
  key?: string
  secret?: string
  secret_hint?: string
}

export interface App {
  id: string
  created_at: string
  updated_at: string
  name: string
  slug: string
  framework: string
  git_url: string
  git_ssh: string
  branch: string
  install_id: string
  uri: string
  status: "queued" | "building" | "live" | "failed" | "stopped"
  last_deployed: string
  user_id: string
  organization_id: string | null
  deployments?: AppDeployment[]
}

export interface AppDeployment {
  id: string
  created_at: string
  app_id: string
  commit_sha: string
  commit_message: string
  branch: string
  status: "queued" | "live" | "failed"
  build_log: string
  built_at: string | null
  framework: string
  static_routes: number
  edge_routes: number
  serverless_routes: number
}

export interface DeployResponse {
  deployment_id: string
  app_id: string
  url: string
  status: string
}

export interface RedisInstance {
  id: string
  created_at: string
  updated_at: string
  container_name: string
  host_port: number
  internal_port: number
  host: string
  uri: string
  memory_limit_mb: number
  cpu_limit: number
  disk_limit_mb: number
  pids_limit: number
  cpu_percent: number
  memory_usage_mb: number
  memory_percent: number
  network_rx_mb: number
  network_tx_mb: number
  block_read_mb: number
  block_write_mb: number
  pids_current: number
  last_metrics_at: string
  status: "stopped" | "running"
  user_id: string
  organization_id: string | null
}

export interface Bucket {
  id: string
  created_at: string
  updated_at: string
  name: string
  tenant_id: string
  user_id: string
  organization_id: string | null
  endpoint: string
}

export interface ObjectInfo {
  key: string
  size: number
  lastModified: string
  url: string
}

export interface Database {
  id: string
  created_at: string
  updated_at: string
  db_type: "postgres" | "mysql"
  kind: "isolated" | "provisioned"
  name: string
  username: string
  connection_string: string
  host: string
  port: number
  status: string
  user_id: string
  organization_id: string | null
}

export interface Domain {
  id: string
  created_at: string
  updated_at: string
  name: string
  app_id: string
  verification_token: string
  status: "pending" | "active"
}

export interface Organization {
  id: string
  created_at: string
  updated_at: string
  name: string
  slug: string
  description: string
  owner_id: string
  billing_email: string
  user_tier_id: string | null
  user_tier?: UserTier
  members?: OrganizationMember[]
}

export interface OrganizationMember {
  id: string
  created_at: string
  organization_id: string
  user_id: string
  user?: User
  role: "owner" | "admin" | "member" | "viewer"
}

export interface BillingTier {
  id: string
  created_at: string
  updated_at: string
  name: string
  description: string
  price: number
  max_apps: number
  max_databases: number
  max_redis: number
  max_buckets: number
  max_bandwidth_gb: number
  max_storage_gb: number
  max_team_members: number
  default_memory_mb: number
  default_cpu: number
  features: string
  is_active: boolean
  sort_order: number
}

export interface UserTier {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  tier_id: string
  tier?: BillingTier
  status: "active" | "past_due" | "canceled" | "trialing"
  trial_ends_at: string | null
  current_period_start: string | null
  current_period_end: string | null
}

export interface Payment {
  id: string
  created_at: string
  user_id: string
  organization_id: string | null
  reference: string
  amount: number
  currency: string
  status: "pending" | "success" | "failed" | "resolved"
  tier_id: string | null
}

export interface Usage {
  id: string
  created_at: string
  request_count: number
  bandwidth_bytes: number
  invocation_count: number
  edge_invocations: number
  billing_cycle_start: string
}

export interface OrgResources {
  apps: App[]
  databases: Database[]
  redis: RedisInstance[]
  buckets: Bucket[]
}

export interface AdminStats {
  users: number
  apps: number
  databases: number
  redis: number
  buckets: number
}

export interface HealthResponse {
  status: string
  version: string
  engine: string
  architecture?: string
  isolates?: Record<string, unknown>
  isolate_count?: number
  vms?: unknown[]
  vm_count?: number
  nextjs_servers?: unknown[]
  nextjs_count?: number
}

export interface AppStats {
  slug?: string
  isolates?: unknown[]
  vms?: unknown[]
}

export interface DeviceCodeRegisterResponse {
  expires_in: number
}

export interface DeviceCodeClaimResponse {
  message: string
}

export interface DeviceCodePollResponse {
  status: "pending" | "verified"
  token?: string
  user?: {
    id: string
    email: string
    first_name: string
    last_name: string
  }
}

export interface VerifyAPIKeyResponse {
  valid: boolean
  service?: string
  resource?: string
  user_id?: string
}

export interface DNSRecord {
  name: string
  type: string
  value: string
  ttl?: number
}

export interface CaddyRouteRequest {
  domain: string
  slug: string
  port?: number
}

export interface CaddyTCPRouteRequest {
  domain: string
  upstream: string
  port?: number
}

export interface CaddyHeadersRequest {
  request_headers?: Record<string, string>
  response_headers?: Record<string, string>
}

export interface MailAccountRequest {
  email: string
  password: string
  name?: string
}

export interface MailDomainRequest {
  domain: string
}

export interface S3UploadResponse {
  key: string
  bucket: string
}

export interface PresignResponse {
  url: string
  expires_in: number
}

export interface OrgCheckoutResponse {
  gateway: string
  authorization_url?: string
  reference?: string
  merchant_reference?: string
  status?: string
  instructions?: string
}

export interface OrgUsageResponse {
  apps: number
  databases: number
  redis: number
  buckets: number
  bandwidth_gb: number
  storage_gb: number
}

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  published_at: string
  tags: string[]
  cover_image?: string
}

export interface DocPage {
  slug: string
  title: string
  description: string
  content: string
  category: string
  order: number
}

export interface EmailServerConfig {
  smtp: { host: string; port: number; tls: boolean; starttls: boolean; auth: string[] }
  imap: { host: string; port: number; tls: boolean; starttls: boolean; auth: string[] }
  pop3: { host: string; port: number; tls: boolean; starttls: boolean; auth: string[] }
  webmail_url: string
}
