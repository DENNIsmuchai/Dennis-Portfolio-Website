import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const page = await prisma.customPage.findUnique({
      where: { id: params.id },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        },
        tabs: {
          where: { isVisible: true },
          orderBy: { order: 'asc' },
          include: {
            sections: {
              where: { isVisible: true },
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    })
    
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 })
    }
    
    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching custom page:', error)
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, slug, description, content, isPublished, showInNav, navLabel, navOrder, metaTitle, metaDescription } = body

    // Build update data object with only provided fields
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (slug !== undefined) {
      // Check if slug already exists for another page
      const existing = await prisma.customPage.findFirst({
        where: { slug, NOT: { id: params.id } }
      })
      if (existing) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
      }
      updateData.slug = slug
    }
    if (description !== undefined) updateData.description = description
    if (content !== undefined) updateData.content = content
    if (isPublished !== undefined) updateData.isPublished = isPublished
    if (showInNav !== undefined) updateData.showInNav = showInNav
    if (navLabel !== undefined) updateData.navLabel = navLabel
    if (navOrder !== undefined) updateData.navOrder = navOrder
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription

    const page = await prisma.customPage.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error updating custom page:', error)
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.customPage.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting custom page:', error)
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 })
  }
}
