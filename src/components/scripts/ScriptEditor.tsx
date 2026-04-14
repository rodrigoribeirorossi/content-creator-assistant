'use client'
import { useState } from 'react'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import SaveIcon from '@mui/icons-material/Save'
import CheckIcon from '@mui/icons-material/Check'
import type { Script } from '@/types'

interface ScriptEditorProps {
  script: Script
  onUpdate: (script: Script) => void
}

const statusColors: Record<string, 'default' | 'warning' | 'success' | 'primary'> = {
  draft: 'default',
  review: 'warning',
  approved: 'success',
  recorded: 'primary',
}

const statusLabel: Record<string, string> = {
  draft: 'Rascunho',
  review: 'Em Revisão',
  approved: 'Aprovado',
  recorded: 'Gravado',
}

export default function ScriptEditor({ script, onUpdate }: ScriptEditorProps) {
  const [content, setContent] = useState(script.content)
  const [copied, setCopied] = useState(false)

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            {script.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
            <Chip
              label={statusLabel[script.status] ?? script.status}
              size="small"
              color={statusColors[script.status] ?? 'default'}
            />
            {script.duration && <Chip label={script.duration} size="small" variant="outlined" />}
            <Chip label={`${wordCount} palavras`} size="small" variant="outlined" />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={copied ? 'Copiado!' : 'Copiar roteiro'}>
            <IconButton onClick={handleCopy} color={copied ? 'success' : 'default'}>
              {copied ? <CheckIcon /> : <ContentCopyIcon />}
            </IconButton>
          </Tooltip>
          <Button
            variant="outlined"
            startIcon={<SaveIcon />}
            size="small"
            onClick={() => onUpdate({ ...script, content })}
          >
            Salvar
          </Button>
        </Box>
      </Box>
      <TextField
        fullWidth
        multiline
        minRows={20}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        sx={{
          '& .MuiInputBase-root': { fontFamily: 'monospace', fontSize: '0.875rem' },
        }}
      />
    </Paper>
  )
}
