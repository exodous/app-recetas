// src/controllers/ingredientes.ts
import { Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export async function listar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { buscar } = req.query;

    const where: any = {
      OR: [
        { esSistema: true },
        { creadoPor: req.usuarioId },
      ],
    };

    if (buscar) {
      // Búsqueda simple por nombre (JSON) — en producción usar full-text search
      const todos = await prisma.ingrediente.findMany({ where });
      const filtrados = todos.filter((ing) => {
        const nombreEs = (ing.nombre as any)?.es?.toLowerCase() || '';
        const nombreEn = (ing.nombre as any)?.en?.toLowerCase() || '';
        const q = (buscar as string).toLowerCase();
        return nombreEs.includes(q) || nombreEn.includes(q);
      });
      return res.json(filtrados);
    }

    const ingredientes = await prisma.ingrediente.findMany({
      where,
      orderBy: { nombre: 'asc' },
    });

    res.json(ingredientes);
  } catch (err) {
    next(err);
  }
}

export async function crear(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { nombre, unidadBase } = req.body;

    if (!nombre || !unidadBase) {
      throw new AppError('Nombre y unidad base son obligatorios', 400);
    }

    const validas = ['g', 'kg', 'ml', 'l', 'ud', 'taza', 'cucharada', 'cucharadita', 'pizca'];
    if (!validas.includes(unidadBase)) {
      throw new AppError(`Unidad no válida. Opciones: ${validas.join(', ')}`, 400);
    }

    const ingrediente = await prisma.ingrediente.create({
      data: {
        nombre,
        unidadBase,
        creadoPor: req.usuarioId,
      },
    });

    res.status(201).json(ingrediente);
  } catch (err) {
    next(err);
  }
}

export async function obtener(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const ingrediente = await prisma.ingrediente.findFirst({
      where: {
        id,
        OR: [{ esSistema: true }, { creadoPor: req.usuarioId }],
      },
    });
    if (!ingrediente) throw new AppError('Ingrediente no encontrado', 404);
    res.json(ingrediente);
  } catch (err) {
    next(err);
  }
}

export async function actualizar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { nombre, unidadBase } = req.body;

    const existente = await prisma.ingrediente.findFirst({
      where: { id, creadoPor: req.usuarioId, esSistema: false },
    });
    if (!existente) throw new AppError('Ingrediente no encontrado o no editable', 404);

    const ingrediente = await prisma.ingrediente.update({
      where: { id },
      data: {
        ...(nombre && { nombre }),
        ...(unidadBase && { unidadBase }),
      },
    });

    res.json(ingrediente);
  } catch (err) {
    next(err);
  }
}

export async function eliminar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const existente = await prisma.ingrediente.findFirst({
      where: { id, creadoPor: req.usuarioId, esSistema: false },
    });
    if (!existente) throw new AppError('Ingrediente no encontrado o no editable', 404);

    await prisma.ingrediente.delete({ where: { id } });
    res.json({ mensaje: 'Ingrediente eliminado' });
  } catch (err) {
    next(err);
  }
}
