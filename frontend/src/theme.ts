import { createTheme } from '@mui/material/styles';

const baseTypography = {
  fontFamily: '"Outfit", "Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: { fontWeight: 700, fontFamily: '"Outfit", sans-serif' },
  h2: { fontWeight: 700, fontFamily: '"Outfit", sans-serif' },
  h3: { fontWeight: 600, fontFamily: '"Outfit", sans-serif' },
  h4: { fontWeight: 600, fontFamily: '"Outfit", sans-serif' },
  h5: { fontWeight: 600, fontFamily: '"Outfit", sans-serif' },
  h6: { fontWeight: 600, fontFamily: '"Outfit", sans-serif' },
  subtitle1: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
  subtitle2: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
  body1: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
  body2: { fontFamily: '"Plus Jakarta Sans", sans-serif' },
  button: { fontWeight: 600, fontFamily: '"Outfit", sans-serif' },
};

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00f2fe', // vibrant cyan
      contrastText: '#090d16',
    },
    secondary: {
      main: '#f43f5e', // rose
    },
    background: {
      default: '#090d16', // deep dark background
      paper: '#111827', // dark grey/navy surface
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
    success: {
      main: '#10b981', // emerald
    },
    warning: {
      main: '#f59e0b', // amber
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: baseTypography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#090d16',
          scrollbarColor: '#1e293b #090d16',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#090d16',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#1e293b',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#334155',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '16px',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: '16px',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          padding: '8px 18px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
          color: '#090d16',
          boxShadow: '0 4px 14px 0 rgba(0, 242, 254, 0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #00f2fe 20%, #4facfe 80%)',
            boxShadow: '0 6px 20px 0 rgba(0, 242, 254, 0.4)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
  },
});

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // royal blue
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#db2777', // vibrant pink
    },
    background: {
      default: '#f8fafc', // slate 50
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    success: {
      main: '#059669', // emerald
    },
    warning: {
      main: '#d97706', // amber
    },
    divider: 'rgba(0, 0, 0, 0.06)',
  },
  typography: baseTypography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f8fafc',
          scrollbarColor: '#cbd5e1 #f8fafc',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f8fafc',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#cbd5e1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#94a3b8',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 8px 32px 0 rgba(15, 23, 42, 0.05)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
          boxShadow: '0 8px 32px 0 rgba(15, 23, 42, 0.05)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          padding: '8px 18px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #2563eb 20%, #3b82f6 80%)',
            boxShadow: '0 6px 20px 0 rgba(37, 99, 235, 0.35)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
  },
});
