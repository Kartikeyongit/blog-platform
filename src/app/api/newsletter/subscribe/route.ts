import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { sendWelcomeEmail } from "../../../../lib/email"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json()
    const session = await getServerSession(authOptions)

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      )
    }

    // Check if already subscribed
    const existingSub = await prisma.newsletterSub.findUnique({
      where: { email },
    })

    if (existingSub) {
      if (existingSub.active) {
        return NextResponse.json(
          { message: "You're already subscribed!", alreadySubscribed: true },
          { status: 200 }
        )
      } else {
        // Reactivate subscription
        await prisma.newsletterSub.update({
          where: { email },
          data: { active: true, confirmedAt: new Date() },
        })

        return NextResponse.json(
          { message: "Subscription reactivated!", reactivated: true },
          { status: 200 }
        )
      }
    }

    // Create new subscription
    const subscription = await prisma.newsletterSub.create({
      data: {
        email,
        active: true,
        confirmedAt: new Date(),
        userId: session?.user?.id || null,
      },
    })

    // Send welcome email in the background
    sendWelcomeEmail(email, name).catch(console.error)

    return NextResponse.json(
      { 
        message: "Successfully subscribed! Check your email.",
        subscription: {
          id: subscription.id,
          email: subscription.email,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    )
  }
}