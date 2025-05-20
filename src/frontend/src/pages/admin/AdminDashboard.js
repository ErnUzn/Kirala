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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  Timeline as TimelineIcon,
  Category as CategoryIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

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

      // Gelir grafiği verisi
      setRevenueData([
        { name: 'Ocak', gelir: 4000 },
        { name: 'Şubat', gelir: 3000 },
        { name: 'Mart', gelir: 5000 },
        { name: 'Nisan', gelir: 2780 },
        { name: 'Mayıs', gelir: 1890 },
        { name: 'Haziran', gelir: 2390 },
      ]);

      // Kategori dağılımı
      setCategoryData([
        { name: 'Fotoğraf', value: 35 },
        { name: 'Video', value: 25 },
        { name: 'Ses', value: 15 },
        { name: 'Işık', value: 10 },
        { name: 'Kamp', value: 10 },
        { name: 'Telefon', value: 5 },
      ]);

      // Son aktiviteler
      setRecentActivities([
        { id: 1, text: 'Yeni ürün eklendi: Profesyonel Kamera', time: '2 saat önce' },
        { id: 2, text: 'Kullanıcı kaydı: Mehmet Yılmaz', time: '3 saat önce' },
        { id: 3, text: 'Kiralama tamamlandı: Drone', time: '5 saat önce' },
        { id: 4, text: 'Yeni ödeme alındı: 1500₺', time: '1 gün önce' },
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Dashboard verisi alınamadı:', error);
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

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

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Aylık Gelir Grafiği
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="gelir" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Kategori Dağılımı
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
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
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Son Aktiviteler
              </Typography>
              <List>
                {recentActivities.map((activity) => (
                  <React.Fragment key={activity.id}>
                    <ListItem>
                      <ListItemIcon>
                        <AccessTimeIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={activity.text}
                        secondary={activity.time}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard; 