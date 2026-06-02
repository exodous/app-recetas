// src/routes/menuSemanal.ts
import { Router } from 'express';
import { generarMenu, generarListaCompra } from '../controllers/menuSemanal';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

// POST /api/menu-semanal/generar
router.post('/generar', generarMenu);

// POST /api/menu-semanal/lista-compra
router.post('/lista-compra', generarListaCompra);

export { router as menuSemanalRouter };
