-- Kirala - Veritabanı Şeması
-- PostgreSQL veritabanı için SQL şeması

-- ENUM tipleri
CREATE TYPE user_verification_status AS ENUM ('Doğrulanmadı', 'Beklemede', 'Doğrulandı');
CREATE TYPE item_condition AS ENUM ('Yeni', 'Çok İyi', 'İyi', 'Normal', 'Yıpranmış');
CREATE TYPE rental_status AS ENUM ('Talep Edildi', 'Onaylandı', 'Reddedildi', 'İptal Edildi', 'Tamamlandı');
CREATE TYPE payment_status AS ENUM ('Ödenmedi', 'Kısmi Ödendi', 'Ödendi', 'İade Edildi');
CREATE TYPE payment_method AS ENUM ('Kredi Kartı', 'Banka Kartı', 'Havale');
CREATE TYPE delivery_method AS ENUM ('Elden Teslim', 'Kurye', 'Kargo');
CREATE TYPE notification_type AS ENUM ('Sistem', 'Kiralama', 'Mesaj', 'Ödeme');

-- Tablolar
-- 1. Kullanıcılar (users)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) UNIQUE,
    profile_image_url VARCHAR(255),
    date_of_birth DATE,
    id_verification_status user_verification_status DEFAULT 'Doğrulanmadı',
    rating DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    is_admin BOOLEAN DEFAULT FALSE
);

-- 2. Admin Kullanıcılar (admin_users)
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    role_id UUID,
    last_login_at TIMESTAMP,
    last_login_ip VARCHAR(45),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Roller (roles)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role ID referansını güncelle
ALTER TABLE admin_users ADD CONSTRAINT fk_admin_role FOREIGN KEY (role_id) REFERENCES roles(id);

-- 4. İzinler (permissions)
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Rol İzinleri (role_permissions)
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES roles(id),
    permission_id UUID REFERENCES permissions(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

-- 6. Admin Aktivite Logları (admin_activity_logs)
CREATE TABLE admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES admin_users(id),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Adresler (addresses)
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    full_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    is_default BOOLEAN DEFAULT FALSE,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Kategoriler (categories)
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES categories(id),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Eşyalar (items)
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image VARCHAR(255),
  location VARCHAR(255),
  condition VARCHAR(50),
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Eşya Fotoğrafları (item_images)
CREATE TABLE item_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES items(id),
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Eşya Uygunluk Takvimi (item_availability)
CREATE TABLE item_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES items(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Kiralamalar (rentals)
CREATE TABLE rentals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES items(id),
    renter_id UUID REFERENCES users(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) DEFAULT 0,
    status rental_status DEFAULT 'Talep Edildi',
    payment_status payment_status DEFAULT 'Ödenmedi',
    renter_address_id UUID REFERENCES addresses(id),
    delivery_method delivery_method NOT NULL,
    delivery_notes TEXT,
    admin_notes TEXT,
    last_updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. Ödemeler (payments)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rental_id UUID REFERENCES rentals(id),
    amount DECIMAL(10,2) NOT NULL,
    payment_method payment_method NOT NULL,
    payment_status payment_status DEFAULT 'Ödenmedi',
    payment_date TIMESTAMP,
    transaction_id VARCHAR(255),
    payment_provider VARCHAR(100),
    is_deposit BOOLEAN DEFAULT FALSE,
    refund_amount DECIMAL(10,2) DEFAULT 0,
    admin_id UUID REFERENCES admin_users(id),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. Değerlendirmeler (reviews)
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rental_id UUID REFERENCES rentals(id),
    reviewer_id UUID REFERENCES users(id),
    reviewee_id UUID REFERENCES users(id),
    item_id UUID REFERENCES items(id),
    rating INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    is_item_review BOOLEAN DEFAULT TRUE,
    is_user_review BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. Mesajlar (messages)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID REFERENCES users(id),
    receiver_id UUID REFERENCES users(id),
    item_id UUID REFERENCES items(id),
    rental_id UUID REFERENCES rentals(id),
    message_content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. Bildirimler (notifications)
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    notification_type notification_type NOT NULL,
    related_id UUID,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. Sistem Ayarları (settings)
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    "group" VARCHAR(100),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    updated_by UUID REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX idx_admin_users_role_id ON admin_users(role_id);
CREATE INDEX idx_roles_name ON roles(name);
CREATE INDEX idx_permissions_code ON permissions(code);
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_user_id);
CREATE INDEX idx_admin_activity_logs_entity ON admin_activity_logs(entity_type, entity_id);
CREATE INDEX idx_items_owner_id ON items(owner_id);
CREATE INDEX idx_items_category_id ON items(category_id);
CREATE INDEX idx_items_created_by ON items(created_by);
CREATE INDEX idx_items_is_available ON items(is_available);
CREATE INDEX idx_rentals_item_id ON rentals(item_id);
CREATE INDEX idx_rentals_renter_id ON rentals(renter_id);
CREATE INDEX idx_rentals_dates ON rentals(start_date, end_date);
CREATE INDEX idx_rentals_status ON rentals(status);
CREATE INDEX idx_rentals_last_updated_by ON rentals(last_updated_by);
CREATE INDEX idx_payments_rental_id ON payments(rental_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_admin_id ON payments(admin_id);
CREATE INDEX idx_reviews_rental_id ON reviews(rental_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_reviews_item_id ON reviews(item_id);
CREATE INDEX idx_reviews_approved_by ON reviews(approved_by);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_settings_key ON settings(key);
CREATE INDEX idx_settings_group ON settings("group");

-- Trigger fonksiyonları
-- updated_at alanını otomatik güncelleyen fonksiyon
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger tanımlamaları
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_permissions_updated_at BEFORE UPDATE ON permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_item_availability_updated_at BEFORE UPDATE ON item_availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rentals_updated_at BEFORE UPDATE ON rentals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Temel veri ekleme
-- Roller
INSERT INTO roles (name, description) VALUES 
('Süper Admin', 'Tüm sistem üzerinde tam yetki'),
('İçerik Yöneticisi', 'Ürün, kategori ve içerik yönetimi yetkileri'),
('Müşteri Hizmetleri', 'Kullanıcı ve kiralama işlemleri yönetimi'),
('Finans Yöneticisi', 'Ödeme ve finansal işlem yetkileri');

-- İzinler
INSERT INTO permissions (name, code, description) VALUES 
('Kullanıcı Görüntüleme', 'user:view', 'Kullanıcı bilgilerini görüntüleme izni'),
('Kullanıcı Düzenleme', 'user:edit', 'Kullanıcı bilgilerini düzenleme izni'),
('Ürün Görüntüleme', 'item:view', 'Ürün bilgilerini görüntüleme izni'),
('Ürün Ekleme', 'item:add', 'Yeni ürün ekleme izni'),
('Ürün Düzenleme', 'item:edit', 'Ürün bilgilerini düzenleme izni'),
('Ürün Silme', 'item:delete', 'Ürün silme izni'),
('Kategori Yönetimi', 'category:manage', 'Kategori ekleme, düzenleme, silme izni'),
('Kiralama Görüntüleme', 'rental:view', 'Kiralama bilgilerini görüntüleme izni'),
('Kiralama Yönetimi', 'rental:manage', 'Kiralama durumlarını yönetme izni'),
('Ödeme Görüntüleme', 'payment:view', 'Ödeme bilgilerini görüntüleme izni'),
('Ödeme Yönetimi', 'payment:manage', 'Ödeme işlemlerini yönetme izni'),
('İçerik Yönetimi', 'content:manage', 'Site içeriklerini yönetme izni'),
('Rapor Görüntüleme', 'report:view', 'Raporları görüntüleme izni'),
('Sistem Ayarları', 'settings:manage', 'Sistem ayarlarını yönetme izni'),
('Admin Yönetimi', 'admin:manage', 'Admin kullanıcılarını yönetme izni');

-- Süper Admin rolü için tüm izinleri ekle
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'Süper Admin'),
    id
FROM permissions;

-- İçerik Yöneticisi rolü için ilgili izinleri ekle
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'İçerik Yöneticisi'),
    id
FROM permissions 
WHERE code IN ('item:view', 'item:add', 'item:edit', 'item:delete', 'category:manage', 'content:manage', 'report:view');

-- Müşteri Hizmetleri rolü için ilgili izinleri ekle
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'Müşteri Hizmetleri'),
    id
FROM permissions 
WHERE code IN ('user:view', 'user:edit', 'rental:view', 'rental:manage', 'report:view');

-- Finans Yöneticisi rolü için ilgili izinleri ekle
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'Finans Yöneticisi'),
    id
FROM permissions 
WHERE code IN ('rental:view', 'payment:view', 'payment:manage', 'report:view');

-- Ana Kategoriler
INSERT INTO categories (name, slug, description, icon_url) VALUES
('Elektronik', 'elektronik', 'Bilgisayar, telefon, oyun konsolları ve diğer elektronik eşyalar', '/icons/electronics.svg'),
('Ev Aletleri', 'ev-aletleri', 'Beyaz eşya, küçük ev aletleri ve mutfak gereçleri', '/icons/home-appliances.svg'),
('Spor Ekipmanları', 'spor-ekipmanlari', 'Fitness ekipmanları, bisikletler, kamp malzemeleri', '/icons/sports.svg'),
('Kıyafet ve Aksesuarlar', 'kiyafet-aksesuarlar', 'Özel günler için kıyafetler, çantalar, takılar', '/icons/clothing.svg'),
('Etkinlik ve Parti', 'etkinlik-parti', 'Parti malzemeleri, organizasyon ekipmanları', '/icons/events.svg'),
('Bahçe ve Dış Mekan', 'bahce-dis-mekan', 'Bahçe aletleri, dış mekan mobilyaları, barbekü', '/icons/garden.svg'),
('Araç ve Ekipmanlar', 'arac-ekipmanlar', 'El aletleri, tamir ekipmanları, şantiye gereçleri', '/icons/tools.svg'),
('Müzik Aletleri', 'muzik-aletleri', 'Gitarlar, piyanolar, davullar ve diğer müzik aletleri', '/icons/music.svg'),
('Bebek ve Çocuk', 'bebek-cocuk', 'Bebek arabaları, oyuncaklar, çocuk mobilyaları', '/icons/baby.svg'),
('Kitaplar ve Hobiler', 'kitaplar-hobiler', 'Kitaplar, board game'ler, hobi malzemeleri', '/icons/books.svg');

-- Alt Kategoriler (Örnekler)
-- Elektronik alt kategorileri
INSERT INTO categories (parent_id, name, slug, description, icon_url) VALUES
((SELECT id FROM categories WHERE slug = 'elektronik'), 'Bilgisayarlar', 'bilgisayarlar', 'Laptop, masaüstü bilgisayarlar ve aksesuarlar', '/icons/computers.svg'),
((SELECT id FROM categories WHERE slug = 'elektronik'), 'Telefonlar', 'telefonlar', 'Akıllı telefonlar ve aksesuarlar', '/icons/phones.svg'),
((SELECT id FROM categories WHERE slug = 'elektronik'), 'Oyun Konsolları', 'oyun-konsollari', 'PlayStation, Xbox, Nintendo ve diğer oyun konsolları', '/icons/gaming.svg'),
((SELECT id FROM categories WHERE slug = 'elektronik'), 'Kameralar', 'kameralar', 'Fotoğraf makineleri, video kameralar', '/icons/cameras.svg'),
((SELECT id FROM categories WHERE slug = 'elektronik'), 'Ses Sistemleri', 'ses-sistemleri', 'Hoparlörler, amfiler, mikrofonlar', '/icons/audio.svg');

-- Sistem Ayarları
INSERT INTO settings (key, value, "group", description, is_public) VALUES
('site_name', 'Kirala', 'general', 'Site adı', TRUE),
('site_description', 'Eşyalarını kirala, ihtiyacın olanı bul', 'general', 'Site açıklaması', TRUE),
('contact_email', 'info@kirala.com', 'contact', 'İletişim e-posta adresi', TRUE),
('contact_phone', '+90 (555) 123 4567', 'contact', 'İletişim telefon numarası', TRUE),
('min_rental_days', '1', 'rental', 'Minimum kiralama süresi (gün)', TRUE),
('max_rental_days', '30', 'rental', 'Maksimum kiralama süresi (gün)', TRUE),
('service_fee_percentage', '10', 'fees', 'Hizmet bedeli yüzdesi', TRUE),
('platform_currency', 'TRY', 'general', 'Platform para birimi', TRUE),
('default_language', 'tr', 'general', 'Varsayılan dil', TRUE),
('maintenance_mode', 'false', 'system', 'Bakım modu aktif mi', FALSE); 