const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

// MongoDB bağlantısı
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/kirala', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected: localhost');
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error.message);
    process.exit(1);
  }
};

// Admin kullanıcısı oluştur
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
      console.log('✅ Admin kullanıcısı başarıyla oluşturuldu:', {
        id: savedAdmin._id,
        email: savedAdmin.email,
        role: savedAdmin.role,
        isActive: savedAdmin.isActive
      });
      console.log('🔑 Giriş bilgileri: admin@kirala.com / admin123');
      
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
      console.log('ℹ️ Admin kullanıcısı zaten mevcut:', {
        id: adminExists._id,
        email: adminExists.email,
        role: adminExists.role
      });
    }
  } catch (error) {
    console.error('❌ Admin kullanıcısı oluşturma hatası:', error);
    console.error('Error details:', error.message);
  }
};

// Ana işlev
const main = async () => {
  await connectDB();
  await createAdminUser();
  process.exit(0);
};

// Scripti çalıştır
main(); 