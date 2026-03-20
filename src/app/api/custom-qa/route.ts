import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/custom-qa - Get all custom Q&A
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active')

    const where = activeOnly === 'true' ? { isActive: true } : {}

    const customQAs = await (prisma as any).customQA.findMany({
      where,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(customQAs)
  } catch (error) {
    console.error('Error fetching custom Q&A:', error)
    return NextResponse.json(
      { error: 'Failed to fetch custom Q&A' },
      { status: 500 }
    )
  }
}

// POST /api/custom-qa - Create a new custom Q&A
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    if (!data.question || !data.answer) {
      return NextResponse.json(
        { error: 'Question and answer are required' },
        { status: 400 }
      )
    }

    const customQA = await (prisma as any).customQA.create({
      data: {
        question: data.question,
        answer: data.answer,
        category: data.category || 'General',
        keywords: data.keywords || null,
        isActive: data.isActive ?? true,
        order: data.order || 0,
      },
    })

    return NextResponse.json(customQA, { status: 201 })
  } catch (error) {
    console.error('Error creating custom Q&A:', error)
    return NextResponse.json(
      { error: 'Failed to create custom Q&A' },
      { status: 500 }
    )
  }
}
