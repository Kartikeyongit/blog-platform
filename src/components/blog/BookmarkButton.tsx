"use client"

import { useState, useEffect } from "react"
import { Bookmark } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { cn } from "../../lib/utils"

interface BookmarkButtonProps {
  postSlug: string
  postTitle: string
  size?: "sm" | "md"
}

export default function BookmarkButton({ postSlug, postTitle, size = "md" }: BookmarkButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Get user-specific storage key
  const getStorageKey = () => {
    const userId = session?.user?.id || "anonymous"
    return `bookmarks_${userId}`
  }

  useEffect(() => {
    setMounted(true)
    if (session?.user?.id) {
      const bookmarks = JSON.parse(localStorage.getItem(getStorageKey()) || "[]")
      setIsBookmarked(bookmarks.some((b: any) => b.slug === postSlug))
    }
  }, [postSlug, session])

  const toggleBookmark = () => {
    if (!session) {
      router.push("/login")
      return
    }

    const key = getStorageKey()
    const bookmarks = JSON.parse(localStorage.getItem(key) || "[]")
    
    if (isBookmarked) {
      const updated = bookmarks.filter((b: any) => b.slug !== postSlug)
      localStorage.setItem(key, JSON.stringify(updated))
      setIsBookmarked(false)
    } else {
      bookmarks.push({
        slug: postSlug,
        title: postTitle,
        savedAt: new Date().toISOString(),
      })
      localStorage.setItem(key, JSON.stringify(bookmarks))
      setIsBookmarked(true)
    }
  }

  if (!mounted) return null

  const sizeClasses = size === "sm" ? "p-1.5" : "p-2"

  return (
    <button
      onClick={toggleBookmark}
      className={cn(
        sizeClasses,
        "rounded-lg transition-all hover:bg-gray-100",
        isBookmarked ? "text-yellow-500" : "text-gray-400 hover:text-yellow-500"
      )}
      title={isBookmarked ? "Remove bookmark" : "Bookmark this post"}
    >
      <Bookmark
        className={cn(
          size === "sm" ? "w-4 h-4" : "w-5 h-5",
          isBookmarked && "fill-yellow-500"
        )}
      />
    </button>
  )
}