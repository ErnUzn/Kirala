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
  CardActions,
  CircularProgress,
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

// API servisini import edelim
import { getAllProducts, searchProducts } from '../services/productService';

// Styled components
const SearchField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [priceRange, setPriceRange] = useState('all');
  const [condition, setCondition] = useState('all');
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [category, setCategory] = useState('all');
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  // URL parametrelerini dinle
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const queryFromUrl = queryParams.get('q') || '';
    setSearchQuery(queryFromUrl);
  }, [location.search]);

  // Ürünleri API'den çek
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
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

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
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
    let filtered = [...products];

    // Arama sorgusuna göre filtreleme
    if (searchQuery) {
      filtered = searchProducts(filtered, searchQuery);
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
        const numericPrice = Number(product.dailyPrice);
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

  // Kategori listesi (API'den gelen ürünlerden dinamik olarak oluşturuldu)
  const categories = [...new Set(products.map(product => product.category))];

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
              value={searchQuery}
              onChange={handleSearchInputChange}
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
                <MenuItem value="new">Yeni</MenuItem>
                <MenuItem value="like-new">Sıfır Gibi</MenuItem>
                <MenuItem value="good">İyi</MenuItem>
                <MenuItem value="fair">Orta</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>

        {/* Sağ Taraf - Ürün Listesi */}
        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              {filteredProducts.length} ürün bulundu
              {searchQuery && ` "${searchQuery}" için`}
            </Typography>
          </Box>

          {filteredProducts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Arama kriterlerinize uygun ürün bulunamadı
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Farklı arama terimleri veya filtreler deneyebilirsiniz
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
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
                          label={
                            product.condition === 'new' ? 'Yeni' :
                            product.condition === 'like-new' ? 'Sıfır Gibi' :
                            product.condition === 'good' ? 'İyi' :
                            product.condition === 'fair' ? 'Orta' : product.condition
                          }
                          color={
                            product.condition === 'new' ? 'success' :
                            product.condition === 'like-new' ? 'info' :
                            product.condition === 'good' ? 'primary' : 'default'
                          }
                          size="small"
                        />
                      </Box>
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
                        onClick={() => handleFavoriteClick(product._id)}
                        sx={{ color: isFavorite(product._id) ? 'error.main' : 'inherit' }}
                      >
                        {isFavorite(product._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                    </CardActions>
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