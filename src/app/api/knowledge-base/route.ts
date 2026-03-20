import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')

    const where: any = {}
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { tags: { contains: search } },
      ]
    }

    const documents = await prisma.knowledgeDocument.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    })

    const categories = await prisma.knowledgeCategory.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ documents, categories })
  } catch (error) {
    console.error('Error fetching knowledge base:', error)
    return NextResponse.json({ error: 'Failed to fetch knowledge base' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, content, summary, documentType, fileUrl, fileName, fileSize, sourceUrl, tags, categoryId } = body

    const document = await prisma.knowledgeDocument.create({
      data: {
        title,
        content,
        summary,
        documentType: documentType || 'text',
        fileUrl,
        fileName,
        fileSize,
        sourceUrl,
        tags,
        categoryId,
      }
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }
}
