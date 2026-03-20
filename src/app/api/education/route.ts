import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/education - Get all education entries
export async function GET(request: NextRequest) {
  try {
    const education = await prisma.education.findMany({
      orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
    })

    return NextResponse.json(education)
  } catch (error) {
    console.error('Error fetching education:', error)
    return NextResponse.json(
      { error: 'Failed to fetch education' },
      { status: 500 }
    )
  }
}

// POST /api/education - Create a new education entry
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Handle date conversion and empty string validation
    const educationData: any = {
      institution: data.institution,
      degree: data.degree,
      field: data.field || null,
      location: data.location || null,
      description: data.description || null,
      gpa: data.gpa || null,
      isCurrent: data.isCurrent || false,
      order: data.order || 0,
    }

    // Convert date strings to Date objects
    if (data.startDate) {
      educationData.startDate = new Date(data.startDate)
    }
    if (data.endDate) {
      educationData.endDate = new Date(data.endDate)
    }

    const education = await prisma.education.create({
      data: educationData,
    })

    return NextResponse.json(education, { status: 201 })
  } catch (error) {
    console.error('Error creating education:', error)
    return NextResponse.json(
      { error: 'Failed to create education' },
      { status: 500 }
    )
  }
}
