import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, CircularProgress } from '@mui/material';
import { transactionService } from '../services/transactionService';

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

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ width: '100%', height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value) => `₹${value}`} />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} name="Income" />
          <Line type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={3} name="Expenses" />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
