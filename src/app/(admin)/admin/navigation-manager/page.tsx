'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash2, Plus, GripVertical, Edit, Eye, EyeOff, Layers, FileText } from 'lucide-react'

interface NavSection {
  id: string
  navTabId: string
  title: string | null
  subtitle: string | null
  sectionType: string
  content: string | null
  order: number
  layoutStyle: string
  isVisible: boolean
}

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
  sections: NavSection[]
}

const iconOptions = [
  { value: 'book', label: 'Book' },
  { value: 'file-text', label: 'File Text' },
  { value: 'settings', label: 'Settings' },
  { value: 'link', label: 'Link' },
  { value: 'chart', label: 'Chart' },
  { value: 'users', label: 'Users' },
  { value: 'star', label: 'Star' },
]

function SortableNavItem({ 
  tab, 
  onEdit, 
  onBuild, 
  onToggleVisibility 
}: { 
  tab: NavigationTab
  onEdit: (tab: NavigationTab) => void
  onBuild: (tab: NavigationTab) => void
  onToggleVisibility: (tab: NavigationTab) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tab.id })
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Card ref={setNodeRef} style={style} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div {...attributes} {...listeners} className="cursor-move text-gray-400 hover:text-gray-600">
            <GripVertical className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{tab.title}</h3>
              <Badge variant="outline" className="text-xs">
                {tab.slug}
              </Badge>
              {!tab.isVisible && (
                <Badge variant="secondary" className="text-xs">
                  Hidden
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
            {tab.sections && tab.sections.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {tab.sections.length} section(s)
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBuild(tab)}
              title="Build Section"
              className="text-blue-600 hover:text-blue-700"
            >
              <Layers className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleVisibility(tab)}
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
              onClick={() => onEdit(tab)}
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
                  <AlertDialogTitle>Delete Navigation Item</AlertDialogTitle>
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
}

async function handleDelete(id: string) {
  try {
    await fetch(`/api/navigation-tabs/${id}`, {
      method: 'DELETE',
    })
    window.location.reload()
  } catch (error) {
    console.error('Error deleting tab:', error)
  }
}

export default function NavigationManagerPage() {
  const router = useRouter()
  const [tabs, setTabs] = useState<NavigationTab[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTab, setEditingTab] = useState<NavigationTab | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    icon: '',
    externalUrl: '',
    isVisible: true,
    isActive: true,
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

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
        alert(error.error || 'Failed to save')
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
      externalUrl: tab.externalUrl || '',
      isVisible: tab.isVisible,
      isActive: tab.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleBuild = (tab: NavigationTab) => {
    router.push(`/admin/navigation-manager/${tab.id}`)
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = tabs.findIndex(t => t.id === active.id)
      const newIndex = tabs.findIndex(t => t.id === over.id)
      
      const newTabs = arrayMove(tabs, oldIndex, newIndex)
      setTabs(newTabs)

      try {
        await fetch('/api/navigation-tabs', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tabs: newTabs.map((tab, index) => ({ id: tab.id, order: index })) 
          }),
        })
      } catch (error) {
        console.error('Error saving order:', error)
      }
    }
  }

  const resetForm = () => {
    setEditingTab(null)
    setFormData({
      title: '',
      slug: '',
      icon: '',
      externalUrl: '',
      isVisible: true,
      isActive: true,
    })
  }

  const openNewTabDialog = () => {
    resetForm()
    setIsDialogOpen(true)
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Navigation Manager</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create and manage navigation items with custom sections
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button onClick={openNewTabDialog}>
                <Plus className="mr-2 h-4 w-4" /> Add Nav Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTab ? 'Edit Navigation Item' : 'Create Navigation Item'}
                </DialogTitle>
                <DialogDescription>
                  {editingTab 
                    ? 'Update the navigation item details below'
                    : 'Add a new item to your navigation menu'
                  }
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          title: e.target.value,
                          slug: editingTab ? formData.slug : e.target.value.toLowerCase().replace(/\s+/g, '-')
                        })
                      }}
                      placeholder="e.g., Projects, Research"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>URL Slug</Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="projects"
                    />
                  </div>
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

                <div className="space-y-2">
                  <Label>External URL (optional)</Label>
                  <Input
                    value={formData.externalUrl}
                    onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                    placeholder="https://example.com (leave empty for internal page)"
                  />
                </div>

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
                  {editingTab ? 'Save Changes' : 'Create'}
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
                <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-300">Dynamic Navigation Builder</h3>
                <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                  Create custom navigation items and build sections with rich content blocks. 
                  Click the Layers icon to open the Section Builder for each item.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs List with Drag and Drop */}
        {tabs.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No navigation items yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first navigation item to get started
              </p>
              <Button onClick={openNewTabDialog}>
                <Plus className="mr-2 h-4 w-4" /> Create Nav Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={tabs.map(t => t.id)} 
              strategy={verticalListSortingStrategy}
            >
              <div className="grid gap-4">
                {tabs.map((tab) => (
                  <SortableNavItem
                    key={tab.id}
                    tab={tab}
                    onEdit={handleEdit}
                    onBuild={handleBuild}
                    onToggleVisibility={handleToggleVisibility}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </motion.div>
    </div>
  )
}
