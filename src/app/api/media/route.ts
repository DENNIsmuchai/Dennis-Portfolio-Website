import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const folderId = searchParams.get('folderId')
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (folderId) {
      where.folderId = folderId
    } else {
      where.folderId = null
    }
    
    if (type) {
      where.mimeType = { startsWith: type }
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { originalName: { contains: search } },
        { tags: { contains: search } },
      ]
    }

    const files = await prisma.mediaFile.findMany({
      where,
      include: { folder: true },
      orderBy: { createdAt: 'desc' }
    })

    const folders = await prisma.mediaFolder.findMany({
      where: { parentId: folderId || null },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ files, folders })
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folderId = formData.get('folderId') as string | null
    const tags = formData.get('tags') as string
    const altText = formData.get('altText') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = path.join(uploadDir, fileName)
    
    await writeFile(filePath, buffer)
    
    const url = `/uploads/${fileName}`

    const mediaFile = await prisma.mediaFile.create({
      data: {
        name: fileName,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url,
        folderId: folderId || null,
        tags,
        altText,
      }
    })

    return NextResponse.json(mediaFile)
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, tags, altText, folderId } = body

    const mediaFile = await prisma.mediaFile.update({
      where: { id },
      data: {
        name,
        tags,
        altText,
        folderId: folderId || null,
      }
    })

    return NextResponse.json(mediaFile)
  } catch (error) {
    console.error('Error updating file:', error)
    return NextResponse.json({ error: 'Failed to update file' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 })
    }

    await prisma.mediaFile.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
}
