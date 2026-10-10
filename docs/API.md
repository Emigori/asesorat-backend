# Documentación de la API — AsesoraT v0.1

Base URL local: `http://localhost:3000`. Todas las respuestas son JSON. Los errores tienen la forma `{ "error": "mensaje", "details"?: [...] }`.

Autenticación: header `Authorization: Bearer <token>` (JWT obtenido en `/api/auth/login` o `/api/auth/register`).


## Salud

| Método | Endpoint | Propósito | Request | Response | HTTP |
|---|---|---|---|---|---|
| GET | `/api/health` | Verificar que el servicio está activo | — | { status, service, timestamp } | 200 |

## Auth

| Método | Endpoint | Propósito | Request | Response | HTTP |
|---|---|---|---|---|---|
| POST | `/api/auth/register` | Crear cuenta de estudiante o asesor | { name, email, password, role?, career? } | { user, token } | 201, 400, 409 |
| POST | `/api/auth/login` | Iniciar sesión y obtener JWT | { email, password } | { user, token } | 200, 400, 401 |
| GET | `/api/auth/me` | Consultar el perfil del usuario autenticado | Header Authorization: Bearer | { user } | 200, 401, 404 |

## Catálogo

| Método | Endpoint | Propósito | Request | Response | HTTP |
|---|---|---|---|---|---|
| GET | `/api/subjects` | Listar materias (filtro ?search=) | Query: search? | { subjects: [...] } | 200 |
| GET | `/api/subjects/:id` | Obtener una materia | Param: id | { subject } | 200, 400, 404 |
| POST | `/api/subjects` | Crear materia (sólo admin) | Bearer (admin) + { code, name, department?, description? } | { subject } | 201, 400, 401, 403, 409 |
| PUT | `/api/tutors/me/profile` | Asesor define materias, bio y disponibilidad | Bearer (tutor) + { bio?, subjects: [id], availability: [{ dayOfWeek, from, to }] } | { tutor } | 200, 400, 401, 403 |
| GET | `/api/tutors` | Listar asesores (filtro ?subject=id) | Query: subject? | { tutors: [...] } | 200, 400 |

## Asesorías

| Método | Endpoint | Propósito | Request | Response | HTTP |
|---|---|---|---|---|---|
| POST | `/api/sessions` | Reservar asesoría (sólo estudiante) | Bearer (student) + { tutorId, subjectId, startsAt (ISO), durationMin, topic? } | { session } (status: pending) | 201, 400, 401, 403, 404, 409 |
| GET | `/api/sessions/me` | Listar mis asesorías (como estudiante o asesor), ?status= | Bearer (student \| tutor) | { sessions: [...] } | 200, 400, 401, 403 |
| PATCH | `/api/sessions/:id/status` | Confirmar, cancelar o completar una asesoría | Bearer + { status: confirmed \| cancelled \| completed } | { session } | 200, 400, 401, 403, 404, 409 |

## Reglas de negocio de reservaciones

- La sesión debe iniciar en el futuro y durar 30, 60, 90 o 120 minutos.
- El asesor debe impartir la materia solicitada.
- El intervalo completo debe caber en un bloque de disponibilidad del asesor (zona horaria America/Mexico_City).
- No puede traslaparse con otra sesión *pending* o *confirmed* del asesor ni del estudiante (409).
- Transiciones de estado: pending → confirmed (asesor); pending/confirmed → cancelled (estudiante o asesor); confirmed → completed (asesor). Otra transición → 409.

## Códigos HTTP usados

| Código | Significado |
|---|---|
| 200 | OK |
| 201 | Recurso creado |
| 400 | Datos inválidos / regla de negocio no cumplida |
| 401 | Sin token, token inválido o credenciales incorrectas |
| 403 | Rol sin permiso u operación sobre recurso ajeno |
| 404 | Recurso no encontrado |
| 409 | Conflicto (duplicado, traslape o transición no permitida) |
| 500 | Error interno |
