const Item = require('../models/item');
const { validationResult } = require('express-validator');

// Ürün oluştur
exports.createItem = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, category, stock, image, location, condition } = req.body;
    
    const newItem = await Item.create({
      name,
      description,
      price,
      category,
      stock,
      image,
      location,
      condition,
      rating: 0,
      reviewCount: 0
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.error('Ürün oluşturma hatası:', error);
    res.status(500).json({ message: 'Ürün oluşturulurken bir hata oluştu' });
  }
};

// Ürün güncelle
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, image, location, condition } = req.body;

    const updatedItem = await Item.update(id, {
      name,
      description,
      price,
      category,
      stock,
      image,
      location,
      condition
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
    const deletedItem = await Item.delete(id);

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
    const items = await Item.findAll();
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