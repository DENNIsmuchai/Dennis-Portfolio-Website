import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { StatsCards } from '@/components/admin/StatsCards'
import { RecentActivity } from '@/components/admin/RecentActivity'
import { QuickActions } from '@/components/admin/QuickActions'

export const metadata: Metadata = {
  title: 'Admin Dashboard | Portfolio Platform',
}

async function getStats() {
  const [
    projectsCount,
    blogPostsCount,
    skillsCount,
    experienceCount,
    messagesCount,
    totalViews,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.blogPost.count(),
    prisma.skill.count(),
    prisma.experience.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.project.aggregate({ _sum: { views: true } }),
  ])

  return {
    projects: projectsCount,
    blogPosts: blogPostsCount,
    skills: skillsCount,
    experience: experienceCount,
    unreadMessages: messagesCount,
    totalViews: totalViews._sum.views || 0,
  }
}

async function getRecentActivity() {
  const recentProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      updatedAt: true,
    },
  })

  const recentBlogPosts = await prisma.blogPost.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      updatedAt: true,
    },
  })

  return [
    ...recentProjects.map(p => ({
      type: 'project' as const,
      title: p.title,
      date: p.updatedAt,
    })),
    ...recentBlogPosts.map(b => ({
      type: 'blog' as const,
      title: b.title,
      date: b.updatedAt,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5)
}

export default async function AdminDashboardPage() {
  const stats = await getStats()
  const recentActivity = await getRecentActivity()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here&apos;s what&apos;s happening with your portfolio.
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentActivity activities={recentActivity} />
        <QuickActions />
      </div>
    </div>
  )
}
