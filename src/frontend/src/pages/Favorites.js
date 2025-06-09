import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  LocationOn,
  Star,
  Favorite as FavoriteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// API servisini import ediyoruz
import { getAllProducts } from '../services/productService';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Favori ID'lerini localStorage'dan yükle
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      const favoriteIds = JSON.parse(savedFavorites);
      setFavorites(favoriteIds);
    } else {
      setLoading(false);
    }
  }, []);

  // Favori ürünlerin detaylarını API'den getir
  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (favorites.length === 0) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Tüm ürünleri getir
        const allProducts = await getAllProducts();
        
        // Sadece favori olan ürünleri filtrele
        const favoriteProductsData = allProducts.filter(product => 
          favorites.includes(product._id)
        );
        
        setFavoriteProducts(favoriteProductsData);
      } catch (err) {
        setError(err.message);
        console.error('Favori ürünler yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [favorites]);

  const handleRemoveFavorite = (productId) => {
    // Favori listesinden kaldır
    const newFavorites = favorites.filter(id => id !== productId);
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    // Görüntülenen ürünlerden de kaldır
    setFavoriteProducts(prevProducts => 
      prevProducts.filter(product => product._id !== productId)
    );
  };

  const handleRent = (productId) => {
    navigate(`/product/${productId}`);
  };

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
        <Typography variant="h6" color="error" align="center">
          Favori ürünler yüklenirken bir hata oluştu: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Favorilerim ({favoriteProducts.length} ürün)
      </Typography>

      {favoriteProducts.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Henüz favori ürününüz bulunmuyor.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Ürünlerin yanındaki kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => navigate('/products')}
          >
            Ürünleri Keşfet
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {favoriteProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300x200'}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Ürün+Görseli';
                    }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                    onClick={() => handleRemoveFavorite(product._id)}
                  >
                    <FavoriteIcon sx={{ color: 'red' }} />
                  </IconButton>
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h3">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" color="primary" sx={{ mr: 1 }}>
                      ₺{product.dailyPrice}/gün
                    </Typography>
                    <Chip
                      label={product.condition || 'İyi'}
                      color={product.condition === 'new' ? 'success' : 'default'}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {product.location}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {product.rating?.average || 0} ({product.rating?.count || 0} değerlendirme)
                    </Typography>
                  </Box>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    onClick={() => handleRent(product._id)}
                  >
                    Kirala
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Favorites; 