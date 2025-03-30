import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
  Divider,
} from '@mui/material';
import {
  Phone,
  Email,
  LocationOn,
  Business,
  EmojiEvents,
  Lightbulb,
} from '@mui/icons-material';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Burada form gönderme işlemi yapılacak
    setSubmitStatus('success');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hakkımızda Bölümü */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Hakkımızda
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Business sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Biz Kimiz?
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                KİRALA olarak, profesyonel ekipman kiralama sektöründe 5 yılı aşkın süredir hizmet veriyoruz. 
                Müşterilerimize en kaliteli ekipmanları en uygun fiyatlarla sunmayı hedefliyoruz.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <EmojiEvents sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Misyonumuz
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Profesyonel ekipman kiralama sektöründe güvenilir ve kaliteli hizmet sunarak, 
                müşterilerimizin projelerini en iyi şekilde gerçekleştirmelerine yardımcı olmak.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Lightbulb sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Vizyonumuz
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center">
                Türkiye'nin en büyük ve en güvenilir profesyonel ekipman kiralama platformu olmak 
                ve sektörde standartları belirleyen bir marka haline gelmek.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* İletişim Formu */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              İletişim Bilgileri
            </Typography>
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 2, color: 'primary.main' }} />
                <Typography>
                  Örnek Mahallesi, Test Sokak No:123
                  <br />
                  Kadıköy/İstanbul
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Phone sx={{ mr: 2, color: 'primary.main' }} />
                <Typography>
                  +90 (555) 123 45 67
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Email sx={{ mr: 2, color: 'primary.main' }} />
                <Typography>
                  info@kirala.com
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Bize Ulaşın
            </Typography>
            {submitStatus === 'success' && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Ad Soyad"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="E-posta"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Konu"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Mesaj"
                    name="message"
                    multiline
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                  >
                    Gönder
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Contact; 