import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Chip,
  LinearProgress,
  IconButton,
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Budget, budgetService, CreateBudgetPayload } from '../services/budgetService';

interface BudgetListProps {
  onUpdate?: () => void;
}

export default function BudgetList({ onUpdate }: BudgetListProps) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<CreateBudgetPayload>>({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    loadBudgets();
  }, [onUpdate]);

  const loadBudgets = async () => {
    setLoading(true);
    try {
      const res = await budgetService.getAll();
      setBudgets(res.data);
    } catch (err) {
      console.error('Failed to load budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      try {
        await budgetService.delete(id);
        setBudgets(budgets.filter((b) => b.id !== id));
      } catch (err) {
        console.error('Failed to delete budget:', err);
      }
    }
  };

  const handleEditOpen = (budget: Budget) => {
    setEditingId(budget.id);
    setEditForm({
      category: budget.category,
      monthly_limit: budget.monthly_limit,
      month: budget.month,
      year: budget.year,
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = async () => {
    if (editingId) {
      try {
        await budgetService.update(editingId, editForm);
        loadBudgets();
        setEditDialogOpen(false);
        setEditingId(null);
      } catch (err) {
        console.error('Failed to update budget:', err);
      }
    }
  };

  const formatCurrency = (val: any) => {
    return Number(val).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  return (
    <>
      <TableContainer className="glass-panel" sx={{ boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12)' }}>
        <Table>
          <TableHead sx={{ bgcolor: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid', borderColor: 'divider' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Monthly Limit</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Spent</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Remaining</TableCell>
              <TableCell sx={{ fontWeight: 700, pl: 4 }}>Usage & Progress</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {budgets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No budgets created yet. Create one to track your spending!
                </TableCell>
              </TableRow>
            ) : (
              budgets.map((budget) => {
                const percent = Math.min(budget.percentage_used, 100);
                const isOver = budget.percentage_used >= 100;
                const isWarning = budget.percentage_used >= 80 && budget.percentage_used < 100;

                return (
                  <TableRow key={budget.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.02)' } }}>
                    <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>{budget.category_display}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(budget.monthly_limit)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>{formatCurrency(budget.spent)}</TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 600,
                        color: budget.remaining < 0 ? '#f43f5e' : 'text.primary',
                      }}
                    >
                      {formatCurrency(budget.remaining)}
                    </TableCell>
                    <TableCell sx={{ minWidth: 200, pl: 4 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{ width: '100%' }}>
                          <LinearProgress
                            variant="determinate"
                            value={percent}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: 'rgba(255, 255, 255, 0.08)',
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                backgroundImage: isOver
                                  ? 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)'
                                  : isWarning
                                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              },
                            }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 800, minWidth: 36, textAlign: 'right' }}>
                          {Number(budget.percentage_used).toFixed(0)}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={isOver ? 'Over Limit' : isWarning ? 'Warning' : 'On Track'}
                        variant="outlined"
                        size="small"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          textTransform: 'uppercase',
                          color: isOver ? '#f43f5e' : isWarning ? '#f59e0b' : '#10b981',
                          borderColor: isOver ? 'rgba(244, 63, 94, 0.3)' : isWarning ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                          bgcolor: isOver ? 'rgba(244, 63, 94, 0.05)' : isWarning ? 'rgba(245, 158, 11, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditOpen(budget)}
                          sx={{ bgcolor: 'rgba(0, 242, 254, 0.08)', '&:hover': { bgcolor: 'rgba(0, 242, 254, 0.15)' } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(budget.id)}
                          sx={{ bgcolor: 'rgba(244, 63, 94, 0.08)', '&:hover': { bgcolor: 'rgba(244, 63, 94, 0.15)' } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
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
          Edit Budget Limit
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              type="number"
              label="Monthly Limit"
              value={editForm.monthly_limit || ''}
              onChange={(e) => setEditForm({ ...editForm, monthly_limit: parseFloat(e.target.value) || 0 })}
              inputProps={{ step: '0.01' }}
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
