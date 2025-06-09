const mongoose = require('mongoose');
const Item = require('../models/Item');
require('dotenv').config();

// Veritabanı bağlantısı
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kirala', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB bağlantısı başarılı');
  } catch (error) {
    console.error('❌ MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
};

// Kategori eşleştirme tablosu
const categoryMapping = {
  // Mevcut kategoriler -> Yeni kategoriler
  'Elektronik': 'Electronics',
  'Ulaşım': 'Transportation', 
  'Spor & Outdoor': 'Sports',
  'Müzik': 'Music'
};

// Ürün kategorilerini güncelleme fonksiyonu
const updateProductCategories = async () => {
  try {
    console.log('🔄 Ürün kategorileri güncelleniyor...\n');
    
    // Tüm ürünleri getir
    const items = await Item.find({});
    console.log(`📦 Toplam ${items.length} ürün bulundu\n`);

    let updateCount = 0;

    for (const item of items) {
      const oldCategory = item.category;
      let newCategory = categoryMapping[oldCategory] || oldCategory;
      
      // Eğer kategori eşleştirmede yoksa, ürüne göre manuel atama yap
      if (!categoryMapping[oldCategory]) {
        // Ürün adına göre kategori belirleme
        const productName = item.name.toLowerCase();
        
        if (productName.includes('canon') || productName.includes('kamera') || 
            productName.includes('macbook') || productName.includes('drone') || 
            productName.includes('playstation') || productName.includes('projeksiyon')) {
          newCategory = 'Electronics';
        } else if (productName.includes('scooter') || productName.includes('elektrikli scooter')) {
          newCategory = 'Transportation';
        } else if (productName.includes('çadır') || productName.includes('bisiklet') || 
                  productName.includes('kayak') || productName.includes('camping')) {
          newCategory = 'Sports';
        } else if (productName.includes('gitar') || productName.includes('müzik')) {
          newCategory = 'Music';
        } else {
          newCategory = 'Electronics'; // Varsayılan kategori
        }
      }

      // Kategoriyi güncelle
      if (item.category !== newCategory) {
        await Item.findByIdAndUpdate(item._id, {
          category: newCategory
        });
        
        console.log(`✅ "${item.name}"`);
        console.log(`   Eski kategori: ${oldCategory || 'Yok'}`);
        console.log(`   Yeni kategori: ${newCategory}\n`);
        updateCount++;
      } else {
        console.log(`✅ "${item.name}" - Kategori zaten güncel: ${newCategory}\n`);
      }
    }

    console.log(`🎯 Güncelleme tamamlandı!`);
    console.log(`📊 Toplam ${updateCount} ürün kategorisi güncellendi\n`);

    // Kategori dağılımını göster
    console.log('📈 Güncel kategori dağılımı:');
    const categoryStats = await Item.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    categoryStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} ürün`);
    });

  } catch (error) {
    console.error('❌ Kategori güncelleme hatası:', error);
  }
};

// Script'i çalıştır
const runUpdate = async () => {
  await connectDB();
  await updateProductCategories();
  await mongoose.connection.close();
  console.log('\n🔌 MongoDB bağlantısı kapatıldı');
  process.exit(0);
};

runUpdate(); 