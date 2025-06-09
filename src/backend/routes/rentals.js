/**
 * Kirala - Kiralama Rotaları
 * 
 * Bu dosya, kiralama işlemleri için gerekli rotaları içerir.
 */

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const rentalController = require('../controllers/rentalController');

// ÖZEL ROUTE'LAR ÖNCE GELMELİ (parametreli route'lardan önce)

// Mevcut kullanıcının kiralamalarını listele
router.get('/my-rentals', auth, rentalController.getUserRentals);

// Bekleyen kiralama taleplerini getir (ürün sahibi için)
router.get('/pending-approvals', auth, rentalController.getPendingRentals);

// PARAMETRELİ ROUTE'LAR

// Kiralama talebi oluşturma
router.post('/', auth, rentalController.createRental);

// Kiralama detayı
router.get('/:id', auth, rentalController.getRentalById);

// Kiralama güncelleme
router.put('/:id', auth, rentalController.updateRental);

// Kiralama iptal etme
router.post('/:id/cancel', auth, rentalController.cancelRental);

// Kiralama tamamlama
router.post('/:id/complete', auth, rentalController.completeRental);

// Kiralama talebini onayla
router.post('/:id/approve', auth, rentalController.approveRental);

// Kiralama talebini reddet
router.post('/:id/reject', auth, rentalController.rejectRental);

// Onaylanmış kiralamayı aktif hale getir
router.post('/:id/activate', auth, rentalController.activateRental);

// Kiralama değerlendirme ekleme
router.post('/:id/review', auth, rentalController.addRentalReview);

// Kullanıcının kiralamalarını listele
router.get('/user/:userId', auth, rentalController.getUserRentals);

// Ürünün kiralamalarını listele
router.get('/item/:itemId', auth, rentalController.getItemRentals);

// Ödeme başlatma
router.post('/:id/payment/initiate', auth, rentalController.initiatePayment);

// Ödeme onaylama
router.post('/:id/payment/confirm', auth, rentalController.confirmPayment);

// Ödeme iptal etme
router.post('/:id/payment/cancel', auth, rentalController.cancelPayment);

// Ödeme iade etme
router.post('/:id/payment/refund', auth, rentalController.refundPayment);

// Kiralama mesajları
router.get('/:id/messages', auth, rentalController.getRentalMessages);

// Kiralama mesajı gönderme
router.post('/:id/messages', auth, rentalController.sendRentalMessage);

module.exports = router; 