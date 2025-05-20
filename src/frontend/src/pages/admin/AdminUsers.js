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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Tutarlı kullanıcı verileri
      const adminUsers = [
        {
          id: 1,
          name: 'Ahmet Yılmaz',
          email: 'ahmet@example.com',
          phone: '5551234567',
          role: 'user',
          joinDate: '2023-01-15',
        },
        {
          id: 2,
          name: 'Ayşe Demir',
          email: 'ayse@example.com',
          phone: '5552345678',
          role: 'user',
          joinDate: '2023-02-20',
        },
        {
          id: 3,
          name: 'Mehmet Kaya',
          email: 'mehmet@example.com',
          phone: '5553456789',
          role: 'user',
          joinDate: '2023-03-10',
        },
        {
          id: 4,
          name: 'Zeynep Şahin',
          email: 'zeynep@example.com',
          phone: '5554567890',
          role: 'user',
          joinDate: '2023-04-05',
        },
        {
          id: 5,
          name: 'Admin User',
          email: 'admin@example.com',
          phone: '5555678901',
          role: 'admin',
          joinDate: '2023-01-01',
        }
      ];
      
      setUsers(adminUsers);
      setLoading(false);
    } catch (error) {
      console.error('Kullanıcılar alınamadı:', error);
      setLoading(false);
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData(user);
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
      // TODO: API çağrısı yapılacak
      if (selectedUser) {
        // Kullanıcı güncelleme
        setUsers(
          users.map((user) =>
            user.id === selectedUser.id ? formData : user
          )
        );
      } else {
        // Yeni kullanıcı ekleme
        setUsers([
          ...users,
          {
            id: users.length + 1,
            ...formData,
            joinDate: new Date().toISOString().split('T')[0],
          },
        ]);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Kullanıcı kaydedilemedi:', error);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Bu kullanıcıyı silmek istediğinizden emin misiniz?')) {
      try {
        // TODO: API çağrısı yapılacak
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.error('Kullanıcı silinemedi:', error);
      }
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      // TODO: API çağrısı yapılacak
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error('Kullanıcı durumu güncellenemedi:', error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Kullanıcı Yönetimi</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Yeni Kullanıcı
        </Button>
      </Box>

      <SearchField
        fullWidth
        variant="outlined"
        placeholder="Kullanıcı ara..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
        }}
      />

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ad Soyad</TableCell>
                  <TableCell>E-posta</TableCell>
                  <TableCell>Telefon</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Kayıt Tarihi</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={user.status}
                            onChange={(e) =>
                              handleStatusChange(user.id, e.target.checked)
                            }
                          />
                        }
                      />
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(user)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

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
            />
            <TextField
              fullWidth
              label="Telefon"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Rol"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              margin="normal"
              required
              select
              SelectProps={{
                native: true,
              }}
            >
              <option value="user">Kullanıcı</option>
              <option value="admin">Admin</option>
            </TextField>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.checked })
                  }
                />
              }
              label="Aktif"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>İptal</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedUser ? 'Güncelle' : 'Ekle'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminUsers; 