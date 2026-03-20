import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/currently-tracking - Get all currently tracking items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const visibleOnly = searchParams.get('visible') === 'true'
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    const where: any = {}

    if (visibleOnly) {
      where.isVisible = true
    }

    if (category) {
      where.category = category
    }

    if (status) {
      where.status = status
    }

    const items = await prisma.currentlyTracking.findMany({
      where,
      orderBy: [{ order: 'asc' }, { date: 'desc' }],
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching currently tracking items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch currently tracking items' },
      { status: 500 }
    )
  }
}

// POST /api/currently-tracking - Create a new currently tracking item
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

    // Parse date if provided (convert date string to DateTime)
    if (data.date) {
      // If it's just a date string (YYYY-MM-DD), convert to full ISO datetime
      if (/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
        data.date = new Date(data.date + 'T00:00:00.000Z')
      } else {
        data.date = new Date(data.date)
      }
    }

    // Get max order
    const maxOrder = await prisma.currentlyTracking.aggregate({
      _max: { order: true },
    })

    const item = await prisma.currentlyTracking.create({
      data: {
        ...data,
        order: (maxOrder._max.order || 0) + 1,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error('Error creating currently tracking item:', error)
    return NextResponse.json(
      { error: 'Failed to create currently tracking item' },
      { status: 500 }
    )
  }
}
