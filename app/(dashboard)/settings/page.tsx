"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account settings</p>
      </div>

      <Card>
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Profile</h3>
        </div>
        <CardContent className="p-5 space-y-5">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={user.git_avatar} alt={user.first_name} />
              <AvatarFallback className="bg-indigo-500 text-white">{user.first_name?.[0]}{user.last_name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-gray-900">{user.first_name} {user.last_name}</p>
              <p className="text-sm text-gray-400">{user.email}</p>
              <Badge variant="outline" className="mt-1">{user.role}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">First name</label>
              <Input value={user.first_name} disabled />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">Last name</label>
              <Input value={user.last_name} disabled />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">Email</label>
            <Input value={user.email} disabled />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">Phone</label>
            <Input value={user.phone || "Not set"} disabled />
          </div>

          {user.git_username && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-700">GitHub</label>
              <div className="flex items-center gap-2 text-sm text-gray-900">
                <span>{user.git_username}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Account Info</h3>
        </div>
        <CardContent className="p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">User ID</span>
            <span className="font-mono text-gray-900">{user.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Role</span>
            <Badge variant="outline">{user.role}</Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Joined</span>
            <span className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
