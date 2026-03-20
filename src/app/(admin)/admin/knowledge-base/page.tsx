'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BookOpen, Plus, Trash2, Search, FileText, Link, Upload, 
  File, FileSpreadsheet, FileImage, FolderOpen, Tag, Eye, Loader2
} from 'lucide-react'

interface KnowledgeDocument {
  id: string
  title: string
  content: string
  summary: string | null
  documentType: string
  fileUrl: string | null
  fileName: string | null
  sourceUrl: string | null
  tags: string | null
  categoryId: string | null
  isIndexed: boolean
  views: number
  createdAt: string
}

interface KnowledgeCategory {
  id: string
  name: string
  description: string | null
  color: string
  order: number
}

const documentTypes = [
  { value: 'text', label: 'Text', icon: FileText },
  { value: 'pdf', label: 'PDF', icon: File },
  { value: 'docx', label: 'Word', icon: FileText },
  { value: 'xlsx', label: 'Spreadsheet', icon: FileSpreadsheet },
  { value: 'markdown', label: 'Markdown', icon: FileText },
  { value: 'url', label: 'URL', icon: Link },
]

const defaultCategories: KnowledgeCategory[] = [
  { id: '1', name: 'Research Papers', description: 'Academic and research documents', color: '#3b82f6', order: 0 },
  { id: '2', name: 'Financial Models', description: 'Investment and financial analysis', color: '#10b981', order: 1 },
  { id: '3', name: 'Technical Docs', description: 'Technical documentation', color: '#8b5cf6', order: 2 },
  { id: '4', name: 'Bookmarks', description: 'Saved URLs and links', color: '#f59e0b', order: 3 },
]

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [categories, setCategories] = useState<KnowledgeCategory[]>(defaultCategories)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newDoc, setNewDoc] = useState({
    title: '',
    content: '',
    summary: '',
    documentType: 'text',
    sourceUrl: '',
    tags: '',
    categoryId: '',
  })
  const [activeTab, setActiveTab] = useState('documents')

  useEffect(() => {
    fetchDocuments()
  }, [searchQuery, selectedCategory])

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory) params.set('categoryId', selectedCategory)
      if (searchQuery) params.set('search', searchQuery)
      
      const response = await fetch(`/api/knowledge-base?${params}`)
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents || [])
        if (data.categories?.length > 0) {
          setCategories(data.categories)
        }
      }
    } catch (error) {
      console.error('Error fetching documents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/knowledge-base', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newDoc,
          categoryId: newDoc.categoryId || null,
        }),
      })

      if (response.ok) {
        setIsCreateOpen(false)
        setNewDoc({
          title: '',
          content: '',
          summary: '',
          documentType: 'text',
          sourceUrl: '',
          tags: '',
          categoryId: '',
        })
        fetchDocuments()
      }
    } catch (error) {
      console.error('Error creating document:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/knowledge-base/${id}`, { method: 'DELETE' })
      fetchDocuments()
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  const getDocTypeIcon = (type: string) => {
    const docType = documentTypes.find(dt => dt.value === type)
    const Icon = docType?.icon || FileText
    return <Icon className="h-5 w-5" />
  }

  const filteredDocuments = documents.filter(doc => {
    if (selectedCategory && doc.categoryId !== selectedCategory) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        doc.title.toLowerCase().includes(query) ||
        doc.content.toLowerCase().includes(query) ||
        doc.tags?.toLowerCase().includes(query)
      )
    }
    return true
  })

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Knowledge Base</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage documents for AI assistant reference
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" /> Add Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Document</DialogTitle>
                <DialogDescription>
                  Add a document to the AI knowledge base
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newDoc.title}
                    onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                    placeholder="Document title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Type</Label>
                    <select
                      id="documentType"
                      value={newDoc.documentType}
                      onChange={(e) => setNewDoc({ ...newDoc, documentType: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      {documentTypes.map(dt => (
                        <option key={dt.value} value={dt.value}>{dt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={newDoc.categoryId}
                      onChange={(e) => setNewDoc({ ...newDoc, categoryId: e.target.value })}
                      className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sourceUrl">Source URL (optional)</Label>
                  <Input
                    id="sourceUrl"
                    value={newDoc.sourceUrl}
                    onChange={(e) => setNewDoc({ ...newDoc, sourceUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={newDoc.content}
                    onChange={(e) => setNewDoc({ ...newDoc, content: e.target.value })}
                    placeholder="Enter document content..."
                    rows={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={newDoc.tags}
                    onChange={(e) => setNewDoc({ ...newDoc, tags: e.target.value })}
                    placeholder="finance, research, ai"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreate}>Add Document</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
              {category.name}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocuments.map(doc => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {getDocTypeIcon(doc.documentType)}
                      </div>
                      <div>
                        <CardTitle className="text-base">{doc.title}</CardTitle>
                        <CardDescription className="text-xs">{doc.documentType.toUpperCase()}</CardDescription>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Document</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this document? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(doc.id)} className="bg-red-600">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {doc.summary && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                      {doc.summary}
                    </p>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    {doc.tags?.split(',').map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Eye className="h-3 w-3" /> {doc.views} views
                    </div>
                    {doc.isIndexed && (
                      <Badge variant="default" className="text-xs bg-green-500">Indexed</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No documents found</h3>
            <p className="text-gray-500 mb-4">Add your first document to the knowledge base</p>
            <Button onClick={() => setIsCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Document
            </Button>
          </Card>
        )}
      </motion.div>
    </div>
  )
}
