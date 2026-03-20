import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

// GET /api/resume - Get active resume (public) or all resumes (admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // If admin is logged in, return all resumes
    if (session) {
      const resumes = await prisma.resume.findMany({
        orderBy: { uploadedAt: 'desc' },
      })
      return NextResponse.json(resumes)
    }
    
    // For public users, return only the active resume
    const activeResume = await prisma.resume.findFirst({
      where: { isActive: true },
    })
    
    return NextResponse.json(activeResume ? [activeResume] : [])
  } catch (error) {
    console.error('Error fetching resumes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resumes' },
      { status: 500 }
    )
  }
}

// POST /api/resume/upload - Upload a new resume
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      )
    }

    // Get user's name from personalInfo for the filename
    const personalInfo = await prisma.personalInfo.findFirst()
    const userName = personalInfo 
      ? `${personalInfo.firstName}-${personalInfo.lastName}`.replace(/\s+/g, '-').toLowerCase()
      : 'user'
    
    // Generate unique filename with user's name
    const fileId = uuidv4()
    const fileName = `resume-${userName}-${fileId}.pdf`
    const filePath = join(process.cwd(), 'public', 'resume', fileName)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Deactivate all other resumes
    await prisma.resume.updateMany({
      where: {},
      data: { isActive: false },
    })

    // Create database entry
    const resume = await prisma.resume.create({
      data: {
        fileName: file.name,
        fileUrl: `/resume/${fileName}`,
        fileSize: file.size,
        isActive: true,
      },
    })

    return NextResponse.json(resume, { status: 201 })
  } catch (error) {
    console.error('Error uploading resume:', error)
    return NextResponse.json(
      { error: 'Failed to upload resume' },
      { status: 500 }
    )
  }
}
