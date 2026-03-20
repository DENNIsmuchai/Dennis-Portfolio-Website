import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const showInNav = searchParams.get('showInNav')
    
    const where = showInNav === 'true' ? { showInNav: true, isPublished: true } : {}
    
    const pages = await prisma.customPage.findMany({
      where,
      orderBy: { navOrder: 'asc' },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      },
    })
    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching custom pages:', error)
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, slug, description, content, isPublished, showInNav, navLabel, navOrder, metaTitle, metaDescription } = body

    // Check if slug already exists
    const existing = await prisma.customPage.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    const page = await prisma.customPage.create({
      data: {
        title,
        slug,
        description,
        content,
        isPublished: isPublished ?? false,
        showInNav: showInNav ?? false,
        navLabel: navLabel ?? title,
        navOrder: navOrder ?? 0,
        metaTitle,
        metaDescription,
      }
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error creating custom page:', error)
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 })
  }
}
