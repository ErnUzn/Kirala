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
  Paper,
  InputBase,
  Divider,
  Stack,
} from '@mui/material';
import {
  LocationOn,
  Star,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Search as SearchIcon,
  CameraAlt,
  Videocam,
  Headphones,
  WbIridescent,
  LocalShipping,
  Security,
  Support,
  ThumbUpAlt,
  Phone,
  OutdoorGrill,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

// Ürün listesini import edelim
import { products } from './Products';

const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  padding: theme.spacing(15, 0),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  marginBottom: theme.spacing(6),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url(https://source.unsplash.com/random/1920x1080?camera) center/cover',
    opacity: 0.2,
  }
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  transition: 'transform 0.2s',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-5px)',
  }
}));

const SearchBar = styled(Paper)(({ theme }) => ({
  padding: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  maxWidth: 600,
  margin: '0 auto',
  marginTop: theme.spacing(4),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
}));

const Home = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

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
    console.log("Ana sayfa: Ürün ID'sine yönlendiriliyor:", productId);
    navigate(`/product/${productId}`);
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      navigate(`/search?q=${event.target.value}`);
    }
  };

  const categories = [
    { title: 'Fotoğraf', icon: <CameraAlt sx={{ fontSize: 40 }} />, color: '#2196F3', index: 0 },
    { title: 'Video', icon: <Videocam sx={{ fontSize: 40 }} />, color: '#F50057', index: 1 },
    { title: 'Ses', icon: <Headphones sx={{ fontSize: 40 }} />, color: '#00BFA5', index: 2 },
    { title: 'Işık', icon: <WbIridescent sx={{ fontSize: 40 }} />, color: '#FFB300', index: 3 },
    { title: 'Kamp', icon: <OutdoorGrill sx={{ fontSize: 40 }} />, color: '#43A047', index: 4 },
    { title: 'Telefon', icon: <Phone sx={{ fontSize: 40 }} />, color: '#7B1FA2', index: 5 },
  ];

  const features = [
    { icon: <LocalShipping />, title: 'Ücretsiz Teslimat', description: '500₺ üzeri kiralama' },
    { icon: <Security />, title: 'Güvenli Ödeme', description: '256-bit SSL şifreleme' },
    { icon: <Support />, title: '7/24 Destek', description: 'Her zaman yanınızda' },
    { icon: <ThumbUpAlt />, title: 'Kalite Garantisi', description: 'Test edilmiş ürünler' },
  ];

  // Öne çıkan ürünler (Products.js'den alınan gerçek ürünler)
  const featuredProducts = [
    products.find(p => p.id === 1),  // DSLR Kamera
    products.find(p => p.id === 8),  // Drone
    products.find(p => p.id === 7),  // GoPro Kamera
    products.find(p => p.id === 5),  // Video Kamera
    products.find(p => p.id === 9),  // Işık Seti
    products.find(p => p.id === 6),  // Gimbal
    products.find(p => p.id === 13), // Ses Kayıt Cihazı
    products.find(p => p.id === 19)  // Kamp Ocağı
  ];

  return (
    <Box>
      <HeroSection>
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Profesyonel Ekipmanları Kiralayın
          </Typography>
          <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
            Yüksek kaliteli ekipmanları uygun fiyatlarla kiralayın
          </Typography>
          <SearchBar elevation={3}>
            <InputBase
              sx={{ ml: 2, flex: 1 }}
              placeholder="Ne kiralamak istersiniz?"
              onKeyPress={handleSearch}
            />
            <IconButton sx={{ p: '10px' }}>
              <SearchIcon />
            </IconButton>
          </SearchBar>
        </Container>
      </HeroSection>

      <Container>
        {/* Kategoriler */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
          Kategoriler
        </Typography>
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={category.title}>
              <CategoryCard onClick={() => navigate(`/categories?category=${category.index}`)}>
                <Box sx={{ color: category.color, mb: 2 }}>
                  {category.icon}
                </Box>
                <Typography variant="h6" component="h3">
                  {category.title}
                </Typography>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>

        {/* Öne Çıkan Ürünler */}
        <Container sx={{ mt: 8, mb: 8 }}>
          <Typography variant="h4" gutterBottom>
            Öne Çıkan Ürünler
          </Typography>
          <Grid container spacing={4}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative' 
                  }}
                >
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
                    <Typography gutterBottom variant="h6" component="h3">
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
        </Container>

        {/* Özellikler */}
        <Box sx={{ py: 8, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Container>
            <Grid container spacing={4}>
              {features.map((feature) => (
                <Grid item xs={12} sm={6} md={3} key={feature.title}>
                  <Stack alignItems="center" spacing={2}>
                    <Box sx={{ 
                      bgcolor: 'primary.main',
                      color: 'white',
                      p: 2,
                      borderRadius: '50%',
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h6" align="center">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {feature.description}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 