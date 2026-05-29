import { Router } from 'express';
import { listar, crear, actualizar, eliminar } from '../controllers/categorias';
import { authMiddleware } from '../middleware/auth';

export const categoriasRouter = Router();

categoriasRouter.use(authMiddleware);

categoriasRouter.get('/', listar);
categoriasRouter.post('/', crear);
categoriasRouter.put('/:id', actualizar);
categoriasRouter.delete('/:id', eliminar);
