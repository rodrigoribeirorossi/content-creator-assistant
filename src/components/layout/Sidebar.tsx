'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import ArticleIcon from '@mui/icons-material/Article'
import SearchIcon from '@mui/icons-material/Search'
import LinkIcon from '@mui/icons-material/Link'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import VideocamIcon from '@mui/icons-material/Videocam'

const DRAWER_WIDTH = 240

const navItems = [
  { label: 'Dashboard', href: '/', icon: <DashboardIcon /> },
  { label: 'Ideias', href: '/ideas', icon: <LightbulbIcon /> },
  { label: 'Roteiros', href: '/scripts', icon: <ArticleIcon /> },
  { label: 'SEO', href: '/seo', icon: <SearchIcon /> },
  { label: 'Links', href: '/links', icon: <LinkIcon /> },
  { label: 'Calendário', href: '/calendar', icon: <CalendarMonthIcon /> },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <VideocamIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        <Typography variant="h6" fontWeight={700} color="primary">
          CCA
        </Typography>
      </Box>
      <Divider />
      <List sx={{ mt: 1 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <ListItem key={item.href} disablePadding sx={{ px: 1, mb: 0.5 }}>
              <ListItemButton
                component={Link}
                href={item.href}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(124, 58, 237, 0.15)',
                    '&:hover': { backgroundColor: 'rgba(124, 58, 237, 0.25)' },
                  },
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'text.secondary', minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'primary.main' : 'text.primary',
                    fontSize: '0.875rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Drawer>
  )
}
