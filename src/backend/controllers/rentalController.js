const Rental = require('../models/Rental');
const Item = require('../models/Item');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Şimdilik basit rental controller
exports.getAllRentals = async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    console.error('Rental hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kiralama oluştur
exports.createRental = async (req, res) => {
  try {
    console.log('🏠 KIRALAMA OLUŞTURMA İSTEĞİ');
    console.log('- Request body:', req.body);
    console.log('- User ID:', req.user?._id);

    const { itemId, startDate, endDate, totalPrice } = req.body;
    const renterId = req.user._id;

    // Validasyon
    if (!itemId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: 'Tüm alanlar doldurulmalıdır'
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

    // Kendi ürününü kiralayamaz
    if (item.ownerInfo && item.ownerInfo.userId === renterId.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Kendi ürününüzü kiralayamazsınız'
      });
    }

    // Ürün sahibini bul
    let ownerId = null;
    if (item.ownerInfo && item.ownerInfo.userId) {
      ownerId = item.ownerInfo.userId;
    } else {
      // Fallback: ürün sahibini başka bir yolla bul
      const owner = await User.findOne({ email: 'test@example.com' });
      ownerId = owner ? owner._id.toString() : null;
    }

    if (!ownerId) {
      return res.status(400).json({
        success: false,
        message: 'Ürün sahibi bulunamadı'
      });
    }

    // Yeni kiralama oluştur (önce pending durumunda)
    const rental = new Rental({
      item: itemId,
      renter: renterId,
      owner: ownerId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice: parseFloat(totalPrice),
      status: 'pending', // Önce onay bekliyor
      paymentStatus: 'pending'
    });

    await rental.save();

    console.log('✅ Kiralama talebi başarıyla oluşturuldu:', rental._id);

    // Populate ile detayları getir
    const populatedRental = await Rental.findById(rental._id)
      .populate('item', 'name description dailyPrice images')
      .populate('renter', 'firstName lastName email')
      .populate('owner', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Kiralama talebi gönderildi. Ürün sahibinin onayını bekliyor.',
      rental: populatedRental
    });

  } catch (error) {
    console.error('Rental oluşturma hatası:', error);
    res.status(500).json({ 
      success: false,
      message: 'Kiralama oluşturulurken bir hata oluştu',
      error: error.message 
    });
  }
};

// Kiralama detayı getir
exports.getRentalById = async (req, res) => {
  try {
    const { id } = req.params;
    const rental = await Rental.findById(id)
      .populate('renter', 'firstName lastName email')
      .populate('item', 'name description dailyPrice images');

    if (!rental) {
      return res.status(404).json({ message: 'Kiralama bulunamadı' });
    }

    res.json(rental);
  } catch (error) {
    console.error('Kiralama getirme hatası:', error);
    res.status(500).json({ message: 'Kiralama getirilirken bir hata oluştu' });
  }
};

// Kiralama güncelle
exports.updateRental = async (req, res) => {
  try {
    res.json({ message: 'Kiralama güncellendi' });
  } catch (error) {
    console.error('Rental güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kiralama iptal et
exports.cancelRental = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({ message: 'Kiralama bulunamadı' });
    }

    rental.status = 'cancelled';
    await rental.save();

    // Ürünün durumunu güncelle
    await Item.findByIdAndUpdate(rental.item, { status: 'available' });

    res.json({ message: 'Kiralama iptal edildi', rental });
  } catch (error) {
    console.error('Kiralama iptal etme hatası:', error);
    res.status(500).json({ message: 'Kiralama iptal edilirken bir hata oluştu' });
  }
};

// Kiralama tamamla
exports.completeRental = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({ message: 'Kiralama bulunamadı' });
    }

    rental.status = 'completed';
    await rental.save();

    // Ürünün durumunu güncelle
    await Item.findByIdAndUpdate(rental.item, { status: 'available' });

    res.json({ message: 'Kiralama tamamlandı', rental });
  } catch (error) {
    console.error('Kiralama tamamlama hatası:', error);
    res.status(500).json({ message: 'Kiralama tamamlanırken bir hata oluştu' });
  }
};

// Kiralama talebini onayla
exports.approveRental = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Auth kontrolü
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false,
        message: 'Giriş yapmalısınız' 
      });
    }
    
    const userId = req.user._id;
    
    const rental = await Rental.findById(id)
      .populate('item', 'name ownerInfo owner')
      .populate('renter', 'firstName lastName email');
    
    if (!rental) {
      return res.status(404).json({ 
        success: false,
        message: 'Kiralama bulunamadı' 
      });
    }

    // Sadece ürün sahibi onaylayabilir (çift kontrol)
    const isOwner = (rental.item.ownerInfo && rental.item.ownerInfo.userId === userId.toString()) || 
                    (rental.item.owner && rental.item.owner.toString() === userId.toString());
    
    if (!isOwner) {
      console.log(`❌ Yetkisiz onaylama girişimi: UserId=${userId}, ItemOwner=${rental.item.ownerInfo?.userId || rental.item.owner}`);
      return res.status(403).json({ 
        success: false,
        message: 'Bu kiralama talebini onaylama yetkiniz yok' 
      });
    }

    // Sadece pending durumundaki kiralamalar onaylanabilir
    if (rental.status !== 'pending') {
      return res.status(400).json({ 
        success: false,
        message: 'Bu kiralama talebi zaten işleme alındı' 
      });
    }

    // Kiralama durumunu güncelle
    rental.status = 'approved';
    await rental.save();

    console.log(`✅ Kiralama onaylandı: ${id} by ${userId}`);

    res.json({
      success: true,
      message: 'Kiralama talebi onaylandı',
      rental
    });

  } catch (error) {
    console.error('Kiralama onaylama hatası:', error);
    res.status(500).json({ 
      success: false,
      message: 'Kiralama onaylanırken bir hata oluştu' 
    });
  }
};

// Kiralama talebini reddet
exports.rejectRental = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    // Auth kontrolü
    if (!req.user || !req.user._id) {
      return res.status(401).json({ 
        success: false,
        message: 'Giriş yapmalısınız' 
      });
    }
    
    const userId = req.user._id;
    
    const rental = await Rental.findById(id)
      .populate('item', 'name ownerInfo owner')
      .populate('renter', 'firstName lastName email');
    
    if (!rental) {
      return res.status(404).json({ 
        success: false,
        message: 'Kiralama bulunamadı' 
      });
    }

    // Sadece ürün sahibi reddedebilir (çift kontrol)
    const isOwner = (rental.item.ownerInfo && rental.item.ownerInfo.userId === userId.toString()) || 
                    (rental.item.owner && rental.item.owner.toString() === userId.toString());
    
    if (!isOwner) {
      console.log(`❌ Yetkisiz reddetme girişimi: UserId=${userId}, ItemOwner=${rental.item.ownerInfo?.userId || rental.item.owner}`);
      return res.status(403).json({ 
        success: false,
        message: 'Bu kiralama talebini reddetme yetkiniz yok' 
      });
    }

    // Sadece pending durumundaki kiralamalar reddedilebilir
    if (rental.status !== 'pending') {
      return res.status(400).json({ 
        success: false,
        message: 'Bu kiralama talebi zaten işleme alındı' 
      });
    }

    // Kiralama durumunu güncelle
    rental.status = 'rejected';
    if (reason) {
      rental.notes = reason;
    }
    await rental.save();

    console.log(`✅ Kiralama reddedildi: ${id} by ${userId}, reason: ${reason}`);

    res.json({
      success: true,
      message: 'Kiralama talebi reddedildi',
      rental
    });

  } catch (error) {
    console.error('Kiralama red hatası:', error);
    res.status(500).json({ 
      success: false,
      message: 'Kiralama reddedilirken bir hata oluştu' 
    });
  }
};

// Onaylanmış kiralamayı aktif hale getir (ödeme sonrası)
exports.activateRental = async (req, res) => {
  try {
    const { id } = req.params;
    
    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({ 
        success: false,
        message: 'Kiralama bulunamadı' 
      });
    }

    // Sadece onaylanmış kiralamalar aktif hale getirilebilir
    if (rental.status !== 'approved') {
      return res.status(400).json({ 
        success: false,
        message: 'Sadece onaylanmış kiralamalar aktif hale getirilebilir' 
      });
    }

    // Kiralama durumunu güncelle
    rental.status = 'active';
    rental.paymentStatus = 'paid';
    await rental.save();

    // Ürünün durumunu güncelle
    await Item.findByIdAndUpdate(rental.item, { status: 'rented' });

    res.json({
      success: true,
      message: 'Kiralama aktif hale getirildi',
      rental
    });

  } catch (error) {
    console.error('Kiralama aktivasyon hatası:', error);
    res.status(500).json({ 
      success: false,
      message: 'Kiralama aktif hale getirilirken bir hata oluştu' 
    });
  }
};

// Kullanıcının bekleyen kiralama taleplerini getir (ürün sahibi için)
exports.getPendingRentals = async (req, res) => {
  try {
    console.log('🔍 BEKLEYEN KİRALAMALAR İSTEĞİ - DOĞRU FONKSİYON ÇAĞRILDI');
    console.log('- URL:', req.originalUrl);
    console.log('- Method:', req.method);
    console.log('- User object full:', req.user);
    console.log('- User ID:', req.user?._id);
    console.log('- Auth header:', req.headers.authorization);
    console.log('- All headers:', req.headers);

    // Auth kontrolü - kullanıcı giriş yapmış mı?
    if (!req.user || !req.user._id) {
      console.log('❌ AUTH FAILED: User not found in request');
      return res.status(401).json({ 
        success: false,
        message: 'Giriş yapmalısınız' 
      });
    }

    const userId = req.user._id;
    console.log('✅ AUTH SUCCESS: User ID =', userId);

    // Sadece bu kullanıcının ürünlerini bul (hem ownerInfo.userId hem de owner field'ı ile)
    const userItems = await Item.find({
      $or: [
        { 'ownerInfo.userId': userId },
        { 'owner': userId }
      ]
    }).select('_id');
    
    const userItemIds = userItems.map(item => item._id);

    console.log(`- Kullanıcının ${userItemIds.length} ürünü bulundu`);

    // Bu ürünler için bekleyen kiralama taleplerini bul
    const pendingRentals = await Rental.find({
      status: 'pending',
      item: { $in: userItemIds }
    })
    .populate('item', 'name description dailyPrice images ownerInfo location')
    .populate('renter', 'firstName lastName email')
    .sort({ createdAt: -1 });

    // Ekstra güvenlik: sadece kullanıcının ürünleri için olan kiralamalar
    const filteredRentals = pendingRentals.filter(rental => {
      if (!rental.item || !rental.item.ownerInfo) return false;
      return rental.item.ownerInfo.userId === userId.toString();
    });

    console.log(`✅ ${filteredRentals.length} bekleyen kiralama bulundu`);

    res.json({
      success: true,
      rentals: filteredRentals
    });

  } catch (error) {
    console.error('Bekleyen kiralamalar getirme hatası:', error);
    res.status(500).json({ 
      success: false,
      message: 'Bekleyen kiralamalar getirilirken bir hata oluştu' 
    });
  }
};

// Kiralama değerlendirmesi ekle
exports.addRentalReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    const rental = await Rental.findById(id);
    if (!rental) {
      return res.status(404).json({ message: 'Kiralama bulunamadı' });
    }

    rental.review = {
      rating,
      comment,
      date: new Date()
    };
    await rental.save();

    res.json({ message: 'Değerlendirme eklendi', rental });
  } catch (error) {
    console.error('Değerlendirme ekleme hatası:', error);
    res.status(500).json({ message: 'Değerlendirme eklenirken bir hata oluştu' });
  }
};

// Kullanıcının kiralamalarını getir (güncellenmiş)
exports.getUserRentals = async (req, res) => {
  try {
    console.log('📋 KULLANICI KİRALAMALARI İSTEĞİ');
    console.log('- User ID:', req.user?._id);

    const userId = req.user._id;
    
    const rentals = await Rental.find({ renter: userId })
      .populate('item', 'name description dailyPrice weeklyPrice monthlyPrice images category location')
      .populate('owner', 'firstName lastName email')
      .sort({ createdAt: -1 });

    console.log(`✅ ${rentals.length} kiralama bulundu`);

    res.json({
      success: true,
      rentals
    });
  } catch (error) {
    console.error('Kullanıcı kiralamaları getirme hatası:', error);
    res.status(500).json({ 
      success: false,
      message: 'Kiralamalar getirilirken bir hata oluştu',
      error: error.message 
    });
  }
};

// Ürünün kiralamalarını getir
exports.getItemRentals = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const rentals = await Rental.find({ item: itemId })
      .populate('renter', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(rentals);
  } catch (error) {
    console.error('Ürün kiralamaları getirme hatası:', error);
    res.status(500).json({ message: 'Kiralamalar getirilirken bir hata oluştu' });
  }
};

// Ödeme başlat (placeholder)
exports.initiatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Gerçek uygulamada burada ödeme sağlayıcısı entegrasyonu olacak
    res.json({ message: 'Ödeme başlatıldı', paymentId: `payment_${Date.now()}` });
  } catch (error) {
    console.error('Ödeme başlatma hatası:', error);
    res.status(500).json({ message: 'Ödeme başlatılırken bir hata oluştu' });
  }
};

// Ödeme onayla (placeholder)
exports.confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Gerçek uygulamada burada ödeme onayı yapılacak
    res.json({ message: 'Ödeme onaylandı' });
  } catch (error) {
    console.error('Ödeme onaylama hatası:', error);
    res.status(500).json({ message: 'Ödeme onaylanırken bir hata oluştu' });
  }
};

// Ödeme iptal et (placeholder)
exports.cancelPayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Gerçek uygulamada burada ödeme iptali yapılacak
    res.json({ message: 'Ödeme iptal edildi' });
  } catch (error) {
    console.error('Ödeme iptal etme hatası:', error);
    res.status(500).json({ message: 'Ödeme iptal edilirken bir hata oluştu' });
  }
};

// Ödeme iadesi (placeholder)
exports.refundPayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Gerçek uygulamada burada ödeme iadesi yapılacak
    res.json({ message: 'Ödeme iadesi yapıldı' });
  } catch (error) {
    console.error('Ödeme iadesi hatası:', error);
    res.status(500).json({ message: 'Ödeme iadesi yapılırken bir hata oluştu' });
  }
};

// Kiralama mesajlarını getir (placeholder)
exports.getRentalMessages = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Gerçek uygulamada burada mesajlar getirilecek
    res.json([]);
  } catch (error) {
    console.error('Mesajları getirme hatası:', error);
    res.status(500).json({ message: 'Mesajlar getirilirken bir hata oluştu' });
  }
};

// Kiralama mesajı gönder (placeholder)
exports.sendRentalMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    
    // Gerçek uygulamada burada mesaj gönderilecek
    res.json({ message: 'Mesaj gönderildi' });
  } catch (error) {
    console.error('Mesaj gönderme hatası:', error);
    res.status(500).json({ message: 'Mesaj gönderilirken bir hata oluştu' });
  }
}; 