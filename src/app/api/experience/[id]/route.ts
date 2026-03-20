import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH /api/experience/[id] - Update an experience entry
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const experienceData: any = { ...data }
    
    // Convert fields with empty strings to null
    Object.keys(experienceData).forEach(key => {
      if (experienceData[key] === '') {
        experienceData[key] = null
      }
    })

    // Convert date strings to Date objects if provided
    if (data.startDate && typeof data.startDate === 'string') {
      experienceData.startDate = new Date(data.startDate)
    }
    if (data.endDate && typeof data.endDate === 'string') {
      experienceData.endDate = new Date(data.endDate)
    }

    const experience = await prisma.experience.update({
      where: { id: params.id },
      data: experienceData,
    })

    return NextResponse.json(experience)
  } catch (error) {
    console.error('Error updating experience:', error)
    return NextResponse.json(
      { error: 'Failed to update experience' },
      { status: 500 }
    )
  }
}

// DELETE /api/experience/[id] - Delete an experience entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await prisma.experience.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting experience:', error)
    return NextResponse.json(
      { error: 'Failed to delete experience' },
      { status: 500 }
    )
  }
}
