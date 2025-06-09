const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function checkUser() {
  try {
    await mongoose.connect('mongodb://localhost:27017/kirala', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('🔍 Test kullanıcısı kontrol ediliyor...');
    
    const user = await User.findOne({ email: 'test@example.com' });
    
    if (!user) {
      console.log('❌ Test kullanıcısı bulunamadı!');
      return;
    }

    console.log('✅ Test kullanıcısı bulundu:');
    console.log('- ID:', user._id);
    console.log('- Email:', user.email);
    console.log('- Ad Soyad:', user.firstName, user.lastName);
    console.log('- Aktif mi:', user.isActive);
    console.log('- Şifre hash:', user.password);

    // Şifre kontrolü
    const isValidPassword = await bcrypt.compare('123456', user.password);
    console.log('- Şifre doğru mu (123456):', isValidPassword);

    // Diğer şifreler de test et
    const testPasswords = ['test123', 'password', 'admin'];
    for (const testPass of testPasswords) {
      const isValid = await bcrypt.compare(testPass, user.password);
      if (isValid) {
        console.log(`- Çalışan şifre bulundu: ${testPass}`);
      }
    }

  } catch (error) {
    console.error('❌ Kontrol hatası:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB bağlantısı kapatıldı');
  }
}

checkUser(); 