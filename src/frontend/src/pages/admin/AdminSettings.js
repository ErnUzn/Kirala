import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
} from '@mui/material';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'Kirala',
    siteDescription: 'Fotoğraf ve Video Ekipmanları Kiralama Platformu',
    contactEmail: 'info@kirala.com',
    contactPhone: '+90 555 123 4567',
    maintenanceMode: false,
    darkMode: false,
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setSettings({
      ...settings,
      [name]: e.target.type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API'ye ayarları kaydet
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Site Ayarları
      </Typography>

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Ayarlar başarıyla güncellendi!
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Site Adı"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Site Açıklaması"
              name="siteDescription"
              value={settings.siteDescription}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              İletişim Bilgileri
            </Typography>

            <TextField
              fullWidth
              label="İletişim E-posta"
              name="contactEmail"
              value={settings.contactEmail}
              onChange={handleChange}
              margin="normal"
              type="email"
              required
            />

            <TextField
              fullWidth
              label="İletişim Telefon"
              name="contactPhone"
              value={settings.contactPhone}
              onChange={handleChange}
              margin="normal"
              required
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Sistem Ayarları
            </Typography>

            <FormControlLabel
              control={
                <Switch
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  name="maintenanceMode"
                />
              }
              label="Bakım Modu"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.darkMode}
                  onChange={handleChange}
                  name="darkMode"
                />
              }
              label="Karanlık Mod"
            />

            <Box sx={{ mt: 3 }}>
              <Button type="submit" variant="contained" color="primary">
                Ayarları Kaydet
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminSettings; 