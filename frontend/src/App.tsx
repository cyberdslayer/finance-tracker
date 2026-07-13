import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container, Paper, TextField, Box, Stack, Alert, CircularProgress, Button, Typography, IconButton } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { initializeAuth, getToken, setAuthHeader } from './services/api';
import { authService } from './services/authService';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import TransactionsPage from './pages/TransactionsPage';
import BudgetsPage from './pages/BudgetsPage';
import ReportsPage from './pages/ReportsPage';
import { darkTheme, lightTheme } from './theme';

interface AuthPageProps {
  type: 'login' | 'register';
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
}

function AuthPage({ type, themeMode, onToggleTheme }: AuthPageProps) {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type === 'register') {
        await authService.register(form.username, form.email, form.password);
        setMessage('Registration successful. You can log in now.');
        setForm({ username: '', email: '', password: '' });
      } else {
        const res = await authService.login(form.username, form.password);
        localStorage.setItem('access', res.data.access);
        localStorage.setItem('refresh', res.data.refresh);
        setAuthHeader(res.data.access);
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const messages = Object.entries(data)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join(' | ');
        setMessage(messages || 'Something went wrong');
      } else {
        setMessage(err.response?.data?.detail || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', position: 'relative', p: 2 }}>
      {/* Top right theme toggle */}
      <IconButton onClick={onToggleTheme} color="primary" sx={{ position: 'absolute', top: 16, right: 16, border: '1px solid', borderColor: 'divider' }}>
        {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
      
      <Container maxWidth="xs">
        <Paper className="glass-panel" sx={{ p: 4, borderRadius: '24px', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)' }}>
          <Typography variant="h4" align="center" sx={{ fontWeight: 800, mb: 1, background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            💰 Finance Tracker
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 4 }}>
            {type === 'login' ? 'Sign in to manage your money' : 'Create a new financial profile'}
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              {type === 'register' && (
                <TextField
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  fullWidth
                  required
                  InputProps={{ sx: { borderRadius: '12px' } }}
                />
              )}
              <TextField
                label="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                fullWidth
                required
                InputProps={{ sx: { borderRadius: '12px' } }}
              />
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                fullWidth
                required
                InputProps={{ sx: { borderRadius: '12px' } }}
              />
              {message && (
                <Alert severity={message.includes('successful') ? 'success' : 'error'} sx={{ borderRadius: '12px' }}>
                  {message}
                </Alert>
              )}
              <Button type="submit" variant="contained" color="primary" disabled={loading} size="large" sx={{ py: 1.5 }}>
                {loading ? <CircularProgress size={24} /> : type === 'login' ? 'Login' : 'Register'}
              </Button>
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {type === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <a href={type === 'login' ? '/register' : '/login'} style={{ textDecoration: 'none', color: '#00f2fe', fontWeight: 600 }}>
                    {type === 'login' ? 'Sign up' : 'Sign in'}
                  </a>
                </Typography>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
}

interface ProtectedLayoutProps {
  children: JSX.Element;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
}

function ProtectedLayout({ children, themeMode, onToggleTheme }: ProtectedLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setAuthHeader(token);
      authService
        .getMe()
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.clear();
          window.location.href = '/login';
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: 'background.default' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default', flexDirection: { xs: 'column', md: 'row' } }}>
      <Navbar username={user?.username} themeMode={themeMode} onToggleTheme={onToggleTheme} />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, width: '100%' }}>
        <Box className="animate-fade-in">
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default function App() {
  const [mode, setMode] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme-mode') as 'dark' | 'light') || 'dark';
  });

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme-mode', next);
      return next;
    });
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  const activeTheme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={activeTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthPage type="login" themeMode={mode} onToggleTheme={toggleTheme} />} />
        <Route path="/register" element={<AuthPage type="register" themeMode={mode} onToggleTheme={toggleTheme} />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedLayout themeMode={mode} onToggleTheme={toggleTheme}>
                <Dashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <ProtectedLayout themeMode={mode} onToggleTheme={toggleTheme}>
                <TransactionsPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/budgets"
          element={
            <ProtectedRoute>
              <ProtectedLayout themeMode={mode} onToggleTheme={toggleTheme}>
                <BudgetsPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ProtectedLayout themeMode={mode} onToggleTheme={toggleTheme}>
                <ReportsPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  );
}
