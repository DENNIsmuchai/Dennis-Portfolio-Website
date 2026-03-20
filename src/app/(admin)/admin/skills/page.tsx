'use client'

import { useState, useEffect, memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
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
import { Plus, Edit2, Trash2, CheckCircle, GripVertical } from 'lucide-react'

interface SkillCategory {
  id: string
  name: string
  label: string
  order: number
  isVisible: boolean
  skills?: Skill[]
}

interface Skill {
  id: string
  name: string
  categoryId: string
  proficiency: number
  icon?: string
  isVisible: boolean
  order: number
}

export default function SkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Skill>>({
    name: '',
    categoryId: '',
    proficiency: 50,
    icon: '',
    isVisible: true,
  })
  const [categoryFormData, setCategoryFormData] = useState<Partial<SkillCategory>>({
    name: '',
    label: '',
    isVisible: true,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/skill-categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching skills:', error)
      setErrorMessage('Failed to load skills')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSkill = async (data?: Partial<Skill>) => {
    const payload = data || formData
    if (!payload.name || !payload.categoryId) {
      setErrorMessage('Skill name and category are required')
      return
    }

    setIsSaving(true)
    setErrorMessage('')
    try {
      const url = editingSkillId ? `/api/skills/${editingSkillId}` : '/api/skills'
      const method = editingSkillId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save skill')
      }

      await fetchData()
      resetSkillForm()
      setDialogOpen(false)
      setEditDialogOpen(null)
      setSuccessMessage('Skill saved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error saving skill:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save skill')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteSkill = async (id: string) => {
    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchData()
        setSuccessMessage('Skill deleted successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error deleting skill:', error)
      setErrorMessage('Failed to delete skill')
    }
  }

  const handleSaveCategory = async () => {
    if (!categoryFormData.name || !categoryFormData.label) {
      setErrorMessage('Category name and label are required')
      return
    }

    setIsSaving(true)
    setErrorMessage('')
    try {
      const response = await fetch('/api/skill-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryFormData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save category')
      }

      await fetchData()
      setCategoryFormData({ name: '', label: '', isVisible: true })
      setCategoryDialogOpen(false)
      setSuccessMessage('Category saved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error saving category:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save category')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/skill-categories/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchData()
        setSuccessMessage('Category deleted successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      setErrorMessage('Failed to delete category')
    }
  }

  const resetSkillForm = useCallback(() => {
    setFormData({
      name: '',
      categoryId: categories[0]?.id || '',
      proficiency: 50,
      icon: '',
      isVisible: true,
    })
    setEditingSkillId(null)
  }, [categories])

  const handleEditSkill = useCallback((skill: Skill, categoryId: string) => {
    setFormData({ ...skill, categoryId })
    setEditingSkillId(skill.id)
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleCategoryInputChange = (field: string, value: any) => {
    setCategoryFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Separate uncategorized skills
  const uncategorizedSkills = categories.flatMap(c => c.skills || []).filter(s => !s.categoryId)
  const categorizedCategories = categories.filter(c => c.skills && c.skills.length > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills Manager</h1>
          <p className="text-muted-foreground mt-2">
            Manage your skills and categories. Create custom categories and add skills to them.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCategoryDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetSkillForm} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Skill</DialogTitle>
              </DialogHeader>
              <SkillForm
                categories={categories}
                initialData={formData}
                isSaving={isSaving}
                onSave={handleSaveSkill}
                onChange={handleInputChange}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Category Add/Edit Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="catName">Category Name (unique ID)</Label>
              <Input
                id="catName"
                value={categoryFormData.name || ''}
                onChange={(e) => handleCategoryInputChange('name', e.target.value)}
                placeholder="e.g., programming-languages"
              />
              <p className="text-xs text-muted-foreground">
                This will be used as a unique identifier (no spaces)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="catLabel">Display Label</Label>
              <Input
                id="catLabel"
                value={categoryFormData.label || ''}
                onChange={(e) => handleCategoryInputChange('label', e.target.value)}
                placeholder="e.g., Programming Languages"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={categoryFormData.isVisible ?? true}
                onCheckedChange={(checked) => handleCategoryInputChange('isVisible', checked)}
              />
              <Label>Show on public portfolio</Label>
            </div>
            <Button onClick={handleSaveCategory} className="w-full" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Add Category'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {successMessage && (
        <AlertDialog open={!!successMessage}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Success
              </AlertDialogTitle>
              <AlertDialogDescription>{successMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setSuccessMessage('')}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {errorMessage && (
        <AlertDialog open={!!errorMessage}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-destructive">Error</AlertDialogTitle>
              <AlertDialogDescription>{errorMessage}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setErrorMessage('')}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Loading skills...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="glass">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {category.label}
                    {!category.isVisible && (
                      <span className="text-xs bg-muted px-2 py-1 rounded">Hidden</span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {category.skills?.length || 0} skill{(category.skills?.length || 0) !== 1 ? 's' : ''}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Category</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{category.label}"? All skills in this category will also be deleted. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCategory(category.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                {category.skills && category.skills.length > 0 ? (
                  <div className="space-y-3">
                    {category.skills.map((skill, index) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex-1 min-w-[200px]">
                            <p className="font-medium">{skill.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${skill.proficiency}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {skill.proficiency}%
                              </span>
                            </div>
                          </div>
                          {!skill.isVisible && (
                            <span className="text-xs bg-muted px-2 py-1 rounded">
                              Hidden
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog
                            open={editDialogOpen === skill.id}
                            onOpenChange={(open) => {
                              if (open) {
                                handleEditSkill(skill, category.id)
                                setEditDialogOpen(skill.id)
                              } else {
                                setEditDialogOpen(null)
                                resetSkillForm()
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Edit Skill</DialogTitle>
                              </DialogHeader>
                              <SkillForm
                                categories={categories}
                                initialData={formData}
                                isSaving={isSaving}
                                onSave={handleSaveSkill}
                                onChange={handleInputChange}
                              />
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
                                <AlertDialogTitle>Delete Skill</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{skill.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSkill(skill.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No skills in this category yet. Click "Add Skill" to create one.
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {categories.length === 0 && !isLoading && (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No categories yet.</p>
            <Button onClick={() => setCategoryDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Category
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface SkillFormProps {
  categories: SkillCategory[]
  initialData?: Partial<Skill>
  isSaving?: boolean
  onSave?: (data: Partial<Skill>) => void
  onChange?: (field: string, value: any) => void
}

const SkillForm = memo(function SkillForm({
  categories,
  initialData = {},
  isSaving = false,
  onSave = () => {},
  onChange = () => {},
}: SkillFormProps) {
  const [localData, setLocalData] = useState<Partial<Skill>>(initialData || {})

  useEffect(() => {
    setLocalData(initialData || {})
  }, [initialData])

  const handleChange = (field: string, value: any) => {
    setLocalData((prev) => ({ ...prev, [field]: value }))
    onChange(field, value)
  }

  return (
    <form
      onKeyDown={(e) => {
        if (e.key === 'Enter' && e.currentTarget === e.target) {
          e.preventDefault()
        }
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Skill Name</Label>
        <Input
          id="name"
          value={localData.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          placeholder="e.g., React, Python, AWS"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <select
          id="category"
          value={localData.categoryId || ''}
          onChange={(e) => handleChange('categoryId', e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label>Proficiency Level: {localData.proficiency || 50}%</Label>
        <Slider
          value={[localData.proficiency || 50]}
          onValueChange={([value]) => handleChange('proficiency', value)}
          max={100}
          step={5}
          className="py-2"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon (optional)</Label>
        <Input
          id="icon"
          value={localData.icon || ''}
          onChange={(e) => handleChange('icon', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          placeholder="Icon name or URL"
        />
        <p className="text-xs text-muted-foreground">
          You can use Lucide icon names or a URL to an icon
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          checked={localData.isVisible ?? true}
          onCheckedChange={(checked) => handleChange('isVisible', checked)}
        />
        <Label>Show on public portfolio</Label>
      </div>

      <Button
        type="button"
        onClick={() => onSave(localData)}
        className="w-full"
        disabled={isSaving}
      >
        {isSaving ? 'Saving...' : initialData?.id ? 'Update Skill' : 'Add Skill'}
      </Button>
    </form>
  )
})
