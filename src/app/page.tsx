import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import StatsCard from '@/components/dashboard/StatsCard'
import QuickActions from '@/components/dashboard/QuickActions'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import ArticleIcon from '@mui/icons-material/Article'
import LinkIcon from '@mui/icons-material/Link'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

export default function DashboardPage() {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Bem-vindo de volta! 👋
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Gerencie seu conteúdo para dark channels com inteligência artificial.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total de Ideias"
            value={24}
            description="+5 esta semana"
            icon={<LightbulbIcon />}
            color="#F59E0B"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Roteiros Criados"
            value={12}
            description="3 em andamento"
            icon={<ArticleIcon />}
            color="#7C3AED"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Links Ativos"
            value={8}
            description="R$ 1.240 em comissões"
            icon={<LinkIcon />}
            color="#10B981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Publicações Agendadas"
            value={6}
            description="Próxima: amanhã"
            icon={<CalendarMonthIcon />}
            color="#06B6D4"
          />
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Ações Rápidas
      </Typography>
      <QuickActions />
    </Box>
  )
}
