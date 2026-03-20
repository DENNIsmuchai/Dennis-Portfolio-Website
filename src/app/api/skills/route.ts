import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/skills - Get all skills with categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const visibleOnly = searchParams.get('visible') === 'true'
    const categoryId = searchParams.get('categoryId')

    const where: any = {}

    if (visibleOnly) {
      where.isVisible = true
    }

    if (categoryId) {
      where.categoryId = categoryId
    }

    // Get categories with skills
    const categories = await prisma.skillCategory.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
      include: {
        skills: {
          where,
          orderBy: [{ order: 'asc' }, { proficiency: 'desc' }],
        },
      },
    })

    // If admin is logged in, get all categories including hidden ones
    const session = await getServerSession(authOptions)
    if (session) {
      const allCategories = await prisma.skillCategory.findMany({
        orderBy: { order: 'asc' },
        include: {
          skills: {
            orderBy: [{ order: 'asc' }, { proficiency: 'desc' }],
          },
        },
      })
      return NextResponse.json(allCategories)
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
}

// POST /api/skills - Create a new skill
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

    // Get max order for the category
    const maxOrder = await prisma.skill.aggregate({
      where: { categoryId: data.categoryId },
      _max: { order: true },
    })

    const skill = await prisma.skill.create({
      data: {
        ...data,
        order: (maxOrder._max.order || 0) + 1,
      },
    })

    return NextResponse.json(skill, { status: 201 })
  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    )
  }
}
