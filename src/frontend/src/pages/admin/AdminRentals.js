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
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const SearchField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'aktif':
      return 'success';
    case 'tamamlandı':
      return 'info';
    case 'iptal edildi':
      return 'error';
    default:
      return 'default';
  }
};

const AdminRentals = () => {
  const [loading, setLoading] = useState(true);
  const [rentals, setRentals] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [formData, setFormData] = useState({
    status: '',
    notes: '',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      // TODO: API çağrısı yapılacak
      // Simüle edilmiş veri
      setRentals([
        {
          id: 1,
          product: 'Profesyonel Kamera',
          user: 'Ahmet Yılmaz',
          startDate: '2024-03-15',
          endDate: '2024-03-20',
          totalPrice: 2500,
          status: 'Aktif',
          notes: '',
        },
        {
          id: 2,
          product: 'Drone',
          user: 'Ayşe Demir',
          startDate: '2024-03-14',
          endDate: '2024-03-18',
          totalPrice: 4000,
          status: 'Aktif',
          notes: '',
        },
        {
          id: 3,
          product: 'GoPro Kamera',
          user: 'Mehmet Kaya',
          startDate: '2024-03-13',
          endDate: '2024-03-17',
          totalPrice: 1200,
          status: 'Tamamlandı',
          notes: 'Ürün başarıyla teslim edildi',
        },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Kiralamalar alınamadı:', error);
      setLoading(false);
    }
  };

  const handleOpenDialog = (rental) => {
    setSelectedRental(rental);
    setFormData({
      status: rental.status,
      notes: rental.notes,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRental(null);
    setFormData({
      status: '',
      notes: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // TODO: API çağrısı yapılacak
      setRentals(
        rentals.map((rental) =>
          rental.id === selectedRental.id
            ? { ...rental, ...formData }
            : rental
        )
      );
      handleCloseDialog();
    } catch (error) {
      console.error('Kiralama güncellenemedi:', error);
    }
  };

  const filteredRentals = rentals.filter(
    (rental) =>
      rental.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.user.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Typography variant="h4">Kiralama Yönetimi</Typography>
      </Box>

      <SearchField
        fullWidth
        variant="outlined"
        placeholder="Kiralama ara..."
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
                  <TableCell>Ürün</TableCell>
                  <TableCell>Kullanıcı</TableCell>
                  <TableCell>Başlangıç</TableCell>
                  <TableCell>Bitiş</TableCell>
                  <TableCell>Toplam Fiyat</TableCell>
                  <TableCell>Durum</TableCell>
                  <TableCell>Notlar</TableCell>
                  <TableCell>İşlemler</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRentals.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell>{rental.product}</TableCell>
                    <TableCell>{rental.user}</TableCell>
                    <TableCell>{rental.startDate}</TableCell>
                    <TableCell>{rental.endDate}</TableCell>
                    <TableCell>{rental.totalPrice} ₺</TableCell>
                    <TableCell>
                      <Chip
                        label={rental.status}
                        color={getStatusColor(rental.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{rental.notes}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(rental)}
                      >
                        <EditIcon />
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
        <DialogTitle>Kiralama Düzenle</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Durum"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              margin="normal"
              required
              select
              SelectProps={{
                native: true,
              }}
            >
              <option value="Aktif">Aktif</option>
              <option value="Tamamlandı">Tamamlandı</option>
              <option value="İptal Edildi">İptal Edildi</option>
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

export default AdminRentals; 