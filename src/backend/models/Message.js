const mongoose = require('mongoose');

const discountOfferSchema = new mongoose.Schema({
  percentage: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  originalPrice: {
    type: Number,
    required: true
  },
  discountedPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
});

const messageSchema = new mongoose.Schema({
  // Sohbet kimliği (iki kullanıcı arasında benzersiz)
  chatId: {
    type: String,
    required: true,
    index: true
  },
  
  // Hangi ürün hakkında konuşuluyor
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  
  // Mesajı gönderen
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Mesajı alan
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Mesaj içeriği
  content: {
    type: String,
    required: true,
    trim: true
  },
  
  // Mesaj tipi (normal mesaj mı, indirim teklifi mi?)
  messageType: {
    type: String,
    enum: ['text', 'discount_offer'],
    default: 'text'
  },
  
  // İndirim teklifi detayları
  discountOffer: discountOfferSchema,
  
  // Okunma durumu
  isRead: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Chatlar için compound index
messageSchema.index({ chatId: 1, createdAt: 1 });

// Kullanıcının mesajları için index
messageSchema.index({ senderId: 1, createdAt: -1 });
messageSchema.index({ receiverId: 1, createdAt: -1 });

// ChatId oluşturmak için helper fonksiyon
messageSchema.statics.generateChatId = function(userId1, userId2, itemId) {
  // İki kullanıcı ID'sini alfabetik sıraya koy, böylece aynı chat ID'si oluşsun
  const sortedIds = [userId1.toString(), userId2.toString()].sort();
  return `${sortedIds[0]}_${sortedIds[1]}_${itemId}`;
};

module.exports = mongoose.model('Message', messageSchema); 