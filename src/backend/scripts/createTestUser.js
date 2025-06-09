const mongoose = require('mongoose');
const User = require('../models/User');
const Item = require('../models/Item');
const bcrypt = require('bcryptjs');

// MongoDB bağlantısı
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/kirala', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB bağlantısı başarılı');
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
};

// Test kullanıcısı oluştur
const createTestUser = async () => {
  try {
    // Önce mevcut test kullanıcısını kontrol et
    const existingUser = await User.findOne({ email: 'test@example.com' });
    
    if (existingUser) {
      console.log('Test kullanıcısı zaten mevcut:', existingUser._id);
      console.log('\n🔐 GİRİŞ BİLGİLERİ:');
      console.log('📧 Email: test@example.com');
      console.log('🔑 Şifre: 123456');
      console.log('\nKullanıcı bilgileri:', {
        id: existingUser._id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        email: existingUser.email,
        phone: existingUser.phone
      });
    } else {
      // Şifreyi hash'le
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt);

      // Yeni test kullanıcısı oluştur
      const testUser = new User({
        firstName: 'Test',
        lastName: 'Kullanıcı',
        email: 'test@example.com',
        password: hashedPassword,
        phone: '+90 555 123 4567',
        address: 'İstanbul, Türkiye',
        role: 'user',
        isActive: true,
        isVerified: true
      });

      await testUser.save();
      console.log('Test kullanıcısı oluşturuldu:', testUser._id);
      console.log('\n🔐 GİRİŞ BİLGİLERİ:');
      console.log('📧 Email: test@example.com');
      console.log('🔑 Şifre: 123456');
      console.log('\nKullanıcı bilgileri:', {
        id: testUser._id,
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        phone: testUser.phone
      });
    }

    // Tüm ürünleri test kullanıcısına ata
    const items = await Item.find({});
    console.log(`\nToplam ${items.length} ürün bulundu`);

    const testUserInfo = {
      userId: existingUser ? existingUser._id.toString() : (await User.findOne({ email: 'test@example.com' }))._id.toString(),
      userName: 'Test Kullanıcı',
      userEmail: 'test@example.com'
    };

    for (const item of items) {
      await Item.findByIdAndUpdate(item._id, {
        ownerInfo: testUserInfo
      });
      console.log(`Ürün güncellendi: ${item.name}`);
    }

    console.log('\nTüm ürünler test kullanıcısına atandı!');
    
    // Test kullanıcısına ait ürün sayısını kontrol et
    const userItems = await Item.find({ 'ownerInfo.userId': testUserInfo.userId });
    console.log(`Test kullanıcısına ait ürün sayısı: ${userItems.length}`);

  } catch (error) {
    console.error('Test kullanıcısı oluşturma hatası:', error);
  }
};

// Ana fonksiyon
const main = async () => {
  await connectDB();
  await createTestUser();
  
  console.log('\n' + '='.repeat(50));
  console.log('🎯 ÖNEMLİ BİLGİLER:');
  console.log('📧 Email: test@example.com');
  console.log('🔑 Şifre: 123456');
  console.log('👤 Ad Soyad: Test Kullanıcı');
  console.log('📱 Telefon: +90 555 123 4567');
  console.log('🏠 Adres: İstanbul, Türkiye');
  console.log('='.repeat(50));
  
  mongoose.connection.close();
  console.log('MongoDB bağlantısı kapatıldı');
};

main(); 