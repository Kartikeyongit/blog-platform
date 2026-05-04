"use client"

import Link from "next/link"
import { Clock, ArrowRight } from "lucide-react"

interface FeaturedPostsProps {
  posts: any[]
}

export default function FeaturedPosts({ posts }: FeaturedPostsProps) {
  if (!posts || posts.length === 0) return null

  const post = posts[0]

  return (
    <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
      <Link
        href={`/blog/${post.slug}`}
        className="group block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-100"
      >
        <div className="flex flex-col md:flex-row">
          {/* Text Content */}
          <div className="flex-1 p-8 md:p-10" style={{ background: 'linear-gradient(135deg, rgba(239, 246, 255, 0.5) 0%, rgba(255, 255, 255, 1) 50%, rgba(243, 232, 255, 0.3) 100%)' }}>
            {post.category && (
              <span className="inline-block px-3 py-1 bg-white border border-gray-100 shadow-sm text-gray-600 text-xs font-medium rounded-full mb-4">
                {post.category.name}
              </span>
            )}
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="text-gray-500 leading-relaxed mb-6 line-clamp-2">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span>{post.author?.name || "Unknown"}</span>
                {post.readingTime && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readingTime} min read
                    </span>
                  </>
                )}
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                Read Article
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>

          {/* Cover Image Side */}
          <div className="md:w-80 h-48 md:h-auto relative overflow-hidden bg-gray-100">
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-300">
                  <svg className="w-12 h-12 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </section>
  )
}