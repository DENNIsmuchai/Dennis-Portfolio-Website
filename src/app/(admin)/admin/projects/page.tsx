import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { ProjectsManager } from '@/components/admin/ProjectsManager'

export const metadata: Metadata = {
  title: 'Projects Manager | Portfolio Platform',
}

async function getProjects() {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })
  
  // Transform projects to ensure arrays are properly parsed
  return projects.map(project => ({
    ...project,
    images: typeof project.images === 'string' ? JSON.parse(project.images || '[]') : project.images || [],
    techStack: typeof project.techStack === 'string' ? JSON.parse(project.techStack || '[]') : project.techStack || []
  }))
}

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects Manager</h1>
        <p className="text-muted-foreground mt-2">
          Manage your portfolio projects and showcase your work.
        </p>
      </div>

      <ProjectsManager initialProjects={projects} />
    </div>
  )
}
