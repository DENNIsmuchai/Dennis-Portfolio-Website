import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// DELETE /api/skill-categories/[id] - Delete a skill category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // First delete all skills in this category
    await prisma.skill.deleteMany({
      where: { categoryId: params.id },
    })

    // Then delete the category
    await prisma.skillCategory.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting skill category:', error)
    return NextResponse.json(
      { error: 'Failed to delete skill category' },
      { status: 500 }
    )
  }
}
