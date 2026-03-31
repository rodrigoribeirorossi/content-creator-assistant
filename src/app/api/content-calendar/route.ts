import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.contentCalendar.findMany({
      orderBy: { scheduledAt: 'asc' },
    })
    return NextResponse.json({ items })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno do servidor'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, platform, status, scheduledAt } = body

    if (!title || !platform) {
      return NextResponse.json({ error: 'Título e plataforma são obrigatórios' }, { status: 400 })
    }

    const item = await prisma.contentCalendar.create({
      data: {
        title,
        description: description || null,
        platform,
        status: status || 'idea',
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
    })

    return NextResponse.json({ item }, { status: 201 })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno do servidor'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    const body = await request.json()
    const item = await prisma.contentCalendar.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description || null,
        platform: body.platform,
        status: body.status,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null,
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : null,
        videoUrl: body.videoUrl || null,
      },
    })

    return NextResponse.json({ item })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno do servidor'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
    }

    await prisma.contentCalendar.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno do servidor'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
