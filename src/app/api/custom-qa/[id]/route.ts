import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// PATCH /api/custom-qa/[id] - Update a custom Q&A
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const id = params.id

    const customQA = await (prisma as any).customQA.update({
      where: { id },
      data: {
        question: data.question,
        answer: data.answer,
        keywords: data.keywords,
        isActive: data.isActive,
        order: data.order,
      },
    })

    return NextResponse.json(customQA)
  } catch (error) {
    console.error('Error updating custom Q&A:', error)
    return NextResponse.json(
      { error: 'Failed to update custom Q&A' },
      { status: 500 }
    )
  }
}

// DELETE /api/custom-qa/[id] - Delete a custom Q&A
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    await (prisma as any).customQA.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting custom Q&A:', error)
    return NextResponse.json(
      { error: 'Failed to delete custom Q&A' },
      { status: 500 }
    )
  }
}
