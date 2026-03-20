import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PUT - Update a tab
export async function PUT(
  request: Request,
  { params }: { params: { id: string; tabId: string } }
) {
  try {
    const body = await request.json()
    const { title, slug, icon, order, isVisible } = body

    const tab = await prisma.pageTab.update({
      where: { id: params.tabId },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(icon !== undefined && { icon }),
        ...(order !== undefined && { order }),
        ...(isVisible !== undefined && { isVisible }),
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
  { params }: { params: { id: string; tabId: string } }
) {
  try {
    await prisma.pageTab.delete({
      where: { id: params.tabId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tab:', error)
    return NextResponse.json({ error: 'Failed to delete tab' }, { status: 500 })
  }
}
