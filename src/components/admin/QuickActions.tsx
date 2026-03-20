'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, FileText, FolderKanban, Palette } from 'lucide-react'

const actions = [
  { href: '/admin/projects/new', label: 'Add Project', icon: FolderKanban, variant: 'default' as const },
  { href: '/admin/blog/new', label: 'Write Blog Post', icon: FileText, variant: 'secondary' as const },
  { href: '/admin/theme', label: 'Customize Theme', icon: Palette, variant: 'outline' as const },
]

export function QuickActions() {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.href}
                variant={action.variant}
                className="justify-start gap-2"
                asChild
              >
                <Link href={action.href}>
                  <Icon className="h-4 w-4" />
                  {action.label}
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
