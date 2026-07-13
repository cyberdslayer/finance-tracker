import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, CircularProgress, Typography, Stack } from '@mui/material';
import { transactionService } from '../services/transactionService';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box
        className="glass-panel"
        sx={{
          p: 1.75,
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, display: 'block', mb: 1.25, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </Typography>
        <Stack spacing={1}>
          {payload.map((entry: any) => (
            <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color }} />
                <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                  {entry.name}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: entry.color, fontWeight: 800 }}>
                ₹{Number(entry.value).toLocaleString('en-IN')}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    );
  }
  return null;
};

export default function MonthlyCategoryChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await transactionService.getMonthlyTrend();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.06)" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 11, fontWeight: 600 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 11, fontWeight: 600 }}
            tickFormatter={(value) => (value >= 1000 ? `₹${(value / 1000).toFixed(0)}K` : `₹${value}`)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#incomeGrad)"
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Income"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#f43f5e"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#expenseGrad)"
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Expenses"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
