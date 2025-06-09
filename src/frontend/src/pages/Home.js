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
  CircularProgress,
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
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      navigate(`/categories?q=${event.target.value}`);
    }
  };

  const categories = [
    { title: 'Elektronik', icon: <CameraAlt sx={{ fontSize: 40 }} />, color: '#2196F3', index: 1 },
    { title: 'Ulaşım', icon: <Videocam sx={{ fontSize: 40 }} />, color: '#F50057', index: 2 },
    { title: 'Spor & Outdoor', icon: <OutdoorGrill sx={{ fontSize: 40 }} />, color: '#00BFA5', index: 3 },
    { title: 'Müzik', icon: <Headphones sx={{ fontSize: 40 }} />, color: '#FFB300', index: 4 },
    { title: 'Ev & Bahçe', icon: <WbIridescent sx={{ fontSize: 40 }} />, color: '#43A047', index: 7 },
    { title: 'Aletler', icon: <Phone sx={{ fontSize: 40 }} />, color: '#7B1FA2', index: 8 },
  ];

  const features = [
    { icon: <LocalShipping />, title: 'Ücretsiz Teslimat', description: '500₺ üzeri kiralama' },
    { icon: <Security />, title: 'Güvenli Ödeme', description: '256-bit SSL şifreleme' },
    { icon: <Support />, title: '7/24 Destek', description: 'Her zaman yanınızda' },
    { icon: <ThumbUpAlt />, title: 'Kalite Garantisi', description: 'Test edilmiş ürünler' },
  ];

  // Öne çıkan ürünler (API'den gelen ilk 8 ürün)
  const featuredProducts = products.slice(0, 8);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

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
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
          Kategoriler
        </Typography>
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={category.title}>
              <CategoryCard 
                onClick={() => navigate(`/categories?category=${category.index}`)}
                sx={{
                  minHeight: '160px',
                  justifyContent: 'center',
                  borderRadius: 3,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                    bgcolor: 'rgba(0, 0, 0, 0.02)'
                  }
                }}
              >
                <Box sx={{ 
                  color: category.color, 
                  mb: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }}>
                  {category.icon}
                </Box>
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600, textAlign: 'center' }}>
                  {category.title}
                </Typography>
              </CategoryCard>
            </Grid>
          ))}
        </Grid>

        {/* Öne Çıkan Ürünler */}
        <Box sx={{ mt: 8, mb: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
            Öne Çıkan Ürünler
          </Typography>
          <Grid container spacing={4}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card sx={{ 
                  height: '100%',
                  minHeight: '440px', 
                  display: 'flex', 
                  flexDirection: 'column',
                  position: 'relative',
                  borderRadius: 3,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}>
                  <Box sx={{ position: 'relative', height: 200, flexShrink: 0 }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300x200'}
                    alt={product.name}
                      sx={{ 
                        cursor: 'pointer',
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%'
                      }}
                      onClick={() => handleRent(product._id)}
                  />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '50%',
                        boxShadow: 1
                      }}
                    >
                      <IconButton 
                        onClick={() => handleFavoriteClick(product._id)}
                        sx={{ 
                          color: isFavorite(product._id) ? 'error.main' : 'text.secondary',
                          '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0.8)'
                          }
                        }}
                      >
                        {isFavorite(product._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </Box>
                    {product.condition === 'new' && (
                      <Chip
                        label="YENİ"
                        color="success"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          fontWeight: 'bold',
                          boxShadow: 1
                        }}
                      />
                    )}
                  </Box>
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    p: 2.5,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography 
                        gutterBottom 
                        variant="h6" 
                        component="h3"
                        sx={{
                          cursor: 'pointer',
                          fontWeight: 600,
                          lineHeight: 1.3,
                          fontSize: '1.1rem',
                          mb: 1
                        }}
                        onClick={() => handleRent(product._id)}
                      >
                      {product.name}
                    </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          lineHeight: 1.4
                        }}
                      >
                      {product.description.length > 100 
                        ? `${product.description.substring(0, 100)}...` 
                        : product.description}
                    </Typography>
                    </Box>
                    
                    <Stack spacing={1.5} sx={{ mt: 'auto' }}>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                        <Chip 
                          label={product.category} 
                          size="small" 
                          variant="outlined"
                        />
                        <Chip 
                          label={product.condition === 'new' ? 'Yeni' : product.condition === 'good' ? 'İyi' : 'Kullanılmış'} 
                          size="small" 
                          color={product.condition === 'new' ? 'success' : product.condition === 'good' ? 'info' : 'default'}
                        />
                    </Stack>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                        {product.location}
                      </Typography>
                    </Box>
                      <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                      {product.dailyPrice}₺/gün
                    </Typography>
                      <Button 
                        variant="contained" 
                        fullWidth
                        onClick={() => handleRent(product._id)}
                        sx={{
                          fontWeight: 'bold',
                          borderRadius: 2,
                          py: 1.2,
                          textTransform: 'none',
                          fontSize: '1rem'
                        }}
                      >
                        Kirala
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Özellikler */}
        <Box sx={{ mt: 10, mb: 8, py: 6, bgcolor: 'grey.50', borderRadius: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 6, fontWeight: 'bold' }}>
            Neden Kirala?
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ 
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 3,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    bgcolor: 'white',
                    boxShadow: 2
                  }
                }}>
                  <Box sx={{ 
                    color: 'primary.main', 
                    mb: 3,
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}>
                    {React.cloneElement(feature.icon, { sx: { fontSize: 56 } })}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home; 