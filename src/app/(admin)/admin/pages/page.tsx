'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MoreVertical, Plus, Pencil, Trash2, Eye, ExternalLink, GripVertical, Layout, Settings } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface CustomPage {
  id: string
  title: string
  slug: string
  description: string | null
  isPublished: boolean
  showInNav: boolean
  navLabel: string | null
  navOrder: number
  sections: PageSection[]
  createdAt: string
  updatedAt: string
}

interface PageSection {
  id: string
  sectionType: string
  title: string | null
  content: string | null
  order: number
  layoutStyle: string
  isVisible: boolean
}

const sectionTypes = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'quantum_hero', label: 'Quantum Hero' },
  { value: 'about', label: 'About Me' },
  { value: 'projects', label: 'Projects Showcase' },
  { value: 'skills', label: 'Skills Display' },
  { value: 'experience', label: 'Experience' },
  { value: 'education', label: 'Education' },
  { value: 'blog', label: 'Blog Posts' },
  { value: 'contact', label: 'Contact' },
  { value: 'currently_tracking', label: 'Currently Tracking' },
  { value: 'custom', label: 'Custom Content' },
  { value: 'video', label: 'Video Gallery' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'cta', label: 'Call to Action' },
]

const layoutStyles = [
  { value: 'default', label: 'Default' },
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'masonry', label: 'Masonry' },
  { value: 'split', label: 'Split View' },
]

export default function PagesPage() {
  const [pages, setPages] = useState<CustomPage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null)
  const [newPage, setNewPage] = useState({
    title: '',
    slug: '',
    description: '',
    navLabel: '',
    showInNav: false,
  })

  useEffect(() => {
    fetchPages()
  }, [])

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/custom-pages')
      if (response.ok) {
        const data = await response.json()
        setPages(data)
      }
    } catch (error) {
      console.error('Error fetching pages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePage = async () => {
    try {
      const response = await fetch('/api/custom-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPage,
          navLabel: newPage.navLabel || newPage.title,
        }),
      })

      if (response.ok) {
        setIsCreateOpen(false)
        setNewPage({ title: '', slug: '', description: '', navLabel: '', showInNav: false })
        fetchPages()
      }
    } catch (error) {
      console.error('Error creating page:', error)
    }
  }

  const handleDeletePage = async (id: string) => {
    try {
      const response = await fetch(`/api/custom-pages/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPages()
      }
    } catch (error) {
      console.error('Error deleting page:', error)
    }
  }

  const handleTogglePublish = async (page: CustomPage) => {
    try {
      const response = await fetch(`/api/custom-pages/${page.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !page.isPublished }),
      })

      if (response.ok) {
        fetchPages()
      }
    } catch (error) {
      console.error('Error toggling publish:', error)
    }
  }

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Page Builder</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create and manage custom pages with dynamic sections
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Create Page
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Page</DialogTitle>
                <DialogDescription>
                  Add a new custom page to your portfolio
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Page Title</Label>
                  <Input
                    id="title"
                    value={newPage.title}
                    onChange={(e) => setNewPage({ 
                      ...newPage, 
                      title: e.target.value,
                      slug: generateSlug(e.target.value)
                    })}
                    placeholder="My Research"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Path</Label>
                  <Input
                    id="slug"
                    value={newPage.slug}
                    onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                    placeholder="my-research"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newPage.description}
                    onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
                    placeholder="Page description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="navLabel">Navigation Label</Label>
                  <Input
                    id="navLabel"
                    value={newPage.navLabel}
                    onChange={(e) => setNewPage({ ...newPage, navLabel: e.target.value })}
                    placeholder="Same as title if empty"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="showInNav"
                    checked={newPage.showInNav ?? false}
                    onCheckedChange={(checked) => setNewPage({ ...newPage, showInNav: checked })}
                  />
                  <Label htmlFor="showInNav">Show in navigation</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreatePage}>Create Page</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Card key={page.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{page.title}</CardTitle>
                    <CardDescription className="text-sm">/{page.slug}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => window.open(`/${page.slug}`, '_blank')}>
                        <Eye className="mr-2 h-4 w-4" /> Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={`/admin/pages/${page.id}`}>
                          <Settings className="mr-2 h-4 w-4" /> Edit Sections
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleTogglePublish(page)}>
                        {page.isPublished ? 'Unpublish' : 'Publish'}
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Page</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{page.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeletePage(page.id)} className="bg-red-600">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={page.isPublished ? 'default' : 'secondary'}>
                    {page.isPublished ? 'Published' : 'Draft'}
                  </Badge>
                  {page.showInNav && (
                    <Badge variant="outline">In Nav</Badge>
                  )}
                  <Badge variant="outline">
                    {page.sections.length} sections
                  </Badge>
                </div>
                {page.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {page.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {pages.length === 0 && (
          <Card className="p-12 text-center">
            <Layout className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No pages yet</h3>
            <p className="text-gray-500 mb-4">Create your first custom page to get started</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Page
            </Button>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
