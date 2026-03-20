import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check for tabId in query params
    const { searchParams } = new URL(request.url)
    const tabId = searchParams.get('tabId')
    
    const whereClause = tabId 
      ? { pageId: params.id, tabId }
      : { pageId: params.id, tabId: null }

    const sections = await prisma.pageSection.findMany({
      where: whereClause,
      orderBy: { order: 'asc' },
    })
    return NextResponse.json(sections)
  } catch (error) {
    console.error('Error fetching sections:', error)
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 })
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { sectionType, title, content, layoutStyle, tabId } = body

    // Get the current max order
    const lastSection = await prisma.pageSection.findFirst({
      where: tabId ? { tabId } : { pageId: params.id, tabId: null },
      orderBy: { order: 'desc' },
    })

    const newOrder = lastSection ? lastSection.order + 1 : 0

    const section = await prisma.pageSection.create({
      data: {
        pageId: params.id,
        tabId,
        sectionType,
        title,
        content,
        layoutStyle: layoutStyle || 'default',
        order: newOrder,
        isVisible: true,
      },
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error creating section:', error)
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 })
  }
}
