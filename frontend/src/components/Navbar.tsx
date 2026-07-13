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
  Tooltip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BarChartIcon from '@mui/icons-material/BarChart';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SearchIcon from '@mui/icons-material/Search';
import { authService } from '../services/authService';

const DRAWER_WIDTH = 240;
const COLLAPSED_DRAWER_WIDTH = 70;

interface NavbarProps {
  username?: string;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
  collapsed: boolean;
  onToggleSidebar: () => void;
}

export default function Navbar({ username, themeMode, onToggleTheme, collapsed, onToggleSidebar }: NavbarProps) {
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

  const navSections = [
    {
      title: 'Analytics',
      items: [
        { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, shortcut: 'Ctrl+B' },
        { text: 'Reports', path: '/reports', icon: <BarChartIcon />, shortcut: 'R' },
      ]
    },
    {
      title: 'Operations',
      items: [
        { text: 'Transactions', path: '/transactions', icon: <ReceiptIcon />, shortcut: 'T' },
        { text: 'Budgets', path: '/budgets', icon: <AccountBalanceWalletIcon />, shortcut: 'B' },
      ]
    }
  ];

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
      {/* Brand Header */}
      <Box sx={{ py: 2, px: collapsed ? 0 : 1, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', mb: 2 }}>
        {!collapsed ? (
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
        ) : (
          <Typography variant="h5" component={Link} to="/dashboard" sx={{ textDecoration: 'none', display: 'flex' }}>
            💰
          </Typography>
        )}
        <IconButton onClick={onToggleSidebar} size="small" sx={{ display: { xs: 'none', md: 'inline-flex' } }}>
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>

      {/* Mock Search Input */}
      {!collapsed ? (
        <Box
          sx={{
            px: 2,
            py: 1,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            borderRadius: '12px',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.default',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
            '&:hover': { borderColor: 'primary.main' }
          }}
        >
          <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, fontSize: '0.8rem' }}>
            Search...
          </Typography>
          <Typography variant="caption" sx={{ bgcolor: 'rgba(255,255,255,0.06)', px: 0.75, py: 0.2, borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.7rem' }}>
            ⌘K
          </Typography>
        </Box>
      ) : (
        <Tooltip title="Search (⌘K)" placement="right" arrow>
          <IconButton
            sx={{
              mx: 'auto',
              mb: 3,
              display: 'flex',
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.default',
              p: 1.25,
            }}
          >
            <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          </IconButton>
        </Tooltip>
      )}

      {/* Nav List */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
        {navSections.map((section) => (
          <Box key={section.title} sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {!collapsed ? (
              <Typography
                variant="caption"
                sx={{
                  px: 1.5,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  letterSpacing: '1px',
                  mb: 0.5
                }}
              >
                {section.title}
              </Typography>
            ) : (
              <Divider sx={{ mx: 0.5, my: 0.5, opacity: 0.3 }} />
            )}
            
            {section.items.map((item) => {
              const isActive = location.pathname === item.path;
              const buttonContent = (
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    borderRadius: '12px',
                    py: 1.25,
                    px: collapsed ? 1.5 : 2,
                    justifyContent: collapsed ? 'center' : 'initial',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    color: isActive ? 'primary.main' : 'text.secondary',
                    bgcolor: isActive ? 'rgba(0, 242, 254, 0.08)' : 'transparent',
                    border: isActive ? '1px solid rgba(0, 242, 254, 0.15)' : '1px solid transparent',
                    '&:hover': {
                      bgcolor: isActive ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                      color: isActive ? 'primary.main' : 'text.primary',
                      transform: collapsed ? 'none' : 'translateX(4px)',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? 'auto' : 40,
                      color: isActive ? 'primary.main' : 'text.secondary',
                      transition: 'color 0.2s',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 700 : 500,
                        variant: 'body2',
                      }}
                    />
                  )}
                  {isActive && !collapsed && (
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

              return collapsed ? (
                <Tooltip key={item.text} title={item.text} placement="right" arrow>
                  <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                    {buttonContent}
                  </Box>
                </Tooltip>
              ) : (
                <Box key={item.text}>{buttonContent}</Box>
              );
            })}
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 1, opacity: 0.5 }} />

      {/* Footer Profile & Actions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {/* Theme Toggle Button */}
        {collapsed ? (
          <Tooltip title={themeMode === 'dark' ? 'Light Mode' : 'Dark Mode'} placement="right" arrow>
            <IconButton
              onClick={onToggleTheme}
              sx={{
                mx: 'auto',
                color: 'text.secondary',
                '&:hover': { color: 'text.primary', bgcolor: 'rgba(255, 255, 255, 0.04)' }
              }}
            >
              {themeMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Tooltip>
        ) : (
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
        )}

        {/* User Card */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? 0 : 1.5,
            p: collapsed ? 0.75 : 1.5,
            justifyContent: collapsed ? 'center' : 'initial',
            borderRadius: '16px',
            bgcolor: themeMode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
            border: '1px solid',
            borderColor: 'divider',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
          onClick={handleMenuOpen}
        >
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 700 }}>
            {username ? username[0].toUpperCase() : 'A'}
          </Avatar>
          {!collapsed && (
            <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
              <Typography variant="body2" noWrap sx={{ fontWeight: 700, color: 'text.primary' }}>
                {username || 'Guest User'}
              </Typography>
              <Typography variant="caption" noWrap display="block" sx={{ color: 'text.secondary' }}>
                View Account
              </Typography>
            </Box>
          )}
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
      <Box component="nav" sx={{ width: { md: collapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH }, flexShrink: { md: 0 }, transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
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
              width: collapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH,
              boxShadow: '2px 0 24px 0 rgba(0, 0, 0, 0.15)',
              borderRight: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              overflowX: 'hidden',
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
