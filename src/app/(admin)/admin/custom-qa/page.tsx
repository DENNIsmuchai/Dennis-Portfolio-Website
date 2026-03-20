'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Plus, Trash2, Check, X, MessageCircle, Zap } from 'lucide-react'

interface CustomQA {
  id: string
  question: string
  answer: string
  keywords: string
  isActive: boolean
  createdAt: string
}

export default function CustomQAPage() {
  const [qaList, setQaList] = useState<CustomQA[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    keywords: '',
    isActive: true
  })
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    fetchQA()
  }, [])

  const fetchQA = async () => {
    try {
      const response = await fetch('/api/custom-qa')
      if (response.ok) {
        const data = await response.json()
        setQaList(data)
      }
    } catch (error) {
      console.error('Error fetching Q&A:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAlert(null)

    try {
      const response = await fetch('/api/custom-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setAlert({ type: 'success', message: 'Q&A added successfully!' })
        setFormData({ question: '', answer: '', keywords: '', isActive: true })
        setShowForm(false)
        fetchQA()
      } else {
        const data = await response.json()
        setAlert({ type: 'error', message: data.error || 'Failed to add Q&A' })
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to add Q&A' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this Q&A?')) return

    try {
      const response = await fetch(`/api/custom-qa/${id}`, { method: 'DELETE' })
      if (response.ok) {
        setAlert({ type: 'success', message: 'Q&A deleted successfully!' })
        fetchQA()
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to delete Q&A' })
    }
  }

  const handleToggleActive = async (id: string, currentState: boolean) => {
    try {
      const response = await fetch(`/api/custom-qa/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentState })
      })
      if (response.ok) {
        fetchQA()
      }
    } catch (error) {
      console.error('Error toggling Q&A:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chat Q&A Control</h1>
          <p className="text-muted-foreground mt-2">
            Add custom Q&A pairs to control what the AI chatbox responds with. These take priority over AI responses.
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Custom Q&A
        </Button>
      </div>

      <Alert className="bg-blue-500/10 border-blue-500/20">
        <Zap className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-500">
          <strong>Super Admin:</strong> Custom Q&A responses are INSTANT and take priority over AI. 
          Add your most common questions here for the fastest responses!
        </AlertDescription>
      </Alert>

      {alert && (
        <Alert className={alert.type === 'success' ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}>
          <AlertDescription className={alert.type === 'success' ? 'text-green-500' : 'text-red-500'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      {showForm && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Add New Q&A</CardTitle>
            <CardDescription>Add a question and answer that the chatbox will respond with instantly</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Input
                  id="question"
                  placeholder="e.g., What is your experience with React?"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea
                  id="answer"
                  placeholder="Write the answer the chatbox should give..."
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="keywords">Keywords (comma separated)</Label>
                <Input
                  id="keywords"
                  placeholder="e.g., react, frontend, javascript, experience"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">
                  These keywords help match similar questions to this answer
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    id="active"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Check className="h-4 w-4 mr-2" />
                    Save Q&A
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Your Custom Q&A ({qaList.length})
          </CardTitle>
          <CardDescription>
            These Q&A pairs override AI responses and respond instantly
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : qaList.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No custom Q&A yet. Click "Add Custom Q&A" to create your first one!
            </p>
          ) : (
            <div className="space-y-4">
              {qaList.map((qa) => (
                <div
                  key={qa.id}
                  className={`p-4 rounded-lg border ${qa.isActive ? 'bg-card/50' : 'bg-muted/30 opacity-60'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{qa.question}</h3>
                        {!qa.isActive && (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded">Disabled</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{qa.answer}</p>
                      {qa.keywords && (
                        <p className="text-xs text-muted-foreground">
                          Keywords: {qa.keywords}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(qa.id, qa.isActive)}
                        title={qa.isActive ? 'Disable' : 'Enable'}
                      >
                        {qa.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(qa.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
