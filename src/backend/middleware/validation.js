/**
 * Kirala - Veri Doğrulama Middleware'i
 * 
 * Bu middleware, gelen isteklerdeki verileri Joi şemalarına göre doğrular.
 */

const Joi = require('joi');

// Kullanıcı şemaları
const userSchemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  update: Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    phone: Joi.string().optional()
  })
};

// Ürün şemaları
const itemSchemas = {
  create: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().min(0).required(),
    dailyPrice: Joi.number().min(0).required(),
    weeklyPrice: Joi.number().min(0).required(),
    monthlyPrice: Joi.number().min(0).required(),
    condition: Joi.string().valid('new', 'like-new', 'good', 'fair').required(),
    location: Joi.string().required(),
    features: Joi.array().items(Joi.string()).optional(),
    images: Joi.array().items(Joi.string()).optional()
  }),

  update: Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    category: Joi.string().optional(),
    price: Joi.number().min(0).optional(),
    dailyPrice: Joi.number().min(0).optional(),
    weeklyPrice: Joi.number().min(0).optional(),
    monthlyPrice: Joi.number().min(0).optional(),
    condition: Joi.string().valid('new', 'like-new', 'good', 'fair').optional(),
    location: Joi.string().optional(),
    features: Joi.array().items(Joi.string()).optional(),
    images: Joi.array().items(Joi.string()).optional(),
    status: Joi.string().valid('available', 'rented', 'maintenance').optional()
  })
};

// Kiralama şemaları
const rentalSchemas = {
  create: Joi.object({
    itemId: Joi.string().required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required(),
    totalPrice: Joi.number().min(0).required(),
    deliveryMethod: Joi.string().valid('Elden Teslim', 'Kurye', 'Kargo').optional(),
    deliveryNotes: Joi.string().optional(),
    notes: Joi.string().optional()
  }),

  update: Joi.object({
    status: Joi.string().valid('pending', 'active', 'completed', 'cancelled').optional(),
    paymentStatus: Joi.string().valid('pending', 'paid', 'refunded').optional(),
    deliveryNotes: Joi.string().optional(),
    adminNotes: Joi.string().optional(),
    notes: Joi.string().optional()
  })
};

// Doğrulama middleware'i
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true
    });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message);
      return res.status(400).json({
        message: 'Geçersiz veri formatı',
        errors: errorMessage
      });
    }
    next();
  };
};

module.exports = {
  userSchemas,
  itemSchemas,
  rentalSchemas,
  validate
}; 