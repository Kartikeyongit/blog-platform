"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface UserProfile {
  image?: string | null
  name?: string | null
  email?: string | null
}

export function useUser() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    if (session?.user) {
      fetch("/api/user/profile")
        .then(res => res.json())
        .then(data => setProfile(data))
        .catch(() => setProfile(null))
    }
  }, [session])

  return {
    ...session?.user,
    image: profile?.image || null,
    name: profile?.name || session?.user?.name,
  }
}