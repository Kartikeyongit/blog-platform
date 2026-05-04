import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../../../lib/auth"
import AnalyticsDashboard from "../../../components/dashboard/AnalyticsDashboard"

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-2">Track your blog performance and engagement</p>
      </div>

      <AnalyticsDashboard />
    </div>
  )
}