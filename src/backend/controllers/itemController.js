const Item = require('../models/Item');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Ürün oluştur
exports.createItem = async (req, res) => {
  try {
    const { name, description, category, price, dailyPrice, weeklyPrice, monthlyPrice, condition, location, features, images, ownerInfo } = req.body;
    
    const newItem = new Item({
      name,
      description,
      category,
      price,
      dailyPrice,
      weeklyPrice,
      monthlyPrice,
      condition,
      location,
      features,
      images,
      owner: req.user?._id || new mongoose.Types.ObjectId(), // Geçici owner
      ownerInfo: ownerInfo || {
        userId: req.user?._id?.toString() || `user_${Date.now()}`,
        userName: 'Kullanıcı',
        userEmail: ''
      }
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Ürün oluşturma hatası:', error);
    res.status(500).json({ message: 'Ürün oluşturulurken bir hata oluştu' });
  }
};

// Kullanıcının kendi ürünlerini getir
exports.getMyItems = async (req, res) => {
  try {
    // Auth middleware'den gelen user ID'sini kullan
    const userId = req.user?._id || req.query.userId;
    
    console.log('🔍 getMyItems çağrıldı:');
    console.log('- req.user._id:', req.user?._id);
    console.log('- req.query.userId:', req.query.userId);
    console.log('- Kullanılacak userId:', userId);
    
    if (!userId) {
      return res.status(400).json({ message: 'Kullanıcı ID gereklidir' });
    }

    // Önce ownerInfo.userId ile ara, sonra owner field'ı ile ara
    let items = await Item.find({ 'ownerInfo.userId': userId }).sort({ createdAt: -1 });
    console.log('- ownerInfo.userId ile bulunan ürün sayısı:', items.length);
    
    // Eğer ownerInfo.userId ile bulunamazsa, owner field'ı ile ara (ObjectId olarak)
    if (items.length === 0) {
      try {
        items = await Item.find({ owner: userId }).sort({ createdAt: -1 });
        console.log('- owner field ile bulunan ürün sayısı:', items.length);
      } catch (error) {
        console.log('- ObjectId cast hatası:', error.message);
        // ObjectId cast hatası durumunda boş array döndür
        items = [];
      }
    }
    
    console.log('- Toplam döndürülen ürün sayısı:', items.length);
    res.json(items);
    
  } catch (error) {
    console.error('Kullanıcı ürünleri getirme hatası:', error);
    res.status(500).json({ message: 'Ürünler getirilirken bir hata oluştu' });
  }
};

// Ürün güncelle
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedItem = await Item.findByIdAndUpdate(id, updateData, { 
      new: true, 
      runValidators: true 
    });

    if (!updatedItem) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error('Ürün güncelleme hatası:', error);
    res.status(500).json({ message: 'Ürün güncellenirken bir hata oluştu' });
  }
};

// Ürün sil
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    res.json({ message: 'Ürün başarıyla silindi' });
  } catch (error) {
    console.error('Ürün silme hatası:', error);
    res.status(500).json({ message: 'Ürün silinirken bir hata oluştu' });
  }
};

// Tüm ürünleri getir
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find({ status: 'available' }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Ürünleri getirme hatası:', error);
    res.status(500).json({ message: 'Ürünler getirilirken bir hata oluştu' });
  }
};

// Tek ürün getir
exports.getItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }

    res.json(item);
  } catch (error) {
    console.error('Ürün getirme hatası:', error);
    res.status(500).json({ message: 'Ürün getirilirken bir hata oluştu' });
  }
}; 