import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/social-links - Get all social links
export async function GET(request: NextRequest) {
  try {
    const links = await prisma.socialLink.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(links)
  } catch (error) {
    console.error('Error fetching social links:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social links' },
      { status: 500 }
    )
  }
}

// POST /api/social-links - Create a new social link
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Get the next order number
    const lastLink = await prisma.socialLink.findFirst({
      orderBy: { order: 'desc' },
    })

    const nextOrder = (lastLink?.order || 0) + 1

    const link = await prisma.socialLink.create({
      data: {
        ...data,
        order: data.order !== undefined ? data.order : nextOrder,
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error('Error creating social link:', error)
    return NextResponse.json(
      { error: 'Failed to create social link' },
      { status: 500 }
    )
  }
}

// PATCH /api/social-links - Reorder social links
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { links } = await request.json()

    if (!Array.isArray(links)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // Update all links with new order
    const updatePromises = links.map((link: any) =>
      prisma.socialLink.update({
        where: { id: link.id },
        data: { order: link.order },
      })
    )

    await Promise.all(updatePromises)

    const updatedLinks = await prisma.socialLink.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(updatedLinks)
  } catch (error) {
    console.error('Error reordering social links:', error)
    return NextResponse.json(
      { error: 'Failed to reorder social links' },
      { status: 500 }
    )
  }
}
