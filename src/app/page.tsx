import Link from "next/link"
import PostCard from "../components/blog/PostCard"
import FeaturedPosts from "../components/blog/FeaturedPosts"
import PopularPosts from "../components/blog/PopularPosts"
import Newsletter from "../components/Newsletter"
import { Search, TrendingUp, Users, BookOpen, ArrowRight, Clock } from "lucide-react"
import type { Metadata } from "next"
import { generateMetadata } from "../lib/seo"
import { prisma } from "../lib/prisma"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = generateMetadata({
  title: "Home",
  description: "Discover stories, thinking, and expertise from writers on technology, programming, and design.",
})

async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED" },
      take: 6,
      orderBy: { publishedAt: "desc" },
      include: {
        author: { select: { name: true, image: true } },
        category: true,
        tags: { include: { tag: true } },
        _count: { select: { comments: true, likes: true } },
      },
    })
    const total = await prisma.post.count({ where: { status: "PUBLISHED" } })
    return { posts, pagination: { total, page: 1, limit: 6, totalPages: Math.ceil(total / 6) } }
  } catch (error) {
    return { posts: [], pagination: { total: 0 } }
  }
}

async function getFeaturedPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED", featured: true },
      take: 3,
      orderBy: { publishedAt: "desc" },
      include: {
        author: { select: { name: true, image: true } },
        category: true,
      },
    })
    return { posts }
  } catch (error) {
    return { posts: [] }
  }
}

async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            posts: {
              where: { status: "PUBLISHED" },
            },
          },
        },
      },
    })
    return categories
  } catch (error) {
    return []
  }
}

export default async function Home() {
  const [recentData, featuredData, categories] = await Promise.all([
    getPosts(),
    getFeaturedPosts(),
    getCategories(),
  ])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 border-b border-gray-100">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 bg-grid-gray-200/[0.02] bg-[size:40px_40px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center max-w-3xl mx-auto animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-gray-900">
              Discover Stories
              <br />
              <span className="text-gray-500">That Matter</span>
            </h1>
            <p className="text-lg text-gray-500 mb-10 leading-relaxed">
              Explore articles on technology, design, and programming. 
              Join a community of passionate writers and readers.
            </p>
            
            {/* Search Bar */}
            <form action="/search" className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="search"
                  name="q"
                  placeholder="Search articles, topics, or authors..."
                  className="w-full pl-12 pr-20 py-4 rounded-xl text-gray-900 bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 text-base"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Stats */}
            <div className="flex justify-center gap-16 text-center">
              <div>
                <p className="text-3xl font-bold text-gray-900">{recentData.pagination?.total || 0}</p>
                <p className="text-gray-400 text-sm mt-1">Articles</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
                <p className="text-gray-400 text-sm mt-1">Categories</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">3+</p>
                <p className="text-gray-400 text-sm mt-1">Authors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredData.posts && featuredData.posts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <FeaturedPosts posts={featuredData.posts} />
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Latest Posts</h2>
                <p className="text-gray-600">Fresh content published regularly</p>
              </div>
              <Link
                href="/search"
                className="group flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentData.posts && recentData.posts.map((post: any, index: number) => (
                <div
                  key={post.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            {(!recentData.posts || recentData.posts.length === 0) && (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No posts published yet.</p>
                <p className="text-gray-500 mt-2">Check back later for new content!</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Newsletter */}
            <Newsletter variant="sidebar" />

            {/* Popular Posts */}
            <PopularPosts />
            
            {/* Categories Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow animate-slide-in-right">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category: any, index: number) => (
                  <Link
                    key={category.id}
                    href={`/category/${category.slug}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all group animate-slide-in-right"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-gray-700 group-hover:text-blue-600 transition-colors font-medium">
                      {category.name}
                    </span>
                    <span className="text-sm bg-gray-100 group-hover:bg-blue-100 group-hover:text-blue-600 px-3 py-1 rounded-full transition-all">
                      {category._count?.posts || 0}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center">
              <Users className="w-8 h-8 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">Join Our Community</h3>
              <p className="text-sm text-gray-500 mb-5">
                Share your knowledge, connect with readers, and grow your audience.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-all"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}