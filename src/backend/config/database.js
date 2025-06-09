/**
 * Kirala - Veritabanı Bağlantı Konfigürasyonu
 * 
 * Bu dosya, PostgreSQL veritabanı bağlantısı için gerekli ayarları içerir.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kirala', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        console.log('Continuing without MongoDB connection...');
        // MongoDB olmadan da çalışmaya devam et
    }
};

module.exports = connectDB; 