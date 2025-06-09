const mongoose = require('mongoose');
const User = require('../models/User');
const Item = require('../models/Item');

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

// Test kullanıcısını ve ürünleri kontrol et
const checkTestUser = async () => {
  try {
    // Test kullanıcısını bul
    const testUser = await User.findOne({ email: 'test@example.com' });
    
    if (!testUser) {
      console.log('❌ Test kullanıcısı bulunamadı!');
      return;
    }
    
    console.log('✅ Test kullanıcısı bulundu:');
    console.log('- ID:', testUser._id.toString());
    console.log('- Email:', testUser.email);
    console.log('- Ad Soyad:', testUser.firstName, testUser.lastName);
    
    // Tüm ürünleri kontrol et
    const allItems = await Item.find({});
    console.log(`\n📦 Toplam ${allItems.length} ürün bulundu`);
    
    // Test kullanıcısına ait ürünleri bul
    const userItemsByOwnerInfo = await Item.find({ 'ownerInfo.userId': testUser._id.toString() });
    console.log(`\n🔍 ownerInfo.userId ile bulunan ürünler: ${userItemsByOwnerInfo.length}`);
    
    // İlk birkaç ürünün ownerInfo'sunu göster
    console.log('\n📋 İlk 3 ürünün ownerInfo bilgileri:');
    allItems.slice(0, 3).forEach((item, index) => {
      console.log(`${index + 1}. ${item.name}:`);
      console.log('   - ownerInfo:', item.ownerInfo);
    });
    
    // Test kullanıcısının ID'si ile eşleşen ürünleri göster
    if (userItemsByOwnerInfo.length > 0) {
      console.log('\n✅ Test kullanıcısına ait ürünler:');
      userItemsByOwnerInfo.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name} - ${item.dailyPrice}₺/gün`);
      });
    } else {
      console.log('\n❌ Test kullanıcısına ait ürün bulunamadı!');
    }

  } catch (error) {
    console.error('❌ Kontrol hatası:', error);
  }
};

// Ana fonksiyon
const main = async () => {
  await connectDB();
  await checkTestUser();
  
  mongoose.connection.close();
  console.log('\n✅ MongoDB bağlantısı kapatıldı');
};

main(); 