// src/index.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import { authRouter } from './routes/auth';
import { recetasRouter } from './routes/recetas';
import { categoriasRouter } from './routes/categorias';
import { ingredientesRouter } from './routes/ingredientes';
import { tiposIngredienteRouter } from './routes/tiposIngrediente';
import { descargasRouter } from './routes/descargas';
import { menuSemanalRouter } from './routes/menuSemanal';
import { errorHandler } from './middleware/errorHandler';
import path from 'path';

export const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Servir frontend web build
const frontendDist = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDist));
app.get('/', (_, res) => res.sendFile(path.join(frontendDist, 'index.html')));

// Rutas API
app.get('/api/health', (_, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));
app.use('/api/auth', authRouter);
app.use('/api/recetas', recetasRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/ingredientes', ingredientesRouter);
app.use('/api/tipos-ingrediente', tiposIngredienteRouter);
app.use('/api/descargas', descargasRouter);
app.use('/api/menu-semanal', menuSemanalRouter);

// Manejo de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🍳 API de Recetas corriendo en http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
