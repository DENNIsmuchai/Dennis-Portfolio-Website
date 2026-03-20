'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, AlertCircle, Upload, Image as ImageIcon, X } from 'lucide-react'

interface PersonalInfo {
  id?: string
  firstName: string
  lastName: string
  title: string
  tagline: string
  bio: string
  email: string
  phone?: string
  location?: string
  avatar?: string
  bannerImage?: string
  aboutImage?: string
  interests?: string
  resumeUrl?: string
}

const defaultInfo: PersonalInfo = {
  firstName: 'John',
  lastName: 'Doe',
  title: 'Full Stack Developer',
  tagline: 'I build exceptional digital experiences with modern technologies.',
  bio: 'Passionate developer with expertise in building modern web applications. I love creating elegant solutions to complex problems.',
  email: 'hello@example.com',
  phone: '',
  location: 'San Francisco, CA',
  avatar: '',
  bannerImage: '',
  aboutImage: '',
  interests: 'Web Development, AI/ML, Open Source, Design, Problem Solving',
  resumeUrl: '',
}

export default function PersonalInfoPage() {
  const [info, setInfo] = useState<PersonalInfo>(defaultInfo)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isBannerUploading, setIsBannerUploading] = useState(false)
  const [isAboutImageUploading, setIsAboutImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bannerFileInputRef = useRef<HTMLInputElement>(null)
  const aboutImageFileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchPersonalInfo()
  }, [])

  const fetchPersonalInfo = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/personal-info')
      if (response.ok) {
        const data = await response.json()
        setInfo(data)
      } else if (response.status === 404) {
        // No personal info exists yet, use defaults
        setInfo(defaultInfo)
      } else {
        setErrorMessage('Failed to load personal information')
      }
    } catch (error) {
      console.error('Error fetching personal info:', error)
      setErrorMessage('Failed to load personal information')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, WebP, or GIF)')
      setTimeout(() => setErrorMessage(''), 3000)
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Image must be less than 2MB')
      setTimeout(() => setErrorMessage(''), 3000)
      return
    }

    setIsUploading(true)
    setErrorMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'profiles')

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const imageUrl = data.url || data.fileUrl
        setInfo((prev) => ({ ...prev, avatar: imageUrl }))
        setSuccessMessage('Profile image uploaded successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.error || 'Failed to upload image')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      setErrorMessage('An error occurred while uploading the image')
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  const handleBannerClickUpload = () => {
    bannerFileInputRef.current?.click()
  }

  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, WebP, or GIF)')
      setTimeout(() => setErrorMessage(''), 3000)
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Image must be less than 2MB')
      setTimeout(() => setErrorMessage(''), 3000)
      return
    }

    setIsBannerUploading(true)
    setErrorMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'banners')

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const imageUrl = data.url || data.fileUrl
        setInfo((prev) => ({ ...prev, bannerImage: imageUrl }))
        setSuccessMessage('Banner image uploaded successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.error || 'Failed to upload banner')
      }
    } catch (error) {
      console.error('Error uploading banner:', error)
      setErrorMessage('An error occurred while uploading the banner')
    } finally {
      setIsBannerUploading(false)
      // Reset file input
      if (bannerFileInputRef.current) {
        bannerFileInputRef.current.value = ''
      }
    }
  }

  const handleAboutImageClickUpload = () => {
    aboutImageFileInputRef.current?.click()
  }

  const handleAboutImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, WebP, or GIF)')
      setTimeout(() => setErrorMessage(''), 3000)
      return
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage('Image must be less than 2MB')
      setTimeout(() => setErrorMessage(''), 3000)
      return
    }

    setIsAboutImageUploading(true)
    setErrorMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'about')

      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const imageUrl = data.url || data.fileUrl
        setInfo((prev) => ({ ...prev, aboutImage: imageUrl }))
        setSuccessMessage('About image uploaded successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.error || 'Failed to upload about image')
      }
    } catch (error) {
      console.error('Error uploading about image:', error)
      setErrorMessage('An error occurred while uploading the about image')
    } finally {
      setIsAboutImageUploading(false)
      // Reset file input
      if (aboutImageFileInputRef.current) {
        aboutImageFileInputRef.current.value = ''
      }
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const response = await fetch('/api/personal-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(info),
      })

      if (response.ok) {
        const data = await response.json()
        setInfo(data)
        setSuccessMessage('Personal information saved successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        const errorData = await response.json()
        setErrorMessage(errorData.error || 'Failed to save personal information')
      }
    } catch (error) {
      console.error('Error saving personal info:', error)
      setErrorMessage('An error occurred while saving')
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    setInfo((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Personal Information</h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile information and personal details.
        </p>
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

      {/* Profile Image Upload */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload a circular profile picture</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div
                onClick={handleClickUpload}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const file = e.dataTransfer.files[0]
                  if (file && fileInputRef.current) {
                    const dt = new DataTransfer()
                    dt.items.add(file)
                    fileInputRef.current.files = dt.files
                    const event = new Event('change', { bubbles: true })
                    fileInputRef.current.dispatchEvent(event)
                  }
                }}
                className="relative w-32 h-32 rounded-full overflow-hidden cursor-pointer border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors"
              >
                {info.avatar ? (
                  <img
                    src={info.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                  ) : (
                    <Upload className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>
              {info.avatar && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setInfo((prev) => ({ ...prev, avatar: '' }))
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageUpload}
              className="hidden"
            />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {info.avatar ? 'Click to change, X to remove' : 'Click or drag and drop to upload'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG, WebP or GIF (max 2MB)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banner Image Upload */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Cover/Banner Image</CardTitle>
          <CardDescription>Upload a rectangular cover image for your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="relative group w-full">
              <div
                onClick={handleBannerClickUpload}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const file = e.dataTransfer.files[0]
                  if (file && bannerFileInputRef.current) {
                    const dt = new DataTransfer()
                    dt.items.add(file)
                    bannerFileInputRef.current.files = dt.files
                    const event = new Event('change', { bubbles: true })
                    bannerFileInputRef.current.dispatchEvent(event)
                  }
                }}
                className="relative w-full h-40 rounded-lg overflow-hidden cursor-pointer border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors"
              >
                {info.bannerImage ? (
                  <img
                    src={info.bannerImage}
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ImageIcon className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isBannerUploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                  ) : (
                    <Upload className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>
              {info.bannerImage && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setInfo((prev) => ({ ...prev, bannerImage: '' }))
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <input
              ref={bannerFileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleBannerImageUpload}
              className="hidden"
            />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {info.bannerImage ? 'Click to change, X to remove' : 'Click or drag and drop to upload'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG, WebP or GIF (max 2MB)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Section Image Upload */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>About Section Image</CardTitle>
          <CardDescription>Upload a square image for the About section (separate from profile picture)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div
                onClick={handleAboutImageClickUpload}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const file = e.dataTransfer.files[0]
                  if (file && aboutImageFileInputRef.current) {
                    const dt = new DataTransfer()
                    dt.items.add(file)
                    aboutImageFileInputRef.current.files = dt.files
                    const event = new Event('change', { bubbles: true })
                    aboutImageFileInputRef.current.dispatchEvent(event)
                  }
                }}
                className="relative w-40 h-40 rounded-lg overflow-hidden cursor-pointer border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors"
              >
                {info.aboutImage ? (
                  <img
                    src={info.aboutImage}
                    alt="About"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-4xl font-bold text-muted-foreground">A</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isAboutImageUploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                  ) : (
                    <Upload className="w-8 h-8 text-white" />
                  )}
                </div>
              </div>
              {info.aboutImage && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setInfo((prev) => ({ ...prev, aboutImage: '' }))
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <input
              ref={aboutImageFileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleAboutImageUpload}
              className="hidden"
            />
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {info.aboutImage ? 'Click to change, X to remove' : 'Click or drag and drop to upload'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG, WebP or GIF (max 2MB)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Edit your name and professional title</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={info.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={info.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input
                id="title"
                value={info.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Full Stack Developer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={info.tagline}
                onChange={(e) => handleChange('tagline', e.target.value)}
                placeholder="Your professional tagline"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Update your contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={info.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="hello@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={info.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={info.location || ''}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="San Francisco, CA"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Biography</CardTitle>
          <CardDescription>Write a detailed biography about yourself</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={info.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              placeholder="Tell us about yourself..."
              rows={5}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Additional Links</CardTitle>
          <CardDescription>Add links to your avatar and resume</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                type="url"
                value={info.avatar || ''}
                onChange={(e) => handleChange('avatar', e.target.value)}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resumeUrl">Resume URL</Label>
              <Input
                id="resumeUrl"
                type="url"
                value={info.resumeUrl || ''}
                onChange={(e) => handleChange('resumeUrl', e.target.value)}
                placeholder="https://example.com/resume.pdf"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Interests</Label>
              <Input
                id="interests"
                value={info.interests || ''}
                onChange={(e) => handleChange('interests', e.target.value)}
                placeholder="Web Development, AI/ML, Open Source, Design, Problem Solving"
              />
              <p className="text-xs text-muted-foreground">
                Separate interests with commas
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={fetchPersonalInfo}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving} className="bg-primary">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </motion.div>
  )
}
