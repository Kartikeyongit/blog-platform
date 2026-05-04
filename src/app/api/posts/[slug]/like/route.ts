import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../lib/auth"
import { prisma } from "../../../../../lib/prisma"

// POST - Toggle like/unlike
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to like posts" },
        { status: 401 }
      )
    }

    const { slug } = await params

    // Find the post
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    // Check if already liked
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: session.user?.id,
        postId: post.id,
      },
    })

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id },
      })

      const count = await prisma.like.count({
        where: { postId: post.id },
      })

      return NextResponse.json({ 
        liked: false, 
        count,
        message: "Post unliked" 
      })
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: session.user?.id,
          postId: post.id,
        },
      })

      const count = await prisma.like.count({
        where: { postId: post.id },
      })

      return NextResponse.json({ 
        liked: true, 
        count,
        message: "Post liked" 
      })
    }
  } catch (error) {
    console.error("Failed to toggle like:", error)
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    )
  }
}

// GET - Check if user liked and get count
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { slug } = await params

    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    const count = await prisma.like.count({
      where: { postId: post.id },
    })

    let isLiked = false
    if (session?.user) {
      const like = await prisma.like.findFirst({
        where: {
          userId: session.user?.id,
          postId: post.id,
        },
      })
      isLiked = !!like
    }

    return NextResponse.json({ count, isLiked })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    )
  }
}