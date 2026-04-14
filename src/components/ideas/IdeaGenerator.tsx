'use client'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import type { Idea } from '@/types'
import IdeaCard from './IdeaCard'

const contentTypes = [
  'Vídeo Longo',
  'Shorts',
  'Tutorial',
  'Review',
  'Investigativo',
  'Narração',
]

export default function IdeaGenerator() {
  const [niche, setNiche] = useState('')
  const [keywords, setKeywords] = useState('')
  const [contentType, setContentType] = useState('Vídeo Longo')
  const [loading, setLoading] = useState(false)
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [isDemo, setIsDemo] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  })

  const handleGenerate = async () => {
    if (!niche.trim()) {
      setSnackbar({ open: true, message: 'Informe o nicho do conteúdo', severity: 'error' })
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, keywords, contentType }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Erro ao gerar ideias')
      setIdeas(data.ideas)
      setIsDemo(data.isDemo)
      setSnackbar({ open: true, message: `${data.ideas.length} ideias geradas com sucesso!`, severity: 'success' })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao gerar ideias'
      setSnackbar({ open: true, message, severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (id: string, status: string) => {
    setIdeas((prev) => prev.map((idea) => (idea.id === id ? { ...idea, status } : idea)))
  }

  const handleDelete = (id: string) => {
    setIdeas((prev) => prev.filter((idea) => idea.id !== id))
  }

  return (
    <Box>
      {isDemo && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Modo demo — Configure a variável <strong>OPENAI_API_KEY</strong> para habilitar recursos de IA.
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Gerar Ideias de Conteúdo
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Nicho"
              placeholder="Ex: Crimes reais, Mistérios, Histórias sombrias"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Palavras-chave"
              placeholder="Ex: assassino serial, caso não resolvido"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              select
              label="Tipo de Conteúdo"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
            >
              {contentTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleGenerate}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
              sx={{ height: 56 }}
            >
              {loading ? 'Gerando...' : 'Gerar Ideias'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {ideas.length > 0 && (
        <>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            Ideias Geradas ({ideas.length})
          </Typography>
          <Grid container spacing={2}>
            {ideas.map((idea) => (
              <Grid item xs={12} md={6} lg={4} key={idea.id}>
                <IdeaCard idea={idea} onStatusChange={handleStatusChange} onDelete={handleDelete} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
