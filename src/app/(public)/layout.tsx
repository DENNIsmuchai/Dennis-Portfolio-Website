import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { Navigation } from '@/components/public/Navigation'
import { Footer } from '@/components/public/Footer'
import { ChatWidget } from '@/components/public/ChatWidget'

export async function generateMetadata(): Promise<Metadata> {
  const personalInfo = await prisma.personalInfo.findFirst()

  return {
    title: personalInfo 
      ? `${personalInfo.firstName} ${personalInfo.lastName} - ${personalInfo.title}`
      : 'Dennis Portfolio Website',
    description: personalInfo?.tagline || 'Personal portfolio website showcasing skills, projects, and experience',
  }
}

async function getNavigationSections() {
  const sections = await prisma.section.findMany({
    where: { 
      isVisible: true,
      showInNav: true,
    },
    orderBy: { order: 'asc' },
  })

  // Parse JSON content if it's a string
  return sections.map(section => ({
    ...section,
    content: section.content ? (typeof section.content === 'string' ? JSON.parse(section.content) : section.content) : null
  }))
}

async function getPersonalInfo() {
  const personalInfo = await prisma.personalInfo.findFirst()
  return personalInfo
}

async function getSocialLinks() {
  const links = await prisma.socialLink.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  })
  return links
}

async function getCustomPages() {
  const pages = await prisma.customPage.findMany({
    where: { isPublished: true, showInNav: true },
    select: {
      id: true,
      slug: true,
      title: true,
      showInNav: true,
    },
    orderBy: { navOrder: 'asc' },
  })
  return pages
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sections, personalInfo, socialLinks, customPages] = await Promise.all([
    getNavigationSections(),
    getPersonalInfo(),
    getSocialLinks(),
    getCustomPages(),
  ])

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        sections={sections} 
        personalInfo={personalInfo}
        customPages={customPages}
      />
      <main>{children}</main>
      <Footer 
        personalInfo={personalInfo}
        socialLinks={socialLinks}
      />
      <ChatWidget />
    </div>
  )
}
