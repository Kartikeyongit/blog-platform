import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { prisma } from "../../../lib/prisma"
import { redirect } from "next/navigation"
import CommentModeration from "../../../components/dashboard/CommentModeration"

export default async function CommentsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true, email: true, image: true },
      },
      post: {
        select: { title: true, slug: true },
      },
    },
    take: 50,
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Comment Moderation</h1>
        <p className="text-gray-600 mt-2">Manage and moderate comments</p>
      </div>

      <CommentModeration initialComments={comments} />
    </div>
  )
}