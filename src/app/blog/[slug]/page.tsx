import Link from "next/link"
import { notFound } from "next/navigation"
import CommentSection from "../../../components/comments/CommentSection"
import LikeButton from "../../../components/blog/LikeButton"
import { Calendar, Clock, User, MessageSquare, Heart, Globe, MessageCircle } from "lucide-react"
import type { Metadata } from "next"
import { generateMetadata as createMetaData, generateArticleSchema, generateBreadcrumbSchema } from "../../../lib/seo"
import MarkdownRenderer from "../../../components/blog/MarkdownRenderer"
import BookmarkButton from "../../../components/blog/BookmarkButton"

async function getPost(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://blog-platform.vercel.app"
    const res = await fetch(`${baseUrl}/api/public/posts/${slug}`, {
      cache: "no-store"
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return createMetaData({
      title: "Post Not Found",
      description: "The requested post could not be found.",
    })
  }

  return createMetaData({
    title: post.title,
    description: post.excerpt || post.seo?.description,
    image: post.coverImage || post.seo?.ogImage,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://blog-platform.vercel.app"}/blog/${slug}`,
    type: "article",
    publishedAt: post.publishedAt,
    author: post.author?.name,
    tags: post.tags?.map((t: any) => t.tag.name),
    category: post.category?.name,
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // AWAIT the params
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Category */}
          {post.category && (
            <Link
              href={`/category/${post.category.slug}`}
              className="inline-block px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium mb-4 hover:bg-gray-100 transition-colors text-gray-700"
            >
              {post.category.name}
            </Link>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-gray-500">
            <div className="flex items-center space-x-3">
              {post.author.image ? (
                <img
                  src={post.author.image}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {post.author.name?.charAt(0) || "A"}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-700">{post.author.name}</p>
                {post.author.bio && (
                  <p className="text-sm text-gray-400">{post.author.bio}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              {post.publishedAt && (
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              {post.readingTime && (
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {post.readingTime} min read
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex gap-8">
          {/* Social Share Sidebar */}
          <div className="hidden lg:block sticky top-20 self-start space-y-4">
            <LikeButton 
                postSlug={slug} 
                initialLikes={post._count?.likes || 0}
                size="lg"
                showCount={true}
            />
            <BookmarkButton postSlug={slug} postTitle={post.title} />
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <MessageSquare className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <Globe className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Article Content */}
          <div className="flex-1">
            <div className="prose prose-lg max-w-none">
              <MarkdownRenderer content={post.content} />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(({ tag }: any) => (
                    <Link
                      key={tag.slug}
                      href={`/tag/${tag.slug}`}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author Card */}
            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <div className="flex items-start space-x-4">
                {post.author.image ? (
                  <img
                    src={post.author.image}
                    alt={post.author.name}
                    className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {post.author.name?.charAt(0) || "A"}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{post.author.name}</h3>
                  {post.author.bio && (
                    <p className="text-gray-600 mt-1">{post.author.bio}</p>
                  )}
                  <div className="flex items-center space-x-4 mt-3">
                    <Link
                      href={`/author/${post.author.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all posts →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <CommentSection postSlug={slug} />
          </div>
        </div>
      </div>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateArticleSchema({
              title: post.title,
              description: post.excerpt,
              image: post.coverImage,
              url: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/blog/${slug}`,
              publishedAt: post.publishedAt,
              author: post.author?.name,
              category: post.category?.name,
              tags: post.tags?.map((t: any) => t.tag.name),
            })
          ),
        }}
      />
    </article>
  )
}