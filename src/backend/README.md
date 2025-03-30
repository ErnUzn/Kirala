# Kirala - Backend Servisi

Kirala platformunun backend servisi, Node.js ve Express.js kullanılarak geliştirilmiştir. PostgreSQL veritabanını kullanır ve RESTful API prensipleri üzerine kurulmuştur.

## Teknoloji Stack'i

- **Node.js**: JavaScript çalışma ortamı
- **Express.js**: Web uygulama çerçevesi
- **PostgreSQL**: İlişkisel veritabanı
- **JWT**: Kimlik doğrulama için JSON Web Token
- **bcrypt**: Şifre hashleme
- **multer**: Dosya yükleme işlemleri
- **winston**: Loglama
- **jest**: Test

## Proje Yapısı

```
src/backend/
├── config/             # Yapılandırma dosyaları
├── controllers/        # API endpoint kontrolcüleri
├── database/           # Veritabanı dosyaları
│   ├── scripts/        # Veritabanı scriptleri
│   ├── migrations/     # Veritabanı migrations
│   └── schema.sql      # Veritabanı şeması
├── middlewares/        # Express middleware'leri
├── models/             # Veritabanı model fonksiyonları
├── routes/             # API route tanımlamaları
├── services/           # İş mantığı servisleri
├── utils/              # Yardımcı fonksiyonlar
├── uploads/            # Yüklenen dosyalar
├── .env.example        # Örnek çevre değişkenleri
├── package.json        # Proje bağımlılıkları
├── server.js           # Ana uygulama girişi
└── README.md           # Bu dosya
```

## Kurulum

1. Node.js ve npm'in kurulu olduğundan emin olun
2. PostgreSQL veritabanı kurun
3. Bu projeyi klonlayın
4. Bağımlılıkları yükleyin:
   ```
   cd src/backend
   npm install
   ```
5. `.env.example` dosyasını `.env` olarak kopyalayın ve gerekli değişkenleri ayarlayın:
   ```
   cp .env.example .env
   ```
6. Veritabanını oluşturun:
   ```
   npm run db:create
   ```
7. Uygulamayı başlatın:
   ```
   npm run dev
   ```

## API Endpoints

### Kimlik Doğrulama (Auth)
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `POST /api/auth/refresh` - Token yenileme
- `POST /api/auth/logout` - Çıkış yapma

### Kullanıcılar (Users)
- `GET /api/users/profile` - Profil bilgilerini getir
- `PUT /api/users/profile` - Profil bilgilerini güncelle
- `GET /api/users/:id` - Belirli bir kullanıcının bilgilerini getir

### Eşyalar (Items)
- `GET /api/items` - Eşya listesi getir
- `GET /api/items/:id` - Belirli bir eşyanın detaylarını getir
- `POST /api/items` - Yeni eşya ekle
- `PUT /api/items/:id` - Eşya bilgilerini güncelle
- `DELETE /api/items/:id` - Eşya sil

### Kiralamalar (Rentals)
- `GET /api/rentals` - Kiralama listesi getir
- `GET /api/rentals/:id` - Belirli bir kiralamanın detaylarını getir
- `POST /api/rentals` - Yeni kiralama talebi oluştur
- `PUT /api/rentals/:id/status` - Kiralama durumunu güncelle

### Kategoriler (Categories)
- `GET /api/categories` - Kategori listesi getir
- `GET /api/categories/:id/items` - Belirli bir kategorideki eşyaları getir

## Geliştirme

### Yeni API Endpoint Ekleme
1. `routes/` klasöründe ilgili route dosyasını bulun veya oluşturun
2. `controllers/` klasöründe gerekli kontrolcü fonksiyonlarını tanımlayın
3. Veritabanı işlemleri için `models/` klasöründe gerekli fonksiyonları ekleyin
4. `server.js` dosyasında route'u tanımlayın

### Testler
Testleri çalıştırmak için:
```
npm test
```

## Lisans
MIT 