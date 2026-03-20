import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tab = await prisma.navigationTab.findUnique({
    where: { slug: params.slug },
  })

  if (!tab || !tab.isVisible || !tab.isActive) {
    return { title: 'Tab Not Found' }
  }

  return {
    title: tab.title,
  }
}

export default async function TabPage({ params }: PageProps) {
  const tab = await prisma.navigationTab.findUnique({
    where: { slug: params.slug },
  })

  if (!tab || !tab.isVisible || !tab.isActive) {
    notFound()
  }

  // Pre-fetch QA items if content type is qa
  let qaItems: { question: string; answer: string }[] = []
  if (tab.contentType === 'qa') {
    if (tab.content) {
      try {
        qaItems = JSON.parse(tab.content)
      } catch (e) {
        console.error('Failed to parse Q&A content:', e)
      }
    }
    
    if (qaItems.length === 0) {
      const customQA = await prisma.customQA.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      })
      qaItems = customQA.map(qa => ({ question: qa.question, answer: qa.answer }))
    }
  }

  // Render content based on content type
  const renderContent = () => {
    switch (tab.contentType) {
      case 'text':
        if (!tab.content) {
          return (
            <div className="text-center py-12 text-muted-foreground">
              <p>No content has been added yet.</p>
            </div>
          )
        }
        return (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {tab.content}
            </ReactMarkdown>
          </div>
        )

      case 'qa':
        return (
          <div className="space-y-6">
            {qaItems.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No Q&A items have been added yet.</p>
              </div>
            ) : (
              qaItems.map((item, index) => (
                <div key={index} className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                  <p className="text-muted-foreground">{item.answer}</p>
                </div>
              ))
            )}
          </div>
        )

      case 'custom':
        if (!tab.content) {
          return (
            <div className="text-center py-12 text-muted-foreground">
              <p>No custom data has been configured.</p>
            </div>
          )
        }
        try {
          const customData = JSON.parse(tab.content)
          return (
            <div className="rounded-lg border bg-card p-6">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                {JSON.stringify(customData, null, 2)}
              </pre>
            </div>
          )
        } catch (e) {
          return (
            <div className="rounded-lg border bg-card p-6">
              <p className="text-muted-foreground">{tab.content}</p>
            </div>
          )
        }

      case 'link':
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              This tab is configured as an external link.
            </p>
            {tab.externalUrl && (
              <a
                href={tab.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md"
              >
                Open {tab.externalUrl}
              </a>
            )}
          </div>
        )

      default:
        return (
          <div className="text-center py-12 text-muted-foreground">
            <p>Unknown content type.</p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{tab.title}</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full"></div>
        </div>

        <div className="rounded-xl border bg-card p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
