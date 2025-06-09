import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Card,
  CardContent,
  Divider,
  Alert,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import { getPayments } from '../../services/adminService';
import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  GetApp as GetAppIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Payment as PaymentIcon,
  AccountBalance as AccountBalanceIcon,
  CreditCard as CreditCardIcon,
  LocalAtm as LocalAtmIcon,
} from '@mui/icons-material';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  // Mock data
  const mockPayments = [
    {
      id: 'PAY-001',
      rentalId: 'RNT-001',
      userId: 'USR-123',
      userName: 'Ahmet Yılmaz',
      amount: 250.00,
      method: 'Kredi Kartı',
      status: 'Tamamlandı',
      transactionId: 'TXN-12345',
      date: '2024-01-15T10:30:00Z',
      itemName: 'iPhone 13 Pro',
      type: 'Kiralama Ödemesi',
    },
    {
      id: 'PAY-002',
      rentalId: 'RNT-002',
      userId: 'USR-124',
      userName: 'Fatma Kaya',
      amount: 150.00,
      method: 'Banka Kartı',
      status: 'Beklemede',
      transactionId: 'TXN-12346',
      date: '2024-01-14T14:45:00Z',
      itemName: 'PlayStation 5',
      type: 'Depozito',
    },
    {
      id: 'PAY-003',
      rentalId: 'RNT-003',
      userId: 'USR-125',
      userName: 'Mehmet Özkan',
      amount: 75.00,
      method: 'Havale',
      status: 'İade Edildi',
      transactionId: 'TXN-12347',
      date: '2024-01-13T16:20:00Z',
      itemName: 'MacBook Pro',
      type: 'İade',
    },
    {
      id: 'PAY-004',
      rentalId: 'RNT-004',
      userId: 'USR-126',
      userName: 'Elif Demir',
      amount: 320.00,
      method: 'Kredi Kartı',
      status: 'Başarısız',
      transactionId: 'TXN-12348',
      date: '2024-01-12T09:15:00Z',
      itemName: 'Canon EOS R5',
      type: 'Kiralama Ödemesi',
    },
    {
      id: 'PAY-005',
      rentalId: 'RNT-005',
      userId: 'USR-127',
      userName: 'Ali Çelik',
      amount: 180.00,
      method: 'Banka Kartı',
      status: 'Tamamlandı',
      transactionId: 'TXN-12349',
      date: '2024-01-11T11:30:00Z',
      itemName: 'Dyson V11',
      type: 'Kiralama Ödemesi',
    },
  ];

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await getPayments();
      setPayments(data.payments || []);
      
      // İstatistikleri güncelle
      if (data.statistics) {
        // Bu değerleri state'te tutmak yerine direkt kullanıyoruz
        console.log('Payment statistics:', data.statistics);
      }
    } catch (error) {
      console.error('Ödeme verileri yüklenemedi:', error);
      setPayments(mockPayments); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Tamamlandı':
        return 'success';
      case 'Beklemede':
        return 'warning';
      case 'İade Edildi':
        return 'info';
      case 'Başarısız':
        return 'error';
      default:
        return 'default';
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'Kredi Kartı':
        return <CreditCardIcon />;
      case 'Banka Kartı':
        return <AccountBalanceIcon />;
      case 'Havale':
        return <LocalAtmIcon />;
      default:
        return <PaymentIcon />;
    }
  };

  const handleMenuClick = (event, payment) => {
    setAnchorEl(event.currentTarget);
    setSelectedPayment(payment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPayment(null);
  };

  const handleViewDetails = () => {
    setDetailDialogOpen(true);
    handleMenuClose();
  };

  const handleRefund = () => {
    setRefundDialogOpen(true);
    handleMenuClose();
  };

  const handleRefundSubmit = () => {
    // Handle refund logic here
    console.log('Refund:', { amount: refundAmount, reason: refundReason });
    setRefundDialogOpen(false);
    setRefundAmount('');
    setRefundReason('');
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Payment statistics
  const totalAmount = payments.reduce((sum, payment) => 
    payment.status === 'Tamamlandı' ? sum + payment.amount : sum, 0
  );
  const totalTransactions = payments.filter(p => p.status === 'Tamamlandı').length;
  const pendingAmount = payments.reduce((sum, payment) => 
    payment.status === 'Beklemede' ? sum + payment.amount : sum, 0
  );
  const refundedAmount = payments.reduce((sum, payment) => 
    payment.status === 'İade Edildi' ? sum + payment.amount : sum, 0
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom>
        Ödeme Yönetimi
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PaymentIcon sx={{ color: '#4caf50', mr: 2 }} />
                <Box>
                  <Typography variant="h6">₺{totalAmount.toFixed(2)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Toplam Gelir
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CreditCardIcon sx={{ color: '#2196f3', mr: 2 }} />
                <Box>
                  <Typography variant="h6">{totalTransactions}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Başarılı İşlem
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalAtmIcon sx={{ color: '#ff9800', mr: 2 }} />
                <Box>
                  <Typography variant="h6">₺{pendingAmount.toFixed(2)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bekleyen Ödemeler
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalanceIcon sx={{ color: '#f44336', mr: 2 }} />
                <Box>
                  <Typography variant="h6">₺{refundedAmount.toFixed(2)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    İade Edilen
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Kullanıcı, işlem no veya ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Durum</InputLabel>
              <Select
                value={statusFilter}
                label="Durum"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Tümü</MenuItem>
                <MenuItem value="Tamamlandı">Tamamlandı</MenuItem>
                <MenuItem value="Beklemede">Beklemede</MenuItem>
                <MenuItem value="İade Edildi">İade Edildi</MenuItem>
                <MenuItem value="Başarısız">Başarısız</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Ödeme Yöntemi</InputLabel>
              <Select
                value={methodFilter}
                label="Ödeme Yöntemi"
                onChange={(e) => setMethodFilter(e.target.value)}
              >
                <MenuItem value="all">Tümü</MenuItem>
                <MenuItem value="Kredi Kartı">Kredi Kartı</MenuItem>
                <MenuItem value="Banka Kartı">Banka Kartı</MenuItem>
                <MenuItem value="Havale">Havale</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GetAppIcon />}
              onClick={() => console.log('Export data')}
            >
              Dışa Aktar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Payments Table */}
      <Paper>
        {loading && <LinearProgress />}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>İşlem No</TableCell>
                <TableCell>Kullanıcı</TableCell>
                <TableCell>Ürün</TableCell>
                <TableCell>Tutar</TableCell>
                <TableCell>Yöntem</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>Tarih</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPayments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((payment) => (
                  <TableRow key={payment.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {payment.transactionId}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">{payment.userName}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {payment.userId}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{payment.itemName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {payment.type}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        ₺{payment.amount.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getMethodIcon(payment.method)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {payment.method}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payment.status}
                        color={getStatusColor(payment.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(payment.date).toLocaleDateString('tr-TR')}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, payment)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPayments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewDetails}>
          <VisibilityIcon sx={{ mr: 1 }} />
          Detayları Görüntüle
        </MenuItem>
        {selectedPayment?.status === 'Tamamlandı' && (
          <MenuItem onClick={handleRefund}>
            <LocalAtmIcon sx={{ mr: 1 }} />
            İade Et
          </MenuItem>
        )}
      </Menu>

      {/* Payment Detail Dialog */}
      <Dialog open={detailDialogOpen} onClose={() => setDetailDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ödeme Detayları</DialogTitle>
        <DialogContent>
          {selectedPayment && (
            <Box sx={{ pt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">İşlem No:</Typography>
                  <Typography variant="body1">{selectedPayment.transactionId}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Kullanıcı:</Typography>
                  <Typography variant="body1">{selectedPayment.userName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Tutar:</Typography>
                  <Typography variant="body1">₺{selectedPayment.amount.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Ödeme Yöntemi:</Typography>
                  <Typography variant="body1">{selectedPayment.method}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Durum:</Typography>
                  <Chip
                    label={selectedPayment.status}
                    color={getStatusColor(selectedPayment.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Tarih:</Typography>
                  <Typography variant="body1">
                    {new Date(selectedPayment.date).toLocaleString('tr-TR')}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Ürün:</Typography>
                  <Typography variant="body1">{selectedPayment.itemName}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">İşlem Tipi:</Typography>
                  <Typography variant="body1">{selectedPayment.type}</Typography>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>Kapat</Button>
        </DialogActions>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={refundDialogOpen} onClose={() => setRefundDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>İade İşlemi</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Bu işlem geri alınamaz. İade tutarı kullanıcının hesabına otomatik olarak iade edilecektir.
            </Alert>
            <TextField
              fullWidth
              label="İade Tutarı"
              type="number"
              value={refundAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: <Typography sx={{ mr: 1 }}>₺</Typography>,
              }}
            />
            <TextField
              fullWidth
              label="İade Sebebi"
              multiline
              rows={3}
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefundDialogOpen(false)}>İptal</Button>
          <Button onClick={handleRefundSubmit} variant="contained" color="error">
            İade Et
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPayments; 