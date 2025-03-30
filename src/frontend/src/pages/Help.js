import React from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Help() {
  const faqs = [
    {
      question: 'Nasıl ürün kiralayabilirim?',
      answer: 'Ürün kiralama işlemi için önce ürünü sepetinize ekleyin, ardından ödeme işlemini tamamlayın. Kiralama süresini ve başlangıç tarihini belirleyebilirsiniz.',
    },
    {
      question: 'Ödeme yöntemleri nelerdir?',
      answer: 'Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Tüm ödemeler SSL sertifikası ile güvenli bir şekilde gerçekleştirilmektedir.',
    },
    {
      question: 'Kiralama süresi ne kadar olabilir?',
      answer: 'Kiralama süresi ürüne göre değişiklik gösterebilir. Genellikle minimum 1 gün, maksimum 30 gün olarak belirlenmiştir.',
    },
    {
      question: 'Ürün teslimi nasıl yapılıyor?',
      answer: 'Ürünler belirlediğiniz adrese kargo ile teslim edilir. Teslim tarihi ve saati siparişinizde belirtilir.',
    },
    {
      question: 'İade işlemi nasıl yapılır?',
      answer: 'İade işlemi için müşteri hizmetlerimizle iletişime geçebilirsiniz. Ürünün durumuna göre iade işlemi gerçekleştirilir.',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Yardım Merkezi
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Sıkça Sorulan Sorular
          </Typography>
          {faqs.map((faq, index) => (
            <Accordion key={index}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{faq.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Bize Ulaşın
              </Typography>
              <Box component="form" sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Adınız"
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="E-posta"
                  margin="normal"
                  required
                  type="email"
                />
                <TextField
                  fullWidth
                  label="Mesajınız"
                  margin="normal"
                  required
                  multiline
                  rows={4}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  Gönder
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Help; 