const mongoose = require('mongoose');
const Rental = require('../models/Rental');
const Item = require('../models/Item');
const User = require('../models/User');

const checkRentals = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/kirala', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('📋 KIRALAMA KAYITLARI KONTROLÜ');
    console.log('='.repeat(50));

    // Tüm kiralamaları getir
    const allRentals = await Rental.find({})
      .populate('item', 'name ownerInfo')
      .populate('renter', 'firstName lastName email')
      .populate('owner', 'firstName lastName email')
      .sort({ createdAt: -1 });

    console.log(`\n💼 Toplam ${allRentals.length} kiralama kaydı bulundu\n`);

    allRentals.forEach((rental, index) => {
      console.log(`${index + 1}. KİRALAMA:`);
      console.log(`   ID: ${rental._id}`);
      console.log(`   Durum: ${rental.status}`);
      console.log(`   Ürün: ${rental.item?.name || 'Bilinmiyor'}`);
      console.log(`   Kiralayan: ${rental.renter?.firstName} ${rental.renter?.lastName} (${rental.renter?.email})`);
      console.log(`   Sahibi: ${rental.owner?.firstName} ${rental.owner?.lastName} (${rental.owner?.email})`);
      console.log(`   Ürün Sahibi (ownerInfo): ${rental.item?.ownerInfo?.userId || 'Yok'}`);
      console.log(`   Toplam Fiyat: ${rental.totalPrice}₺`);
      console.log(`   Oluşturulma: ${rental.createdAt}`);
      console.log('   ' + '-'.repeat(40));
    });

    // Bekleyen kiralamalar
    const pendingRentals = await Rental.find({ status: 'pending' });
    console.log(`\n⏳ Bekleyen kiralama sayısı: ${pendingRentals.length}`);

    // Kullanıcı sahiplik kontrolleri
    console.log('\n👥 KULLANICI SAHİPLİK KONTROLLERI:');
    const users = await User.find({}).select('_id firstName lastName email');
    
    for (const user of users) {
      const userItems = await Item.find({ 'ownerInfo.userId': user._id.toString() });
      const userPendingRentals = await Rental.find({
        status: 'pending',
        item: { $in: userItems.map(item => item._id) }
      });
      
      console.log(`   ${user.firstName} ${user.lastName}: ${userItems.length} ürün, ${userPendingRentals.length} bekleyen kiralama`);
    }

    console.log('\n✅ Kontrol tamamlandı');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await mongoose.disconnect();
  }
};

checkRentals(); 