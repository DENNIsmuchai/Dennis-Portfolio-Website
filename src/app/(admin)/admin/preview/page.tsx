'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { RefreshCw, ExternalLink, Loader2 } from 'lucide-react'

interface PreviewData {
  personalInfo: any
  sections: any[]
  projects: any[]
  skills: any[]
  experience: any[]
  education: any[]
  certifications: any[]
  blogPosts: any[]
  socialLinks: any[]
  theme: any
  resume: any
}

export default function PreviewPage() {
  const [data, setData] = useState<PreviewData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      const response = await fetch('/api/preview')
      if (response.ok) {
        const result = await response.json()
        setData(result)
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Error fetching preview data:', error)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
    
    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      setIsRefreshing(true)
      fetchData()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Preview</h1>
          <p className="text-muted-foreground mt-2">
            See how your website looks in real-time. Updates automatically every 5 seconds.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setIsRefreshing(true)
              fetchData()
            }}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button variant="default" size="sm" asChild>
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Site
            </a>
          </Button>
        </div>
      </div>

      {/* Last Updated */}
      {lastUpdated && (
        <div className="text-sm text-muted-foreground">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {/* Preview Content */}
      <div className="grid gap-6">
        {/* Personal Info */}
        {data?.personalInfo && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold">{data.personalInfo.name}</h2>
              <p className="text-muted-foreground">{data.personalInfo.title}</p>
              <p className="mt-2">{data.personalInfo.bio}</p>
            </CardContent>
          </Card>
        )}

        {/* Projects */}
        {data?.projects && data.projects.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Projects ({data.projects.length})</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {data.projects.slice(0, 4).map((project: any) => (
                  <div key={project.id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Experience */}
        {data?.experience && data.experience.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Experience ({data.experience.length})</h2>
              <div className="space-y-4">
                {data.experience.slice(0, 3).map((exp: any) => (
                  <div key={exp.id} className="border-l-2 pl-4">
                    <h3 className="font-semibold">{exp.position}</h3>
                    <p className="text-sm text-muted-foreground">{exp.company}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Education */}
        {data?.education && data.education.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Education ({data.education.length})</h2>
              <div className="space-y-4">
                {data.education.slice(0, 3).map((edu: any) => (
                  <div key={edu.id} className="border-l-2 pl-4">
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Skills */}
        {data?.skills && data.skills.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Skills ({data.skills.length})</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.slice(0, 10).map((skill: any) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.name} ({skill.proficiency}%)
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blog */}
        {data?.blogPosts && data.blogPosts.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Blog Posts ({data.blogPosts.length})</h2>
              <div className="space-y-2">
                {data.blogPosts.slice(0, 3).map((post: any) => (
                  <div key={post.id} className="border-l-2 pl-4">
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {post.excerpt}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Certifications */}
        {data?.certifications && data.certifications.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Certifications ({data.certifications.length})</h2>
              <div className="space-y-2">
                {data.certifications.slice(0, 3).map((cert: any) => (
                  <div key={cert.id} className="border-l-2 pl-4">
                    <h3 className="font-semibold">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Social Links */}
        {data?.socialLinks && data.socialLinks.length > 0 && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Social Links ({data.socialLinks.length})</h2>
              <div className="flex flex-wrap gap-2">
                {data.socialLinks.map((link: any) => (
                  <Badge key={link.id} variant="outline">
                    {link.platform}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sections */}
        {data?.sections && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Website Sections ({data.sections.length} enabled)</h2>
              <div className="flex flex-wrap gap-2">
                {data.sections.map((section: any) => (
                  <Badge key={section.id} className={section.isVisible ? 'bg-green-500' : ''}>
                    {section.title}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resume */}
        {data?.resume && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Resume</h2>
              <p className="text-green-500">✓ Resume uploaded and active</p>
            </CardContent>
          </Card>
        )}

        {/* Theme */}
        {data?.theme && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Theme Settings</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Color Palette</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg border-2" 
                        style={{ backgroundColor: data.theme.primaryColor }}
                      />
                      <div>
                        <p className="font-medium">Primary</p>
                        <p className="text-sm text-muted-foreground">{data.theme.primaryColor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg border-2" 
                        style={{ backgroundColor: data.theme.secondaryColor }}
                      />
                      <div>
                        <p className="font-medium">Secondary</p>
                        <p className="text-sm text-muted-foreground">{data.theme.secondaryColor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg border-2" 
                        style={{ backgroundColor: data.theme.accentColor }}
                      />
                      <div>
                        <p className="font-medium">Accent</p>
                        <p className="text-sm text-muted-foreground">{data.theme.accentColor}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg border-2" 
                        style={{ backgroundColor: data.theme.backgroundColor }}
                      />
                      <div>
                        <p className="font-medium">Background</p>
                        <p className="text-sm text-muted-foreground">{data.theme.backgroundColor}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Theme Preview</h3>
                  <div 
                    className="rounded-lg p-4 space-y-3"
                    style={{ backgroundColor: data.theme.surfaceColor }}
                  >
                    <h4 
                      className="text-lg font-bold"
                      style={{ color: data.theme.primaryColor }}
                    >
                      Sample Heading
                    </h4>
                    <p style={{ color: data.theme.textColor }}>
                      This is sample body text showing how your content will appear.
                    </p>
                    <p className="text-sm" style={{ color: data.theme.mutedColor }}>
                      This is muted/subtitle text for secondary information.
                    </p>
                    <div className="flex gap-2 pt-2">
                      <button
                        className="px-3 py-1.5 rounded text-white text-sm font-medium"
                        style={{ backgroundColor: data.theme.primaryColor }}
                      >
                        Primary
                      </button>
                      <button
                        className="px-3 py-1.5 rounded text-white text-sm font-medium"
                        style={{ backgroundColor: data.theme.secondaryColor }}
                      >
                        Secondary
                      </button>
                      <button
                        className="px-3 py-1.5 rounded text-white text-sm font-medium"
                        style={{ backgroundColor: data.theme.accentColor }}
                      >
                        Accent
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex gap-4 text-sm">
                <span>Dark Mode: <span className="font-medium">{data.theme.isDarkMode ? 'Enabled' : 'Disabled'}</span></span>
                <span>Font: <span className="font-medium capitalize">{data.theme.fontFamily}</span></span>
                <span>Animation: <span className="font-medium capitalize">{data.theme.animationIntensity}</span></span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
