import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/experience - Get all experience entries
export async function GET(request: NextRequest) {
  try {
    const experience = await prisma.experience.findMany({
      orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
    })

    return NextResponse.json(experience)
  } catch (error) {
    console.error('Error fetching experience:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experience' },
      { status: 500 }
    )
  }
}

// POST /api/experience - Create a new experience entry
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
    const experienceData: any = {
      company: data.company,
      position: data.position,
      description: data.description || null,
      isCurrent: data.isCurrent || false,
      order: data.order || 0,
    }

    // Convert date strings to Date objects
    if (data.startDate) {
      experienceData.startDate = new Date(data.startDate)
    }
    if (data.endDate) {
      experienceData.endDate = new Date(data.endDate)
    }

    const experience = await prisma.experience.create({
      data: experienceData,
    })

    return NextResponse.json(experience, { status: 201 })
  } catch (error) {
    console.error('Error creating experience:', error)
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    )
  }
}
