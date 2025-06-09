import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  Divider,
  IconButton,
  Stack,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

// API servislerini import ediyoruz
import { getProductById } from '../services/productService'; 
import { createRental } from '../services/rentalService';
import { getCurrentUser, isLoggedIn } from '../services/authService';
import Chat from '../components/Chat';
import { SimpleStarRating, InteractiveStarRating } from '../components/StarRating';
import { getItemRatings, getUserRating, rateItem } from '../services/ratingService';

const DurationButton = styled(Button)(({ theme, selected }) => ({
  minWidth: '80px',
  backgroundColor: selected ? theme.palette.primary.main : 'transparent',
  color: selected ? 'white' : theme.palette.text.primary,
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : theme.palette.action.hover,
  },
}));

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rentalLoading, setRentalLoading] = useState(false);
  const [rentalSuccess, setRentalSuccess] = useState(false);
  const [rentalError, setRentalError] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [ratings, setRatings] = useState({ average: 0, count: 0, reviews: [] });
  const [userRating, setUserRating] = useState(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');

  // Ürün verisini API'den getir
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log("Fetching product with ID:", id);
        
        const productData = await getProductById(id);
        console.log("Fetched product:", productData);
        
        // Ürün verilerini işle
        const processedProduct = {
          ...productData,
          features: [
            `Kategori: ${productData.category}`,
            `Durum: ${productData.condition}`,
            `Konum: ${productData.location}`,
            `Günlük Fiyat: ${productData.dailyPrice}₺`,
            ...(productData.weeklyPrice ? [`Haftalık Fiyat: ${productData.weeklyPrice}₺`] : []),
            ...(productData.monthlyPrice ? [`Aylık Fiyat: ${productData.monthlyPrice}₺`] : [])
          ]
        };
        
        setProduct(processedProduct);
      } catch (err) {
        console.error("Ürün detay sayfası yükleme hatası:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Mevcut kullanıcı bilgilerini yükle
  useEffect(() => {
    const loadCurrentUser = async () => {
      if (isLoggedIn()) {
        try {
          const userData = await getCurrentUser();
          if (userData) {
            setCurrentUser(userData);
          }
        } catch (error) {
          console.error('Kullanıcı bilgileri yükleme hatası:', error);
          // Token geçersizse localStorage'ı temizle
          localStorage.removeItem('token');
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('user');
        }
      }
    };

    loadCurrentUser();
  }, []);

  // Rating'leri yükle
  useEffect(() => {
    const loadRatings = async () => {
      if (!id) return;
      
      try {
        // Ürün rating'lerini getir
        const ratingsData = await getItemRatings(id);
        if (ratingsData.success) {
          setRatings({
            average: ratingsData.rating.average,
            count: ratingsData.rating.count,
            reviews: ratingsData.reviews || []
          });
          
          // Eğer kullanıcı giriş yapmışsa, kullanıcının rating'ini de getir
          if (isLoggedIn()) {
            const userRatingData = await getUserRating(id);
            if (userRatingData.success) {
              setUserRating(userRatingData.review);
            }
          }
        }
      } catch (error) {
        console.error('Rating yükleme hatası:', error);
      }
    };

    loadRatings();
  }, [id]);

  // Rating gönderme fonksiyonu
  const handleSubmitRating = async () => {
    if (!newRating) return;
    
    try {
      const result = await rateItem(id, newRating, newComment);
      if (result.success) {
        // Rating'leri yeniden yükle
        const ratingsData = await getItemRatings(id);
        if (ratingsData.success) {
          setRatings({
            average: ratingsData.rating.average,
            count: ratingsData.rating.count,
            reviews: ratingsData.reviews || []
          });
        }
        
        // User rating'ini güncelle
        setUserRating({
          rating: newRating,
          comment: newComment,
          createdAt: new Date().toISOString()
        });
        
        // Form'u kapat
        setShowRatingForm(false);
        setNewRating(0);
        setNewComment('');
      }
    } catch (error) {
      console.error('Rating gönderme hatası:', error);
    }
  };

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleFavoriteClick = () => {
    if (!product) return;
    
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.includes(product._id);
      if (isFavorite) {
        return prevFavorites.filter(fav => fav !== product._id);
      } else {
        return [...prevFavorites, product._id];
      }
    });
  };

  const isFavorite = () => {
    if (!product) return false;
    return favorites.includes(product._id);
  };

  const durations = [
    { days: 1, label: '1 Gün' },
    { days: 7, label: '7 Gün' },
    { days: 15, label: '15 Gün' },
    { days: 30, label: '30 Gün' },
  ];

  const handleDurationSelect = (days) => {
    setSelectedDuration(days);
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    
    let pricePerDay = product.dailyPrice;
    
    // Haftalık veya aylık fiyat varsa ve daha uygunsa onu kullan
    if (selectedDuration >= 30 && product.monthlyPrice) {
      const monthlyTotal = Math.ceil(selectedDuration / 30) * product.monthlyPrice;
      const dailyTotal = selectedDuration * pricePerDay;
      return Math.min(monthlyTotal, dailyTotal);
    } else if (selectedDuration >= 7 && product.weeklyPrice) {
      const weeklyTotal = Math.ceil(selectedDuration / 7) * product.weeklyPrice;
      const dailyTotal = selectedDuration * pricePerDay;
      return Math.min(weeklyTotal, dailyTotal);
    }
    
    return selectedDuration * pricePerDay;
  };

  const handleRental = async () => {
    try {
      // Giriş kontrolü
      if (!isLoggedIn()) {
        navigate('/login');
        return;
      }

      setRentalLoading(true);
      setRentalError('');

      // Kiralama verilerini hazırla
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + selectedDuration);

      const rentalData = {
        itemId: product._id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice: calculateTotalPrice()
      };

      console.log('Kiralama verisi:', rentalData);

      // Kiralama oluştur
      const result = await createRental(rentalData);
      
      if (result.success) {
        setRentalSuccess(true);
        console.log('Kiralama başarılı:', result);
      } else {
        setRentalError(result.message || 'Kiralama oluşturulamadı');
      }

    } catch (error) {
      console.error('Kiralama hatası:', error);
      setRentalError(error.message || 'Kiralama sırasında bir hata oluştu');
    } finally {
      setRentalLoading(false);
    }
  };

  const handleCloseSuccessDialog = () => {
    setRentalSuccess(false);
    navigate('/'); // Ana sayfaya yönlendir
  };

  const handleChatOpen = () => {
    // Giriş kontrolü
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    // Kendi ürününe mesaj gönderemez
    if (product?.ownerInfo?.userId === currentUser?.id) {
      alert('Kendi ürününüze mesaj gönderemezsiniz.');
      return;
    }

    setChatOpen(true);
  };

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" align="center" color="error">
          {error}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" onClick={() => navigate('/products')}>
            Ürünlere Geri Dön
          </Button>
        </Box>
      </Container>
    );
  }

  // Product not found
  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          Ürün bulunamadı
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" onClick={() => navigate('/products')}>
            Ürünlere Geri Dön
          </Button>
        </Box>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Sol Taraf - Ürün Görseli */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/800x400'}
              alt={product.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=Ürün+Görseli';
              }}
            />
          </Card>
        </Grid>

        {/* Sağ Taraf - Ürün Detayları */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h4" component="h1">
              {product.name}
            </Typography>
            <IconButton
              onClick={handleFavoriteClick}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              {isFavorite() ? (
                <FavoriteIcon sx={{ color: 'red', fontSize: 32 }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 32 }} />
              )}
            </IconButton>
          </Box>

          <Typography variant="h5" color="primary" gutterBottom>
            {product.dailyPrice}₺/gün
          </Typography>

          {/* Rating Bölümü */}
          <Box sx={{ mb: 2 }}>
            <SimpleStarRating 
              rating={ratings.average || 0} 
              count={ratings.count || 0} 
              size="medium" 
            />
            {isLoggedIn() && (
              <Box sx={{ mt: 1 }}>
                {userRating ? (
                  <Typography variant="body2" color="text.secondary">
                    Puanınız: {userRating.rating}/5 yıldız
                  </Typography>
                ) : (
                  <Button 
                    size="small" 
                    onClick={() => setShowRatingForm(true)}
                    sx={{ textTransform: 'none' }}
                  >
                    Bu ürünü puanla
                  </Button>
                )}
              </Box>
            )}
          </Box>

          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Özellikler
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {product.features.map((feature, index) => (
              <Typography component="li" key={index}>
                {feature}
              </Typography>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Kiralama Süresi
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {durations.map((duration) => (
              <DurationButton
                key={duration.days}
                selected={selectedDuration === duration.days}
                onClick={() => handleDurationSelect(duration.days)}
              >
                {duration.label}
              </DurationButton>
            ))}
          </Stack>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Toplam Tutar: {calculateTotalPrice()}₺
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedDuration} gün için
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mb: 2 }}
            onClick={handleRental}
            disabled={rentalLoading}
          >
            {rentalLoading ? <CircularProgress size={24} /> : 'Kirala'}
          </Button>

          {rentalError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {rentalError}
            </Alert>
          )}

          <Button
            variant="outlined"
            color="primary"
            size="large"
            fullWidth
            onClick={handleChatOpen}
            startIcon={<MessageIcon />}
          >
            Mesaj Gönder
          </Button>
        </Grid>
      </Grid>

      {/* Değerlendirmeler Bölümü */}
      {ratings.count > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Değerlendirmeler ({ratings.count})
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <SimpleStarRating 
              rating={ratings.average || 0} 
              count={ratings.count || 0} 
              size="large" 
            />
          </Box>

          <Grid container spacing={3}>
            {ratings.reviews && ratings.reviews.map((review, index) => (
              <Grid item xs={12} key={index}>
                <Card sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {review.userName?.charAt(0) || 'U'}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {review.userName || 'Anonim Kullanıcı'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SimpleStarRating 
                          rating={review.rating} 
                          count={0}
                          size="small" 
                          showCount={false}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  {review.comment && (
                    <Typography variant="body1" sx={{ ml: 7 }}>
                      {review.comment}
                    </Typography>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Başarı Dialog'u */}
      <Dialog open={rentalSuccess} onClose={handleCloseSuccessDialog}>
        <DialogTitle>Kiralama Talebi Gönderildi!</DialogTitle>
        <DialogContent>
          <Typography>
            {product?.name} ürünü için kiralama talebiniz başarıyla gönderildi.
            Ürün sahibinin onayından sonra kiralama işlemi tamamlanacaktır.
          </Typography>
          <Typography sx={{ mt: 2, fontWeight: 'bold' }}>
            Talep Detayları:
          </Typography>
          <Typography>
            • Süre: {selectedDuration} gün
          </Typography>
          <Typography>
            • Toplam tutar: {calculateTotalPrice()}₺
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} variant="contained">
            Tamam
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={showRatingForm} onClose={() => setShowRatingForm(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ürünü Puanla</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              {product?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Bu ürün hakkında ne düşünüyorsunuz?
            </Typography>
            <Box sx={{ my: 2 }}>
              <InteractiveStarRating 
                rating={newRating} 
                onRate={setNewRating} 
                size="large" 
              />
            </Box>
          </Box>
          <TextField
            fullWidth
            label="Yorum (İsteğe bağlı)"
            multiline
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ürün hakkında deneyiminizi paylaşın..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRatingForm(false)}>
            İptal
          </Button>
          <Button 
            onClick={handleSubmitRating} 
            variant="contained"
            disabled={!newRating}
          >
            Puanla
          </Button>
        </DialogActions>
      </Dialog>

      {/* Chat Dialog */}
      {product && (
        <Chat
          open={chatOpen}
          onClose={() => setChatOpen(false)}
          item={product}
          otherUser={product.ownerInfo}
          currentUser={currentUser}
        />
      )}
    </Container>
  );
};

export default ProductDetail; 