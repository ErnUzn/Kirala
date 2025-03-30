import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

function Orders() {
  // Örnek sipariş verileri
  const orders = [
    {
      id: 'ORD001',
      date: '2024-03-28',
      status: 'Tamamlandı',
      total: 1500,
      items: [
        {
          name: 'Profesyonel Kamera',
          days: 3,
          price: 500,
        },
      ],
    },
    {
      id: 'ORD002',
      date: '2024-03-25',
      status: 'Devam Ediyor',
      total: 600,
      items: [
        {
          name: 'Drone',
          days: 2,
          price: 300,
        },
      ],
    },
  ];

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

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Siparişlerim
      </Typography>

      {orders.map((order) => (
        <Card key={order.id} sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Sipariş #{order.id}
                </Typography>
                <Typography color="textSecondary">
                  Tarih: {order.date}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
                <Chip
                  label={order.status}
                  color={getStatusColor(order.status)}
                  sx={{ mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Toplam: {order.total} TL
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  size="small"
                >
                  Detayları Gör
                </Button>
              </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Ürün</TableCell>
                    <TableCell align="right">Kiralama Süresi</TableCell>
                    <TableCell align="right">Günlük Fiyat</TableCell>
                    <TableCell align="right">Toplam</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell align="right">{item.days} gün</TableCell>
                      <TableCell align="right">{item.price} TL</TableCell>
                      <TableCell align="right">
                        {item.days * item.price} TL
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default Orders; 