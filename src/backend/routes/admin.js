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
router.get('/dashboard/stats', auth, adminAuth, adminController.getDashboardStats);
router.get('/dashboard/activity', auth, adminAuth, adminController.getRecentActivity);

// Kullanıcı yönetimi
router.get('/users', auth, adminAuth, adminController.getAllUsers);
router.put('/users/:id/status', auth, adminAuth, adminController.updateUserStatus);
router.delete('/users/:id', auth, adminAuth, adminController.deleteUser);

// Ürün yönetimi
router.get('/items', auth, adminAuth, adminController.getAllItems);
router.put('/items/:id/status', auth, adminAuth, adminController.updateItemStatus);
router.delete('/items/:id', auth, adminAuth, adminController.deleteItem);

// Kiralama yönetimi
router.get('/rentals', auth, adminAuth, adminController.getAllRentals);
router.put('/rentals/:id/status', auth, adminAuth, adminController.updateRentalStatus);

// Ödeme yönetimi
router.get('/payments', auth, adminAuth, adminController.getPayments);

// Rapor ve analitik
router.get('/reports', auth, adminAuth, adminController.getReports);

module.exports = router; 