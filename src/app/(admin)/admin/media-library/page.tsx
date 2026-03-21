'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Upload, FolderPlus, Image, FileText, Video, Music, Archive, 
  Grid, List, Search, Trash2, Download, Edit, X, Folder, 
  ChevronRight, Home, Check, Loader2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface MediaFile {
  id: string
  name: string
  originalName: string
  mimeType: string
  size: number
  url: string
  thumbnailUrl: string | null
  width: number | null
  height: number | null
  tags: string | null
  altText: string | null
  usageCount: number
  createdAt: string
}

interface MediaFolder {
  id: string
  name: string
  parentId: string | null
  order: number
}

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [folders, setFolders] = useState<MediaFolder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<{id: string | null, name: string}[]>([{id: null, name: 'Root'}])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingFile, setEditingFile] = useState<MediaFile | null>(null)

  useEffect(() => {
    fetchMedia()
  }, [currentFolderId, searchQuery])

  const fetchMedia = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (currentFolderId) params.set('folderId', currentFolderId)
      if (searchQuery) params.set('search', searchQuery)
      
      const response = await fetch(`/api/media?${params}`)
      if (response.ok) {
        const data = await response.json()
        setFiles(data.files || [])
        setFolders(data.folders || [])
      }
    } catch (error) {
      console.error('Error fetching media:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files
    if (!uploadedFiles || uploadedFiles.length === 0) return

    setIsUploading(true)
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i]
      const formData = new FormData()
      formData.append('file', file)
      if (currentFolderId) formData.append('folderId', currentFolderId)

      try {
        await fetch('/api/media', {
          method: 'POST',
          body: formData,
        })
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }

    setIsUploading(false)
    fetchMedia()
  }

  const handleDeleteFile = async (id: string) => {
    try {
      await fetch(`/api/media?id=${id}`, { method: 'DELETE' })
      fetchMedia()
    } catch (error) {
      console.error('Error deleting file:', error)
    }
  }

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return
    
    try {
      const response = await fetch('/api/media-folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newFolderName, parentId: currentFolderId }),
      })
      
      if (response.ok) {
        setIsCreateFolderOpen(false)
        setNewFolderName('')
        fetchMedia()
      }
    } catch (error) {
      console.error('Error creating folder:', error)
    }
  }

  const navigateToFolder = (folderId: string | null, folderName: string) => {
    setCurrentFolderId(folderId)
    const newBreadcrumbs = [{id: null, name: 'Root'}]
    
    if (folderId === null) {
      setBreadcrumbs(newBreadcrumbs)
    } else {
      // Find the folder in current breadcrumbs and truncate
      const index = breadcrumbs.findIndex(b => b.id === folderId)
      if (index >= 0) {
        setBreadcrumbs([...breadcrumbs.slice(0, index + 1), {id: folderId, name: folderName}])
      } else {
        setBreadcrumbs([...breadcrumbs, {id: folderId, name: folderName}])
      }
    }
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-8 w-8 text-green-500" />
    if (mimeType.startsWith('video/')) return <Video className="h-8 w-8 text-red-500" />
    if (mimeType.startsWith('audio/')) return <Music className="h-8 w-8 text-purple-500" />
    if (mimeType.includes('pdf') || mimeType.includes('document')) return <FileText className="h-8 w-8 text-blue-500" />
    if (mimeType.includes('zip') || mimeType.includes('archive')) return <Archive className="h-8 w-8 text-yellow-500" />
    return <FileText className="h-8 w-8 text-gray-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const toggleFileSelection = (id: string) => {
    setSelectedFiles(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Media Library</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your files and media assets
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsCreateFolderOpen(true)}>
              <FolderPlus className="mr-2 h-4 w-4" /> New Folder
            </Button>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <span className="cursor-pointer">
                <Button>
                  <Upload className="mr-2 h-4 w-4" /> Upload Files
                </Button>
              </span>
              <input
                id="file-upload"
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </Label>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-2 mb-6">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateToFolder(crumb.id, crumb.name)}
              >
                {index === 0 ? <Home className="h-4 w-4 mr-1" /> : null}
                {crumb.name}
              </Button>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            {folders.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                {folders.map((folder) => (
                  <Card 
                    key={folder.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => navigateToFolder(folder.id, folder.name)}
                  >
                    <CardContent className="p-4 flex flex-col items-center">
                      <Folder className="h-12 w-12 text-yellow-500 mb-2" />
                      <p className="text-sm font-medium text-center truncate w-full">{folder.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {files.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {files.map((file) => (
                    <Card 
                      key={file.id} 
                      className={`cursor-pointer hover:shadow-lg transition-shadow ${selectedFiles.includes(file.id) ? 'ring-2 ring-primary' : ''}`}
                      onClick={() => toggleFileSelection(file.id)}
                    >
                      <CardContent className="p-2">
                        {file.mimeType.startsWith('image/') ? (
                          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden mb-2">
                            <img src={file.url} alt={file.altText || file.originalName} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center mb-2">
                            {getFileIcon(file.mimeType)}
                          </div>
                        )}
                        <p className="text-xs truncate font-medium">{file.originalName}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {files.map((file) => (
                        <div 
                          key={file.id} 
                          className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedFiles.includes(file.id) ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
                          onClick={() => toggleFileSelection(file.id)}
                        >
                          <div className="flex items-center gap-4">
                            {file.mimeType.startsWith('image/') ? (
                              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                                <img src={file.url} alt={file.altText || file.originalName} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                                {getFileIcon(file.mimeType)}
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{file.originalName}</p>
                              <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{file.mimeType.split('/')[1]}</Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => window.open(file.url, '_blank')}>
                                  <Download className="mr-2 h-4 w-4" /> Download
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDeleteFile(file.id)
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            ) : (
              <Card className="p-12 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No files yet</h3>
                <p className="text-gray-500 mb-4">Upload your first file to get started</p>
                <Label htmlFor="file-upload-empty" className="cursor-pointer">
                  <span className="cursor-pointer">
                    <Button>
                      <Upload className="mr-2 h-4 w-4" /> Upload Files
                    </Button>
                  </span>
                  <input
                    id="file-upload-empty"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </Label>
              </Card>
            )}
          </>
        )}

        <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateFolder}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  )
}
