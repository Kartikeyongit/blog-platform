import { Metadata } from "next"

type SeoProps = {
  title: string
  description?: string
  image?: string
  url?: string
  type?: "website" | "article"
  publishedAt?: string
  author?: string
  tags?: string[]
  category?: string
}

export function generateMetadata({
  title,
  description,
  image,
  url = process.env.NEXTAUTH_URL || "http://localhost:3000",
  type = "website",
  publishedAt,
  author,
  tags,
  category,
}: SeoProps): Metadata {
  const siteName = "BlogPlatform"
  const fullTitle = `${title} | ${siteName}`
  const defaultDescription = "A modern blog platform for sharing knowledge and ideas"
  const defaultImage = `${url}/og-image.jpg`

  return {
    title: fullTitle,
    description: description || defaultDescription,
    keywords: tags?.join(", ") || "blog, technology, programming",
    authors: author ? [{ name: author }] : undefined,
    openGraph: {
      title: fullTitle,
      description: description || defaultDescription,
      url: url,
      siteName: siteName,
      images: [
        {
          url: image || defaultImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: type,
      publishedTime: publishedAt,
      authors: author ? [author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: description || defaultDescription,
      images: [image || defaultImage],
    },
    alternates: {
      canonical: url,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export function generateArticleSchema({
  title,
  description,
  image,
  url,
  publishedAt,
  author,
  category,
  tags,
}: SeoProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: image,
    url: url,
    datePublished: publishedAt,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "BlogPlatform",
      logo: {
        "@type": "ImageObject",
        url: `${url}/logo.png`,
      },
    },
    keywords: tags?.join(", "),
    articleSection: category,
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}