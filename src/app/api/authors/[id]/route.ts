import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        website: true,
        role: true,
        createdAt: true,
        posts: {
          where: {
            status: "PUBLISHED",
          },
          orderBy: {
            publishedAt: "desc",
          },
          include: {
            category: true,
            _count: {
              select: {
                comments: true,
                likes: true,
              },
            },
          },
        },
        _count: {
          select: {
            posts: true,
            comments: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "Author not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch author" },
      { status: 500 }
    )
  }
}