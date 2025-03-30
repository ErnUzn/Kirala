import React, { useState } from 'react';
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
} from '@mui/material';
import { Favorite, FavoriteBorder, LocationOn, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Ürün listesini export ediyoruz
export const products = [
  // Fotoğraf Ekipmanları
  {
    id: 1,
    name: 'Profesyonel DSLR Kamera',
    category: 'Fotoğraf',
    description: 'Yüksek çözünürlüklü profesyonel DSLR kamera',
    price: '250₺/gün',
    image: 'https://source.unsplash.com/random/400x300?dslr',
    rating: 4.5,
    reviewCount: 128,
    location: 'İstanbul',
    condition: 'Yeni'
  },
  {
    id: 2,
    name: 'Mirrorless Kamera',
    category: 'Fotoğraf',
    description: 'Hafif ve kompakt mirrorless kamera',
    price: '300₺/gün',
    image: 'https://source.unsplash.com/random/400x300?mirrorless',
    rating: 4.8,
    reviewCount: 95,
    location: 'Ankara',
    condition: 'Yeni'
  },
  {
    id: 3,
    name: 'Film Kamera',
    category: 'Fotoğraf',
    description: 'Vintage film kamera',
    price: '150₺/gün',
    image: 'https://source.unsplash.com/random/400x300?film-camera',
    rating: 4.2,
    reviewCount: 45,
    location: 'İzmir',
    condition: 'İyi'
  },
  {
    id: 4,
    name: 'Profesyonel Lens Seti',
    category: 'Fotoğraf',
    description: '24-70mm ve 70-200mm profesyonel lens seti',
    price: '200₺/gün',
    image: 'https://source.unsplash.com/random/400x300?camera-lens',
    rating: 4.7,
    reviewCount: 82,
    location: 'İstanbul',
    condition: 'Yeni'
  },

  // Video Ekipmanları
  {
    id: 5,
    name: 'Profesyonel Video Kamera',
    category: 'Video',
    description: '4K çözünürlüklü profesyonel video kamera',
    price: '350₺/gün',
    image: 'https://source.unsplash.com/random/400x300?video-camera',
    rating: 4.7,
    reviewCount: 72,
    location: 'İstanbul',
    condition: 'Yeni'
  },
  {
    id: 6,
    name: 'Gimbal',
    category: 'Video',
    description: '3 eksenli kamera sabitleyici',
    price: '180₺/gün',
    image: 'https://source.unsplash.com/random/400x300?gimbal',
    rating: 4.6,
    reviewCount: 84,
    location: 'İzmir',
    condition: 'Yeni'
  },
  {
    id: 7,
    name: 'GoPro Kamera',
    category: 'Video',
    description: 'Su geçirmez aksiyon kamerası',
    price: '150₺/gün',
    image: 'https://source.unsplash.com/random/400x300?gopro',
    rating: 4.2,
    reviewCount: 45,
    location: 'İzmir',
    condition: 'İyi'
  },
  {
    id: 8,
    name: 'Drone',
    category: 'Video',
    description: '4K kamera özellikli profesyonel drone',
    price: '500₺/gün',
    image: 'https://source.unsplash.com/random/400x300?drone',
    rating: 4.8,
    reviewCount: 95,
    location: 'Ankara',
    condition: 'Yeni'
  },

  // Işık Ekipmanları
  {
    id: 9,
    name: 'Işık Seti',
    category: 'Işık',
    description: 'Profesyonel stüdyo ışık seti',
    price: '120₺/gün',
    image: 'https://source.unsplash.com/random/400x300?studio-light',
    rating: 4.4,
    reviewCount: 63,
    location: 'Ankara',
    condition: 'İyi'
  },
  {
    id: 10,
    name: 'LED Panel',
    category: 'Işık',
    description: 'Ayarlanabilir renk sıcaklığına sahip LED panel',
    price: '160₺/gün',
    image: 'https://source.unsplash.com/random/400x300?led-panel',
    rating: 4.4,
    reviewCount: 38,
    location: 'İstanbul',
    condition: 'Yeni'
  },
  {
    id: 11,
    name: 'Ring Light',
    category: 'Işık',
    description: 'Profesyonel ring ışık seti',
    price: '100₺/gün',
    image: 'https://source.unsplash.com/random/400x300?ring-light',
    rating: 4.3,
    reviewCount: 42,
    location: 'Bursa',
    condition: 'İyi'
  },
  {
    id: 12,
    name: 'Softbox Seti',
    category: 'Işık',
    description: 'Profesyonel softbox ışık seti',
    price: '140₺/gün',
    image: 'https://source.unsplash.com/random/400x300?softbox',
    rating: 4.5,
    reviewCount: 55,
    location: 'İstanbul',
    condition: 'Yeni'
  },

  // Ses Ekipmanları
  {
    id: 13,
    name: 'Ses Kayıt Cihazı',
    category: 'Ses',
    description: 'Yüksek kaliteli ses kayıt cihazı',
    price: '90₺/gün',
    image: 'https://source.unsplash.com/random/400x300?audio-recorder',
    rating: 4.3,
    reviewCount: 51,
    location: 'Bursa',
    condition: 'İyi'
  },
  {
    id: 14,
    name: 'Mikrofon Seti',
    category: 'Ses',
    description: 'Profesyonel kablosuz mikrofon seti',
    price: '200₺/gün',
    image: 'https://source.unsplash.com/random/400x300?microphone',
    rating: 4.7,
    reviewCount: 56,
    location: 'Ankara',
    condition: 'İyi'
  },
  {
    id: 15,
    name: 'Mikser',
    category: 'Ses',
    description: 'Profesyonel ses mikseri',
    price: '250₺/gün',
    image: 'https://source.unsplash.com/random/400x300?audio-mixer',
    rating: 4.6,
    reviewCount: 48,
    location: 'İstanbul',
    condition: 'Yeni'
  },
  {
    id: 16,
    name: 'Kulaklık Seti',
    category: 'Ses',
    description: 'Profesyonel stüdyo kulaklık seti',
    price: '80₺/gün',
    image: 'https://source.unsplash.com/random/400x300?headphones',
    rating: 4.4,
    reviewCount: 62,
    location: 'İzmir',
    condition: 'İyi'
  },

  // Kamp Ekipmanları
  {
    id: 17,
    name: '4 Kişilik Kamp Çadırı',
    category: 'Kamp',
    description: 'Su geçirmez, çift katmanlı, 4 mevsim kamp çadırı',
    price: '120₺/gün',
    image: 'https://source.unsplash.com/random/400x300?camping-tent',
    rating: 4.8,
    reviewCount: 156,
    location: 'İstanbul',
    condition: 'Yeni'
  },
  {
    id: 18,
    name: 'Uyku Tulumu',
    category: 'Kamp',
    description: '-10°C dayanıklı, ultra hafif uyku tulumu',
    price: '45₺/gün',
    image: 'https://source.unsplash.com/random/400x300?sleeping-bag',
    rating: 4.6,
    reviewCount: 92,
    location: 'Ankara',
    condition: 'İyi'
  },
  {
    id: 19,
    name: 'Kamp Ocağı Seti',
    category: 'Kamp',
    description: 'Taşınabilir kamp ocağı ve tüp seti',
    price: '60₺/gün',
    image: 'https://source.unsplash.com/random/400x300?camping-stove',
    rating: 4.7,
    reviewCount: 78,
    location: 'İzmir',
    condition: 'Yeni'
  },
  {
    id: 20,
    name: 'Kamp Masası ve Sandalye Seti',
    category: 'Kamp',
    description: 'Katlanabilir masa ve 4 sandalye seti',
    price: '80₺/gün',
    image: 'https://source.unsplash.com/random/400x300?camping-table',
    rating: 4.5,
    reviewCount: 64,
    location: 'Antalya',
    condition: 'İyi'
  },

  // Telefon Ekipmanları
  {
    id: 21,
    name: 'iPhone 14 Pro',
    category: 'Telefon',
    description: '256GB, Pro kamera sistemi, Dynamic Island',
    price: '180₺/gün',
    image: 'https://source.unsplash.com/random/400x300?iphone14',
    rating: 4.9,
    reviewCount: 245,
    location: 'İstanbul',
    condition: 'Yeni'
  },
  {
    id: 22,
    name: 'Samsung Galaxy S23 Ultra',
    category: 'Telefon',
    description: '256GB, 200MP kamera, S Pen destekli',
    price: '170₺/gün',
    image: 'https://source.unsplash.com/random/400x300?samsung-galaxy',
    rating: 4.8,
    reviewCount: 189,
    location: 'Ankara',
    condition: 'Yeni'
  },
  {
    id: 23,
    name: 'Google Pixel 7 Pro',
    category: 'Telefon',
    description: '128GB, AI destekli kamera sistemi',
    price: '150₺/gün',
    image: 'https://source.unsplash.com/random/400x300?pixel-phone',
    rating: 4.7,
    reviewCount: 156,
    location: 'İzmir',
    condition: 'İyi'
  },
  {
    id: 24,
    name: 'Xiaomi 13 Pro',
    category: 'Telefon',
    description: '256GB, Leica optik, 120W hızlı şarj',
    price: '140₺/gün',
    image: 'https://source.unsplash.com/random/400x300?xiaomi-phone',
    rating: 4.6,
    reviewCount: 134,
    location: 'Antalya',
    condition: 'Yeni'
  }
];

function Products() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const toggleFavorite = (productId) => {
    setFavorites((prevFavorites) => {
      const isFavorite = prevFavorites.includes(productId);
      if (isFavorite) {
        return prevFavorites.filter((id) => id !== productId);
      } else {
        return [...prevFavorites, productId];
      }
    });
  };

  // Ürün detay sayfasına yönlendirme
  const handleRent = (productId) => {
    console.log("Yönlendirilen ürün ID:", productId);
    navigate(`/product/${productId}`);
  };

  // LocalStorage'a kaydet
  React.useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Kiralık Ekipmanlar
      </Typography>

      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
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
                  onClick={() => toggleFavorite(product.id)}
                  sx={{ color: favorites.includes(product.id) ? 'error.main' : 'inherit' }}
                >
                  {favorites.includes(product.id) ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography 
                  gutterBottom 
                  variant="h6" 
                  component="h2"
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleRent(product.id)}
                >
                  {product.name}
                </Typography>
                <Chip 
                  label={product.category}
                  size="small"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {product.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, mt: 2 }}>
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Star sx={{ fontSize: 16, color: 'warning.main', mr: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {product.rating} ({product.reviewCount} değerlendirme)
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  variant="contained"
                  fullWidth
                  onClick={() => handleRent(product.id)}
                >
                  Kirala
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Products; 