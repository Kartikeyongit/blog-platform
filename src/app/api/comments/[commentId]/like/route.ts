import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../lib/auth"
import { prisma } from "../../../../../lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      )
    }

    const { commentId } = await params

    // Check if already liked
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: session.user?.id,
        commentId: commentId,
      },
    })

    if (existingLike) {
      // Unlike
      await prisma.like.delete({
        where: { id: existingLike.id },
      })

      const count = await prisma.like.count({
        where: { commentId },
      })

      return NextResponse.json({ liked: false, count })
    } else {
      // Like
      await prisma.like.create({
        data: {
          userId: session.user?.id,
          commentId: commentId,
        },
      })

      const count = await prisma.like.count({
        where: { commentId },
      })

      return NextResponse.json({ liked: true, count })
    }
  } catch (error) {
    console.error("Failed to toggle like:", error)
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    )
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { commentId } = await params

    const count = await prisma.like.count({
      where: { commentId },
    })

    let isLiked = false
    if (session?.user) {
      const like = await prisma.like.findFirst({
        where: {
          userId: session.user?.id,
          commentId,
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