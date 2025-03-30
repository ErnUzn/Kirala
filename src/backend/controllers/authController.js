const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Token oluşturma fonksiyonu
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Kayıt işlemi
exports.register = async (req, res) => {
  try {
    console.log('Register request received:', req.body);

    const { name, email, phone, password } = req.body;

    // Validasyon kontrolü
    if (!name || !email || !phone || !password) {
      console.log('Missing required fields');
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Tüm alanlar doldurulmalıdır'
      });
    }

    // Email kontrolü
    console.log('Checking if email exists:', email);
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      console.log('Email already exists');
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Bu email adresi zaten kullanılıyor'
      });
    }

    // Yeni kullanıcı oluştur
    console.log('Creating new user');
    try {
      const user = await User.create({
        name,
        email,
        phone,
        password
      });

      console.log('User created successfully:', user.id);

      // Token oluştur
      const token = generateToken(user.id);

      return res.status(201).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        },
        token
      });
    } catch (dbError) {
      console.error('Database error during user creation:', dbError);
      return res.status(400).json({
        error: 'Database Error',
        message: dbError.message || 'Veritabanı hatası, kullanıcı oluşturulamadı'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: 'Sunucu hatası, lütfen daha sonra tekrar deneyin'
    });
  }
};

// Giriş işlemi
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email ve şifre kontrolü
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        error: 'Authentication Error',
        message: 'Email veya şifre hatalı'
      });
    }

    // Token oluştur
    const token = generateToken(user.id);

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      token
    });
  } catch (error) {
    res.status(400).json({
      error: 'Login Error',
      message: error.message
    });
  }
};

// Kullanıcı bilgilerini getir
exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(400).json({
      error: 'User Error',
      message: error.message
    });
  }
};

// Profil güncelleme
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // Email kontrolü (eğer email değiştiyse)
    const user = await User.findByPk(req.user.id);
    if (email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Bu email adresi zaten kullanılıyor'
        });
      }
    }

    // Kullanıcı bilgilerini güncelle
    await user.update({
      name,
      email,
      phone
    });

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(400).json({
      error: 'Update Error',
      message: error.message
    });
  }
}; 