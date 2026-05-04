"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bookmark, Trash2, ExternalLink } from "lucide-react"
import { useSession } from "next-auth/react"

interface Bookmark {
  slug: string
  title: string
  savedAt: string
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const { data: session } = useSession()

  const getStorageKey = () => {
    const userId = session?.user?.id || "anonymous"
    return `bookmarks_${userId}`
  }

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(getStorageKey()) || "[]")
    setBookmarks(saved)
  }, [])

  const removeBookmark = (slug: string) => {
    const updated = bookmarks.filter(b => b.slug !== slug)
    localStorage.setItem(getStorageKey(), JSON.stringify(updated))
    setBookmarks(updated)
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Bookmark className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900">Reading List</h1>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No saved posts yet</p>
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
            >
              Browse posts to save
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.slug}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/blog/${bookmark.slug}`}
                    className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
                  >
                    {bookmark.title}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    Saved {new Date(bookmark.savedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link
                    href={`/blog/${bookmark.slug}`}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => removeBookmark(bookmark.slug)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}