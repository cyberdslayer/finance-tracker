import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Toolbar,
  AppBar,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BarChartIcon from '@mui/icons-material/BarChart';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { authService } from '../services/authService';

const DRAWER_WIDTH = 240;

interface NavbarProps {
  username?: string;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function Navbar({ username, themeMode, onToggleTheme }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem('refresh');
      if (refresh) {
        await authService.logout(refresh);
      }
    } finally {
      localStorage.clear();
      navigate('/login');
    }
  };

  const navItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon /> },
    { text: 'Transactions', path: '/transactions', icon: <ReceiptIcon /> },
    { text: 'Budgets', path: '/budgets', icon: <AccountBalanceWalletIcon /> },
    { text: 'Reports', path: '/reports', icon: <BarChartIcon /> },
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
      {/* Brand Header */}
      <Box sx={{ py: 3, px: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography
          variant="h5"
          component={Link}
          to="/dashboard"
          sx={{
            fontWeight: 800,
            textDecoration: 'none',
            color: 'text.primary',
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          💰 Finance
        </Typography>
      </Box>

      <Divider sx={{ my: 1, opacity: 0.5 }} />

      {/* Nav List */}
      <List sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.text}
              component={Link}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: '12px',
                py: 1.25,
                px: 2,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                color: isActive ? 'primary.main' : 'text.secondary',
                bgcolor: isActive ? 'rgba(0, 242, 254, 0.08)' : 'transparent',
                border: isActive ? '1px solid rgba(0, 242, 254, 0.15)' : '1px solid transparent',
                '&:hover': {
                  bgcolor: isActive ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? 'primary.main' : 'text.primary',
                  transform: 'translateX(4px)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: isActive ? 'primary.main' : 'text.secondary',
                  transition: 'color 0.2s',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive ? 700 : 500,
                  variant: 'body2',
                }}
              />
              {isActive && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: '25%',
                    height: '50%',
                    width: 4,
                    bgcolor: 'primary.main',
                    borderRadius: '0 4px 4px 0',
                    boxShadow: '0 0 8px #00f2fe',
                  }}
                />
              )}
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ my: 1, opacity: 0.5 }} />

      {/* Footer Profile & Actions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* Theme Toggle Button */}
        <ListItemButton
          onClick={onToggleTheme}
          sx={{
            borderRadius: '12px',
            py: 1,
            color: 'text.secondary',
            '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.04)', color: 'text.primary' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </ListItemIcon>
          <ListItemText primary={themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'} primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
        </ListItemButton>

        {/* User Card */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: '16px',
            bgcolor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            border: '1px solid',
            borderColor: 'divider',
            cursor: 'pointer',
          }}
          onClick={handleMenuOpen}
        >
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 700 }}>
            {username ? username[0].toUpperCase() : 'A'}
          </Avatar>
          <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 700, color: 'text.primary' }}>
              {username || 'Guest User'}
            </Typography>
            <Typography variant="caption" noWrap display="block" sx={{ color: 'text.secondary' }}>
              View Account
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Profile menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
        PaperProps={{
          className: 'glass-panel',
          sx: {
            minWidth: 160,
            mt: -1,
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            borderRadius: '12px',
          },
        }}
      >
        <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1.25, borderRadius: '8px', mx: 0.5, color: 'error.main' }}>
          <LogoutIcon fontSize="small" />
          <Typography variant="body2" fontWeight={600}>Logout</Typography>
        </MenuItem>
      </Menu>
    </Box>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          display: { xs: 'block', md: 'none' },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundImage: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component={Link}
            to="/dashboard"
            sx={{
              fontWeight: 800,
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            💰 Finance
          </Typography>
          <IconButton onClick={onToggleTheme} color="inherit">
            {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebar drawer container */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          PaperProps={{
            className: 'glass-panel',
            sx: {
              width: DRAWER_WIDTH,
              boxShadow: '8px 0 32px 0 rgba(0, 0, 0, 0.25)',
              borderRight: '1px solid',
              borderColor: 'divider',
            },
          }}
          sx={{ display: { xs: 'block', md: 'none' } }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop permanent sidebar */}
        <Drawer
          variant="permanent"
          PaperProps={{
            sx: {
              width: DRAWER_WIDTH,
              boxShadow: '2px 0 24px 0 rgba(0, 0, 0, 0.15)',
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
            },
          }}
          sx={{ display: { xs: 'none', md: 'block' } }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
}
