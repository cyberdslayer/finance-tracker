import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, CircularProgress } from '@mui/material';
import { transactionService } from '../services/transactionService';

const COLORS = [
  '#00f2fe', '#f43f5e', '#10b981', '#8b5cf6', '#f59e0b',
  '#ec4899', '#3b82f6', '#14b8a6', '#6366f1', '#a855f7'
];

export default function CategoryBreakdownChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await transactionService.getSummary();
      const categoryData = res.data.category_breakdown.map((cat: any) => ({
        name: cat.category,
        value: cat.total,
      }));
      setData(categoryData);
    } catch (err) {
      console.error('Failed to load chart data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (data.length === 0) return <div>No data available</div>;

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ₹${value}`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `₹${value}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );
}
