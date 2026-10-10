# AsesoraT — API Backend

API REST para **AsesoraT**, una plataforma de asesorías académicas entre pares: los estudiantes encuentran asesores por materia y reservan sesiones dentro de su disponibilidad, sin choques de horario.

Stack: **Node.js · Express 5 · TypeScript · MongoDB · Mongoose · JWT · Zod**

Equipo: Emiliano Del Toro Alvarez · Jimena Carolina Corona Vazquez · Sarah Moreno Leon

---

## Features de la versión 0.1 (Entregable 1)

| # | Feature | Estado | Endpoints |
|---|---------|--------|-----------|
| 1 | Autenticación y roles (student / tutor / admin) | Funcional | `/api/auth/*` |
| 2 | Catálogo de materias y perfiles de asesores | Funcional | `/api/subjects/*`, `/api/tutors/*` |
| 3 | Reservación de asesorías (validación de disponibilidad y traslapes) | Funcional | `/api/sessions/*` |

La documentación completa de endpoints está en [`docs/API.md`](docs/API.md).

## Arquitectura

Arquitectura **modular por feature con capas** (Route → Controller → Service → Model):

```
src/
├── app.ts                  # Configura Express, middlewares globales y monta routers
├── server.ts               # Punto de entrada: conecta a MongoDB y levanta el servidor
├── config/
│   ├── env.ts              # Lectura y validación de variables de entorno
│   └── database.ts         # Conexión a MongoDB con Mongoose
├── shared/
│   ├── middlewares/        # authenticate, authorize(roles), validateBody(zod), errorHandler
│   └── utils/              # ApiError, validadores comunes
└── modules/
    ├── auth/               # routes · controller · service · schemas
    ├── users/              # user.model (estudiantes, asesores y admins)
    ├── subjects/           # routes · controller · service · schemas · model
    ├── tutors/             # routes · controller · service · schemas
    └── sessions/           # routes · controller · service · schemas · model · rules
scripts/
└── seed-admin.ts           # Crea el usuario administrador inicial
```

- **Routes**: definen método + ruta y encadenan middlewares (auth, roles, validación).
- **Controllers**: traducen HTTP ↔ dominio (leen `req`, responden con código y JSON).
- **Services**: lógica de negocio y acceso a datos mediante modelos.
- **Models**: esquemas de Mongoose (persistencia en MongoDB).
- **Rules** (`session.rules.ts`): reglas puras sin BD, listas para pruebas unitarias.

## Requisitos

- Node.js 20 o superior
- MongoDB 6+ (local) o un clúster de MongoDB Atlas

## Instalación y ejecución

```bash
git clone <URL-del-repositorio>
cd asesorat-backend
npm install
cp .env.example .env          # edita MONGODB_URI y JWT_SECRET
```

Crear el administrador inicial (necesario para dar de alta materias):

```bash
ADMIN_EMAIL=admin@asesorat.mx ADMIN_PASSWORD=UnaClaveSegura123 npm run seed
```

> En Windows (PowerShell): `$env:ADMIN_EMAIL="admin@asesorat.mx"; $env:ADMIN_PASSWORD="UnaClaveSegura123"; npm run seed`

Modo desarrollo (recarga automática):

```bash
npm run dev
```

Producción:

```bash
npm run build
npm start
```

Verifica que esté arriba: `GET http://localhost:3000/api/health`

## Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto HTTP | `3000` |
| `MONGODB_URI` | Cadena de conexión a MongoDB | `mongodb://127.0.0.1:27017/asesorat` |
| `JWT_SECRET` | Secreto para firmar tokens (no publicar) | cadena larga aleatoria |
| `JWT_EXPIRES_IN` | Vigencia del token | `1d` |

El archivo `.env` está en `.gitignore`; nunca se sube al repositorio.

## Flujo rápido de prueba

1. `POST /api/auth/login` con el admin → copia el `token`.
2. `POST /api/subjects` (Bearer token admin) → crea una materia.
3. `POST /api/auth/register` con `role: "tutor"` y otro con `role: "student"`.
4. `PUT /api/tutors/me/profile` (token del asesor) → materias y disponibilidad.
5. `POST /api/sessions` (token del estudiante) → reserva dentro de la disponibilidad.
6. `PATCH /api/sessions/:id/status` (token del asesor) → `{"status":"confirmed"}`.

## Próximas entregas

Pruebas automatizadas (Jest + Supertest), notificaciones por correo, recordatorios programados, reseñas de asesores, chat en tiempo real, Docker y despliegue con CI/CD.
