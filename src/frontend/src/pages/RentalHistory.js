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
  Button,
  Snackbar
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // Kullanıcı bilgilerini local storage'dan al
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // LocalStorage'dan kiralama geçmişini al
    const storedHistory = localStorage.getItem('rentalHistory');
    
    if (storedHistory) {
      const history = JSON.parse(storedHistory);
      // Kiralama durumlarını güncelle
      const updatedHistory = updateRentalStatuses(history);
      setRentalHistory(updatedHistory);
      
      // Eğer durumlar güncellendiyse localStorage'ı da güncelle
      if (JSON.stringify(updatedHistory) !== JSON.stringify(history)) {
        localStorage.setItem('rentalHistory', JSON.stringify(updatedHistory));
      }
    } else {
      // Eğer localStorage'da kiralama geçmişi yoksa boş dizi olarak ayarla
      setRentalHistory([]);
    }
    
    setLoading(false);
  }, []);

  // Kiralama durumlarını güncelle
  const updateRentalStatuses = (rentals) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Saat bilgisini sıfırla, sadece tarihleri karşılaştır
    
    return rentals.map(rental => {
      // Eğer kiralama iptal edildiyse durumu değiştirme
      if (rental.status === 'İptal Edildi') {
        return rental;
      }
      
      const startDate = new Date(rental.startDate);
      const endDate = new Date(rental.endDate);
      
      // Bugün bitiş tarihinden sonraysa kiralama tamamlanmış demektir
      if (today > endDate) {
        return { ...rental, status: 'Tamamlandı' };
      }
      // Bugün başlangıç tarihinden önceyse kiralama yaklaşan demektir
      else if (today < startDate) {
        return { ...rental, status: 'Yaklaşan' };
      }
      // Bugün başlangıç ve bitiş tarihleri arasındaysa kiralama devam ediyor demektir
      else {
        return { ...rental, status: 'Devam Ediyor' };
      }
    });
  };

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

  // Kiralamayı iptal et
  const handleCancelRental = (rentalId) => {
    // Mevcut kiralama geçmişini al
    const currentHistory = [...rentalHistory];
    
    // İptal edilecek kiralamayı bul ve durumunu güncelle
    const updatedHistory = currentHistory.map(rental => {
      if (rental.id === rentalId) {
        return { ...rental, status: 'İptal Edildi' };
      }
      return rental;
    });
    
    // Güncellenmiş geçmişi state'e ve localStorage'a kaydet
    setRentalHistory(updatedHistory);
    localStorage.setItem('rentalHistory', JSON.stringify(updatedHistory));
    
    // Başarılı mesajı göster
    setSnackbarMessage('Kiralama başarıyla iptal edildi');
    setSnackbarOpen(true);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
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
                          <Box>
                            <Button 
                              variant="outlined" 
                              onClick={() => handleViewProduct(product.id)}
                              sx={{ mr: 1 }}
                            >
                              Ürün Detayları
                            </Button>
                            
                            {/* Tamamlanmış veya iptal edilmiş kiralamalar için iptal butonu gösterme */}
                            {rental.status !== 'Tamamlandı' && rental.status !== 'İptal Edildi' && (
                              <Button 
                                variant="outlined" 
                                color="error"
                                onClick={() => handleCancelRental(rental.id)}
                              >
                                İptal Et
                              </Button>
                            )}
                          </Box>
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
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RentalHistory; 