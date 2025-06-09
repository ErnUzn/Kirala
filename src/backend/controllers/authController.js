const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Token oluşturma fonksiyonu
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// Kayıt işlemi
exports.register = async (req, res) => {
  try {
    console.log('📝 REGISTER İSTEĞİ GELDİ');
    console.log('- Request body:', req.body);

    const { firstName, lastName, email, phone, password } = req.body;

    // Validasyon kontrolü
    if (!firstName || !lastName || !email || !phone || !password) {
      console.log('Missing required fields');
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Tüm alanlar doldurulmalıdır'
      });
    }

    // Email kontrolü
    console.log('Checking if email exists:', email);
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('Email already exists');
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Bu email adresi zaten kullanılıyor'
      });
    }

    // Şifreyi hash'le
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni kullanıcı oluştur
    console.log('Creating new user');
    try {
      const user = new User({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword, // Hash'lenmiş şifre
        role: 'user',
        isActive: true,
        isVerified: true
      });

      await user.save();

      console.log('User created successfully:', user._id);

      // Token oluştur
      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role
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
    console.log('🔐 LOGIN İSTEĞİ GELDİ');
    console.log('- Request body:', req.body);
    console.log('- Email:', req.body.email);
    console.log('- Password:', req.body.password);
    
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Email ve şifre kontrolü
    const user = await User.findOne({ email });
    console.log('- Kullanıcı bulundu mu?', !!user);
    
    if (!user) {
      console.log('User not found');
      return res.status(401).json({
        error: 'Authentication Error',
        message: 'Email veya şifre hatalı'
      });
    }

    console.log('- Kullanıcı bilgileri:', {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName
    });

    // Şifre kontrolü (bcrypt hash karşılaştırması)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('- Girilen şifre:', password);
    console.log('- Veritabanındaki şifre (hash):', user.password);
    console.log('- Şifre doğru mu?', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('Invalid password');
      return res.status(401).json({
        error: 'Authentication Error',
        message: 'Email veya şifre hatalı'
      });
    }

    console.log('Login successful for user:', user._id);

    // Token oluştur
    const token = generateToken(user._id);

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      error: 'Login Error',
      message: error.message
    });
  }
};

// Kullanıcı bilgilerini getir
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(400).json({
      error: 'User Error',
      message: error.message
    });
  }
};

// Profil güncelleme
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone } = req.body;

    // Email kontrolü (eğer email değiştiyse)
    const user = await User.findById(req.user._id);
    if (email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Bu email adresi zaten kullanılıyor'
        });
      }
    }

    // Kullanıcı bilgilerini güncelle
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
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