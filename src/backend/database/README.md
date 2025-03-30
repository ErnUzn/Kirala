# Kirala - Veritabanı Kurulumu

Bu klasör, Kirala platformu veritabanı şemasını ve kurulum dosyalarını içerir.

## Veritabanı Yapısı

Kirala platformu için PostgreSQL veritabanı kullanılmaktadır. Veritabanı şeması aşağıdaki ana bileşenleri içerir:

- Kullanıcı yönetimi (users, admin_users, roles, permissions)
- Ürün (eşya) yönetimi (items, item_images, item_availability)
- Kategori yönetimi (categories)
- Kiralama işlemleri (rentals)
- Ödeme işlemleri (payments)
- Değerlendirme ve yorumlar (reviews)
- Mesajlaşma sistemi (messages)
- Bildirim sistemi (notifications)
- Sistem ayarları (settings)

## Kurulum Adımları

### 1. PostgreSQL Kurulumu

PostgreSQL veritabanı sistemi kurulu değilse, aşağıdaki adımları izleyerek kurabilirsiniz:

#### Windows için:
1. [PostgreSQL indirme sayfasından](https://www.postgresql.org/download/windows/) en son sürümü indirin
2. İndirilen kurulum dosyasını çalıştırın ve talimatları izleyin
3. Kurulum sırasında bir şifre belirlemeniz istenecektir, bunu unutmayın
4. Kurulum tamamlandıktan sonra pgAdmin arayüzünü kullanarak veritabanı sunucunuza bağlanabilirsiniz

#### MacOS için:
```
brew install postgresql
brew services start postgresql
```

#### Linux (Ubuntu/Debian) için:
```
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Veritabanı Oluşturma

PostgreSQL kurulduktan sonra, Kirala uygulaması için bir veritabanı oluşturun:

```
createdb kirala
```
cd "C:\Program Files\PostgreSQL\17\bin"

Ya da pgAdmin arayüzünü kullanarak veritabanı oluşturabilirsiniz.

### 3. Şema Kurulumu

Veritabanı şemasını kurmak için aşağıdaki komutu çalıştırın:

```
psql -d kirala -f schema.sql
```

## Veritabanı Bağlantısı

Veritabanına bağlanmak için gerekli bağlantı dizesi (connection string) örneği:

```
postgresql://username:password@localhost:5432/kirala
```

Bu bağlantı dizesini uygulamanın `.env` dosyasında aşağıdaki şekilde tanımlayabilirsiniz:

```
DATABASE_URL=postgresql://username:password@localhost:5432/kirala
```

## Şema Değişiklikleri ve Migrations

Veritabanı şemasında yapılacak değişiklikler için migration sistemi kullanılacaktır. Bu klasörde ileride `migrations` adlı bir alt klasör oluşturulacak ve versiyonlanmış migration dosyaları burada saklanacaktır.

## Veritabanı Yedeği Alma

PostgreSQL veritabanının yedeğini almak için:

```
pg_dump -U username kirala > kirala_backup.sql
```

## Veritabanı Yedeğini Geri Yükleme

Yedekten veritabanını geri yüklemek için:

```
psql -U username kirala < kirala_backup.sql
```

psql -U postgres 

CREATE DATABASE kirala; 

\c kirala 