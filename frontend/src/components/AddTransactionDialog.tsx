import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import { transactionService, CreateTransactionPayload } from '../services/transactionService';

const TRANSACTION_TYPES = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

const CATEGORIES = {
  income: [
    { value: 'salary', label: 'Salary' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'investment', label: 'Investment' },
    { value: 'bonus', label: 'Bonus' },
    { value: 'other_income', label: 'Other Income' },
  ],
  expense: [
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
  ],
};

interface AddTransactionDialogProps {
  open: boolean;
  onClose: () => void;
  onTransactionAdded: () => void;
}

export default function AddTransactionDialog({
  open,
  onClose,
  onTransactionAdded,
}: AddTransactionDialogProps) {
  const [form, setForm] = useState<CreateTransactionPayload>({
    type: 'expense',
    category: 'food',
    amount: 0,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = CATEGORIES[form.type as keyof typeof CATEGORIES];

  const handleSubmit = async () => {
    if (!form.amount || form.amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    setLoading(true);
    try {
      await transactionService.create(form);
      setError('');
      setForm({
        type: 'expense',
        category: 'food',
        amount: 0,
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
      onTransactionAdded();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (newType: string) => {
    const defaultCategory = newType === 'income' ? 'salary' : 'food';
    setForm({ ...form, type: newType as 'income' | 'expense', category: defaultCategory });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        className: 'glass-panel',
        sx: { borderRadius: '24px', p: 1, boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.3)' }
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, pb: 1, fontFamily: '"Outfit", sans-serif' }}>
        Add Transaction
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={form.type}
              label="Type"
              onChange={(e) => handleTypeChange(e.target.value)}
              sx={{ borderRadius: '12px' }}
            >
              {TRANSACTION_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={form.category}
              label="Category"
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              sx={{ borderRadius: '12px' }}
            >
              {categories.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            type="number"
            label="Amount"
            value={form.amount || ''}
            onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
            inputProps={{ step: '0.01' }}
            InputProps={{ sx: { borderRadius: '12px' } }}
          />

          <TextField
            type="date"
            label="Date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            InputProps={{ sx: { borderRadius: '12px' } }}
          />

          <TextField
            label="Description (Optional)"
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
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
        <Button onClick={onClose} color="inherit" sx={{ fontWeight: 600 }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading} sx={{ px: 3 }}>
          {loading ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
