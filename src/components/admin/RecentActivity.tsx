import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderKanban, FileText, Clock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Activity {
  type: 'project' | 'blog'
  title: string
  date: Date
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-muted-foreground text-sm">No recent activity</p>
          ) : (
            activities.map((activity, index) => {
              const Icon = activity.type === 'project' ? FolderKanban : FileText
              return (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.type === 'project' ? 'Project' : 'Blog post'} updated{' '}
                      {formatDistanceToNow(activity.date, { addSuffix: true })}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
