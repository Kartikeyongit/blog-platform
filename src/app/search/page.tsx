import PostCard from "../../components/blog/PostCard"
import { Search } from "lucide-react"
import Link from "next/link"

async function searchPosts(query: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || "https://blog-platform.vercel.app"
    const res = await fetch(`${baseUrl}/api/public/posts?search=${encodeURIComponent(query)}&limit=12`, {
      cache: "no-store"
    })
    if (!res.ok) return { posts: [], pagination: { total: 0 } }
    return res.json()
  } catch (error) {
    return { posts: [], pagination: { total: 0 } }
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>
}) {
  const { q: query } = await searchParams
  const searchQuery = query || ""
  const data = await searchPosts(searchQuery)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search</h1>
          
          {/* Search Bar */}
          <form action="/search" className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="search"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search articles, topics, or authors..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 bg-white outline-none text-base"
              />
            </div>
          </form>

          {searchQuery && (
            <p className="text-gray-500 mt-3">
              Found {data.pagination.total} {data.pagination.total === 1 ? "result" : "results"} for "{searchQuery}"
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {data.posts && data.posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            {searchQuery ? (
              <>
                <p className="text-gray-600 text-lg">No posts found for "{searchQuery}"</p>
                <p className="text-gray-500 mt-2">Try different keywords</p>
              </>
            ) : (
              <>
                <p className="text-gray-600 text-lg">Search for articles</p>
                <p className="text-gray-500 mt-2">Type something in the search bar above</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}