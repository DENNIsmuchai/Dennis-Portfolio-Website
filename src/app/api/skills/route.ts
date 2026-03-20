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

    const { category, ...skillData } = await request.json()

    // Handle category relation - connect to existing category or create new one
    let categoryData: any = undefined
    if (category) {
      // If category is a string, try to find the category by name or label
      if (typeof category === 'string') {
        const existingCategory = await prisma.skillCategory.findFirst({
          where: {
            OR: [
              { name: category },
              { label: category },
            ],
          },
        })
        if (existingCategory) {
          categoryData = { connect: { id: existingCategory.id } }
        } else {
          // Create new category if it doesn't exist
          const newCategory = await prisma.skillCategory.create({
            data: { name: category, label: category },
          })
          categoryData = { connect: { id: newCategory.id } }
        }
      } else if (typeof category === 'object' && category.id) {
        // If category is an object with id, connect directly
        categoryData = { connect: { id: category.id } }
      }
    }

    // Get max order for the category
    const maxOrder = await prisma.skill.aggregate({
      where: { categoryId: skillData.categoryId },
      _max: { order: true },
    })

    const skill = await prisma.skill.create({
      data: {
        ...skillData,
        ...(categoryData && { category: categoryData }),
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
