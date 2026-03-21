'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
import { Plus, Search, Edit2, Trash2, ExternalLink, Github, Star, GripVertical } from 'lucide-react'
import type { Project } from '@/types'

interface ProjectsManagerProps {
  initialProjects: Project[]
}

export function ProjectsManager({ initialProjects }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some((tech: string) =>
        tech.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

  const togglePublished = async (id: string, isPublished: boolean) => {
    setIsLoading(id)
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished }),
      })

      if (response.ok) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, isPublished: !isPublished } : p
          )
        )
      }
    } catch (error) {
      console.error('Error toggling project:', error)
    } finally {
      setIsLoading(null)
    }
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    setIsLoading(id)
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !featured }),
      })

      if (response.ok) {
        setProjects((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, featured: !featured } : p
          )
        )
      }
    } catch (error) {
      console.error('Error toggling featured:', error)
    } finally {
      setIsLoading(null)
    }
  }

  const deleteProject = async (id: string) => {
    setIsLoading(id)
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error('Error deleting project:', error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button asChild>
          <Link href="/admin/projects/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Link>
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="glass overflow-hidden group">
                {/* Image */}
                <div className="relative aspect-video">
                  <Image
                    src={project.image || '/placeholder-project.jpg'}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />

                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                      onClick={() => toggleFeatured(project.id, project.featured)}
                      disabled={isLoading === project.id}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          project.featured ? 'fill-yellow-500 text-yellow-500' : ''
                        }`}
                      />
                    </Button>
                  </div>

                  {/* Status */}
                  <div className="absolute bottom-2 left-2">
                    <Badge
                      variant={project.isPublished ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {project.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold mb-1">{project.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.techStack.slice(0, 3).map((tech: string) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.techStack.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.techStack.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={project.isPublished}
                        onCheckedChange={() =>
                          togglePublished(project.id, project.isPublished)
                        }
                        disabled={isLoading === project.id}
                      />
                      <span className="text-sm text-muted-foreground">
                        {project.isPublished ? 'Visible' : 'Hidden'}
                      </span>
                    </div>

                    <div className="flex gap-1">
                      {project.demoUrl && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={project.demoUrl} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <Link href={project.githubUrl} target="_blank">
                            <Github className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/admin/projects/${project.id}`}>
                          <Edit2 className="h-4 w-4" />
                        </Link>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Project</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{project.title}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteProject(project.id)}
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
          ))}
        </AnimatePresence>
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery ? 'No projects match your search.' : 'No projects yet. Create your first project!'}
          </p>
        </div>
      )}
    </div>
  )
}
