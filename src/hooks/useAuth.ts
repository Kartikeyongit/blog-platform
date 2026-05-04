// src/hooks/useAuth.ts
"use client"

import { useSession } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  return {
    user: session?.user,
    isLoggedIn: !!session,
    isLoading: status === "loading",
    isAdmin: session?.user?.role === "ADMIN",
    isAuthor: session?.user?.role === "AUTHOR",
    isReader: session?.user?.role === "READER",
  }
}