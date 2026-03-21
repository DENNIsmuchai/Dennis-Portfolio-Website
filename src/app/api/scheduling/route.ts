import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const scheduled = await prisma.scheduledContent.findMany({
      orderBy: { scheduledFor: 'asc' }
    })
    return NextResponse.json(scheduled)
  } catch (error) {
    console.error('Error fetching scheduled content:', error)
    return NextResponse.json({ error: 'Failed to fetch scheduled content' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { contentType, contentId, title, action, scheduledFor, timezone, recurrence } = body

    // Validate scheduledFor date
    const parsedDate = new Date(scheduledFor)
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format for scheduledFor' }, { status: 400 })
    }

    const scheduled = await prisma.scheduledContent.create({
      data: {
        contentType,
        contentId,
        title,
        action: action || 'publish',
        scheduledFor: parsedDate,
        timezone: timezone || 'UTC',
        recurrence,
      }
    })

    return NextResponse.json(scheduled)
  } catch (error) {
    console.error('Error creating scheduled content:', error)
    return NextResponse.json({ error: 'Failed to create scheduled content' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, scheduledFor, action } = body

    const scheduled = await prisma.scheduledContent.update({
      where: { id },
      data: {
        scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
        action,
      }
    })

    return NextResponse.json(scheduled)
  } catch (error) {
    console.error('Error updating scheduled content:', error)
    return NextResponse.json({ error: 'Failed to update scheduled content' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    await prisma.scheduledContent.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting scheduled content:', error)
    return NextResponse.json({ error: 'Failed to delete scheduled content' }, { status: 500 })
  }
}
