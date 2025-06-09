# Kirala - Detaylı Senaryo Dokümanı

## 1. Aktivite Diyagramı Senaryoları

### 1.1 Kullanıcı Kayıt ve Doğrulama Süreci
- Kullanıcı kayıt formunu doldurur
- E-posta doğrulama kodu gönderilir
- Kullanıcı e-postasını doğrular
- Kimlik doğrulama süreci başlar
- Kullanıcı kimlik bilgilerini yükler
- Sistem kimlik bilgilerini kontrol eder
- Doğrulama başarılı/başarısız sonuçlanır

### 1.2 Eşya Kiralama Süreci
- Kullanıcı eşya araması yapar
- Filtreleme ve sıralama seçeneklerini kullanır
- Eşya detaylarını inceler
- Kiralama tarihlerini seçer
- Kiralama talebi oluşturur
- Kiraya veren onaylar
- Ödeme işlemi gerçekleşir
- Eşya teslim alınır
- Kiralama süresi biter
- Eşya iade edilir
- Değerlendirme yapılır

## 2. Sekans Diyagramı Senaryoları

### 2.1 Eşya Listeleme Süreci
1. Kullanıcı -> Platform: Eşya listeleme talebi
2. Platform -> Kullanıcı: Listeleme formu gösterir
3. Kullanıcı -> Platform: Eşya bilgilerini girer
4. Platform -> Storage: Fotoğrafları yükler
5. Storage -> Platform: Yükleme onayı
6. Platform -> Veritabanı: Eşya bilgilerini kaydeder
7. Veritabanı -> Platform: Kayıt onayı
8. Platform -> Kullanıcı: Listeleme başarılı mesajı

### 2.2 Ödeme İşlemi Süreci
1. Kiracı -> Platform: Ödeme talebi
2. Platform -> Ödeme Sistemi: Ödeme bilgilerini iletir
3. Ödeme Sistemi -> Kiracı: Ödeme sayfası gösterir
4. Kiracı -> Ödeme Sistemi: Ödeme bilgilerini girer
5. Ödeme Sistemi -> Banka: Ödeme talebi
6. Banka -> Ödeme Sistemi: Ödeme onayı
7. Ödeme Sistemi -> Platform: İşlem sonucu
8. Platform -> Kiracı: Ödeme onayı
9. Platform -> Kiraya Veren: Ödeme bildirimi

## 3. Durum (State) Diyagramı Senaryoları

### 3.1 Eşya Durumları
- Yeni Listelenmiş
- Aktif
- Kiralandı
- Bakımda
- Pasif
- Silinmiş

### 3.2 Kiralama Durumları
- Talep Edildi
- Onay Bekliyor
- Onaylandı
- Ödeme Bekliyor
- Ödeme Yapıldı
- Teslim Edildi
- Kullanımda
- İade Edildi
- Tamamlandı
- İptal Edildi

### 3.3 Ödeme Durumları
- Beklemede
- İşleniyor
- Tamamlandı
- İade Edildi
- İptal Edildi
- Başarısız

## 4. İşbirliği (Collaboration) Diyagramı Senaryoları

### 4.1 Kullanıcı Doğrulama Süreci
- Kullanıcı -> Kimlik Doğrulama Servisi
- Kimlik Doğrulama Servisi -> Veritabanı
- Veritabanı -> Kimlik Doğrulama Servisi
- Kimlik Doğrulama Servisi -> Bildirim Servisi
- Bildirim Servisi -> Kullanıcı

### 4.2 Eşya Arama ve Filtreleme
- Kullanıcı -> Arama Servisi
- Arama Servisi -> Filtreleme Servisi
- Filtreleme Servisi -> Veritabanı
- Veritabanı -> Filtreleme Servisi
- Filtreleme Servisi -> Arama Servisi
- Arama Servisi -> Kullanıcı

## 5. Paket (Package) Diyagramı Senaryoları

### 5.1 Frontend Paketleri
- Kullanıcı Arayüzü Bileşenleri
  - Kimlik Doğrulama
  - Profil Yönetimi
  - Eşya Listeleme
  - Arama ve Filtreleme
  - Kiralama İşlemleri
  - Ödeme İşlemleri
  - Mesajlaşma
  - Değerlendirme

### 5.2 Backend Paketleri
- API Gateway
- Kullanıcı Servisi
- Eşya Servisi
- Kiralama Servisi
- Ödeme Servisi
- Mesajlaşma Servisi
- Bildirim Servisi
- Arama Servisi
- Filtreleme Servisi

### 5.3 Veritabanı Paketleri
- Kullanıcı Şeması
- Eşya Şeması
- Kiralama Şeması
- Ödeme Şeması
- Mesajlaşma Şeması
- Değerlendirme Şeması

### 5.4 Harici Servis Paketleri
- Ödeme Gateway
- E-posta Servisi
- SMS Servisi
- Storage Servisi
- Harita Servisi
- Analitik Servisi

## Diyagram Oluşturma İpuçları

1. **Aktivite Diyagramları için:**
   - Her senaryo için başlangıç ve bitiş noktalarını belirleyin
   - Karar noktalarını ve alternatif akışları gösterin
   - Paralel işlemleri belirtin
   - Swimlane'leri kullanarak farklı aktörleri ayırın

2. **Sekans Diyagramları için:**
   - Aktörleri ve sistemleri belirleyin
   - Mesajlaşma sırasını doğru şekilde gösterin
   - Zaman akışını yukarıdan aşağıya doğru çizin
   - Döngüleri ve alternatif akışları belirtin

3. **Durum Diyagramları için:**
   - Tüm olası durumları listeleyin
   - Durumlar arası geçişleri belirleyin
   - Başlangıç ve bitiş durumlarını işaretleyin
   - Alt durumları ve bileşik durumları gösterin

4. **İşbirliği Diyagramları için:**
   - Nesneleri ve aralarındaki ilişkileri belirleyin
   - Mesajlaşma sırasını numaralandırın
   - İlişki türlerini (association, dependency vb.) belirtin
   - Mesaj içeriklerini açıkça yazın

5. **Paket Diyagramları için:**
   - Paketleri mantıksal gruplara ayırın
   - Paketler arası bağımlılıkları gösterin
   - İç içe paketleri belirtin
   - Paket içeriğini özetleyin

## Önemli Notlar

1. Her diyagramı oluştururken PRD'deki gereksinimleri göz önünde bulundurun
2. Diyagramları basit ve anlaşılır tutun
3. Gerektiğinde notlar ve açıklamalar ekleyin
4. Diyagramları projenin gelişimine göre güncel tutun
5. PlantUML veya benzeri bir araç kullanarak diyagramları oluşturun 