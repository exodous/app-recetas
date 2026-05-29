import { Router } from 'express';
import { listar, crear, obtener, actualizar, eliminar } from '../controllers/ingredientes';
import { authMiddleware } from '../middleware/auth';

export const ingredientesRouter = Router();

ingredientesRouter.use(authMiddleware);

ingredientesRouter.get('/', listar);
ingredientesRouter.get('/:id', obtener);
ingredientesRouter.post('/', crear);
ingredientesRouter.put('/:id', actualizar);
ingredientesRouter.delete('/:id', eliminar);
