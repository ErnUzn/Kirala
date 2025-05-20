/**
 * Kirala - Ürün Modeli
 * 
 * Bu dosya, ürün işlemleri için gerekli model fonksiyonlarını içerir.
 */

const db = require('../database/db');

class Item {
  // Tüm ürünleri getir
  static async findAll() {
    const result = await db.query(
      `SELECT * FROM items ORDER BY created_at DESC`
    );
    return result.rows;
  }

  // ID'ye göre ürün getir
  static async findById(id) {
    const result = await db.query(
      `SELECT * FROM items WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  // Yeni ürün oluştur
  static async create(itemData) {
    const {
      name,
      description,
      price,
      category,
      stock,
      image,
      location,
      condition,
      rating,
      reviewCount
    } = itemData;

    const result = await db.query(
      `INSERT INTO items (
        name, description, price, category, stock,
        image, location, condition, rating, review_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
      [
        name,
        description,
        price,
        category,
        stock,
        image,
        location,
        condition,
        rating,
        reviewCount
      ]
    );

    return result.rows[0];
  }

  // Ürün güncelle
  static async update(id, itemData) {
    const {
      name,
      description,
      price,
      category,
      stock,
      image,
      location,
      condition
    } = itemData;

    const result = await db.query(
      `UPDATE items
       SET name = $1,
           description = $2,
           price = $3,
           category = $4,
           stock = $5,
           image = $6,
           location = $7,
           condition = $8,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [
        name,
        description,
        price,
        category,
        stock,
        image,
        location,
        condition,
        id
      ]
    );

    return result.rows[0];
  }

  // Ürün sil
  static async delete(id) {
    const result = await db.query(
      `DELETE FROM items WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  // Ürün fotoğrafı ekle
  static async addItemPhoto(id, photoUrl) {
    const result = await db.query(
      `INSERT INTO item_photos (item_id, photo_url)
       VALUES ($1, $2)
       RETURNING *`,
      [id, photoUrl]
    );
    return result.rows[0];
  }

  // Ürün fotoğrafı sil
  static async deleteItemPhoto(id, photoId) {
    const result = await db.query(
      'DELETE FROM item_photos WHERE id = $1 AND item_id = $2 RETURNING *',
      [photoId, id]
    );
    return result.rows[0];
  }

  // Ürün müsaitlik durumunu güncelle
  static async updateAvailability(id, isAvailable) {
    const result = await db.query(
      `UPDATE items SET
        is_available = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *`,
      [isAvailable, id]
    );
    return result.rows[0];
  }

  // Ürün değerlendirmesi ekle
  static async addReview(itemId, reviewerId, rating, comment) {
    const result = await db.query(
      `INSERT INTO reviews (item_id, reviewer_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [itemId, reviewerId, rating, comment]
    );
    return result.rows[0];
  }

  // Ürün değerlendirmesi güncelle
  static async updateReview(itemId, reviewId, rating, comment) {
    const result = await db.query(
      `UPDATE reviews SET
        rating = $1,
        comment = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3 AND item_id = $4
      RETURNING *`,
      [rating, comment, reviewId, itemId]
    );
    return result.rows[0];
  }

  // Ürün değerlendirmesi sil
  static async deleteReview(itemId, reviewId) {
    const result = await db.query(
      'DELETE FROM reviews WHERE id = $1 AND item_id = $2 RETURNING *',
      [reviewId, itemId]
    );
    return result.rows[0];
  }

  // Ürün arama
  static async searchItems(searchTerm, filters = {}, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT i.*, c.name as category_name, u.first_name, u.last_name
      FROM items i
      JOIN categories c ON i.category_id = c.id
      JOIN users u ON i.owner_id = u.id
      WHERE i.is_available = true
    `;
    const params = [];

    if (searchTerm) {
      query += ` AND (
        i.title ILIKE $${params.length + 1} OR
        i.description ILIKE $${params.length + 1} OR
        c.name ILIKE $${params.length + 1}
      )`;
      params.push(`%${searchTerm}%`);
    }

    // Filtreleri uygula
    if (filters.category_id) {
      query += ` AND i.category_id = $${params.length + 1}`;
      params.push(filters.category_id);
    }

    if (filters.min_price) {
      query += ` AND i.daily_price >= $${params.length + 1}`;
      params.push(filters.min_price);
    }

    if (filters.max_price) {
      query += ` AND i.daily_price <= $${params.length + 1}`;
      params.push(filters.max_price);
    }

    if (filters.condition) {
      query += ` AND i.condition = $${params.length + 1}`;
      params.push(filters.condition);
    }

    // Sıralama
    query += ` ORDER BY i.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  }
}

module.exports = Item; 