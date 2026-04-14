'use client'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import ArticleIcon from '@mui/icons-material/Article'
import SearchIcon from '@mui/icons-material/Search'
import LinkIcon from '@mui/icons-material/Link'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import { useRouter } from 'next/navigation'

const actions = [
  { label: 'Gerar Ideia', description: 'Crie novas ideias de conteúdo', icon: <LightbulbIcon />, href: '/ideas', color: '#F59E0B' },
  { label: 'Novo Roteiro', description: 'Escreva um roteiro com IA', icon: <ArticleIcon />, href: '/scripts', color: '#7C3AED' },
  { label: 'Otimizar SEO', description: 'Melhore seu ranking no YouTube', icon: <SearchIcon />, href: '/seo', color: '#06B6D4' },
  { label: 'Adicionar Link', description: 'Gerencie links de afiliados', icon: <LinkIcon />, href: '/links', color: '#10B981' },
  { label: 'Agendar Post', description: 'Planeje seu calendário editorial', icon: <CalendarMonthIcon />, href: '/calendar', color: '#EF4444' },
]

export default function QuickActions() {
  const router = useRouter()

  return (
    <Grid container spacing={2}>
      {actions.map((action) => (
        <Grid item xs={12} sm={6} md={4} lg={2.4} key={action.href}>
          <Card sx={{ height: '100%' }}>
            <CardActionArea onClick={() => router.push(action.href)} sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ color: action.color, mb: 1 }}>{action.icon}</Box>
                <Typography variant="subtitle2" fontWeight={600}>
                  {action.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {action.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
