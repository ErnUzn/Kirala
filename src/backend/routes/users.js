/**
 * Kirala - Kullanıcı Rotaları
 * 
 * Bu dosya, kullanıcı işlemleri için gerekli rotaları içerir.
 */

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Kullanıcı kayıt
router.post('/register', userController.register);

// Kullanıcı giriş
router.post('/login', userController.login);

// Kullanıcı profili
router.get('/profile', auth, userController.getProfile);

// Profil güncelleme
router.put('/profile', auth, userController.updateProfile);

// Tüm kullanıcıları getir (Admin)
router.get('/', auth, userController.getAllUsers);

module.exports = router; 