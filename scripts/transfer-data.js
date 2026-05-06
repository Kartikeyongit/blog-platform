const { PrismaClient: LocalPrisma } = require('@prisma/client')

// Connect to local database
const localPrisma = new LocalPrisma({
  datasources: { db: { url: process.env.LOCAL_DB } }
})

// Connect to production database
const prodPrisma = new LocalPrisma({
  datasources: { db: { url: process.env.PROD_DB } }
})

async function transfer() {
  // Transfer Users
  const users = await localPrisma.user.findMany()
  for (const user of users) {
    await prodPrisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    })
  }
  console.log(`Transferred ${users.length} users`)

  // Transfer Categories
  const categories = await localPrisma.category.findMany()
  for (const cat of categories) {
    await prodPrisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
  }
  console.log(`Transferred ${categories.length} categories`)

  // Transfer Posts
  const posts = await localPrisma.post.findMany()
  for (const post of posts) {
    await prodPrisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    })
  }
  console.log(`Transferred ${posts.length} posts`)

  console.log('Transfer complete!')
}

transfer()
  .catch(console.error)
  .finally(() => process.exit())