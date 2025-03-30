import React from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

// Styled components
const SearchField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Category = () => {
  const navigate = useNavigate();

  // Simüle edilmiş kategori verisi
  const category = {
    id: 1,
    name: 'Fotoğraf Makineleri',
    description: 'Profesyonel ve amatör fotoğraf makineleri',
    products: [
      {
        id: 1,
        title: 'Profesyonel DSLR Kamera',
        price: 250,
        image: 'https://source.unsplash.com/random/400x300?dslr',
        description: 'Yüksek çözünürlüklü profesyonel DSLR kamera',
        rating: 4.5,
        reviewCount: 128,
        location: 'İstanbul',
        condition: 'Yeni',
      },
      {
        id: 2,
        title: 'Mirrorless Kamera',
        price: 300,
        image: 'https://source.unsplash.com/random/400x300?mirrorless',
        description: 'Hafif ve kompakt mirrorless kamera',
        rating: 4.8,
        reviewCount: 95,
        location: 'Ankara',
        condition: 'Yeni',
      },
      {
        id: 3,
        title: 'Film Kamera',
        price: 150,
        image: 'https://source.unsplash.com/random/400x300?film-camera',
        description: 'Vintage film kamera',
        rating: 4.2,
        reviewCount: 45,
        location: 'İzmir',
        condition: 'İyi',
      },
      {
        id: 4,
        title: 'Orta Format Kamera',
        price: 450,
        image: 'https://source.unsplash.com/random/400x300?medium-format',
        description: 'Profesyonel orta format dijital kamera',
        rating: 4.9,
        reviewCount: 32,
        location: 'İstanbul',
        condition: 'Yeni',
      },
      {
        id: 5,
        title: 'Kompakt Kamera',
        price: 100,
        image: 'https://source.unsplash.com/random/400x300?compact-camera',
        description: 'Taşınabilir kompakt fotoğraf makinesi',
        rating: 4.0,
        reviewCount: 156,
        location: 'Bursa',
        condition: 'İyi',
      },
      {
        id: 6,
        title: 'Stüdyo Kamerası',
        price: 600,
        image: 'https://source.unsplash.com/random/400x300?studio-camera',
        description: 'Profesyonel stüdyo çekimleri için ideal kamera',
        rating: 4.7,
        reviewCount: 28,
        location: 'Ankara',
        condition: 'Yeni',
      },
      {
        id: 7,
        title: 'Retro Kamera',
        price: 200,
        image: 'https://source.unsplash.com/random/400x300?retro-camera',
        description: 'Klasik tasarımlı retro fotoğraf makinesi',
        rating: 4.3,
        reviewCount: 67,
        location: 'İzmir',
        condition: 'İyi',
      },
      {
        id: 8,
        title: 'Sualtı Kamerası',
        price: 280,
        image: 'https://source.unsplash.com/random/400x300?underwater-camera',
        description: '30 metre derinliğe kadar sualtı çekimleri için',
        rating: 4.6,
        reviewCount: 42,
        location: 'Antalya',
        condition: 'Yeni',
      },
      {
        id: 9,
        title: 'Instant Kamera',
        price: 120,
        image: 'https://source.unsplash.com/random/400x300?instant-camera',
        description: 'Anında baskı yapabilen eğlenceli kamera',
        rating: 4.4,
        reviewCount: 89,
        location: 'İstanbul',
        condition: 'İyi',
      }
    ],
  };

  const handleRent = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {category.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {category.description}
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <SearchField
              fullWidth
              variant="outlined"
              placeholder="Ürün ara..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Fiyat Aralığı</InputLabel>
              <Select label="Fiyat Aralığı">
                <MenuItem value="0-100">₺0 - ₺100</MenuItem>
                <MenuItem value="100-200">₺100 - ₺200</MenuItem>
                <MenuItem value="200-300">₺200 - ₺300</MenuItem>
                <MenuItem value="300+">₺300 ve üzeri</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select label="Durum">
                <MenuItem value="new">Yeni</MenuItem>
                <MenuItem value="good">İyi</MenuItem>
                <MenuItem value="fair">Orta</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {category.products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h3">
                  {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {product.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" color="primary" sx={{ mr: 1 }}>
                    ₺{product.price}/gün
                  </Typography>
                  <Chip
                    label={product.condition}
                    color={product.condition === 'Yeni' ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.location}
                </Typography>
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
  );
};

export default Category; 