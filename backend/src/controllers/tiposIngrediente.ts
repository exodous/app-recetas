// src/controllers/tiposIngrediente.ts
import { Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export async function listar(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const tipos = await prisma.tipoIngrediente.findMany({ orderBy: { orden: 'asc' } });
    res.json(tipos);
  } catch (err) {
    next(err);
  }
}

export async function crear(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { nombre, slug, icono, orden } = req.body;
    if (!nombre || !slug) throw new AppError('Nombre y slug son obligatorios', 400);
    const existe = await prisma.tipoIngrediente.findUnique({ where: { slug } });
    if (existe) throw new AppError('Ya existe un tipo con ese slug', 409);
    const tipo = await prisma.tipoIngrediente.create({ data: { nombre, slug, icono: icono || '🧂', orden: orden || 0 } });
    res.status(201).json(tipo);
  } catch (err) {
    next(err);
  }
}

export async function obtener(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const tipo = await prisma.tipoIngrediente.findUnique({ where: { id } });
    if (!tipo) throw new AppError('Tipo no encontrado', 404);
    res.json(tipo);
  } catch (err) {
    next(err);
  }
}
