'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar, Clock, Plus, Trash2, Edit, Play, Pause, CalendarDays } from 'lucide-react'

interface ScheduledContent {
  id: string
  contentType: string
  contentId: string
  title: string
  action: string
  scheduledFor: string
  timezone: string
  isExecuted: boolean
  recurrence: string | null
  createdAt: string
}

const contentTypes = [
  { value: 'project', label: 'Project' },
  { value: 'blog', label: 'Blog Post' },
  { value: 'page', label: 'Custom Page' },
  { value: 'section', label: 'Section' },
]

const actions = [
  { value: 'publish', label: 'Publish' },
  { value: 'unpublish', label: 'Unpublish' },
  { value: 'archive', label: 'Archive' },
]

export default function SchedulingPage() {
  const [scheduledItems, setScheduledItems] = useState<ScheduledContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    contentType: '',
    contentId: '',
    title: '',
    action: 'publish',
    scheduledFor: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    recurrence: '',
  })

  useEffect(() => {
    fetchScheduled()
  }, [])

  const fetchScheduled = async () => {
    try {
      const response = await fetch('/api/scheduling')
      if (response.ok) {
        const data = await response.json()
        setScheduledItems(data)
      }
    } catch (error) {
      console.error('Error fetching scheduled content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/scheduling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      })

      if (response.ok) {
        setIsCreateOpen(false)
        setNewItem({
          contentType: '',
          contentId: '',
          title: '',
          action: 'publish',
          scheduledFor: '',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          recurrence: '',
        })
        fetchScheduled()
      }
    } catch (error) {
      console.error('Error creating scheduled content:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/scheduling?id=${id}`, { method: 'DELETE' })
      fetchScheduled()
    } catch (error) {
      console.error('Error deleting scheduled content:', error)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleString()
  }

  const getStatusBadge = (item: ScheduledContent) => {
    if (item.isExecuted) {
      return <Badge variant="default" className="bg-green-500">Executed</Badge>
    }
    const scheduledDate = new Date(item.scheduledFor)
    const now = new Date()
    if (scheduledDate <= now) {
      return <Badge variant="default" className="bg-yellow-500">Pending</Badge>
    }
    return <Badge variant="outline">Scheduled</Badge>
  }

  // Group items by month
  const groupedItems = scheduledItems.reduce((acc, item) => {
    const month = new Date(item.scheduledFor).toLocaleString('default', { month: 'long', year: 'numeric' })
    if (!acc[month]) acc[month] = []
    acc[month].push(item)
    return acc
  }, {} as Record<string, ScheduledContent[]>)

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Scheduling</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Schedule content publication and archival
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Schedule Content
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Content</DialogTitle>
                <DialogDescription>
                  Set when content should be published or archived
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Content Title</Label>
                  <Input
                    id="title"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    placeholder="Enter content title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contentType">Content Type</Label>
                    <select
                      id="contentType"
                      value={newItem.contentType}
                      onChange={(e) => setNewItem({ ...newItem, contentType: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="">Select type</option>
                      {contentTypes.map(ct => (
                        <option key={ct.value} value={ct.value}>{ct.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="action">Action</Label>
                    <select
                      id="action"
                      value={newItem.action}
                      onChange={(e) => setNewItem({ ...newItem, action: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      {actions.map(a => (
                        <option key={a.value} value={a.value}>{a.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledFor">Schedule For</Label>
                  <Input
                    id="scheduledFor"
                    type="datetime-local"
                    value={newItem.scheduledFor}
                    onChange={(e) => setNewItem({ ...newItem, scheduledFor: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    value={newItem.timezone}
                    onChange={(e) => setNewItem({ ...newItem, timezone: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="Europe/London">London</option>
                    <option value="Europe/Paris">Paris</option>
                    <option value="Asia/Tokyo">Tokyo</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Schedule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{scheduledItems.filter(i => !i.isExecuted).length}</p>
                  <p className="text-sm text-gray-500">Scheduled</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Play className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{scheduledItems.filter(i => i.isExecuted).length}</p>
                  <p className="text-sm text-gray-500">Executed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {scheduledItems.filter(i => !i.isExecuted && new Date(i.scheduledFor) <= new Date()).length}
                  </p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <CalendarDays className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {new Set(scheduledItems.map(i => new Date(i.scheduledFor).toDateString())).size}
                  </p>
                  <p className="text-sm text-gray-500">Active Days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {Object.keys(groupedItems).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedItems).map(([month, items]) => (
              <div key={month}>
                <h2 className="text-lg font-semibold mb-4">{month}</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{item.title}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <Badge variant="outline">{item.contentType}</Badge>
                                <Badge variant="outline">{item.action}</Badge>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(item.scheduledFor)}
                                </span>
                                <span className="text-xs text-gray-400">{item.timezone}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(item)}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Scheduled Item</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this scheduled item?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-red-600">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No scheduled content</h3>
            <p className="text-gray-500 mb-4">Schedule your first content to see it here</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Schedule Content
            </Button>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
