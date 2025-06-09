/**
 * Kirala - Kiralama Modeli
 * 
 * Bu dosya, kiralama işlemleri için gerekli model fonksiyonlarını içerir.
 */

const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    renter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'active', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'refunded'],
        default: 'pending'
    },
    paymentId: {
        type: String
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

// Kiralama süresini hesaplayan virtual field
rentalSchema.virtual('duration').get(function() {
    return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

// Model'in zaten var olup olmadığını kontrol et
const Rental = mongoose.models.Rental || mongoose.model('Rental', rentalSchema);

module.exports = Rental; 