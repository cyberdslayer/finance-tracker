import { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Box, Card, CardContent, CircularProgress, Alert, Stack } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SavingsIcon from '@mui/icons-material/Savings';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { transactionService } from '../services/transactionService';
import { budgetService } from '../services/budgetService';
import MonthlyCategoryChart from '../charts/MonthlyTrendChart';
import CategoryBreakdownChart from '../charts/CategoryBreakdownChart';

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [summaryRes, alertsRes, txRes] = await Promise.all([
        transactionService.getSummary(),
        budgetService.getAlerts(),
        transactionService.getAll(),
      ]);
      setSummary(summaryRes.data);
      setAlerts(alertsRes.data.alerts);
      
      // Get the 5 most recent transactions
      if (Array.isArray(txRes.data)) {
        setRecentTransactions(txRes.data.slice(0, 5));
      } else if (txRes.data && Array.isArray(txRes.data.results)) {
        setRecentTransactions(txRes.data.results.slice(0, 5));
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  const formatCurrency = (val: any) => {
    return val !== undefined && val !== null ? Number(val).toLocaleString('en-IN', { style: 'currency', currency: 'INR' }) : '₹0.00';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Title */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif' }}>
          Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track your income, savings, and spending trends
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-scale card-grad-income">
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography color="text.secondary" variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Monthly Income
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 1, color: '#10b981' }}>
                  {formatCurrency(summary?.monthly_income)}
                </Typography>
              </Box>
              <Box sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', p: 1.5, borderRadius: '12px', display: 'flex' }}>
                <TrendingUpIcon sx={{ color: '#10b981', fontSize: 28 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-scale card-grad-expense">
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography color="text.secondary" variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Monthly Expenses
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 1, color: '#f43f5e' }}>
                  {formatCurrency(summary?.monthly_expenses)}
                </Typography>
              </Box>
              <Box sx={{ bgcolor: 'rgba(244, 63, 94, 0.15)', p: 1.5, borderRadius: '12px', display: 'flex' }}>
                <TrendingDownIcon sx={{ color: '#f43f5e', fontSize: 28 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-scale card-grad-savings">
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography color="text.secondary" variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Monthly Savings
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 1, color: '#00f2fe' }}>
                  {formatCurrency(summary?.monthly_savings)}
                </Typography>
              </Box>
              <Box sx={{ bgcolor: 'rgba(0, 242, 254, 0.15)', p: 1.5, borderRadius: '12px', display: 'flex' }}>
                <SavingsIcon sx={{ color: '#00f2fe', fontSize: 28 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="hover-scale card-grad-yearly">
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography color="text.secondary" variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Yearly Savings
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 1, color: '#8b5cf6' }}>
                  {formatCurrency(summary?.yearly_savings)}
                </Typography>
              </Box>
              <Box sx={{ bgcolor: 'rgba(139, 92, 246, 0.15)', p: 1.5, borderRadius: '12px', display: 'flex' }}>
                <ShowChartIcon sx={{ color: '#8b5cf6', fontSize: 28 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Paper className="glass-panel" sx={{ p: 2, mb: 4, borderLeft: '4px solid #f59e0b', bgcolor: 'rgba(245, 158, 11, 0.05)' }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
            <WarningAmberIcon sx={{ color: '#f59e0b' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#f59e0b', fontSize: '1rem' }}>
              Budget Threshold Alerts
            </Typography>
          </Stack>
          <Stack spacing={0.5}>
            {alerts.map((alert, index) => (
              <Typography key={index} variant="body2" sx={{ color: 'text.primary', pl: 4 }}>
                <strong>{alert.category}</strong>: {alert.message}
              </Typography>
            ))}
          </Stack>
        </Paper>
      )}

      {/* Charts & Recent Activity */}
      <Grid container spacing={4}>
        {/* Charts Column */}
        <Grid item xs={12} lg={8}>
          <Stack spacing={4}>
            <Paper className="glass-panel" sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Income & Expense Trends
              </Typography>
              <MonthlyCategoryChart />
            </Paper>

            <Paper className="glass-panel" sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Expenses by Category
              </Typography>
              <CategoryBreakdownChart />
            </Paper>
          </Stack>
        </Grid>

        {/* Recent Activity Column */}
        <Grid item xs={12} lg={4}>
          <Paper className="glass-panel" sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Recent Transactions
            </Typography>
            {recentTransactions.length > 0 ? (
              <Stack spacing={2.5}>
                {recentTransactions.map((tx) => (
                  <Box
                    key={tx.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      borderRadius: '12px',
                      bgcolor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'translateX(4px)' }
                    }}
                  >
                    <Box sx={{ overflow: 'hidden', mr: 2 }}>
                      <Typography variant="body2" noWrap sx={{ fontWeight: 700 }}>
                        {tx.category_display || tx.category}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap display="block">
                        {tx.description || 'No description'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {new Date(tx.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 800,
                        color: tx.type === 'income' ? '#10b981' : '#f43f5e',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography color="text.secondary" variant="body2">
                  No recent transactions found
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
