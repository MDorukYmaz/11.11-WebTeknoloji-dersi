# Kampüs API — Backend (Sprint 8)

Mustafa Doruk Yılmaz · 2416501038

Etkinlikleri JSON olarak veren Express REST API. Veri MongoDB'deki `kampus` veritabanının `events` koleksiyonunda tutulur; erişim **Mongoose** ile `Event` modeli üzerinden yapılır. POST ile eklenen kayıtlar sunucu yeniden başlasa da kalır.

## Kurulum

```bash
cd backend
npm install
cp .env.example .env   # MONGODB_URI değerini kendi veritabanı adresinle doldur
npm run seed           # events koleksiyonunu boşaltıp 6 başlangıç kaydını yükler
npm run dev
```

API: `http://localhost:3000` (port `.env` içindeki `PORT` değerinden okunur). Sunucu önce MongoDB'ye bağlanır, sonra portu dinler; bağlanamazsa `Bağlanılamadı: ...` yazıp kapanır.

Bağlantı kurulunca konsolda yalnızca host ve veritabanı adı yazılır (şifre asla yazdırılmaz):

```
MongoDB bağlandı (Atlas): ac-...mongodb.net/kampus
MongoDB bağlandı (yerel): 127.0.0.1/kampus
```

### Veritabanı adresi

| Ortam | `MONGODB_URI` |
|---|---|
| Yerel | `mongodb://127.0.0.1:27017/kampus` |
| Atlas (bulut) | `mongodb+srv://<kullanici>:<sifre>@<cluster-adresi>.mongodb.net/kampus` |

Gerçek adres yalnızca `backend/.env` dosyasına yazılır; `.env` git'e girmez. Atlas'ta **Network Access** listesinde `0.0.0.0/0` (veya kendi IP adresin) ekli olmalı, yoksa bağlantı zaman aşımına uğrar. Okul ağı engelliyorsa telefon hotspot'u ile denenebilir.

## Klasör yapısı

| Dosya | İşi |
|---|---|
| `src/server.js` | `.env`'i okur, önce veritabanına bağlanır, sonra portu dinler |
| `src/app.js` | Express uygulaması, middleware, route'lar, 404 ve hata yakalayıcı |
| `src/config/database.js` | `connectDatabase()`: Mongoose bağlantısı |
| `src/models/event-model.js` | `Event` schema'sı (alan kuralları) ve modeli |
| `src/routes/event-routes.js` | Hangi adres hangi fonksiyona gider |
| `src/controllers/event-controller.js` | `Event.find / findById / create` ile isteği işler |
| `src/data/seed-events.js` | Seed için 6 başlangıç etkinliği (id alanı yok) |
| `src/seed.js` | `npm run seed`: `deleteMany` + `insertMany` |

## Event schema'sı

| Alan | Tür | Kurallar |
|---|---|---|
| `title` | String | zorunlu, trim, 3–100 karakter |
| `category` | String | zorunlu, `Seminer` · `Atölye` · `Söyleşi` · `Yarışma` |
| `capacity` | Number | en az 0, varsayılan 0 |
| `date` | String | zorunlu (`YYYY-MM-DD`) |
| `time` | String | varsayılan `""` |
| `location` | String | trim, varsayılan `""` |
| `description` | String | trim, en fazla 500 karakter, varsayılan `""` |

`timestamps: true` olduğu için her kayıtta `createdAt` ve `updatedAt` kendiliğinden tutulur.

## REST sözleşmesi

| Method | Endpoint | Amaç | Başarılı | Hata | Durum |
|---|---|---|---|---|---|
| GET | `/health` | Sunucu ayakta mı | 200 | — | Sprint 7 |
| GET | `/events` | Listeyi getir, tarihe göre sıralı (`?category=Atölye` isteğe bağlı) | 200 | — | Sprint 8 |
| GET | `/events/:id` | Tek etkinlik | 200 | 404 | Sprint 8 |
| POST | `/events` | Yeni etkinlik | 201 | 400 | Sprint 8 |
| PATCH | `/events/:id` | Güncelle | 200 | 400, 404 | Sprint 9 |
| DELETE | `/events/:id` | Sil | 204 | 404 | Sprint 9 |

### Etkinlik nesnesi

```json
{
  "_id": "6afcccf341be5935f71f0c35",
  "title": "Drone Kodlama Atölyesi",
  "category": "Atölye",
  "capacity": 20,
  "date": "2026-10-20",
  "time": "10:00",
  "location": "Elektronik Laboratuvarı 3",
  "description": "Mini drone'ları blok kodlama ile uçurma ve basit görev senaryoları.",
  "createdAt": "2026-11-18T09:00:00.000Z",
  "updatedAt": "2026-11-18T09:00:00.000Z",
  "__v": 0
}
```

`_id` MongoDB'nin her kayda verdiği kimliktir (Sprint 7'deki `"event-2"` gibi id'ler artık yok). `GET /events/:id` için listeden bir `_id` kopyalanır. Biçimi yanlış id (ör. `yok`) da, biçimi doğru ama kaydı olmayan id de `404` döner.

### POST /events

Doğrulamayı schema yapar. Zorunlu alan eksikse, kategori listede yoksa ya da başlık 3 karakterden kısaysa `400` döner; mesaj Mongoose'un doğrulama mesajıdır:

```json
{ "error": { "message": "Event validation failed: date: Path `date` is required., category: Path `category` is required." } }
```

### Hata biçimi

Tüm hatalar aynı biçimde döner: `{ "error": { "message": "..." } }`

| Durum | Ne zaman |
|---|---|
| 400 | Schema doğrulaması başarısız veya bozuk JSON |
| 404 | Olmayan / geçersiz etkinlik id'si (`Event not found`) veya bilinmeyen route (`Route not found`) |
| 500 | Beklenmeyen hata (`Server error`); ayrıntı yalnızca terminale yazılır, sunucu çalışmaya devam eder |

## İstek koleksiyonu

`requests/kampus-api.json` — Postman "Kampüs API" collection'ı (v2.1). Postman'de **Import** ile açılır.

| # | İstek | Beklenen |
|---|---|---|
| 1 | GET /health | 200 · ok + student |
| 2 | GET /events | 200 · 6 kayıt (seed sonrası) |
| 3 | GET /events/{{eventId}} | 200 · tek kayıt (`eventId`, 2. istekte listedeki ilk `_id`'den otomatik kaydedilir) |
| 4 | GET /events/yok | 404 · error |
| 5 | POST /events (tam body) | 201 · `_id` + `createdAt` |
| 6 | POST /events (sadece title) | 400 · error |

## Kalıcılık testi

1. `npm run seed`, sonra `npm run dev`
2. POST /events → 201, dönen `_id`'yi not al
3. Terminalde Ctrl+C ile sunucuyu durdur, tekrar `npm run dev`
4. GET /events → 7 kayıt, yeni etkinlik listede
