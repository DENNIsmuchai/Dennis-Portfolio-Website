import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH /api/education/[id] - Update an education entry
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
    const educationData: any = { ...data }
    
    // Convert fields with empty strings to null
    Object.keys(educationData).forEach(key => {
      if (educationData[key] === '') {
        educationData[key] = null
      }
    })

    // Convert date strings to Date objects if provided
    if (data.startDate && typeof data.startDate === 'string') {
      educationData.startDate = new Date(data.startDate)
    }
    if (data.endDate && typeof data.endDate === 'string') {
      educationData.endDate = new Date(data.endDate)
    }

    const education = await prisma.education.update({
      where: { id: params.id },
      data: educationData,
    })

    return NextResponse.json(education)
  } catch (error) {
    console.error('Error updating education:', error)
    return NextResponse.json(
      { error: 'Failed to update education' },
      { status: 500 }
    )
  }
}

// DELETE /api/education/[id] - Delete an education entry
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

    await prisma.education.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting education:', error)
    return NextResponse.json(
      { error: 'Failed to delete education' },
      { status: 500 }
    )
  }
}
