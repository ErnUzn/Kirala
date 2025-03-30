/**
 * Kirala - Ürün Modeli
 * 
 * Bu dosya, ürün işlemleri için gerekli model fonksiyonlarını içerir.
 */

const { db } = require('../database/db');

class Item {
  // Tüm ürünleri getir
  static async getAllItems(filters = {}, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT i.*, c.name as category_name, u.first_name, u.last_name
      FROM items i
      JOIN categories c ON i.category_id = c.id
      JOIN users u ON i.owner_id = u.id
      WHERE 1=1
    `;
    const params = [];

    // Filtreleri uygula
    if (filters.category_id) {
      query += ` AND i.category_id = $${params.length + 1}`;
      params.push(filters.category_id);
    }

    if (filters.owner_id) {
      query += ` AND i.owner_id = $${params.length + 1}`;
      params.push(filters.owner_id);
    }

    if (filters.is_available !== undefined) {
      query += ` AND i.is_available = $${params.length + 1}`;
      params.push(filters.is_available);
    }

    if (filters.search) {
      query += ` AND (i.title ILIKE $${params.length + 1} OR i.description ILIKE $${params.length + 1})`;
      params.push(`%${filters.search}%`);
    }

    // Sıralama
    query += ` ORDER BY i.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  }

  // Ürün detayını getir
  static async getItemById(id) {
    const result = await db.query(
      `SELECT i.*, c.name as category_name, u.first_name, u.last_name
       FROM items i
       JOIN categories c ON i.category_id = c.id
       JOIN users u ON i.owner_id = u.id
       WHERE i.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  // Ürün ekle
  static async createItem(itemData) {
    const {
      category_id,
      owner_id,
      title,
      description,
      condition,
      daily_price,
      weekly_discount_percentage,
      monthly_discount_percentage,
      min_rental_days,
      max_rental_days,
      deposit_amount
    } = itemData;

    const result = await db.query(
      `INSERT INTO items (
        category_id, owner_id, title, description, condition,
        daily_price, weekly_discount_percentage, monthly_discount_percentage,
        min_rental_days, max_rental_days, deposit_amount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        category_id, owner_id, title, description, condition,
        daily_price, weekly_discount_percentage, monthly_discount_percentage,
        min_rental_days, max_rental_days, deposit_amount
      ]
    );
    return result.rows[0];
  }

  // Ürün güncelle
  static async updateItem(id, itemData) {
    const {
      category_id,
      title,
      description,
      condition,
      daily_price,
      weekly_discount_percentage,
      monthly_discount_percentage,
      min_rental_days,
      max_rental_days,
      deposit_amount,
      is_available
    } = itemData;

    const result = await db.query(
      `UPDATE items SET
        category_id = COALESCE($1, category_id),
        title = COALESCE($2, title),
        description = COALESCE($3, description),
        condition = COALESCE($4, condition),
        daily_price = COALESCE($5, daily_price),
        weekly_discount_percentage = COALESCE($6, weekly_discount_percentage),
        monthly_discount_percentage = COALESCE($7, monthly_discount_percentage),
        min_rental_days = COALESCE($8, min_rental_days),
        max_rental_days = COALESCE($9, max_rental_days),
        deposit_amount = COALESCE($10, deposit_amount),
        is_available = COALESCE($11, is_available),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *`,
      [
        category_id, title, description, condition, daily_price,
        weekly_discount_percentage, monthly_discount_percentage,
        min_rental_days, max_rental_days, deposit_amount, is_available, id
      ]
    );
    return result.rows[0];
  }

  // Ürün sil
  static async deleteItem(id) {
    const result = await db.query(
      'DELETE FROM items WHERE id = $1 RETURNING *',
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