import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/prisma"

// GET single post
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const session = await getServerSession(authOptions)

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, image: true, bio: true, website: true } },
        category: true,
        tags: { include: { tag: true } },
        seo: true,
        _count: { select: { comments: true, likes: true } },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // If not published, only allow author/admin
    if (post.status !== "PUBLISHED") {
      if (!session || (session.user.role !== "ADMIN" && post.authorId !== session.user.id)) {
        return NextResponse.json({ error: "Not found" }, { status: 404 })
      }
    }

    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 })
  }
}

// PUT update post
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "AUTHOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = await params
    const { title, content, excerpt, coverImage, categoryId, status, featured } = await req.json()

    const post = await prisma.post.findUnique({ where: { slug } })
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    if (session.user.role !== "ADMIN" && post.authorId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updatedPost = await prisma.post.update({
      where: { slug },
      data: {
        title,
        content,
        excerpt,
        coverImage,
        categoryId: categoryId || null,
        status,
        featured,
        publishedAt: status === "PUBLISHED" && !post.publishedAt ? new Date() : post.publishedAt,
      },
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 })
  }
}

// DELETE post
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "AUTHOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = await params
    const post = await prisma.post.findUnique({ where: { slug } })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    if (session.user.role !== "ADMIN" && post.authorId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.post.delete({ where: { slug } })

    return NextResponse.json({ message: "Post deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}