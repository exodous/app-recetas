# App de Recetas 🍳

Aplicación web y móvil de recetas de cocina.

## Stack

| Capa | Tecnología |
|---|---|
| **Frontend** | React Native + Expo (web + móvil) |
| **Backend** | Node.js + Express + TypeScript |
| **Base datos** | PostgreSQL |
| **ORM** | Prisma |
| **Auth** | JWT |
| **i18n** | Español / Inglés |

## Estructura

```
app-recetas/
├── backend/          # API REST (Express + Prisma)
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── package.json
├── frontend/         # App React Native + Expo
│   ├── src/
│   │   ├── screens/
│   │   ├── navigation/
│   │   ├── context/
│   │   ├── services/
│   │   ├── i18n/
│   │   └── types/
│   ├── App.tsx
│   └── package.json
└── README.md
```

## Primeros Pasos

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Configurar DATABASE_URL y JWT_SECRET en .env
npx prisma db push
npx prisma db seed  # Carga categorías e ingredientes iniciales
npm run dev          # http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npx expo start
```

## API Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| POST | /api/auth/registrar | Crear cuenta |
| POST | /api/auth/login | Iniciar sesión |
| GET | /api/recetas | Listar recetas |
| POST | /api/recetas | Crear receta |
| PUT | /api/recetas/:id | Actualizar receta |
| DELETE | /api/recetas/:id | Eliminar receta |
| GET | /api/categorias | Listar categorías |
| GET | /api/ingredientes | Listar ingredientes |
| POST | /api/ingredientes | Crear ingrediente |
| POST | /api/descargas/:recetaId | Descargar receta offline |

## Roadmap

- [x] Fase 1: Backend API + modelo de datos
- [x] Fase 2: Frontend estructura + navegación + i18n
- [x] Fase 3: Pantallas principales (Home, Detalle, Nueva Receta, Ingredientes)
- [ ] Fase 4: Hosting en la nube (Railway + Supabase)
- [ ] Fase 5: Mejoras UI + fotos
- [ ] Fase 6: Modo offline con sincronización
