"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Pencil, Trash2, Eye, Star } from "lucide-react"

export default function PostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts")
      if (res.ok) {
        const data = await res.json()
        setPosts(data.posts || data)
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteSlug) return

    try {
      const res = await fetch(`/api/posts/${deleteSlug}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setPosts(posts.filter(p => p.slug !== deleteSlug))
        setShowDeleteConfirm(false)
        setDeleteSlug(null)
      }
    } catch (error) {
      console.error("Failed to delete post:", error)
    }
  }

  const toggleFeatured = async (slug: string, currentFeatured: boolean) => {
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentFeatured }),
      })

      if (res.ok) {
        setPosts(posts.map(p => 
          p.slug === slug ? { ...p, featured: !currentFeatured } : p
        ))
      }
    } catch (error) {
      console.error("Failed to toggle featured:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
          <p className="text-gray-600 mt-2">Manage your blog posts</p>
        </div>
        <Link
          href="/dashboard/posts/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Create New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Title</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Author</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Category</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Status</th>
              <th className="text-center py-4 px-4 text-sm font-medium text-gray-600 w-20">Featured</th>
              <th className="text-left py-4 px-4 text-sm font-medium text-gray-600">Date</th>
              <th className="text-right py-4 px-4 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t hover:bg-gray-50">
                <td className="py-3 px-4">
                  <p className="font-medium text-gray-900 text-sm">{post.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {post.views || 0} views
                  </p>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {post.author?.name || "—"}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">
                  {post.category?.name || "—"}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    post.status === "PUBLISHED" 
                      ? "bg-green-100 text-green-700" 
                      : post.status === "DRAFT"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => toggleFeatured(post.slug, post.featured)}
                    className={`p-1.5 rounded-lg transition-all ${
                      post.featured
                        ? "text-yellow-500 hover:bg-yellow-50"
                        : "text-gray-300 hover:text-yellow-400 hover:bg-gray-50"
                    }`}
                    title={post.featured ? "Remove from featured" : "Mark as featured"}
                  >
                    <Star className={`w-5 h-5 ${post.featured ? "fill-yellow-500" : ""}`} />
                  </button>
                </td>
                <td className="py-3 px-4 text-sm text-gray-500">
                  {new Date(post.updatedAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end space-x-1">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/dashboard/posts/${post.slug}/edit`}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => {
                        setDeleteSlug(post.slug)
                        setShowDeleteConfirm(true)
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No posts yet.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Post</h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setDeleteSlug(null)
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}