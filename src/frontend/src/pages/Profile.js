import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  TextField,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Edit,
  Save,
  Cancel,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  LocationOn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getMyProducts, deleteProduct } from '../services/productService';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [myProducts, setMyProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    setEditData(userData);
    setLoading(false);
    
    // Kullanıcının ürünlerini yükle - tutarlı ID formatı kullan
    const userId = (userData._id || userData.id || `user_${userData.email || Date.now()}`).toString();
    console.log('Profile sayfasında kullanılacak userId:', userId);
    loadMyProducts(userId);
  }, [navigate]);

  const loadMyProducts = async (userId) => {
    setProductsLoading(true);
    try {
      const products = await getMyProducts(userId);
      setMyProducts(products);
    } catch (error) {
      console.error('Ürünler yüklenirken hata:', error);
      setError('Ürünler yüklenirken bir hata oluştu');
    } finally {
      setProductsLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditData(user);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Geçici olarak localStorage'a kaydet
    const updatedUser = { ...user, ...editData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setEditMode(false);
    setSuccess('Profil bilgileri güncellendi');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete._id);
      setMyProducts(prev => prev.filter(p => p._id !== productToDelete._id));
      setSuccess('Ürün başarıyla silindi');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Ürün silme hatası:', error);
      setError('Ürün silinirken bir hata oluştu');
      setTimeout(() => setError(''), 3000);
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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

      <Paper elevation={3} sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs">
            <Tab label="Profil Bilgileri" />
            <Tab label="Ürünlerim" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: 'primary.main',
                fontSize: '3rem',
              }}
            >
              {user.firstName.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ ml: 3 }}>
              <Typography variant="h4" gutterBottom>
                {fullName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Üye
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {editMode ? (
            <Box component="form" sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Ad"
                    name="firstName"
                    value={editData.firstName}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Soyad"
                    name="lastName"
                    value={editData.lastName}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="E-posta"
                    name="email"
                    value={editData.email}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Telefon"
                    name="phone"
                    value={editData.phone || ''}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={handleCancel}
                >
                  İptal
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                  onClick={handleSave}
                >
                  Kaydet
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <ListItemText
                    primary="Ad Soyad"
                    secondary={fullName}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText
                    primary="E-posta"
                    secondary={user.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText
                    primary="Telefon"
                    secondary={user.phone || 'Belirtilmemiş'}
                  />
                </ListItem>
              </List>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={handleEdit}
                >
                  Düzenle
                </Button>
              </Box>
            </>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5">
              Ürünlerim ({myProducts.length})
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/add-product')}
            >
              Yeni Ürün Ekle
            </Button>
          </Box>

          {productsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : myProducts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Henüz ürün eklememişsiniz
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                İlk ürününüzü ekleyerek kiralama işlemine başlayın
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate('/add-product')}
              >
                İlk Ürünümü Ekle
              </Button>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {myProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.images?.[0] || 'https://via.placeholder.com/300x200?text=Ürün+Görseli'}
                      alt={product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom noWrap>
                        {product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {product.description?.substring(0, 100)}...
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOn fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                          {product.location}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Chip label={product.category} size="small" />
                        <Typography variant="h6" color="primary">
                          ₺{product.dailyPrice}/gün
                        </Typography>
                      </Box>
                      <Chip 
                        label={product.condition === 'new' ? 'Yeni' : 
                              product.condition === 'like-new' ? 'Sıfır Gibi' :
                              product.condition === 'good' ? 'İyi' : 'Orta'} 
                        size="small" 
                        color="success" 
                      />
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewProduct(product._id)}
                      >
                        Görüntüle
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(product)}
                      >
                        Sil
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Ürünü Sil</DialogTitle>
        <DialogContent>
          <Typography>
            "{productToDelete?.name}" adlı ürünü silmek istediğinizden emin misiniz?
            Bu işlem geri alınamaz.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>İptal</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Profile; 