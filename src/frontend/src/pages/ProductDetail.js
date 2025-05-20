import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  Divider,
  Rating,
  IconButton,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';

// Products listesini import ediyoruz
import { products } from './Products'; 

const DurationButton = styled(Button)(({ theme, selected }) => ({
  minWidth: '80px',
  backgroundColor: selected ? theme.palette.primary.main : 'transparent',
  color: selected ? 'white' : theme.palette.text.primary,
  border: `1px solid ${selected ? theme.palette.primary.main : theme.palette.divider}`,
  '&:hover': {
    backgroundColor: selected ? theme.palette.primary.dark : theme.palette.action.hover,
  },
}));

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ürün verisini ID'ye göre getir
  useEffect(() => {
    try {
      console.log("Products array:", products);
      console.log("Looking for product with ID:", id);
      
      // Tüm ürünler içinden ilgili ID'ye sahip ürünü bul
      // Bazı tarayıcılar URL parametrelerini string olarak işler, 
      // bu yüzden hem string hem sayı olarak kontrol ediyoruz
      const foundProduct = products.find(p => String(p.id) === String(id));
      
      console.log("Found product:", foundProduct);
      
      if (foundProduct) {
        // Fiyat string'ini parse et ("250₺/gün" formatından)
        const priceString = foundProduct.price;
        // Türkçe karaktere dikkat ederek sadece sayıları al
        const numericPrice = parseInt(priceString.replace(/[^0-9]/g, ''));
        
        // Ürün verilerini işle
        const processedProduct = {
          ...foundProduct,
          priceNumeric: numericPrice, // Sayısal fiyatı ayrıca sakla
          features: [
            `Kategori: ${foundProduct.category}`,
            `Durum: ${foundProduct.condition}`,
            `Konum: ${foundProduct.location}`,
            `Değerlendirme: ${foundProduct.rating}/5`,
            `Değerlendirme Sayısı: ${foundProduct.reviewCount}`
          ]
        };
        
        setProduct(processedProduct);
      } else {
        console.error("Ürün bulunamadı, ID:", id);
        // Ürün bulunamadıysa ana sayfaya yönlendir
        navigate('/products');
      }
    } catch (err) {
      console.error("Ürün detay sayfası yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleFavoriteClick = () => {
    if (!product) return;
    
    setFavorites(prevFavorites => {
      const isFavorite = prevFavorites.includes(product.id);
      if (isFavorite) {
        return prevFavorites.filter(fav => fav !== product.id);
      } else {
        return [...prevFavorites, product.id];
      }
    });
  };

  const isFavorite = () => {
    if (!product) return false;
    return favorites.includes(product.id);
  };

  const durations = [
    { days: 1, label: '1 Gün' },
    { days: 7, label: '7 Gün' },
    { days: 15, label: '15 Gün' },
    { days: 30, label: '30 Gün' },
  ];

  const handleDurationSelect = (days) => {
    setSelectedDuration(days);
  };

  // Ürün yükleniyor veya bulunamadı
  if (loading || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" align="center">
          {loading ? 'Ürün yükleniyor...' : 'Ürün bulunamadı'}
        </Typography>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Sol Taraf - Ürün Görseli */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="400"
              image={product.image}
              alt={product.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=Ürün+Görseli';
              }}
            />
          </Card>
        </Grid>

        {/* Sağ Taraf - Ürün Detayları */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h4" component="h1">
              {product.name}
            </Typography>
            <IconButton
              onClick={handleFavoriteClick}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              {isFavorite() ? (
                <FavoriteIcon sx={{ color: 'red', fontSize: 32 }} />
              ) : (
                <FavoriteBorderIcon sx={{ fontSize: 32 }} />
              )}
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={product.rating} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({product.reviewCount} değerlendirme)
            </Typography>
          </Box>

          <Typography variant="h5" color="primary" gutterBottom>
            {product.price}
          </Typography>

          <Typography variant="body1" paragraph>
            {product.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Özellikler
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            {product.features.map((feature, index) => (
              <Typography component="li" key={index}>
                {feature}
              </Typography>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Konum: {product.location}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Durum: {product.condition}
            </Typography>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Kiralama Süresi
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Lütfen kiralama süresini seçin
            </Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              {durations.map((duration) => (
                <DurationButton
                  key={duration.days}
                  selected={selectedDuration === duration.days}
                  onClick={() => handleDurationSelect(duration.days)}
                >
                  {duration.label}
                </DurationButton>
              ))}
            </Stack>
            <Typography variant="caption" color="text.secondary" display="block">
              Minimum Kiralama: 1 Gün
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Seçilen: {selectedDuration} Gün
            </Typography>
            <Typography variant="h5" color="primary">
              Toplam: {product.priceNumeric * selectedDuration}₺
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            Kirala
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail; 