'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { CheckCircle, AlertCircle, Mail, CheckCheck, Trash2, Eye } from 'lucide-react'

interface ContactMessage {
  id: string
  name: string
  email: string
  subject?: string
  message: string
  isRead: boolean
  createdAt: string
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/contact')
      if (response.ok) {
        const data = await response.json()
        setMessages(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
      setErrorMessage('Failed to load messages')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true }),
      })

      if (response.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
        )
        if (selectedMessage && selectedMessage.id === id) {
          setSelectedMessage({ ...selectedMessage, isRead: true })
        }
      }
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id))
        setSelectedMessage(null)
        setSuccessMessage('Message deleted successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Error deleting message:', error)
      setErrorMessage('Failed to delete message')
    }
  }

  const unreadCount = messages.filter((m) => !m.isRead).length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
        <p className="text-muted-foreground mt-2">
          View and manage messages from your contact form.
        </p>
        {unreadCount > 0 && (
          <div className="mt-4 inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-sm">
            {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
          </div>
        )}
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
      ) : messages.length === 0 ? (
        <Card className="glass">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">No messages yet</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-2">
            <h2 className="font-semibold mb-3">Messages</h2>
            {messages
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((msg) => (
                <Dialog key={msg.id}>
                  <DialogTrigger asChild>
                    <Card
                      className={`glass cursor-pointer hover:border-primary/50 transition-colors ${
                        !msg.isRead ? 'border-primary/50 bg-primary/5' : ''
                      }`}
                      onClick={() => {
                        setSelectedMessage(msg)
                        if (!msg.isRead) {
                          handleMarkAsRead(msg.id)
                        }
                      }}
                    >
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-2">
                          {!msg.isRead && (
                            <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{msg.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{msg.email}</p>
                            {msg.subject && (
                              <p className="text-xs text-muted-foreground truncate mt-1">
                                {msg.subject}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(msg.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Message from {msg.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">From</p>
                          <p className="font-medium">{msg.name}</p>
                          <a
                            href={`mailto:${msg.email}`}
                            className="text-sm text-blue-500 hover:text-blue-600"
                          >
                            {msg.email}
                          </a>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Received</p>
                          <p className="font-medium">
                            {new Date(msg.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      {msg.subject && (
                        <div>
                          <p className="text-sm text-muted-foreground">Subject</p>
                          <p className="font-medium">{msg.subject}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Message</p>
                        <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-wrap break-words">
                          {msg.message}
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-4">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="gap-2">
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Message</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this message? This action cannot
                                be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(msg.id)}
                                className="bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button
                          variant="outline"
                          onClick={() =>
                            (window.location.href = `mailto:${msg.email}?subject=Re: ${msg.subject || 'Your Message'}`)
                          }
                        >
                          Reply via Email
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
          </div>

          {selectedMessage && (
            <div className="md:col-span-2">
              <Card className="glass">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>Message Details</CardTitle>
                      <CardDescription className="mt-2">
                        From {selectedMessage.name}
                      </CardDescription>
                    </div>
                    {!selectedMessage.isRead && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsRead(selectedMessage.id)}
                        className="gap-2"
                      >
                        <CheckCheck className="w-4 h-4" />
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">From</Label>
                      <p className="font-medium mt-1">{selectedMessage.name}</p>
                      <a
                        href={`mailto:${selectedMessage.email}`}
                        className="text-sm text-blue-500 hover:text-blue-600 block mt-1"
                      >
                        {selectedMessage.email}
                      </a>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Received</Label>
                      <p className="font-medium mt-1">
                        {new Date(selectedMessage.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {selectedMessage.subject && (
                    <div>
                      <Label className="text-sm text-muted-foreground">Subject</Label>
                      <p className="font-medium mt-1">{selectedMessage.subject}</p>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm text-muted-foreground">Message</Label>
                    <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-wrap break-words mt-2">
                      {selectedMessage.message}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4 border-t">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="gap-2">
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Message</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this message? This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(selectedMessage.id)}
                            className="bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button
                      onClick={() =>
                        (window.location.href = `mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your Message'}`)
                      }
                    >
                      Reply via Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={className}>{children}</span>
}
