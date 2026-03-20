'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Tab {
  id: string
  title: string
  slug: string | null
  icon: string | null
  order: number
}

interface PageSection {
  id: string
  sectionType: string
  title: string | null
  content: string | null
  order: number
}

interface TabWithSections extends Tab {
  sections: PageSection[]
}

interface SectionProps {
  id: string
  sectionType: string
  title: string | null
  content: string | null
}

// Default section component for custom content
function DefaultSection({ title, content }: { title?: string | null; content?: string | null }) {
  if (!title && !content) return null
  
  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {title && <h2 className="text-3xl font-bold mb-8">{title}</h2>}
        {content && (
          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </section>
  )
}

export function TabbedPage({ 
  tabs, 
  pageSections 
}: { 
  tabs: TabWithSections[]
  pageSections: SectionProps[]
}) {
  const [activeTab, setActiveTab] = useState<string>('page')
  
  // Get sections for the current view
  const currentSections = activeTab === 'page' 
    ? pageSections 
    : tabs.find(t => t.id === activeTab)?.sections || []

  return (
    <div>
      {/* Tab Navigation */}
      {(tabs.length > 0 || pageSections.length > 0) && (
        <div className="border-b border-border mb-8">
          <nav className="flex space-x-1 -mb-px overflow-x-auto">
            {/* Main Page Tab */}
            <button
              onClick={() => setActiveTab('page')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === 'page'
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
            </button>
            
            {/* Custom Tabs */}
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {currentSections.length > 0 ? (
          currentSections.map((section) => (
            <DefaultSection
              key={section.id}
              title={section.title}
              content={section.content}
            />
          ))
        ) : (
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="text-center p-8">
              <p className="text-muted-foreground">
                No content in this section.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}
