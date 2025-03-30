/**
 * Kirala - API Rotaları
 * 
 * Bu dosya, tüm API rotalarını birleştirir ve yapılandırır.
 */

const express = require('express');
const router = express.Router();

// Alt rotaları içe aktar
const authRoutes = require('./auth');
const userRoutes = require('./users');
const itemRoutes = require('./items');
const rentalRoutes = require('./rentals');
const categoryRoutes = require('./categories');
const adminRoutes = require('./admin');

// Rotaları yapılandır
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/items', itemRoutes);
router.use('/rentals', rentalRoutes);
router.use('/categories', categoryRoutes);
router.use('/admin', adminRoutes);

module.exports = router; 