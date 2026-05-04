import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: "asc" }
    })
    return NextResponse.json(tags)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const { name } = await req.json()
    
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Tag name required" }, { status: 400 })
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name: name.trim(), slug },
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 })
  }
}