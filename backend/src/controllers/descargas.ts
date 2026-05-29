// src/controllers/descargas.ts
import { Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Descargar receta para uso offline
export async function descargar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { recetaId } = req.params;

    const receta = await prisma.receta.findFirst({
      where: {
        id: recetaId,
        OR: [
          { usuarioId: req.usuarioId },
          { publica: true },
        ],
      },
      include: {
        categoria: true,
        ingredientes: {
          include: { ingrediente: true },
        },
      },
    });

    if (!receta) throw new AppError('Receta no encontrada', 404);

    const descarga = await prisma.descargaLocal.upsert({
      where: {
        usuarioId_recetaId: {
          usuarioId: req.usuarioId!,
          recetaId,
        },
      },
      update: { descargadaEn: new Date() },
      create: {
        usuarioId: req.usuarioId!,
        recetaId,
      },
    });

    res.json({ mensaje: 'Receta descargada', descarga, receta });
  } catch (err) {
    next(err);
  }
}

// Listar recetas descargadas
export async function listarDescargas(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const descargas = await prisma.descargaLocal.findMany({
      where: { usuarioId: req.usuarioId },
      include: {
        receta: {
          include: {
            categoria: true,
            ingredientes: {
              include: { ingrediente: true },
            },
          },
        },
      },
      orderBy: { descargadaEn: 'desc' },
    });

    res.json(descargas);
  } catch (err) {
    next(err);
  }
}

// Eliminar descarga
export async function eliminarDescarga(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { recetaId } = req.params;

    await prisma.descargaLocal.delete({
      where: {
        usuarioId_recetaId: {
          usuarioId: req.usuarioId!,
          recetaId,
        },
      },
    });

    res.json({ mensaje: 'Descarga eliminada' });
  } catch (err) {
    next(err);
  }
}
