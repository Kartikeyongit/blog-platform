import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../../lib/auth"
import DashboardSidebar from "../../components/dashboard/DashboardSidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (session.user?.role !== "ADMIN" && session.user?.role !== "AUTHOR") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar user={session.user} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}