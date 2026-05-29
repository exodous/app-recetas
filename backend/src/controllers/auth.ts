// src/controllers/auth.ts
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'cambia-esto-en-produccion';
const SALT_ROUNDS = 10;

export async function registrar(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, nombre, idiomaPreferido } = req.body;

    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) throw new AppError('El email ya está registrado', 409);

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const usuario = await prisma.usuario.create({
      data: { email, passwordHash, nombre, idiomaPreferido: idiomaPreferido || 'es' },
    });

    const token = jwt.sign({ usuarioId: usuario.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, idiomaPreferido: usuario.idiomaPreferido },
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) throw new AppError('Credenciales inválidas', 401);

    const valido = await bcrypt.compare(password, usuario.passwordHash);
    if (!valido) throw new AppError('Credenciales inválidas', 401);

    const token = jwt.sign({ usuarioId: usuario.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre, idiomaPreferido: usuario.idiomaPreferido },
    });
  } catch (err) {
    next(err);
  }
}

export async function perfil(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: req.usuarioId },
      select: { id: true, email: true, nombre: true, idiomaPreferido: true, createdAt: true },
    });
    if (!usuario) throw new AppError('Usuario no encontrado', 404);
    res.json(usuario);
  } catch (err) {
    next(err);
  }
}
