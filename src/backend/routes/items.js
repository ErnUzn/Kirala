/**
 * Kirala - Ürün Rotaları
 * 
 * Bu dosya, ürün işlemleri için gerekli rotaları içerir.
 */

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { validate, itemSchemas } = require('../middleware/validation');
const itemController = require('../controllers/itemController');

// Tüm ürünleri listele
router.get('/', itemController.getAllItems);

// Ürün detayı
router.get('/:id', itemController.getItemById);

// Ürün ekleme
router.post('/', auth, validate(itemSchemas.create), itemController.createItem);

// Ürün güncelleme
router.put('/:id', auth, validate(itemSchemas.update), itemController.updateItem);

// Ürün silme
router.delete('/:id', auth, itemController.deleteItem);

// Ürün fotoğrafı ekleme
router.post('/:id/photos', auth, itemController.addItemPhotos);

// Ürün fotoğrafı silme
router.delete('/:id/photos/:photoId', auth, itemController.deleteItemPhoto);

// Ürün müsaitlik durumu güncelleme
router.put('/:id/availability', auth, itemController.updateAvailability);

// Ürün değerlendirme ekleme
router.post('/:id/reviews', auth, itemController.addReview);

// Ürün değerlendirme güncelleme
router.put('/:id/reviews/:reviewId', auth, itemController.updateReview);

// Ürün değerlendirme silme
router.delete('/:id/reviews/:reviewId', auth, itemController.deleteReview);

// Ürün arama
router.get('/search', itemController.searchItems);

// Kategoriye göre ürünleri listele
router.get('/category/:categoryId', itemController.getItemsByCategory);

// Kullanıcının ürünlerini listele
router.get('/user/:userId', itemController.getUserItems);

module.exports = router; 