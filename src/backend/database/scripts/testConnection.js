require('dotenv').config({ path: '../../.env' });
const db = require('../db');

async function testConnection() {
  try {
    const result = await db.query('SELECT NOW()');
    console.log('Veritabanı bağlantısı başarılı:', result.rows[0]);
    await db.closePool();
  } catch (error) {
    console.error('Veritabanı bağlantı hatası:', error);
  }
}

testConnection(); 