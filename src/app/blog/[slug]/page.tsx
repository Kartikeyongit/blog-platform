import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Clock, MessageSquare, Heart, Globe, MessageCircle } from "lucide-react"
import type { Metadata } from "next"
import { prisma } from "../../../lib/prisma"
import LikeButton from "../../../components/blog/LikeButton"
import BookmarkButton from "../../../components/blog/BookmarkButton"
import CommentSection from "../../../components/comments/CommentSection"
import MarkdownRenderer from "../../../components/blog/MarkdownRenderer"

export const dynamic = 'force-dynamic'

async function getPost(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug, status: "PUBLISHED" },
      include: {
        author: { select: { id: true, name: true, image: true, bio: true, website: true } },
        category: true,
        tags: { include: { tag: true } },
        seo: true,
        _count: { select: { comments: true, likes: true } },
      },
    })
    return post
  } catch (error) {
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return { title: "Post Not Found" }
  return {
    title: post.title,
    description: post.excerpt || "",
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      type: "article",
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {post.category && (
            <Link
              href={`/category/${post.category.slug}`}
              className="inline-block px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium mb-4 hover:bg-gray-100 transition-colors text-gray-700"
            >
              {post.category.name}
            </Link>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-gray-500">
            <div className="flex items-center space-x-3">
              {post.author.image ? (
                <img src={post.author.image} alt={post.author.name || ""} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {post.author.name?.charAt(0) || "A"}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-700">{post.author.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              {post.publishedAt && (
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex gap-8">
          <div className="hidden lg:block sticky top-20 self-start space-y-4">
            <LikeButton postSlug={slug} initialLikes={post._count.likes} size="lg" />
            <BookmarkButton postSlug={slug} postTitle={post.title} />
          </div>

          <div className="flex-1">
            <MarkdownRenderer content={post.content} />

            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t">
                <h3 className="text-sm font-medium text-gray-600 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(({ tag }: any) => (
                    <Link key={tag.slug} href={`/tag/${tag.slug}`} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 p-6 bg-gray-50 rounded-xl">
              <div className="flex items-start space-x-4">
                {post.author.image ? (
                  <img src={post.author.image} alt={post.author.name || ""} className="w-16 h-16 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                    {post.author.name?.charAt(0) || "A"}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{post.author.name}</h3>
                  {post.author.bio && <p className="text-gray-600 mt-1">{post.author.bio}</p>}
                  <Link href={`/author/${post.author.id}`} className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-3 inline-block">
                    View all posts →
                  </Link>
                </div>
              </div>
            </div>

            <CommentSection postSlug={slug} />
          </div>
        </div>
      </div>
    </article>
  )
}