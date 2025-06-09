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
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const rateLimit = require('express-rate-limit');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

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

// MongoDB bağlantısı
connectDB().then(() => {
  console.log('MongoDB bağlantısı tamamlandı, admin kullanıcısı kontrol ediliyor...');
  // Admin kullanıcısını oluştur
  createAdminUser();
}).catch(err => {
  console.error('MongoDB bağlantı hatası:', err);
});

// Admin kullanıcısı oluşturma fonksiyonu
const createAdminUser = async () => {
  try {
    console.log('Admin kullanıcısı kontrolü başlatılıyor...');
    
    const adminExists = await User.findOne({ email: 'admin@kirala.com' });
    console.log('Admin var mı:', !!adminExists);
    
    if (!adminExists) {
      console.log('Yeni admin kullanıcısı oluşturuluyor...');
      
      const hashedPassword = await bcrypt.hash('admin123', 12);
      console.log('Şifre hash\'lendi');
      
      const adminUser = new User({
        email: 'admin@kirala.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true,
        isVerified: true
      });
      
      console.log('Admin kullanıcısı veritabanına kaydediliyor...');
      const savedAdmin = await adminUser.save();
      console.log('Admin kullanıcısı başarıyla oluşturuldu:', {
        id: savedAdmin._id,
        email: savedAdmin.email,
        role: savedAdmin.role,
        isActive: savedAdmin.isActive
      });
      console.log('Giriş bilgileri: admin@kirala.com / admin123');
      
      // Kaydedilen kullanıcıyı tekrar kontrol et
      const verifyAdmin = await User.findOne({ email: 'admin@kirala.com' });
      console.log('Doğrulama: Admin kullanıcısı veritabanında var mı?', !!verifyAdmin);
      if (verifyAdmin) {
        console.log('Admin kullanıcısı detayları:', {
          id: verifyAdmin._id,
          email: verifyAdmin.email,
          role: verifyAdmin.role,
          firstName: verifyAdmin.firstName,
          lastName: verifyAdmin.lastName
        });
      }
    } else {
      console.log('Admin kullanıcısı zaten mevcut:', {
        id: adminExists._id,
        email: adminExists.email,
        role: adminExists.role
      });
    }
  } catch (error) {
    console.error('Admin kullanıcısı oluşturma hatası:', error);
    console.error('Error details:', error.message);
  }
};

// Sağlık kontrolü endpoint'i
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Debug endpoint - kullanıcıları listele
app.get('/debug/users', async (req, res) => {
  try {
    const users = await User.find({}, 'email firstName lastName role isActive').exec();
    res.json({
      total: users.length,
      users: users
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint'lerini tanımla
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/users'));
app.use('/api/items', require('./routes/items'));
app.use('/api/rentals', require('./routes/rentals'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/ratings', require('./routes/ratings'));
app.use('/api', require('./routes/test')); // Test route'unu ekle

// 404 hatası için middleware
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Bu endpoint bulunamadı: ${req.method} ${req.url}`
  });
});

// Hata işleme middleware'i
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
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

// İşlem sonlandırma olaylarını dinle
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

// Sunucuyu düzgün bir şekilde kapatma işlevi
function shutDown() {
  console.log('Sunucu kapatılıyor...');
  process.exit(0);
}

module.exports = app; // Test için 