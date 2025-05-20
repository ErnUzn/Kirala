import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Stack,
  Paper,
  Alert,
  Button
} from '@mui/material';
import {
  LocationOn,
  DateRange,
  Star,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { products } from './Products';

const RentalHistory = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kullanıcı bilgilerini local storage'dan al
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Simüle edilmiş kiralama geçmişi verisi (gerçek uygulamada API'den alınacak)
    const simulatedHistory = [
      {
        id: 1,
        productId: 1,
        startDate: '2023-06-10',
        endDate: '2023-06-15',
        status: 'Tamamlandı',
        totalPrice: '1250₺'
      },
      {
        id: 2,
        productId: 8,
        startDate: '2023-07-20',
        endDate: '2023-07-25',
        status: 'Tamamlandı',
        totalPrice: '3500₺'
      },
      {
        id: 3,
        productId: 5,
        startDate: '2023-08-05',
        endDate: '2023-08-10',
        status: 'Devam Ediyor',
        totalPrice: '1750₺'
      },
      {
        id: 4,
        productId: 13,
        startDate: '2023-09-15',
        startDate: '2023-09-15',
        endDate: '2023-09-20',
        status: 'Yaklaşan',
        totalPrice: '850₺'
      }
    ];

    setRentalHistory(simulatedHistory);
    setLoading(false);
  }, []);

  // Tarih formatını düzenle: YYYY-MM-DD -> DD.MM.YYYY
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  // Ürün detaylarına git
  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Durum renkleri
  const getStatusColor = (status) => {
    switch (status) {
      case 'Tamamlandı': return 'success';
      case 'Devam Ediyor': return 'info';
      case 'Yaklaşan': return 'warning';
      default: return 'default';
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

      {loading ? (
        <Typography>Yükleniyor...</Typography>
      ) : rentalHistory.length === 0 ? (
        <Alert severity="info">Henüz kiralama geçmişiniz bulunmuyor.</Alert>
      ) : (
        <Grid container spacing={3}>
          {rentalHistory.map((rental) => {
            const product = products.find(p => p.id === rental.productId);
            
            return (
              <Grid item xs={12} key={rental.id}>
                <Paper elevation={2} sx={{ p: 0, overflow: 'hidden' }}>
                  <Grid container>
                    <Grid item xs={12} md={3}>
                      <CardMedia
                        component="img"
                        height={200}
                        image={product?.image}
                        alt={product?.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Ürün+Görseli';
                        }}
                        sx={{ cursor: 'pointer', height: '100%' }}
                        onClick={() => handleViewProduct(product.id)}
                      />
                    </Grid>
                    <Grid item xs={12} md={9}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                          <Typography variant="h5" component="h2" gutterBottom>
                            {product?.name}
                          </Typography>
                          <Chip 
                            label={rental.status} 
                            color={getStatusColor(rental.status)} 
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {product?.description}
                        </Typography>
                        
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <DateRange sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2">
                              {formatDate(rental.startDate)} - {formatDate(rental.endDate)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {product?.location}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {product?.rating} ({product?.reviewCount} değerlendirme)
                            </Typography>
                          </Box>
                        </Stack>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" color="primary">
                            Toplam: {rental.totalPrice}
                          </Typography>
                          <Button 
                            variant="outlined" 
                            onClick={() => handleViewProduct(product.id)}
                          >
                            Ürün Detayları
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