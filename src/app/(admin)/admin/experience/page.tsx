'use client'

import { useState, useEffect, memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle } from 'lucide-react'

interface Experience {
  id: string
  company: string
  position: string
  location?: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  description: string
  highlights?: string
  order: number
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Experience>>({
    company: '',
    position: '',
    location: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isCurrent: false,
    description: '',
    highlights: '',
  })

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/experience')
      if (response.ok) {
        const data = await response.json()
        setExperiences(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching experiences:', error)
      setErrorMessage('Failed to load experiences')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (data?: Partial<Experience>) => {
    const payload = data || formData
    if (!payload.company || !payload.position) {
      setErrorMessage('Company and position are required')
      return
    }

    setIsSaving(true)
    setErrorMessage('')
    try {
      const url = editingId ? `/api/experience/${editingId}` : '/api/experience'
      const method = editingId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save experience')
      }

      const newData = await response.json()
      if (editingId) {
        setExperiences((prev) => prev.map((e) => (e.id === editingId ? newData : e)))
        setEditDialogOpen(null)
      } else {
        setExperiences((prev) => [...prev, newData])
        setDialogOpen(false)
      }
      resetForm()
      setSuccessMessage('Experience saved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error saving experience:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save experience')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/experience/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setExperiences((prev) => prev.filter((e) => e.id !== id))
        setSuccessMessage('Experience deleted successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error deleting experience:', error)
      setErrorMessage('Failed to delete experience')
    }
  }
  const resetForm = useCallback(() => {
    setFormData({
      company: '',
      position: '',
      location: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isCurrent: false,
      description: '',
      highlights: '',
    })
    setEditingId(null)
  }, [])

  const handleEdit = useCallback((experience: Experience) => {
    setFormData(experience)
    setEditingId(experience.id)
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // helper to reuse the existing save logic but accept payload from child form
  const handleSaveWithPayload = useCallback(async (payload: Partial<Experience>) => {
    if (!payload.company || !payload.position) {
      setErrorMessage('Company and position are required')
      return
    }

    setIsSaving(true)
    setErrorMessage('')
    try {
      const url = editingId ? `/api/experience/${editingId}` : '/api/experience'
      const method = editingId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save experience')
      }

      const data = await response.json()
      if (editingId) {
        setExperiences((prev) => prev.map((e) => (e.id === editingId ? data : e)))
        setEditDialogOpen(null)
      } else {
        setExperiences((prev) => [...prev, data])
        setDialogOpen(false)
      }
      resetForm()
      setSuccessMessage('Experience saved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error saving experience:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save experience')
    } finally {
      setIsSaving(false)
    }
  }, [editingId, formData])

  interface ExperienceFormProps {
    initialData?: Partial<Experience>
    editingId?: string | null
    isSaving?: boolean
    onSave?: (data: Partial<Experience>) => void
  }

  const ExperienceForm = memo(function ExperienceForm({ 
    initialData = {}, 
    editingId = null, 
    isSaving = false, 
    onSave = () => {} 
  }: ExperienceFormProps) {
    const [localData, setLocalData] = useState<Partial<Experience>>(initialData || {})

    useEffect(() => {
      setLocalData(initialData || {})
    }, [initialData])

    const handleChange = (field: string, value: any) => {
      setLocalData(prev => ({ ...prev, [field]: value }))
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
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              value={localData.company || ''}
              onChange={(e) => handleChange('company', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              placeholder="Company Name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={localData.position || ''}
              onChange={(e) => handleChange('position', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              placeholder="Senior Developer"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={localData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              placeholder="San Francisco, CA"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={localData.startDate || ''}
              onChange={(e) => handleChange('startDate', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={localData.endDate || ''}
              onChange={(e) => handleChange('endDate', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              disabled={localData.isCurrent}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={localData.isCurrent || false}
            onCheckedChange={(checked) => {
              setLocalData(prev => ({
                ...prev,
                isCurrent: checked,
                endDate: checked ? '' : prev.endDate
              }))
            }}
          />
          <Label>Currently Working Here</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Job Description</Label>
          <Textarea
            id="description"
            value={localData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey === false && e.preventDefault()}
            placeholder="Describe your responsibilities and achievements..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="highlights">Highlights (one per line)</Label>
          <Textarea
            id="highlights"
            value={localData.highlights || ''}
            onChange={(e) => handleChange('highlights', e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey === false && e.preventDefault()}
            placeholder="Key achievement 1&#10;Key achievement 2&#10;Key achievement 3"
            rows={3}
          />
        </div>

        <Button onClick={() => onSave(localData)} className="w-full" disabled={isSaving}>
          {isSaving ? 'Saving...' : editingId ? 'Update Experience' : 'Add Experience'}
        </Button>
      </form>
    )
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Experience</h1>
          <p className="text-muted-foreground mt-2">
            Manage your professional work experience and positions.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Experience
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                Add New Experience
              </DialogTitle>
            </DialogHeader>
            <ExperienceForm
              initialData={formData}
              editingId={null}
              isSaving={isSaving}
              onSave={handleSave}
            />
          </DialogContent>
        </Dialog>
      </div>

      {successMessage && (
        <Alert className="bg-green-500/10 border-green-500/20">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-500">{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert className="bg-red-500/10 border-red-500/20">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-500">{errorMessage}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : experiences.length === 0 ? (
        <Card className="glass">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center py-8">
              No work experience yet. Add one to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {experiences
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
            .map((exp) => (
              <Card key={exp.id} className="glass">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{exp.position}</h3>
                      <p className="text-primary font-medium">{exp.company}</p>
                      {exp.location && (
                        <p className="text-sm text-muted-foreground">{exp.location}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-2">
                        {new Date(exp.startDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}{' '}
                        -{' '}
                        {exp.isCurrent
                          ? 'Present'
                          : exp.endDate
                            ? new Date(exp.endDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                              })
                            : 'N/A'}
                      </p>
                      {exp.description && (
                        <p className="text-sm mt-3">{exp.description}</p>
                      )}
                      {exp.highlights && (
                        <ul className="text-sm mt-3 space-y-1">
                          {exp.highlights.split('\n').map((highlight, idx) => (
                            <li key={idx} className="text-muted-foreground">
                              • {highlight}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={editDialogOpen === exp.id} onOpenChange={(open) => {
                        if (open) {
                          handleEdit(exp)
                          setEditDialogOpen(exp.id)
                        } else {
                          setEditDialogOpen(null)
                          resetForm()
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                                        <DialogContent className="max-w-2xl">
                                          <DialogHeader>
                                            <DialogTitle>Edit Experience</DialogTitle>
                                          </DialogHeader>
                                          <ExperienceForm
                                            initialData={formData}
                                            editingId={editingId}
                                            isSaving={isSaving}
                                            onSave={(data) => {
                                              // when editing, set editingId already set by handleEdit
                                              handleSaveWithPayload(data)
                                            }}
                                          />
                                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this experience? This action cannot
                              be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(exp.id)}
                              className="bg-red-600"
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
            ))}
        </div>
      )}
    </motion.div>
  )
}
