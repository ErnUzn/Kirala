const mongoose = require('mongoose');
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

// Test kullanıcısı bilgileri
const testUser = {
  userId: '1',
  userName: 'Test Kullanıcı',
  userEmail: 'test@example.com'
};

// Mevcut ürünleri test kullanıcısına ata
const updateOwnership = async () => {
  try {
    // Tüm ürünleri getir
    const items = await Item.find({});
    console.log(`Toplam ${items.length} ürün bulundu`);

    // Her ürünü güncelle
    for (const item of items) {
      // Eğer ownerInfo yoksa veya userId farklıysa güncelle
      if (!item.ownerInfo || item.ownerInfo.userId !== testUser.userId) {
        await Item.findByIdAndUpdate(item._id, {
          ownerInfo: testUser,
          owner: new mongoose.Types.ObjectId() // Geçici ObjectId
        });
        console.log(`Ürün güncellendi: ${item.name}`);
      } else {
        console.log(`Ürün zaten test kullanıcısına ait: ${item.name}`);
      }
    }

    console.log('Tüm ürünler test kullanıcısına atandı!');
    
    // Güncellenmiş ürünleri kontrol et
    const updatedItems = await Item.find({ 'ownerInfo.userId': testUser.userId });
    console.log(`Test kullanıcısına ait ürün sayısı: ${updatedItems.length}`);
    
  } catch (error) {
    console.error('Güncelleme hatası:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB bağlantısı kapatıldı');
  }
};

// Script'i çalıştır
const runScript = async () => {
  await connectDB();
  await updateOwnership();
};

runScript(); 