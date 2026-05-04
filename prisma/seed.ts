import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...\n');

  // Check if admin exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@blog.com' }
  });

  if (existingAdmin) {
    console.log('⚠️  Database already seeded. Skipping...');
    console.log('   To re-seed, first run: npx prisma db push --force-reset\n');
    return;
  }

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@blog.com' },
    update: {},
    create: {
      email: 'admin@blog.com',
      name: 'Admin User',
      password: adminPassword,
      role: Role.ADMIN,
      bio: 'Blog administrator and content manager',
      website: 'https://admin-blog.com',
    },
  });
  console.log('✅ Admin user created');

  // Create author user
  const authorPassword = await bcrypt.hash('author123', 12);
  const author = await prisma.user.upsert({
    where: { email: 'author@blog.com' },
    update: {},
    create: {
      email: 'author@blog.com',
      name: 'John Author',
      password: authorPassword,
      role: Role.AUTHOR,
      bio: 'Professional writer and blogger with 5 years of experience',
      website: 'https://johnauthor.dev',
    },
  });
  console.log('✅ Author user created');

  // Create reader
  const readerPassword = await bcrypt.hash('reader123', 12);
  const reader = await prisma.user.upsert({
    where: { email: 'reader@blog.com' },
    update: {},
    create: {
      email: 'reader@blog.com',
      name: 'Jane Reader',
      password: readerPassword,
      role: Role.READER,
    },
  });
  console.log('✅ Reader user created');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest tech news, reviews, and tutorials',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'web-development' },
      update: {},
      create: {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Frontend, backend, and full-stack development',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'design' },
      update: {},
      create: {
        name: 'Design',
        slug: 'design',
        description: 'UI/UX design, graphic design, and creative processes',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'programming' },
      update: {},
      create: {
        name: 'Programming',
        slug: 'programming',
        description: 'Programming languages, algorithms, and best practices',
      },
    }),
  ]);
  console.log(`✅ ${categories.length} categories created`);

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: { name: 'Next.js', slug: 'nextjs' },
    }),
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: { name: 'React', slug: 'react' },
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: { name: 'TypeScript', slug: 'typescript' },
    }),
    prisma.tag.upsert({
      where: { slug: 'tailwindcss' },
      update: {},
      create: { name: 'TailwindCSS', slug: 'tailwindcss' },
    }),
  ]);
  console.log(`✅ ${tags.length} tags created`);

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Getting Started with Next.js 16 - A Complete Guide',
        slug: 'getting-started-with-nextjs-16',
        content: `
          <h1>Getting Started with Next.js 16</h1>
          <p>Next.js 16 brings revolutionary features to the React ecosystem. In this comprehensive guide, we'll explore everything you need to know to get started.</p>
          
          <h2>What's New in Next.js 16?</h2>
          <p>The latest version introduces several game-changing features:</p>
          <ul>
            <li><strong>Enhanced Server Components</strong> - Better performance and smaller bundle sizes</li>
            <li><strong>Improved Routing</strong> - More intuitive file-based routing system</li>
            <li><strong>Built-in Optimizations</strong> - Automatic image, font, and script optimization</li>
            <li><strong>Streaming SSR</strong> - Progressive page loading for better UX</li>
          </ul>
          
          <h2>Setting Up Your First Project</h2>
          <p>Let's create a new Next.js project:</p>
          <pre><code>npx create-next-app@latest my-app --typescript --tailwind --app</code></pre>
          
          <p>This command sets up a new project with TypeScript and Tailwind CSS pre-configured.</p>
          
          <h2>Project Structure</h2>
          <p>Next.js 16 uses the app directory for routing. Here's a typical project structure:</p>
          <pre><code>
          my-app/
          ├── src/
          │   ├── app/
          │   │   ├── layout.tsx
          │   │   ├── page.tsx
          │   │   └── globals.css
          │   └── components/
          ├── public/
          └── package.json
          </code></pre>
          
          <h2>Conclusion</h2>
          <p>Next.js 16 is a powerful framework that makes building web applications a breeze. Start building today!</p>
        `,
        excerpt: 'Learn how to build modern web applications with Next.js 16 - the complete guide for beginners',
        status: 'PUBLISHED',
        featured: true,
        authorId: author.id,
        categoryId: categories[1].id,
        publishedAt: new Date(),
        readingTime: 8,
        tags: {
          create: [
            { tagId: tags[0].id },
            { tagId: tags[1].id },
            { tagId: tags[2].id },
          ]
        },
      },
    }),
    prisma.post.create({
      data: {
        title: 'Mastering TailwindCSS: Tips and Tricks',
        slug: 'mastering-tailwindcss-tips-and-tricks',
        content: `
          <h1>Mastering TailwindCSS</h1>
          <p>TailwindCSS has become the go-to CSS framework for modern web development. Let's explore some advanced tips and tricks.</p>
          
          <h2>Why TailwindCSS?</h2>
          <p>Utility-first CSS frameworks offer several advantages:</p>
          <ul>
            <li>Faster development speed</li>
            <li>Consistent design system</li>
            <li>Smaller production bundles</li>
            <li>Easy responsive design</li>
          </ul>
          
          <h2>Pro Tips</h2>
          <h3>1. Custom Configurations</h3>
          <p>Extend Tailwind with your design tokens:</p>
          <pre><code>
          module.exports = {
            theme: {
              extend: {
                colors: {
                  brand: {
                    primary: '#3B82F6',
                    secondary: '#10B981',
                  }
                }
              }
            }
          }
          </code></pre>
          
          <h3>2. Component Classes</h3>
          <p>Use @apply for reusable components:</p>
          <pre><code>
          .btn-primary {
            @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
          }
          </code></pre>
          
          <p>These tips will help you build faster and maintain cleaner code!</p>
        `,
        excerpt: 'Discover advanced TailwindCSS techniques to speed up your development workflow',
        status: 'PUBLISHED',
        featured: false,
        authorId: author.id,
        categoryId: categories[0].id,
        publishedAt: new Date(Date.now() - 86400000), // 1 day ago
        readingTime: 5,
        tags: {
          create: [
            { tagId: tags[3].id },
            { tagId: tags[1].id },
          ]
        },
      },
    }),
    prisma.post.create({
      data: {
        title: 'TypeScript Best Practices for 2026',
        slug: 'typescript-best-practices-2026',
        content: `
          <h1>TypeScript Best Practices for 2026</h1>
          <p>TypeScript continues to evolve. Here are the best practices you should follow in 2026.</p>
          
          <h2>1. Use Strict Mode</h2>
          <p>Always enable strict mode in your tsconfig.json:</p>
          <pre><code>
          {
            "compilerOptions": {
              "strict": true,
              "noUncheckedIndexedAccess": true
            }
          }
          </code></pre>
          
          <h2>2. Leverage Type Inference</h2>
          <p>Don't over-type. Let TypeScript infer types when possible.</p>
          
          <h2>3. Use Discriminated Unions</h2>
          <p>Create type-safe state management with discriminated unions.</p>
          
          <p>Following these practices will make your code more maintainable and less error-prone.</p>
        `,
        excerpt: 'Essential TypeScript best practices every developer should know in 2026',
        status: 'PUBLISHED',
        featured: false,
        authorId: author.id,
        categoryId: categories[3].id,
        publishedAt: new Date(Date.now() - 172800000), // 2 days ago
        readingTime: 6,
        tags: {
          create: [
            { tagId: tags[2].id },
          ]
        },
      },
    }),
  ]);
  console.log(`✅ ${posts.length} sample posts created\n`);

  console.log('📊 Seed Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 Users:');
  console.log(`   Admin:    admin@blog.com    (password: admin123)`);
  console.log(`   Author:   author@blog.com   (password: author123)`);
  console.log(`   Reader:   reader@blog.com   (password: reader123)`);
  console.log(`📂 Categories: ${categories.length}`);
  console.log(`🏷️  Tags: ${tags.length}`);
  console.log(`📝 Posts: ${posts.length}`);
  console.log('\n✅ Database seeded successfully!');
  console.log('🚀 Run "npm run dev" to start the application.\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });