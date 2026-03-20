import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all tabs for a page
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tabs = await prisma.pageTab.findMany({
      where: { pageId: params.id },
      include: {
        sections: {
          where: { isVisible: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(tabs)
  } catch (error) {
    console.error('Error fetching tabs:', error)
    return NextResponse.json({ error: 'Failed to fetch tabs' }, { status: 500 })
  }
}

// POST - Create a new tab
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, slug, icon } = body

    // Get the highest order number
    const lastTab = await prisma.pageTab.findFirst({
      where: { pageId: params.id },
      orderBy: { order: 'desc' },
    })

    const newOrder = lastTab ? lastTab.order + 1 : 0

    const tab = await prisma.pageTab.create({
      data: {
        pageId: params.id,
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        icon,
        order: newOrder,
        isVisible: true,
      },
    })

    return NextResponse.json(tab)
  } catch (error) {
    console.error('Error creating tab:', error)
    return NextResponse.json({ error: 'Failed to create tab' }, { status: 500 })
  }
}
