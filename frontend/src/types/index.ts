// src/types/index.ts
export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  idiomaPreferido: 'es' | 'en';
}

export interface Categoria {
  id: string;
  nombre: { es: string; en: string };
  slug: string;
  icono: string;
  orden: number;
}

export interface TipoIngrediente {
  id: string;
  nombre: { es: string; en: string };
  slug: string;
  icono: string;
  orden: number;
}

export interface PrecioIngrediente {
  id: string;
  ingredienteId: string;
  supermercado: string;
  precio: number;
  unidad: string;
  fechaActualizacion: string;
  urlProducto?: string;
}

export interface Ingrediente {
  id: string;
  nombre: { es: string; en: string };
  unidadBase: string;
  tipoId?: string;
  tipo?: TipoIngrediente;
  esSistema: boolean;
  // Valor nutricional por 100g/100ml
  calorias?: number;
  proteinas?: number;
  hidratos?: number;
  grasas?: number;
  fibra?: number;
  // Precios
  precios?: PrecioIngrediente[];
}

export interface RecetaIngrediente {
  recetaId: string;
  ingredienteId: string;
  cantidad: number;
  unidad: string;
  ingrediente?: Ingrediente;
}

export interface Receta {
  id: string;
  nombre: { es: string; en: string };
  instrucciones: { es: string; en: string };
  categoriaId: string;
  usuarioId: string;
  tiempoMin?: number;
  porciones?: number;
  fotoUrl?: string;
  publica: boolean;
  createdAt: string;
  updatedAt: string;
  comidaTipo?: ('almuerzo' | 'cena')[];
  categoria?: Categoria;
  ingredientes?: RecetaIngrediente[];
  usuario?: { nombre: string };
}
