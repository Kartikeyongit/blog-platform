"use client"

import { useState } from "react"
import { Check, X, ExternalLink } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface Comment {
  id: string
  content: string
  status: string
  createdAt: Date | string
  author: { name?: string | null; email?: string | null; image?: string | null }
  post: { title: string; slug: string }
}

export default function CommentModeration({
  initialComments,
}: {
  initialComments: Comment[]
}) {
  const [comments, setComments] = useState(initialComments)

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        setComments(prev =>
          prev.map(c => (c.id === id ? { ...c, status } : c))
        )
      }
    } catch (error) {
      console.error("Failed to update comment status")
    }
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    SPAM: "bg-red-100 text-red-800",
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Author</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Comment</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Post</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id} className="border-t hover:bg-gray-50">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  {comment.author.image ? (
                    <img
                      src={comment.author.image}
                      alt={comment.author.name || "User"}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {comment.author.name?.charAt(0) || "A"}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{comment.author.name}</p>
                    <p className="text-sm text-gray-500">{comment.author.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">
                <p className="text-sm text-gray-700 line-clamp-2">{comment.content}</p>
              </td>
              <td className="py-4 px-4">
                <Link
                  href={`/blog/${comment.post.slug}`}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  {comment.post.title}
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </td>
              <td className="py-4 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[comment.status]}`}>
                  {comment.status}
                </span>
              </td>
              <td className="py-4 px-4 text-sm text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end gap-2">
                  {comment.status !== "APPROVED" && (
                    <button
                      onClick={() => updateStatus(comment.id, "APPROVED")}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Approve"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  {comment.status !== "SPAM" && (
                    <button
                      onClick={() => updateStatus(comment.id, "SPAM")}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Mark as Spam"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {comments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No comments to moderate.</p>
        </div>
      )}
    </div>
  )
}