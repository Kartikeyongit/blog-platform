import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { commentId } = await params
    const { status } = await req.json()

    if (!["PENDING", "APPROVED", "SPAM"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    const comment = await prisma.comment.update({
      where: { id: commentId },
      data: { status },
    })

    return NextResponse.json(comment)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    )
  }
}