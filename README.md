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

## Despliegue en producción (web completa)

Necesitas **dos servicios gratis**: Vercel (frontend) + Render (backend).

### 1. Backend en Render

1. [render.com](https://render.com) → **New → Blueprint** → conecta el repo `foro`.
2. Render crea **foro-api** + base PostgreSQL **foro-db** desde `render.yaml`.
3. Tras el deploy, copia la URL de la API (ej. `https://foro-api.onrender.com`).
4. En Render → **foro-api → Environment**, completa:

| Variable | Ejemplo |
|----------|---------|
| `APP_URL` | `https://foro-api.onrender.com` |
| `FRONTEND_URL` | `https://foro.vercel.app` |
| `CORS_ALLOWED_ORIGINS` | `https://foro.vercel.app` |
| `GOOGLE_REDIRECT_URI` | `https://foro-api.onrender.com/api/auth/google/callback` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | tus credenciales |

5. Health check: `https://foro-api.onrender.com/up`

### 2. Frontend en Vercel

1. [vercel.com](https://vercel.com) → importa el repo **foro**.
2. **Root Directory:** `./` (raíz). El archivo `vercel.json` ya configura el build.
3. **No toques** Install/Build/Output manualmente si `vercel.json` está en el repo.
   - Install: `cd frontend && npm install`
   - Build: `cd frontend && npm run build:vercel`
   - Output: `frontend/dist/foro-frontend/browser`
4. **Environment Variables:**

| Variable | Valor |
|----------|--------|
| `API_URL` | `https://foro-api.onrender.com/api` |
| `FRONTEND_URL` | `https://TU-PROYECTO.vercel.app` |

5. Deploy.

### 3. Google OAuth (producción)

En Google Cloud Console añade:

- Redirect: `https://foro-api.onrender.com/api/auth/google/callback`
- Orígenes: tu URL de Vercel + URL de Render

### Notas

- El plan free de Render **apaga la API tras inactividad** (~50 s al despertar).
- Sube avatars/banners: en Render el disco es efímero; para producción real usa S3 o similar.
- Si Vercel falla con "dist/... No such file": borra overrides manuales en Build Settings y redeploy.
