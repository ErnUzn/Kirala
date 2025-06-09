/**
 * Kirala - Kimlik Doğrulama Middleware'i
 * 
 * Bu middleware, JWT tabanlı kimlik doğrulama işlemlerini gerçekleştirir.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Token'ı header'dan al
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Yetkilendirme token\'ı bulunamadı' });
    }

    // Token'ı doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Kullanıcıyı veritabanından bul
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Kullanıcı hesabı aktif değil' });
    }

    // Kullanıcı bilgisini request nesnesine ekle
    req.user = user;
    req.userId = user._id;
    req.token = token;
    
    next();
  } catch (error) {
    console.error('Auth middleware hatası:', error);
    return res.status(401).json({ message: 'Geçersiz token' });
  }
};

// Admin yetkisi kontrolü
const adminAuth = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin yetkisi gerekli' });
    }
    
    next();
  } catch (error) {
    console.error('Admin auth hatası:', error);
    return res.status(403).json({ message: 'Yetkisiz erişim' });
  }
};

module.exports = {
  auth,
  adminAuth
}; 