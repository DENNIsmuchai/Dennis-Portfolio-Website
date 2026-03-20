'use client'

import { useState, useEffect, memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'

interface Certification {
  id: string
  name: string
  organization: string
  issueDate: string
  expiryDate?: string
  credentialId?: string
  credentialUrl?: string
  image?: string
  order: number
}

interface CertificationFormProps {
  initialData: Partial<Certification>
  editingId: string | null
  isSaving: boolean
  onSave: (data: Partial<Certification>) => void
}

const CertificationForm = memo(function CertificationForm({ initialData, editingId, isSaving, onSave }: CertificationFormProps) {
  const [localData, setLocalData] = useState<Partial<Certification>>(initialData)

  useEffect(() => {
    setLocalData(initialData)
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
        <Label htmlFor="name">Certification Name</Label>
        <Input
          id="name"
          value={localData?.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          placeholder="AWS Solutions Architect"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="organization">Organization</Label>
        <Input
          id="organization"
          value={localData?.organization || ''}
          onChange={(e) => handleChange('organization', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          placeholder="Amazon Web Services"
        />
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="issueDate">Issue Date</Label>
        <Input
          id="issueDate"
          type="date"
          value={localData?.issueDate || ''}
          onChange={(e) => handleChange('issueDate', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
        <Input
          id="expiryDate"
          type="date"
          value={localData?.expiryDate || ''}
          onChange={(e) => handleChange('expiryDate', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
        />
      </div>
    </div>

    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="credentialId">Credential ID</Label>
        <Input
          id="credentialId"
          value={localData?.credentialId || ''}
          onChange={(e) => handleChange('credentialId', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          placeholder="ABC123DEF"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="credentialUrl">Credential URL</Label>
        <Input
          id="credentialUrl"
          type="url"
          value={localData?.credentialUrl || ''}
          onChange={(e) => handleChange('credentialUrl', e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          placeholder="https://example.com/verify"
        />
      </div>
    </div>

    <div className="space-y-2">
      <Label htmlFor="image">Image URL</Label>
      <Input
        id="image"
        type="url"
        value={localData?.image || ''}
        onChange={(e) => handleChange('image', e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
        placeholder="https://example.com/badge.png"
      />
    </div>

    <Button onClick={() => onSave(localData)} className="w-full" disabled={isSaving}>
      {isSaving ? 'Saving...' : editingId ? 'Update Certification' : 'Add Certification'}
    </Button>
  </form>
  )
})
CertificationForm.displayName = 'CertificationForm'

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Certification>>({
    name: '',
    organization: '',
    issueDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    credentialId: '',
    credentialUrl: '',
    image: '',
  })

  useEffect(() => {
    fetchCertifications()
  }, [])

  const fetchCertifications = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/certifications')
      if (response.ok) {
        const data = await response.json()
        setCertifications(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching certifications:', error)
      setErrorMessage('Failed to load certifications')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = useCallback(async (dataToSave?: Partial<Certification>) => {
    const payload = dataToSave ?? formData
    if (!payload?.name || !payload?.organization) {
      setErrorMessage('Name and organization are required')
      return
    }

    setIsSaving(true)
    setErrorMessage('')
    try {
      const url = editingId ? `/api/certifications/${editingId}` : '/api/certifications'
      const method = editingId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save certification')
      }

      const data = await response.json()
      if (editingId) {
        setCertifications((prev) => prev.map((c) => (c.id === editingId ? data : c)))
        setEditDialogOpen(null)
      } else {
        setCertifications((prev) => [...prev, data])
        setDialogOpen(false)
      }
      resetForm()
      setSuccessMessage('Certification saved successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      console.error('Error saving certification:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save certification')
    } finally {
      setIsSaving(false)
    }
  }, [formData, editingId])

  const handleDelete = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/certifications/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setCertifications((prev) => prev.filter((c) => c.id !== id))
        setSuccessMessage('Certification deleted successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error deleting certification:', error)
      setErrorMessage('Failed to delete certification')
    }
  }, [])

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      organization: '',
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      credentialId: '',
      credentialUrl: '',
      image: '',
    })
    setEditingId(null)
  }, [])

  const handleEdit = useCallback((certification: Certification) => {
    setFormData({ ...certification })
    setEditingId(certification.id)
  }, [])

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
          <h1 className="text-3xl font-bold tracking-tight">Certifications</h1>
          <p className="text-muted-foreground mt-2">
            Manage your professional certifications and credentials.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Certification' : 'Add New Certification'}
              </DialogTitle>
            </DialogHeader>
            <CertificationForm
              initialData={formData}
              editingId={editingId}
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
      ) : certifications.length === 0 ? (
        <Card className="glass">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center py-8">
              No certifications yet. Add one to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {certifications
            .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
            .map((cert) => (
              <Card key={cert.id} className="glass">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {cert.image && (
                        <img
                          src={cert.image}
                          alt={cert.name}
                          className="w-16 h-16 rounded mb-3 object-cover"
                        />
                      )}
                      <h3 className="font-semibold text-lg">{cert.name}</h3>
                      <p className="text-primary font-medium text-sm">{cert.organization}</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Issued:{' '}
                        {new Date(cert.issueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </p>
                      {cert.expiryDate && (
                        <p className="text-sm text-muted-foreground">
                          Expires:{' '}
                          {new Date(cert.expiryDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      )}
                      {cert.credentialId && (
                        <p className="text-sm text-muted-foreground">ID: {cert.credentialId}</p>
                      )}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1 mt-2"
                        >
                          Verify Credential
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={editDialogOpen === cert.id} onOpenChange={(open) => {
                        if (open) {
                          handleEdit(cert)
                          setEditDialogOpen(cert.id)
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
                            <DialogTitle>Edit Certification</DialogTitle>
                          </DialogHeader>
                          <CertificationForm
                            initialData={formData}
                            editingId={editingId}
                            isSaving={isSaving}
                            onSave={handleSave}
                          />
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Certification</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this certification? This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(cert.id)}
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
