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

export interface Ingrediente {
  id: string;
  nombre: { es: string; en: string };
  unidadBase: string;
  esSistema: boolean;
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
  categoria?: Categoria;
  ingredientes?: RecetaIngrediente[];
  usuario?: { nombre: string };
}
