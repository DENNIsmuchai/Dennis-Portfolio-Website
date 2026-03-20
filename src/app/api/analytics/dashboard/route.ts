import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const type = searchParams.get('type') || 'overview'

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const end = endDate ? new Date(endDate) : new Date()

    if (type === 'overview') {
      // Get daily stats for the period
      const dailyStats = await prisma.dailyStats.findMany({
        where: {
          date: { gte: start, lte: end }
        },
        orderBy: { date: 'asc' }
      })

      // Calculate totals
      const totals = dailyStats.reduce((acc, day) => ({
        pageViews: acc.pageViews + day.pageViews,
        uniqueVisitors: acc.uniqueVisitors + day.uniqueVisitors,
        sessions: acc.sessions + day.sessions,
        aiQueries: acc.aiQueries + day.aiQueries,
        contactSubmits: acc.contactSubmits + day.contactSubmits,
      }), { pageViews: 0, uniqueVisitors: 0, sessions: 0, aiQueries: 0, contactSubmits: 0 })

      // Calculate average session duration
      const avgDuration = dailyStats.length > 0 
        ? dailyStats.reduce((acc, day) => acc + day.avgDuration, 0) / dailyStats.length 
        : 0

      // Get previous period for comparison
      const prevStart = new Date(start.getTime() - (end.getTime() - start.getTime()))
      const prevEnd = new Date(start.getTime() - 1)
      
      const prevStats = await prisma.dailyStats.findMany({
        where: { date: { gte: prevStart, lte: prevEnd } }
      })

      const prevTotals = prevStats.reduce((acc, day) => ({
        pageViews: acc.pageViews + day.pageViews,
        uniqueVisitors: acc.uniqueVisitors + day.uniqueVisitors,
      }), { pageViews: 0, uniqueVisitors: 0 })

      // Calculate growth
      const pageViewsGrowth = prevTotals.pageViews > 0 
        ? ((totals.pageViews - prevTotals.pageViews) / prevTotals.pageViews) * 100 
        : 0

      const visitorsGrowth = prevTotals.uniqueVisitors > 0 
        ? ((totals.uniqueVisitors - prevTotals.uniqueVisitors) / prevTotals.uniqueVisitors) * 100 
        : 0

      return NextResponse.json({
        totals,
        dailyStats,
        avgDuration,
        growth: { pageViews: pageViewsGrowth, visitors: visitorsGrowth }
      })
    }

    if (type === 'geography') {
      const events = await prisma.analyticsEvent.findMany({
        where: {
          createdAt: { gte: start, lte: end },
          country: { not: null }
        },
        select: { country: true, city: true },
        distinct: ['visitorId']
      })

      const countryCount: Record<string, number> = {}
      const cityCount: Record<string, number> = {}

      events.forEach(event => {
        if (event.country) {
          countryCount[event.country] = (countryCount[event.country] || 0) + 1
        }
        if (event.city) {
          cityCount[event.city] = (cityCount[event.city] || 0) + 1
        }
      })

      const topCountries = Object.entries(countryCount)
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      const topCities = Object.entries(cityCount)
        .map(([city, count]) => ({ city, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      return NextResponse.json({ topCountries, topCities })
    }

    if (type === 'sources') {
      const events = await prisma.analyticsEvent.findMany({
        where: { createdAt: { gte: start, lte: end } },
        select: { referrer: true }
      })

      const sources: Record<string, number> = { direct: 0 }
      
      events.forEach(event => {
        if (!event.referrer || event.referrer === '') {
          sources.direct = (sources.direct || 0) + 1
        } else {
          try {
            const url = new URL(event.referrer)
            const domain = url.hostname.replace('www.', '')
            sources[domain] = (sources[domain] || 0) + 1
          } catch {
            sources.direct = (sources.direct || 0) + 1
          }
        }
      })

      const topSources = Object.entries(sources)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      return NextResponse.json(topSources)
    }

    if (type === 'projects') {
      const projects = await prisma.project.findMany({
        select: { id: true, title: true, views: true }
      })

      const sortedProjects = projects
        .map(p => ({ id: p.id, title: p.title, views: p.views }))
        .sort((a, b) => b.views - a.views)

      return NextResponse.json(sortedProjects)
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
