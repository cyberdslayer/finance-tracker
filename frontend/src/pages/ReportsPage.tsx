import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  TextField,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SavingsIcon from '@mui/icons-material/Savings';
import { reportService } from '../services/reportService';

export default function ReportsPage() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const loadReport = async () => {
    setLoading(true);
    try {
      const res = await reportService.getMonthlyReport(month, year);
      setReport(res.data);
    } catch (err) {
      console.error('Failed to load report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      let res;
      switch (format) {
        case 'pdf':
          res = await reportService.exportPdf(month, year);
          break;
        case 'csv':
          res = await reportService.exportCsv(month, year);
          break;
        case 'excel':
          res = await reportService.exportExcel(month, year);
          break;
      }
      
      if (!res) return;
      
      // Create blob and download
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      
      const fileExtension = format === 'excel' ? 'xlsx' : format;
      link.setAttribute('download', `finance_report_${year}_${month}.${fileExtension}`);
      document.body.appendChild(link);
      link.click();
      link.parentElement?.removeChild(link);
    } catch (err) {
      console.error('Failed to export report:', err);
    }
  };

  const formatCurrency = (val: any) => {
    return Number(val).toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* Title */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif' }}>
          Financial Reports
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Generate, analyze, and export monthly statements
        </Typography>
      </Box>

      {/* Report Filters */}
      <Paper className="glass-panel" sx={{ p: 3, mb: 4, boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12)' }}>
        <Grid container spacing={2.5} alignItems="flex-end">
          <Grid item xs={12} sm={5}>
            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                value={month}
                label="Month"
                onChange={(e) => setMonth(e.target.value as number)}
                sx={{ borderRadius: '12px' }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={5}>
            <TextField
              type="number"
              label="Year"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              fullWidth
              InputProps={{ sx: { borderRadius: '12px' } }}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button variant="contained" color="primary" onClick={loadReport} fullWidth sx={{ py: 1.75 }}>
              Load
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Report Content */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={48} />
        </Box>
      ) : report ? (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={4}>
              <Card className="hover-scale card-grad-income">
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Total Income
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 1, color: '#10b981' }}>
                      {formatCurrency(report.total_income)}
                    </Typography>
                  </Box>
                  <Box sx={{ bgcolor: 'rgba(16, 185, 129, 0.15)', p: 1.5, borderRadius: '12px', display: 'flex' }}>
                    <TrendingUpIcon sx={{ color: '#10b981', fontSize: 28 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card className="hover-scale card-grad-expense">
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Total Expenses
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 1, color: '#f43f5e' }}>
                      {formatCurrency(report.total_expenses)}
                    </Typography>
                  </Box>
                  <Box sx={{ bgcolor: 'rgba(244, 63, 94, 0.15)', p: 1.5, borderRadius: '12px', display: 'flex' }}>
                    <TrendingDownIcon sx={{ color: '#f43f5e', fontSize: 28 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card className="hover-scale card-grad-savings">
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography color="text.secondary" variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Net Savings
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mt: 1, color: '#00f2fe' }}>
                      {formatCurrency(report.net_savings)}
                    </Typography>
                  </Box>
                  <Box sx={{ bgcolor: 'rgba(0, 242, 254, 0.15)', p: 1.5, borderRadius: '12px', display: 'flex' }}>
                    <SavingsIcon sx={{ color: '#00f2fe', fontSize: 28 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Export Options */}
          <Paper className="glass-panel" sx={{ p: 4, boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.12)' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
              Export Financial Documents
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport('pdf')}
                sx={{ py: 1.5, px: 3, flexGrow: 1, borderWidth: '2px', '&:hover': { borderWidth: '2px' } }}
              >
                Download PDF Document
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport('csv')}
                sx={{ py: 1.5, px: 3, flexGrow: 1, borderWidth: '2px', '&:hover': { borderWidth: '2px' } }}
              >
                Export CSV Spreadsheet
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<DownloadIcon />}
                onClick={() => handleExport('excel')}
                sx={{ py: 1.5, px: 3, flexGrow: 1, borderWidth: '2px', '&:hover': { borderWidth: '2px' } }}
              >
                Export Excel Sheet (XLSX)
              </Button>
            </Stack>
          </Paper>
        </>
      ) : (
        <Paper className="glass-panel" sx={{ p: 6, textAlign: 'center', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.08)' }}>
          <Typography color="text.secondary" variant="body1">
            Select a month and year to view and export the report
          </Typography>
        </Paper>
      )}
    </Container>
  );
}
