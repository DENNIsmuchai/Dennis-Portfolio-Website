'use client'

import { useState, useEffect } from 'react'
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

interface Education {
  id: string
  institution: string
  degree: string
  field?: string
  location?: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  description?: string
  gpa?: string
  order: number
}

export default function EducationPage() {
  const [educations, setEducations] = useState<Education[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Education>>({
    institution: '',
    degree: '',
    field: '',
    location: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    isCurrent: false,
    description: '',
    gpa: '',
  })

  useEffect(() => {
    fetchEducations()
  }, [])

  const fetchEducations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/education')
      if (response.ok) {
        const data = await response.json()
        setEducations(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching education:', error)
      setErrorMessage('Failed to load education data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.institution || !formData.degree) {
      setErrorMessage('Institution and degree are required')
      return
    }

    setIsSaving(true)
    setErrorMessage('')
    try {
      const url = editingId ? `/api/education/${editingId}` : '/api/education'
      const method = editingId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save education')
      }

      const data = await response.json()
      if (editingId) {
        setEducations((prev) => prev.map((e) => (e.id === editingId ? data : e)))
        setEditDialogOpen(null)
      } else {
        setEducations((prev) => [...prev, data])
        setDialogOpen(false)
      }
      resetForm()
      setSuccessMessage('Education saved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error saving education:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save education')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/education/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setEducations((prev) => prev.filter((e) => e.id !== id))
        setSuccessMessage('Education deleted successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error deleting education:', error)
      setErrorMessage('Failed to delete education')
    }
  }

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isCurrent: false,
      description: '',
      gpa: '',
    })
    setEditingId(null)
  }

  const handleEdit = (education: Education) => {
    setFormData({ ...education })
    setEditingId(education.id)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Education</h1>
          <p className="text-muted-foreground mt-2">
            Manage your educational background and achievements.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Education
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Education' : 'Add New Education'}
              </DialogTitle>
            </DialogHeader>
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
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    value={formData.institution || ''}
                    onChange={(e) => handleInputChange('institution', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                    placeholder="University Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  <Input
                    id="degree"
                    value={formData.degree || ''}
                    onChange={(e) => handleInputChange('degree', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                    placeholder="Bachelor of Science"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="field">Field of Study</Label>
                  <Input
                    id="field"
                    value={formData.field || ''}
                    onChange={(e) => handleInputChange('field', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                    placeholder="Computer Science"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location || ''}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                    placeholder="City, State"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                    disabled={formData.isCurrent}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gpa">GPA</Label>
                  <Input
                    id="gpa"
                    value={formData.gpa || ''}
                    onChange={(e) => handleInputChange('gpa', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                    placeholder="3.8"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isCurrent || false}
                  onCheckedChange={(checked) => {
                    setFormData(prev => ({
                      ...prev,
                      isCurrent: checked,
                      endDate: checked ? '' : prev.endDate
                    }))
                  }}
                />
                <Label>Currently Studying</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey === false && e.preventDefault()}
                  placeholder="Additional details about your education..."
                  rows={3}
                />
              </div>

              <Button onClick={handleSave} className="w-full" disabled={isSaving}>
                {isSaving ? 'Saving...' : editingId ? 'Update Education' : 'Add Education'}
              </Button>
            </form>
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
      ) : educations.length === 0 ? (
        <Card className="glass">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center py-8">
              No education entries yet. Add one to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {educations
            .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
            .map((education) => (
              <Card key={education.id} className="glass">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{education.degree}</h3>
                      <p className="text-primary font-medium">{education.institution}</p>
                      {education.field && (
                        <p className="text-sm text-muted-foreground">{education.field}</p>
                      )}
                      {education.location && (
                        <p className="text-sm text-muted-foreground">{education.location}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-2">
                        {new Date(education.startDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}{' '}
                        -{' '}
                        {education.isCurrent
                          ? 'Present'
                          : education.endDate
                            ? new Date(education.endDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                              })
                            : 'N/A'}
                      </p>
                      {education.description && (
                        <p className="text-sm mt-2">{education.description}</p>
                      )}
                      {education.gpa && (
                        <p className="text-sm text-muted-foreground">GPA: {education.gpa}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={editDialogOpen === education.id} onOpenChange={(open) => {
                        if (open) {
                          handleEdit(education)
                          setEditDialogOpen(education.id)
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
                            <DialogTitle>Edit Education</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="institution">Institution</Label>
                                <Input
                                  id="institution"
                                  value={formData.institution || ''}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      institution: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="degree">Degree</Label>
                                <Input
                                  id="degree"
                                  value={formData.degree || ''}
                                  onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, degree: e.target.value }))
                                  }
                                />
                              </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="field">Field of Study</Label>
                                <Input
                                  id="field"
                                  value={formData.field || ''}
                                  onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, field: e.target.value }))
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                  id="location"
                                  value={formData.location || ''}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      location: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                  id="startDate"
                                  type="date"
                                  value={formData.startDate || ''}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      startDate: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="endDate">End Date</Label>
                                <Input
                                  id="endDate"
                                  type="date"
                                  value={formData.endDate || ''}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      endDate: e.target.value,
                                    }))
                                  }
                                  disabled={formData.isCurrent}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="gpa">GPA</Label>
                                <Input
                                  id="gpa"
                                  value={formData.gpa || ''}
                                  onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, gpa: e.target.value }))
                                  }
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Switch
                                checked={formData.isCurrent || false}
                                onCheckedChange={(checked) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    isCurrent: checked,
                                    endDate: '',
                                  }))
                                }
                              />
                              <Label>Currently Studying</Label>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Textarea
                                id="description"
                                value={formData.description || ''}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                  }))
                                }
                                rows={3}
                              />
                            </div>

                            <Button onClick={handleSave} className="w-full" disabled={isSaving}>
                              {isSaving ? 'Updating...' : 'Update Education'}
                            </Button>
                          </div>
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
                            <AlertDialogTitle>Delete Education</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this education entry? This action cannot
                              be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(education.id)}
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
