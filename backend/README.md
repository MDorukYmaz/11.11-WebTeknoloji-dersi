# Kampüs API — Backend (Sprint 7)

Mustafa Doruk Yılmaz · 2416501038

Etkinlikleri JSON olarak veren Express REST API. Veri şimdilik bellekte (`src/data/events.js`); sunucu yeniden başlayınca POST ile eklenenler silinir.

## Kurulum

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

API: `http://localhost:3000` (port `.env` içindeki `PORT` değerinden okunur).

## Klasör yapısı

| Dosya | İşi |
|---|---|
| `src/app.js` | Express uygulaması, middleware, route'ları bağlar |
| `src/server.js` | `.env`'i okur, portu dinler |
| `src/routes/event-routes.js` | Hangi adres hangi fonksiyona gider |
| `src/controllers/event-controller.js` | İsteği işler, yanıtı döndürür |
| `src/data/events.js` | Bellek içi etkinlik dizisi |

## REST sözleşmesi

| Method | Endpoint | Amaç | Başarılı | Hata | Durum |
|---|---|---|---|---|---|
| GET | `/health` | Sunucu ayakta mı | 200 | — | Bu sprint |
| GET | `/events` | Listeyi getir (`?category=Atölye` isteğe bağlı) | 200 | — | Bu sprint |
| GET | `/events/:id` | Tek etkinlik | 200 | 404 | Bu sprint |
| POST | `/events` | Yeni etkinlik | 201 | 400 | Bu sprint |
| PATCH | `/events/:id` | Güncelle | 200 | 400, 404 | Sprint 9 |
| DELETE | `/events/:id` | Sil | 204 | 404 | Sprint 9 |

### Etkinlik nesnesi

```json
{
  "id": "event-1",
  "title": "Kariyer Günleri 2026",
  "category": "Seminer",
  "date": "2026-10-12",
  "time": "14:00",
  "location": "A Blok Konferans Salonu",
  "description": "Mezunlarla kariyer söyleşileri ve şirket standları.",
  "capacity": 25
}
```

### POST /events

Zorunlu alanlar: `title`, `category`, `date`. Eksikse `400` ve `{ "error": { "message": "title, category and date are required" } }`. `capacity`, `time`, `location`, `description` isteğe bağlıdır; `id` sunucu tarafından üretilir (`event-<zaman damgası>`).

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
| 3 | GET /events/event-2 | 200 · event-2 |
| 4 | GET /events/yok | 404 · error |
| 5 | POST /events (tam body) | 201 · yeni id |
| 6 | POST /events (sadece title) | 400 · error |
