import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const subscription = await prisma.newsletterSub.findUnique({
      where: { email },
    })

    if (!subscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      )
    }

    await prisma.newsletterSub.update({
      where: { email },
      data: { active: false },
    })

    return NextResponse.json(
      { message: "Successfully unsubscribed" }
    )
  } catch (error) {
    console.error("Unsubscribe error:", error)
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    )
  }
}