'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Plus, Edit2, Trash2, CheckCircle, AlertCircle, GripVertical } from 'lucide-react'
import { Reorder } from 'framer-motion'

interface SocialLink {
  id: string
  platform: string
  url: string
  icon?: string
  isVisible: boolean
  order: number
}

const platformSuggestions = [
  { name: 'GitHub', icon: 'github' },
  { name: 'LinkedIn', icon: 'linkedin' },
  { name: 'Twitter', icon: 'twitter' },
  { name: 'Instagram', icon: 'instagram' },
  { name: 'Facebook', icon: 'facebook' },
  { name: 'YouTube', icon: 'youtube' },
  { name: 'Portfolio', icon: 'globe' },
  { name: 'Email', icon: 'mail' },
]

export default function SocialLinksPage() {
  const [links, setLinks] = useState<SocialLink[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<SocialLink>>({
    platform: '',
    url: '',
    icon: '',
    isVisible: true,
  })

  useEffect(() => {
    fetchSocialLinks()
  }, [])

  const fetchSocialLinks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/social-links')
      if (response.ok) {
        const data = await response.json()
        setLinks(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching social links:', error)
      setErrorMessage('Failed to load social links')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.platform || !formData.url) {
      setErrorMessage('Platform and URL are required')
      return
    }

    try {
      const url = editingId ? `/api/social-links/${editingId}` : '/api/social-links'
      const method = editingId ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        if (editingId) {
          setLinks((prev) => prev.map((l) => (l.id === editingId ? data : l)))
        } else {
          setLinks((prev) => [...prev, data])
        }
        resetForm()
        setSuccessMessage('Social link saved successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error saving social link:', error)
      setErrorMessage('Failed to save social link')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/social-links/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setLinks((prev) => prev.filter((l) => l.id !== id))
        setSuccessMessage('Social link deleted successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error deleting social link:', error)
      setErrorMessage('Failed to delete social link')
    }
  }

  const handleToggleVisibility = async (link: SocialLink) => {
    try {
      const response = await fetch(`/api/social-links/${link.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !link.isVisible }),
      })

      if (response.ok) {
        setLinks((prev) =>
          prev.map((l) => (l.id === link.id ? { ...l, isVisible: !l.isVisible } : l))
        )
      }
    } catch (error) {
      console.error('Error toggling visibility:', error)
    }
  }

  const handleReorder = async (newOrder: SocialLink[]) => {
    setLinks(newOrder)
    const orderUpdates = newOrder.map((link, index) => ({
      id: link.id,
      order: index,
    }))

    try {
      await fetch('/api/social-links/reorder', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: orderUpdates }),
      })
    } catch (error) {
      console.error('Error reordering:', error)
    }
  }

  const resetForm = () => {
    setFormData({
      platform: '',
      url: '',
      icon: '',
      isVisible: true,
    })
    setEditingId(null)
  }

  const handleEdit = (link: SocialLink) => {
    setFormData(link)
    setEditingId(link.id)
  }

  const SocialLinkForm = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="platform">Platform Name</Label>
          <div className="flex gap-2">
            <Input
              id="platform"
              value={formData.platform || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, platform: e.target.value }))}
              placeholder="GitHub"
            />
            <Button
              type="button"
              variant="outline"
              className="px-3"
              onClick={() => {
                const platform = formData.platform || ''
                const suggestion = platformSuggestions.find(
                  (s) => s.name.toLowerCase() === platform.toLowerCase()
                )
                if (suggestion) {
                  setFormData((prev) => ({ ...prev, icon: suggestion.icon }))
                }
              }}
            >
              Auto
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {platformSuggestions.map((p) => (
              <button
                key={p.name}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, platform: p.name, icon: p.icon }))
                }
                className="text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon">Icon Name</Label>
          <Input
            id="icon"
            value={formData.icon || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
            placeholder="github"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          type="url"
          value={formData.url || ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
          placeholder="https://github.com/yourname"
        />
      </div>

      <Button onClick={handleSave} className="w-full">
        {editingId ? 'Update Link' : 'Add Link'}
      </Button>
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Links</h1>
          <p className="text-muted-foreground mt-2">
            Manage your social media and external profile links.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Link
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Edit Social Link' : 'Add New Social Link'}
              </DialogTitle>
            </DialogHeader>
            <SocialLinkForm />
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
      ) : links.length === 0 ? (
        <Card className="glass">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center py-8">
              No social links yet. Add one to get started!
            </p>
          </CardContent>
        </Card>
      ) : (
        <Reorder.Group axis="y" values={links} onReorder={handleReorder} className="space-y-3">
          {links.map((link) => (
            <Reorder.Item key={link.id} value={link}>
              <Card className="glass">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab active:cursor-grabbing" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{link.platform}</h3>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-600 truncate"
                      >
                        {link.url}
                      </a>
                      {link.icon && <p className="text-xs text-muted-foreground mt-1">Icon: {link.icon}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={link.isVisible}
                        onCheckedChange={() => handleToggleVisibility(link)}
                      />
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(link)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Social Link</DialogTitle>
                          </DialogHeader>
                          <SocialLinkForm />
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
                            <AlertDialogTitle>Delete Social Link</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this social link? This action cannot
                              be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(link.id)}
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
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </motion.div>
  )
}
