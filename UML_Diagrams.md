# Kirala - UML Diyagramları Dokümanı

## 1. Sınıf Diyagramı (Class Diagram)

### Temel Sınıflar ve İlişkileri

```plantuml
@startuml

' Kullanıcı ile ilgili sınıflar
class User {
  -id: UUID
  -email: String
  -password: String
  -name: String
  -phone: String
  -address: Address
  -rating: Float
  -isVerified: Boolean
  +register()
  +login()
  +updateProfile()
  +verifyIdentity()
}

class Address {
  -id: UUID
  -city: String
  -district: String
  -fullAddress: String
  -coordinates: Coordinates
}

' Eşya ile ilgili sınıflar
class Item {
  -id: UUID
  -owner: User
  -title: String
  -description: String
  -category: Category
  -price: Decimal
  -images: List<Image>
  -availability: List<Availability>
  -status: ItemStatus
  +listItem()
  +updateItem()
  +deleteItem()
}

class Category {
  -id: UUID
  -name: String
  -parentCategory: Category
  -subCategories: List<Category>
}

class Availability {
  -id: UUID
  -startDate: DateTime
  -endDate: DateTime
  -isAvailable: Boolean
}

' Kiralama ile ilgili sınıflar
class Rental {
  -id: UUID
  -item: Item
  -renter: User
  -startDate: DateTime
  -endDate: DateTime
  -status: RentalStatus
  -payment: Payment
  +createRental()
  +cancelRental()
  +completeRental()
}

class Payment {
  -id: UUID
  -amount: Decimal
  -status: PaymentStatus
  -paymentMethod: PaymentMethod
  -transactionId: String
  +processPayment()
  +refund()
}

' Değerlendirme sistemi
class Review {
  -id: UUID
  -user: User
  -item: Item
  -rating: Integer
  -comment: String
  -date: DateTime
  +createReview()
  +updateReview()
}

' Mesajlaşma sistemi
class Message {
  -id: UUID
  -sender: User
  -receiver: User
  -content: String
  -timestamp: DateTime
  -isRead: Boolean
  +sendMessage()
  +markAsRead()
}

' İlişkiler
User "1" -- "*" Item : owns
User "1" -- "*" Rental : makes
Item "1" -- "*" Rental : has
Rental "1" -- "1" Payment : has
User "1" -- "*" Review : writes
Item "1" -- "*" Review : receives
User "1" -- "*" Message : sends
User "1" -- "*" Message : receives

@enduml
```

## 2. Use Case Diyagramı

```plantuml
@startuml

left to right direction
skinparam packageStyle rectangle

actor "Kullanıcı" as User
actor "Sistem" as System

rectangle "Kirala Platformu" {
  usecase "Hesap Oluşturma" as UC1
  usecase "Giriş Yapma" as UC2
  usecase "Eşya Listeleme" as UC3
  usecase "Eşya Arama" as UC4
  usecase "Kiralama İşlemi" as UC5
  usecase "Ödeme Yapma" as UC6
  usecase "Mesajlaşma" as UC7
  usecase "Değerlendirme Yapma" as UC8
  usecase "Profil Yönetimi" as UC9
}

User --> UC1
User --> UC2
User --> UC3
User --> UC4
User --> UC5
User --> UC6
User --> UC7
User --> UC8
User --> UC9

System --> UC1 : Doğrulama
System --> UC2 : Kimlik Doğrulama
System --> UC5 : Rezervasyon Kontrolü
System --> UC6 : Ödeme İşlemi

@enduml
```

## 3. Aktivite Diyagramı (Kiralama Süreci)

```plantuml
@startuml

start
:Kiracı eşya araması yapar;
if (Eşya bulundu mu?) then (evet)
  :Eşya detaylarını görüntüler;
  if (Uygun mu?) then (evet)
    :Kiralama talebi oluşturur;
    :Kiraya veren onaylar;
    if (Onaylandı mı?) then (evet)
      :Ödeme yapılır;
      :Kiralama başlar;
      :Eşya teslim alınır;
      :Kiralama süresi biter;
      :Eşya iade edilir;
      :Değerlendirme yapılır;
    else (hayır)
      :İşlem iptal edilir;
    endif
  else (hayır)
    :Aramaya devam eder;
  endif
else (hayır)
  :Aramaya devam eder;
endif
stop

@enduml
```

## 4. Sekans Diyagramı (Kiralama İşlemi)

```plantuml
@startuml

actor Kiracı
participant "Kirala Platformu" as Platform
participant "Ödeme Sistemi" as Payment
participant "Kiraya Veren" as Owner

Kiracı -> Platform: Eşya seçimi
Platform -> Kiracı: Eşya detayları
Kiracı -> Platform: Kiralama talebi
Platform -> Owner: Bildirim gönder
Owner -> Platform: Talebi onayla
Platform -> Payment: Ödeme talebi
Payment -> Kiracı: Ödeme sayfası
Kiracı -> Payment: Ödeme yap
Payment -> Platform: Ödeme onayı
Platform -> Owner: Ödeme bildirimi
Platform -> Kiracı: Kiralama onayı

@enduml
```

## 5. Bileşen Diyagramı

```plantuml
@startuml

package "Frontend" {
  [Web Uygulaması]
  [Mobil Uygulama]
}

package "Backend" {
  [API Gateway]
  [Kullanıcı Servisi]
  [Eşya Servisi]
  [Kiralama Servisi]
  [Ödeme Servisi]
  [Mesajlaşma Servisi]
  [Bildirim Servisi]
}

database "Veritabanı" {
  [PostgreSQL]
}

cloud "Harici Servisler" {
  [Ödeme Gateway]
  [E-posta Servisi]
  [SMS Servisi]
  [Storage Servisi]
}

[Web Uygulaması] --> [API Gateway]
[Mobil Uygulama] --> [API Gateway]
[API Gateway] --> [Kullanıcı Servisi]
[API Gateway] --> [Eşya Servisi]
[API Gateway] --> [Kiralama Servisi]
[API Gateway] --> [Ödeme Servisi]
[API Gateway] --> [Mesajlaşma Servisi]
[API Gateway] --> [Bildirim Servisi]

[Kullanıcı Servisi] --> [PostgreSQL]
[Eşya Servisi] --> [PostgreSQL]
[Kiralama Servisi] --> [PostgreSQL]
[Ödeme Servisi] --> [PostgreSQL]
[Mesajlaşma Servisi] --> [PostgreSQL]

[Ödeme Servisi] --> [Ödeme Gateway]
[Bildirim Servisi] --> [E-posta Servisi]
[Bildirim Servisi] --> [SMS Servisi]
[Eşya Servisi] --> [Storage Servisi]

@enduml
```

## Notlar ve Açıklamalar

1. **Sınıf Diyagramı**:
   - Temel iş mantığını ve veri yapısını gösterir
   - Sınıflar arası ilişkileri ve özellikleri içerir
   - Her sınıfın temel metodları belirtilmiştir

2. **Use Case Diyagramı**:
   - Sistemin temel kullanım senaryolarını gösterir
   - Kullanıcı etkileşimlerini ve sistem davranışlarını içerir

3. **Aktivite Diyagramı**:
   - Kiralama sürecinin adım adım akışını gösterir
   - Karar noktaları ve alternatif akışlar belirtilmiştir

4. **Sekans Diyagramı**:
   - Kiralama işleminin sistemler arası etkileşimini gösterir
   - Zaman akışı ve mesajlaşma sırası belirtilmiştir

5. **Bileşen Diyagramı**:
   - Sistemin mimari yapısını gösterir
   - Servisler arası bağımlılıkları ve iletişimi içerir

## Kullanım İpuçları

1. Bu diyagramları çizerken PlantUML veya benzeri bir UML araç kullanabilirsiniz
2. Diyagramları projenin gelişimine göre güncel tutun
3. Her diyagramı ayrı bir dosyada saklayabilirsiniz
4. Diyagramları dokümantasyonunuzla birlikte versiyonlayın 