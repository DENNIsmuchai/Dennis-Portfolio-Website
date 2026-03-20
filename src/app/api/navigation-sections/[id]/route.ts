import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch a single nav section
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const section = await prisma.navSection.findUnique({
      where: { id: params.id },
    })

    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 })
    }

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error fetching nav section:', error)
    return NextResponse.json({ error: 'Failed to fetch section' }, { status: 500 })
  }
}

// PUT - Update a nav section
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, subtitle, sectionType, content, order, layoutStyle, isVisible, backgroundColor, textColor, accentColor, paddingTop, paddingBottom, marginTop, marginBottom, fontFamily, customCss } = body

    const section = await prisma.navSection.update({
      where: { id: params.id },
      data: {
        title: title !== undefined ? title : undefined,
        subtitle: subtitle !== undefined ? subtitle : undefined,
        sectionType: sectionType || undefined,
        content: content !== undefined ? content : undefined,
        order: order !== undefined ? order : undefined,
        layoutStyle: layoutStyle || undefined,
        isVisible: isVisible !== undefined ? isVisible : undefined,
        backgroundColor: backgroundColor !== undefined ? backgroundColor : undefined,
        textColor: textColor !== undefined ? textColor : undefined,
        accentColor: accentColor !== undefined ? accentColor : undefined,
        paddingTop: paddingTop !== undefined ? paddingTop : undefined,
        paddingBottom: paddingBottom !== undefined ? paddingBottom : undefined,
        marginTop: marginTop !== undefined ? marginTop : undefined,
        marginBottom: marginBottom !== undefined ? marginBottom : undefined,
        fontFamily: fontFamily !== undefined ? fontFamily : undefined,
        customCss: customCss !== undefined ? customCss : undefined,
      },
    })

    return NextResponse.json(section)
  } catch (error) {
    console.error('Error updating nav section:', error)
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 })
  }
}

// DELETE - Delete a nav section
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.navSection.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting nav section:', error)
    return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 })
  }
}
