import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/skill-categories - Get all skill categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const visibleOnly = searchParams.get('visible') === 'true'

    const where: any = {}

    if (visibleOnly) {
      where.isVisible = true
    }

    const categories = await prisma.skillCategory.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        skills: {
          orderBy: [{ order: 'asc' }, { proficiency: 'desc' }],
        },
      },
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching skill categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skill categories' },
      { status: 500 }
    )
  }
}

// POST /api/skill-categories - Create a new skill category
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

    // Get max order
    const maxOrder = await prisma.skillCategory.aggregate({
      _max: { order: true },
    })

    const category = await prisma.skillCategory.create({
      data: {
        ...data,
        order: (maxOrder._max.order || 0) + 1,
      },
    })

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating skill category:', error)
    return NextResponse.json(
      { error: 'Failed to create skill category' },
      { status: 500 }
    )
  }
}
