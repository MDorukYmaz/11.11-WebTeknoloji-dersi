# Kampüs Etkinlikleri — Frontend

Mustafa Doruk Yılmaz · 2416501038

## Canlı Adres

https://mustafadorukyilmaz-frontend.vercel.app

## Kurulum

```bash
cd frontend
npm install
npm run dev
```

## Route Listesi

| Adres | Sayfa |
| --- | --- |
| `/` | HomePage |
| `/events` | EventsPage |
| `/events/:id` | EventDetailPage |
| `/login` | LoginPage |
| `/register` | RegisterPage |
| `/forgot-password` | ForgotPasswordPage |
| `/admin` | AdminPage |
| `/admin/new` | AddEventPage |
| `/admin/:id/edit` | EditEventPage |
| `*` | NotFoundPage |

## Kullanılanlar

- React + TypeScript + Vite
- React Router (`BrowserRouter`, `Routes`, `NavLink`, `Link`, `useParams`, `useNavigate`)
- Context API (`EventsContext`, `useEvents`)
- Controlled form ve doğrulama (`validate-event`)
