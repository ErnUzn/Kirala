import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';

const AdminOrders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    notes: '',
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Simüle edilmiş sipariş verileri
      const mockOrders = [
        {
          id: 'ORD001',
          date: '2024-03-28',
          user: 'Ahmet Yılmaz',
          status: 'Tamamlandı',
          total: 1500,
          items: [
            {
              name: 'Profesyonel Kamera',
              days: 3,
              price: 500,
            },
          ],
          notes: 'Teslimat başarılı',
        },
        {
          id: 'ORD002',
          date: '2024-03-25',
          user: 'Ayşe Demir',
          status: 'Devam Ediyor',
          total: 600,
          items: [
            {
              name: 'Drone',
              days: 2,
              price: 300,
            },
          ],
          notes: 'Kiralama süresi devam ediyor',
        },
        {
          id: 'ORD003',
          date: '2024-03-20',
          user: 'Mehmet Kaya',
          status: 'İptal Edildi',
          total: 800,
          items: [
            {
              name: 'Ses Sistemi',
              days: 4,
              price: 200,
            },
          ],
          notes: 'Müşteri talebi ile iptal edildi',
        },
      ];
      
      setOrders(mockOrders);
      setLoading(false);
    } catch (error) {
      console.error('Siparişler alınamadı:', error);
      setLoading(false);
    }
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setFormData({
      status: order.status,
      notes: order.notes,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
    setFormData({
      status: '',
      notes: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedOrders = orders.map((order) =>
        order.id === selectedOrder.id
          ? { ...order, status: formData.status, notes: formData.notes }
          : order
      );
      setOrders(updatedOrders);
      handleCloseDialog();
    } catch (error) {
      console.error('Sipariş güncellenemedi:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Tamamlandı':
        return 'success';
      case 'Devam Ediyor':
        return 'primary';
      case 'İptal Edildi':
        return 'error';
      default:
        return 'default';
    }
  };

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
        <Typography variant="h4">Sipariş Yönetimi</Typography>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sipariş No</TableCell>
                  <TableCell>Tarih</TableCell>
                  <TableCell>Kullanıcı</TableCell>
                  <TableCell>Toplam</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Notlar</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.user}</TableCell>
                    <TableCell>{order.total} ₺</TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{order.notes}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(order)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton color="info">
                        <VisibilityIcon />
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
        <DialogTitle>Sipariş Düzenle</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              select
              fullWidth
              label="Durum"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              margin="normal"
              required
            >
              <MenuItem value="Tamamlandı">Tamamlandı</MenuItem>
              <MenuItem value="Devam Ediyor">Devam Ediyor</MenuItem>
              <MenuItem value="İptal Edildi">İptal Edildi</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Notlar"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              margin="normal"
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>İptal</Button>
            <Button type="submit" variant="contained" color="primary">
              Güncelle
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default AdminOrders; 