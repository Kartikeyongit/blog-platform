"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { useSession } from "next-auth/react"
import { cn } from "../../lib/utils"

interface LikeButtonProps {
  commentId: string
  initialLikes: number
}

export default function LikeButton({ commentId, initialLikes }: LikeButtonProps) {
  const { data: session } = useSession()
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (!session) {
      // Redirect to login or show message
      window.location.href = "/login"
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method: "POST",
      })
      const data = await res.json()
      
      setLikes(data.count)
      setIsLiked(data.liked)
    } catch (error) {
      console.error("Failed to toggle like:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className="flex items-center gap-1.5 text-sm transition-all"
    >
      <Heart
        className={cn(
          "w-4 h-4 transition-all",
          isLiked
            ? "fill-red-500 text-red-500 scale-110"
            : "text-gray-400 hover:text-red-500"
        )}
      />
      <span className={cn(
        "text-gray-500",
        isLiked && "text-red-500 font-medium"
      )}>
        {likes}
      </span>
    </button>
  )
}