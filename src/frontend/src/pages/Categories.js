import React, { useState, useEffect, useCallback } from 'react';
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
  CircularProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  Badge,
  Avatar,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  LocationOn,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Search as SearchIcon,
  ViewModule,
  ViewList,
  // Kategori ikonları
  SportsEsports,
  DirectionsCar,
  MusicNote,
  OutdoorGrill,
  Home,
  SportsBasketball,
  Computer,
  Build,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// API servisini import ediyoruz
import { getAllProducts, getProductsByCategory } from '../services/productService';
import { SimpleStarRating } from '../components/StarRating';

const Categories = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterCondition, setFilterCondition] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid veya list
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);
  
  // URL'den kategori ve arama parametrelerini al
  const getCategoryFromURL = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    return categoryParam ? parseInt(categoryParam, 10) : 0;
  }, [location.search]);

  const getSearchQueryFromURL = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('q') || '';
  }, [location.search]);
  
  const [selectedCategory, setSelectedCategory] = useState(getCategoryFromURL());
  
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
  
  // URL değiştiğinde seçili kategoriyi ve arama terimini güncelle
  useEffect(() => {
    setSelectedCategory(getCategoryFromURL());
    setSearchTerm(getSearchQueryFromURL());
  }, [getCategoryFromURL, getSearchQueryFromURL]);

  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  const handleFavoriteClick = (productId) => {
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.includes(productId);
      let newFavorites;
      if (isFavorite) {
        newFavorites = prevFavorites.filter(id => id !== productId);
      } else {
        newFavorites = [...prevFavorites, productId];
      }
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (productId) => {
    return favorites.includes(productId);
  };

  const handleRent = (productId) => {
    console.log("Kategoriler sayfası: Ürün ID'sine yönlendiriliyor:", productId);
    navigate(`/product/${productId}`);
  };

  // Güncellenmiş kategoriler tanımı
  const categoryDefinitions = [
    {
      id: 'all',
      title: 'Tümü',
      icon: <ViewModule />,
      categoryName: 'All',
      color: '#1976d2',
      description: 'Tüm kategorilerdeki ürünler'
    },
    {
      id: 'electronics',
      title: 'Elektronik',
      icon: <Computer />,
      categoryName: 'Electronics',
      color: '#2196f3',
      description: 'Bilgisayar, telefon, kamera, drone, oyun konsolları ve elektronik cihazlar'
    },
    {
      id: 'transportation',
      title: 'Ulaşım',
      icon: <DirectionsCar />,
      categoryName: 'Transportation',
      color: '#ff5722',
      description: 'Scooter, bisiklet, araç ve ulaşım araçları'
    },
    {
      id: 'sports',
      title: 'Spor & Outdoor',
      icon: <SportsBasketball />,
      categoryName: 'Sports',
      color: '#4caf50',
      description: 'Kamp malzemeleri, bisikletler, kayak ve outdoor ekipmanları'
    },
    {
      id: 'music',
      title: 'Müzik & Ses',
      icon: <MusicNote />,
      categoryName: 'Music',
      color: '#9c27b0',
      description: 'Gitarlar, müzik aletleri ve ses ekipmanları'
    },
    {
      id: 'gaming',
      title: 'Oyun & Eğlence',
      icon: <SportsEsports />,
      categoryName: 'Gaming',
      color: '#f44336',
      description: 'Oyun konsolları, PC oyunları ve eğlence ürünleri'
    },
    {
      id: 'camping',
      title: 'Kamp & Doğa',
      icon: <OutdoorGrill />,
      categoryName: 'Camping',
      color: '#795548',
      description: 'Kamp malzemeleri ve doğa sporları ekipmanları'
    },
    {
      id: 'home',
      title: 'Ev & Bahçe',
      icon: <Home />,
      categoryName: 'Home',
      color: '#607d8b',
      description: 'Ev eşyaları, bahçe araçları ve dekorasyon'
    },
    {
      id: 'tools',
      title: 'Aletler & Araçlar',
      icon: <Build />,
      categoryName: 'Tools',
      color: '#ff9800',
      description: 'El aletleri, elektrikli aletler ve workshop malzemeleri'
    }
  ];

  // Kategorileri ürünlerle birleştir
  const categories = categoryDefinitions.map(cat => {
    let categoryProducts = cat.categoryName === 'All' 
      ? products 
      : getProductsByCategory(products, cat.categoryName);
    
    // Filtreleme uygula
    if (searchTerm) {
      categoryProducts = categoryProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

    if (filterCondition !== 'all') {
      categoryProducts = categoryProducts.filter(product => 
        product.condition === filterCondition
    );
  }

    if (showOnlyAvailable) {
      categoryProducts = categoryProducts.filter(product => 
        product.isAvailable !== false
      );
    }
    
    // Sıralama uygula
    categoryProducts.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.dailyPrice - b.dailyPrice;
        case 'price-high':
          return b.dailyPrice - a.dailyPrice;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at);
        default:
          return 0;
      }
    });
    
    return {
      ...cat,
      products: categoryProducts
    };
  });

  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
    // URL'yi güncelle
    const category = categories[newValue];
    if (category.id === 'all') {
      navigate('/categories');
    } else {
      navigate(`/categories?category=${newValue}`);
    }
  };

  // Grid ve List görünümleri için ürün kartı
  const ProductCard = ({ product, isListView = false }) => (
    <Card sx={{ 
      height: '100%',
      minHeight: isListView ? 'auto' : '460px', 
      display: 'flex', 
      flexDirection: isListView ? 'row' : 'column',
      position: 'relative',
      transition: 'transform 0.2s, box-shadow 0.2s',
      borderRadius: 3,
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: 6
      }
    }}>
      <Box sx={{ 
        position: 'relative', 
        width: isListView ? 200 : '100%',
        height: isListView ? 120 : 200,
        flexShrink: 0
      }}>
                        <CardMedia
                          component="img"
          height={isListView ? 120 : 200}
                          image={product.images && product.images[0] ? product.images[0] : 'https://via.placeholder.com/300x200'}
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x200?text=Ürün+Görseli';
                          }}
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
        p: isListView ? 2 : 2.5,
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
              fontSize: isListView ? '1.1rem' : '1.2rem',
              lineHeight: 1.3,
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
            {product.description.length > (isListView ? 150 : 100)
              ? `${product.description.substring(0, isListView ? 150 : 100)}...` 
                              : product.description}
                          </Typography>
        </Box>
        
        <Stack spacing={1.5} sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                              {product.dailyPrice}₺/gün
                            </Typography>
                            <Chip
              label={product.condition === 'new' ? 'Yeni' : product.condition === 'good' ? 'İyi' : 'Kullanılmış'}
              color={product.condition === 'new' ? 'success' : product.condition === 'good' ? 'info' : 'default'}
                              size="small"
              variant="outlined"
                            />
                          </Box>
          <SimpleStarRating 
            rating={product.rating?.average || 0} 
            count={product.rating?.count || 0} 
            size="small" 
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary" noWrap>
                              {product.location}
                            </Typography>
                          </Box>
                          <Button 
                            variant="contained" 
                            color="primary" 
            fullWidth={!isListView}
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
  );

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Container>
    );
  }

  const currentCategory = categories[selectedCategory] || categories[0];

  // Eğer kategoriler henüz yüklenmemişse veya currentCategory yoksa varsayılan değer kullan
  if (!currentCategory) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      {/* Başlık ve açıklama */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Ürünler
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          İhtiyacınız olan her şeyi kategorilere göre keşfedin. Binlerce ürün arasından size en uygun olanını bulun.
        </Typography>
      </Box>

      {/* Kategori Sekmeleri */}
      <Paper elevation={2} sx={{ mb: 4, borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={selectedCategory}
            onChange={handleCategoryChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minWidth: 120,
                fontWeight: 600,
                textTransform: 'none',
                py: 2
              }
            }}
          >
            {categories.map((category, index) => (
              <Tab
                key={category.id}
                icon={
                  <Badge badgeContent={category.products.length} color="primary" showZero={false}>
                    <Avatar sx={{ bgcolor: category.color, width: 32, height: 32 }}>
                      {category.icon}
                    </Avatar>
                  </Badge>
                }
                label={category.title}
                id={`category-tab-${index}`}
                aria-controls={`category-tabpanel-${index}`}
                iconPosition="start"
                sx={{
                  flexDirection: 'row',
                  gap: 1,
                  '& .MuiTab-iconWrapper': {
                    marginBottom: 0
                  }
                }}
              />
            ))}
          </Tabs>
        </Box>
      </Paper>

      {/* Arama ve Filtreler */}
      <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Sırala</InputLabel>
              <Select
                value={sortBy}
                label="Sırala"
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="name">İsme Göre</MenuItem>
                <MenuItem value="price-low">Fiyat: Düşük → Yüksek</MenuItem>
                <MenuItem value="price-high">Fiyat: Yüksek → Düşük</MenuItem>
                <MenuItem value="newest">En Yeni</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Durum</InputLabel>
              <Select
                value={filterCondition}
                label="Durum"
                onChange={(e) => setFilterCondition(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all">Tümü</MenuItem>
                <MenuItem value="new">Yeni</MenuItem>
                <MenuItem value="good">İyi</MenuItem>
                <MenuItem value="used">Kullanılmış</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControlLabel
              control={
                <Switch
                  checked={showOnlyAvailable}
                  onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                />
              }
              label="Sadece Müsait"
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                <ViewModule />
              </IconButton>
              <IconButton
                onClick={() => setViewMode('list')}
                color={viewMode === 'list' ? 'primary' : 'default'}
              >
                <ViewList />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Kategori İçeriği */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ bgcolor: currentCategory.color, mr: 2, width: 48, height: 48 }}>
            {currentCategory.icon}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold' }}>
              {currentCategory.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {currentCategory.description} • {currentCategory.products.length} ürün
            </Typography>
          </Box>
        </Box>

        {currentCategory.products.length === 0 ? (
          <Paper elevation={1} sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Bu kategoride ürün bulunamadı
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Arama kriterlerinizi değiştirmeyi deneyin veya diğer kategorilere göz atın.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={viewMode === 'grid' ? 3 : 2}>
            {currentCategory.products.map((product) => (
              <Grid item xs={12} sm={viewMode === 'grid' ? 6 : 12} md={viewMode === 'grid' ? 4 : 12} key={product._id}>
                <ProductCard product={product} isListView={viewMode === 'list'} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
    </Container>
  );
};

export default Categories; 