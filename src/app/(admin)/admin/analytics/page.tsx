'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Eye, Users, TrendingUp, BarChart3 } from 'lucide-react'

interface AnalyticsData {
  pageViews: { page: string; _count: { id: number } }[]
  uniqueVisitors: number
  dailyStats: { date: string; views: number; visitors: number }[]
  popularProjects: { id: string; title: string; views: number }[]
  totalViews: number
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [days, setDays] = useState(30)

  useEffect(() => {
    fetchAnalytics()
  }, [days])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?days=${days}`)
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track your portfolio performance and visitor statistics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-3xl font-bold">{analytics?.totalViews.toLocaleString() || 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Unique Visitors</p>
                  <p className="text-3xl font-bold">{analytics?.uniqueVisitors.toLocaleString() || 0}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/10">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Views/Day</p>
                  <p className="text-3xl font-bold">
                    {analytics?.dailyStats.length
                      ? Math.round(analytics.totalViews / analytics.dailyStats.length)
                      : 0}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-accent/10">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Top Page</p>
                  <p className="text-lg font-bold truncate max-w-[120px]">
                    {analytics?.pageViews[0]?.page || 'N/A'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <BarChart3 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="pages" className="space-y-6">
        <TabsList className="glass">
          <TabsTrigger value="pages">Page Views</TabsTrigger>
          <TabsTrigger value="projects">Popular Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Page Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics?.pageViews.map((page) => (
                  <div
                    key={page.page}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <span className="font-medium capitalize">{page.page}</span>
                    <Badge variant="secondary">{page._count.id} views</Badge>
                  </div>
                ))}
                {!analytics?.pageViews.length && (
                  <p className="text-muted-foreground text-center py-8">
                    No page view data yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Popular Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics?.popularProjects.map((project, index) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">#{index + 1}</span>
                      <span className="font-medium">{project.title}</span>
                    </div>
                    <Badge variant="secondary">{project.views} views</Badge>
                  </div>
                ))}
                {!analytics?.popularProjects.length && (
                  <p className="text-muted-foreground text-center py-8">
                    No project view data yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
