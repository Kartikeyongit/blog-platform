import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Globe, FileText, MessageSquare, Heart, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import PostCard from "../../../components/blog/PostCard"

async function getAuthor(id: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/authors/${id}`, {
      cache: "no-store"
    })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    return null
  }
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const author = await getAuthor(id)

  if (!author) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Author Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            {author.image ? (
              <img
                src={author.image}
                alt={author.name}
                className="w-24 h-24 rounded-full object-cover ring-4 ring-white/20 flex-shrink-0"
              />
            ) : (
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                {author.name?.charAt(0) || "A"}
              </div>
            )}

            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold">{author.name}</h1>
              {author.bio && (
                <p className="text-white/80 mt-2 max-w-xl">{author.bio}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 mt-4 justify-center sm:justify-start">
                {author.website && (
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
                <span className="flex items-center gap-1 text-sm text-white/80">
                  <Calendar className="w-4 h-4" />
                  Joined {format(new Date(author.createdAt), "MMMM yyyy")}
                </span>
              </div>

              <div className="flex items-center gap-6 mt-4 justify-center sm:justify-start">
                <div className="text-center">
                  <p className="text-2xl font-bold">{author._count?.posts || 0}</p>
                  <p className="text-xs text-white/70">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{author._count?.comments || 0}</p>
                  <p className="text-xs text-white/70">Comments</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Author Posts */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Posts by {author.name}
        </h2>

        {author.posts && author.posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {author.posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No posts yet</p>
          </div>
        )}
      </div>
    </div>
  )
}