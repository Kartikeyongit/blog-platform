import { NextResponse } from "next/server"
import { prisma } from "../../../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../../src/lib/auth"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // AWAIT the params
    const { slug } = await params

    const post = await prisma.post.findUnique({
      where: {
        slug: slug,
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            website: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        seo: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    })

    // Check if the current user has liked this post
    let userLiked = false
    const session = await getServerSession(authOptions)
    if (session?.user) {
      const like = await prisma.like.findFirst({
        where: {
          userId: session.user?.id,
          postId: post.id,
        },
      })
      userLiked = !!like
    }

    return NextResponse.json({
      ...post,
      userLiked,
    })

  } catch (error) {
    console.error("Failed to fetch post:", error)
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    )
  }
}