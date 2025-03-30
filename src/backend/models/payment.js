/**
 * Kirala - Ödeme Modeli
 * 
 * Bu dosya, ödeme işlemleri için gerekli model fonksiyonlarını içerir.
 */

const { db } = require('../database/db');

class Payment {
  // Ödeme detayını getir
  static async getPaymentById(id) {
    const result = await db.query(
      `SELECT p.*,
              r.id as rental_id,
              r.start_date as rental_start_date,
              r.end_date as rental_end_date,
              i.title as item_title,
              o.first_name as owner_first_name,
              o.last_name as owner_last_name,
              ren.first_name as renter_first_name,
              ren.last_name as renter_last_name
       FROM payments p
       JOIN rentals r ON p.rental_id = r.id
       JOIN items i ON r.item_id = i.id
       JOIN users o ON i.owner_id = o.id
       JOIN users ren ON r.renter_id = ren.id
       WHERE p.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  // Kiralama ödemelerini getir
  static async getRentalPayments(rentalId) {
    const result = await db.query(
      `SELECT p.*
       FROM payments p
       WHERE p.rental_id = $1
       ORDER BY p.created_at DESC`,
      [rentalId]
    );
    return result.rows;
  }

  // Kullanıcının ödemelerini getir
  static async getUserPayments(userId, filters = {}, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    let query = `
      SELECT p.*,
              r.id as rental_id,
              r.start_date as rental_start_date,
              r.end_date as rental_end_date,
              i.title as item_title
      FROM payments p
      JOIN rentals r ON p.rental_id = r.id
      JOIN items i ON r.item_id = i.id
      WHERE (r.renter_id = $1 OR i.owner_id = $1)
    `;
    const params = [userId];

    // Filtreleri uygula
    if (filters.status) {
      query += ` AND p.status = $${params.length + 1}`;
      params.push(filters.status);
    }

    if (filters.type) {
      query += ` AND p.type = $${params.length + 1}`;
      params.push(filters.type);
    }

    // Sıralama
    query += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);
    return result.rows;
  }

  // Ödeme oluştur
  static async createPayment(paymentData) {
    const {
      rental_id,
      amount,
      type,
      payment_method,
      transaction_id,
      status
    } = paymentData;

    const result = await db.query(
      `INSERT INTO payments (
        rental_id, amount, type, payment_method,
        transaction_id, status
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        rental_id, amount, type, payment_method,
        transaction_id, status
      ]
    );
    return result.rows[0];
  }

  // Ödeme güncelle
  static async updatePayment(id, paymentData) {
    const {
      status,
      transaction_id,
      error_message,
      refund_amount,
      refund_reason
    } = paymentData;

    const result = await db.query(
      `UPDATE payments SET
        status = COALESCE($1, status),
        transaction_id = COALESCE($2, transaction_id),
        error_message = COALESCE($3, error_message),
        refund_amount = COALESCE($4, refund_amount),
        refund_reason = COALESCE($5, refund_reason),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *`,
      [status, transaction_id, error_message, refund_amount, refund_reason, id]
    );
    return result.rows[0];
  }

  // Ödeme iptal et
  static async cancelPayment(id, reason) {
    const result = await db.query(
      `UPDATE payments SET
        status = 'İptal Edildi',
        error_message = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *`,
      [reason, id]
    );
    return result.rows[0];
  }

  // Ödeme iade et
  static async refundPayment(id, amount, reason) {
    const result = await db.query(
      `UPDATE payments SET
        status = 'İade Edildi',
        refund_amount = $1,
        refund_reason = $2,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *`,
      [amount, reason, id]
    );
    return result.rows[0];
  }

  // Kiralama toplam ödemesini hesapla
  static async calculateRentalTotal(rentalId) {
    const result = await db.query(
      `SELECT COALESCE(SUM(amount), 0) as total_amount,
              COALESCE(SUM(CASE WHEN status = 'İade Edildi' THEN refund_amount ELSE 0 END), 0) as total_refund
       FROM payments
       WHERE rental_id = $1`,
      [rentalId]
    );
    return {
      total_amount: result.rows[0].total_amount,
      total_refund: result.rows[0].total_refund,
      net_amount: result.rows[0].total_amount - result.rows[0].total_refund
    };
  }

  // Kullanıcı ödeme geçmişini getir
  static async getUserPaymentHistory(userId, startDate, endDate) {
    const result = await db.query(
      `SELECT p.*,
              r.id as rental_id,
              r.start_date as rental_start_date,
              r.end_date as rental_end_date,
              i.title as item_title
      FROM payments p
      JOIN rentals r ON p.rental_id = r.id
      JOIN items i ON r.item_id = i.id
      WHERE (r.renter_id = $1 OR i.owner_id = $1)
      AND p.created_at BETWEEN $2 AND $3
      ORDER BY p.created_at DESC`,
      [userId, startDate, endDate]
    );
    return result.rows;
  }
}

module.exports = Payment; 