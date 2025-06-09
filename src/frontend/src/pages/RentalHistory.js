import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  CardContent,
  CardMedia,
  Button,
  Box,
  Paper,
  Chip,
  Alert,
  Stack,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  DateRange,
  LocationOn,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getUserRentals } from '../services/rentalService';

const RentalHistory = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kullanıcı bilgilerini local storage'dan al
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Kiralama geçmişini yükle
    const loadRentals = async () => {
      try {
        setLoading(true);
        
        // Giriş kontrolü
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const token = localStorage.getItem('token');
        console.log('🔍 DEBUG: Giriş durumu:', { isLoggedIn, hasToken: !!token });
        
        if (!isLoggedIn) {
          setError('Giriş yapmalısınız');
          return;
        }

        // Kullanıcının kiralamalarını API'den çek
        console.log('🔍 DEBUG: API çağrısı başlatılıyor...');
        const response = await getUserRentals();
        console.log('🔍 DEBUG: API yanıtı:', response);
        
        if (response.success) {
          console.log('🔍 DEBUG: Kiralama sayısı:', response.rentals.length);
          console.log('🔍 DEBUG: İlk kiralama:', response.rentals[0]);
          setRentals(response.rentals);
          console.log('✅ Kiralamalar yüklendi:', response.rentals);
        } else {
          console.log('❌ DEBUG: API başarısız:', response.message);
          setError(response.message || 'Kiralamalar yüklenemedi');
        }

      } catch (err) {
        console.log('❌ DEBUG: Hata yakalandı:', err);
        setError(err.message);
        console.error('Kiralama geçmişi yükleme hatası:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRentals();
  }, []);

  // Tarih formatını düzenle: ISO -> DD.MM.YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR');
  };

  // Ürün detaylarına git
  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Durum renkleri
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'active': return 'info';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'rejected': return 'error';
      case 'approved': return 'success';
      default: return 'default';
    }
  };

  // Durum metinleri
  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'active': return 'Devam Ediyor';
      case 'pending': return 'Beklemede';
      case 'cancelled': return 'İptal Edildi';
      case 'rejected': return 'Reddedildi';
      case 'approved': return 'Onaylandı';
      default: return status;
    }
  };

  if (!user) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="warning">
          Kiralama geçmişinizi görüntülemek için giriş yapmalısınız.
        </Alert>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/login')}
        >
          Giriş Yap
        </Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          Kiralama geçmişi yüklenirken bir hata oluştu: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          Geri
        </Button>
        <Typography variant="h4" component="h1">
          Kiralama Geçmişim
        </Typography>
      </Box>

      {rentals.length === 0 ? (
        <Alert severity="info">Henüz kiralama geçmişiniz bulunmuyor.</Alert>
      ) : (
        <Grid container spacing={3}>
          {rentals.map((rental) => {
            const product = rental.item;
            
            if (!product) {
              return null; // Ürün bulunamazsa bu kiralama kaydını gösterme
            }
            
            return (
              <Grid item xs={12} key={rental._id}>
                <Paper elevation={2} sx={{ p: 0, overflow: 'hidden' }}>
                  <Grid container>
                    <Grid item xs={12} md={3}>
                      <CardMedia
                        component="img"
                        height={200}
                        image={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300x200'}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Ürün+Görseli';
                        }}
                        sx={{ cursor: 'pointer', height: '100%' }}
                        onClick={() => handleViewProduct(product._id)}
                      />
                    </Grid>
                    <Grid item xs={12} md={9}>
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                            {product.name}
                          </Typography>
                          <Chip 
                            label={getStatusText(rental.status)} 
                            color={getStatusColor(rental.status)}
                            size="small"
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {product.description}
                        </Typography>

                        {/* Reddetme mesajını göster */}
                        {rental.status === 'rejected' && rental.notes && (
                          <Alert severity="error" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                              <strong>Red Sebebi:</strong> {rental.notes}
                            </Typography>
                          </Alert>
                        )}

                        <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <DateRange fontSize="small" color="action" />
                            <Typography variant="body2">
                              {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <LocationOn fontSize="small" color="action" />
                            <Typography variant="body2">
                              {product.location || 'Konum belirtilmemiş'}
                            </Typography>
                          </Box>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                            Toplam: {rental.totalPrice}₺
                          </Typography>
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => handleViewProduct(product._id)}
                          >
                            Ürünü Görüntüle
                          </Button>
                        </Box>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default RentalHistory; 