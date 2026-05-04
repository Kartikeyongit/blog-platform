"use client"

import Link from "next/link"
import { Clock, MessageSquare } from "lucide-react"
import LikeButton from "./LikeButton"
import BookmarkButton from "./BookmarkButton"

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt?: string | null
    coverImage?: string | null
    publishedAt?: string | null
    readingTime?: number | null
    author: {
      name?: string | null
      image?: string | null
    }
    category?: {
      name: string
      slug: string
    } | null
    tags?: Array<{ tag: { name: string; slug: string } }>
    _count: {
      comments: number
      likes: number
    }
  }
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      {post.coverImage && (
        <Link href={`/blog/${post.slug}`}>
          <div className="h-48 bg-gradient-to-r from-blue-100 to-purple-100 relative overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
      )}

      <div className="p-6">
        {post.category && (
          <Link
            href={`/category/${post.category.slug}`}
            className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full mb-3 hover:bg-blue-100 transition-colors"
          >
            {post.category.name}
          </Link>
        )}

        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            {/* Author */}
            <div className="flex items-center space-x-2">
              {post.author?.image ? (
                <img
                  src={post.author.image}
                  alt={post.author?.name || "A"}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {post.author?.name?.charAt(0) || "A"}
                </div>
              )}
              <span>{post.author?.name || "Unknown"}</span>
            </div>
            {post.readingTime && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime} min read</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <LikeButton 
              postSlug={post.slug} 
              initialLikes={post._count.likes}
              size="sm"
            />
            <span className="flex items-center space-x-1">
              <MessageSquare className="w-4 h-4" />
              <span>{post._count.comments}</span>
            </span>
            <BookmarkButton postSlug={post.slug} postTitle={post.title} size="sm" />
          </div>
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
            {post.tags.slice(0, 3).map(({ tag }) => (
              <Link
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}