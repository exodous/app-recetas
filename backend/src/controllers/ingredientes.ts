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
      const todos = await prisma.ingrediente.findMany({
        where,
        include: { precios: true, tipo: true },
      });
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
      include: { precios: true, tipo: true },
      orderBy: { nombre: 'asc' },
    });

    res.json(ingredientes);
  } catch (err) {
    next(err);
  }
}

export async function crear(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { nombre, unidadBase, tipoId, calorias, proteinas, hidratos, grasas, fibra, precios } = req.body;

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
        tipoId: tipoId || null,
        calorias: calorias != null ? calorias : null,
        proteinas: proteinas != null ? proteinas : null,
        hidratos: hidratos != null ? hidratos : null,
        grasas: grasas != null ? grasas : null,
        fibra: fibra != null ? fibra : null,
        creadoPor: req.usuarioId,
        precios: precios?.length ? {
          create: precios.map((p: any) => ({
            supermercado: p.supermercado,
            precio: p.precio,
            unidad: p.unidad,
          })),
        } : undefined,
      },
      include: { precios: true, tipo: true },
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
      include: { precios: true, tipo: true },
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
    const { nombre, unidadBase, tipoId, calorias, proteinas, hidratos, grasas, fibra, precios } = req.body;

    const existente = await prisma.ingrediente.findFirst({
      where: {
        id,
        OR: [
          { creadoPor: req.usuarioId },
          { esSistema: true },
        ],
      },
    });
    if (!existente) throw new AppError('Ingrediente no encontrado o no editable', 404);

    const ingrediente = await prisma.ingrediente.update({
      where: { id },
      data: {
        ...(nombre && { nombre }),
        ...(unidadBase && { unidadBase }),
        ...(tipoId !== undefined && { tipoId }),
        ...(calorias !== undefined && { calorias }),
        ...(proteinas !== undefined && { proteinas }),
        ...(hidratos !== undefined && { hidratos }),
        ...(grasas !== undefined && { grasas }),
        ...(fibra !== undefined && { fibra }),
      },
      include: { precios: true, tipo: true },
    });

    // Si se envían precios, actualizarlos
    if (precios && Array.isArray(precios)) {
      // Eliminar precios existentes y crear los nuevos
      await prisma.precioIngrediente.deleteMany({ where: { ingredienteId: id } });
      for (const precio of precios) {
        await prisma.precioIngrediente.upsert({
          where: {
            ingredienteId_supermercado_unidad: {
              ingredienteId: id,
              supermercado: precio.supermercado,
              unidad: precio.unidad,
            },
          },
          update: { precio: precio.precio, fechaActualizacion: new Date() },
          create: {
            ingredienteId: id,
            supermercado: precio.supermercado,
            precio: precio.precio,
            unidad: precio.unidad,
          },
        });
      }
    }

    // Volver a obtener el ingrediente con precios actualizados
    const actualizado = await prisma.ingrediente.findUnique({
      where: { id },
      include: { precios: true, tipo: true },
    });

    res.json(actualizado);
  } catch (err) {
    console.error('❌ Error actualizando ingrediente:', err.message);
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

    await prisma.precioIngrediente.deleteMany({ where: { ingredienteId: id } });
    await prisma.ingrediente.delete({ where: { id } });
    res.json({ mensaje: 'Ingrediente eliminado' });
  } catch (err) {
    next(err);
  }
}
