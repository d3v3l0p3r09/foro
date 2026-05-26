# Foro Comunidad

Foro SPA (Angular 17 + Tailwind) con API Laravel (Sanctum + SQLite).

## Arranque

```powershell
# Terminal 1 — API
cd backend
php artisan serve

# Terminal 2 — Web
cd frontend
npm start
```

O ejecuta `.\scripts\start.ps1` desde la raíz.

- Web: http://127.0.0.1:4200
- API: http://127.0.0.1:8000/api

Si PHP global no tiene SQLite: `..\tools\php\php.exe artisan serve`

## Demo

| Email | Contraseña |
|-------|------------|
| `demo@foro.test` | `password123` |

Usuario demo con rol **admin** (panel en `/admin`).

## Google OAuth (Socialite)

1. En `backend`: `composer install` (incluye `laravel/socialite`).
2. Copia variables en `.env` desde `.env.example`:
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_REDIRECT_URI=http://localhost:8000/api/auth/google/callback`
   - `FRONTEND_URL=http://localhost:4200`
3. En [Google Cloud Console](https://console.cloud.google.com/), crea credenciales OAuth y autoriza la URI de redirección anterior.
4. `php artisan migrate` y `php artisan storage:link` (avatars/banners).
5. En login, **Continuar con Google** redirige al flujo OAuth; el callback vuelve a `/auth/callback?token=...`.

## Estructura

```
foro/
├── backend/     # Laravel API
├── frontend/    # Angular
├── scripts/     # start.ps1
└── tools/php/   # PHP portable (opcional)
```
