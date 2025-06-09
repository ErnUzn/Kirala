const Item = require('../models/item');
const User = require('../models/User');

console.log('Item model:', Item); // Debug log

// Ürüne puan ver
exports.rateItem = async (req, res) => {
    try {
        console.log('Rating request received:', req.params, req.body); // Debug log
        const { itemId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.userId;

        // Girdi validasyonu
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Puan 1-5 arasında olmalıdır'
            });
        }

        // Ürünü bul
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }

        // Kullanıcı bilgilerini al
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        // rating ve reviews alanlarını initialize et (eğer yoksa)
        if (!item.rating) {
            item.rating = { average: 0, count: 0, total: 0 };
        }
        if (!item.reviews) {
            item.reviews = [];
        }

        // Kullanıcının daha önce bu ürünü puanladığını kontrol et
        const existingReviewIndex = item.reviews.findIndex(
            review => review.user.toString() === userId.toString()
        );

        if (existingReviewIndex !== -1) {
            // Mevcut puanı güncelle
            const oldRating = item.reviews[existingReviewIndex].rating;
            item.reviews[existingReviewIndex].rating = rating;
            item.reviews[existingReviewIndex].comment = comment || '';
            item.reviews[existingReviewIndex].createdAt = new Date();

            // Rating ortalamasını güncelle
            item.rating.total = item.rating.total - oldRating + rating;
            item.rating.average = item.rating.total / item.rating.count;
        } else {
            // Yeni puan ekle
            item.reviews.push({
                user: userId,
                userName: `${user.firstName} ${user.lastName}`,
                rating: rating,
                comment: comment || '',
                createdAt: new Date()
            });

            // Rating istatistiklerini güncelle
            item.rating.count += 1;
            item.rating.total += rating;
            item.rating.average = item.rating.total / item.rating.count;
        }

        await item.save();

        res.json({
            success: true,
            message: 'Puan başarıyla kaydedildi',
            rating: {
                average: Math.round(item.rating.average * 10) / 10,
                count: item.rating.count
            }
        });

    } catch (error) {
        console.error('Rating error:', error);
        res.status(500).json({
            success: false,
            message: 'Puan verilirken bir hata oluştu'
        });
    }
};

// Ürünün puanlarını getir
exports.getItemRatings = async (req, res) => {
    try {
        console.log('Get ratings request for item:', req.params.itemId); // Debug log
        const { itemId } = req.params;

        const item = await Item.findById(itemId)
            .populate('reviews.user', 'firstName lastName')
            .select('rating reviews');

        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }

        // Eğer rating veya reviews alanları yoksa initialize et
        const rating = item.rating || { average: 0, count: 0 };
        const reviews = item.reviews || [];

        // Reviews'ı tarih sırasına göre sırala (en yeni önce)
        const sortedReviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({
            success: true,
            rating: {
                average: Math.round(rating.average * 10) / 10,
                count: rating.count
            },
            reviews: sortedReviews
        });

    } catch (error) {
        console.error('Get ratings error:', error);
        res.status(500).json({
            success: false,
            message: 'Puanlar getirilemedi'
        });
    }
};

// Kullanıcının bir ürün için verdiği puanı getir
exports.getUserRating = async (req, res) => {
    try {
        console.log('Get user rating request:', req.params.itemId, req.userId); // Debug log
        const { itemId } = req.params;
        const userId = req.userId;

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }

        const reviews = item.reviews || [];
        const userReview = reviews.find(
            review => review.user.toString() === userId.toString()
        );

        if (userReview) {
            res.json({
                success: true,
                review: {
                    rating: userReview.rating,
                    comment: userReview.comment,
                    createdAt: userReview.createdAt
                }
            });
        } else {
            res.json({
                success: true,
                review: null
            });
        }

    } catch (error) {
        console.error('Get user rating error:', error);
        res.status(500).json({
            success: false,
            message: 'Kullanıcı puanı getirilemedi'
        });
    }
}; 