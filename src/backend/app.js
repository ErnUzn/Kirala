/**
 * Kirala - Ana Uygulama Dosyası
 * 
 * Bu dosya, Express.js tabanlı API sunucusunun ana yapılandırmasını içerir.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { dbConfig } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const notFoundHandler = require('./middleware/notFoundHandler');
const routes = require('./routes');
const connectDB = require('./config/database');
require('dotenv').config();

// Express uygulamasını oluştur
const app = express();

// Middleware'leri yapılandır
app.use(helmet()); // Güvenlik başlıkları
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // CORS desteği
app.use(compression()); // Sıkıştırma
app.use(morgan('dev')); // Loglama
app.use(express.json()); // JSON body parser
app.use(express.urlencoded({ extended: true })); // URL-encoded body parser

// MongoDB bağlantısı
connectDB();

// API rotalarını yapılandır
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Hata handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Bir hata oluştu',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Veritabanı: ${dbConfig.database}@${dbConfig.host}:${dbConfig.port}`);
});

module.exports = app; 