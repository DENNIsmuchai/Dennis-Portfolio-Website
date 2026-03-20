import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// GET /api/theme - Get active theme
export async function GET(request: NextRequest) {
  try {
    const theme = await prisma.theme.findFirst({
      where: { isActive: true },
    })

    if (!theme) {
      // Return default theme if none exists
      return NextResponse.json({
        name: 'default',
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        accentColor: '#10b981',
        backgroundColor: '#0f172a',
        surfaceColor: '#1e293b',
        textColor: '#f8fafc',
        mutedColor: '#64748b',
        fontFamily: 'inter',
        isDarkMode: true,
        animationIntensity: 'medium',
      })
    }

    return NextResponse.json(theme)
  } catch (error) {
    console.error('Error fetching theme:', error)
    return NextResponse.json(
      { error: 'Failed to fetch theme' },
      { status: 500 }
    )
  }
}

// POST /api/theme - Create or update theme
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

    // Deactivate all other themes
    await prisma.theme.updateMany({
      where: {},
      data: { isActive: false },
    })

    const theme = await prisma.theme.create({
      data: {
        ...data,
        isActive: true,
      },
    })

    // Revalidate paths to reflect theme changes on public pages
    revalidatePath('/')
    revalidatePath('/(public)')

    return NextResponse.json(theme, { status: 201 })
  } catch (error) {
    console.error('Error saving theme:', error)
    return NextResponse.json(
      { error: 'Failed to save theme' },
      { status: 500 }
    )
  }
}

// PATCH /api/theme - Update active theme
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const data = await request.json()

    const activeTheme = await prisma.theme.findFirst({
      where: { isActive: true },
    })

    if (!activeTheme) {
      return NextResponse.json(
        { error: 'No active theme found' },
        { status: 404 }
      )
    }

    const theme = await prisma.theme.update({
      where: { id: activeTheme.id },
      data,
    })

    // Revalidate paths to reflect theme changes on public pages
    revalidatePath('/')
    revalidatePath('/(public)')

    return NextResponse.json(theme)
  } catch (error) {
    console.error('Error updating theme:', error)
    return NextResponse.json(
      { error: 'Failed to update theme' },
      { status: 500 }
    )
  }
}
