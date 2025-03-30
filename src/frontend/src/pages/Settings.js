import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
} from '@mui/material';

function Settings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newsletter: true,
    language: 'tr',
    theme: 'light',
  });

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setSettings(prev => ({
      ...prev,
      [name]: value !== undefined ? value : checked,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Burada ayarları kaydetme işlemi yapılacak
    console.log('Ayarlar kaydedildi:', settings);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Ayarlar
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Hesap Ayarları
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Ad Soyad"
                      defaultValue="Ahmet Yılmaz"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="E-posta"
                      defaultValue="ahmet@example.com"
                      type="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Telefon"
                      defaultValue="555-123-4567"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Adres"
                      defaultValue="İstanbul, Türkiye"
                      multiline
                      rows={3}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Bildirim Ayarları
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.emailNotifications}
                          onChange={handleChange}
                          name="emailNotifications"
                        />
                      }
                      label="E-posta Bildirimleri"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.smsNotifications}
                          onChange={handleChange}
                          name="smsNotifications"
                        />
                      }
                      label="SMS Bildirimleri"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.newsletter}
                          onChange={handleChange}
                          name="newsletter"
                        />
                      }
                      label="Bülten Aboneliği"
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Görünüm Ayarları
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Dil"
                      value={settings.language}
                      onChange={handleChange}
                      name="language"
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="tr">Türkçe</option>
                      <option value="en">English</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Tema"
                      value={settings.theme}
                      onChange={handleChange}
                      name="theme"
                      SelectProps={{
                        native: true,
                      }}
                    >
                      <option value="light">Açık</option>
                      <option value="dark">Koyu</option>
                    </TextField>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Kaydet
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Güvenlik
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mb: 2 }}
              >
                Şifre Değiştir
              </Button>
              <Button
                variant="outlined"
                color="error"
                fullWidth
              >
                Hesabı Sil
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Settings; 