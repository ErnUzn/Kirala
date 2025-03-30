/**
 * Kirala - Kategori Rotaları
 * 
 * Bu dosya, kategori işlemleri için gerekli rotaları içerir.
 */

const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const categoryController = require('../controllers/categoryController');

// Tüm kategorileri listele
router.get('/', categoryController.getAllCategories);

// Kategori detayı
router.get('/:id', categoryController.getCategoryById);

// Alt kategorileri listele
router.get('/:id/subcategories', categoryController.getSubcategories);

// Kategoriye ait ürünleri listele
router.get('/:id/items', categoryController.getCategoryItems);

// Kategori ekleme (Admin)
router.post('/', auth, adminAuth, categoryController.createCategory);

// Kategori güncelleme (Admin)
router.put('/:id', auth, adminAuth, categoryController.updateCategory);

// Kategori silme (Admin)
router.delete('/:id', auth, adminAuth, categoryController.deleteCategory);

// Kategori sıralama güncelleme (Admin)
router.put('/:id/order', auth, adminAuth, categoryController.updateCategoryOrder);

// Kategori ikonu güncelleme (Admin)
router.put('/:id/icon', auth, adminAuth, categoryController.updateCategoryIcon);

module.exports = router; 