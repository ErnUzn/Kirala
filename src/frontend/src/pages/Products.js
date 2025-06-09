import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
  IconButton,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Favorite, FavoriteBorder, LocationOn, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { SimpleStarRating } from '../components/StarRating';

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // API'den ürünleri çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/items');
        if (!response.ok) {
          throw new Error('Ürünler yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
        console.error('Ürünler yüklenirken hata:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (productId) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.includes(productId);
      if (isFavorite) {
        return prevFavorites.filter(id => id !== productId);
      } else {
        return [...prevFavorites, productId];
      }
    });
  };

  const handleRent = (productId) => {
    console.log("Ürün ID'sine yönlendiriliyor:", productId);
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
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Tüm Ürünler
      </Typography>
      
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300x200'}
                alt={product.name}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/300x200?text=Ürün+Görseli';
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {product.description.length > 100 
                    ? `${product.description.substring(0, 100)}...` 
                    : product.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" color="primary" sx={{ mr: 1 }}>
                    {product.dailyPrice}₺/gün
                  </Typography>
                  <Chip
                    label={product.condition}
                    color={product.condition === 'new' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <SimpleStarRating 
                  rating={product.rating?.average || 0} 
                  count={product.rating?.count || 0} 
                  size="small" 
                />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationOn sx={{ fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {product.location}
                  </Typography>
                </Box>
                <Chip label={product.category} size="small" variant="outlined" />
              </CardContent>
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleRent(product._id)}
                >
                  Kirala
                </Button>
                <IconButton
                  onClick={() => toggleFavorite(product._id)}
                  sx={{ color: favorites.includes(product._id) ? 'error.main' : 'inherit' }}
                >
                  {favorites.includes(product._id) ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Products; 