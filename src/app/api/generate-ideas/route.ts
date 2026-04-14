import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { openai, isOpenAIConfigured } from '@/lib/openai'

const mockIdeas = (niche: string, keywords: string) => [
  {
    title: `Os 5 Casos Mais Perturbadores de ${niche} que Você Nunca Ouviu Falar`,
    description: `Uma investigação profunda sobre casos obscuros relacionados a ${niche}, explorando detalhes que a mídia ignorou.`,
    keywords: keywords.split(',').map((k) => k.trim()).filter(Boolean).slice(0, 3).concat(['mistério', 'investigação']),
  },
  {
    title: `A Verdade Sombria Por Trás de ${niche}: O Que Eles Não Querem Que Você Saiba`,
    description: `Revelações chocantes sobre ${niche} que foram suprimidas por anos. Documentos, testemunhos e evidências.`,
    keywords: ['revelação', 'verdade oculta', niche.toLowerCase(), 'documentos secretos'],
  },
  {
    title: `${niche}: O Caso que Abalou o Brasil e Nunca Foi Resolvido`,
    description: `Relato detalhado de um dos casos mais misteriosos envolvendo ${niche} no Brasil, com análise psicológica dos envolvidos.`,
    keywords: ['caso não resolvido', 'Brasil', niche.toLowerCase(), 'psicologia criminal'],
  },
  {
    title: `Dentro da Mente: Como ${niche} Mudou Completamente a Visão de Crimes`,
    description: `Uma análise fascinante sobre como os padrões de ${niche} evoluíram e o que isso revela sobre a natureza humana.`,
    keywords: ['psicologia', 'mente criminosa', niche.toLowerCase(), 'análise comportamental'],
  },
  {
    title: `${niche} - Os Arquivos Proibidos: Parte 1`,
    description: `Série investigativa sobre ${niche}, explorando documentos, gravações e testemunhos nunca antes revelados ao público.`,
    keywords: ['arquivos proibidos', 'série', niche.toLowerCase(), 'documentos exclusivos'],
  },
]

export async function POST(request: NextRequest) {
  try {
    const { niche, keywords, contentType } = await request.json()

    if (!niche) {
      return NextResponse.json({ error: 'Nicho é obrigatório' }, { status: 400 })
    }

    let ideasData: Array<{ title: string; description: string; keywords: string[] }>

    if (isOpenAIConfigured && openai) {
      const prompt = `Gere 5 ideias criativas e envolventes para vídeos do YouTube de canal dark/investigativo no nicho: "${niche}".
Palavras-chave: ${keywords || 'não especificadas'}
Tipo de conteúdo: ${contentType || 'Vídeo Longo'}

Para cada ideia, forneça:
- título (máximo 80 caracteres, otimizado para SEO)
- descrição (2-3 frases explicando o conteúdo)
- palavras-chave (array com 4-6 termos)

Responda em JSON válido com o formato:
[{"title": "...", "description": "...", "keywords": ["...", "..."]}]`

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
      })

      const content = completion.choices[0]?.message?.content ?? '[]'
      ideasData = JSON.parse(content)
    } else {
      ideasData = mockIdeas(niche, keywords ?? '')
    }

    const savedIdeas = await Promise.all(
      ideasData.map((idea) =>
        prisma.idea.create({
          data: {
            title: idea.title,
            description: idea.description,
            niche,
            keywords: idea.keywords,
            status: 'draft',
          },
        })
      )
    )

    return NextResponse.json({ ideas: savedIdeas, isDemo: !isOpenAIConfigured })
  } catch (error: unknown) {
    console.error('Error generating ideas:', error)
    const message = error instanceof Error ? error.message : 'Erro interno do servidor'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
