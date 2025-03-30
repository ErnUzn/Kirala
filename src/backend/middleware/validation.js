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
    password: Joi.string().min(8).required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone_number: Joi.string().pattern(/^[0-9]{10}$/),
    date_of_birth: Joi.date().iso()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  update: Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
    phone_number: Joi.string().pattern(/^[0-9]{10}$/),
    date_of_birth: Joi.date().iso(),
    profile_image_url: Joi.string().uri()
  })
};

// Ürün şemaları
const itemSchemas = {
  create: Joi.object({
    category_id: Joi.string().uuid().required(),
    title: Joi.string().required(),
    description: Joi.string(),
    condition: Joi.string().valid('Yeni', 'Çok İyi', 'İyi', 'Normal', 'Yıpranmış').required(),
    daily_price: Joi.number().min(0).required(),
    weekly_discount_percentage: Joi.number().min(0).max(100),
    monthly_discount_percentage: Joi.number().min(0).max(100),
    min_rental_days: Joi.number().min(1),
    max_rental_days: Joi.number().min(1),
    deposit_amount: Joi.number().min(0)
  }),

  update: Joi.object({
    category_id: Joi.string().uuid(),
    title: Joi.string(),
    description: Joi.string(),
    condition: Joi.string().valid('Yeni', 'Çok İyi', 'İyi', 'Normal', 'Yıpranmış'),
    daily_price: Joi.number().min(0),
    weekly_discount_percentage: Joi.number().min(0).max(100),
    monthly_discount_percentage: Joi.number().min(0).max(100),
    min_rental_days: Joi.number().min(1),
    max_rental_days: Joi.number().min(1),
    deposit_amount: Joi.number().min(0),
    is_available: Joi.boolean()
  })
};

// Kiralama şemaları
const rentalSchemas = {
  create: Joi.object({
    item_id: Joi.string().uuid().required(),
    start_date: Joi.date().iso().required(),
    end_date: Joi.date().iso().min(Joi.ref('start_date')).required(),
    delivery_method: Joi.string().valid('Elden Teslim', 'Kurye', 'Kargo').required(),
    delivery_notes: Joi.string(),
    renter_address_id: Joi.string().uuid().required()
  }),

  update: Joi.object({
    status: Joi.string().valid('Talep Edildi', 'Onaylandı', 'Reddedildi', 'İptal Edildi', 'Tamamlandı'),
    payment_status: Joi.string().valid('Ödenmedi', 'Kısmi Ödendi', 'Ödendi', 'İade Edildi'),
    delivery_notes: Joi.string(),
    admin_notes: Joi.string()
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
      const validationError = new Error('Geçersiz veri formatı');
      validationError.name = 'ValidationError';
      validationError.details = errorMessage;
      next(validationError);
    } else {
      next();
    }
  };
};

module.exports = {
  userSchemas,
  itemSchemas,
  rentalSchemas,
  validate
}; 