'use client'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import CircularProgress from '@mui/material/CircularProgress'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import type { AffiliateLink } from '@/types'

const platforms = ['hotmart', 'kiwify', 'amazon', 'monetizze', 'eduzz', 'outro']

const platformColors: Record<string, string> = {
  hotmart: '#FF6B00',
  kiwify: '#00C853',
  amazon: '#007AFF',
  monetizze: '#9C27B0',
  eduzz: '#E53935',
  outro: '#607D8B',
}

const emptyForm = {
  productName: '',
  platform: 'hotmart',
  originalUrl: '',
  shortUrl: '',
  commission: '',
  category: '',
}

export default function LinkManager() {
  const [links, setLinks] = useState<AffiliateLink[]>([])
  const [loading, setLoading] = useState(true)
  const [platformFilter, setPlatformFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<AffiliateLink | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  })

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/affiliate-links')
      const data = await res.json()
      setLinks(data.links ?? [])
    } catch {
      setLinks([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLinks() }, [])

  const filteredLinks = platformFilter === 'all' ? links : links.filter((l) => l.platform === platformFilter)

  const openAddDialog = () => {
    setEditingLink(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  const openEditDialog = (link: AffiliateLink) => {
    setEditingLink(link)
    setForm({
      productName: link.productName,
      platform: link.platform,
      originalUrl: link.originalUrl,
      shortUrl: link.shortUrl ?? '',
      commission: link.commission?.toString() ?? '',
      category: link.category ?? '',
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.productName || !form.originalUrl) {
      setSnackbar({ open: true, message: 'Nome e URL são obrigatórios', severity: 'error' })
      return
    }
    setSaving(true)
    try {
      const body = {
        ...form,
        commission: form.commission ? parseFloat(form.commission) : null,
      }
      const method = editingLink ? 'PUT' : 'POST'
      const url = editingLink ? `/api/affiliate-links?id=${editingLink.id}` : '/api/affiliate-links'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Erro ao salvar')
      await fetchLinks()
      setDialogOpen(false)
      setSnackbar({ open: true, message: editingLink ? 'Link atualizado!' : 'Link adicionado!', severity: 'success' })
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro ao salvar'
      setSnackbar({ open: true, message, severity: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este link?')) return
    try {
      await fetch(`/api/affiliate-links?id=${id}`, { method: 'DELETE' })
      await fetchLinks()
      setSnackbar({ open: true, message: 'Link excluído!', severity: 'success' })
    } catch {
      setSnackbar({ open: true, message: 'Erro ao excluir', severity: 'error' })
    }
  }

  const handleToggleActive = async (link: AffiliateLink) => {
    try {
      await fetch(`/api/affiliate-links?id=${link.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...link, isActive: !link.isActive }),
      })
      await fetchLinks()
    } catch {
      // silently fail
    }
  }

  const generateDescriptionBlock = () => {
    const activeLinks = links.filter((l) => l.isActive)
    const block = activeLinks.map((l, i) => `🔗 Link ${i + 1} - ${l.productName}: ${l.shortUrl ?? l.originalUrl}`).join('\n')
    navigator.clipboard.writeText(block)
    setSnackbar({ open: true, message: 'Bloco copiado para a área de transferência!', severity: 'success' })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Plataforma</InputLabel>
            <Select value={platformFilter} label="Plataforma" onChange={(e) => setPlatformFilter(e.target.value)}>
              <MenuItem value="all">Todas</MenuItem>
              {platforms.map((p) => (
                <MenuItem key={p} value={p} sx={{ textTransform: 'capitalize' }}>
                  {p}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<ContentCopyIcon />} onClick={generateDescriptionBlock}>
            Gerar Bloco de Descrição
          </Button>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAddDialog}>
          Adicionar Link
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Produto</TableCell>
              <TableCell>Plataforma</TableCell>
              <TableCell>Comissão</TableCell>
              <TableCell>Categoria</TableCell>
              <TableCell align="center">Ativo</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredLinks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">Nenhum link cadastrado</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredLinks.map((link) => (
                <TableRow key={link.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>{link.productName}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {link.shortUrl ?? link.originalUrl}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={link.platform}
                      size="small"
                      sx={{
                        backgroundColor: `${platformColors[link.platform] ?? platformColors.outro}22`,
                        color: platformColors[link.platform] ?? platformColors.outro,
                        textTransform: 'capitalize',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell>{link.commission ? `${link.commission}%` : '—'}</TableCell>
                  <TableCell>{link.category ?? '—'}</TableCell>
                  <TableCell align="center">
                    <Switch checked={link.isActive} onChange={() => handleToggleActive(link)} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEditDialog(link)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(link.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingLink ? 'Editar Link' : 'Adicionar Link de Afiliado'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Nome do Produto"
              fullWidth
              value={form.productName}
              onChange={(e) => setForm((p) => ({ ...p, productName: e.target.value }))}
            />
            <TextField
              select
              label="Plataforma"
              fullWidth
              value={form.platform}
              onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value }))}
            >
              {platforms.map((p) => (
                <MenuItem key={p} value={p} sx={{ textTransform: 'capitalize' }}>
                  {p}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="URL Original"
              fullWidth
              value={form.originalUrl}
              onChange={(e) => setForm((p) => ({ ...p, originalUrl: e.target.value }))}
            />
            <TextField
              label="URL Encurtada (opcional)"
              fullWidth
              value={form.shortUrl}
              onChange={(e) => setForm((p) => ({ ...p, shortUrl: e.target.value }))}
            />
            <TextField
              label="Comissão (%)"
              type="number"
              fullWidth
              value={form.commission}
              onChange={(e) => setForm((p) => ({ ...p, commission: e.target.value }))}
            />
            <TextField
              label="Categoria"
              fullWidth
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? <CircularProgress size={20} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((p) => ({ ...p, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
