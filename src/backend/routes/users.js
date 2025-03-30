/**
 * Kirala - Kullanıcı Rotaları
 * 
 * Bu dosya, kullanıcı işlemleri için gerekli rotaları içerir.
 */

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { validate, userSchemas } = require('../middleware/validation');
const userController = require('../controllers/userController');

// Kullanıcı profili
router.get('/profile', auth, userController.getProfile);

// Profil güncelleme
router.put('/profile', auth, validate(userSchemas.update), userController.updateProfile);

// Profil fotoğrafı yükleme
router.post('/profile/photo', auth, userController.uploadProfilePhoto);

// Adres ekleme
router.post('/addresses', auth, userController.addAddress);

// Adres güncelleme
router.put('/addresses/:id', auth, userController.updateAddress);

// Adres silme
router.delete('/addresses/:id', auth, userController.deleteAddress);

// Varsayılan adres belirleme
router.put('/addresses/:id/default', auth, userController.setDefaultAddress);

// Kiralama geçmişi
router.get('/rentals', auth, userController.getRentalHistory);

// Değerlendirme geçmişi
router.get('/reviews', auth, userController.getReviewHistory);

// Bildirimler
router.get('/notifications', auth, userController.getNotifications);

// Bildirim okundu işaretleme
router.put('/notifications/:id/read', auth, userController.markNotificationAsRead);

// Tüm bildirimleri okundu işaretleme
router.put('/notifications/read-all', auth, userController.markAllNotificationsAsRead);

// Hesap silme
router.delete('/account', auth, userController.deleteAccount);

module.exports = router; 