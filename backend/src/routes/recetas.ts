// src/routes/recetas.ts
import { Router } from 'express';
import { listar, obtener, crear, actualizar, eliminar } from '../controllers/recetas';
import { authMiddleware } from '../middleware/auth';

export const recetasRouter = Router();

recetasRouter.use(authMiddleware);

recetasRouter.get('/', listar);
recetasRouter.get('/:id', obtener);
recetasRouter.post('/', crear);
recetasRouter.put('/:id', actualizar);
recetasRouter.delete('/:id', eliminar);
