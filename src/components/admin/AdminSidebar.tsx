'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  LayoutDashboard,
  Globe,
  FolderKanban,
  FileText,
  GraduationCap,
  Award,
  Palette,
  BarChart3,
  FileUp,
  Settings,
  MessageSquare,
  User,
  Briefcase,
  Award as AwardIcon,
  Link as LinkIcon,
  Eye,
  MessageCircle,
  TrendingUp,
  FileStack,
  Bot,
  Image,
  Brain,
  Calendar,
  Users,
  Navigation,
} from 'lucide-react'

type NavItem = {
  href?: string
  label: string
  icon: React.ComponentType<any>
  items?: { href: string; label: string }[]
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/preview', label: 'Live Preview', icon: Eye },
  { 
    label: 'Content', 
    icon: FileStack,
    items: [
      { href: '/admin/navigation-manager', label: 'Navigation Manager' },
      { href: '/admin/pages', label: 'Page Builder' },
      { href: '/admin/navigation-tabs', label: 'Navigation Tabs' },
      { href: '/admin/projects', label: 'Projects' },
      { href: '/admin/blog', label: 'Blog' },
      { href: '/admin/currently-tracking', label: 'Currently Tracking' },
    ]
  },
  { href: '/admin/media-library', label: 'Media Library', icon: Image },
  { 
    label: 'AI', 
    icon: Bot,
    items: [
      { href: '/admin/ai-control', label: 'AI Control Panel' },
      { href: '/admin/custom-qa', label: 'Chat Q&A' },
      { href: '/admin/knowledge-base', label: 'Knowledge Base' },
    ]
  },
  { 
    label: 'Profile', 
    icon: User,
    items: [
      { href: '/admin/personal-info', label: 'Personal Info' },
      { href: '/admin/experience', label: 'Experience' },
      { href: '/admin/skills', label: 'Skills' },
      { href: '/admin/education', label: 'Education' },
      { href: '/admin/certifications', label: 'Certifications' },
      { href: '/admin/social-links', label: 'Social Links' },
    ]
  },
  { href: '/admin/resume', label: 'Resume', icon: FileUp },
  { href: '/admin/contact-messages', label: 'Messages', icon: MessageSquare },
  { href: '/admin/scheduling', label: 'Scheduling', icon: Calendar },
  { 
    label: 'Settings', 
    icon: Settings,
    items: [
      { href: '/admin/global-settings', label: 'Global Settings' },
      { href: '/admin/website-editor', label: 'Website Editor' },
      { href: '/admin/theme', label: 'Theme' },
      { href: '/admin/users', label: 'Users & Roles' },
    ]
  },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    )
  }

  return (
    <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r bg-card/50 backdrop-blur-xl overflow-y-auto">
      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          
          if (item.items) {
            const isExpanded = expandedGroups.includes(item.label)
            const hasActiveChild = item.items.some((child) => pathname === child.href)

            return (
              <div key={item.label}>
                <button
                  onClick={() => toggleGroup(item.label)}
                  className={cn(
                    'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    hasActiveChild || isExpanded
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isExpanded ? 'rotate-180' : ''
                    )}
                  />
                </button>
                {isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.items.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'block rounded-lg px-3 py-2.5 text-sm transition-all',
                          pathname === child.href
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
