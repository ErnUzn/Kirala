import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DatePicker,
  Chip,
  LinearProgress,
} from '@mui/material';
import { getReports } from '../../services/adminService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  People,
  Inventory,
  AttachMoney,
  ShoppingCart,
} from '@mui/icons-material';

const AdminReports = () => {
  const [dateRange, setDateRange] = useState('thisMonth');
  const [reportType, setReportType] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    loadReportData();
  }, [dateRange, reportType]);

  const loadReportData = async () => {
    setLoading(true);
    try {
      const data = await getReports();
      setMonthlyData(data.monthlyData || []);
      setCategoryData(data.categoryData || []);
      setTopProducts(data.topProducts || []);
    } catch (error) {
      console.error('Rapor verileri yüklenemedi:', error);
      // Fallback to mock data
      setMonthlyData([
        { month: 'Ocak', kiralamalar: 65, gelir: 12500 },
        { month: 'Şubat', kiralamalar: 75, gelir: 15200 },
        { month: 'Mart', kiralamalar: 85, gelir: 18700 },
        { month: 'Nisan', kiralamalar: 95, gelir: 22100 },
        { month: 'Mayıs', kiralamalar: 78, gelir: 19800 },
        { month: 'Haziran', kiralamalar: 88, gelir: 24300 },
      ]);
      setCategoryData([
        { name: 'Elektronik', value: 35, count: 125 },
        { name: 'Ev Aletleri', value: 25, count: 89 },
        { name: 'Spor', value: 20, count: 67 },
        { name: 'Kıyafet', value: 15, count: 54 },
        { name: 'Diğer', value: 5, count: 18 },
      ]);
      setTopProducts([
        { name: 'iPhone 13 Pro', kiralamalar: 23, gelir: '₺4,500' },
        { name: 'PlayStation 5', kiralamalar: 18, gelir: '₺3,200' },
        { name: 'MacBook Pro', kiralamalar: 15, gelir: '₺5,800' },
        { name: 'Dyson V11', kiralamalar: 12, gelir: '₺2,100' },
        { name: 'Canon EOS R5', kiralamalar: 10, gelir: '₺3,900' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for stats cards
  const statsCards = [
    {
      title: 'Toplam Gelir',
      value: '₺45,230',
      change: '+12.5%',
      trend: 'up',
      icon: <AttachMoney />,
      color: '#4caf50',
    },
    {
      title: 'Aktif Kullanıcılar',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: <People />,
      color: '#2196f3',
    },
    {
      title: 'Toplam Ürün',
      value: '567',
      change: '-2.1%',
      trend: 'down',
      icon: <Inventory />,
      color: '#ff9800',
    },
    {
      title: 'Başarılı Kiralamalar',
      value: '89',
      change: '+15.3%',
      trend: 'up',
      icon: <ShoppingCart />,
      color: '#9c27b0',
    },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Raporlar ve Analitik
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Tarih Aralığı</InputLabel>
            <Select
              value={dateRange}
              label="Tarih Aralığı"
              onChange={(e) => setDateRange(e.target.value)}
            >
              <MenuItem value="thisWeek">Bu Hafta</MenuItem>
              <MenuItem value="thisMonth">Bu Ay</MenuItem>
              <MenuItem value="lastMonth">Geçen Ay</MenuItem>
              <MenuItem value="thisYear">Bu Yıl</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Rapor Tipi</InputLabel>
            <Select
              value={reportType}
              label="Rapor Tipi"
              onChange={(e) => setReportType(e.target.value)}
            >
              <MenuItem value="overview">Genel Bakış</MenuItem>
              <MenuItem value="sales">Satış</MenuItem>
              <MenuItem value="users">Kullanıcılar</MenuItem>
              <MenuItem value="products">Ürünler</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: `${stat.color}20`,
                      color: stat.color,
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" component="div">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {stat.trend === 'up' ? (
                    <TrendingUp sx={{ color: '#4caf50', mr: 0.5 }} />
                  ) : (
                    <TrendingDown sx={{ color: '#f44336', mr: 0.5 }} />
                  )}
                  <Typography
                    variant="body2"
                    sx={{ color: stat.trend === 'up' ? '#4caf50' : '#f44336' }}
                  >
                    {stat.change}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    geçen aya göre
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Monthly Trend */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Aylık Kiralama Trendi
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="kiralamalar" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="gelir" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Category Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Kategori Dağılımı
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Top Products Table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          En Çok Kiralanan Ürünler
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ürün Adı</TableCell>
                <TableCell align="right">Kiralama Sayısı</TableCell>
                <TableCell align="right">Toplam Gelir</TableCell>
                <TableCell align="center">Durum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {product.name}
                  </TableCell>
                  <TableCell align="right">{product.kiralamalar}</TableCell>
                  <TableCell align="right">{product.gelir}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={index < 3 ? 'Popüler' : 'Normal'}
                      color={index < 3 ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AdminReports; 