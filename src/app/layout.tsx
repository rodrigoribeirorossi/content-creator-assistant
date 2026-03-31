import type { Metadata } from 'next'
import ThemeRegistry from '@/components/layout/ThemeRegistry'
import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import Box from '@mui/material/Box'

export const metadata: Metadata = {
  title: 'Content Creator Assistant',
  description: 'Ferramenta para criadores de conteúdo dark channels',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeRegistry>
          <Box sx={{ display: 'flex' }}>
            <Sidebar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                mt: 8,
                minHeight: '100vh',
                backgroundColor: 'background.default',
              }}
            >
              <Header />
              {children}
            </Box>
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  )
}
