const User = require('../models/User');
const Item = require('../models/item');
const Rental = require('../models/rental');
const { validationResult } = require('express-validator');

// Tüm kullanıcıları getir
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Kullanıcıları getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kullanıcı sil
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    res.json({ message: 'Kullanıcı silindi' });
  } catch (error) {
    console.error('Kullanıcı silme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kullanıcı durumunu güncelle
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Kullanıcı durumu güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Tüm ürünleri getir
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error('Ürünleri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Ürün durumunu güncelle
exports.updateItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const item = await Item.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!item) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('Ürün durumu güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Ürün sil
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    const item = await Item.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: 'Ürün bulunamadı' });
    }
    
    res.json({ message: 'Ürün silindi' });
  } catch (error) {
    console.error('Ürün silme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Tüm kiralamaları getir
exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate('item', 'name dailyPrice images')
      .populate('renter', 'firstName lastName email')
      .populate('owner', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    res.json(rentals);
  } catch (error) {
    console.error('Kiralamaları getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kiralama durumunu güncelle
exports.updateRentalStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const rental = await Rental.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('item', 'name').populate('renter', 'firstName lastName');
    
    if (!rental) {
      return res.status(404).json({ message: 'Kiralama bulunamadı' });
    }
    
    res.json(rental);
  } catch (error) {
    console.error('Kiralama durumu güncelleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Dashboard istatistikleri
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalItems = await Item.countDocuments();
    const availableItems = await Item.countDocuments({ status: 'available' });
    const totalRentals = await Rental.countDocuments();
    const activeRentals = await Rental.countDocuments({ status: { $in: ['approved', 'active'] } });
    const pendingRentals = await Rental.countDocuments({ status: 'pending' });
    
    // Gelir hesaplama
    const completedRentals = await Rental.find({ status: 'completed' });
    const totalRevenue = completedRentals.reduce((sum, rental) => sum + rental.totalPrice, 0);
    
    res.json({
      totalUsers,
      activeUsers,
      totalItems,
      availableItems,
      totalRentals,
      activeRentals,
      pendingRentals,
      totalRevenue
    });
  } catch (error) {
    console.error('Dashboard stats hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Son aktiviteler
exports.getRecentActivity = async (req, res) => {
  try {
    const recentItems = await Item.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name createdAt ownerInfo category');
    
    const recentRentals = await Rental.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('item', 'name')
      .populate('renter', 'firstName lastName');
    
    res.json({
      recentItems,
      recentRentals
    });
  } catch (error) {
    console.error('Recent activity hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Ödeme istatistikleri ve listesi
exports.getPayments = async (req, res) => {
  try {
    const rentals = await Rental.find({ paymentStatus: { $in: ['paid', 'pending'] } })
      .populate('item', 'name')
      .populate('renter', 'firstName lastName email')
      .populate('owner', 'firstName lastName')
      .sort({ createdAt: -1 });

    // Ödeme verilerini formatla
    const payments = rentals.map(rental => ({
      id: rental._id,
      transactionId: `TXN-${rental._id.toString().slice(-6)}`,
      rentalId: rental._id,
      userId: rental.renter._id,
      userName: `${rental.renter.firstName} ${rental.renter.lastName}`,
      userEmail: rental.renter.email,
      amount: rental.totalPrice,
      method: 'Kredi Kartı', // Default method
      status: rental.paymentStatus === 'paid' ? 'Tamamlandı' : 'Beklemede',
      date: rental.createdAt,
      itemName: rental.item.name,
      type: 'Kiralama Ödemesi'
    }));

    // İstatistikler
    const totalAmount = rentals
      .filter(r => r.paymentStatus === 'paid')
      .reduce((sum, rental) => sum + rental.totalPrice, 0);
    
    const totalTransactions = rentals.filter(r => r.paymentStatus === 'paid').length;
    const pendingAmount = rentals
      .filter(r => r.paymentStatus === 'pending')
      .reduce((sum, rental) => sum + rental.totalPrice, 0);

    res.json({
      payments,
      statistics: {
        totalAmount,
        totalTransactions,
        pendingAmount,
        refundedAmount: 0 // TODO: İleride iade sistemi eklenince
      }
    });
  } catch (error) {
    console.error('Ödeme verileri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Rapor verileri
exports.getReports = async (req, res) => {
  try {
    // Aylık trend verileri
    const monthlyData = await Rental.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      },
      {
        $limit: 6
      }
    ]);

    // Kategori dağılımı
    const categoryData = await Item.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // En çok kiralanan ürünler
    const topProducts = await Rental.aggregate([
      {
        $group: {
          _id: '$item',
          rentals: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      {
        $lookup: {
          from: 'items',
          localField: '_id',
          foreignField: '_id',
          as: 'itemInfo'
        }
      },
      {
        $unwind: '$itemInfo'
      },
      {
        $sort: { rentals: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          name: '$itemInfo.name',
          rentals: 1,
          revenue: 1
        }
      }
    ]);

    res.json({
      monthlyData: monthlyData.map(item => ({
        month: getMonthName(item._id.month),
        kiralamalar: item.count,
        gelir: item.revenue
      })),
      categoryData: categoryData.map(item => ({
        name: item._id,
        count: item.count,
        value: Math.round((item.count / categoryData.reduce((sum, cat) => sum + cat.count, 0)) * 100)
      })),
      topProducts: topProducts.map(item => ({
        name: item.name,
        kiralamalar: item.rentals,
        gelir: `₺${item.revenue.toFixed(0)}`
      }))
    });
  } catch (error) {
    console.error('Rapor verileri getirme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Yardımcı fonksiyon - ay adı
function getMonthName(monthNumber) {
  const months = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];
  return months[monthNumber - 1];
} 