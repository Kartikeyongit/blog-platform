import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from "../components/providers/SessionProvider"
import { LayoutWrapper } from "../components/LayoutWrapper"
import "./globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "BlogPlatform - Discover Stories That Matter",
    template: "%s | BlogPlatform",
  },
  description: "A modern blog platform for sharing knowledge and ideas about technology, programming, and design.",
  keywords: ["blog", "technology", "programming", "web development", "design", "tutorials"],
  authors: [{ name: "BlogPlatform" }],
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "BlogPlatform",
    title: "BlogPlatform - Discover Stories That Matter",
    description: "A modern blog platform for sharing knowledge and ideas",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlogPlatform - Discover Stories That Matter",
    description: "A modern blog platform for sharing knowledge and ideas",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </SessionProvider>
      </body>
    </html>
  )
}