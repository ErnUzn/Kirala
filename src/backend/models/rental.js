/**
 * Kirala - Kiralama Modeli
 * 
 * Bu dosya, kiralama işlemleri için gerekli model fonksiyonlarını içerir.
 */

const { db } = require('../database/db');

class Rental {
  // Kiralama detayını getir
  static async getRentalById(id) {
    const result = await db.query(
      `SELECT r.*,
              i.title as item_title,
              i.daily_price as item_daily_price,
              c.name as category_name,
              o.first_name as owner_first_name,
              o.last_name as owner_last_name,
              ren.first_name as renter_first_name,
              ren.last_name as renter_last_name
       FROM rentals r
       JOIN items i ON r.item_id = i.id
       JOIN categories c ON i.category_id = c.id
       JOIN users o ON i.owner_id = o.id
       JOIN users ren ON r.renter_id = ren.id
       WHERE r.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  // Kullanıcının kiralamalarını getir
  static async getUserRentals(userId, filters = {}, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT r.*,
              i.title as item_title,
              i.daily_price as item_daily_price,
              c.name as category_name,
              o.first_name as owner_first_name,
              o.last_name as owner_last_name
      FROM rentals r
      JOIN items i ON r.item_id = i.id
      JOIN categories c ON i.category_id = c.id
      JOIN users o ON i.owner_id = o.id
      WHERE r.renter_id = $1
    `;
    const params = [userId];

    // Filtreleri uygula
    if (filters.status) {
      query += ` AND r.status = $${params.length + 1}`;
      params.push(filters.status);
    }

    if (filters.payment_status) {
      query += ` AND r.payment_status = $${params.length + 1}`;
      params.push(filters.payment_status);
    }

    // Sıralama
    query += ` ORDER BY r.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  }

  // Ürünün kiralamalarını getir
  static async getItemRentals(itemId, filters = {}, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT r.*,
              ren.first_name as renter_first_name,
              ren.last_name as renter_last_name
      FROM rentals r
      JOIN users ren ON r.renter_id = ren.id
      WHERE r.item_id = $1
    `;
    const params = [itemId];

    // Filtreleri uygula
    if (filters.status) {
      query += ` AND r.status = $${params.length + 1}`;
      params.push(filters.status);
    }

    if (filters.payment_status) {
      query += ` AND r.payment_status = $${params.length + 1}`;
      params.push(filters.payment_status);
    }

    // Sıralama
    query += ` ORDER BY r.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  }

  // Kiralama talebi oluştur
  static async createRental(rentalData) {
    const {
      item_id,
      renter_id,
      start_date,
      end_date,
      delivery_method,
      delivery_notes,
      renter_address_id
    } = rentalData;

    const result = await db.query(
      `INSERT INTO rentals (
        item_id, renter_id, start_date, end_date,
        delivery_method, delivery_notes, renter_address_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        item_id, renter_id, start_date, end_date,
        delivery_method, delivery_notes, renter_address_id
      ]
    );
    return result.rows[0];
  }

  // Kiralama güncelle
  static async updateRental(id, rentalData) {
    const {
      status,
      payment_status,
      delivery_notes,
      admin_notes
    } = rentalData;

    const result = await db.query(
      `UPDATE rentals SET
        status = COALESCE($1, status),
        payment_status = COALESCE($2, payment_status),
        delivery_notes = COALESCE($3, delivery_notes),
        admin_notes = COALESCE($4, admin_notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *`,
      [status, payment_status, delivery_notes, admin_notes, id]
    );
    return result.rows[0];
  }

  // Kiralama iptal et
  static async cancelRental(id, reason) {
    const result = await db.query(
      `UPDATE rentals SET
        status = 'İptal Edildi',
        admin_notes = COALESCE($1, admin_notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *`,
      [reason, id]
    );
    return result.rows[0];
  }

  // Kiralama tamamla
  static async completeRental(id, notes) {
    const result = await db.query(
      `UPDATE rentals SET
        status = 'Tamamlandı',
        admin_notes = COALESCE($1, admin_notes),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *`,
      [notes, id]
    );
    return result.rows[0];
  }

  // Kiralama değerlendirmesi ekle
  static async addRentalReview(rentalId, reviewerId, rating, comment) {
    const result = await db.query(
      `INSERT INTO rental_reviews (
        rental_id, reviewer_id, rating, comment
      ) VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [rentalId, reviewerId, rating, comment]
    );
    return result.rows[0];
  }

  // Kiralama mesajları getir
  static async getRentalMessages(rentalId, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const result = await db.query(
      `SELECT m.*,
              u.first_name,
              u.last_name
       FROM rental_messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.rental_id = $1
       ORDER BY m.created_at ASC
       LIMIT $2 OFFSET $3`,
      [rentalId, limit, offset]
    );
    return result.rows;
  }

  // Kiralama mesajı gönder
  static async sendRentalMessage(rentalId, senderId, message) {
    const result = await db.query(
      `INSERT INTO rental_messages (
        rental_id, sender_id, message
      ) VALUES ($1, $2, $3)
      RETURNING *`,
      [rentalId, senderId, message]
    );
    return result.rows[0];
  }

  // Kiralama mesajlarını okundu işaretle
  static async markRentalMessagesAsRead(rentalId, userId) {
    const result = await db.query(
      `UPDATE rental_messages SET
        is_read = true,
        updated_at = CURRENT_TIMESTAMP
      WHERE rental_id = $1 AND sender_id != $2
      RETURNING *`,
      [rentalId, userId]
    );
    return result.rows;
  }
}

module.exports = Rental; 