import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const links = await prisma.affiliateLink.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ links })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno do servidor'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productName, platform, originalUrl, shortUrl, commission, category } = body

    if (!productName || !platform || !originalUrl) {
      return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 })
    }

    const link = await prisma.affiliateLink.create({
      data: {
        productName,
        platform,
        originalUrl,
        shortUrl: shortUrl || null,
        commission: commission ?? null,
        category: category || null,
      },
    })

    return NextResponse.json({ link }, { status: 201 })
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
    const { productName, platform, originalUrl, shortUrl, commission, category, isActive } = body

    const link = await prisma.affiliateLink.update({
      where: { id },
      data: {
        productName,
        platform,
        originalUrl,
        shortUrl: shortUrl || null,
        commission: commission ?? null,
        category: category || null,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json({ link })
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

    await prisma.affiliateLink.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erro interno do servidor'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
