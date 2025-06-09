const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const messageController = require('../controllers/messageController');

// Tüm route'lar auth middleware kullanır
router.use(auth);

// Debug: Tüm mesajları listele
router.get('/debug/all', messageController.getAllMessages);

// Mesaj gönder
router.post('/', messageController.sendMessage);

// Chat geçmişini getir
router.get('/chat/:otherUserId/:itemId', messageController.getChatHistory);

// Kullanıcının chat listesi
router.get('/chats', messageController.getUserChats);

// İndirim teklifine yanıt ver
router.post('/:messageId/respond', messageController.respondToDiscountOffer);

module.exports = router; 