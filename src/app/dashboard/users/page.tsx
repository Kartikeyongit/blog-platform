"use client"

import { useState, useEffect } from "react"
import { Users, Shield, User, BookOpen, Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface User {
  id: string
  name: string | null
  email: string
  image: string | null
  role: string
  createdAt: string
  _count: {
    posts: number
    comments: number
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [message, setMessage] = useState({ type: "", text: "" })
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users")
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setLoading(false)
    }
  }

  const changeRole = async (userId: string, newRole: string) => {
    setUpdatingId(userId)
    setMessage({ type: "", text: "" })

    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      })

      const data = await res.json()

      if (res.ok) {
        setUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, role: newRole } : u
        ))
        setMessage({ type: "success", text: `Role changed to ${newRole}` })
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update role" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update role" })
    } finally {
      setUpdatingId(null)
      setTimeout(() => setMessage({ type: "", text: "" }), 3000)
    }
  }

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const roleColors: Record<string, string> = {
    ADMIN: "bg-purple-100 text-purple-800",
    AUTHOR: "bg-blue-100 text-blue-800",
    READER: "bg-gray-100 text-gray-800",
  }

  const roleIcons: Record<string, any> = {
    ADMIN: Shield,
    AUTHOR: BookOpen,
    READER: User,
  }

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === "ADMIN").length,
    authors: users.filter(u => u.role === "AUTHOR").length,
    readers: users.filter(u => u.role === "READER").length,
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage users and their roles</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Users</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-2xl font-bold text-purple-600">{stats.admins}</p>
          <p className="text-sm text-gray-500">Admins</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-2xl font-bold text-blue-600">{stats.authors}</p>
          <p className="text-sm text-gray-500">Authors</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-2xl font-bold text-gray-600">{stats.readers}</p>
          <p className="text-sm text-gray-500">Readers</p>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg text-sm ${
          message.type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none bg-white text-sm"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Role</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Posts</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Comments</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Joined</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const RoleIcon = roleIcons[user.role]
                return (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img src={user.image} alt={user.name || ""} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {user.name?.charAt(0) || "U"}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{user.name || "Unnamed"}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                        <RoleIcon className="w-3 h-3" />
                        {user.role}
                      </span>
                    </td>
                    <td className="text-center py-3 px-4 text-sm text-gray-600">{user._count.posts}</td>
                    <td className="text-center py-3 px-4 text-sm text-gray-600">{user._count.comments}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <select
                        value={user.role}
                        onChange={(e) => changeRole(user.id, e.target.value)}
                        disabled={updatingId === user.id || user.id === "current"}
                        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 outline-none bg-white disabled:opacity-50"
                      >
                        <option value="READER">Reader</option>
                        <option value="AUTHOR">Author</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}