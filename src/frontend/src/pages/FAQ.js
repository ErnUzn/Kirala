import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function FAQ() {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqItems = [
    {
      question: 'Kiralama işlemi nasıl yapılır?',
      answer: 'Kiralama işlemi için öncelikle ürünü seçin, kiralama tarihlerini belirleyin ve "Kirala" butonuna tıklayın. Ardından ödeme bilgilerinizi girerek kiralama işlemini tamamlayabilirsiniz. Kiralama onayı sonrası ürün belirttiğiniz adrese teslim edilecektir.'
    },
    {
      question: 'Ödeme seçenekleri nelerdir?',
      answer: 'Kredi kartı, banka kartı ve havale/EFT ile ödeme yapabilirsiniz. Tüm ödemeler 256-bit SSL şifreleme ile güvenli bir şekilde gerçekleştirilmektedir.'
    },
    {
      question: 'Kiralama süresi ne kadar olabilir?',
      answer: 'Minimum kiralama süresi 1 gün, maksimum kiralama süresi 30 gündür. Özel durumlar için bizimle iletişime geçebilirsiniz.'
    },
    {
      question: 'Ürün teslimi nasıl yapılıyor?',
      answer: 'Ürünler, belirttiğiniz adrese profesyonel ekibimiz tarafından teslim edilir. Teslimat sırasında ürün kontrolü yapabilir ve herhangi bir sorun varsa bildirebilirsiniz.'
    },
    {
      question: 'İade işlemi nasıl yapılır?',
      answer: 'Kiralama süresi sonunda ürünü belirtilen adresten alıyoruz. Ürün hasarlı veya eksik parçalı ise, hasar bedeli tahsil edilir. Normal kullanımdan kaynaklanan aşınmalar için ücret alınmaz.'
    },
    {
      question: 'Ürünler sigortalı mı?',
      answer: 'Evet, tüm kiralama ürünlerimiz sigortalıdır. Kaza, hırsızlık gibi durumlar sigorta kapsamındadır. Detaylı bilgi için bizimle iletişime geçebilirsiniz.'
    },
    {
      question: 'Kampanya ve indirimlerden nasıl haberdar olabilirim?',
      answer: 'Web sitemize üye olarak veya sosyal medya hesaplarımızı takip ederek kampanya ve indirimlerden haberdar olabilirsiniz.'
    },
    {
      question: 'Teknik destek alabilir miyim?',
      answer: 'Evet, 7/24 teknik destek hizmetimiz mevcuttur. Ürün kullanımı ile ilgili sorularınız için bize ulaşabilirsiniz.'
    }
  ];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Sık Sorulan Sorular
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" align="center" sx={{ mb: 4 }}>
        Kiralama sürecinizle ilgili merak ettiğiniz tüm soruların cevapları
      </Typography>

      <Box sx={{ mt: 4 }}>
        {faqItems.map((item, index) => (
          <React.Fragment key={index}>
            <Accordion
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{
                mb: 2,
                '&:before': {
                  display: 'none',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}bh-content`}
                id={`panel${index}bh-header`}
              >
                <Typography variant="h6">
                  {item.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography color="text.secondary">
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
            {index < faqItems.length - 1 && <Divider sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </Box>
    </Container>
  );
}

export default FAQ; 