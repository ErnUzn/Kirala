const mongoose = require('mongoose');
const User = require('../models/User');
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

// Şifre kontrolü
const checkPassword = async () => {
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
    console.log('- Hashed Password:', testUser.password);
    
    // Şifre kontrolü
    const testPassword = '123456';
    const isPasswordValid = await bcrypt.compare(testPassword, testUser.password);
    
    console.log('\n🔐 Şifre Kontrolü:');
    console.log('- Test şifresi:', testPassword);
    console.log('- Şifre doğru mu?', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('\n❌ Şifre yanlış! Yeni şifre hash\'i oluşturuluyor...');
      
      // Yeni şifre hash'i oluştur
      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash('123456', salt);
      
      // Kullanıcının şifresini güncelle
      await User.findByIdAndUpdate(testUser._id, { password: newHashedPassword });
      
      console.log('✅ Şifre güncellendi!');
      console.log('- Yeni hash:', newHashedPassword);
      
      // Tekrar kontrol et
      const recheckValid = await bcrypt.compare('123456', newHashedPassword);
      console.log('- Yeni şifre doğru mu?', recheckValid);
    } else {
      console.log('✅ Şifre doğru!');
    }

  } catch (error) {
    console.error('❌ Şifre kontrol hatası:', error);
  }
};

// Ana fonksiyon
const main = async () => {
  await connectDB();
  await checkPassword();
  
  mongoose.connection.close();
  console.log('\n✅ MongoDB bağlantısı kapatıldı');
};

main(); 