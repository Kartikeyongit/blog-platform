"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  MessageSquare,
  BarChart3,
  Home,
  LogOut,
  Users,
  ChevronLeft,
} from "lucide-react"
import { cn } from "../../lib/utils"
import { useState, useEffect } from "react"

interface SidebarProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string | null
    image?: string | null
  }
}

export default function DashboardSidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/user/profile")
      .then(res => res.json())
      .then(data => {
        if (data.image) setProfileImage(data.image)
      })
      .catch(() => {})
  }, [])

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard"
    }
    if (path === "/dashboard/posts") {
      return pathname === "/dashboard/posts" || pathname === "/dashboard/posts/"
    }
    if (path === "/dashboard/comments") {
      return pathname === "/dashboard/comments" || pathname === "/dashboard/comments/"
    }
    if (path === "/dashboard/analytics") {
      return pathname === "/dashboard/analytics" || pathname === "/dashboard/analytics/"
    }
    if (path === "/dashboard/subscribers") {
      return pathname === "/dashboard/subscribers" || pathname === "/dashboard/subscribers/"
    }
    return pathname === path
  }

  const menuItems = [
    {
      label: "Overview",
      icon: LayoutDashboard,
      href: "/dashboard",
      roles: ["ADMIN", "AUTHOR"]
    },
    {
      label: "Posts",
      icon: FileText,
      href: "/dashboard/posts",
      roles: ["ADMIN", "AUTHOR"]
    },
    {
      label: "Create Post",
      icon: PlusCircle,
      href: "/dashboard/posts/create",
      roles: ["ADMIN", "AUTHOR"]
    },
    {
      label: "Comments",
      icon: MessageSquare,
      href: "/dashboard/comments",
      roles: ["ADMIN"]
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/dashboard/analytics",
      roles: ["ADMIN"]
    },
    {
      label: "Subscribers",
      icon: Users,
      href: "/dashboard/subscribers",
      roles: ["ADMIN"]
    },
    {
      label: "Users",
      icon: Users,
      href: "/dashboard/users",
      roles: ["ADMIN"]
    },
  ]

  return (
    <div className={cn(
      "bg-white shadow-sm flex flex-col transition-all duration-300 h-screen sticky top-0 overflow-y-auto",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Sidebar Header */}
      <div className="p-6 flex items-center justify-between border-b border-gray-100">
        {!collapsed && (
          <Link
            href="/"
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent animate-logo hover:scale-105 transition-transform"
          >
            BlogPlatform
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className={cn(
            "w-5 h-5 text-gray-400 transition-transform",
            collapsed && "rotate-180"
          )} />
        </button>
      </div>

      {/* User Info */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center space-x-3">
            {profileImage || user.image ? (
              <img
                src={profileImage || user.image || ""}
                alt={user.name || "User"}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {user.name?.charAt(0) || "U"}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
              <p className="text-xs text-gray-400">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {menuItems
          .filter(item => item.roles.includes(user.role || ""))
          .map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group relative",
                  active
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
                )} />
                {!collapsed && <span className="text-sm">{item.label}</span>}
                
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-600 rounded-r-full" />
                )}
              </Link>
            )
          })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-100 space-y-0.5">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors",
            collapsed && "justify-center"
          )}
          title="Back to Site"
        >
          <Home className="w-5 h-5 text-gray-400" />
          {!collapsed && <span className="text-sm">Back to Site</span>}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full",
            collapsed && "justify-center"
          )}
          title="Sign Out"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="text-sm">Sign Out</span>}
        </button>
      </div>
    </div>
  )
}