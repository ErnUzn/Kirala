/**
 * Kirala - Kategori Modeli
 * 
 * Bu dosya, kategori işlemleri için gerekli model fonksiyonlarını içerir.
 */

const { db } = require('../database/db');

class Category {
  // Tüm kategorileri getir
  static async getAllCategories() {
    const result = await db.query(
      `SELECT c.*, p.name as parent_name
       FROM categories c
       LEFT JOIN categories p ON c.parent_id = p.id
       ORDER BY c.display_order ASC`
    );
    return result.rows;
  }

  // Kategori detayını getir
  static async getCategoryById(id) {
    const result = await db.query(
      `SELECT c.*, p.name as parent_name
       FROM categories c
       LEFT JOIN categories p ON c.parent_id = p.id
       WHERE c.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  // Alt kategorileri getir
  static async getSubcategories(parentId) {
    const result = await db.query(
      `SELECT c.*, p.name as parent_name
       FROM categories c
       LEFT JOIN categories p ON c.parent_id = p.id
       WHERE c.parent_id = $1
       ORDER BY c.display_order ASC`,
      [parentId]
    );
    return result.rows;
  }

  // Kategori ekle
  static async createCategory(categoryData) {
    const {
      name,
      description,
      parent_id,
      icon_url,
      display_order
    } = categoryData;

    const result = await db.query(
      `INSERT INTO categories (
        name, description, parent_id, icon_url, display_order
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [name, description, parent_id, icon_url, display_order]
    );
    return result.rows[0];
  }

  // Kategori güncelle
  static async updateCategory(id, categoryData) {
    const {
      name,
      description,
      parent_id,
      icon_url,
      display_order,
      is_active
    } = categoryData;

    const result = await db.query(
      `UPDATE categories SET
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        parent_id = COALESCE($3, parent_id),
        icon_url = COALESCE($4, icon_url),
        display_order = COALESCE($5, display_order),
        is_active = COALESCE($6, is_active),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *`,
      [name, description, parent_id, icon_url, display_order, is_active, id]
    );
    return result.rows[0];
  }

  // Kategori sil
  static async deleteCategory(id) {
    const result = await db.query(
      'DELETE FROM categories WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  // Kategori sıralamasını güncelle
  static async updateCategoryOrder(id, displayOrder) {
    const result = await db.query(
      `UPDATE categories SET
        display_order = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *`,
      [displayOrder, id]
    );
    return result.rows[0];
  }

  // Kategori ikonunu güncelle
  static async updateCategoryIcon(id, iconUrl) {
    const result = await db.query(
      `UPDATE categories SET
        icon_url = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *`,
      [iconUrl, id]
    );
    return result.rows[0];
  }

  // Kategoriye ait ürünleri getir
  static async getCategoryItems(categoryId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const result = await db.query(
      `SELECT i.*, c.name as category_name, u.first_name, u.last_name
       FROM items i
       JOIN categories c ON i.category_id = c.id
       JOIN users u ON i.owner_id = u.id
       WHERE i.category_id = $1 AND i.is_available = true
       ORDER BY i.created_at DESC
       LIMIT $2 OFFSET $3`,
      [categoryId, limit, offset]
    );
    return result.rows;
  }

  // Kategori ağacını getir
  static async getCategoryTree() {
    const result = await db.query(
      `WITH RECURSIVE category_tree AS (
        SELECT c.*, 1 as level
        FROM categories c
        WHERE c.parent_id IS NULL
        UNION ALL
        SELECT c.*, ct.level + 1
        FROM categories c
        JOIN category_tree ct ON c.parent_id = ct.id
      )
      SELECT * FROM category_tree
      ORDER BY level, display_order`
    );
    return result.rows;
  }
}

module.exports = Category; 