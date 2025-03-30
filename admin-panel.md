# Kirala - Admin Panel Teknik Şartnamesi

## 1. Genel Bakış

Admin Panel, Kirala platformunun yönetim arabirimini oluşturacak, site sahipleri ve yetkilendirilmiş yöneticilerin platform verilerini ve içeriğini yönetmelerine olanak sağlayacaktır. Panel üzerinden özellikle ürün (eşya) ekleme, düzenleme, silme gibi temel işlemler yapılabilecek, ayrıca kullanıcı, kiralama, ödeme ve diğer sistem fonksiyonları yönetilebilecektir.

## 2. Kullanıcı Rolleri ve Yetkiler

### Roller

- **Süper Admin**: Tüm sistem üzerinde tam yetki (platform sahipleri)
- **İçerik Yöneticisi**: Ürün, kategori ve içerik yönetimi yetkileri
- **Müşteri Hizmetleri**: Kullanıcı ve kiralama işlemleri yönetimi
- **Finans Yöneticisi**: Ödeme ve finansal işlem yetkileri

### Yetki Matrisi

| Özellik | Süper Admin | İçerik Yöneticisi | Müşteri Hizmetleri | Finans Yöneticisi |
|---------|-------------|-------------------|---------------------|-------------------|
| Admin kullanıcı yönetimi | ✅ | ❌ | ❌ | ❌ |
| Kullanıcı yönetimi | ✅ | ❌ | ✅ | ❌ |
| Ürün ekleme/düzenleme | ✅ | ✅ | ❌ | ❌ |
| Ürün silme/deaktifleştirme | ✅ | ✅ | ❌ | ❌ |
| Kategori yönetimi | ✅ | ✅ | ❌ | ❌ |
| Kiralama yönetimi | ✅ | ❌ | ✅ | ✅ |
| Ödeme işlemleri | ✅ | ❌ | ❌ | ✅ |
| İçerik yönetimi | ✅ | ✅ | ❌ | ❌ |
| Raporlama | ✅ | ✅ | ✅ | ✅ |
| Sistem ayarları | ✅ | ❌ | ❌ | ❌ |

## 3. Oturum Yönetimi

- JWT tabanlı oturum doğrulama ve yetkilendirme
- İki faktörlü kimlik doğrulama (2FA) desteği
- IP bazlı erişim kısıtlamaları
- Oturum zaman aşımı ve otomatik çıkış
- Oturum izleme ve şüpheli giriş bildirimleri

## 4. Arayüz Bileşenleri

### Dashboard (Ana Ekran)

- Özet istatistikler ve KPI'lar
  - Toplam aktif ürün sayısı
  - Günlük/haftalık/aylık yeni kullanıcı sayısı
  - Aktif kiralama sayısı
  - Bekleyen talepler
  - Toplam ve dönemsel gelir
- Grafik ve çizelgeler
  - Kategori bazlı ürün dağılımı
  - Zaman serisi ciro grafiği
  - Kullanıcı büyüme grafiği
- Hızlı erişim bağlantıları
- Son etkinlikler akışı

### Ürün Yönetimi Modülü

- **Ürün Listeleme ve Arama**
  - Filtreler: kategori, durum, fiyat aralığı, eklenme tarihi
  - Toplu işlem seçenekleri
  - Detaylı arama
  - Sayfalama ve sıralama
  
- **Ürün Ekleme/Düzenleme Formu**
  - Temel bilgiler (başlık, açıklama, durum)
  - Fiyatlandırma (günlük fiyat, indirimler, depozito)
  - Kategori ve alt kategori seçimi
  - Özellik ve detay girişi
  - Fotoğraf yükleme ve yönetimi
    - Çoklu fotoğraf yükleme
    - Fotoğraf sıralama ve ana fotoğraf belirleme
    - Fotoğraf kırpma ve düzenleme
  - Uygunluk takvimi yönetimi
  - Yayınlama ve ön izleme seçenekleri

- **Toplu Ürün İşlemleri**
  - Toplu durum değiştirme
  - Toplu kategori atama
  - Toplu silme/deaktive etme
  - Excel/CSV dosyaları ile toplu ürün ekleyebilme
  
### Kategori Yönetimi

- Kategori hiyerarşisi oluşturma ve düzenleme
- Kategori detayları (isim, açıklama, slug, ikon)
- Kategorilere özel özellik şablonları tanımlama
- Kategori bazlı istatistikler

### Kullanıcı Yönetimi

- Kullanıcı listeleme ve filtreleme
- Kullanıcı detayları ve aktivite geçmişi görüntüleme
- Kullanıcı hesaplarını askıya alma/aktifleştirme
- Kullanıcı değerlendirme ve puanları inceleme
- Kimlik doğrulama durumunu yönetme

### Kiralama İşlemleri Yönetimi

- Kiralama talepleri listeleme ve durumlarını güncelleme
- Kiralama detayları ve tarihçesi
- Kiralama iptal ve değişiklik talepleri
- Teslimat bilgilerini yönetme
- Müşteri hizmetleri notları ekleyebilme

### Ödeme Yönetimi

- Ödeme işlemleri listeleme ve filtreleme
- Ödeme detayları ve durumlarını görüntüleme
- Manuel ödeme onaylama/reddetme
- İade işlemleri
- Fatura yönetimi
- Finansal raporlar

### İçerik Yönetimi

- Sayfa içerikleri düzenleme (Ana sayfa, Hakkımızda, SSS, vb.)
- Banner ve kampanya yönetimi
- Blog yazıları yönetimi
- E-posta şablonları düzenleme

### Raporlama Sistemi

- Önceden tanımlanmış raporlar
  - Gelir raporları
  - Kullanıcı aktivite raporları
  - Ürün performans raporları
  - Kiralama istatistikleri
- Özel rapor oluşturma ve kaydetme
- Rapor dışa aktarma (PDF, Excel, CSV)

### Sistem Ayarları

- Genel site ayarları
- Ödeme entegrasyonu yapılandırması
- Bildirim ve e-posta ayarları
- Güvenlik ve yetkilendirme ayarları
- SEO ve sosyal medya yapılandırması
- API anahtarları ve entegrasyonlar

## 5. Teknik Gereksinimler

### Frontend Teknolojileri

- React.js ile SPA (Single Page Application)
- Redux veya Context API ile durum yönetimi
- Material UI veya benzer kütüphane ile komponent sistemi
- Responsive tasarım (mobil-uyumlu)
- Grafik ve çizelgeler için Chart.js veya D3.js

### Backend Entegrasyonu

- RESTful API'ler üzerinden iletişim
- JWT token bazlı kimlik doğrulama
- Role-Based Access Control (RBAC)
- Backend servisleriyle gerçek zamanlı iletişim
- Mikroservis mimarisine uyumlu tasarım

### Performans Gereksinimleri

- Sayfa yüklenme süresi < 2 saniye
- Büyük veri tablolarında lazy-loading ve sayfalama
- Önbellek (cache) stratejisi
- Büyük dosya yüklemeleri için optimizasyon

### Güvenlik Özellikleri

- Cross-Site Scripting (XSS) koruması
- Cross-Site Request Forgery (CSRF) koruması
- Güvenli parola politikaları
- Oturum güvenliği ve zaman aşımı
- Aktivite ve audit logları

## 6. Kullanıcı Deneyimi (UX) Gereksinimleri

- Sezgisel ve kolay kullanılabilir arayüz
- Hızlı erişim için kısayollar ve pratik navigasyon
- Kullanıcı hatalarını önleyici form tasarımları
- İşlem geri bildirimleri ve bildirimler
- Yardım metinleri ve ipuçları
- Karanlık/aydınlık tema seçeneği
- Mobil cihazlardan erişim imkanı

## 7. Entegrasyon Noktaları

- Kullanıcı servislerinin admin panel ile entegrasyonu
- Ürün servislerinin admin panel ile entegrasyonu
- Ödeme sistemlerinin admin panel ile entegrasyonu
- Bildirim servislerinin admin panel ile entegrasyonu
- Dosya yükleme ve depolama sistemleri entegrasyonu
- Dış servis entegrasyonları (analitik, e-posta, SMS, vb.)

## 8. Geliştirme ve Test Planı

- Arayüz tasarımı ve prototipleme
- Komponent geliştirme
- API entegrasyonu
- Birim testleri
- Entegrasyon testleri
- Kullanıcı kabul testleri
- Güvenlik testleri
- Performans testleri

## 9. İleriye Dönük Geliştirmeler

- Gelişmiş analitik ve veri görselleştirme
- Yapay zeka destekli içerik önerileri
- Otomatik raporlama ve uyarı sistemi
- Mobil admin uygulaması
- Gelişmiş kontrol paneli (dashboard) özelleştirmeleri 