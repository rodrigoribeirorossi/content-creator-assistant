'use client'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import LinearProgress from '@mui/material/LinearProgress'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckIcon from '@mui/icons-material/Check'
import type { SeoOptimization } from '@/types'

export default function SeoOptimizer() {
  const [videoTheme, setVideoTheme] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SeoOptimization | null>(null)
  const [isDemo, setIsDemo] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  })

  const handleOptimize = async () => {
    if (!videoTheme.trim()) {
      setSnackbar({ open: true, message: 'Informe o tema do vídeo', severity: 'error' })
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/optimize-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoTheme }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Erro ao otimizar SEO')
      setResult(data.seo)
      setIsDemo(data.isDemo)
      setSnackbar({ open: true, message: 'SEO otimizado com sucesso!', severity: 'success' })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao otimizar SEO'
      setSnackbar({ open: true, message, severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleCopyAll = async () => {
    if (!result) return
    const text = `TÍTULO:\n${result.videoTitle}\n\nDESCRIÇÃO:\n${result.description}\n\nTAGS:\n${result.tags.join(', ')}`
    await navigator.clipboard.writeText(text)
    setCopied('all')
    setTimeout(() => setCopied(null), 2000)
  }

  const scoreColor = (score: number) => {
    if (score >= 80) return '#10B981'
    if (score >= 60) return '#F59E0B'
    return '#EF4444'
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
          Otimização SEO para YouTube
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={9}>
            <TextField
              fullWidth
              label="Tema do Vídeo"
              placeholder="Ex: Assassino serial brasileiro anos 90, Mistério na floresta amazônica"
              value={videoTheme}
              onChange={(e) => setVideoTheme(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleOptimize}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
              sx={{ height: 56 }}
            >
              {loading ? 'Otimizando...' : 'Otimizar SEO'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {result && (
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              Resultado da Otimização
            </Typography>
            <Button
              variant="contained"
              color="success"
              startIcon={copied === 'all' ? <CheckIcon /> : <ContentCopyIcon />}
              onClick={handleCopyAll}
            >
              {copied === 'all' ? 'Copiado!' : 'Copiar Tudo'}
            </Button>
          </Box>

          {result.score !== null && result.score !== undefined && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2">Score SEO</Typography>
                <Typography variant="subtitle2" fontWeight={700} color={scoreColor(result.score)}>
                  {result.score}/100
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={result.score}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '& .MuiLinearProgress-bar': { backgroundColor: scoreColor(result.score) },
                }}
              />
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                TÍTULO OTIMIZADO
              </Typography>
              <Tooltip title={copied === 'title' ? 'Copiado!' : 'Copiar'}>
                <IconButton size="small" onClick={() => handleCopy(result.videoTitle, 'title')}>
                  {copied === 'title' ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="body1" fontWeight={500}>
              {result.videoTitle}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {result.videoTitle.length} caracteres
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                DESCRIÇÃO
              </Typography>
              <Tooltip title={copied === 'desc' ? 'Copiado!' : 'Copiar'}>
                <IconButton size="small" onClick={() => handleCopy(result.description ?? '', 'desc')}>
                  {copied === 'desc' ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
              {result.description}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                TAGS ({result.tags.length})
              </Typography>
              <Tooltip title={copied === 'tags' ? 'Copiado!' : 'Copiar'}>
                <IconButton size="small" onClick={() => handleCopy(result.tags.join(', '), 'tags')}>
                  {copied === 'tags' ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {result.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Box>
          </Box>
        </Paper>
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
