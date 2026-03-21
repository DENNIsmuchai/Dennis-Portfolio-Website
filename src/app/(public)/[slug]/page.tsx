import { prisma } from '@/lib/prisma'
import { TabbedPage } from '@/components/public/TabbedPage'
import { HeroSection } from '@/components/public/sections/HeroSection'
import { AboutSection } from '@/components/public/sections/AboutSection'
import { ProjectsSection } from '@/components/public/sections/ProjectsSection'
import { SkillsSection } from '@/components/public/sections/SkillsSection'
import { ExperienceSection } from '@/components/public/sections/ExperienceSection'
import { EducationSection } from '@/components/public/sections/EducationSection'
import { BlogSection } from '@/components/public/sections/BlogSection'
import { ContactSection } from '@/components/public/sections/ContactSection'
import { CurrentlyTrackingSection } from '@/components/public/sections/CurrentlyTrackingSection'

async function getCustomPage(slug: string) {
  const page = await prisma.customPage.findUnique({
    where: { slug, isPublished: true },
    include: {
      sections: {
        where: { isVisible: true, tabId: null },
        orderBy: { order: 'asc' },
      },
      tabs: {
        where: { isVisible: true },
        orderBy: { order: 'asc' },
        include: {
          sections: {
            where: { isVisible: true },
            orderBy: { order: 'asc' }
          }
        }
      },
    },
  })
  return page
}

async function getPersonalInfo() {
  const personalInfo = await prisma.personalInfo.findFirst()
  return personalInfo
}

async function getProjects() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: [{ featured: 'desc' }, { order: 'asc' }],
    take: 6,
  })
  return projects
}

async function getSkills() {
  const categories = await prisma.skillCategory.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
    include: {
      skills: {
        where: { isVisible: true },
        orderBy: [{ order: 'asc' }, { proficiency: 'desc' }],
      },
    },
  })
  return categories
}

async function getExperience() {
  const experience = await prisma.experience.findMany({
    orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
  })
  return experience
}

async function getEducation() {
  const education = await prisma.education.findMany({
    orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
  })
  return education
}

async function getBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  })
  return posts
}

const sectionComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroSection,
  about: AboutSection,
  projects: ProjectsSection,
  skills: SkillsSection,
  experience: ExperienceSection,
  education: EducationSection,
  blog: BlogSection,
  contact: ContactSection,
  currently_tracking: CurrentlyTrackingSection,
}

// Default section component for custom/unsupported types
function DefaultSection({ title, content, layoutStyle }: { title?: string | null; content?: string | null; layoutStyle?: string }) {
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

export default async function CustomPage({ params }: { params: { slug: string } }) {
  const page = await getCustomPage(params.slug)

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-gray-600 dark:text-gray-400">Page not found</p>
        </div>
      </div>
    )
  }

  const personalInfo = await getPersonalInfo()
  const projects = await getProjects()
  const skills = await getSkills()
  const experience = await getExperience()
  const education = await getEducation()
  const blogPosts = await getBlogPosts()

  const sectionData: Record<string, any> = {
    hero: { personalInfo },
    about: { personalInfo },
    projects: { projects },
    skills: { categories: skills },
    experience: { experience },
    education: { education },
    blog: { posts: blogPosts },
    contact: { personalInfo },
    currently_tracking: {},
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Page Header */}
      {page.title && (
        <div className="pt-24 pb-8 px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">{page.title}</h1>
          {page.description && (
            <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
              {page.description}
            </p>
          )}
        </div>
      )}
      
      {/* Page Sections with Tabs */}
      {(page.sections.length > 0 || page.tabs.length > 0) ? (
        <TabbedPage 
          tabs={page.tabs as any} 
          pageSections={page.sections as any}
        />
      ) : (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-semibold mb-2">Page Under Construction</h2>
            <p className="text-muted-foreground">
              This page doesn't have any sections yet.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Add sections in the admin panel to see content here.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}


