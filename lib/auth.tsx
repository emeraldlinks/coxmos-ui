"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { api } from "./api"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      api.me().then((res) => setUser(res.user)).catch(() => localStorage.removeItem("token")).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const setTokenCookie = (token: string) => {
    document.cookie = `token=${token};path=/;max-age=${60 * 60 * 24 * 7};samesite=lax`
  }

  const removeTokenCookie = () => {
    document.cookie = "token=;path=/;max-age=0"
  }

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password })
    localStorage.setItem("token", res.token)
    setTokenCookie(res.token)
    setUser(res.user)
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    const res = await api.register({ email, password, first_name: firstName, last_name: lastName })
    localStorage.setItem("token", res.token)
    setTokenCookie(res.token)
    setUser(res.user)
  }

  const logout = () => {
    localStorage.removeItem("token")
    removeTokenCookie()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
