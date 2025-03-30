/**
 * Kirala - Kimlik Doğrulama Rotaları
 * 
 * Bu dosya, kullanıcı kimlik doğrulama işlemleri için gerekli rotaları içerir.
 */

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { validate, userSchemas } = require('../middleware/validation');
const authController = require('../controllers/authController');

// Kayıt ol
router.post('/register', validate(userSchemas.register), authController.register);

// Giriş yap
router.post('/login', validate(userSchemas.login), authController.login);

// Çıkış yap
router.post('/logout', auth, authController.logout);

// Şifre sıfırlama isteği
router.post('/forgot-password', authController.forgotPassword);

// Şifre sıfırlama
router.post('/reset-password', authController.resetPassword);

// E-posta doğrulama
router.get('/verify-email/:token', authController.verifyEmail);

// Yeni doğrulama e-postası gönder
router.post('/resend-verification', auth, authController.resendVerification);

module.exports = router; 