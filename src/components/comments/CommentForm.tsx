"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Send, Loader2 } from "lucide-react"
import { useUser } from "../../hooks/useUser"

interface CommentFormProps {
  postSlug: string
  parentId?: string
  onCommentAdded: (comment: any) => void
  placeholder?: string
}

export default function CommentForm({
  postSlug,
  parentId,
  onCommentAdded,
  placeholder = "Write a comment...",
}: CommentFormProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const user = useUser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!content.trim()) return
    
    setError("")
    setLoading(true)

    try {
      const res = await fetch(`/api/posts/${postSlug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          parentId: parentId || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to add comment")
        setLoading(false)
        return
      }

      setSuccess(true)
      setContent("")
      onCommentAdded(data)
      
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="flex items-start gap-3">
        {user?.image ? (
          <img
            src={user.image}
            alt={user.name || "You"}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
            {user.name?.charAt(0) || "Y"}
          </div>
        )}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            rows={3}
            maxLength={1000}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
          />
          
          {/* Footer */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {content.length}/1000 characters
            </span>
            <div className="flex items-center gap-3">
              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
              {success && (
                <p className="text-sm text-green-600">
                  {parentId ? "Reply added!" : "Comment added!"}
                </p>
              )}
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {parentId ? "Reply" : "Comment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}