const Message = require('../models/Message');
const Item = require('../models/Item');
const User = require('../models/User');

// Helper function to create chat ID
const createChatId = (userId1, userId2, itemId) => {
  const sortedIds = [userId1.toString(), userId2.toString()].sort();
  return `${sortedIds[0]}_${sortedIds[1]}_${itemId}`;
};

// Mesaj gönder
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, itemId, content, messageType = 'text', discountOffer } = req.body;
    const senderId = req.user._id;

    // Gerekli alanları kontrol et
    if (!receiverId || !itemId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Alıcı, ürün ve mesaj içeriği gerekli'
      });
    }

    // Ürünü kontrol et
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Ürün bulunamadı'
      });
    }

    // Alıcıyı kontrol et
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Alıcı bulunamadı'
      });
    }

    // Chat ID oluştur
    const chatId = createChatId(senderId.toString(), receiverId, itemId);

    // Mesaj oluştur
    const messageData = {
      chatId,
      senderId,
      receiverId,
      itemId,
      content,
      messageType
    };

    // İndirim teklifi ise özel işlem
    if (messageType === 'discount_offer' && discountOffer) {
      const originalPrice = item.dailyPrice;
      const discountedPrice = originalPrice - (originalPrice * discountOffer.percentage / 100);
      
      messageData.discountOffer = {
        percentage: discountOffer.percentage,
        originalPrice,
        discountedPrice,
        status: 'pending'
      };
    }

    const message = new Message(messageData);
    await message.save();

    // Populate sender bilgilerini getir
    await message.populate('senderId', 'firstName lastName userName');
    await message.populate('receiverId', 'firstName lastName userName');

    res.status(201).json({
      success: true,
      message: 'Mesaj gönderildi',
      data: message
    });

  } catch (error) {
    console.error('Mesaj gönderme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Mesaj gönderilemedi',
      error: error.message
    });
  }
};

// Chat geçmişini getir
exports.getChatHistory = async (req, res) => {
  try {
    const { otherUserId, itemId } = req.params;
    const currentUserId = req.user._id;

    console.log('🔍 Chat geçmişi isteği:', {
      otherUserId,
      itemId,
      currentUserId: currentUserId.toString()
    });

    if (!otherUserId || !itemId) {
      return res.status(400).json({
        success: false,
        message: 'Diğer kullanıcı ID ve ürün ID gerekli'
      });
    }

    // Chat ID oluştur
    const chatId = createChatId(currentUserId.toString(), otherUserId, itemId);
    console.log('📝 Oluşturulan chatId:', chatId);

    // Mesajları getir
    const messages = await Message.find({
      chatId,
      itemId
    })
    .populate('senderId', 'firstName lastName userName')
    .populate('receiverId', 'firstName lastName userName')
    .sort({ createdAt: 1 });

    console.log('📨 Bulunan mesajlar:', messages.length);

    // Okunmayan mesajları okundu olarak işaretle
    await Message.updateMany(
      {
        chatId,
        itemId,
        receiverId: currentUserId,
        isRead: false
      },
      {
        isRead: true
      }
    );

    res.json({
      success: true,
      data: messages
    });

  } catch (error) {
    console.error('Chat geçmişi getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Chat geçmişi getirilemedi',
      error: error.message
    });
  }
};

// İndirim teklifine yanıt ver
exports.respondToDiscountOffer = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { response } = req.body; // 'accepted' veya 'rejected'
    const userId = req.user._id;

    if (!['accepted', 'rejected'].includes(response)) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz yanıt. Sadece "accepted" veya "rejected" kabul edilir'
      });
    }

    // Mesajı bul ve güncelle
    const message = await Message.findById(messageId)
      .populate('senderId', 'firstName lastName userName')
      .populate('receiverId', 'firstName lastName userName');

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Mesaj bulunamadı'
      });
    }

    // Sadece mesaj alıcısı yanıtlayabilir
    if (message.receiverId._id.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Bu mesaja yanıt verme yetkiniz yok'
      });
    }

    // Sadece beklemede olan tekliflere yanıt verilebilir
    if (message.discountOffer.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Bu teklif zaten yanıtlanmış'
      });
    }

    // İndirim teklifi durumunu güncelle
    message.discountOffer.status = response;
    await message.save();

    // Yanıt mesajı gönder
    const responseContent = response === 'accepted' 
      ? `%${message.discountOffer.percentage} indirim teklifiniz kabul edildi!`
      : `%${message.discountOffer.percentage} indirim teklifiniz reddedildi.`;

    const responseMessage = new Message({
      chatId: message.chatId,
      senderId: userId,
      receiverId: message.senderId._id,
      itemId: message.itemId,
      content: responseContent,
      messageType: 'text'
    });

    await responseMessage.save();
    await responseMessage.populate('senderId', 'firstName lastName userName');
    await responseMessage.populate('receiverId', 'firstName lastName userName');

    res.json({
      success: true,
      message: 'İndirim teklifine yanıt verildi',
      data: {
        originalMessage: message,
        responseMessage
      }
    });

  } catch (error) {
    console.error('İndirim teklifi yanıtlama hatası:', error);
    res.status(500).json({
      success: false,
      message: 'İndirim teklifine yanıt verilemedi',
      error: error.message
    });
  }
};

// Kullanıcının chat listesini getir
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Kullanıcının dahil olduğu mesajları getir (son mesajlar)
    const chats = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            chatId: '$chatId',
            itemId: '$itemId'
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$receiverId', userId] },
                    { $eq: ['$isRead', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.senderId',
          foreignField: '_id',
          as: 'sender'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'lastMessage.receiverId',
          foreignField: '_id',
          as: 'receiver'
        }
      },
      {
        $lookup: {
          from: 'items',
          localField: 'lastMessage.itemId',
          foreignField: '_id',
          as: 'item'
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    res.json({
      success: true,
      data: chats
    });

  } catch (error) {
    console.error('Chat listesi getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Chat listesi getirilemedi',
      error: error.message
    });
  }
};

// Debug: Tüm mesajları listele
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({})
      .populate('senderId', 'firstName lastName userName')
      .populate('receiverId', 'firstName lastName userName')
      .sort({ createdAt: -1 });

    console.log('🗂️ Veritabanındaki tüm mesajlar:', messages.length);
    messages.forEach(msg => {
      console.log(`📝 Mesaj: ${msg.content} | ChatId: ${msg.chatId} | ItemId: ${msg.itemId}`);
    });

    res.json({
      success: true,
      data: messages,
      count: messages.length
    });

  } catch (error) {
    console.error('Tüm mesajları getirme hatası:', error);
    res.status(500).json({
      success: false,
      message: 'Mesajlar getirilemedi',
      error: error.message
    });
  }
}; 