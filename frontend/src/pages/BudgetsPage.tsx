import { useState } from 'react';
import {
  Container,
  Button,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BudgetList from '../components/BudgetList';
import { budgetService, CreateBudgetPayload } from '../services/budgetService';

const BUDGET_CATEGORIES = [
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transport' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'education', label: 'Education' },
  { value: 'travel', label: 'Travel' },
  { value: 'rent', label: 'Rent/Housing' },
  { value: 'other_expense', label: 'Other Expense' },
];

export default function BudgetsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [form, setForm] = useState<CreateBudgetPayload>({
    category: 'food',
    monthly_limit: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateBudget = async () => {
    if (!form.monthly_limit || form.monthly_limit <= 0) {
      setError('Please enter a valid monthly limit');
      return;
    }

    setLoading(true);
    try {
      await budgetService.create(form);
      setForm({
        category: 'food',
        monthly_limit: 0,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
      setError('');
      setDialogOpen(false);
      setRefreshTrigger(refreshTrigger + 1);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif' }}>
            Budgets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Set and track spending limits by category
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Create Budget
        </Button>
      </Box>

      <BudgetList onUpdate={refreshTrigger} />

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          className: 'glass-panel',
          sx: { borderRadius: '24px', p: 1, boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.3)' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1, fontFamily: '"Outfit", sans-serif' }}>
          Create New Budget
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={form.category}
                label="Category"
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                sx={{ borderRadius: '12px' }}
              >
                {BUDGET_CATEGORIES.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              type="number"
              label="Monthly Limit"
              value={form.monthly_limit || ''}
              onChange={(e) => setForm({ ...form, monthly_limit: parseFloat(e.target.value) || 0 })}
              inputProps={{ step: '0.01' }}
              InputProps={{ sx: { borderRadius: '12px' } }}
            />

            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                value={form.month}
                label="Month"
                onChange={(e) => setForm({ ...form, month: e.target.value as number })}
                sx={{ borderRadius: '12px' }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              type="number"
              label="Year"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) })}
              InputProps={{ sx: { borderRadius: '12px' } }}
            />

            {error && (
              <Alert severity="error" sx={{ borderRadius: '12px' }}>
                {error}
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
          <Button onClick={handleCreateBudget} variant="contained" color="primary" disabled={loading} sx={{ px: 3 }}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
