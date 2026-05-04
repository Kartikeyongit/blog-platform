import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../../../lib/auth"
import SubscriberList from "../../../components/dashboard/SubscriberList"

export default async function SubscribersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Newsletter Subscribers</h1>
        <p className="text-gray-600 mt-2">Manage your newsletter subscribers</p>
      </div>

      <SubscriberList />
    </div>
  )
}