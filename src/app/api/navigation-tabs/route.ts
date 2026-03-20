import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all navigation tabs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active')

    const where = activeOnly === 'true' 
      ? { isVisible: true, isActive: true }
      : {}

    const tabs = await prisma.navigationTab.findMany({
      where,
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(tabs)
  } catch (error) {
    console.error('Error fetching navigation tabs:', error)
    return NextResponse.json({ error: 'Failed to fetch tabs' }, { status: 500 })
  }
}

// POST - Create a new navigation tab
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, slug, icon, contentType, content, externalUrl, order, isVisible, isActive, language } = body

    // Check if slug already exists
    const existing = await prisma.navigationTab.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    // Get the highest order number if not provided
    let newOrder = order
    if (newOrder === undefined || newOrder === null) {
      const lastTab = await prisma.navigationTab.findFirst({
        orderBy: { order: 'desc' },
      })
      newOrder = lastTab ? lastTab.order + 1 : 0
    }

    const tab = await prisma.navigationTab.create({
      data: {
        title,
        slug,
        icon: icon || null,
        contentType: contentType || 'text',
        content: content || null,
        externalUrl: externalUrl || null,
        order: newOrder,
        isVisible: isVisible ?? true,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(tab)
  } catch (error) {
    console.error('Error creating navigation tab:', error)
    return NextResponse.json({ error: 'Failed to create tab' }, { status: 500 })
  }
}

// PUT - Update multiple tabs (for reordering)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { tabs } = body

    if (!Array.isArray(tabs)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
    }

    // Update each tab's order
    await Promise.all(
      tabs.map((tab: { id: string; order: number }) =>
        prisma.navigationTab.update({
          where: { id: tab.id },
          data: { order: tab.order },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating tabs:', error)
    return NextResponse.json({ error: 'Failed to update tabs' }, { status: 500 })
  }
}
