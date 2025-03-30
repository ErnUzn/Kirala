/**
 * Kirala - Veritabanı Oluşturma Script'i
 * 
 * Bu script, PostgreSQL'de Kirala uygulaması için bir veritabanı oluşturur.
 */

require('dotenv').config({ path: '../../.env' });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Veritabanı bağlantı bilgileri için default değerler
const {
  DB_USER = 'postgres',
  DB_PASSWORD = '',
  DB_HOST = 'localhost',
  DB_PORT = 5432,
  DB_NAME = 'kirala'
} = process.env;

// PostgreSQL'e bağlanma (veritabanı olmadan)
const client = new Client({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  database: 'postgres' // Default veritabanı
});

async function main() {
  try {
    console.log('PostgreSQL\'e bağlanılıyor...');
    await client.connect();
    
    console.log(`"${DB_NAME}" veritabanının varlığı kontrol ediliyor...`);
    
    // Veritabanının var olup olmadığını kontrol et
    const checkDbResult = await client.query(`
      SELECT 1 FROM pg_database WHERE datname = $1
    `, [DB_NAME]);
    
    // Eğer veritabanı yoksa oluştur
    if (checkDbResult.rowCount === 0) {
      console.log(`"${DB_NAME}" veritabanı bulunamadı. Oluşturuluyor...`);
      await client.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`"${DB_NAME}" veritabanı oluşturuldu.`);
      
      // Ana veritabanına bağlan ve şemayı oluştur
      await client.end();
      
      // Yeni DB'ye bağlanmak için yeni bir istemci oluştur
      const dbClient = new Client({
        user: DB_USER,
        password: DB_PASSWORD,
        host: DB_HOST,
        port: DB_PORT,
        database: DB_NAME
      });
      
      await dbClient.connect();
      
      // schema.sql dosyasını oku ve çalıştır
      console.log('Veritabanı şeması oluşturuluyor...');
      const schemaPath = path.join(__dirname, '..', 'schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      
      await dbClient.query(schemaSql);
      console.log('Veritabanı şeması başarıyla oluşturuldu.');
      
      await dbClient.end();
    } else {
      console.log(`"${DB_NAME}" veritabanı zaten mevcut.`);
      await client.end();
    }
    
    console.log('Veritabanı kurulumu tamamlandı.');
    
  } catch (err) {
    console.error('Veritabanı oluşturma hatası:', err);
    process.exit(1);
  }
}

main(); 