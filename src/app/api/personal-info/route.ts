import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/personal-info - Get personal info
export async function GET(request: NextRequest) {
  try {
    const personalInfo = await prisma.personalInfo.findFirst()

    if (!personalInfo) {
      return NextResponse.json(
        { error: 'Personal info not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(personalInfo)
  } catch (error) {
    console.error('Error fetching personal info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch personal info' },
      { status: 500 }
    )
  }
}

// POST /api/personal-info - Create or update personal info
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

    const existing = await prisma.personalInfo.findFirst()

    let personalInfo
    if (existing) {
      personalInfo = await prisma.personalInfo.update({
        where: { id: existing.id },
        data,
      })
    } else {
      personalInfo = await prisma.personalInfo.create({
        data,
      })
    }

    return NextResponse.json(personalInfo)
  } catch (error) {
    console.error('Error saving personal info:', error)
    return NextResponse.json(
      { error: 'Failed to save personal info' },
      { status: 500 }
    )
  }
}
