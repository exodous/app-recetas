import { Router } from 'express';
import { listar, crear, obtener } from '../controllers/tiposIngrediente';
import { authMiddleware } from '../middleware/auth';

export const tiposIngredienteRouter = Router();

tiposIngredienteRouter.use(authMiddleware);

tiposIngredienteRouter.get('/', listar);
tiposIngredienteRouter.get('/:id', obtener);
tiposIngredienteRouter.post('/', crear);
