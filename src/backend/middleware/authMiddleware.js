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
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kullanıcıyı bul ve request'e ekle
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });
      next();
    } catch (error) {
      res.status(401).json({
        error: 'Authentication Error',
        message: 'Geçersiz token'
      });
    }
  }

  if (!token) {
    res.status(401).json({
      error: 'Authentication Error',
      message: 'Token bulunamadı'
    });
  }
}; 