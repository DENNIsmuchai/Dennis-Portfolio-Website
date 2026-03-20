'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Trash2, Plus, GripVertical, Edit, Eye, EyeOff, ExternalLink, BookOpen, FileText, Settings, Link as LinkIcon } from 'lucide-react'

interface NavigationTab {
  id: string
  title: string
  slug: string
  icon: string | null
  contentType: string
  content: string | null
  externalUrl: string | null
  order: number
  isVisible: boolean
  isActive: boolean
}

const contentTypes = [
  { value: 'text', label: 'Text Content', icon: FileText, description: 'Free-form text content' },
  { value: 'qa', label: 'Q&A Section', icon: BookOpen, description: 'Questions and answers' },
  { value: 'custom', label: 'Custom Data', icon: Settings, description: 'JSON/custom data' },
  { value: 'link', label: 'External Link', icon: LinkIcon, description: 'Link to external URL' },
]

const iconOptions = [
  { value: 'book', label: 'Book' },
  { value: 'file-text', label: 'File Text' },
  { value: 'settings', label: 'Settings' },
  { value: 'link', label: 'Link' },
  { value: 'chart', label: 'Chart' },
  { value: 'users', label: 'Users' },
  { value: 'star', label: 'Star' },
  { value: 'heart', label: 'Heart' },
  { value: 'search', label: 'Search' },
  { value: 'folder', label: 'Folder' },
  { value: 'briefcase', label: 'Briefcase' },
  { value: 'graduation-cap', label: 'Graduation' },
]

export default function NavigationTabsPage() {
  const [tabs, setTabs] = useState<NavigationTab[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTab, setEditingTab] = useState<NavigationTab | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    icon: '',
    contentType: 'text',
    content: '',
    externalUrl: '',
    isVisible: true,
    isActive: true,
  })

  useEffect(() => {
    fetchTabs()
  }, [])

  const fetchTabs = async () => {
    try {
      const response = await fetch('/api/navigation-tabs')
      if (response.ok) {
        const data = await response.json()
        setTabs(data)
      }
    } catch (error) {
      console.error('Error fetching tabs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const url = editingTab 
        ? `/api/navigation-tabs/${editingTab.id}`
        : '/api/navigation-tabs'
      const method = editingTab ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsDialogOpen(false)
        resetForm()
        fetchTabs()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save tab')
      }
    } catch (error) {
      console.error('Error saving tab:', error)
    }
  }

  const handleEdit = (tab: NavigationTab) => {
    setEditingTab(tab)
    setFormData({
      title: tab.title,
      slug: tab.slug,
      icon: tab.icon || '',
      contentType: tab.contentType,
      content: tab.content || '',
      externalUrl: tab.externalUrl || '',
      isVisible: tab.isVisible,
      isActive: tab.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/navigation-tabs/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchTabs()
      }
    } catch (error) {
      console.error('Error deleting tab:', error)
    }
  }

  const handleToggleVisibility = async (tab: NavigationTab) => {
    try {
      await fetch(`/api/navigation-tabs/${tab.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !tab.isVisible }),
      })
      fetchTabs()
    } catch (error) {
      console.error('Error toggling visibility:', error)
    }
  }

  const resetForm = () => {
    setEditingTab(null)
    setFormData({
      title: '',
      slug: '',
      icon: '',
      contentType: 'text',
      content: '',
      externalUrl: '',
      isVisible: true,
      isActive: true,
    })
  }

  const openNewTabDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const getContentTypeInfo = (type: string) => {
    return contentTypes.find(t => t.value === type) || contentTypes[0]
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Navigation Tabs</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Add custom tabs to your navigation menu
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button onClick={openNewTabDialog}>
                <Plus className="mr-2 h-4 w-4" /> Add Tab
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTab ? 'Edit Navigation Tab' : 'Create Navigation Tab'}
                </DialogTitle>
                <DialogDescription>
                  {editingTab 
                    ? 'Update the tab details below'
                    : 'Add a new custom tab to your navigation menu'
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tab Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          title: e.target.value,
                          slug: editingTab ? formData.slug : e.target.value.toLowerCase().replace(/\s+/g, '-')
                        })
                      }}
                      placeholder="e.g., Research, Portfolio, Blog"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL Slug</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="research"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Content Type</Label>
                    <Select
                      value={formData.contentType}
                      onValueChange={(value) => setFormData({ ...formData, contentType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select
                      value={formData.icon}
                      onValueChange={(value) => setFormData({ ...formData, icon: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            {icon.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.contentType === 'link' && (
                  <div className="space-y-2">
                    <Label>External URL</Label>
                    <Input
                      value={formData.externalUrl}
                      onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                )}

                {(formData.contentType === 'text' || formData.contentType === 'custom') && (
                  <div className="space-y-2">
                    <Label>
                      {formData.contentType === 'text' ? 'Content (Markdown supported)' : 'Custom Data (JSON)'}
                    </Label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder={formData.contentType === 'text' 
                        ? 'Enter your content here... (Markdown supported)'
                        : '{"key": "value", ...}'
                      }
                      rows={6}
                    />
                  </div>
                )}

                {formData.contentType === 'qa' && (
                  <div className="space-y-2">
                    <Label>Q&A Content (JSON format)</Label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder='[{"question": "What is...", "answer": "It is..."}]'
                      rows={6}
                    />
                    <p className="text-sm text-muted-foreground">
                      Add Q&A items in the Custom Q&A section, or enter JSON array here
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.isVisible}
                      onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                    />
                    <Label>Visible in Navigation</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    />
                    <Label>Active</Label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit}>
                  {editingTab ? 'Save Changes' : 'Create Tab'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Info Card */}
        <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-300">Dynamic Navigation Tabs</h3>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                  Create custom tabs that appear in your site's navigation menu. 
                  Each tab can display different content types - text, Q&A, custom data, or link to external sites.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs List */}
        {tabs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No navigation tabs yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first custom tab to add it to the navigation menu
              </p>
              <Button onClick={openNewTabDialog}>
                <Plus className="mr-2 h-4 w-4" /> Create Tab
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {tabs.map((tab) => {
              const contentTypeInfo = getContentTypeInfo(tab.contentType)
              const ContentTypeIcon = contentTypeInfo.icon
              
              return (
                <Card key={tab.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="cursor-move text-gray-400 hover:text-gray-600">
                        <GripVertical className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{tab.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            <ContentTypeIcon className="h-3 w-3 mr-1" />
                            {contentTypeInfo.label}
                          </Badge>
                          {!tab.isVisible && (
                            <Badge variant="secondary" className="text-xs">
                              Hidden
                            </Badge>
                          )}
                          {!tab.isActive && (
                            <Badge variant="destructive" className="text-xs">
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          /{tab.slug}
                          {tab.externalUrl && (
                            <span className="ml-2 text-blue-500">
                              → {tab.externalUrl}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleVisibility(tab)}
                          title={tab.isVisible ? 'Hide from navigation' : 'Show in navigation'}
                        >
                          {tab.isVisible ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(tab)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Tab</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{tab.title}"? 
                                This will remove it from the navigation menu. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(tab.id)} 
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
