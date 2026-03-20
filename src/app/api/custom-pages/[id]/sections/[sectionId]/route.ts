import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: { id: string; sectionId: string } }
) {
  try {
    const body = await request.json()
    const { title, content, layoutStyle, isVisible, order } = body

    const section = await prisma.pageSection.update({
      where: { id: params.sectionId },
      data: {
        title,
        content,
        layoutStyle,
        isVisible,
        order,
      },
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error updating section:', error)
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; sectionId: string } }
) {
  try {
    await prisma.pageSection.delete({
      where: { id: params.sectionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting section:', error)
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 })
  }
}
