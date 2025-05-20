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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Edit,
  Save,
  Cancel,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
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

    setUser(JSON.parse(storedUser));
    setEditData(JSON.parse(storedUser));
    setLoading(false);
  }, [navigate]);

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

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('/api/auth/profile', editData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setEditMode(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
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
                Profili Düzenle
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}

export default Profile; 