// src/routes/auth.ts
import { Router } from 'express';
import { registrar, login, perfil } from '../controllers/auth';
import { authMiddleware } from '../middleware/auth';

export const authRouter = Router();

authRouter.post('/registrar', registrar);
authRouter.post('/login', login);
authRouter.get('/perfil', authMiddleware, perfil);
