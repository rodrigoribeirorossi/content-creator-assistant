'use client'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import type { Idea } from '@/types'

interface IdeaCardProps {
  idea: Idea
  onStatusChange: (id: string, status: string) => void
  onDelete: (id: string) => void
}

const statusConfig: Record<string, { label: string; color: 'default' | 'primary' | 'success' | 'warning' }> = {
  draft: { label: 'Rascunho', color: 'default' },
  approved: { label: 'Aprovada', color: 'success' },
  used: { label: 'Utilizada', color: 'primary' },
}

export default function IdeaCard({ idea, onStatusChange, onDelete }: IdeaCardProps) {
  const status = statusConfig[idea.status] ?? statusConfig.draft

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Chip label={idea.niche} size="small" color="primary" variant="outlined" />
          <Chip label={status.label} size="small" color={status.color} />
        </Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mt: 1 }}>
          {idea.title}
        </Typography>
        {idea.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {idea.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
          {idea.keywords.map((kw) => (
            <Chip key={kw} label={kw} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
          ))}
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 1 }}>
        {idea.status !== 'approved' && (
          <Tooltip title="Aprovar">
            <IconButton size="small" color="success" onClick={() => onStatusChange(idea.id, 'approved')}>
              <CheckCircleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {idea.status !== 'used' && (
          <Tooltip title="Marcar como usada">
            <IconButton size="small" color="primary" onClick={() => onStatusChange(idea.id, 'used')}>
              <PlayCircleIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="Excluir">
          <IconButton size="small" color="error" onClick={() => onDelete(idea.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  )
}
