'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Save, Layout, Type, Image, Table, Columns, Code, List, Quote, Square } from 'lucide-react'

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
}

const contentBlockTypes = [
  { value: 'text', label: 'Text', icon: Type },
  { value: 'heading', label: 'Heading', icon: Layout },
  { value: 'image', label: 'Image', icon: Image },
  { value: 'cards', label: 'Cards', icon: Square },
  { value: 'table', label: 'Table', icon: Table },
  { value: 'columns', label: 'Columns', icon: Columns },
  { value: 'custom-html', label: 'Custom HTML', icon: Code },
  { value: 'list', label: 'List', icon: List },
  { value: 'quote', label: 'Quote', icon: Quote },
]

export default function SectionBuilderPage() {
  const router = useRouter()
  const params = useParams()
  const [navTab, setNavTab] = useState<NavigationTab | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [previewMode, setPreviewMode] = useState(false)
  const [sectionContent, setSectionContent] = useState('')
  const [sectionType, setSectionType] = useState('text')

  useEffect(() => {
    if (params.id) {
      fetchNavTab()
    }
  }, [params.id])

  const fetchNavTab = async () => {
    try {
      const response = await fetch(`/api/navigation-tabs/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setNavTab(data)
        // Load existing content if any
        if (data.content) {
          try {
            const parsed = JSON.parse(data.content)
            if (parsed.content) {
              setSectionContent(parsed.content)
            }
            if (parsed.sectionType) {
              setSectionType(parsed.sectionType)
            }
          } catch (e) {
            // If not JSON, treat as plain text
            setSectionContent(data.content || '')
          }
        }
      }
    } catch (error) {
      console.error('Error fetching nav tab:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!navTab) return

    try {
      const response = await fetch(`/api/navigation-tabs/${navTab.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: JSON.stringify({ sectionType, content: sectionContent })
        }),
      })

      if (response.ok) {
        alert('Section saved successfully!')
      }
    } catch (error) {
      console.error('Error saving section:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!navTab) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Navigation item not found</h3>
            <Button onClick={() => router.push('/admin/navigation-manager')}>
              Back to Navigation Manager
            </Button>
          </CardContent>
        </Card>
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
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/admin/navigation-manager')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Section Builder: {navTab.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                /{navTab.slug}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant={previewMode ? "default" : "outline"} 
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? 'Edit Mode' : 'Preview'}
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Section
            </Button>
          </div>
        </div>

        {/* Content Type Selection */}
        <div className="mb-6">
          <Label className="mb-3 block">Content Type</Label>
          <div className="grid grid-cols-5 gap-3">
            {contentBlockTypes.map((blockType) => {
              const Icon = blockType.icon
              return (
                <button
                  key={blockType.value}
                  type="button"
                  onClick={() => setSectionType(blockType.value)}
                  className={`p-3 border rounded-lg text-center transition-all ${
                    sectionType === blockType.value 
                      ? 'border-primary bg-primary/10' 
                      : 'hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mx-auto mb-2" />
                  <div className="text-sm font-medium">{blockType.label}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Editor */}
        <Tabs defaultValue="content" className="w-full">
          <TabsList>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Section Content</CardTitle>
                <CardDescription>Enter the content for your section</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={sectionContent}
                  onChange={(e) => setSectionContent(e.target.value)}
                  placeholder={
                    sectionType === 'custom-html' 
                      ? '<div>Your HTML here...</div>' 
                      : 'Enter your content here...'
                  }
                  rows={15}
                  className="font-mono"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {sectionType === 'custom-html' 
                    ? 'Enter raw HTML code' 
                    : 'This content will be displayed on the page'}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>See how your section will look</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-8 min-h-[300px] bg-background">
                  {sectionType === 'custom-html' ? (
                    <div dangerouslySetInnerHTML={{ __html: sectionContent }} />
                  ) : (
                    <div className="prose dark:prose-invert max-w-none">
                      {sectionContent || (
                        <p className="text-muted-foreground">No content yet...</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
