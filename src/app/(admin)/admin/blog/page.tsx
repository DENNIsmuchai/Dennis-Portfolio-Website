import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { BlogManager } from '@/components/admin/BlogManager'

export const metadata: Metadata = {
  title: 'Blog Manager | Portfolio Platform',
}

async function getBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  })
  
  // Transform posts to ensure tags is always an array
  return posts.map(post => ({
    ...post,
    tags: (typeof post.tags === 'string' && post.tags ? post.tags.split(',').map(t => t.trim()) : Array.isArray(post.tags) ? post.tags : []) as string[]
  }))
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blog Manager</h1>
        <p className="text-muted-foreground mt-2">
          Manage your blog posts and share your insights.
        </p>
      </div>

      <BlogManager initialPosts={posts} />
    </div>
  )
}
