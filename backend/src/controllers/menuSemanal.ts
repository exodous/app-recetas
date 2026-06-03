// src/controllers/menuSemanal.ts
import { Response, NextFunction } from 'express';
import { prisma } from '../index';
import { AuthRequest } from '../middleware/auth';

// Generar menú semanal aleatorio
export async function generarMenu(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { dias, comensales, categorias, excluirCategorias } = req.body;
    // categorias: string[] - slugs a incluir (vacío = todas)
    // excluirCategorias: string[] - slugs a excluir

    if (!dias || !Array.isArray(dias) || dias.length === 0) {
      return res.status(400).json({ error: 'Debes especificar al menos un día' });
    }

    const numComensales = comensales || 1;

    // Obtener recetas con filtro de categorías
    const whereRecetas: any = {
      OR: [
        { usuarioId: req.usuarioId },
        { publica: true },
      ],
    };

    if (categorias && categorias.length > 0) {
      whereRecetas.categoria = { slug: { in: categorias } };
    }

    const recetas = await prisma.receta.findMany({
      where: whereRecetas,
      include: {
        categoria: true,
        ingredientes: {
          include: { ingrediente: true },
        },
      },
    });

    // Excluir categorías si se especifican
    let recetasFiltradas = recetas;
    if (excluirCategorias && excluirCategorias.length > 0) {
      recetasFiltradas = recetas.filter(r => !excluirCategorias.includes(r.categoria?.slug));
    }

    if (recetasFiltradas.length === 0) {
      return res.status(400).json({ error: 'No hay recetas disponibles con los filtros seleccionados.' });
    }

    // Separar recetas por tipo de comida
    const recetasAlmuerzo = recetasFiltradas.filter(
      r => !r.comidaTipo || r.comidaTipo.length === 0 || r.comidaTipo.includes('almuerzo') || r.comidaTipo.includes('ambos')
    );
    const recetasCena = recetasFiltradas.filter(
      r => !r.comidaTipo || r.comidaTipo.length === 0 || r.comidaTipo.includes('cena') || r.comidaTipo.includes('ambos')
    );

    // Generar menú aleatorio sin repetir recetas
    const menu: any[] = [];
    const usadas = new Set<string>();

    for (const diaConfig of dias) {
      const { dia, almuerzo, cena } = diaConfig;
      const diaMenu: any = { dia, almuerzo: null, cena: null };

      if (almuerzo) {
        const disponible = recetasAlmuerzo.filter(r => !usadas.has(r.id));
        if (disponible.length > 0) {
          const idx = Math.floor(Math.random() * disponible.length);
          const receta = disponible[idx];
          usadas.add(receta.id);
          diaMenu.almuerzo = formatearReceta(receta, numComensales);
        }
      }

      if (cena) {
        const disponible = recetasCena.filter(r => !usadas.has(r.id));
        if (disponible.length > 0) {
          const idx = Math.floor(Math.random() * disponible.length);
          const receta = disponible[idx];
          usadas.add(receta.id);
          diaMenu.cena = formatearReceta(receta, numComensales);
        }
      }

      menu.push(diaMenu);
    }

    res.json({
      menu,
      comensales: numComensales,
      diasGenerados: dias.filter((d: any) => d.almuerzo || d.cena).length,
    });
  } catch (err) {
    next(err);
  }
}

// Generar lista de la compra a partir de un menú
export async function generarListaCompra(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { menu, supermercado } = req.body;
    // menu: [{ dia, almuerzo: { recetaId, ... }, cena: { recetaId, ... } } ]
    // supermercado: 'mercadona' | 'lidl' | 'todos'

    if (!menu || !Array.isArray(menu)) {
      return res.status(400).json({ error: 'Menú no válido' });
    }

    // Recopilar todos los recetaIds
    const recetaIds: string[] = [];
    for (const dia of menu) {
      if (dia.almuerzo?.recetaId) recetaIds.push(dia.almuerzo.recetaId);
      if (dia.cena?.recetaId) recetaIds.push(dia.cena.recetaId);
    }

    if (recetaIds.length === 0) {
      return res.json({ items: [], totalEstimado: { mercadona: 0, lidl: 0 } });
    }

    // Obtener recetas con ingredientes y precios
    const recetas = await prisma.receta.findMany({
      where: { id: { in: recetaIds } },
      include: {
        ingredientes: {
          include: {
            ingrediente: {
              include: { precios: true },
            },
          },
        },
      },
    });

    // Sumar ingredientes (agrupar por ingredienteId)
    const mapaIngredientes: Record<string, any> = {};

    for (const receta of recetas) {
      // Encontrar el comensales del menú para escalar
      const diaMenu = menu.find((d: any) =>
        d.almuerzo?.recetaId === receta.id || d.cena?.recetaId === receta.id
      );
      const factorEscalado = diaMenu?.almuerzo?.comensales || diaMenu?.cena?.comensales || 1;
      // Asumimos que la receta base es para X porciones. Escalar proporcionalmente.
      const factorPorcion = receta.porciones ? factorEscalado / receta.porciones : 1;

      for (const ri of receta.ingredientes) {
        const ingId = ri.ingredienteId;
        const cantidadTotal = ri.cantidad * factorPorcion * factorEscalado;

        if (mapaIngredientes[ingId]) {
          mapaIngredientes[ingId].cantidad += cantidadTotal;
        } else {
          mapaIngredientes[ingId] = {
            ingredienteId: ingId,
            nombre: ri.ingrediente.nombre,
            unidad: ri.unidad,
            cantidad: cantidadTotal,
            unidadBase: ri.ingrediente.unidadBase,
            precios: ri.ingrediente.precios || [],
          };
        }
      }
    }

    // Formatear lista
    const items = Object.values(mapaIngredientes).map((item: any) => {
      const preciosFiltrados = supermercado === 'todos'
        ? item.precios
        : item.precios.filter((p: any) => p.supermercado === supermercado);

      const precioMercadona = item.precios.find((p: any) => p.supermercado === 'mercadona');
      const precioLidl = item.precios.find((p: any) => p.supermercado === 'lidl');

      return {
        ingredienteId: item.ingredienteId,
        nombre: item.nombre,
        cantidad: Math.round(item.cantidad * 100) / 100,
        unidad: item.unidad,
        // Precio estimado (cantidad * precio unitario, asumiendo que precio es por kg/l/ud)
        precioMercadona: precioMercadona
          ? Math.round(precioMercadona.precio * item.cantidad * 100) / 100
          : null,
        precioLidl: precioLidl
          ? Math.round(precioLidl.precio * item.cantidad * 100) / 100
          : null,
        unidadPrecio: precioMercadona?.unidad || precioLidl?.unidad || item.unidad,
      };
    });

    // Calcular totales
    const totalMercadona = items.reduce((sum: number, item: any) => sum + (item.precioMercadona || 0), 0);
    const totalLidl = items.reduce((sum: number, item: any) => sum + (item.precioLidl || 0), 0);

    res.json({
      items,
      totalEstimado: {
        mercadona: Math.round(totalMercadona * 100) / 100,
        lidl: Math.round(totalLidl * 100) / 100,
      },
      numRecetas: recetaIds.length,
      supermercado: supermercado || 'todos',
    });
  } catch (err) {
    next(err);
  }
}

// Helper: formatear receta para el menú
function formatearReceta(receta: any, comensales: number) {
  return {
    recetaId: receta.id,
    nombre: receta.nombre,
    categoria: receta.categoria,
    tiempoMin: receta.tiempoMin,
    porciones: receta.porciones,
    comensales,
    numIngredientes: receta.ingredientes.length,
    comidaTipo: receta.comidaTipo || [],
  };
}
