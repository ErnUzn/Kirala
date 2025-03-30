# Kirala - Veritabanı Şeması

## 1. Veritabanı Genel Yapısı
Kirala platformu için ilişkisel bir veritabanı mimarisi kullanılacaktır. Ana veritabanı olarak PostgreSQL tercih edilecektir. Veriler mikroservis mimarisine uygun şekilde ayrı veritabanlarına bölünecek, ancak başlangıçta tek bir veritabanı üzerinde çalışılacaktır.

## 2. Tablolar ve İlişkiler

### Kullanıcılar (users)
| Alan | Tür | Açıklama |
|------|-----|----------|
| id | UUID | Benzersiz kullanıcı kimliği (Birincil anahtar) |
| email | VARCHAR(255) | Kullanıcı e-posta adresi (Benzersiz) |
| password_hash | VARCHAR(255) | Şifrelenmiş parola |
| first_name | VARCHAR(100) | Ad |
| last_name | VARCHAR(100) | Soyad |
| phone_number | VARCHAR(20) | Telefon numarası |
| profile_image_url | VARCHAR(255) | Profil fotoğrafı |
| date_of_birth | DATE | Doğum tarihi |
| id_verification_status | ENUM | Kimlik doğrulama durumu [Doğrulanmadı, Beklemede, Doğrulandı] |
| rating | DECIMAL(3,2) | Kullanıcı değerlendirme puanı (1-5) |
| created_at | TIMESTAMP | Kayıt oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme zamanı |
| is_active | BOOLEAN | Aktif/Pasif durumu |
| is_admin | BOOLEAN | Admin kullanıcısı mı |

### Admin Kullanıcılar (admin_users)
| Alan | Tür | Açıklama |
|------|-----|----------|
| id | UUID | Benzersiz admin kimliği (Birincil anahtar) |
| user_id | UUID | Kullanıcı tablosu referansı (Yabancı anahtar) |
| role_id | UUID | Rol referansı (Yabancı anahtar) |
| last_login_at | TIMESTAMP | Son giriş zamanı |
| last_login_ip | VARCHAR(45) | Son giriş IP adresi |
| is_active | BOOLEAN | Aktif/Pasif durumu |
| created_at | TIMESTAMP | Kayıt oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme zamanı |

### Roller (roles)
| Alan | Tür | Açıklama |
|------|-----|----------|
| id | UUID | Benzersiz rol kimliği (Birincil anahtar) |
| name | VARCHAR(100) | Rol adı |
| description | TEXT | Rol açıklaması |
| created_at | TIMESTAMP | Kayıt oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme zamanı |

### İzinler (permissions)
| Alan | Tür | Açıklama |
|------|-----|----------|
| id | UUID | Benzersiz izin kimliği (Birincil anahtar) |
| name | VARCHAR(100) | İzin adı |
| code | VARCHAR(100) | İzin kodu |
| description | TEXT | İzin açıklaması |
| created_at | TIMESTAMP | Kayıt oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme zamanı |

### Rol İzinleri (role_permissions)
| Alan | Tür | Açıklama |
|------|-----|----------|
| id | UUID | Benzersiz kayıt kimliği (Birincil anahtar) |
| role_id | UUID | Rol referansı (Yabancı anahtar) |
| permission_id | UUID | İzin referansı (Yabancı anahtar) |
| created_at | TIMESTAMP | Kayıt oluşturulma zamanı |

### Admin Aktivite Logları (admin_activity_logs)
| Alan | Tür | Açıklama |
|------|-----|----------|
| id | UUID | Benzersiz log kimliği (Birincil anahtar) |
| admin_user_id | UUID | Admin kullanıcı referansı (Yabancı anahtar) |
| action | VARCHAR(255) | Gerçekleştirilen işlem |
| entity_type | VARCHAR(100) | İşlem yapılan varlık türü (ürün, kullanıcı, vb.) |
| entity_id | UUID | İşlem yapılan varlık kimliği |
| details | JSONB | İşlem detayları (JSON formatında) |
| ip_address | VARCHAR(45) | İşlemin yapıldığı IP adresi |
| user_agent | TEXT | İşlemin yapıldığı tarayıcı/cihaz bilgisi |
| created_at | TIMESTAMP | Log oluşturulma zamanı |

### Adresler (addresses)
| Alan | Tür | Açıklama |
|------|-----|----------|
| id | UUID | Benzersiz adres kimliği (Birincil anahtar) |
| user_id | UUID | Kullanıcı referansı (Yabancı anahtar) |
| title | VARCHAR(100) | Adres başlığı (Ev, İş vb.) |
| full_address | TEXT | Tam adres |
| city | VARCHAR(100) | Şehir |
| district | VARCHAR(100) | İlçe |
| postal_code | VARCHAR(20) | Posta kodu |
| is_default | BOOLEAN | Varsayılan adres mi |
| latitude | DECIMAL(10,8) | Enlem koordinatı |
| longitude | DECIMAL(11,8) | Boylam koordinatı |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme zamanı |

### Kategoriler (categories)
| Alan | Tür | Açıklama |
|------|-----|----------|
| id | UUID | Benzersiz kategori kimliği (Birincil anahtar) |
| parent_id | UUID | Üst kategori referansı (Yabancı anahtar, NULL olabilir) |
| name | VARCHAR(100) | Kategori adı |
| slug | VARCHAR(100) | URL-friendly kategori adı |
| description | TEXT | Kategori açıklaması |
| icon_url | VARCHAR(255) | Kategori ikon URL'si |
| is_active | BOOLEAN | Aktif/Pasif durumu |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme zamanı |

### Eşyalar (items)
| Alan | Tür | Açıklama |
|------|-----|----------|
| id | UUID | Benzersiz eşya kimliği (Birincil anahtar) |
| owner_id | UUID | Eşya sahibi kullanıcı referansı (Yabancı anahtar) |
| category_id | UUID | Kategori referansı (Yabancı anahtar) |
| title | VARCHAR(255) | Eşya başlığı |
| description | TEXT | Eşya açıklaması |
| condition | ENUM | Eşya durumu [Yeni, Çok İyi, İyi, Normal, Yıpranmış] |
| daily_price | DECIMAL(10,2) | Günlük kira fiyatı |
| weekly_discount_percentage | INTEGER | Haftalık kiralamada indirim yüzdesi |
| monthly_discount_percentage | INTEGER | Aylık kiralamada indirim yüzdesi |
| min_rental_days | INTEGER | Minimum kiralama süresi (gün) |
| max_rental_days | INTEGER | Maksimum kiralama süresi (gün) |
| deposit_amount | DECIMAL(10,2) | Depozito miktarı |
| is_available | BOOLEAN | Kiralanabilir durumda mı |
| views_count | INTEGER | Görüntülenme sayısı |
| rating | DECIMAL(3,2) | Eşya değerlendirme puanı (1-5) |
| created_by | UUID | Oluşturan kullanıcı/admin (Normal veya admin kullanıcı olabilir) |
| updated_by | UUID | Güncelleyen kullanıcı/admin (Normal veya admin kullanıcı olabilir) |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme zamanı |

### Eşya Fotoğrafları (item_images)
| Alan | Tür | Açıklama |
|------|-----|----------|
| id | UUID | Benzersiz fotoğraf kimliği (Birincil anahtar) |
| item_id | UUID | Eşya referansı (Yabancı anahtar) |
| image_url | VARCHAR(255) | Fotoğraf URL'si |
| is_primary | BOOLEAN | Ana fotoğraf mı |
| display_order | INTEGER | Gösterim sırası |
| created_at | TIMESTAMP | Oluşturulma zamanı |

### Eşya Uygunluk Takvimi (item_availability)
| Alan | Tür | Açıklama |
|------|-----|----------|
| id | UUID | Benzersiz kayıt kimliği (Birincil anahtar) |
| item_id | UUID | Eşya referansı (Yabancı anahtar) |
| start_date | DATE | Başlangıç tarihi |
| end_date | DATE | Bitiş tarihi |
| is_available | BOOLEAN | Uygun mu |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme zamanı |

### Kiralamalar (rentals)
| Alan | Tür | Açıklama |
|------|-----|----------|
| id | UUID | Benzersiz kiralama kimliği (Birincil anahtar) |
| item_id | UUID | Eşya referansı (Yabancı anahtar) |
| renter_id | UUID | Kiralayan kullanıcı referansı (Yabancı anahtar) |
| start_date | DATE | Kiralama başlangıç tarihi |
| end_date | DATE | Kiralama bitiş tarihi |
| total_price | DECIMAL(10,2) | Toplam kira bedeli |
| deposit_amount | DECIMAL(10,2) | Depozito miktarı |
| status | ENUM | Durum [Talep Edildi, Onaylandı, Reddedildi, İptal Edildi, Tamamlandı] |
| payment_status | ENUM | Ödeme durumu [Ödenmedi, Kısmi Ödendi, Ödendi, İade Edildi] |
| renter_address_id | UUID | Teslimat adresi referansı (Yabancı anahtar) |
| delivery_method | ENUM | Teslimat yöntemi [Elden Teslim, Kurye, Kargo] |
| delivery_notes | TEXT | Teslimat notları |
| admin_notes | TEXT | Admin tarafından eklenen notlar |
| last_updated_by | UUID | Son güncelleyen kullanıcı/admin referansı |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme zamanı |

### Ödemeler (payments)
| Alan | Tür | Açıklama |
|------|-----|----------|
| id | UUID | Benzersiz ödeme kimliği (Birincil anahtar) |
| rental_id | UUID | Kiralama referansı (Yabancı anahtar) |
| amount | DECIMAL(10,2) | Ödeme miktarı |
| payment_method | ENUM | Ödeme yöntemi [Kredi Kartı, Banka Kartı, Havale] |
| payment_status | ENUM | Ödeme durumu [Başlatıldı, Başarılı, Başarısız, İade Edildi] |
| payment_date | TIMESTAMP | Ödeme zamanı |
| transaction_id | VARCHAR(255) | Ödeme kuruluşu işlem kimliği |
| payment_provider | VARCHAR(100) | Ödeme sağlayıcısı (Stripe, Iyzico vb.) |
| is_deposit | BOOLEAN | Depozito ödemesi mi |
| refund_amount | DECIMAL(10,2) | İade edilen miktar |
| admin_id | UUID | İşlemi yapan/onaylayan admin referansı (NULL olabilir) |
| admin_notes | TEXT | Ödeme ile ilgili admin notları |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme zamanı |

### Değerlendirmeler (reviews)
| Alan | Tür | Açıklama |
|------|-----|----------|
| id | UUID | Benzersiz değerlendirme kimliği (Birincil anahtar) |
| rental_id | UUID | Kiralama referansı (Yabancı anahtar) |
| reviewer_id | UUID | Değerlendiren kullanıcı referansı (Yabancı anahtar) |
| reviewee_id | UUID | Değerlendirilen kullanıcı referansı (Yabancı anahtar) |
| item_id | UUID | Eşya referansı (Yabancı anahtar) |
| rating | INTEGER | Puan (1-5) |
| comment | TEXT | Değerlendirme yorumu |
| is_item_review | BOOLEAN | Eşya değerlendirmesi mi |
| is_user_review | BOOLEAN | Kullanıcı değerlendirmesi mi |
| is_approved | BOOLEAN | Admin tarafından onaylandı mı |
| approved_by | UUID | Onaylayan admin referansı (NULL olabilir) |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme zamanı |

### Mesajlar (messages)
| Alan | Tür | Açıklama |
|------|-----|----------|
| id | UUID | Benzersiz mesaj kimliği (Birincil anahtar) |
| sender_id | UUID | Gönderen kullanıcı referansı (Yabancı anahtar) |
| receiver_id | UUID | Alıcı kullanıcı referansı (Yabancı anahtar) |
| item_id | UUID | İlgili eşya referansı (Yabancı anahtar, NULL olabilir) |
| rental_id | UUID | İlgili kiralama referansı (Yabancı anahtar, NULL olabilir) |
| message_content | TEXT | Mesaj içeriği |
| is_read | BOOLEAN | Okundu mu |
| read_at | TIMESTAMP | Okunma zamanı |
| created_at | TIMESTAMP | Oluşturulma zamanı |

### Bildirimler (notifications)
| Alan | Tür | Açıklama |
|------|-----|----------|
| id | UUID | Benzersiz bildirim kimliği (Birincil anahtar) |
| user_id | UUID | Kullanıcı referansı (Yabancı anahtar) |
| title | VARCHAR(255) | Bildirim başlığı |
| content | TEXT | Bildirim içeriği |
| notification_type | ENUM | Bildirim türü [Sistem, Kiralama, Mesaj, Ödeme] |
| related_id | UUID | İlgili öğe referansı (Kiralama ID, Mesaj ID vb.) |
| is_read | BOOLEAN | Okundu mu |
| read_at | TIMESTAMP | Okunma zamanı |
| created_at | TIMESTAMP | Oluşturulma zamanı |

### Sistem Ayarları (settings)
| Alan | Tür | Açıklama |
|------|-----|----------|
| id | UUID | Benzersiz ayar kimliği (Birincil anahtar) |
| key | VARCHAR(100) | Ayar anahtarı |
| value | TEXT | Ayar değeri |
| group | VARCHAR(100) | Ayar grubu |
| description | TEXT | Ayar açıklaması |
| is_public | BOOLEAN | Herkese açık bir ayar mı |
| updated_by | UUID | Son güncelleyen admin referansı |
| created_at | TIMESTAMP | Oluşturulma zamanı |
| updated_at | TIMESTAMP | Son güncelleme zamanı |

## 3. İndeksler

- users: email, phone_number
- admin_users: user_id, role_id
- roles: name
- permissions: code
- role_permissions: role_id, permission_id
- admin_activity_logs: admin_user_id, entity_type, entity_id
- items: owner_id, category_id, is_available, created_by
- rentals: item_id, renter_id, start_date, end_date, status, last_updated_by
- payments: rental_id, payment_status, admin_id
- reviews: rental_id, reviewer_id, reviewee_id, item_id, approved_by
- messages: sender_id, receiver_id, is_read
- notifications: user_id, is_read
- settings: key, group

## 4. İlişki Diyagramı

```
                         +---------------+
                         |    roles      |
                         +-------+-------+
                                 |
                                 |
                         +-------+-------+
                         | permissions   |
                         +---------------+
                                 |
                                 |
                         +-------+-------+
                         |role_permissions|
                         +-------+-------+
                                 |
                 +---------------+-----------------+
                 |                                 |
        +--------+--------+               +--------+--------+
        | admin_users     |               |admin_activity_log|
        +--------+--------+               +--------+--------+
                 |
                 |
                 v
        +--------+--------+
        |    users        |
        +--------+--------+
                 |
                 |
     +-----------+-----------+------------------+
     |           |           |                  |
+----+------+ +--+---+ +-----+------+     +-----+------+
| addresses | |items | |notifications|     |   settings  |
+----+------+ +--+---+ +------------+     +------------+
                 |
                 |
    +------------+------------+
    |            |            |
+---+---+    +---+---+    +---+---+
|reviews|    |rentals|    |messages|
+-------+    +---+---+    +-------+
                 |
                 |
             +---+---+
             |payments|
             +-------+
```

## 5. Veri Tipleri ve Kısıtlamalar

- UUID'ler standart 36 karakterlik UUID formatında saklanacaktır
- Para birimleri DECIMAL(10,2) olarak saklanacak
- Email adresleri için benzersizlik kontrolü yapılacak
- Puanlar 1-5 arası olacak şekilde kısıtlanacak
- Tarih alanları UTC zaman diliminde saklanacak
- Tüm tablolarda soft delete kullanılacak (is_deleted alanı)
- Admin kullanıcı işlemleri tam olarak loglanacak

## 6. Veri Saklama ve Arşivleme Politikası

- Aktif olmayan kullanıcı verileri 3 yıl saklanacak
- Tamamlanan kiralamalara ait veriler 5 yıl saklanacak
- Mesajlar 2 yıl saklanacak
- Silinen eşyalar arşiv tablosuna taşınacak
- Admin aktivite logları 5 yıl saklanacak

## 7. Veri Migrasyonu Stratejisi

- Veritabanı şema değişiklikleri için migration scriptleri kullanılacak
- Her migration versiyonlandırılacak
- Test ortamında migrasyon testleri yapılacak
- Rollback stratejileri hazırlanacak

## 8. Performans Optimizasyonu

- Sık kullanılan sorgular için uygun indeksler oluşturulacak
- Büyük tablolar için partitioning stratejisi uygulanacak
- Query optimizasyonu yapılacak
- Yavaş sorgu logları analiz edilecek
- Admin paneli sorguları için özel indeksler ve optimizasyonlar 