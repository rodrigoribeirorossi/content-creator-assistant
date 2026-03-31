import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { openai, isOpenAIConfigured } from '@/lib/openai'

const generateMockSeo = (videoTheme: string) => ({
  videoTitle: `${videoTheme}: A História Que Eles Tentaram Esconder | INVESTIGAÇÃO COMPLETA`,
  description: `🔍 ${videoTheme} - Uma investigação profunda que vai te deixar sem palavras.

Neste vídeo, exploramos cada detalhe desse caso perturbador que sacudiu o Brasil. Fique até o final para descobrir a VERDADE que a mídia não quis mostrar.

⚠️ Conteúdo para maiores de 18 anos.

📌 LINKS ÚTEIS:
🔗 [LINK_AFILIADO_1] - Ferramenta de pesquisa criminal
🔗 [LINK_AFILIADO_2] - Livro sobre o caso

⏰ CAPÍTULOS:
0:00 - Introdução
1:30 - O início do caso
4:00 - A investigação
7:30 - Revelações chocantes
9:00 - Conclusão

🔔 INSCREVA-SE e ative o sininho para não perder nossos próximos vídeos!

👍 Deixe seu LIKE se esse conteúdo te ajudou!

💬 Comente sua opinião sobre o caso!

#crimesreais #misterio #investigacao #darkchannel #${videoTheme.toLowerCase().replace(/\s+/g, '')}`,
  tags: [
    videoTheme.toLowerCase(),
    'crimes reais',
    'mistério',
    'investigação',
    'dark channel',
    'caso policial',
    'verdade oculta',
    'brasil',
    'documentário',
    'true crime',
    'serial killer',
    'casos não resolvidos',
    'crime verdadeiro',
    'investigação criminal',
    'história sombria',
  ],
  score: 78,
})

export async function POST(request: NextRequest) {
  try {
    const { videoTheme } = await request.json()

    if (!videoTheme) {
      return NextResponse.json({ error: 'Tema do vídeo é obrigatório' }, { status: 400 })
    }

    let seoData: { videoTitle: string; description: string; tags: string[]; score: number }

    if (isOpenAIConfigured && openai) {
      const prompt = `Otimize o SEO de um vídeo do YouTube para o tema: "${videoTheme}"

O canal é um dark channel brasileiro focado em crimes reais, mistérios e investigações.

Gere:
1. Título otimizado (máximo 100 caracteres, com emojis, atraente e com palavras-chave)
2. Descrição completa (com emojis, capítulos, call-to-actions, placeholder [LINK_AFILIADO_1] e [LINK_AFILIADO_2])
3. Tags (array com 15 tags relevantes)
4. Score SEO de 0-100

Responda em JSON válido:
{"videoTitle": "...", "description": "...", "tags": ["...", "..."], "score": 85}`

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      })

      const content = completion.choices[0]?.message?.content ?? '{}'
      seoData = JSON.parse(content)
    } else {
      seoData = generateMockSeo(videoTheme)
    }

    const saved = await prisma.seoOptimization.create({
      data: {
        videoTitle: seoData.videoTitle,
        description: seoData.description,
        tags: seoData.tags,
        score: seoData.score,
      },
    })

    return NextResponse.json({ seo: saved, isDemo: !isOpenAIConfigured })
  } catch (error: unknown) {
    console.error('Error optimizing SEO:', error)
    const message = error instanceof Error ? error.message : 'Erro interno do servidor'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
