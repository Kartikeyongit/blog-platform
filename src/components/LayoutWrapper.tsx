"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import Navbar from "./Navbar"
import Newsletter from "./Newsletter"
import { useSession } from "next-auth/react"

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith("/dashboard")

  return (
    <>
      {!isDashboard && <Navbar />}
      <main className={!isDashboard ? "pt-16" : ""}>
        {children}
      </main>
      {!isDashboard && (
        <>
          <Footer />
        </>
      )}
    </>
  )
}

function Footer() {
  const { data: session } = useSession()

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="text-center lg:text-left">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              BlogPlatform
            </h3>
            <p className="text-sm text-gray-600 max-w-[200px] mx-auto lg:mx-0">
              A modern platform for sharing knowledge and connecting with readers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center lg:text-left">
            <h4 className="font-semibold text-gray-900 mb-3">Quick Links</h4>
            <div className="space-y-1.5 text-sm text-gray-600 inline-flex flex-col items-center lg:items-start">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <Link href="/search" className="hover:text-blue-600 transition-colors">Explore</Link>
              {!session && (
                <>
                  <Link href="/login" className="hover:text-blue-600 transition-colors">Sign In</Link>
                  <Link href="/register" className="hover:text-blue-600 transition-colors">Register</Link>
                </>
              )}
              {session && (
                <>
                  <Link href="/bookmarks" className="hover:text-blue-600 transition-colors">Saved Posts</Link>
                  <Link href="/profile" className="hover:text-blue-600 transition-colors">Profile</Link>
                </>
              )}
            </div>
          </div>

          {/* Categories */}
          <div className="text-center lg:text-left">
            <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
            <div className="space-y-1.5 text-sm text-gray-600 inline-flex flex-col items-center lg:items-start">
              <Link href="/category/technology" className="hover:text-blue-600 transition-colors">Technology</Link>
              <Link href="/category/web-development" className="hover:text-blue-600 transition-colors">Web Development</Link>
              <Link href="/category/design" className="hover:text-blue-600 transition-colors">Design</Link>
              <Link href="/category/programming" className="hover:text-blue-600 transition-colors">Programming</Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="text-center lg:text-left">
            <h4 className="font-semibold text-gray-900 mb-3">Newsletter</h4>
            <p className="text-sm text-gray-600 mb-3 max-w-[200px] mx-auto lg:mx-0">
              Get weekly updates on new posts and features.
            </p>
            <Newsletter variant="footer" />
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2026 BlogPlatform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}