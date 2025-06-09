import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  CircularProgress,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getAllUsers, updateUserStatus, deleteUser } from '../../services/adminService';

const SearchField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const AdminUsers = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Kullanıcılar alınamadı:', error);
      setError('Kullanıcılar yüklenirken bir hata oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone || '',
        role: user.role,
        status: user.isActive,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        status: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'user',
      status: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedUser) {
        // Kullanıcı güncelleme - şu anda sadece status güncelleyebiliyoruz
        await updateUserStatus(selectedUser._id, formData.status);
        await fetchUsers(); // Güncel verileri yeniden çek
      } else {
        // Yeni kullanıcı ekleme - bu endpoint henüz yok
        console.log('Yeni kullanıcı ekleme özelliği henüz eklenmedi');
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Kullanıcı kaydedilemedi:', error);
      setError('Kullanıcı güncellenirken bir hata oluştu: ' + error.message);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteUser(userId);
        await fetchUsers(); // Güncel verileri yeniden çek
      } catch (error) {
        console.error('Kullanıcı silinemedi:', error);
        setError('Kullanıcı silinirken bir hata oluştu: ' + error.message);
      }
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus);
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isActive: newStatus } : user
        )
      );
    } catch (error) {
      console.error('Kullanıcı durumu güncellenemedi:', error);
      setError('Kullanıcı durumu güncellenirken bir hata oluştu: ' + error.message);
    }
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || user.email.toLowerCase().includes(query);
  });

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Kullanıcı Yönetimi
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <SearchField
              label="Kullanıcı Ara"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: <SearchIcon />,
              }}
              sx={{ width: 300 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Yeni Kullanıcı
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ad Soyad</TableCell>
                  <TableCell>E-posta</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Üyelik Tarihi</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                        color={user.role === 'admin' ? 'secondary' : 'primary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={user.isActive}
                            onChange={(e) =>
                              handleStatusChange(user._id, e.target.checked)
                            }
                            color="primary"
                          />
                        }
                        label={user.isActive ? 'Aktif' : 'Pasif'}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenDialog(user)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(user._id)}
                        color="error"
                        disabled={user.role === 'admin'}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {filteredUsers.length === 0 && !loading && (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="textSecondary">
                {searchQuery ? 'Arama kriterlerine uygun kullanıcı bulunamadı' : 'Henüz kullanıcı bulunmamaktadır'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Kullanıcı Ekleme/Düzenleme Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Ad Soyad"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              margin="normal"
              required
              disabled={selectedUser} // Mevcut kullanıcılar için ad değiştirme kapalı
            />
            <TextField
              fullWidth
              label="E-posta"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              margin="normal"
              required
              disabled={selectedUser} // Mevcut kullanıcılar için email değiştirme kapalı
            />
            <TextField
              fullWidth
              label="Telefon"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              margin="normal"
              disabled={selectedUser} // Mevcut kullanıcılar için telefon değiştirme kapalı
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.checked })
                  }
                  color="primary"
                />
              }
              label="Aktif"
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>İptal</Button>
            <Button type="submit" variant="contained">
              {selectedUser ? 'Güncelle' : 'Ekle'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminUsers; 