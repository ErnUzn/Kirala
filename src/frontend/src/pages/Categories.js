import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  IconButton,
  Tabs,
  Tab,
} from '@mui/material';
import {
  LocationOn,
  Star,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  CameraAlt,
  Videocam,
  Headphones,
  WbIridescent,
  Phone,
  OutdoorGrill,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// Ürün listesini import ediyoruz
import { products } from './Products';

const Categories = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // URL'den kategori parametresini al
  const getCategoryFromURL = () => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    return categoryParam ? parseInt(categoryParam, 10) : 0;
  };
  
  const [selectedCategory, setSelectedCategory] = useState(getCategoryFromURL());
  
  // URL değiştiğinde seçili kategoriyi güncelle
  useEffect(() => {
    setSelectedCategory(getCategoryFromURL());
  }, [location.search]);

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const handleFavoriteClick = (productId) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.includes(productId);
      if (isFavorite) {
        return prevFavorites.filter(id => id !== productId);
      } else {
        return [...prevFavorites, productId];
      }
    });
  };

  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  const handleRent = (productId) => {
    console.log("Kategoriler sayfası: Ürün ID'sine yönlendiriliyor:", productId);
    navigate(`/product/${productId}`);
  };

  // Ürünleri kategorilere göre filtrele
  const getProductsByCategory = (categoryName) => {
    return products.filter(product => product.category === categoryName);
  };

  const categories = [
    {
      id: 'photo',
      title: 'Fotoğraf',
      icon: <CameraAlt />,
      products: getProductsByCategory('Fotoğraf')
    },
    {
      id: 'video',
      title: 'Video',
      icon: <Videocam />,
      products: getProductsByCategory('Video')
    },
    {
      id: 'audio',
      title: 'Ses',
      icon: <Headphones />,
      products: getProductsByCategory('Ses')
    },
    {
      id: 'light',
      title: 'Işık',
      icon: <WbIridescent />,
      products: getProductsByCategory('Işık')
    },
    {
      id: 'camping',
      title: 'Kamp',
      icon: <OutdoorGrill />,
      products: getProductsByCategory('Kamp')
    },
    {
      id: 'phone',
      title: 'Telefon',
      icon: <Phone />,
      products: getProductsByCategory('Telefon')
    }
  ];

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Kategoriler
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={selectedCategory}
          onChange={(e, newValue) => setSelectedCategory(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((category, index) => (
            <Tab
              key={category.id}
              icon={category.icon}
              label={category.title}
              id={`category-tab-${index}`}
              aria-controls={`category-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      {categories.map((category, index) => (
        <div
          key={category.id}
          role="tabpanel"
          hidden={selectedCategory !== index}
          id={`category-tabpanel-${index}`}
          aria-labelledby={`category-tab-${index}`}
        >
          {selectedCategory === index && (
            <Box>
              <Typography variant="h5" component="h2" gutterBottom>
                {category.title} Ekipmanları
              </Typography>
              <Grid container spacing={3}>
                {category.products.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.image}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Ürün+Görseli';
                        }}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleRent(product.id)}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          bgcolor: 'background.paper',
                          borderRadius: '50%'
                        }}
                      >
                        <IconButton
                          onClick={() => handleFavoriteClick(product.id)}
                          sx={{ color: isFavorite(product.id) ? 'error.main' : 'inherit' }}
                        >
                          {isFavorite(product.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                      </Box>
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography 
                          gutterBottom 
                          variant="h6" 
                          component="h3"
                          sx={{ cursor: 'pointer' }} 
                          onClick={() => handleRent(product.id)}
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {product.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" color="primary" sx={{ mr: 1 }}>
                            {product.price}
                          </Typography>
                          <Chip
                            label={product.condition}
                            color={product.condition === 'Yeni' ? 'success' : 'default'}
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
                            {product.rating} ({product.reviewCount} değerlendirme)
                          </Typography>
                        </Box>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          fullWidth
                          onClick={() => handleRent(product.id)}
                        >
                          Kirala
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </div>
      ))}
    </Container>
  );
};

export default Categories; 