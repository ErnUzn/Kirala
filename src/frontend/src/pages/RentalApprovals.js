import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardMedia,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Avatar,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Person as PersonIcon,
  DateRange as DateIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';

const RentalApprovals = () => {
  const [user, setUser] = useState(null);
  const [pendingRentals, setPendingRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);
  const [rejectDialog, setRejectDialog] = useState({ open: false, rental: null });
  const [rejectReason, setRejectReason] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Kullanıcı durumunu kontrol et
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
    }
  }, []);

  // Bekleyen kiralama taleplerini getir
  const fetchPendingRentals = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/rentals/pending-approvals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setPendingRentals(data.rentals);
      } else {
        setError(data.message || 'Bekleyen kiralamalar yüklenirken hata oluştu');
      }
    } catch (error) {
      console.error('Bekleyen kiralamalar yükleme hatası:', error);
      setError('Bekleyen kiralamalar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPendingRentals();
    }
  }, [user]);

  // Kiralama talebini onayla
  const handleApprove = async (rentalId) => {
    try {
      setActionLoading(rentalId);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/rentals/${rentalId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('Kiralama talebi başarıyla onaylandı!');
        fetchPendingRentals(); // Listeyi yenile
      } else {
        setError(data.message || 'Kiralama onaylanırken hata oluştu');
      }
    } catch (error) {
      console.error('Kiralama onaylama hatası:', error);
      setError('Kiralama onaylanırken hata oluştu');
    } finally {
      setActionLoading(null);
    }
  };

  // Kiralama talebini reddet
  const handleReject = async () => {
    try {
      setActionLoading(rejectDialog.rental._id);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/rentals/${rejectDialog.rental._id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: rejectReason })
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('Kiralama talebi reddedildi.');
        setRejectDialog({ open: false, rental: null });
        setRejectReason('');
        fetchPendingRentals(); // Listeyi yenile
      } else {
        setError(data.message || 'Kiralama reddedilirken hata oluştu');
      }
    } catch (error) {
      console.error('Kiralama reddetme hatası:', error);
      setError('Kiralama reddedilirken hata oluştu');
    } finally {
      setActionLoading(null);
    }
  };

  // Tarih formatla
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Gün farkı hesapla
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      {/* Başlık */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Kiralama Onayları
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ürünleriniz için gelen kiralama taleplerini burada görüntüleyip onaylayabilirsiniz.
        </Typography>
      </Box>

      {/* Hata ve Başarı Mesajları */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert 
          severity="success" 
          sx={{ mb: 3 }} 
          onClose={() => setSuccessMessage('')}
        >
          {successMessage}
        </Alert>
      )}

      {/* Bekleyen Kiralamalar */}
      {pendingRentals.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Bekleyen kiralama talebi bulunmuyor
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ürünleriniz için yeni kiralama talepleri geldiğinde burada görünecektir.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {pendingRentals.map((rental) => (
            <Grid item xs={12} key={rental._id}>
              <Card sx={{ 
                p: 3,
                border: '2px solid',
                borderColor: 'warning.light',
                backgroundColor: 'warning.50'
              }}>
                <Grid container spacing={3}>
                  {/* Ürün Bilgileri */}
                  <Grid item xs={12} md={4}>
                    <CardMedia
                      component="img"
                      height={200}
                      image={rental.item?.images?.[0] || 'https://via.placeholder.com/300x200'}
                      alt={rental.item?.name}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>

                  {/* Detaylar */}
                  <Grid item xs={12} md={8}>
                    <Stack spacing={2}>
                      {/* Ürün Adı */}
                      <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                        {rental.item?.name}
                      </Typography>

                      {/* Kiralayan Bilgileri */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <PersonIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {rental.renter?.firstName} {rental.renter?.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {rental.renter?.email}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider />

                      {/* Kiralama Detayları */}
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <DateIcon color="primary" />
                            <Typography variant="body2" color="text.secondary">
                              Başlangıç Tarihi
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {formatDate(rental.startDate)}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <DateIcon color="primary" />
                            <Typography variant="body2" color="text.secondary">
                              Bitiş Tarihi
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {formatDate(rental.endDate)}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <MoneyIcon color="primary" />
                            <Typography variant="body2" color="text.secondary">
                              Toplam Ücret
                            </Typography>
                          </Box>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                            {rental.totalPrice}₺
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <DateIcon color="primary" />
                            <Typography variant="body2" color="text.secondary">
                              Süre
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {calculateDays(rental.startDate, rental.endDate)} gün
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* Durum */}
                      <Box>
                        <Chip 
                          label="Onay Bekliyor" 
                          color="warning" 
                          variant="filled"
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>

                      {/* Aksiyon Butonları */}
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                          startIcon={<ApproveIcon />}
                          onClick={() => handleApprove(rental._id)}
                          disabled={actionLoading === rental._id}
                          sx={{ flex: 1 }}
                        >
                          {actionLoading === rental._id ? <CircularProgress size={20} /> : 'Onayla'}
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<RejectIcon />}
                          onClick={() => setRejectDialog({ open: true, rental })}
                          disabled={actionLoading === rental._id}
                          sx={{ flex: 1 }}
                        >
                          Reddet
                        </Button>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Reddetme Dialog'u */}
      <Dialog 
        open={rejectDialog.open} 
        onClose={() => setRejectDialog({ open: false, rental: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Kiralama Talebini Reddet</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            "{rejectDialog.rental?.item?.name}" ürünü için gelen kiralama talebini reddetmek istediğinizden emin misiniz?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reddetme Nedeni (İsteğe bağlı)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Kiralama talebini neden reddettiğinizi belirtebilirsiniz..."
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setRejectDialog({ open: false, rental: null })}
            disabled={actionLoading}
          >
            İptal
          </Button>
          <Button 
            onClick={handleReject}
            color="error"
            variant="contained"
            disabled={actionLoading}
          >
            {actionLoading ? <CircularProgress size={20} /> : 'Reddet'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RentalApprovals; 