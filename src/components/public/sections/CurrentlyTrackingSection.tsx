'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Building2, TrendingUp, Globe, Landmark, FileText, Eye } from 'lucide-react'

interface CurrentlyTracking {
  id: string
  title: string
  category: string
  date: string
  commentary: string | null
  status: string
  isVisible: boolean
}

interface CurrentlyTrackingSectionProps {
  id: string
  title: string
  content?: string
}

const categories = [
  { value: 'M&A', label: 'M&A', icon: Building2, color: 'bg-blue-500' },
  { value: 'IPO', label: 'IPO', icon: TrendingUp, color: 'bg-green-500' },
  { value: 'Macro', label: 'Macro', icon: Globe, color: 'bg-purple-500' },
  { value: 'Capital Markets', label: 'Capital Markets', icon: Landmark, color: 'bg-orange-500' },
  { value: 'Regulation', label: 'Regulation', icon: FileText, color: 'bg-red-500' },
]

const statuses = [
  { value: 'Watching', label: 'Watching', color: 'bg-blue-500' },
  { value: 'Developing', label: 'Developing', color: 'bg-yellow-500' },
  { value: 'Closed', label: 'Closed', color: 'bg-green-500' },
]

export function CurrentlyTrackingSection({ id, title }: CurrentlyTrackingSectionProps) {
  const [items, setItems] = useState<CurrentlyTracking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch('/api/currently-tracking?visible=true')
        if (response.ok) {
          const data = await response.json()
          setItems(data.filter((item: CurrentlyTracking) => item.isVisible))
        }
      } catch (error) {
        console.error('Error fetching items:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [])

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || { 
      value: category, 
      label: category, 
      icon: Eye, 
      color: 'bg-gray-500' 
    }
  }

  const getStatusInfo = (status: string) => {
    return statuses.find(s => s.value === status) || { 
      value: status, 
      label: status, 
      color: 'bg-gray-500' 
    }
  }

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, CurrentlyTracking[]>)

  if (isLoading) {
    return (
      <section id={id} className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  if (items.length === 0) {
    return null
  }

  return (
    <section id={id} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Deals, events, and market activities I'm currently tracking
          </p>
        </motion.div>

        <div className="space-y-8">
          {Object.entries(itemsByCategory).map(([category, categoryItems], categoryIndex) => {
            const categoryInfo = getCategoryInfo(category)
            const Icon = categoryInfo.icon

            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{categoryInfo.label}</h3>
                  <span className="text-sm text-muted-foreground">
                    ({categoryItems.length})
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {categoryItems.map((item, index) => {
                    const statusInfo = getStatusInfo(item.status)

                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-card rounded-xl p-4 border hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{item.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs text-white ${statusInfo.color}`}>
                            {item.status}
                          </span>
                        </div>

                        {item.date && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(item.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        )}

                        {item.commentary && (
                          <p className="text-sm text-muted-foreground line-clamp-3">
                            {item.commentary}
                          </p>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
