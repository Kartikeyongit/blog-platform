"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { useSession } from "next-auth/react"
import { cn } from "../../lib/utils"
import { useRouter } from "next/navigation"

interface LikeButtonProps {
  postSlug: string
  initialLikes: number
  size?: "sm" | "md" | "lg"
  showCount?: boolean
}

export default function LikeButton({
  postSlug,
  initialLikes,
  size = "md",
  showCount = true,
}: LikeButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [likes, setLikes] = useState(initialLikes)
  const [isLiked, setIsLiked] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const res = await fetch(`/api/posts/${postSlug}/like`)
        if (res.ok) {
          const data = await res.json()
          setLikes(data.count)
          setIsLiked(data.isLiked)
        }
      } catch (error) {
        console.error("Failed to check like status:", error)
      }
    }
    checkLikeStatus()
  }, [postSlug])

  const handleLike = async () => {
    if (!session) {
      router.push("/login")
      return
    }

    if (loading) return
    setLoading(true)
    setIsAnimating(true)

    setIsLiked(!isLiked)
    setLikes(prev => isLiked ? prev - 1 : prev + 1)

    try {
      const res = await fetch(`/api/posts/${postSlug}/like`, {
        method: "POST",
      })

      if (res.ok) {
        const data = await res.json()
        setLikes(data.count)
        setIsLiked(data.liked)
      } else {
        setIsLiked(!isLiked)
        setLikes(prev => isLiked ? prev + 1 : prev - 1)
      }
    } catch (error) {
      setIsLiked(!isLiked)
      setLikes(prev => isLiked ? prev + 1 : prev - 1)
    } finally {
      setLoading(false)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const sizeMap = {
    sm: { icon: "w-3.5 h-3.5", text: "text-xs", gap: "gap-1" },
    md: { icon: "w-4 h-4", text: "text-sm", gap: "gap-1.5" },
    lg: { icon: "w-5 h-5", text: "text-base", gap: "gap-2" },
  }

  // Always show inline with count (no circle)
  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={cn(
        "inline-flex items-center transition-all flex-shrink-0",
        sizeMap[size].gap
      )}
    >
      <Heart
        className={cn(
          sizeMap[size].icon,
          "transition-all duration-300",
          isLiked
            ? "fill-red-500 text-red-500 scale-110"
            : "text-gray-400 hover:text-red-400 hover:scale-110",
          isAnimating && "animate-ping"
        )}
      />
      {showCount && (
        <span className={cn(
          "font-medium tabular-nums",
          sizeMap[size].text,
          isLiked ? "text-red-500" : "text-gray-600 dark:text-gray-400"
        )}>
          {likes}
        </span>
      )}
    </button>
  )
}