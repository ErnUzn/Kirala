/**
 * Kirala - Ana Sunucu Dosyası
 * 
 * Bu dosya, Express sunucusunu başlatır ve gerekli yapılandırmaları yapar.
 */

// Çevre değişkenlerini yükle
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('express-async-errors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');

// Load env vars
dotenv.config();

// Uygulama oluştur
const app = express();

// Güvenlik ve ara yazılımları yapılandır
app.use(helmet()); // Güvenlik başlıkları
app.use(cors());
app.use(morgan('dev')); // İstek logları
app.use(express.json()); // JSON ayrıştırma
app.use(express.urlencoded({ extended: true })); // URL-encoded ayrıştırma

// Statik dosyalar için klasör
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Sağlık kontrolü endpoint'i
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// API endpoint'lerini tanımla
app.use('/api/auth', authRoutes);

// 404 hatası için middleware
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Bu endpoint bulunamadı: ${req.method} ${req.url}`
  });
});

// Hata işleme middleware'i
app.use((err, req, res, next) => {
  console.error(err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'İç Sunucu Hatası';
  
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : err.name || 'Error',
    message: process.env.NODE_ENV === 'production' && statusCode === 500 
      ? 'Bir hata oluştu, lütfen daha sonra tekrar deneyin' 
      : message
  });
});

// Veritabanı bağlantısı ve tablo senkronizasyonu
sequelize.sync()
  .then(() => console.log('Database connected and tables synced'))
  .catch(err => console.log('Database connection error:', err));

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// İşlem sonlandırma olaylarını dinle
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

// Sunucuyu düzgün bir şekilde kapatma işlevi
function shutDown() {
  console.log('Sunucu kapatılıyor...');
  // Veritabanı bağlantılarını temizle
  try {
    const db = require('./database/db');
    db.closePool();
  } catch (err) {
    console.error('Veritabanı bağlantısı kapatılırken hata:', err);
  }
  
  // Sunucuyu kapat
  process.exit(0);
}

module.exports = app; // Test için 