'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, AlertCircle, X, FileText, BookOpen, Code, FlaskConical, Briefcase, Lightbulb } from 'lucide-react'

const projectTypes = [
  { value: 'standard', label: 'Standard Project', icon: FileText, description: 'Regular project showcase' },
  { value: 'case-study', label: 'Case Study', icon: BookOpen, description: 'Detailed case study with problem/solution' },
  { value: 'tutorial', label: 'Tutorial', icon: Code, description: 'Step-by-step tutorial or guide' },
  { value: 'research', label: 'Research Paper', icon: FlaskConical, description: 'Research or academic work' },
  { value: 'portfolio', label: 'Portfolio Item', icon: Briefcase, description: 'Work sample or portfolio piece' },
  { value: 'idea', label: 'Idea/Concept', icon: Lightbulb, description: 'Idea or concept exploration' },
]

export default function NewProjectPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [techStackInput, setTechStackInput] = useState('')
  const [projectType, setProjectType] = useState('standard')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    image: '',
    images: '',
    githubUrl: '',
    demoUrl: '',
    techStack: [] as string[],
    featured: false,
    isPublished: false,
    // Fields for different project types
    challenge: '',      // For case-study
    solution: '',       // For case-study
    results: '',        // For case-study
    prerequisites: '',  // For tutorial
    steps: '',          // For tutorial
    methodology: '',    // For research
    findings: '',       // For research
    tools: '',          // For portfolio
    role: '',           // For portfolio
    inspiration: '',    // For idea
    futurePlans: '',    // For idea
  })

  const handleAddTech = (tech: string) => {
    if (tech.trim() && !formData.techStack.includes(tech.trim())) {
      setFormData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, tech.trim()],
      }))
      setTechStackInput('')
    }
  }

  const handleRemoveTech = (tech: string) => {
    setFormData((prev) => ({
      ...prev,
      techStack: prev.techStack.filter((t) => t !== tech),
    }))
  }

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      setErrorMessage('Title and description are required')
      return
    }

    setIsSaving(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          contentType: projectType,
        }),
      })

      if (response.ok) {
        setSuccessMessage('Project created successfully!')
        setTimeout(() => {
          router.push('/admin/projects')
          router.refresh()
        }, 1500)
      } else {
        const error = await response.json()
        setErrorMessage(error.error || 'Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      setErrorMessage('An error occurred while creating the project')
    } finally {
      setIsSaving(false)
    }
  }

  // Render dynamic fields based on project type
  const renderTypeSpecificFields = () => {
    switch (projectType) {
      case 'case-study':
        return (
          <Card className="glass">
            <CardHeader>
              <CardTitle>Case Study Details</CardTitle>
              <CardDescription>Specific fields for case study content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="challenge">The Challenge</Label>
                <Textarea
                  id="challenge"
                  value={formData.challenge}
                  onChange={(e) => setFormData((prev) => ({ ...prev, challenge: e.target.value }))}
                  placeholder="What problem were you solving?"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="solution">The Solution</Label>
                <Textarea
                  id="solution"
                  value={formData.solution}
                  onChange={(e) => setFormData((prev) => ({ ...prev, solution: e.target.value }))}
                  placeholder="How did you solve it?"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="results">Results & Impact</Label>
                <Textarea
                  id="results"
                  value={formData.results}
                  onChange={(e) => setFormData((prev) => ({ ...prev, results: e.target.value }))}
                  placeholder="What were the outcomes?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 'tutorial':
        return (
          <Card className="glass">
            <CardHeader>
              <CardTitle>Tutorial Details</CardTitle>
              <CardDescription>Specific fields for tutorial content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prerequisites">Prerequisites</Label>
                <Textarea
                  id="prerequisites"
                  value={formData.prerequisites}
                  onChange={(e) => setFormData((prev) => ({ ...prev, prerequisites: e.target.value }))}
                  placeholder="What does the reader need to know before starting?"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="steps">Tutorial Steps</Label>
                <Textarea
                  id="steps"
                  value={formData.steps}
                  onChange={(e) => setFormData((prev) => ({ ...prev, steps: e.target.value }))}
                  placeholder="Step-by-step instructions..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 'research':
        return (
          <Card className="glass">
            <CardHeader>
              <CardTitle>Research Details</CardTitle>
              <CardDescription>Specific fields for research content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="methodology">Methodology</Label>
                <Textarea
                  id="methodology"
                  value={formData.methodology}
                  onChange={(e) => setFormData((prev) => ({ ...prev, methodology: e.target.value }))}
                  placeholder="Research methodology used..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="findings">Key Findings</Label>
                <Textarea
                  id="findings"
                  value={formData.findings}
                  onChange={(e) => setFormData((prev) => ({ ...prev, findings: e.target.value }))}
                  placeholder="Main findings from the research..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 'portfolio':
        return (
          <Card className="glass">
            <CardHeader>
              <CardTitle>Portfolio Details</CardTitle>
              <CardDescription>Specific fields for portfolio items</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tools">Tools & Technologies Used</Label>
                <Textarea
                  id="tools"
                  value={formData.tools}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tools: e.target.value }))}
                  placeholder="Tools, software, and technologies used..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Your Role</Label>
                <Textarea
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value }))}
                  placeholder="What was your role in this project?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )

      case 'idea':
        return (
          <Card className="glass">
            <CardHeader>
              <CardTitle>Idea Details</CardTitle>
              <CardDescription>Specific fields for ideas/concepts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="inspiration">Inspiration</Label>
                <Textarea
                  id="inspiration"
                  value={formData.inspiration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, inspiration: e.target.value }))}
                  placeholder="What inspired this idea?"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="futurePlans">Future Plans</Label>
                <Textarea
                  id="futurePlans"
                  value={formData.futurePlans}
                  onChange={(e) => setFormData((prev) => ({ ...prev, futurePlans: e.target.value }))}
                  placeholder="How do you plan to develop this idea?"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
        <p className="text-muted-foreground mt-2">
          Add a new project to your portfolio showcase.
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

      {/* Project Type Selection */}
      <Card className="glass">
        <CardHeader>
          <CardTitle>Project Type</CardTitle>
          <CardDescription>Select the type of project you're adding</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {projectTypes.map((type) => {
              const TypeIcon = type.icon
              return (
                <button
                  key={type.value}
                  onClick={() => setProjectType(type.value)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    projectType === type.value
                      ? 'border-primary bg-primary/10 ring-2 ring-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <TypeIcon className="h-4 w-4" />
                    <span className="font-medium text-sm">{type.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
              <CardDescription>Basic information about your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData((prev) => ({ 
                      ...prev, 
                      title: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                    }))
                  }}
                  placeholder="e.g., E-Commerce Platform"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                  placeholder="e-commerce-platform"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Brief description of the project"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Detailed Description</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="More detailed information about the project..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Type-specific fields */}
          {renderTypeSpecificFields()}

          <Card className="glass">
            <CardHeader>
              <CardTitle>Links</CardTitle>
              <CardDescription>Project URLs and links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Project Image URL</Label>
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/project-image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demoUrl">Demo URL</Label>
                <Input
                  id="demoUrl"
                  type="url"
                  value={formData.demoUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, demoUrl: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  type="url"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))}
                  placeholder="https://github.com/username/project"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
              <CardDescription>Technologies used in this project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddTech(techStackInput)
                      }
                    }}
                    placeholder="e.g., React, Node.js, PostgreSQL"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleAddTech(techStackInput)}
                    className="px-3"
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.techStack.map((tech) => (
                  <Badge key={tech} variant="outline" className="gap-1">
                    {tech}
                    <button
                      onClick={() => handleRemoveTech(tech)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              {formData.techStack.length === 0 && (
                <p className="text-sm text-muted-foreground">No technologies added yet</p>
              )}
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>Visibility and featured settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="published">Published</Label>
                  <p className="text-sm text-muted-foreground">
                    Make this project visible on your website
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isPublished: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="featured">Featured</Label>
                  <p className="text-sm text-muted-foreground">
                    Highlight this as a featured project
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, featured: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1"
            >
              {isSaving ? 'Creating...' : 'Create Project'}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
