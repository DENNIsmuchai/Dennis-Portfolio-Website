'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileText, Download, Trash2, CheckCircle, Eye } from 'lucide-react'

interface ResumeFile {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number
  uploadedAt: string
}

export default function ResumePage() {
  const [resumes, setResumes] = useState<ResumeFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/resume')
      if (response.ok) {
        const data = await response.json()
        setResumes(data)
      }
    } catch (error) {
      console.error('Error fetching resumes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setIsUploading(true)
    setUploadSuccess(false)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/resume', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setUploadSuccess(true)
        await fetchResumes()
        setTimeout(() => setUploadSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error uploading resume:', error)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const deleteResume = async (id: string) => {
    try {
      const response = await fetch(`/api/resume/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchResumes()
      }
    } catch (error) {
      console.error('Error deleting resume:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume Manager</h1>
        <p className="text-muted-foreground mt-2">
          Upload and manage your resume. The active resume will be available for download on your website.
        </p>
      </div>

      {uploadSuccess && (
        <Alert className="bg-green-500/10 border-green-500/20">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-500">
            Resume uploaded successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Card */}
      <Card className="glass">
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-12 text-center">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Upload Resume</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your PDF resume here, or click to browse
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleUpload}
              disabled={isUploading}
              className="hidden"
              id="resume-upload"
            />
            <Label htmlFor="resume-upload">
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>{isUploading ? 'Uploading...' : 'Choose File'}</span>
              </Button>
            </Label>
            <p className="text-xs text-muted-foreground mt-4">
              Maximum file size: 5MB. PDF format only.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Resume List */}
      {isLoading ? (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Loading resumes...</p>
          </CardContent>
        </Card>
      ) : resumes.length > 0 ? (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Uploaded Resumes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resumes.map((resume, index) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{resume.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(resume.fileSize)} • {new Date(resume.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {index === 0 && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Active
                      </span>
                    )}
                    <Button variant="ghost" size="icon" asChild>
                      <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={resume.fileUrl} download>
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => deleteResume(resume.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass">
          <CardContent className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No resumes uploaded</h3>
            <p className="text-muted-foreground">
              Upload your resume to make it available for download on your website.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
