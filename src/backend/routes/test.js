const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Test endpoint'i
router.get('/test', async (req, res) => {
    try {
        // Test kullanıcısı oluştur
        const testUser = new User({
            username: 'testuser',
            email: 'test@example.com',
            password: 'password123',
            fullName: 'Test User',
            phone: '1234567890',
            address: 'Test Address'
        });

        // Kullanıcıyı kaydet
        await testUser.save();

        res.json({
            success: true,
            message: 'Test kullanıcısı oluşturuldu',
            user: testUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Test hatası',
            error: error.message
        });
    }
});

module.exports = router; 