'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { Trash2, Plus, GripVertical, ArrowLeft, Save, Eye, EyeOff, Layout, Grid, List, Columns, Repeat, Folder, FolderOpen, Edit, X, Bookmark } from 'lucide-react'

interface PageSection {
  id: string
  tabId: string | null
  sectionType: string
  title: string | null
  content: string | null
  order: number
  layoutStyle: string
  isVisible: boolean
}

interface PageTab {
  id: string
  title: string
  slug: string | null
  icon: string | null
  order: number
  isVisible: boolean
  sections: PageSection[]
}

interface CustomPage {
  id: string
  title: string
  slug: string
  description: string | null
  content: string | null
  isPublished: boolean
  showInNav: boolean
  navLabel: string | null
  navOrder: number
  metaTitle: string | null
  metaDescription: string | null
  sections: PageSection[]
  tabs: PageTab[]
}

const sectionTypes = [
  { value: 'hero', label: 'Hero Section', icon: Layout },
  { value: 'quantum_hero', label: 'Quantum Hero', icon: Layout },
  { value: 'about', label: 'About Me', icon: Layout },
  { value: 'projects', label: 'Projects Showcase', icon: Grid },
  { value: 'skills', label: 'Skills Display', icon: List },
  { value: 'experience', label: 'Experience', icon: List },
  { value: 'education', label: 'Education', icon: List },
  { value: 'blog', label: 'Blog Posts', icon: List },
  { value: 'contact', label: 'Contact', icon: Layout },
  { value: 'currently_tracking', label: 'Currently Tracking', icon: Layout },
  { value: 'custom', label: 'Custom Content', icon: Layout },
  { value: 'video', label: 'Video Gallery', icon: Repeat },
  { value: 'testimonials', label: 'Testimonials', icon: Columns },
  { value: 'cta', label: 'Call to Action', icon: Layout },
]

const layoutStyles = [
  { value: 'default', label: 'Default' },
  { value: 'grid', label: 'Grid' },
  { value: 'list', label: 'List' },
  { value: 'carousel', label: 'Carousel' },
  { value: 'masonry', label: 'Masonry' },
  { value: 'split', label: 'Split View' },
]

export default function PageEditor({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [page, setPage] = useState<CustomPage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('page') // 'page' or tab id
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false)
  const [isAddTabOpen, setIsAddTabOpen] = useState(false)
  const [newSection, setNewSection] = useState({
    sectionType: 'hero',
    title: '',
    layoutStyle: 'default',
    tabId: '',
  })
  const [newTab, setNewTab] = useState({
    title: '',
    slug: '',
    icon: '',
  })

  useEffect(() => {
    fetchPage()
  }, [params.id])

  const fetchPage = async () => {
    try {
      const response = await fetch(`/api/custom-pages/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPage(data)
      }
    } catch (error) {
      console.error('Error fetching page:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddSection = async () => {
    try {
      // If activeTab is 'page', section has no tabId. Otherwise, use the tab ID
      const sectionTabId = activeTab === 'page' ? null : activeTab;
      
      const response = await fetch(`/api/custom-pages/${params.id}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newSection,
          title: newSection.title || null,
          tabId: sectionTabId,
        }),
      })

      if (response.ok) {
        setIsAddSectionOpen(false)
        setNewSection({ sectionType: 'hero', title: '', layoutStyle: 'default', tabId: '' })
        fetchPage()
      }
    } catch (error) {
      console.error('Error adding section:', error)
    }
  }

  const handleUpdateSection = async (sectionId: string, data: Partial<PageSection>) => {
    try {
      const response = await fetch(`/api/custom-pages/${params.id}/sections/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        fetchPage()
      }
    } catch (error) {
      console.error('Error updating section:', error)
    }
  }

  const handleDeleteSection = async (sectionId: string) => {
    try {
      const response = await fetch(`/api/custom-pages/${params.id}/sections/${sectionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchPage()
      }
    } catch (error) {
      console.error('Error deleting section:', error)
    }
  }

  // Tab management functions
  const handleAddTab = async () => {
    if (!newTab.title.trim()) return
    try {
      const response = await fetch(`/api/custom-pages/${params.id}/tabs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTab.title,
          slug: newTab.slug || newTab.title.toLowerCase().replace(/\s+/g, '-'),
          icon: newTab.icon || null,
        }),
      })

      if (response.ok) {
        setIsAddTabOpen(false)
        setNewTab({ title: '', slug: '', icon: '' })
        fetchPage()
      }
    } catch (error) {
      console.error('Error adding tab:', error)
    }
  }

  const handleDeleteTab = async (tabId: string) => {
    try {
      const response = await fetch(`/api/custom-pages/${params.id}/tabs/${tabId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        if (activeTab === tabId) setActiveTab('page')
        fetchPage()
      }
    } catch (error) {
      console.error('Error deleting tab:', error)
    }
  }

  const handleToggleTabVisibility = async (tabId: string, currentVisibility: boolean) => {
    try {
      const response = await fetch(`/api/custom-pages/${params.id}/tabs/${tabId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !currentVisibility }),
      })

      if (response.ok) {
        fetchPage()
      }
    } catch (error) {
      console.error('Error toggling tab visibility:', error)
    }
  }

  const handleToggleSectionVisibility = async (section: PageSection) => {
    await handleUpdateSection(section.id, { isVisible: !section.isVisible })
  }

  // Helper to render sections for the selected tab
  const renderTabSections = () => {
    if (!page) return null;
    const tabSections = page.sections.filter(s => s.tabId === activeTab).sort((a, b) => a.order - b.order);
    if (tabSections.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No sections in this tab</p>
          <p className="text-sm">Add sections to customize this tab</p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {tabSections.map((section) => (
          <Card key={section.id} className="p-4">
            <div className="flex items-start gap-4">
              <div className="cursor-move text-gray-400 hover:text-gray-600">
                <GripVertical className="h-5 w-5" />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {sectionTypes.find(t => t.value === section.sectionType)?.label || section.sectionType}
                    </Badge>
                    <Badge variant="secondary">
                      {section.layoutStyle}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleSectionVisibility(section)}
                    >
                      {section.isVisible ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Section</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this section? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteSection(section.id)} className="bg-red-600">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                {section.title && (
                  <Input
                    value={section.title || ''}
                    onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
                    placeholder="Section title"
                    className="max-w-md"
                  />
                )}
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Layout:</Label>
                  <Select
                    value={section.layoutStyle}
                    onValueChange={(value) => handleUpdateSection(section.id, { layoutStyle: value })}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {layoutStyles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          {style.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p>Page not found</p>
            <Button onClick={() => router.push('/admin/pages')} className="mt-4">
              Back to Pages
            </Button>
          </CardContent>
        </Card>
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
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push('/admin/pages')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{page.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">/{page.slug}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={page.isPublished ? 'default' : 'secondary'}>
              {page.isPublished ? 'Published' : 'Draft'}
            </Badge>
            <Button variant="outline" onClick={() => window.open(`/${page.slug}`, '_blank')}>
              <Eye className="mr-2 h-4 w-4" /> Preview
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-5 w-5" />
                    Tabs & Sections
                  </div>
                  <Dialog open={isAddTabOpen} onOpenChange={setIsAddTabOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="mr-2 h-4 w-4" /> Add Tab
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Tab</DialogTitle>
                        <DialogDescription>
                          Add a new tab to organize your page content
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Tab Title</Label>
                          <Input
                            value={newTab.title}
                            onChange={(e) => setNewTab({ ...newTab, title: e.target.value })}
                            placeholder="e.g., Overview, Projects, Research"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>URL Slug (optional)</Label>
                          <Input
                            value={newTab.slug}
                            onChange={(e) => setNewTab({ ...newTab, slug: e.target.value })}
                            placeholder="auto-generated-from-title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Icon (optional)</Label>
                          <Input
                            value={newTab.icon}
                            onChange={(e) => setNewTab({ ...newTab, icon: e.target.value })}
                            placeholder="icon-name"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddTabOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddTab}>Create Tab</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Tab Selector */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Button
                    variant={activeTab === 'page' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('page')}
                  >
                    <Folder className="mr-2 h-4 w-4" />
                    Main Page
                  </Button>
                  {page.tabs.map((tab) => (
                    <div key={tab.id} className="flex items-center gap-1">
                      <Button
                        variant={activeTab === tab.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setActiveTab(tab.id)}
                      >
                        {activeTab === tab.id ? <FolderOpen className="mr-2 h-4 w-4" /> : <Folder className="mr-2 h-4 w-4" />}
                        {tab.title}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Tab</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{tab.title}"? All sections in this tab will also be deleted. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTab(tab.id)} className="bg-red-600">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ))}
                </div>

                {/* Sections for selected tab */}
                <>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {activeTab === 'page' ? 'Main Page Sections' : page.tabs.find(t => t.id === activeTab)?.title + ' Sections'}
                    <Dialog open={isAddSectionOpen} onOpenChange={setIsAddSectionOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="mr-2 h-4 w-4" /> Add Section
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Section</DialogTitle>
                          <DialogDescription>
                            Add a new section to this {activeTab === 'page' ? 'page' : 'tab'}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Section Type</Label>
                            <Select
                              value={newSection.sectionType}
                              onValueChange={(value: string) => setNewSection({ ...newSection, sectionType: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {sectionTypes.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Section Title</Label>
                            <Input
                              value={newSection.title}
                              onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                              placeholder="Optional title"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Layout Style</Label>
                            <Select
                              value={newSection.layoutStyle}
                              onValueChange={(value: string) => setNewSection({ ...newSection, layoutStyle: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {layoutStyles.map((style) => (
                                  <SelectItem key={style.value} value={style.value}>
                                    {style.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddSectionOpen(false)}>Cancel</Button>
                          <Button onClick={handleAddSection}>Add Section</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                </>
                {/* Main Page Sections (no tab) */}
                {page.sections.filter(s => !s.tabId).length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Layout className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No sections yet</p>
                    <p className="text-sm">Add sections to customize this page</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {page.sections
                      .filter(s => !s.tabId)
                      .sort((a, b) => a.order - b.order)
                      .map((section) => (
                        <Card key={section.id} className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="cursor-move text-gray-400 hover:text-gray-600">
                              <GripVertical className="h-5 w-5" />
                            </div>
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">
                                    {sectionTypes.find(t => t.value === section.sectionType)?.label || section.sectionType}
                                  </Badge>
                                  <Badge variant="secondary">
                                    {section.layoutStyle}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleToggleSectionVisibility(section)}
                                  >
                                    {section.isVisible ? (
                                      <Eye className="h-4 w-4" />
                                    ) : (
                                      <EyeOff className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Section</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this section? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteSection(section.id)} className="bg-red-600">
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                              {section.title && (
                                <Input
                                  value={section.title || ''}
                                  onChange={(e) => handleUpdateSection(section.id, { title: e.target.value })}
                                  placeholder="Section title"
                                  className="max-w-md"
                                />
                              )}
                              <div className="flex items-center gap-2">
                                <Label className="text-sm">Layout:</Label>
                                <Select
                                  value={section.layoutStyle}
                                  onValueChange={(value) => handleUpdateSection(section.id, { layoutStyle: value })}
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {layoutStyles.map((style) => (
                                      <SelectItem key={style.value} value={style.value}>
                                        {style.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Published</Label>
                  <Switch
                    checked={page.isPublished}
                    onCheckedChange={(checked) => {
                      setPage({ ...page, isPublished: checked })
                      fetch(`/api/custom-pages/${params.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ isPublished: checked }),
                      })
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show in Navigation</Label>
                  <Switch
                    checked={page.showInNav}
                    onCheckedChange={(checked) => {
                      setPage({ ...page, showInNav: checked })
                      fetch(`/api/custom-pages/${params.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ showInNav: checked }),
                      })
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Navigation Label</Label>
                  <Input
                    value={page.navLabel || ''}
                    onChange={(e) => setPage({ ...page, navLabel: e.target.value })}
                    onBlur={() => {
                      fetch(`/api/custom-pages/${params.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ navLabel: page.navLabel }),
                      })
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Navigation Order</Label>
                  <Input
                    type="number"
                    value={page.navOrder}
                    onChange={(e) => setPage({ ...page, navOrder: parseInt(e.target.value) || 0 })}
                    onBlur={() => {
                      fetch(`/api/custom-pages/${params.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ navOrder: page.navOrder }),
                      })
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Meta Title</Label>
                  <Input
                    value={page.metaTitle || ''}
                    onChange={(e) => setPage({ ...page, metaTitle: e.target.value })}
                    onBlur={() => {
                      fetch(`/api/custom-pages/${params.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ metaTitle: page.metaTitle }),
                      })
                    }}
                    placeholder="Page title for search engines"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Input
                    value={page.metaDescription || ''}
                    onChange={(e) => setPage({ ...page, metaDescription: e.target.value })}
                    onBlur={() => {
                      fetch(`/api/custom-pages/${params.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ metaDescription: page.metaDescription }),
                      })
                    }}
                    placeholder="Page description for search engines"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
