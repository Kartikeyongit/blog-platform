"use client"

import { useState } from "react"
import { Heart, MessageCircle, Reply } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import CommentForm from "./CommentForm"
import LikeButton from "./LikeButton"

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

interface CommentItemProps {
  comment: Comment
  postSlug: string
  onReplyAdded: (comment: any) => void
  depth: number
}

export default function CommentItem({
  comment,
  postSlug,
  onReplyAdded,
  depth,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const maxDepth = 3 // Limit nesting depth

  return (
    <div className={`${depth > 0 ? "ml-6 pl-6 border-l-2 border-gray-100" : ""}`}>
      <div className="bg-white rounded-xl p-6 hover:shadow-sm transition-shadow">
        {/* Author Info */}
        <div className="flex items-start gap-3 mb-3">
          {comment.author.image ? (
            <img
              src={comment.author.image}
              alt={comment.author.name}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              {comment.author.name?.charAt(0) || "A"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">
                {comment.author.name || "Anonymous"}
              </h4>
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="text-gray-700 mt-2 whitespace-pre-wrap">{comment.content}</p>
            
            {/* Actions */}
            <div className="flex items-center gap-4 mt-3">
              <LikeButton
                commentId={comment.id}
                initialLikes={comment._count.likes}
              />
              
              {depth < maxDepth && (
                <button
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  Reply
                </button>
              )}

              {comment._count.replies > 0 && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  {showReplies ? "Hide" : "Show"} {comment._count.replies} {comment._count.replies === 1 ? "reply" : "replies"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <div className="mt-4 ml-12">
            <CommentForm
              postSlug={postSlug}
              parentId={comment.id}
              onCommentAdded={(newComment) => {
                onReplyAdded(newComment)
                setShowReplyForm(false)
              }}
              placeholder={`Reply to ${comment.author.name}...`}
            />
          </div>
        )}
      </div>

      {/* Replies */}
      {showReplies && comment.replies?.length > 0 && (
        <div className="space-y-4 mt-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postSlug={postSlug}
              onReplyAdded={onReplyAdded}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}