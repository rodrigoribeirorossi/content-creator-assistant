'use client'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import NotificationsIcon from '@mui/icons-material/Notifications'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { usePathname } from 'next/navigation'

const DRAWER_WIDTH = 240

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/ideas': 'Gerador de Ideias',
  '/scripts': 'Roteiros',
  '/seo': 'Otimização SEO',
  '/links': 'Links de Afiliados',
  '/calendar': 'Calendário Editorial',
}

export default function Header() {
  const pathname = usePathname()
  const title = pageTitles[pathname] ?? 'Content Creator Assistant'

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
        ml: `${DRAWER_WIDTH}px`,
        backgroundColor: 'background.default',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Box>
        <IconButton color="inherit" size="small">
          <NotificationsIcon />
        </IconButton>
        <IconButton color="inherit" size="small" sx={{ ml: 1 }}>
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}
