const mongoose = require('mongoose');
const Rental = require('../models/Rental');
const Item = require('../models/Item');
const User = require('../models/User');

const createTestRentals = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/kirala', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('🏠 TEST KİRALAMA TALEPLERİ OLUŞTURULUYOR');
    console.log('='.repeat(50));

    // Kullanıcıları getir
    const testUser = await User.findOne({ email: 'test@example.com' });
    const erenUser = await User.findOne({ email: 'erenuzun233@gmail.com' });

    if (!testUser || !erenUser) {
      console.log('❌ Kullanıcılar bulunamadı');
      return;
    }

    console.log(`👤 Test Kullanıcı: ${testUser.firstName} ${testUser.lastName} (${testUser._id})`);
    console.log(`👤 Eren Kullanıcı: ${erenUser.firstName} ${erenUser.lastName} (${erenUser._id})`);

    // Test kullanıcının ürünlerini getir
    const testUserItems = await Item.find({ 'ownerInfo.userId': testUser._id.toString() });
    // Eren'in ürünlerini getir
    const erenItems = await Item.find({ 'ownerInfo.userId': erenUser._id.toString() });

    console.log(`\n📦 Test Kullanıcı ürün sayısı: ${testUserItems.length}`);
    console.log(`📦 Eren ürün sayısı: ${erenItems.length}`);

    const testRentals = [
      // Eren, Test Kullanıcının ürünlerini kiralıyor (Test Kullanıcı onaylayacak)
      {
        item: testUserItems[0]._id,
        renter: erenUser._id,
        owner: testUser._id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün sonra
        totalPrice: 500,
        status: 'pending'
      },
      {
        item: testUserItems[1]._id,
        renter: erenUser._id,
        owner: testUser._id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 gün sonra
        totalPrice: 300,
        status: 'pending'
      },
      // Test Kullanıcı, Eren'in ürünlerini kiralıyor (Eren onaylayacak)
      {
        item: erenItems[0]._id,
        renter: testUser._id,
        owner: erenUser._id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 gün sonra
        totalPrice: 400,
        status: 'pending'
      }
    ];

    for (let i = 0; i < testRentals.length; i++) {
      const rentalData = testRentals[i];
      const item = await Item.findById(rentalData.item);
      
      if (item) {
        const rental = new Rental(rentalData);
        await rental.save();
        
        console.log(`\n✅ ${i + 1}. Test Kiralama Oluşturuldu:`);
        console.log(`   Ürün: ${item.name}`);
        console.log(`   Kiralayan: ${rentalData.renter === erenUser._id ? 'Eren' : 'Test Kullanıcı'}`);
        console.log(`   Sahibi: ${rentalData.owner === testUser._id ? 'Test Kullanıcı' : 'Eren'}`);
        console.log(`   Durum: ${rental.status}`);
        console.log(`   ID: ${rental._id}`);
      }
    }

    console.log('\n🎉 Test kiralama talepleri başarıyla oluşturuldu!');
    console.log('\n📋 Şimdi şunları test edebilirsiniz:');
    console.log('1. Test Kullanıcı hesabıyla giriş yapın → 2 bekleyen kiralama görecek');
    console.log('2. Eren hesabıyla giriş yapın → 1 bekleyen kiralama görecek');
    console.log('3. Her kullanıcı kendi ürünleri için gelen talepleri onaylayabilir/reddedebilir');

  } catch (error) {
    console.error('❌ Hata:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createTestRentals(); 