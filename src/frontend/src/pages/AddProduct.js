import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../services/productService';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    dailyPrice: '',
    weeklyPrice: '',
    monthlyPrice: '',
    condition: '',
    location: '',
    images: [''],
    features: ['']
  });

  const categories = [
    'Electronics',
    'Sports',
    'Camping',
    'Music',
    'Gaming',
    'Transportation',
    'Home & Garden',
    'Fashion',
    'Books',
    'Other'
  ];

  const conditions = [
    { value: 'new', label: 'Yeni' },
    { value: 'like-new', label: 'Sıfır Gibi' },
    { value: 'good', label: 'İyi' },
    { value: 'fair', label: 'Orta' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        images: newImages
      }));
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const addFeatureField = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeatureField = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        features: newFeatures
      }));
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Ürün adı gereklidir');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Ürün açıklaması gereklidir');
      return false;
    }
    if (!formData.category) {
      setError('Kategori seçimi gereklidir');
      return false;
    }
    if (!formData.dailyPrice || formData.dailyPrice <= 0) {
      setError('Geçerli bir günlük fiyat giriniz');
      return false;
    }
    if (!formData.condition) {
      setError('Ürün durumu seçimi gereklidir');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Konum bilgisi gereklidir');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Boş alanları filtrele
      const cleanedImages = formData.images.filter(img => img.trim() !== '');
      const cleanedFeatures = formData.features.filter(feature => feature.trim() !== '');

      // Kullanıcı bilgisini localStorage'dan al
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = currentUser._id || currentUser.id || `user_${currentUser.email || Date.now()}`;

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: parseFloat(formData.dailyPrice), // Geriye uyumluluk için
        dailyPrice: parseFloat(formData.dailyPrice),
        weeklyPrice: formData.weeklyPrice ? parseFloat(formData.weeklyPrice) : parseFloat(formData.dailyPrice) * 6,
        monthlyPrice: formData.monthlyPrice ? parseFloat(formData.monthlyPrice) : parseFloat(formData.dailyPrice) * 25,
        condition: formData.condition,
        location: formData.location.trim(),
        images: cleanedImages.length > 0 ? cleanedImages : ['https://via.placeholder.com/300x200?text=Ürün+Görseli'],
        features: cleanedFeatures,
        ownerInfo: {
          userId: userId,
          userName: `${currentUser.firstName || 'Kullanıcı'} ${currentUser.lastName || ''}`.trim(),
          userEmail: currentUser.email || ''
        }
      };

      const result = await createProduct(productData);
      console.log('Ürün başarıyla eklendi:', result);
      
      setSuccess('Ürün başarıyla eklendi! Yönlendiriliyorsunuz...');
      
      // 2 saniye sonra ürünler sayfasına yönlendir
      setTimeout(() => {
        navigate('/products');
      }, 2000);

    } catch (err) {
      console.error('Ürün ekleme hatası:', err);
      setError(err.message || 'Ürün eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Yeni Ürün Ekle
        </Typography>
        
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 4 }}>
          Kiralamak istediğiniz ürünü ekleyin ve diğer kullanıcılarla paylaşın
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Ürün Adı */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ürün Adı"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Örn: Canon EOS 5D Mark IV"
              />
            </Grid>

            {/* Açıklama */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ürün Açıklaması"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                multiline
                rows={4}
                placeholder="Ürününüzün detaylı açıklamasını yazın..."
              />
            </Grid>

            {/* Kategori ve Durum */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Kategori</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  label="Kategori"
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Ürün Durumu</InputLabel>
                <Select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  label="Ürün Durumu"
                >
                  {conditions.map((condition) => (
                    <MenuItem key={condition.value} value={condition.value}>
                      {condition.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Fiyatlar */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Günlük Fiyat"
                name="dailyPrice"
                type="number"
                value={formData.dailyPrice}
                onChange={handleInputChange}
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Haftalık Fiyat (Opsiyonel)"
                name="weeklyPrice"
                type="number"
                value={formData.weeklyPrice}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
                helperText="Boş bırakılırsa otomatik hesaplanır"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Aylık Fiyat (Opsiyonel)"
                name="monthlyPrice"
                type="number"
                value={formData.monthlyPrice}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₺</InputAdornment>,
                }}
                inputProps={{ min: 0, step: 0.01 }}
                helperText="Boş bırakılırsa otomatik hesaplanır"
              />
            </Grid>

            {/* Konum */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Konum"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="Örn: İstanbul, Kadıköy"
              />
            </Grid>

            {/* Ürün Görselleri */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Ürün Görselleri
              </Typography>
              {formData.images.map((image, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    fullWidth
                    label={`Görsel URL ${index + 1}`}
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    sx={{ mr: 1 }}
                  />
                  {formData.images.length > 1 && (
                    <Button
                      color="error"
                      onClick={() => removeImageField(index)}
                      sx={{ minWidth: 'auto', p: 1 }}
                    >
                      <DeleteIcon />
                    </Button>
                  )}
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={addImageField}
                variant="outlined"
                size="small"
              >
                Görsel Ekle
              </Button>
            </Grid>

            {/* Özellikler */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Ürün Özellikleri
              </Typography>
              {formData.features.map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    fullWidth
                    label={`Özellik ${index + 1}`}
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Örn: 4K video kayıt özelliği"
                    sx={{ mr: 1 }}
                  />
                  {formData.features.length > 1 && (
                    <Button
                      color="error"
                      onClick={() => removeFeatureField(index)}
                      sx={{ minWidth: 'auto', p: 1 }}
                    >
                      <DeleteIcon />
                    </Button>
                  )}
                </Box>
              ))}
              <Button
                startIcon={<AddIcon />}
                onClick={addFeatureField}
                variant="outlined"
                size="small"
              >
                Özellik Ekle
              </Button>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/products')}
                  disabled={loading}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                  sx={{ minWidth: 150 }}
                >
                  {loading ? 'Ekleniyor...' : 'Ürün Ekle'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddProduct; 