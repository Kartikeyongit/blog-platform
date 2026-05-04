import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../../../lib/auth"
import { prisma } from "../../../../../../lib/prisma"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    const userRole = (session?.user as any)?.role
    if (!session || userRole !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { role } = await req.json()

    if (!["READER", "AUTHOR", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    const userId = (session?.user as any)?.id
    if (id === userId) {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 })
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    return NextResponse.json({ message: `User role updated to ${role}`, user })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
  }
}