/**
 * Kirala - PostgreSQL Veritabanı Bağlantı Modülü
 * 
 * Bu modül, PostgreSQL veritabanına bağlantı sağlar ve sorgu işlemlerini kolaylaştırır.
 */

const { Pool } = require('pg');
const { connectionString, dbConfig } = require('../config/database');

// Bağlantı havuzu oluşturma
const pool = connectionString 
  ? new Pool({ connectionString })
  : new Pool(dbConfig);

// Bağlantı hatalarını yakala
pool.on('error', (err) => {
  console.error('Beklenmeyen veritabanı hatası:', err);
  process.exit(-1);
});

/**
 * SQL sorgusu çalıştırmak için yardımcı fonksiyon
 * @param {string} text - SQL sorgusu
 * @param {Array} params - Sorgu parametreleri
 * @returns {Promise} - Sorgu sonucu
 */
const query = async (text, params) => {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    // Sorgu performansını izleme (dev ortamında)
    if (process.env.NODE_ENV === 'development') {
      console.log('Sorgu çalıştırıldı:', { text, duration, rows: result.rowCount });
    }
    
    return result;
  } catch (error) {
    console.error('Sorgu hatası:', error);
    throw error;
  }
};

/**
 * Bir veritabanı işlemi (transaction) başlatır
 * @returns {Promise<Object>} - İşlem nesnesi (client)
 */
const startTransaction = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    return client;
  } catch (error) {
    client.release();
    throw error;
  }
};

/**
 * Veritabanı havuzunu kapatır
 */
const closePool = async () => {
  await pool.end();
};

module.exports = {
  query,
  pool,
  startTransaction,
  closePool
}; 