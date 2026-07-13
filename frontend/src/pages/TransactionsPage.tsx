import { useState } from 'react';
import { Container, Button, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TransactionList from '../components/TransactionList';
import AddTransactionDialog from '../components/AddTransactionDialog';

export default function TransactionsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif' }}>
            Transactions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and monitor your income and expenses
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Transaction
        </Button>
      </Box>

      <TransactionList onUpdate={refreshTrigger} />

      <AddTransactionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onTransactionAdded={() => setRefreshTrigger(refreshTrigger + 1)}
      />
    </Container>
  );
}
