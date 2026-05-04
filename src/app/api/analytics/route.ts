import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { prisma } from "../../../lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "AUTHOR")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const range = searchParams.get("range") || "30" // days

    const whereAuthor = session.user.role === "ADMIN" ? {} : { authorId: session.user.id }
    const sinceDate = new Date()
    sinceDate.setDate(sinceDate.getDate() - parseInt(range))

    // Fetch all stats in parallel
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      totalComments,
      totalLikes,
      recentPosts,
      topPosts,
      categoryStats,
      viewsOverTime,
      engagementData,
    ] = await Promise.all([
      // Total posts
      prisma.post.count({ where: whereAuthor }),
      
      // Published posts
      prisma.post.count({ where: { ...whereAuthor, status: "PUBLISHED" } }),
      
      // Draft posts
      prisma.post.count({ where: { ...whereAuthor, status: "DRAFT" } }),
      
      // Total views
      prisma.post.aggregate({
        _sum: { views: true },
        where: whereAuthor,
      }),
      
      // Total comments
      prisma.comment.count({
        where: { post: whereAuthor },
      }),
      
      // Total likes
      prisma.like.count({
        where: { post: whereAuthor },
      }),
      
      // Recent posts
      prisma.post.findMany({
        where: whereAuthor,
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          _count: { select: { comments: true, likes: true } },
        },
      }),
      
      // Top posts by views
      prisma.post.findMany({
        where: { ...whereAuthor, status: "PUBLISHED" },
        orderBy: { views: "desc" },
        take: 5,
        select: {
          title: true,
          slug: true,
          views: true,
          _count: { select: { likes: true, comments: true } },
        },
      }),
      
      // Category distribution
      prisma.category.findMany({
        include: {
          _count: {
            select: {
              posts: {
                where: whereAuthor,
              },
            },
          },
        },
      }),
      
      // Views over time (simplified - last 30 days)
      prisma.post.findMany({
        where: {
          ...whereAuthor,
          publishedAt: { gte: sinceDate },
        },
        select: {
          publishedAt: true,
          views: true,
        },
        orderBy: { publishedAt: "asc" },
      }),
      
      // Engagement rate (likes + comments per post)
      prisma.post.findMany({
        where: { ...whereAuthor, status: "PUBLISHED" },
        select: {
          title: true,
          _count: { select: { likes: true, comments: true } },
        },
      }),
    ])

    // Process views over time
    const viewsByDate = viewsOverTime.reduce((acc: any, post) => {
      const date = post.publishedAt?.toISOString().split("T")[0]
      if (date) {
        acc[date] = (acc[date] || 0) + post.views
      }
      return acc
    }, {})

    const viewsChartData = Object.entries(viewsByDate).map(([date, views]) => ({
      date,
      views,
    }))

    // Process engagement data
    const engagementMetrics = engagementData.map((post: any) => ({
      title: post.title.length > 30 ? post.title.substring(0, 30) + "..." : post.title,
      likes: post._count.likes,
      comments: post._count.comments,
      total: post._count.likes + post._count.comments,
    }))

    // Average engagement
    const avgEngagement = engagementData.length > 0
      ? (engagementData.reduce((sum: number, post: any) => 
          sum + post._count.likes + post._count.comments, 0) / engagementData.length).toFixed(1)
      : 0

    return NextResponse.json({
      overview: {
        totalPosts,
        publishedPosts,
        draftPosts,
        totalViews: totalViews._sum.views || 0,
        totalComments,
        totalLikes,
        avgEngagement,
      },
      topPosts,
      categoryStats: categoryStats.map(cat => ({
        name: cat.name,
        value: cat._count.posts,
        slug: cat.slug,
      })),
      viewsChartData,
      engagementMetrics,
      recentPosts: recentPosts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        status: post.status,
        views: post.views,
        createdAt: post.createdAt,
        comments: post._count.comments,
        likes: post._count.likes,
      })),
    })
  } catch (error) {
    console.error("Analytics error:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}