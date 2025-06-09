const mongoose = require('mongoose');
const Item = require('../models/item');

// Veritabanı bağlantısı
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kirala', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB bağlantısı başarılı');
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
};

// Örnek ürünler
const sampleItems = [
  {
    name: "Canon EOS 5D Mark IV",
    description: "Profesyonel fotoğraf çekimi için mükemmel DSLR kamera. 30.4 MP çözünürlük, 4K video kayıt özelliği.",
    category: "Elektronik",
    price: 150,
    dailyPrice: 150,
    weeklyPrice: 900,
    monthlyPrice: 3000,
    images: [
      "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500"
    ],
    status: "available",
    owner: new mongoose.Types.ObjectId(),
    location: "İstanbul, Kadıköy",
    features: ["4K Video", "WiFi", "GPS", "Touchscreen"],
    condition: "like-new"
  },
  {
    name: "MacBook Pro 16 inch",
    description: "M1 Pro çipli MacBook Pro. Video editing, yazılım geliştirme ve grafik tasarım için ideal.",
    category: "Elektronik",
    price: 200,
    dailyPrice: 200,
    weeklyPrice: 1200,
    monthlyPrice: 4500,
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"
    ],
    status: "available",
    owner: new mongoose.Types.ObjectId(),
    location: "İstanbul, Beşiktaş",
    features: ["M1 Pro Chip", "16GB RAM", "512GB SSD", "Retina Display"],
    condition: "new"
  },
  {
    name: "Elektrikli Scooter",
    description: "Şehir içi ulaşım için pratik elektrikli scooter. 25 km menzil, katlanabilir tasarım.",
    category: "Ulaşım",
    price: 50,
    dailyPrice: 50,
    weeklyPrice: 300,
    monthlyPrice: 1000,
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500"
    ],
    status: "available",
    owner: new mongoose.Types.ObjectId(),
    location: "Ankara, Çankaya",
    features: ["25km Menzil", "Katlanabilir", "LED Işık", "Bluetooth"],
    condition: "good"
  },
  {
    name: "Camping Çadırı (4 Kişilik)",
    description: "Su geçirmez, kolay kurulabilen 4 kişilik kamp çadırı. Doğa kampları için ideal.",
    category: "Spor & Outdoor",
    price: 30,
    dailyPrice: 30,
    weeklyPrice: 180,
    monthlyPrice: 600,
    images: [
      "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=500",
      "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500"
    ],
    status: "available",
    owner: new mongoose.Types.ObjectId(),
    location: "İzmir, Bornova",
    features: ["Su Geçirmez", "Kolay Kurulum", "4 Kişilik", "Taşıma Çantası"],
    condition: "good"
  },
  {
    name: "PlayStation 5",
    description: "Sony PlayStation 5 oyun konsolu. 2 kol ve popüler oyunlarla birlikte.",
    category: "Elektronik",
    price: 80,
    dailyPrice: 80,
    weeklyPrice: 480,
    monthlyPrice: 1600,
    images: [
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500",
      "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500"
    ],
    status: "available",
    owner: new mongoose.Types.ObjectId(),
    location: "İstanbul, Şişli",
    features: ["4K Gaming", "Ray Tracing", "SSD", "2 Controller"],
    condition: "like-new"
  },
  {
    name: "Dağ Bisikleti",
    description: "21 vites dağ bisikleti. Şehir içi ve doğa sporları için uygun.",
    category: "Spor & Outdoor",
    price: 40,
    dailyPrice: 40,
    weeklyPrice: 240,
    monthlyPrice: 800,
    images: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500"
    ],
    status: "available",
    owner: new mongoose.Types.ObjectId(),
    location: "Bursa, Nilüfer",
    features: ["21 Vites", "Disk Fren", "Amortisör", "LED Işık"],
    condition: "good"
  },
  {
    name: "Drone (4K Kamera)",
    description: "4K kamera özellikli drone. Hava fotoğrafçılığı ve video çekimi için.",
    category: "Elektronik",
    price: 120,
    dailyPrice: 120,
    weeklyPrice: 720,
    monthlyPrice: 2400,
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500",
      "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500"
    ],
    status: "available",
    owner: new mongoose.Types.ObjectId(),
    location: "Antalya, Muratpaşa",
    features: ["4K Video", "GPS", "Auto Return", "30 dk Uçuş"],
    condition: "new"
  },
  {
    name: "Elektrikli Gitar",
    description: "Fender Stratocaster elektrikli gitar. Amplifikatör ve aksesuarlarla birlikte.",
    category: "Müzik",
    price: 60,
    dailyPrice: 60,
    weeklyPrice: 360,
    monthlyPrice: 1200,
    images: [
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
      "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=500"
    ],
    status: "available",
    owner: new mongoose.Types.ObjectId(),
    location: "İstanbul, Beyoğlu",
    features: ["Amplifikatör", "Kablo", "Pick Set", "Kılıf"],
    condition: "good"
  },
  {
    name: "Projeksiyon Cihazı",
    description: "Full HD projeksiyon cihazı. Sunum ve ev sineması için ideal.",
    category: "Elektronik",
    price: 70,
    dailyPrice: 70,
    weeklyPrice: 420,
    monthlyPrice: 1400,
    images: [
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500"
    ],
    status: "available",
    owner: new mongoose.Types.ObjectId(),
    location: "Ankara, Kızılay",
    features: ["Full HD", "3000 Lumen", "HDMI", "Wireless"],
    condition: "like-new"
  },
  {
    name: "Kayak Takımı",
    description: "Komple kayak takımı. Bot, kayak, binding ve sopalarla birlikte.",
    category: "Spor & Outdoor",
    price: 90,
    dailyPrice: 90,
    weeklyPrice: 540,
    monthlyPrice: 1800,
    images: [
      "https://images.unsplash.com/photo-1551524164-6cf2ac8d3c7b?w=500",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500"
    ],
    status: "available",
    owner: new mongoose.Types.ObjectId(),
    location: "Erzurum, Palandöken",
    features: ["Komple Set", "42 Numara Bot", "Carving Kayak", "Sopalar"],
    condition: "good"
  }
];

// Veritabanını temizle ve örnek verileri ekle
const seedDatabase = async () => {
  try {
    // Mevcut ürünleri temizle
    await Item.deleteMany({});
    console.log('Mevcut ürünler temizlendi');

    // Yeni ürünleri ekle
    const createdItems = await Item.insertMany(sampleItems);
    console.log(`${createdItems.length} ürün başarıyla eklendi`);

    console.log('Veritabanı seed işlemi tamamlandı');
    process.exit(0);
  } catch (error) {
    console.error('Seed işlemi hatası:', error);
    process.exit(1);
  }
};

// Script'i çalıştır
const runSeed = async () => {
  await connectDB();
  await seedDatabase();
};

runSeed(); 