import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/analytics - Get analytics data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get page views
    const pageViews = await prisma.analytics.groupBy({
      by: ['page'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        id: true,
      },
    })

    // Get unique visitors
    const uniqueVisitors = await prisma.analytics.groupBy({
      by: ['visitorId'],
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    })

    // Get daily stats
    const dailyStats = await prisma.$queryRaw`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as views,
        COUNT(DISTINCT visitor_id) as visitors
      FROM analytics
      WHERE created_at >= ${startDate}
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `

    // Get popular projects
    const popularProjects = await prisma.project.findMany({
      orderBy: { views: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        views: true,
      },
    })

    return NextResponse.json({
      pageViews,
      uniqueVisitors: uniqueVisitors.length,
      dailyStats,
      popularProjects,
      totalViews: pageViews.reduce((sum, p) => sum + p._count.id, 0),
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

// POST /api/analytics - Track a page view
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const analytics = await prisma.analytics.create({
      data: {
        page: data.page,
        visitorId: data.visitorId,
        sessionId: data.sessionId,
        userAgent: data.userAgent,
        referrer: data.referrer,
        country: data.country,
        city: data.city,
      },
    })

    return NextResponse.json(analytics, { status: 201 })
  } catch (error) {
    console.error('Error tracking analytics:', error)
    return NextResponse.json(
      { error: 'Failed to track analytics' },
      { status: 500 }
    )
  }
}
