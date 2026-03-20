import { prisma } from '@/lib/prisma'
import { HeroSection } from '@/components/public/sections/HeroSection'
import { AboutSection } from '@/components/public/sections/AboutSection'
import { ProjectsSection } from '@/components/public/sections/ProjectsSection'
import { SkillsSection } from '@/components/public/sections/SkillsSection'
import { ExperienceSection } from '@/components/public/sections/ExperienceSection'
import { EducationSection } from '@/components/public/sections/EducationSection'
import { BlogSection } from '@/components/public/sections/BlogSection'
import { ContactSection } from '@/components/public/sections/ContactSection'
import { CurrentlyTrackingSection } from '@/components/public/sections/CurrentlyTrackingSection'

async function getSections() {
  const sections = await prisma.section.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
  })
  return sections
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

async function getCustomPages() {
  const pages = await prisma.customPage.findMany({
    where: { isPublished: true },
    orderBy: { navOrder: 'asc' },
    include: {
      sections: {
        where: { isVisible: true },
        orderBy: { order: 'asc' },
      },
    },
  })
  return pages
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

export default async function HomePage() {
  const [
    sections,
    personalInfo,
    projects,
    skills,
    experience,
    education,
    blogPosts,
  ] = await Promise.all([
    getSections(),
    getPersonalInfo(),
    getProjects(),
    getSkills(),
    getExperience(),
    getEducation(),
    getBlogPosts(),
  ])

  const sectionData: Record<string, any> = {
    hero: { personalInfo },
    quantum_hero: { personalInfo },
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
    <>
      {sections.map((section) => {
        const sectionType = section.type.toLowerCase()
        const Component = sectionComponents[sectionType]
        if (!Component) return null

        return (
          <Component
            key={section.id}
            id={section.name.toLowerCase().replace(/\s+/g, '-')}
            title={section.title}
            content={section.content}
            {...sectionData[sectionType]}
          />
        )
      })}
    </>
  )
}
