import { createTheme } from '@mui/material/styles'

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C3AED',
    },
    secondary: {
      main: '#06B6D4',
    },
    background: {
      default: '#0F0F0F',
      paper: '#1A1A1A',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
})
