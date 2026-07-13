import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, CircularProgress, Typography } from '@mui/material';
import { transactionService } from '../services/transactionService';

const COLORS = [
  '#00f2fe', '#f43f5e', '#10b981', '#8b5cf6', '#f59e0b',
  '#ec4899', '#3b82f6', '#14b8a6', '#6366f1', '#a855f7'
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    return (
      <Box
        className="glass-panel"
        sx={{
          p: 1.5,
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.payload.fill || entry.color }} />
        <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {entry.name}:
        </Typography>
        <Typography variant="body2" sx={{ color: entry.payload.fill || entry.color, fontWeight: 800 }}>
          ₹{Number(entry.value).toLocaleString('en-IN')}
        </Typography>
      </Box>
    );
  }
  return null;
};

export default function CategoryBreakdownChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalOutflow, setTotalOutflow] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await transactionService.getSummary();
      const breakdown = res.data.category_breakdown || [];
      
      const total = breakdown.reduce((sum: number, cat: any) => sum + Number(cat.total), 0);
      setTotalOutflow(total);

      const categoryData = breakdown.map((cat: any) => ({
        name: cat.category_display || cat.category,
        value: cat.total,
      }));
      setData(categoryData);
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

  if (data.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 350 }}>
        <Typography color="text.secondary">No category data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="40%"
            innerRadius={70}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ outline: 'none' }} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ paddingBottom: '10px' }}
            formatter={(value) => (
              <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
          Total Spent
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.25 }}>
          ₹{totalOutflow.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </Typography>
      </Box>
    </Box>
  );
}
