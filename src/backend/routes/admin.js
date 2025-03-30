/**
 * Kirala - Admin Paneli Rotaları
 * 
 * Bu dosya, admin paneli işlemleri için gerekli rotaları içerir.
 */

const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Dashboard istatistikleri
router.get('/dashboard', auth, adminAuth, adminController.getDashboardStats);

// Kullanıcı yönetimi
router.get('/users', auth, adminAuth, adminController.getUsers);
router.get('/users/:id', auth, adminAuth, adminController.getUserById);
router.put('/users/:id', auth, adminAuth, adminController.updateUser);
router.delete('/users/:id', auth, adminAuth, adminController.deleteUser);
router.put('/users/:id/verify', auth, adminAuth, adminController.verifyUser);

// Ürün yönetimi
router.get('/items', auth, adminAuth, adminController.getItems);
router.get('/items/:id', auth, adminAuth, adminController.getItemById);
router.put('/items/:id', auth, adminAuth, adminController.updateItem);
router.delete('/items/:id', auth, adminAuth, adminController.deleteItem);
router.put('/items/:id/approve', auth, adminAuth, adminController.approveItem);

// Kiralama yönetimi
router.get('/rentals', auth, adminAuth, adminController.getRentals);
router.get('/rentals/:id', auth, adminAuth, adminController.getRentalById);
router.put('/rentals/:id', auth, adminAuth, adminController.updateRental);
router.put('/rentals/:id/approve', auth, adminAuth, adminController.approveRental);
router.put('/rentals/:id/reject', auth, adminAuth, adminController.rejectRental);

// Ödeme yönetimi
router.get('/payments', auth, adminAuth, adminController.getPayments);
router.get('/payments/:id', auth, adminAuth, adminController.getPaymentById);
router.put('/payments/:id', auth, adminAuth, adminController.updatePayment);
router.post('/payments/:id/refund', auth, adminAuth, adminController.refundPayment);

// Değerlendirme yönetimi
router.get('/reviews', auth, adminAuth, adminController.getReviews);
router.get('/reviews/:id', auth, adminAuth, adminController.getReviewById);
router.put('/reviews/:id', auth, adminAuth, adminController.updateReview);
router.delete('/reviews/:id', auth, adminAuth, adminController.deleteReview);
router.put('/reviews/:id/approve', auth, adminAuth, adminController.approveReview);

// Sistem ayarları
router.get('/settings', auth, adminAuth, adminController.getSettings);
router.put('/settings', auth, adminAuth, adminController.updateSettings);
router.get('/settings/:key', auth, adminAuth, adminController.getSetting);
router.put('/settings/:key', auth, adminAuth, adminController.updateSetting);

// Admin kullanıcı yönetimi
router.get('/admins', auth, adminAuth, adminController.getAdmins);
router.post('/admins', auth, adminAuth, adminController.createAdmin);
router.put('/admins/:id', auth, adminAuth, adminController.updateAdmin);
router.delete('/admins/:id', auth, adminAuth, adminController.deleteAdmin);

// Raporlar
router.get('/reports/users', auth, adminAuth, adminController.getUserReport);
router.get('/reports/items', auth, adminAuth, adminController.getItemReport);
router.get('/reports/rentals', auth, adminAuth, adminController.getRentalReport);
router.get('/reports/payments', auth, adminAuth, adminController.getPaymentReport);

module.exports = router; 