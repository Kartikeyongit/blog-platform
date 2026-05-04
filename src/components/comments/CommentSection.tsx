"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { MessageSquare, Loader2, AlertCircle } from "lucide-react"
import CommentItem from "./CommentItem"
import CommentForm from "./CommentForm"
import { Skeleton } from "../ui/Skeleton"

interface Comment {
  id: string
  content: string
  createdAt: string
  author: {
    id: string
    name?: string | null
    image?: string | null
  }
  replies: Comment[]
  _count: {
    likes: number
    replies: number
  }
}

interface CommentSectionProps {
  postSlug: string
}

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [totalComments, setTotalComments] = useState(0)

  const fetchComments = useCallback(async (pageNum: number) => {
    try {
      setLoading(true)
      const res = await fetch(
        `/api/posts/${postSlug}/comments?page=${pageNum}&limit=5`
      )
      if (!res.ok) throw new Error("Failed to fetch")
      const data = await res.json()
      
      if (pageNum === 1) {
        setComments(data.comments)
      } else {
        setComments(prev => [...prev, ...data.comments])
      }
      
      setHasMore(data.pagination.hasMore)
      setTotalComments(data.pagination.total)
      setError("")
    } catch (err) {
      setError("Failed to load comments")
    } finally {
      setLoading(false)
    }
  }, [postSlug])

  useEffect(() => {
    fetchComments(1)
  }, [fetchComments])

  const handleCommentAdded = (newComment: Comment) => {
    if (newComment) {
      // If it's a reply, update the parent comment
      setComments(prev => prev.map(comment => {
        if (comment.id === newComment.id) return newComment
        // Check replies
        if (comment.replies?.some(reply => reply.id === newComment.id)) {
          return {
            ...comment,
            replies: comment.replies.map(reply =>
              reply.id === newComment.id ? newComment : reply
            ),
          }
        }
        return comment
      }))
    } else {
      // New top-level comment, refresh
      fetchComments(1)
    }
    setTotalComments(prev => prev + 1)
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchComments(nextPage)
  }

  return (
    <div className="mt-12">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">
          Comments ({totalComments})
        </h2>
      </div>

      {/* Comment Form */}
      {session ? (
        <CommentForm
          postSlug={postSlug}
          onCommentAdded={handleCommentAdded}
        />
      ) : (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 text-center">
          <p className="text-gray-700 mb-2">Join the conversation</p>
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign in to leave a comment
          </a>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg mb-6">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postSlug={postSlug}
            onReplyAdded={handleCommentAdded}
            depth={0}
          />
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4 mt-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && !loading && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
          >
            Load More Comments
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && comments.length === 0 && !error && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No comments yet</p>
          <p className="text-gray-500 text-sm mt-1">Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  )
}