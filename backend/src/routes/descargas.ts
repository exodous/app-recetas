import { Router } from 'express';
import { descargar, listarDescargas, eliminarDescarga } from '../controllers/descargas';
import { authMiddleware } from '../middleware/auth';

export const descargasRouter = Router();

descargasRouter.use(authMiddleware);

descargasRouter.get('/', listarDescargas);
descargasRouter.post('/:recetaId', descargar);
descargasRouter.delete('/:recetaId', eliminarDescarga);
