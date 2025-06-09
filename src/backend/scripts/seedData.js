const mongoose = require('mongoose');
const User = require('../models/User');
const Item = require('../models/Item');
const Rental = require('../models/Rental');
require('dotenv').config();

const seedData = async () => {
    try {
        // MongoDB'ye bağlan
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kirala');
        console.log('MongoDB bağlantısı başarılı');

        // Mevcut verileri temizle
        await User.deleteMany({});
        await Item.deleteMany({});
        await Rental.deleteMany({});
        console.log('Mevcut veriler temizlendi');

        // Admin kullanıcısı oluştur
        const admin = await User.create({
            username: 'admin',
            email: 'admin@kirala.com',
            password: 'admin123',
            fullName: 'Admin User',
            phone: '5551234567',
            address: 'Admin Address',
            role: 'admin'
        });
        console.log('Admin kullanıcısı oluşturuldu');

        // Normal kullanıcı oluştur
        const user = await User.create({
            username: 'user',
            email: 'user@kirala.com',
            password: 'user123',
            fullName: 'Normal User',
            phone: '5559876543',
            address: 'User Address',
            role: 'user'
        });
        console.log('Normal kullanıcı oluşturuldu');

        // Test ürünleri oluştur
        const items = await Item.create([
            {
                name: 'iPhone 13 Pro',
                description: 'Yeni nesil iPhone, 256GB',
                category: 'Electronics',
                price: 25000,
                dailyPrice: 250,
                weeklyPrice: 1500,
                monthlyPrice: 5000,
                images: ['https://example.com/iphone.jpg'],
                status: 'available',
                owner: admin._id,
                location: 'İstanbul',
                features: ['256GB', 'Pro Kamera', '5G'],
                condition: 'new'
            },
            {
                name: 'MacBook Pro M1',
                description: 'Apple M1 işlemcili MacBook Pro',
                category: 'Electronics',
                price: 35000,
                dailyPrice: 350,
                weeklyPrice: 2100,
                monthlyPrice: 7000,
                images: ['https://example.com/macbook.jpg'],
                status: 'available',
                owner: user._id,
                location: 'Ankara',
                features: ['M1', '16GB RAM', '512GB SSD'],
                condition: 'like-new'
            }
        ]);
        console.log('Test ürünleri oluşturuldu');

        // Test kiralama oluştur
        const rental = await Rental.create({
            item: items[0]._id,
            renter: user._id,
            owner: admin._id,
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 gün sonra
            totalPrice: 1500,
            status: 'active',
            paymentStatus: 'paid'
        });
        console.log('Test kiralama oluşturuldu');

        console.log('Tüm test verileri başarıyla eklendi');
        process.exit(0);
    } catch (error) {
        console.error('Hata:', error);
        process.exit(1);
    }
};

seedData(); 