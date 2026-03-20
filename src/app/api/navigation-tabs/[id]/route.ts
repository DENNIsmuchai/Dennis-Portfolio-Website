import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch a single tab
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tab = await prisma.navigationTab.findUnique({
      where: { id: params.id },
    })

    if (!tab) {
      return NextResponse.json({ error: 'Tab not found' }, { status: 404 })
    }

    return NextResponse.json(tab)
  } catch (error) {
    console.error('Error fetching tab:', error)
    return NextResponse.json({ error: 'Failed to fetch tab' }, { status: 500 })
  }
}

// PUT - Update a tab
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, slug, icon, contentType, content, externalUrl, order, isVisible, isActive } = body

    // Check if slug is being changed and if it already exists
    if (slug) {
      const existing = await prisma.navigationTab.findFirst({
        where: { slug, NOT: { id: params.id } },
      })
      if (existing) {
        return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
      }
    }

    const tab = await prisma.navigationTab.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(icon !== undefined && { icon }),
        ...(contentType && { contentType }),
        ...(content !== undefined && { content }),
        ...(externalUrl !== undefined && { externalUrl }),
        ...(order !== undefined && { order }),
        ...(isVisible !== undefined && { isVisible }),
        ...(isActive !== undefined && { isActive }),
      },
    })

    return NextResponse.json(tab)
  } catch (error) {
    console.error('Error updating tab:', error)
    return NextResponse.json({ error: 'Failed to update tab' }, { status: 500 })
  }
}

// DELETE - Delete a tab
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.navigationTab.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tab:', error)
    return NextResponse.json({ error: 'Failed to delete tab' }, { status: 500 })
  }
}
