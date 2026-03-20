import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderKanban, FileText, Award, Briefcase, Mail, Eye } from 'lucide-react'

interface StatsCardsProps {
  stats: {
    projects: number
    blogPosts: number
    skills: number
    experience: number
    unreadMessages: number
    totalViews: number
  }
}

const statsConfig = [
  { key: 'projects', label: 'Projects', icon: FolderKanban, color: 'text-blue-500' },
  { key: 'blogPosts', label: 'Blog Posts', icon: FileText, color: 'text-purple-500' },
  { key: 'skills', label: 'Skills', icon: Award, color: 'text-green-500' },
  { key: 'experience', label: 'Experience', icon: Briefcase, color: 'text-orange-500' },
  { key: 'unreadMessages', label: 'Unread Messages', icon: Mail, color: 'text-red-500' },
  { key: 'totalViews', label: 'Total Views', icon: Eye, color: 'text-cyan-500' },
] as const

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {statsConfig.map((stat) => {
        const Icon = stat.icon
        const value = stats[stat.key as keyof typeof stats]
        return (
          <Card key={stat.key} className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value.toLocaleString()}</div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
