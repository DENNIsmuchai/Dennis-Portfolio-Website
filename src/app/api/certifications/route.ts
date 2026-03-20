import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/certifications - Get all certifications
export async function GET(request: NextRequest) {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: { issueDate: 'desc' },
    })

    return NextResponse.json(certifications)
  } catch (error) {
    console.error('Error fetching certifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certifications' },
      { status: 500 }
    )
  }
}

// POST /api/certifications - Create a new certification
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
    const certificationData: any = {
      name: data.name,
      organization: data.organization,
      credentialId: data.credentialId || null,
      credentialUrl: data.credentialUrl || null,
      image: data.image || null,
      order: data.order || 0,
    }

    // Convert date strings to Date objects
    if (data.issueDate) {
      certificationData.issueDate = new Date(data.issueDate)
    }
    if (data.expiryDate) {
      certificationData.expiryDate = new Date(data.expiryDate)
    }

    const certification = await prisma.certification.create({
      data: certificationData,
    })

    return NextResponse.json(certification, { status: 201 })
  } catch (error) {
    console.error('Error creating certification:', error)
    return NextResponse.json(
      { error: 'Failed to create certification' },
      { status: 500 }
    )
  }
}
