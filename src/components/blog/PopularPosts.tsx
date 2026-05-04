"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { TrendingUp, Heart, MessageSquare, Eye } from "lucide-react"
import { Skeleton } from "../ui/Skeleton"

interface PopularPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  author: {
    id: string
    name?: string | null
    image?: string | null
  }
  category?: {
    name: string
    slug: string
  } | null
  _count: {
    likes: number
    comments: number
  }
}

export default function PopularPosts() {
  const [posts, setPosts] = useState<PopularPost[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7")

  useEffect(() => {
    fetchPopularPosts()
  }, [timeRange])

  const fetchPopularPosts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/posts/popular?limit=5&days=${timeRange}`)
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    } catch (error) {
      console.error("Failed to fetch popular posts:", error)
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-red-500" />
          Trending
        </h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="7">This Week</option>
          <option value="30">This Month</option>
          <option value="90">Last 3 Months</option>
          <option value="365">This Year</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="flex items-start gap-3 p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group"
            >
              {/* Rank Number */}
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                ${index === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' : 
                  index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-white' :
                  index === 2 ? 'bg-gradient-to-r from-orange-300 to-orange-400 text-white' :
                  'bg-gray-100 text-gray-600'}
              `}>
                {index + 1}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                  {post.title}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    {post._count.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {post._count.comments}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No trending posts yet</p>
        </div>
      )}
    </div>
  )
}