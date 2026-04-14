import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { openai, isOpenAIConfigured } from '@/lib/openai'

const generateMockScript = (title: string, tone: string, duration: string) => `# ${title}

## INTRODUÇÃO (0:00 - 1:30)

[ABERTURA IMPACTANTE]
Imagine descobrir que o assassino mais procurado do Brasil morava ao lado da sua casa. Que ele sorria para você todas as manhãs, ajudava vizinhos, e ninguém — absolutamente ninguém — suspeitava.

Hoje eu vou te contar uma história que vai te fazer questionar tudo o que você pensa que sabe sobre as pessoas ao seu redor.

[HOOK]
Se você chegou até aqui, provavelmente já ouviu falar de ${title}. Mas garanto que você não conhece ESSA parte da história.

Fique até o final — porque o que vem nos últimos minutos vai mudar completamente sua perspectiva.

---

## DESENVOLVIMENTO (1:30 - ${duration === '10 minutos' ? '8:00' : '12:00'})

### Parte 1: O Começo de Tudo

[NARRAÇÃO]
Tudo começou em uma manhã aparentemente comum...

O caso tomou proporções inesperadas quando...

Os investigadores ficaram chocados ao descobrir que...

### Parte 2: A Investigação

[ANÁLISE]
Para entender o que realmente aconteceu, precisamos voltar no tempo...

Os especialistas em comportamento criminal apontam que...

O que os documentos revelam é perturbador...

### Parte 3: A Virada

[REVELAÇÃO]
Mas aqui está o detalhe que NINGUÉM menciona...

A evidência que mudou tudo foi encontrada...

O que aconteceu depois disso é simplesmente inacreditável...

---

## CONCLUSÃO E CTA (${duration === '10 minutos' ? '8:00' : '12:00'} - Final)

[REFLEXÃO]
Esse caso nos lembra que a realidade frequentemente supera qualquer ficção. As pessoas ao nosso redor carregam histórias que jamais imaginamos.

[CTA]
Se você chegou até aqui, deixa um like — isso me ajuda MUITO a continuar trazendo esses conteúdos investigativos.

Se quiser ser notificado quando eu lançar novos vídeos, inscreva-se e ativa o sininho.

E me conta nos comentários: você acha que a justiça foi feita nesse caso?

Até o próximo vídeo.

---

## CARDS FINAIS
- Card 1: [Próximo vídeo sugerido]
- Card 2: [Playlist de casos]

<!-- Tom: ${tone} -->
`

export async function POST(request: NextRequest) {
  try {
    const { title, tone, duration, ideaId } = await request.json()

    if (!title) {
      return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 })
    }

    let scriptContent: string

    if (isOpenAIConfigured && openai) {
      const prompt = `Crie um roteiro completo e detalhado para um vídeo do YouTube de canal dark/investigativo.

Título: "${title}"
Tom: ${tone}
Duração alvo: ${duration}

O roteiro deve incluir:
1. Introdução impactante com hook (primeiros 90 segundos)
2. Desenvolvimento com pelo menos 3 seções bem estruturadas
3. Conclusão com CTA (call to action) para likes, inscrições e comentários
4. Indicações de tempo aproximadas
5. Marcações para B-roll ou imagens sugeridas

Use linguagem envolvente, em Português do Brasil, adequada para canal dark/investigativo.
O roteiro deve ser completo, profissional e pronto para gravação.`

      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      })

      scriptContent = completion.choices[0]?.message?.content ?? generateMockScript(title, tone, duration)
    } else {
      scriptContent = generateMockScript(title, tone, duration)
    }

    const savedScript = await prisma.script.create({
      data: {
        title,
        content: scriptContent,
        ideaId: ideaId ?? null,
        status: 'draft',
        duration,
      },
    })

    return NextResponse.json({ script: savedScript, isDemo: !isOpenAIConfigured })
  } catch (error: unknown) {
    console.error('Error generating script:', error)
    const message = error instanceof Error ? error.message : 'Erro interno do servidor'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
