# BlogPlatform

A modern, full-featured blog platform built with Next.js, Prisma, and PostgreSQL.

## 🚀 Live Demo

[https://blog-platform.vercel.app](https://blog-platform-iqtiqmjjy-kartikey-gautams-projects.vercel.app)

## ✨ Features

### 📝 Content Management
- **Rich Text Editor** - Markdown editor with live preview, image upload, and formatting toolbar
- **Draft Auto-Save** - Never lose your work with automatic localStorage saving
- **Post Management** - Create, edit, delete, and feature posts
- **Categories & Tags** - Organize content with categories and technology tags
- **Cover Images** - Upload cover images for posts

### 👥 User System
- **Authentication** - Secure login/register with NextAuth.js
- **Role-Based Access** - Admin, Author, and Reader roles
- **User Profiles** - Customizable profiles with image upload
- **Author Pages** - Public profiles showing author's posts
- **User Management** - Admin can promote users to authors

### 💬 Engagement
- **Comment System** - Nested replies with like functionality
- **Post Likes** - Like/unlike posts with optimistic UI updates
- **Bookmarks** - User-specific reading list (localStorage)
- **Newsletter** - Email subscription with Resend integration

### 📊 Analytics & SEO
- **Analytics Dashboard** - Charts for views, engagement, and category distribution
- **SEO Optimization** - Dynamic meta tags, Open Graph, Twitter Cards
- **Sitemap** - Auto-generated sitemap.xml
- **Structured Data** - JSON-LD schema for articles

### 🎨 UI/UX
- **Responsive Design** - Mobile-first, works on all devices
- **Modern UI** - Clean, professional design with animations
- **Loading States** - Skeleton loaders for better UX

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 16](https://nextjs.org/) | Frontend & Backend Framework |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety |
| [TailwindCSS](https://tailwindcss.com/) | Styling |
| [Prisma](https://www.prisma.io/) | ORM |
| [PostgreSQL](https://www.postgresql.org/) | Database |
| [NextAuth.js](https://next-auth.js.org/) | Authentication |
| [MDEditor](https://uiwjs.github.io/react-md-editor/) | Rich Text Editor |
| [Recharts](https://recharts.org/) | Analytics Charts |
| [Resend](https://resend.com/) | Email Service |
| [Uploadthing](https://uploadthing.com/) | File Storage |
| [Vercel](https://vercel.com/) | Hosting |
| [Neon](https://neon.tech/) | Database Hosting |

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Resend API key (for newsletter)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/blog-platform.git
cd blog-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/blog_platform"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
RESEND_API_KEY="re_your_key"
```

4. **Set up the database**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

5. **Start the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Test Accounts (after seeding)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@blog.com | admin123 |
| Author | author@blog.com | author123 |
| Reader | reader@blog.com | reader123 |

## 🚀 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Set environment variables
4. Deploy

### Database

Use [Neon](https://neon.tech) for a free PostgreSQL database with connection pooling.

**Build Command:**
```
npx prisma generate && npx prisma db push --accept-data-loss && next build
```

## 📁 Project Structure

```
blog-platform/
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Seed data
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── api/           # API routes
│   │   ├── blog/          # Blog post pages
│   │   ├── dashboard/     # Admin dashboard
│   │   ├── login/         # Login page
│   │   ├── profile/       # User profile
│   │   └── search/        # Search page
│   ├── components/        # React components
│   │   ├── blog/          # Blog components
│   │   ├── comments/      # Comment components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── ui/            # UI components
│   │   └── providers/     # Context providers
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript types
├── public/                # Static assets
├── .env.local             # Environment variables
├── next.config.ts         # Next.js config
├── tailwind.config.ts     # Tailwind config
└── package.json
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_URL` | Your site URL | Yes |
| `NEXTAUTH_SECRET` | Random secret for auth | Yes |
| `RESEND_API_KEY` | Resend API key for emails | Optional |
| `UPLOADTHING_SECRET` | Uploadthing secret | Optional |

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [TailwindCSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Lucide Icons](https://lucide.dev/)
- [Recharts](https://recharts.org/)
