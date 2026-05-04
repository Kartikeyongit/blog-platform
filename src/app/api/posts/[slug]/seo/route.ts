import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../lib/auth"
import { prisma } from "../../../../../lib/prisma"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "AUTHOR")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { slug } = await params
    const { title, description, keywords, ogImage } = await req.json()

    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true, authorId: true },
    })

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    // Check if user is the author or admin
    if (session.user.role !== "ADMIN" && post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const seo = await prisma.sEO.upsert({
      where: { postId: post.id },
      update: {
        title,
        description,
        keywords,
        ogImage,
      },
      create: {
        title,
        description,
        keywords,
        ogImage,
        postId: post.id,
      },
    })

    return NextResponse.json(seo)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update SEO settings" },
      { status: 500 }
    )
  }
}