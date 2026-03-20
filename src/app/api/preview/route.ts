import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/preview - Get all website data for live preview
export async function GET(request: NextRequest) {
  try {
    // Fetch all data in parallel for better performance
    const [
      personalInfo,
      sections,
      projects,
      experience,
      education,
      blogPosts,
      socialLinks,
      theme,
    ] = await Promise.all([
      prisma.personalInfo.findFirst(),
      prisma.section.findMany({
        where: { isVisible: true },
        orderBy: { order: 'asc' },
      }),
      prisma.project.findMany({
        where: { isPublished: true },
        orderBy: [{ featured: 'desc' }, { order: 'asc' }],
      }),
      prisma.experience.findMany({
        orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
      }),
      prisma.education.findMany({
        orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
      }),
      prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: 'desc' },
        take: 6,
      }),
      prisma.socialLink.findMany({
        where: { isVisible: true },
        orderBy: { order: 'asc' },
      }),
      prisma.theme.findFirst(),
    ])

    // Get certifications
    const certifications = await prisma.certification.findMany({
      orderBy: { order: 'asc' },
    })

    // Get resume
    const resume = await prisma.resume.findFirst({
      where: { isActive: true },
    })

    // Get skills - directly from prisma
    let skills: any[] = []
    skills = await prisma.skill.findMany({
      orderBy: { proficiency: 'desc' },
    })

    return NextResponse.json({
      personalInfo,
      sections,
      projects,
      skills,
      experience,
      education,
      certifications,
      blogPosts,
      socialLinks,
      theme,
      resume,
    })
  } catch (error) {
    console.error('Error fetching preview data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch preview data' },
      { status: 500 }
    )
  }
}
