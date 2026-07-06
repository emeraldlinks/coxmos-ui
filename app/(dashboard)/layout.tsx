"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard, Globe, HardDrive, Server, Database, Cpu, CreditCard, Key, Users, Settings, LogOut, Menu, Github, ChevronDown, Search, Terminal, Webhook, Mail, ArrowLeftRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/overview", label: "Dashboard", icon: LayoutDashboard },
  { href: "/apps", label: "Apps", icon: Globe },
  { href: "/databases", label: "Databases", icon: Database },
  { href: "/redis", label: "Redis", icon: Server },
  { href: "/storage", label: "Storage", icon: HardDrive },
  { href: "/dns", label: "DNS", icon: Cpu },
]

const navItems2 = [
  { href: "/webhooks", label: "Webhooks", icon: Webhook },
  { href: "/cli-auth", label: "CLI Auth", icon: Terminal },
  { href: "/email", label: "Email", icon: Mail },
  { href: "/caddy", label: "Caddy", icon: Server },
]

const navBottom = [
  { href: "/orgs", label: "Organizations", icon: Users },
  { href: "/api-keys", label: "API Keys", icon: Key },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [user, loading, router])

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]"><div className="animate-spin h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full" /></div>
  if (!user) return null

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href))

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#1E1B2E] transition-transform lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-14 items-center gap-2.5 px-5 border-b border-white/5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600">
            <span className="text-xs font-bold text-white">C</span>
          </div>
          <span className="font-semibold text-white text-sm">Coxmos Edge</span>
        </div>

        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-white/10 text-white"
                  : "text-[#8B8FA3] hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
          {navItems2.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-white/10 text-white"
                  : "text-[#8B8FA3] hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="py-3 px-3 space-y-0.5 border-t border-white/5">
          {navBottom.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "bg-white/10 text-white"
                  : "text-[#8B8FA3] hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </div>

        <div className="border-t border-white/5 p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/5 cursor-pointer" onClick={() => setShowUserMenu(!showUserMenu)}>
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarImage src={user.git_avatar} alt={user.first_name} />
              <AvatarFallback className="text-[10px] bg-indigo-500 text-white">{user.first_name?.[0]}{user.last_name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#D1D5DB] truncate leading-tight">{user.first_name} {user.last_name}</p>
              <p className="text-[11px] text-[#6B7280] truncate">{user.email}</p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#6B7280]" />
          </div>
          {showUserMenu && (
            <div className="mt-1 ml-2 space-y-0.5">
              <button onClick={() => { router.push("/settings"); setShowUserMenu(false) }} className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-[#8B8FA3] hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                <Settings className="h-3.5 w-3.5" /> Settings
              </button>
              <button onClick={logout} className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm text-[#8B8FA3] hover:text-white hover:bg-white/5 transition-colors cursor-pointer">
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b border-[#E5E7EB] bg-white px-6 lg:px-8">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#6B7280] cursor-pointer">
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          {user.git_username && (
            <a href={`https://github.com/${user.git_username}`} target="_blank" rel="noopener noreferrer" className="text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
              <Github className="h-4 w-4" />
            </a>
          )}
          <Avatar className="h-7 w-7 cursor-pointer" onClick={() => router.push("/settings")}>
            <AvatarImage src={user.git_avatar} alt={user.first_name} />
            <AvatarFallback className="text-[10px] bg-indigo-500 text-white">{user.first_name?.[0]}{user.last_name?.[0]}</AvatarFallback>
          </Avatar>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
