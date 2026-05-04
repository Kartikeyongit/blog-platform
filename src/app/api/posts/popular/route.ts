import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get("limit") || "5")
    const days = parseInt(searchParams.get("days") || "30")

    const sinceDate = new Date()
    sinceDate.setDate(sinceDate.getDate() - days)

    // Get posts with most likes in the last X days
    const posts = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: {
          gte: sinceDate,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        likes: {
          _count: "desc",
        },
      },
      take: limit,
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Failed to fetch popular posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch popular posts" },
      { status: 500 }
    )
  }
}