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
import type { Script } from '@/types'
import ScriptEditor from './ScriptEditor'

const tones = [
  { value: 'informativo', label: 'Informativo' },
  { value: 'narrativo', label: 'Narrativo' },
  { value: 'persuasivo', label: 'Persuasivo' },
  { value: 'educativo', label: 'Educativo' },
]

export default function ScriptGenerator() {
  const [title, setTitle] = useState('')
  const [tone, setTone] = useState('narrativo')
  const [duration, setDuration] = useState('10 minutos')
  const [loading, setLoading] = useState(false)
  const [script, setScript] = useState<Script | null>(null)
  const [isDemo, setIsDemo] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  })

  const handleGenerate = async () => {
    if (!title.trim()) {
      setSnackbar({ open: true, message: 'Informe o título do roteiro', severity: 'error' })
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, tone, duration }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Erro ao gerar roteiro')
      setScript(data.script)
      setIsDemo(data.isDemo)
      setSnackbar({ open: true, message: 'Roteiro gerado com sucesso!', severity: 'success' })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao gerar roteiro'
      setSnackbar({ open: true, message, severity: 'error' })
    } finally {
      setLoading(false)
    }
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
          Gerar Roteiro
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Título do Vídeo"
              placeholder="Ex: O Assassino que Nunca Foi Capturado"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              select
              label="Tom"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              {tones.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Duração Alvo"
              placeholder="Ex: 10 minutos"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
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
              {loading ? 'Gerando...' : 'Gerar Roteiro'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {script && <ScriptEditor script={script} onUpdate={setScript} />}

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
