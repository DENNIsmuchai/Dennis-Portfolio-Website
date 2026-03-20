import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH /api/certifications/[id] - Update a certification
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
    const certificationData: any = {
      name: data.name,
      organization: data.organization,
      credentialId: data.credentialId || null,
      credentialUrl: data.credentialUrl || null,
      image: data.image || null,
      order: data.order || 0,
    }
    
    // Convert fields with empty strings to null
    Object.keys(certificationData).forEach(key => {
      if (certificationData[key] === '') {
        certificationData[key] = null
      }
    })

    // Convert date strings to Date objects if provided
    if (data.issueDate && typeof data.issueDate === 'string') {
      certificationData.issueDate = new Date(data.issueDate)
    }
    if (data.expiryDate && typeof data.expiryDate === 'string') {
      certificationData.expiryDate = new Date(data.expiryDate)
    }

    const certification = await prisma.certification.update({
      where: { id: params.id },
      data: certificationData,
    })

    return NextResponse.json(certification)
  } catch (error) {
    console.error('Error updating certification:', error)
    return NextResponse.json(
      { error: 'Failed to update certification' },
      { status: 500 }
    )
  }
}

// DELETE /api/certifications/[id] - Delete a certification
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

    await prisma.certification.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting certification:', error)
    return NextResponse.json(
      { error: 'Failed to delete certification' },
      { status: 500 }
    )
  }
}
