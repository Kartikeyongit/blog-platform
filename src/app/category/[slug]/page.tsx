import PostCard from "../../../components/blog/PostCard"
import { notFound } from "next/navigation"
import { prisma } from "../../../lib/prisma"

async function getCategoryPosts(slug: string) {
  try {
    const posts = await prisma.post.findMany({
      where: { status: "PUBLISHED", category: { slug } },
      take: 12,
      orderBy: { publishedAt: "desc" },
      include: {
        author: { select: { name: true, image: true } },
        category: true,
        tags: { include: { tag: true } },
        _count: { select: { comments: true, likes: true } },
      },
    })
    const total = await prisma.post.count({ where: { status: "PUBLISHED", category: { slug } } })
    return { posts, pagination: { total } }
  } catch (error) {
    return null
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getCategoryPosts(slug)

  if (!data || data.posts.length === 0) {
    notFound()
  }

  const categoryName = data.posts[0]?.category?.name || slug

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2">{categoryName}</h1>
          <p className="text-white/80">
            {data.pagination.total} {data.pagination.total === 1 ? "post" : "posts"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.posts.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}