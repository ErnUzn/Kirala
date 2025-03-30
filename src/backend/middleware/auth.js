/**
 * Kirala - Kimlik Doğrulama Middleware'i
 * 
 * Bu middleware, JWT tabanlı kimlik doğrulama işlemlerini gerçekleştirir.
 */

const jwt = require('jsonwebtoken');
const { db } = require('../database/db');

const auth = async (req, res, next) => {
  try {
    // Token'ı header'dan al
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Yetkilendirme token\'ı bulunamadı');
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Kullanıcıyı veritabanından bul
    const result = await db.query(
      'SELECT id, email, first_name, last_name, is_active FROM users WHERE id = $1',
      [decoded.userId]
    );

    const user = result.rows[0];
    
    if (!user) {
      throw new Error('Kullanıcı bulunamadı');
    }

    if (!user.is_active) {
      throw new Error('Kullanıcı hesabı aktif değil');
    }

    // Kullanıcı bilgisini request nesnesine ekle
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    error.name = 'UnauthorizedError';
    next(error);
  }
};

// Admin yetkisi kontrolü
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, async () => {
      const result = await db.query(
        'SELECT au.*, r.name as role_name FROM admin_users au JOIN roles r ON au.role_id = r.id WHERE au.user_id = $1 AND au.is_active = true',
        [req.user.id]
      );

      if (result.rows.length === 0) {
        throw new Error('Admin yetkisi bulunamadı');
      }

      req.admin = result.rows[0];
      next();
    });
  } catch (error) {
    error.name = 'ForbiddenError';
    next(error);
  }
};

module.exports = {
  auth,
  adminAuth
}; 