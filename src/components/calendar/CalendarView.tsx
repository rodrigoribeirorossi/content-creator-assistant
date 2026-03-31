'use client'
import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import AddIcon from '@mui/icons-material/Add'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import DeleteIcon from '@mui/icons-material/Delete'
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth'
import ViewListIcon from '@mui/icons-material/ViewList'
import type { ContentCalendar } from '@/types'

const statusConfig: Record<string, { label: string; color: string }> = {
  idea: { label: 'Ideia', color: '#9E9E9E' },
  scripted: { label: 'Roteirizado', color: '#2196F3' },
  recorded: { label: 'Gravado', color: '#FF9800' },
  edited: { label: 'Editado', color: '#FFEB3B' },
  published: { label: 'Publicado', color: '#4CAF50' },
}

const platforms = ['YouTube', 'TikTok', 'Instagram', 'Kwai', 'Todos']

const DAYS_OF_WEEK = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const emptyForm = {
  title: '',
  description: '',
  platform: 'YouTube',
  status: 'idea',
  scheduledAt: '',
}

export default function CalendarView() {
  const [items, setItems] = useState<ContentCalendar[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'month' | 'list'>('month')
  const [platformFilter, setPlatformFilter] = useState('Todos')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  })

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/content-calendar')
      const data = await res.json()
      setItems(data.items ?? [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchItems() }, [])

  const filteredItems = platformFilter === 'Todos' ? items : items.filter((i) => i.platform === platformFilter)

  const getItemsForDay = (day: number) => {
    return filteredItems.filter((item) => {
      if (!item.scheduledAt) return false
      const d = new Date(item.scheduledAt)
      return d.getFullYear() === currentDate.getFullYear() &&
        d.getMonth() === currentDate.getMonth() &&
        d.getDate() === day
    })
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return { firstDay, daysInMonth }
  }

  const { firstDay, daysInMonth } = getDaysInMonth()

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  const monthName = currentDate.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })

  const handleSave = async () => {
    if (!form.title) {
      setSnackbar({ open: true, message: 'Título é obrigatório', severity: 'error' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/content-calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
        }),
      })
      if (!res.ok) throw new Error('Erro ao salvar')
      await fetchItems()
      setDialogOpen(false)
      setForm(emptyForm)
      setSnackbar({ open: true, message: 'Conteúdo adicionado!', severity: 'success' })
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Erro ao salvar'
      setSnackbar({ open: true, message, severity: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/content-calendar?id=${id}`, { method: 'DELETE' })
      await fetchItems()
      setSnackbar({ open: true, message: 'Removido!', severity: 'success' })
    } catch {
      setSnackbar({ open: true, message: 'Erro ao remover', severity: 'error' })
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <ToggleButtonGroup value={view} exclusive onChange={(_, v) => v && setView(v)} size="small">
            <ToggleButton value="month"><CalendarViewMonthIcon fontSize="small" /></ToggleButton>
            <ToggleButton value="list"><ViewListIcon fontSize="small" /></ToggleButton>
          </ToggleButtonGroup>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <InputLabel>Plataforma</InputLabel>
            <Select value={platformFilter} label="Plataforma" onChange={(e) => setPlatformFilter(e.target.value)}>
              {platforms.map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {Object.entries(statusConfig).map(([key, { label, color }]) => (
              <Chip key={key} label={label} size="small" sx={{ backgroundColor: `${color}33`, color }} />
            ))}
          </Box>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Novo Conteúdo
        </Button>
      </Box>

      {view === 'month' ? (
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <IconButton onClick={prevMonth}><ChevronLeftIcon /></IconButton>
            <Typography variant="h6" fontWeight={600} sx={{ textTransform: 'capitalize' }}>{monthName}</Typography>
            <IconButton onClick={nextMonth}><ChevronRightIcon /></IconButton>
          </Box>
          <Grid container columns={7}>
            {DAYS_OF_WEEK.map((day) => (
              <Grid item xs={1} key={day}>
                <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ pb: 1 }}>
                  {day}
                </Typography>
              </Grid>
            ))}
            {Array.from({ length: firstDay }).map((_, i) => <Grid item xs={1} key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dayItems = getItemsForDay(day)
              const isToday = new Date().getDate() === day &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear()
              return (
                <Grid item xs={1} key={day}>
                  <Box sx={{
                    minHeight: 80,
                    p: 0.5,
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 1,
                    m: 0.25,
                    backgroundColor: isToday ? 'rgba(124,58,237,0.1)' : 'transparent',
                  }}>
                    <Typography variant="caption" fontWeight={isToday ? 700 : 400} color={isToday ? 'primary.main' : 'text.secondary'}>
                      {day}
                    </Typography>
                    {dayItems.map((item) => (
                      <Box key={item.id} sx={{
                        mt: 0.25, p: 0.25, borderRadius: 0.5,
                        backgroundColor: `${statusConfig[item.status]?.color ?? '#9E9E9E'}33`,
                        cursor: 'pointer',
                      }}>
                        <Typography variant="caption" sx={{
                          fontSize: '0.6rem',
                          color: statusConfig[item.status]?.color ?? '#9E9E9E',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}>
                          {item.title}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        </Paper>
      ) : (
        <Paper>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
          ) : filteredItems.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">Nenhum conteúdo agendado</Typography>
            </Box>
          ) : (
            <List>
              {filteredItems.map((item, index) => (
                <Box key={item.id}>
                  <ListItem>
                    <Box sx={{
                      width: 8, height: 8, borderRadius: '50%', mr: 2, flexShrink: 0,
                      backgroundColor: statusConfig[item.status]?.color ?? '#9E9E9E',
                    }} />
                    <ListItemText
                      primary={item.title}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                          <Chip label={item.platform} size="small" variant="outlined" />
                          <Chip label={statusConfig[item.status]?.label ?? item.status} size="small"
                            sx={{ backgroundColor: `${statusConfig[item.status]?.color ?? '#9E9E9E'}22`, color: statusConfig[item.status]?.color ?? '#9E9E9E' }} />
                          {item.scheduledAt && (
                            <Typography variant="caption" color="text.secondary">
                              {new Date(item.scheduledAt).toLocaleDateString('pt-BR')}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < filteredItems.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
        </Paper>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Novo Conteúdo no Calendário</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField label="Título" fullWidth value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            <TextField label="Descrição" fullWidth multiline rows={2} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
            <TextField select label="Plataforma" fullWidth value={form.platform} onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value }))}>
              {['YouTube', 'TikTok', 'Instagram', 'Kwai'].map((p) => <MenuItem key={p} value={p}>{p}</MenuItem>)}
            </TextField>
            <TextField select label="Status" fullWidth value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
              {Object.entries(statusConfig).map(([key, { label }]) => <MenuItem key={key} value={key}>{label}</MenuItem>)}
            </TextField>
            <TextField
              label="Data Agendada"
              type="datetime-local"
              fullWidth
              value={form.scheduledAt}
              onChange={(e) => setForm((p) => ({ ...p, scheduledAt: e.target.value }))}
              InputLabelProps={{ shrink: true }}
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
