import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    let config = await prisma.aIConfiguration.findFirst()
    
    if (!config) {
      config = await prisma.aIConfiguration.create({
        data: {
          name: 'default',
          provider: 'openai',
          model: 'gpt-4o',
          temperature: 0.7,
          maxTokens: 2048,
          systemPrompt: 'You are a helpful AI assistant for the portfolio owner.',
          personalityTraits: 'Professional, Knowledgeable, Helpful',
          rateLimitPerHour: 100,
          featuresEnabled: 'chat,search,knowledge',
          isActive: true,
        }
      })
    }
    
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error fetching AI config:', error)
    return NextResponse.json({ error: 'Failed to fetch AI config' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const existingConfig = await prisma.aIConfiguration.findFirst()
    
    if (existingConfig) {
      const config = await prisma.aIConfiguration.update({
        where: { id: existingConfig.id },
        data: {
          provider: body.provider,
          model: body.model,
          temperature: body.temperature,
          maxTokens: body.maxTokens,
          systemPrompt: body.systemPrompt,
          personalityTraits: body.personalityTraits,
          rateLimitPerHour: body.rateLimitPerHour,
          featuresEnabled: body.featuresEnabled,
          isActive: body.isActive,
          apiKey: body.apiKey,
          apiEndpoint: body.apiEndpoint,
        }
      })
      return NextResponse.json(config)
    } else {
      const config = await prisma.aIConfiguration.create({
        data: {
          name: 'default',
          provider: body.provider || 'openai',
          model: body.model || 'gpt-4o',
          temperature: body.temperature ?? 0.7,
          maxTokens: body.maxTokens ?? 2048,
          systemPrompt: body.systemPrompt,
          personalityTraits: body.personalityTraits,
          rateLimitPerHour: body.rateLimitPerHour ?? 100,
          featuresEnabled: body.featuresEnabled || 'chat,search,knowledge',
          isActive: body.isActive ?? true,
          apiKey: body.apiKey,
          apiEndpoint: body.apiEndpoint,
        }
      })
      return NextResponse.json(config)
    }
  } catch (error) {
    console.error('Error updating AI config:', error)
    return NextResponse.json({ error: 'Failed to update AI config' }, { status: 500 })
  }
}
