import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all sections for a navigation tab
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const navTabId = searchParams.get('navTabId')

    if (!navTabId) {
      return NextResponse.json({ error: 'navTabId is required' }, { status: 400 })
    }

    const sections = await prisma.navSection.findMany({
      where: { navTabId },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(sections)
  } catch (error) {
    console.error('Error fetching nav sections:', error)
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 })
  }
}

// POST - Create a new nav section
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { navTabId, title, subtitle, sectionType, content, order, layoutStyle, isVisible, backgroundColor, textColor, accentColor, paddingTop, paddingBottom, marginTop, marginBottom, fontFamily, customCss } = body

    // Get the highest order number if not provided
    let newOrder = order
    if (newOrder === undefined || newOrder === null) {
      const lastSection = await prisma.navSection.findFirst({
        where: { navTabId },
        orderBy: { order: 'desc' },
      })
      newOrder = lastSection ? lastSection.order + 1 : 0
    }

    const section = await prisma.navSection.create({
      data: {
        navTabId,
        title: title || null,
        subtitle: subtitle || null,
        sectionType: sectionType || 'custom',
        content: content || null,
        order: newOrder,
        layoutStyle: layoutStyle || 'full-width',
        isVisible: isVisible ?? true,
        backgroundColor: backgroundColor || null,
        textColor: textColor || null,
        accentColor: accentColor || null,
        paddingTop: paddingTop || null,
        paddingBottom: paddingBottom || null,
        marginTop: marginTop || null,
        marginBottom: marginBottom || null,
        fontFamily: fontFamily || null,
        customCss: customCss || null,
      },
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error creating nav section:', error)
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 })
  }
}

// PUT - Update multiple sections (for reordering)
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { sections } = body

    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 })
    }

    // Update each section's order
    await Promise.all(
      sections.map((section: { id: string; order: number }) =>
        prisma.navSection.update({
          where: { id: section.id },
          data: { order: section.order },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating sections:', error)
    return NextResponse.json({ error: 'Failed to update sections' }, { status: 500 })
  }
}
