/**
 * Kirala - Kullanıcı Modeli
 * 
 * Bu modül, kullanıcı verileri için veritabanı işlemlerini sağlar.
 */

const db = require('../database/db');
const bcrypt = require('bcrypt');

/**
 * Kullanıcı oluşturur
 * @param {Object} userData - Kullanıcı bilgileri
 * @returns {Promise<Object>} - Oluşturulan kullanıcı
 */
const createUser = async (userData) => {
  const { email, password, first_name, last_name, phone_number } = userData;
  
  // Şifreyi hashle
  const saltRounds = 10;
  const password_hash = await bcrypt.hash(password, saltRounds);
  
  // SQL sorgusu
  const query = `
    INSERT INTO users (email, password_hash, first_name, last_name, phone_number)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, first_name, last_name, phone_number, created_at
  `;
  
  // Sorgu parametreleri
  const values = [email, password_hash, first_name, last_name, phone_number];
  
  // Sorguyu çalıştır
  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * Email adresine göre kullanıcı bilgilerini getirir
 * @param {string} email - Kullanıcı email adresi
 * @returns {Promise<Object|null>} - Bulunan kullanıcı veya null
 */
const findByEmail = async (email) => {
  const query = `SELECT * FROM users WHERE email = $1`;
  const result = await db.query(query, [email]);
  return result.rows[0] || null;
};

/**
 * ID'ye göre kullanıcı bilgilerini getirir
 * @param {string} id - Kullanıcı ID
 * @returns {Promise<Object|null>} - Bulunan kullanıcı veya null
 */
const findById = async (id) => {
  const query = `SELECT * FROM users WHERE id = $1`;
  const result = await db.query(query, [id]);
  return result.rows[0] || null;
};

/**
 * Kullanıcı bilgilerini günceller
 * @param {string} id - Kullanıcı ID
 * @param {Object} updateData - Güncellenecek veriler
 * @returns {Promise<Object>} - Güncellenmiş kullanıcı
 */
const updateUser = async (id, updateData) => {
  // Güncellenebilir alanları belirle
  const allowedFields = ['first_name', 'last_name', 'phone_number', 'profile_image_url', 'is_active'];
  
  // SQL sorgusunu ve değerlerini hazırla
  const updateFields = [];
  const values = [];
  let paramCount = 1;
  
  Object.keys(updateData).forEach(key => {
    if (allowedFields.includes(key)) {
      updateFields.push(`${key} = $${paramCount}`);
      values.push(updateData[key]);
      paramCount += 1;
    }
  });
  
  // Güncelleme için bir alan yoksa hata döndür
  if (updateFields.length === 0) {
    throw new Error('Güncellenecek geçerli alan bulunamadı');
  }
  
  // Son güncelleme zamanını ekle
  updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
  
  // User ID'yi değerlere ekle
  values.push(id);
  
  const query = `
    UPDATE users
    SET ${updateFields.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, email, first_name, last_name, phone_number, profile_image_url, is_active, updated_at
  `;
  
  const result = await db.query(query, values);
  return result.rows[0];
};

/**
 * Kullanıcı şifresini değiştirir
 * @param {string} id - Kullanıcı ID
 * @param {string} newPassword - Yeni şifre
 * @returns {Promise<boolean>} - İşlem başarılı ise true
 */
const changePassword = async (id, newPassword) => {
  // Şifreyi hashle
  const saltRounds = 10;
  const password_hash = await bcrypt.hash(newPassword, saltRounds);
  
  const query = `
    UPDATE users
    SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
  `;
  
  const result = await db.query(query, [password_hash, id]);
  return result.rowCount === 1;
};

/**
 * Kullanıcı kimlik doğrulama durumunu günceller
 * @param {string} id - Kullanıcı ID
 * @param {string} status - Yeni doğrulama durumu ('Doğrulanmadı', 'Beklemede', 'Doğrulandı')
 * @returns {Promise<boolean>} - İşlem başarılı ise true
 */
const updateVerificationStatus = async (id, status) => {
  const query = `
    UPDATE users
    SET id_verification_status = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
  `;
  
  const result = await db.query(query, [status, id]);
  return result.rowCount === 1;
};

/**
 * Kullanıcı derecelendirmesini günceller
 * @param {string} id - Kullanıcı ID
 * @param {number} rating - Yeni derecelendirme (1-5 arası)
 * @returns {Promise<boolean>} - İşlem başarılı ise true
 */
const updateRating = async (id, rating) => {
  if (rating < 1 || rating > 5) {
    throw new Error('Derecelendirme 1 ile 5 arasında olmalıdır');
  }
  
  const query = `
    UPDATE users
    SET rating = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2
  `;
  
  const result = await db.query(query, [rating, id]);
  return result.rowCount === 1;
};

/**
 * Kullanıcıları listeler (filtreleme ve sayfalama ile)
 * @param {Object} filters - Filtre kriterleri
 * @param {number} page - Sayfa numarası
 * @param {number} limit - Sayfa başına sonuç sayısı
 * @returns {Promise<Object>} - Kullanıcılar listesi ve toplam sayı
 */
const listUsers = async (filters = {}, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
  // Filtre koşullarını oluştur
  const conditions = [];
  const values = [];
  let paramCount = 1;
  
  if (filters.email) {
    conditions.push(`email ILIKE $${paramCount}`);
    values.push(`%${filters.email}%`);
    paramCount += 1;
  }
  
  if (filters.name) {
    conditions.push(`(first_name ILIKE $${paramCount} OR last_name ILIKE $${paramCount})`);
    values.push(`%${filters.name}%`);
    paramCount += 1;
  }
  
  if (filters.is_active !== undefined) {
    conditions.push(`is_active = $${paramCount}`);
    values.push(filters.is_active);
    paramCount += 1;
  }
  
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  
  // Toplam sayıyı al
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM users
    ${whereClause}
  `;
  
  // Kullanıcıları getir
  const dataQuery = `
    SELECT id, email, first_name, last_name, phone_number, profile_image_url, 
           id_verification_status, rating, created_at, is_active
    FROM users
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${paramCount} OFFSET $${paramCount + 1}
  `;
  
  values.push(limit, offset);
  
  // İki sorguyu paralel çalıştır
  const [countResult, dataResult] = await Promise.all([
    db.query(countQuery, values.slice(0, conditions.length)),
    db.query(dataQuery, values)
  ]);
  
  const total = parseInt(countResult.rows[0].total);
  const totalPages = Math.ceil(total / limit);
  
  return {
    users: dataResult.rows,
    pagination: {
      total,
      page,
      limit,
      totalPages
    }
  };
};

/**
 * Kullanıcıyı siler (soft delete)
 * @param {string} id - Kullanıcı ID
 * @returns {Promise<boolean>} - İşlem başarılı ise true
 */
const deleteUser = async (id) => {
  const query = `
    UPDATE users
    SET is_active = false, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
  `;
  
  const result = await db.query(query, [id]);
  return result.rowCount === 1;
};

module.exports = {
  createUser,
  findByEmail,
  findById,
  updateUser,
  changePassword,
  updateVerificationStatus,
  updateRating,
  listUsers,
  deleteUser
}; 