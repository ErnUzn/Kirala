# Kirala - UI Bileşenleri Tasarımı

## 1. Ürün Kartları

### Standart Ürün Kartı

```
+---------------------------+
|                           |
|      [Ürün Fotoğrafı]     |
|                           |
+---------------------------+
| PlayStation 5             |
| Çift Kol + Oyun           |
+---------------------------+
| ★★★★☆ (4.8)  Kadıköy      |
+---------------------------+
|  3 Gün    5 Gün    10 Gün |
|  799₺     1199₺    1499₺  |
+---------------------------+
|        [Kirala]           |
+---------------------------+
```

**Özellikler:**
- Boyut: 280px x 360px
- Kenar yuvarlaklığı: 8px
- Gölge: 0px 4px 8px rgba(0, 0, 0, 0.1)
- Ürün görseli bölümü: 280px x 200px
- Fiyatlandırma bölümü hover durumunda vurgulanır
- "Kirala" butonu sadece hover durumunda görünür

### Küçük Ürün Kartı (Mobil)

```
+----------------------------+
| [Foto]  | PlayStation 5    |
|         | ★★★★☆ Kadıköy    |
|         | 3G 5G 10G        |
|         | 799₺ - 1499₺     |
+----------------------------+
```

**Özellikler:**
- Boyut: 100% genişlik x 120px
- Yatay yerleşim
- Ürün görseli: 120px x 120px
- Tüm kiralama seçenekleri compact olarak gösterilir

### Ürün Ön İzleme Kartı (Arama Sonuçları)

```
+----------------------------+
| [Foto]  | PlayStation 5    |
|         | 89₺/gün          |
+----------------------------+
```

**Özellikler:**
- Boyut: 320px x 80px
- Minimal bilgiler içerir
- Arama sonuçları dropdown'ında kullanılır

## 2. Kiralama Süresi Seçici

### Slider Komponenti

```
+----------------------------------+
| Kiralama Süresi: 5 Gün           |
|                                  |
| [---o----------------------]     |
|  1                         30    |
|                                  |
| Popüler: 1G   7G   15G   30G     |
|                                  |
| Toplam Tutar: 445₺               |
+----------------------------------+
```

**Özellikler:**
- Slider çubuğu: 2px kalınlık, turkuaz renk
- Slider handle: 16px çap, turkuaz dolgu
- Popüler süreler: Chip stilinde butonlar
- Dinamik fiyat hesaplama
- Min-max limitler ayarlanabilir

### Mobil Süresi Seçici

```
+----------------------------------+
| Kiralama Süresi                  |
|                                  |
| [------o-------------------]     |
|                                  |
| < 5 Gün >    Toplam: 445₺        |
|                                  |
| 1G    7G    15G    30G           |
+----------------------------------+
```

**Özellikler:**
- Touch-friendly slider
- Artırma/Azaltma butonları
- Daha kompakt tasarım

## 3. Hasar Güvencesi Rozeti

```
+--------------------+
|  %70                |
|  Hasar Güvencesi    |
+--------------------+
```

**Özellikler:**
- Yuvarlak veya yamuk şekil
- Turkuaz/Yeşil renk
- İkon + metin kombinasyonu
- Tooltip ile açıklama

## 4. Teslimat Bilgi Kutusu

```
+------------------------------+
| ✓ Kapıya Teslimat            |
| ⓘ 50 km mesafeye kadar ücretsiz |
+------------------------------+
```

**Özellikler:**
- Hafif arka plan (açık turkuaz)
- Onay ikonu veya teslimat ikonu
- Bilgi düğmesi ile ek açıklamalar

## 5. Değerlendirme Yıldızları

### Standart Değerlendirme

```
★★★★☆ (4.8)
```

**Özellikler:**
- Dolu yıldız: #FFCB45 (altın sarısı)
- Boş yıldız: #E1E5EB (açık gri)
- Yarım yıldız desteği
- Değerlendirme sayısı opsiyonel

### Etkileşimli Değerlendirme

```
[☆][☆][☆][☆][☆]
Değerlendirmeniz
```

**Özellikler:**
- Hover efekti ile yıldızları doldurma
- Seçilen değerlendirmeyi vurgulama
- Geri bildirim animasyonu

## 6. Form Bileşenleri

### Metin Girişi

```
+------------------------------+
| Başlık                       |
| [                          ] |
| Yardımcı metin veya hata     |
+------------------------------+
```

**Özellikler:**
- 40px yükseklik
- 2px kenarlık (fokus durumunda turkuaz)
- Hata durumunda kırmızı kenarlık ve hata metni
- İkon ekleme desteği (ör. arama, tarih vb.)

### Açılır Menü (Dropdown)

```
+------------------------------+
| Kategori                     |
| [ Seçiniz...             ▼ ] |
+------------------------------+
```

**Özellikler:**
- Metin girişi ile aynı stil
- Açılır panel: beyaz arka plan, hafif gölge
- Seçenekler: hover durumunda açık gri arka plan
- Çoklu seçim desteği (checkbox'lar ile)

### Tarih Seçici

```
+------------------------------+
| Kiralama Başlangıç Tarihi    |
| [ 10.05.2023             📅] |
+------------------------------+
```

**Özellikler:**
- Takvim açılır penceresi
- Tarih aralığı seçimi desteği
- Geçmiş tarihleri devre dışı bırakma

## 7. Butonlar

### Birincil Buton

```
[     Kirala     ]
```

**Özellikler:**
- Arka plan: #26B6A5 (turkuaz)
- Metin: #FFFFFF (beyaz)
- Hover durumu: #148F80 (koyu turkuaz)
- Yükseklik: 44px
- Padding: 16px 24px
- Kenar yuvarlaklığı: 8px

### İkincil Buton

```
[   Favorilere Ekle   ]
```

**Özellikler:**
- Arka plan: #FFFFFF (beyaz)
- Kenarlık: 1px solid #26B6A5 (turkuaz)
- Metin: #26B6A5 (turkuaz)
- Hover durumu: Açık turkuaz arka plan (#F0FAF9)

### Aksiyon Butonu

```
[   Şimdi Kirala   ]
```

**Özellikler:**
- Arka plan: #FF7D4D (turuncu)
- Metin: #FFFFFF (beyaz)
- Hover durumu: #E55A2B (koyu turuncu)
- Daha fazla dikkat çekmesi gereken aksiyon butonları için

### İkon Buton

```
[ 🔍 ]  [ ❤ ]  [ 🔔 ]
```

**Özellikler:**
- 40px x 40px boyutunda
- Dairesel veya kare şekil
- Tooltip desteği ile açıklama
- Aktif/inaktif durumları için farklı stiller

## 8. Bildirim ve Durum Bildirimleri

### Başarı Bildirimi

```
+------------------------------+
| ✓ Kiralama işleminiz başarıyla |
|   tamamlandı.                |
+------------------------------+
```

**Özellikler:**
- Yeşil renk şeması
- Onay ikonu
- 4 saniye sonra otomatik kapanır
- Kapatma düğmesi

### Hata Bildirimi

```
+------------------------------+
| ✕ Ödeme işlemi başarısız oldu. |
|   Lütfen tekrar deneyin.     |
+------------------------------+
```

**Özellikler:**
- Kırmızı renk şeması
- X ikonu
- Manuel kapatılana kadar kalır
- Eylem butonu eklenebilir (ör. "Tekrar Dene")

## 9. Navigasyon Bileşenleri

### Breadcrumb

```
Ana Sayfa > Elektronik > Oyun Konsolları > PlayStation 5
```

**Özellikler:**
- Koyu gri metin
- ">" ayırıcı
- Mevcut sayfa vurgulanmış (koyu)
- Mobilde en son 2 seviye gösterilir

### Sayfalandırma (Pagination)

```
[ < ] [1] [2] [3] ... [10] [ > ]
```

**Özellikler:**
- Aktif sayfa turkuaz renkle vurgulanır
- Önceki/Sonraki butonları
- Sayılar tıklanabilir
- Mobilde minimalist versiyon

## 10. Modal ve Dialog Pencereleri

### Standart Modal

```
+---------------------------+
| Başlık               [X] |
+---------------------------+
|                           |
| İçerik alanı...           |
|                           |
+---------------------------+
| [İptal]      [Onaylıyorum]|
+---------------------------+
```

**Özellikler:**
- Sayfa üzerinde overlay ile gösterilir
- Dışa tıklama ile kapatılabilir
- ESC tuşu ile kapatma desteği
- Responsive tasarım (mobilde tam ekran)

### İşlem Onay Dialoğu

```
+---------------------------+
| ⚠️ Emin misiniz?       [X] |
+---------------------------+
|                           |
| Bu işlem geri alınamaz.   |
|                           |
+---------------------------+
| [Vazgeç]      [Evet, Sil] |
+---------------------------+
```

**Özellikler:**
- Tehlikeli işlemler için kırmızı renk vurgusu
- İkon ile uyarı
- İşlemi tamamlamak için net ifadeler
- Overlay ile diğer sayfa içeriğini karartma

## 11. Ödeme Süreç Göstergesi

```
+---------------------------------------+
| [1.Sepet] → [2.Ödeme] → [3.Onay]      |
+---------------------------------------+
```

**Özellikler:**
- Yatay adım göstergesi
- Mevcut adım vurgulanır
- Tamamlanan adımlar onay işareti ile gösterilir
- Mobilde sadeleştirilmiş versiyon

## 12. Admin Panel Tabloları

```
+----+-------------+--------+----------+------+
| ID | Ürün Adı    | Durum  | Fiyat    | İşlem |
+----+-------------+--------+----------+------+
| 1  | PlayStation | Aktif  | 89₺/gün  | ••• |
+----+-------------+--------+----------+------+
| 2  | Drone       | Pasif  | 120₺/gün | ••• |
+----+-------------+--------+----------+------+
```

**Özellikler:**
- Satır hover efekti
- Sütun başlıklarında sıralama kontrolü
- Durum göstergeleri için renk kodlaması
- İşlem menüsü açılır liste şeklinde
- Toplu seçim için checkbox sütunu

Bu bileşenler, Kirala platformunun tüm arayüzünde tutarlı bir görünüm ve kullanıcı deneyimi sağlamak için tasarlanmıştır. Bileşenler modüler yapıda olup, farklı ekran boyutlarına uyum sağlayacak şekilde responsive olarak çalışacaktır. 