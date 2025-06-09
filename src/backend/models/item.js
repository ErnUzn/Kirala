/**
 * Kirala - Ürün Modeli
 * 
 * Bu dosya, ürün işlemleri için gerekli model fonksiyonlarını içerir.
 */

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    dailyPrice: {
        type: Number,
        required: true,
        min: 0
    },
    weeklyPrice: {
        type: Number,
        required: true,
        min: 0
    },
    monthlyPrice: {
        type: Number,
        required: true,
        min: 0
    },
    images: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['available', 'rented', 'maintenance'],
        default: 'available'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerInfo: {
        userId: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            default: 'Kullanıcı'
        },
        userEmail: {
            type: String,
            default: ''
        }
    },
    location: {
        type: String,
        required: true
    },
    features: [{
        type: String
    }],
    condition: {
        type: String,
        enum: ['new', 'like-new', 'good', 'fair'],
        required: true
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        count: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 0
        }
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        userName: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

// Arama için index oluşturma
itemSchema.index({ name: 'text', description: 'text' });

// Model'in zaten var olup olmadığını kontrol et
const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);

module.exports = Item; 