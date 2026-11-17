# Kampüs API — Backend (Sprint 8)

Mustafa Doruk Yılmaz · 2416501038

Etkinlikleri JSON olarak veren Express REST API. Veri MongoDB Atlas'taki `kampus` veritabanının `events` koleksiyonunda tutulur (resmi `mongodb` sürücüsü). POST ile eklenen kayıtlar sunucu yeniden başlasa da kalır.

## Kurulum

```bash
cd backend
npm install
cp .env.example .env   # MONGODB_URI değerini kendi Atlas adresinle doldur
npm run seed           # events koleksiyonunu boşaltıp 6 başlangıç kaydını yükler
npm run dev
```

API: `http://localhost:3000` (port `.env` içindeki `PORT` değerinden okunur). Sunucu açılırken MongoDB'ye bağlanır; bağlanamazsa hata mesajı yazıp kapanır.

> Atlas'ta **Network Access** listesinde kendi IP adresin ekli olmalı, yoksa bağlantı zaman aşımına uğrar.

### Yerel MongoDB ile çalıştırma

Aynı kod, bilgisayarda kurulu MongoDB ile de çalışır. Sadece `MONGODB_URI` değişir:

| Ortam | `MONGODB_URI` |
|---|---|
| Atlas (bulut) | `mongodb+srv://<kullanici>:<sifre>@<cluster-adresi>.mongodb.net/kampus` |
| Yerel | `mongodb://localhost:27017/kampus` |

`.env` dosyasını değiştirmeden tek seferlik yerel deneme (Git Bash):

```bash
MONGODB_URI=mongodb://localhost:27017/kampus npm run seed
MONGODB_URI=mongodb://localhost:27017/kampus npm run dev
```

Konsolda `MongoDB bağlandı: kampus` yazısı bağlantının kurulduğunu gösterir. Atlas ve yerel veritabanı ayrı olduğu için id'ler ikisinde farklıdır.

## Klasör yapısı

| Dosya | İşi |
|---|---|
| `src/app.js` | Express uygulaması, middleware, route'ları bağlar |
| `src/server.js` | `.env`'i okur, MongoDB'ye bağlanır, portu dinler |
| `src/db.js` | MongoDB bağlantısı ve `events` koleksiyonu |
| `src/seed.js` | `npm run seed`: başlangıç verisini koleksiyona yükler |
| `src/routes/event-routes.js` | Hangi adres hangi fonksiyona gider |
| `src/controllers/event-controller.js` | İsteği işler, MongoDB'den okur/yazar, yanıtı döndürür |
| `src/data/events.js` | Seed için başlangıç verisi |

## REST sözleşmesi

| Method | Endpoint | Amaç | Başarılı | Hata | Durum |
|---|---|---|---|---|---|
| GET | `/health` | Sunucu ayakta mı | 200 | — | Sprint 7 |
| GET | `/events` | Listeyi getir, tarihe göre sıralı (`?category=Atölye` isteğe bağlı) | 200 | — | Sprint 8 (MongoDB) |
| GET | `/events/:id` | Tek etkinlik | 200 | 404 | Sprint 8 (MongoDB) |
| POST | `/events` | Yeni etkinlik | 201 | 400 | Sprint 8 (MongoDB) |
| PATCH | `/events/:id` | Güncelle | 200 | 400, 404 | Sprint 9 |
| DELETE | `/events/:id` | Sil | 204 | 404 | Sprint 9 |

### Etkinlik nesnesi

```json
{
  "id": "6afcccf341be5935f71f0c35",
  "title": "Kariyer Günleri 2026",
  "category": "Seminer",
  "date": "2026-10-12",
  "time": "14:00",
  "location": "A Blok Konferans Salonu",
  "description": "Mezunlarla kariyer söyleşileri ve şirket standları.",
  "capacity": 25
}
```

`id`, MongoDB'nin ürettiği `_id` (ObjectId) değerinin metin hâlidir: veritabanında `_id` olarak durur, API'de `id` adıyla döner. Geçersiz biçimdeki bir id (ör. `yok`) de `404` döner.

### POST /events

Zorunlu alanlar: `title`, `category`, `date`. Eksikse `400` ve `{ "error": { "message": "title, category and date are required" } }`. `capacity`, `time`, `location`, `description` isteğe bağlıdır; `id` MongoDB tarafından üretilir.

### Hata biçimi

Tüm hatalar aynı biçimde döner:

```json
{ "error": { "message": "Event not found" } }
```

| Durum | Ne zaman |
|---|---|
| 400 | Eksik zorunlu alan veya bozuk JSON |
| 404 | Olmayan etkinlik id'si veya bilinmeyen route |

## İstek koleksiyonu

`requests/kampus-api.json` — Postman "Kampüs API" collection'ı (v2.1). Postman'de **Import** ile açılır.

| # | İstek | Beklenen |
|---|---|---|
| 1 | GET /health | 200 · ok + student |
| 2 | GET /events | 200 · 6 kayıt |
| 3 | GET /events/{{eventId}} | 200 · tek kayıt (`eventId`, 2. istekte otomatik kaydedilir) |
| 4 | GET /events/yok | 404 · error |
| 5 | POST /events (tam body) | 201 · yeni id |
| 6 | POST /events (sadece title) | 400 · error |
