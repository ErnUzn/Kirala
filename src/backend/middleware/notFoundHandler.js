/**
 * Kirala - 404 Hata İşleme Middleware'i
 * 
 * Bu middleware, bulunamayan rotalar için 404 hatası döner.
 */

const notFoundHandler = (req, res, next) => {
  const error = new Error('Sayfa bulunamadı');
  error.name = 'NotFoundError';
  error.code = 404;
  next(error);
};

module.exports = notFoundHandler; 