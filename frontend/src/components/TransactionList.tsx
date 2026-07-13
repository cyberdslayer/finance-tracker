import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Box,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Transaction, transactionService, CreateTransactionPayload } from '../services/transactionService';

interface TransactionListProps {
  onUpdate?: () => void;
}

export default function TransactionList({ onUpdate }: TransactionListProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<CreateTransactionPayload>>({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, [onUpdate]);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await transactionService.getAll();
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionService.delete(id);
        setTransactions(transactions.filter((t) => t.id !== id));
      } catch (err) {
        console.error('Failed to delete transaction:', err);
      }
    }
  };

  const handleEditOpen = (transaction: Transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.date,
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (editingId) {
      try {
        await transactionService.update(editingId, editForm);
        loadTransactions();
        setEditDialogOpen(false);
        setEditingId(null);
      } catch (err) {
        console.error('Failed to update transaction:', err);
      }
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'income' ? 'success' : 'error';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  const formatCurrency = (val: any) => {
    return Number(val).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  return (
    <>
      <TableContainer className="glass-panel" sx={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12)' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid', borderColor: 'divider' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No transactions yet. Add one to get started!
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 500 }}>
                    {new Date(transaction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={transaction.type_display}
                      variant="outlined"
                      size="small"
                      sx={{
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        fontSize: '0.65rem',
                        color: transaction.type === 'income' ? '#10b981' : '#f43f5e',
                        borderColor: transaction.type === 'income' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)',
                        bgcolor: transaction.type === 'income' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(244, 63, 94, 0.05)',
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>{transaction.category_display}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 800, color: transaction.type === 'income' ? '#10b981' : '#f43f5e' }}>
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {transaction.description || '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditOpen(transaction)}
                        sx={{ bgcolor: 'rgba(0, 242, 254, 0.08)', '&:hover': { bgcolor: 'rgba(0, 242, 254, 0.15)' } }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(transaction.id)}
                        sx={{ bgcolor: 'rgba(244, 63, 94, 0.08)', '&:hover': { bgcolor: 'rgba(244, 63, 94, 0.15)' } }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          className: 'glass-panel',
          sx: { borderRadius: '24px', p: 1, boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.3)' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1, fontFamily: '"Outfit", sans-serif' }}>
          Edit Transaction
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              type="date"
              label="Date"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { borderRadius: '12px' } }}
            />
            <TextField
              type="number"
              label="Amount"
              value={editForm.amount}
              onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
              inputProps={{ step: '0.01' }}
              InputProps={{ sx: { borderRadius: '12px' } }}
            />
            <TextField
              label="Description"
              multiline
              rows={3}
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              InputProps={{ sx: { borderRadius: '12px' } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setEditDialogOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>
            Cancel
          </Button>
          <Button onClick={handleEditSave} variant="contained" color="primary" sx={{ px: 3 }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
