/**
 * Kirala - Ürün Rotaları
 * 
 * Bu dosya, ürün işlemleri için gerekli rotaları içerir.
 */

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const itemController = require('../controllers/itemController');

// Tüm ürünleri listele
router.get('/', itemController.getAllItems);

// Kullanıcının kendi ürünlerini getir
router.get('/my-items', auth, itemController.getMyItems);

// Ürün detayı
router.get('/:id', itemController.getItemById);

// Ürün ekleme
router.post('/', auth, itemController.createItem);

// Ürün güncelleme
router.put('/:id', auth, itemController.updateItem);

// Ürün silme
router.delete('/:id', auth, itemController.deleteItem);

module.exports = router; 