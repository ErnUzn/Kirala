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

// Veritabanını temizle ve test kullanıcısını oluştur
const cleanAndSetupTestUser = async () => {
  try {
    console.log('🧹 Veritabanı temizleniyor...');
    
    // Tüm kullanıcıları sil
    const deletedUsers = await User.deleteMany({});
    console.log(`✅ ${deletedUsers.deletedCount} kullanıcı silindi`);

    // Şifreyi hash'le
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    // Test kullanıcısını oluştur
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
    console.log('✅ Test kullanıcısı oluşturuldu:', testUser._id);

    // Tüm ürünleri test kullanıcısına ata
    const items = await Item.find({});
    console.log(`📦 Toplam ${items.length} ürün bulundu`);

    const testUserInfo = {
      userId: testUser._id.toString(),
      userName: 'Test Kullanıcı',
      userEmail: 'test@example.com'
    };

    // Tüm ürünlerin owner bilgilerini güncelle
    const updateResult = await Item.updateMany(
      {}, // Tüm ürünler
      { 
        $set: { 
          ownerInfo: testUserInfo 
        } 
      }
    );

    console.log(`✅ ${updateResult.modifiedCount} ürün test kullanıcısına atandı`);

    // Test kullanıcısına ait ürün sayısını kontrol et
    const userItems = await Item.find({ 'ownerInfo.userId': testUser._id.toString() });
    console.log(`📊 Test kullanıcısına ait ürün sayısı: ${userItems.length}`);

    // Ürün listesini göster
    console.log('\n📋 Test kullanıcısına atanan ürünler:');
    userItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} - ${item.dailyPrice}₺/gün`);
    });

  } catch (error) {
    console.error('❌ Temizlik ve kurulum hatası:', error);
  }
};

// Ana fonksiyon
const main = async () => {
  await connectDB();
  await cleanAndSetupTestUser();
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 YENİ TEST KULLANICISI BİLGİLERİ:');
  console.log('📧 Email: test@example.com');
  console.log('🔑 Şifre: 123456');
  console.log('👤 Ad Soyad: Test Kullanıcı');
  console.log('📱 Telefon: +90 555 123 4567');
  console.log('🏠 Adres: İstanbul, Türkiye');
  console.log('='.repeat(60));
  
  mongoose.connection.close();
  console.log('✅ MongoDB bağlantısı kapatıldı');
  console.log('🚀 Artık test@example.com / 123456 ile giriş yapabilirsiniz!');
};

main(); 