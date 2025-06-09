const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const ratingController = require('../controllers/ratingController');

// Ürüne puan ver
router.post('/:itemId', auth, ratingController.rateItem);

// Ürünün puanlarını getir
router.get('/:itemId', ratingController.getItemRatings);

// Kullanıcının verdiği puanı getir
router.get('/:itemId/user', auth, ratingController.getUserRating);

module.exports = router; 