"use client"

import { useState, useEffect } from "react"
import { Users, UserCheck, UserMinus, Mail, Calendar, Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "../ui/Skeleton"

interface Subscriber {
  id: string
  email: string
  active: boolean
  confirmedAt: string | null
  createdAt: string
  user?: {
    name?: string | null
    email?: string | null
  } | null
}

export default function SubscriberList() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 })

  useEffect(() => {
    fetchSubscribers()
  }, [filter])

  const fetchSubscribers = async () => {
    setLoading(true)
    try {
      const status = filter === "all" ? "" : filter
      const res = await fetch(`/api/newsletter/subscribers?status=${status}`)
      if (res.ok) {
        const data = await res.json()
        setSubscribers(data.subscribers)
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to fetch subscribers:", error)
    }
    setLoading(false)
  }

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <UserCheck className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-red-600">{stats.inactive}</p>
            </div>
            <UserMinus className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {["all", "active", "inactive"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search emails..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Email</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">User</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Subscribed</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3].map((i) => (
                <tr key={i} className="border-t">
                  <td className="py-4 px-6"><Skeleton className="h-4 w-48" /></td>
                  <td className="py-4 px-6"><Skeleton className="h-4 w-32" /></td>
                  <td className="py-4 px-6"><Skeleton className="h-6 w-20 rounded-full" /></td>
                  <td className="py-4 px-6"><Skeleton className="h-4 w-24" /></td>
                </tr>
              ))
            ) : filteredSubscribers.length > 0 ? (
              filteredSubscribers.map((sub) => (
                <tr key={sub.id} className="border-t hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{sub.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    {sub.user?.name || "—"}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sub.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {sub.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDistanceToNow(new Date(sub.createdAt), { addSuffix: true })}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-500">
                  No subscribers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}