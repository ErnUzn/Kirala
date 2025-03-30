import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const StatCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const StatIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 48,
  height: 48,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  marginBottom: theme.spacing(2),
}));

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalUsers: 0,
    totalProducts: 0,
    activeRentals: 0,
  });
  const [recentRentals, setRecentRentals] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // TODO: API çağrısı yapılacak
      // Simüle edilmiş veri
      setStats({
        totalRevenue: 25000,
        totalUsers: 150,
        totalProducts: 75,
        activeRentals: 45,
      });

      setRecentRentals([
        {
          id: 1,
          product: 'Profesyonel Kamera',
          user: 'Ahmet Yılmaz',
          startDate: '2024-03-15',
          endDate: '2024-03-20',
          status: 'Aktif',
        },
        {
          id: 2,
          product: 'Drone',
          user: 'Ayşe Demir',
          startDate: '2024-03-14',
          endDate: '2024-03-18',
          status: 'Aktif',
        },
        {
          id: 3,
          product: 'GoPro Kamera',
          user: 'Mehmet Kaya',
          startDate: '2024-03-13',
          endDate: '2024-03-17',
          status: 'Tamamlandı',
        },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Dashboard verisi alınamadı:', error);
      setLoading(false);
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
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <StatIcon>
                <TrendingUpIcon />
              </StatIcon>
              <Typography variant="h4" component="div">
                {stats.totalRevenue.toLocaleString('tr-TR')} ₺
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Toplam Gelir
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <StatIcon>
                <PeopleIcon />
              </StatIcon>
              <Typography variant="h4" component="div">
                {stats.totalUsers}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Toplam Kullanıcı
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <StatIcon>
                <InventoryIcon />
              </StatIcon>
              <Typography variant="h4" component="div">
                {stats.totalProducts}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Toplam Ürün
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard>
            <CardContent>
              <StatIcon>
                <LocalShippingIcon />
              </StatIcon>
              <Typography variant="h4" component="div">
                {stats.activeRentals}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                Aktif Kiralama
              </Typography>
            </CardContent>
          </StatCard>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Son Kiralamalar
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ürün</TableCell>
                  <TableCell>Kullanıcı</TableCell>
                  <TableCell>Başlangıç</TableCell>
                  <TableCell>Bitiş</TableCell>
                  <TableCell>Durum</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentRentals.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell>{rental.product}</TableCell>
                    <TableCell>{rental.user}</TableCell>
                    <TableCell>{rental.startDate}</TableCell>
                    <TableCell>{rental.endDate}</TableCell>
                    <TableCell>{rental.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard; 