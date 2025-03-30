require('dotenv').config({ path: '../../.env' });
const fs = require('fs');
const path = require('path');
const db = require('../db');

async function createSchema() {
  try {
    const schemaPath = path.join(__dirname, '..', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Veritabanı şeması oluşturuluyor...');
    
    // SQL dosyasını ayrı komutlara böl
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    // Her komutu ayrı ayrı çalıştır
    for (const statement of statements) {
      try {
        await db.query(statement + ';');
        console.log('SQL komutu başarıyla çalıştırıldı.');
      } catch (error) {
        console.error('SQL komutu çalıştırılırken hata:', error.message);
        console.error('Hatalı komut:', statement);
      }
    }
    
    console.log('Veritabanı şeması oluşturma işlemi tamamlandı.');
    await db.closePool();
  } catch (error) {
    console.error('Veritabanı şeması oluşturulurken hata:', error);
    process.exit(1);
  }
}

createSchema(); 