// src/controllers/recetas.ts
import { Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Listar recetas del usuario + públicas
export async function listar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { categoria, buscar, pagina = '1', limite = '20' } = req.query;
    const paginaNum = parseInt(pagina as string);
    const limiteNum = parseInt(limite as string);

    const where: any = {
      OR: [
        { usuarioId: req.usuarioId },
        { publica: true },
      ],
    };

    if (categoria) {
      where.categoria = { slug: categoria as string };
    }

    if (buscar) {
      where.OR = [
        // Prisma no soporta búsqueda en JSON directamente de forma simple
        // Filtramos por nombre usando contains en modo insensible
      ];
    }

    const [recetas, total] = await Promise.all([
      prisma.receta.findMany({
        where,
        include: {
          categoria: true,
          usuario: { select: { nombre: true } },
          ingredientes: {
            include: { ingrediente: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (paginaNum - 1) * limiteNum,
        take: limiteNum,
      }),
      prisma.receta.count({ where }),
    ]);

    res.json({
      recetas,
      paginacion: {
        pagina: paginaNum,
        limite: limiteNum,
        total,
        paginas: Math.ceil(total / limiteNum),
      },
    });
  } catch (err) {
    next(err);
  }
}

// Obtener una receta por ID
export async function obtener(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const receta = await prisma.receta.findFirst({
      where: {
        id,
        OR: [
          { usuarioId: req.usuarioId },
          { publica: true },
        ],
      },
      include: {
        categoria: true,
        usuario: { select: { nombre: true } },
        ingredientes: {
          include: { ingrediente: true },
        },
      },
    });

    if (!receta) throw new AppError('Receta no encontrada', 404);
    res.json(receta);
  } catch (err) {
    next(err);
  }
}

// Crear receta
export async function crear(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { nombre, instrucciones, categoriaId, tiempoMin, porciones, publica, ingredientes, comidaTipo } = req.body;

    if (!nombre || !instrucciones || !categoriaId || !ingredientes?.length) {
      throw new AppError('Faltan campos obligatorios', 400);
    }

    const receta = await prisma.receta.create({
      data: {
        nombre,
        instrucciones,
        categoriaId,
        usuarioId: req.usuarioId!,
        tiempoMin,
        porciones,
        publica: publica || false,
        comidaTipo: comidaTipo || ['almuerzo', 'cena'],
        ingredientes: {
          create: ingredientes.map((ing: any) => ({
            ingredienteId: ing.ingredienteId,
            cantidad: ing.cantidad,
            unidad: ing.unidad,
          })),
        },
      },
      include: {
        categoria: true,
        ingredientes: {
          include: { ingrediente: true },
        },
      },
    });

    res.status(201).json(receta);
  } catch (err: any) {
    console.error('❌ Error creando receta:', err.message);
    next(err);
  }
}

// Actualizar receta
export async function actualizar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { nombre, instrucciones, categoriaId, tiempoMin, porciones, publica, ingredientes, comidaTipo } = req.body;

    const existente = await prisma.receta.findFirst({
      where: { id, usuarioId: req.usuarioId },
    });
    if (!existente) throw new AppError('Receta no encontrada o sin permisos', 404);

    if (ingredientes) {
      await prisma.recetaIngrediente.deleteMany({ where: { recetaId: id } });
    }

    const receta = await prisma.receta.update({
      where: { id },
      data: {
        ...(nombre && { nombre }),
        ...(instrucciones && { instrucciones }),
        ...(categoriaId && { categoriaId }),
        ...(tiempoMin && { tiempoMin }),
        ...(porciones && { porciones }),
        ...(publica !== undefined && { publica }),
        ...(comidaTipo !== undefined && { comidaTipo }),
        ...(ingredientes && {
          ingredientes: {
            create: ingredientes.map((ing: any) => ({
              ingredienteId: ing.ingredienteId,
              cantidad: ing.cantidad,
              unidad: ing.unidad,
            })),
          },
        }),
      },
      include: {
        categoria: true,
        ingredientes: {
          include: { ingrediente: true },
        },
      },
    });

    res.json(receta);
  } catch (err) {
    next(err);
  }
}

// Eliminar receta
export async function eliminar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    const existente = await prisma.receta.findFirst({
      where: { id, usuarioId: req.usuarioId },
    });
    if (!existente) throw new AppError('Receta no encontrada o sin permisos', 404);

    await prisma.recetaIngrediente.deleteMany({ where: { recetaId: id } });
    await prisma.descargaLocal.deleteMany({ where: { recetaId: id } });
    await prisma.receta.delete({ where: { id } });

    res.json({ mensaje: 'Receta eliminada correctamente' });
  } catch (err) {
    next(err);
  }
}
