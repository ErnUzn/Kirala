/**
 * Kirala - Veritabanı Bağlantı Konfigürasyonu
 * 
 * Bu dosya, PostgreSQL veritabanı bağlantısı için gerekli ayarları içerir.
 */

const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('Database configuration loading...');
console.log(`DB Host: ${process.env.DB_HOST || 'localhost'}`);
console.log(`DB Name: ${process.env.DB_NAME || 'kirala'}`);
console.log(`DB User: ${process.env.DB_USER || 'postgres'}`);

const sequelize = new Sequelize(
  process.env.DB_NAME || 'kirala', // database name
  process.env.DB_USER || 'postgres', // username
  process.env.DB_PASSWORD, // password
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: console.log, // development için hataları görmek amacıyla
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true // createdAt ve updatedAt kolonlarını otomatik ekler
    }
  }
);

// Veritabanı bağlantısını test et
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Tabloları senkronize et - development ortamı için 
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
    
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

testConnection();

module.exports = sequelize; 