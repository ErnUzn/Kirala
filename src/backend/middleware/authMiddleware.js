const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  // Token kontrolü
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Token'ı al
      token = req.headers.authorization.split(' ')[1];

      // Token'ı doğrula
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

      // Kullanıcıyı bul ve request'e ekle (MongoDB)
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          error: 'Authentication Error',
          message: 'Kullanıcı bulunamadı'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          error: 'Authentication Error',
          message: 'Kullanıcı hesabı aktif değil'
        });
      }

      req.user = user;
      req.userId = user._id;
      next();
    } catch (error) {
      console.error('Auth middleware hatası:', error);
      res.status(401).json({
        error: 'Authentication Error',
        message: 'Geçersiz token'
      });
    }
  } else {
    res.status(401).json({
      error: 'Authentication Error',
      message: 'Token bulunamadı'
    });
  }
}; 