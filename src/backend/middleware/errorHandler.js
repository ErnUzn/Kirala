/**
 * Kirala - Hata İşleme Middleware'i
 * 
 * Bu middleware, uygulamada oluşan hataları yakalar ve uygun formatta yanıt döner.
 */

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Hata detaylarını hazırla
  const error = {
    message: err.message || 'Bir hata oluştu',
    code: err.code || 500,
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  };

  // Özel hata tipleri için yanıt formatı
  if (err.name === 'ValidationError') {
    error.code = 400;
    error.message = 'Geçersiz veri formatı';
    error.details = err.details;
  } else if (err.name === 'UnauthorizedError') {
    error.code = 401;
    error.message = 'Yetkisiz erişim';
  } else if (err.name === 'ForbiddenError') {
    error.code = 403;
    error.message = 'Erişim reddedildi';
  } else if (err.name === 'NotFoundError') {
    error.code = 404;
    error.message = 'Kaynak bulunamadı';
  }

  // Hata yanıtını gönder
  res.status(error.code).json({
    success: false,
    error
  });
};

module.exports = errorHandler; 