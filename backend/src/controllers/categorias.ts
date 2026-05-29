// src/controllers/categorias.ts
import { Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export async function listar(_req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { orden: 'asc' },
    });
    res.json(categorias);
  } catch (err) {
    next(err);
  }
}

export async function crear(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { nombre, slug, icono, orden } = req.body;

    if (!nombre || !slug) throw new AppError('Nombre y slug son obligatorios', 400);

    const existe = await prisma.categoria.findUnique({ where: { slug } });
    if (existe) throw new AppError('Ya existe una categoría con ese slug', 409);

    const categoria = await prisma.categoria.create({
      data: { nombre, slug, icono: icono || '🍽️', orden: orden || 0 },
    });

    res.status(201).json(categoria);
  } catch (err) {
    next(err);
  }
}

export async function actualizar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { nombre, slug, icono, orden } = req.body;

    const categoria = await prisma.categoria.update({
      where: { id },
      data: {
        ...(nombre && { nombre }),
        ...(slug && { slug }),
        ...(icono && { icono }),
        ...(orden !== undefined && { orden }),
      },
    });

    res.json(categoria);
  } catch (err) {
    next(err);
  }
}

export async function eliminar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    await prisma.categoria.delete({ where: { id } });
    res.json({ mensaje: 'Categoría eliminada' });
  } catch (err) {
    next(err);
  }
}
