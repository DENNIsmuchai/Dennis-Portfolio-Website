'use client'

import { useState, useEffect } from 'react'
import { motion, Reorder } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Plus, GripVertical, Eye, EyeOff, Edit2, Trash2, Save, ExternalLink, Layout } from 'lucide-react'
import type { Section } from '@/types'

const sectionTypeLabels: Record<string, string> = {
  HERO: 'Hero',
  ABOUT: 'About',
  PROJECTS: 'Projects',
  SKILLS: 'Skills',
  EXPERIENCE: 'Experience',
  EDUCATION: 'Education',
  CERTIFICATIONS: 'Certifications',
  BLOG: 'Blog',
  CONTACT: 'Contact',
  CUSTOM: 'Custom',
}

interface CustomPage {
  id: string
  title: string
  slug: string
  description: string | null
  isPublished: boolean
  showInNav: boolean
  navLabel: string | null
  sections: { id: string }[]
}

export default function WebsiteEditorPage() {
  const [sections, setSections] = useState<Section[]>([])
  const [customPages, setCustomPages] = useState<CustomPage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingSection, setEditingSection] = useState<Section | null>(null)

  useEffect(() => {
    fetchSections()
    fetchCustomPages()
  }, [])

  const fetchCustomPages = async () => {
    try {
      const response = await fetch('/api/custom-pages')
      if (response.ok) {
        const data = await response.json()
        setCustomPages(data)
      }
    } catch (error) {
      console.error('Error fetching custom pages:', error)
    }
  }

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/sections')
      if (response.ok) {
        const data = await response.json()
        setSections(data)
      }
    } catch (error) {
      console.error('Error fetching sections:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReorder = async (newOrder: Section[]) => {
    setSections(newOrder)
  }

  const saveOrder = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/sections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: sections.map((s, index) => ({ id: s.id, order: index })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save order')
      }
    } catch (error) {
      console.error('Error saving order:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const toggleVisibility = async (section: Section) => {
    try {
      const response = await fetch(`/api/sections/${section.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !section.isVisible }),
      })

      if (response.ok) {
        setSections((prev) =>
          prev.map((s) =>
            s.id === section.id ? { ...s, isVisible: !s.isVisible } : s
          )
        )
      }
    } catch (error) {
      console.error('Error toggling visibility:', error)
    }
  }

  const toggleNavVisibility = async (section: Section) => {
    try {
      const response = await fetch(`/api/sections/${section.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showInNav: !section.showInNav }),
      })

      if (response.ok) {
        setSections((prev) =>
          prev.map((s) =>
            s.id === section.id ? { ...s, showInNav: !s.showInNav } : s
          )
        )
      }
    } catch (error) {
      console.error('Error toggling nav visibility:', error)
    }
  }

  const updateSection = async (section: Section) => {
    try {
      const response = await fetch(`/api/sections/${section.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: section.title,
          navLabel: section.navLabel,
        }),
      })

      if (response.ok) {
        setSections((prev) =>
          prev.map((s) => (s.id === section.id ? section : s))
        )
        setEditingSection(null)
      }
    } catch (error) {
      console.error('Error updating section:', error)
    }
  }

  const deleteSection = async (id: string) => {
    try {
      const response = await fetch(`/api/sections/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSections((prev) => prev.filter((s) => s.id !== id))
      }
    } catch (error) {
      console.error('Error deleting section:', error)
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Editor</h1>
          <p className="text-muted-foreground mt-2">
            Manage your homepage sections and custom pages.
          </p>
        </div>
        <Button onClick={saveOrder} disabled={isSaving} className="gap-2">
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Order'}
        </Button>
      </div>

      <Tabs defaultValue="homepage" className="w-full">
        <TabsList>
          <TabsTrigger value="homepage">Homepage Sections</TabsTrigger>
          <TabsTrigger value="pages">Custom Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="homepage">
          <Reorder.Group axis="y" values={sections} onReorder={handleReorder} className="space-y-2">
        {sections.map((section) => (
          <Reorder.Item key={section.id} value={section}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="glass">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="cursor-grab active:cursor-grabbing">
                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{section.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {sectionTypeLabels[section.type]}
                        </Badge>
                        {!section.isVisible && (
                          <Badge variant="secondary" className="text-xs">
                            Hidden
                          </Badge>
                        )}
                      </div>
                      {section.navLabel && (
                        <p className="text-sm text-muted-foreground">
                          Nav: {section.navLabel}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 mr-4">
                        <Switch
                          checked={section.showInNav}
                          onCheckedChange={() => toggleNavVisibility(section)}
                        />
                        <span className="text-sm text-muted-foreground">Nav</span>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleVisibility(section)}
                      >
                        {section.isVisible ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingSection(section)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Section</DialogTitle>
                          </DialogHeader>
                          {editingSection && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                  value={editingSection.title}
                                  onChange={(e) =>
                                    setEditingSection({
                                      ...editingSection,
                                      title: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Navigation Label</Label>
                                <Input
                                  value={editingSection.navLabel || ''}
                                  onChange={(e) =>
                                    setEditingSection({
                                      ...editingSection,
                                      navLabel: e.target.value,
                                    })
                                  }
                                  placeholder="Label shown in navigation"
                                />
                              </div>
                              <Button
                                onClick={() => updateSection(editingSection)}
                                className="w-full"
                              >
                                Save Changes
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Section</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{section.title}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteSection(section.id)}
                              className="bg-destructive text-destructive-foreground"
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
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
      </TabsContent>

      <TabsContent value="pages">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customPages.map((page) => (
            <Card key={page.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{page.title}</h3>
                    <p className="text-sm text-muted-foreground">/{page.slug}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={page.isPublished ? 'default' : 'secondary'}>
                        {page.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                      {page.showInNav && (
                        <Badge variant="outline">In Nav</Badge>
                      )}
                      <Badge variant="outline">
                        {page.sections?.length || 0} sections
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`/admin/pages/${page.id}`} target="_blank">
                        <Edit2 className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`/${page.slug}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {customPages.length === 0 && (
            <Card className="col-span-full p-8 text-center">
              <Layout className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No custom pages yet</h3>
              <p className="text-gray-500 mb-4">
                Create custom pages to build research, investments, or AI projects pages
              </p>
              <Button asChild>
                <a href="/admin/pages">Create Page</a>
              </Button>
            </Card>
          )}
        </div>
      </TabsContent>
      </Tabs>
    </div>
  )
}
