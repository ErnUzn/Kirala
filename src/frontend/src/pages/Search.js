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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn,
  Star,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

// Ürün listesini import edelim
import { products } from './Products';

// Styled components
const SearchField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [priceRange, setPriceRange] = useState('all');
  const [condition, setCondition] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [category, setCategory] = useState('all');
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
    console.log("Arama sayfası: Ürün ID'sine yönlendiriliyor:", productId);
    navigate(`/product/${productId}`);
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      setSearchQuery(event.target.value);
      // URL'i güncelle
      navigate(`/search?q=${event.target.value}`);
    }
  };

  // Filtreleri uygula
  const handlePriceRangeChange = (event) => {
    setPriceRange(event.target.value);
  };

  const handleConditionChange = (event) => {
    setCondition(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  // Ürünleri filtreleme
  const getFilteredProducts = () => {
    // Tüm Products.js ürünlerini kullanıyoruz
    let filtered = [...products];

    // Arama sorgusuna göre filtreleme
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    // Kategoriye göre filtreleme
    if (category !== 'all') {
      filtered = filtered.filter(product => product.category === category);
    }

    // Fiyat aralığına göre filtreleme
    if (priceRange !== 'all') {
      const priceRanges = {
        'low': { min: 0, max: 100 },
        'medium': { min: 100, max: 250 },
        'high': { min: 250, max: 500 },
        'very-high': { min: 500, max: Number.MAX_SAFE_INTEGER }
      };

      const range = priceRanges[priceRange];
      filtered = filtered.filter(product => {
        const numericPrice = parseInt(product.price.replace(/[^\d]/g, ''));
        return numericPrice >= range.min && numericPrice <= range.max;
      });
    }

    // Duruma göre filtreleme
    if (condition !== 'all') {
      filtered = filtered.filter(product => product.condition === condition);
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  // Kategori listesi (Products.js'den dinamik olarak oluşturuldu)
  const categories = [...new Set(products.map(product => product.category))];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Arama Sonuçları
      </Typography>

      <Grid container spacing={4}>
        {/* Sol Taraf - Filtreler */}
        <Grid item xs={12} md={3}>
          <Box sx={{ mb: 4 }}>
            <SearchField
              fullWidth
              placeholder="Ara..."
              defaultValue={searchQuery}
              onKeyPress={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Filtreler
            </Typography>

            {/* Kategori Filtresi */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="category-label">Kategori</InputLabel>
              <Select
                labelId="category-label"
                id="category-select"
                value={category}
                label="Kategori"
                onChange={handleCategoryChange}
              >
                <MenuItem value="all">Tümü</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Fiyat Aralığı Filtresi */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="price-range-label">Fiyat Aralığı</InputLabel>
              <Select
                labelId="price-range-label"
                id="price-range-select"
                value={priceRange}
                label="Fiyat Aralığı"
                onChange={handlePriceRangeChange}
              >
                <MenuItem value="all">Tümü</MenuItem>
                <MenuItem value="low">0₺ - 100₺</MenuItem>
                <MenuItem value="medium">100₺ - 250₺</MenuItem>
                <MenuItem value="high">250₺ - 500₺</MenuItem>
                <MenuItem value="very-high">500₺ ve üzeri</MenuItem>
              </Select>
            </FormControl>

            {/* Durum Filtresi */}
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="condition-label">Durum</InputLabel>
              <Select
                labelId="condition-label"
                id="condition-select"
                value={condition}
                label="Durum"
                onChange={handleConditionChange}
              >
                <MenuItem value="all">Tümü</MenuItem>
                <MenuItem value="Yeni">Yeni</MenuItem>
                <MenuItem value="İyi">İyi</MenuItem>
                <MenuItem value="Normal">Normal</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        {/* Sağ Taraf - Ürünler */}
        <Grid item xs={12} md={9}>
          {filteredProducts.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ my: 4 }}>
              Aramanıza uygun sonuç bulunamadı.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
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
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Search; 