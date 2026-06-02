// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIAS = [
  { nombre: { es: 'Legumbres', en: 'Legumes' }, slug: 'legumbres', icono: '🫘', orden: 1 },
  { nombre: { es: 'Pastas', en: 'Pasta' }, slug: 'pastas', icono: '🍝', orden: 2 },
  { nombre: { es: 'Carnes', en: 'Meats' }, slug: 'carnes', icono: '🥩', orden: 3 },
  { nombre: { es: 'Pescados', en: 'Fish' }, slug: 'pescados', icono: '🐟', orden: 4 },
  { nombre: { es: 'Verduras', en: 'Vegetables' }, slug: 'verduras', icono: '🥦', orden: 5 },
  { nombre: { es: 'Sopas y cremas', en: 'Soups & Creams' }, slug: 'sopas', icono: '🍲', orden: 6 },
  { nombre: { es: 'Ensaladas', en: 'Salads' }, slug: 'ensaladas', icono: '🥗', orden: 7 },
  { nombre: { es: 'Postres', en: 'Desserts' }, slug: 'postres', icono: '🍰', orden: 8 },
  { nombre: { es: 'Salsas', en: 'Sauces' }, slug: 'salsas', icono: '🫕', orden: 9 },
  { nombre: { es: 'Desayunos', en: 'Breakfasts' }, slug: 'desayunos', icono: '🍳', orden: 10 },
  { nombre: { es: 'Pan y masas', en: 'Bread & Doughs' }, slug: 'pan', icono: '🍞', orden: 11 },
  { nombre: { es: 'Bebidas', en: 'Drinks' }, slug: 'bebidas', icono: '🥤', orden: 12 },
];

const TIPOS_INGREDIENTE = [
  { nombre: { es: 'Legumbres', en: 'Legumes' }, slug: 'legumbres', icono: '🫘', orden: 1 },
  { nombre: { es: 'Pastas y cereales', en: 'Pasta & cereals' }, slug: 'pastas-cereales', icono: '🍝', orden: 2 },
  { nombre: { es: 'Carnes', en: 'Meats' }, slug: 'carnes', icono: '🥩', orden: 3 },
  { nombre: { es: 'Pescados y mariscos', en: 'Fish & seafood' }, slug: 'pescados-mariscos', icono: '🐟', orden: 4 },
  { nombre: { es: 'Verduras y hortalizas', en: 'Vegetables' }, slug: 'verduras-hortalizas', icono: '🥦', orden: 5 },
  { nombre: { es: 'Frutas', en: 'Fruits' }, slug: 'frutas', icono: '🍎', orden: 6 },
  { nombre: { es: 'Lácteos', en: 'Dairy' }, slug: 'lacteos', icono: '🥛', orden: 7 },
  { nombre: { es: 'Especias y condimentos', en: 'Spices & condiments' }, slug: 'especias-condimentos', icono: '🌶️', orden: 8 },
  { nombre: { es: 'Aceites y grasas', en: 'Oils & fats' }, slug: 'aceites-grasas', icono: '🫒', orden: 9 },
  { nombre: { es: 'Otros', en: 'Other' }, slug: 'otros', icono: '🧂', orden: 10 },
];

const INGREDIENTES_DATA: Record<string, any> = {
  tomate: { nombre: { es: 'Tomate', en: 'Tomato' }, unidadBase: 'g', tipo: 'verduras-hortalizas', calorias: 18, proteinas: 0.9, hidratos: 3.9, grasas: 0.2, fibra: 1.2, precios: [{ supermercado: 'mercadona', precio: 2.19, unidad: 'kg' }, { supermercado: 'carrefour', precio: 1.89, unidad: 'kg' }, { supermercado: 'dia', precio: 2.05, unidad: 'kg' }] },
  cebolla: { nombre: { es: 'Cebolla', en: 'Onion' }, unidadBase: 'g', tipo: 'verduras-hortalizas', calorias: 40, proteinas: 1.1, hidratos: 9.3, grasas: 0.1, fibra: 1.7, precios: [{ supermercado: 'mercadona', precio: 1.49, unidad: 'kg' }, { supermercado: 'carrefour', precio: 1.29, unidad: 'kg' }, { supermercado: 'dia', precio: 1.39, unidad: 'kg' }, { supermercado: 'lidl', precio: 1.19, unidad: 'kg' }] },
  ajo: { nombre: { es: 'Ajo', en: 'Garlic' }, unidadBase: 'ud', tipo: 'verduras-hortalizas', calorias: 149, proteinas: 6.4, hidratos: 33.1, grasas: 0.5, fibra: 2.1, precios: [{ supermercado: 'mercadona', precio: 1.25, unidad: 'ud' }, { supermercado: 'carrefour', precio: 0.99, unidad: 'ud' }] },
  pimiento: { nombre: { es: 'Pimiento', en: 'Bell pepper' }, unidadBase: 'g', tipo: 'verduras-hortalizas', calorias: 31, proteinas: 1.0, hidratos: 6.0, grasas: 0.3, fibra: 2.1, precios: [{ supermercado: 'mercadona', precio: 2.99, unidad: 'kg' }, { supermercado: 'carrefour', precio: 2.69, unidad: 'kg' }] },
  aceite_oliva: { nombre: { es: 'Aceite de oliva', en: 'Olive oil' }, unidadBase: 'ml', tipo: 'aceites-grasas', calorias: 884, proteinas: 0, hidratos: 0, grasas: 100, fibra: 0, precios: [{ supermercado: 'mercadona', precio: 6.49, unidad: 'l' }, { supermercado: 'carrefour', precio: 5.99, unidad: 'l' }, { supermercado: 'dia', precio: 6.89, unidad: 'l' }] },
  sal: { nombre: { es: 'Sal', en: 'Salt' }, unidadBase: 'pizca', tipo: 'especias-condimentos', calorias: 0, proteinas: 0, hidratos: 0, grasas: 0, fibra: 0, precios: [{ supermercado: 'mercadona', precio: 0.49, unidad: 'ud' }] },
  pimienta: { nombre: { es: 'Pimienta', en: 'Pepper' }, unidadBase: 'pizca', tipo: 'especias-condimentos', calorias: 251, proteinas: 10.4, hidratos: 63.9, grasas: 3.3, fibra: 25.3, precios: [{ supermercado: 'mercadona', precio: 1.79, unidad: 'ud' }] },
  arroz: { nombre: { es: 'Arroz', en: 'Rice' }, unidadBase: 'g', tipo: 'pastas-cereales', calorias: 130, proteinas: 2.7, hidratos: 28.2, grasas: 0.3, fibra: 0.4, precios: [{ supermercado: 'mercadona', precio: 1.29, unidad: 'kg' }, { supermercado: 'carrefour', precio: 1.15, unidad: 'kg' }, { supermercado: 'dia', precio: 1.35, unidad: 'kg' }] },
  pasta: { nombre: { es: 'Pasta', en: 'Pasta' }, unidadBase: 'g', tipo: 'pastas-cereales', calorias: 131, proteinas: 5.0, hidratos: 25.0, grasas: 1.1, fibra: 1.8, precios: [{ supermercado: 'mercadona', precio: 1.49, unidad: 'kg' }, { supermercado: 'carrefour', precio: 1.29, unidad: 'kg' }, { supermercado: 'dia', precio: 1.39, unidad: 'kg' }, { supermercado: 'lidl', precio: 1.09, unidad: 'kg' }] },
  pollo: { nombre: { es: 'Pollo', en: 'Chicken' }, unidadBase: 'g', tipo: 'carnes', calorias: 165, proteinas: 31.0, hidratos: 0, grasas: 3.6, fibra: 0, precios: [{ supermercado: 'mercadona', precio: 7.49, unidad: 'kg' }, { supermercado: 'carrefour', precio: 6.89, unidad: 'kg' }, { supermercado: 'dia', precio: 7.19, unidad: 'kg' }, { supermercado: 'lidl', precio: 6.49, unidad: 'kg' }] },
  ternera: { nombre: { es: 'Ternera', en: 'Beef' }, unidadBase: 'g', tipo: 'carnes', calorias: 250, proteinas: 26.0, hidratos: 0, grasas: 15.0, fibra: 0, precios: [{ supermercado: 'mercadona', precio: 14.99, unidad: 'kg' }, { supermercado: 'carrefour', precio: 13.49, unidad: 'kg' }] },
  cerdo: { nombre: { es: 'Cerdo', en: 'Pork' }, unidadBase: 'g', tipo: 'carnes', calorias: 242, proteinas: 27.0, hidratos: 0, grasas: 14.0, fibra: 0, precios: [{ supermercado: 'mercadona', precio: 6.99, unidad: 'kg' }, { supermercado: 'carrefour', precio: 5.99, unidad: 'kg' }] },
  merluza: { nombre: { es: 'Merluza', en: 'Hake' }, unidadBase: 'g', tipo: 'pescados-mariscos', calorias: 82, proteinas: 17.0, hidratos: 0, grasas: 1.3, fibra: 0, precios: [{ supermercado: 'mercadona', precio: 12.99, unidad: 'kg' }, { supermercado: 'carrefour', precio: 11.49, unidad: 'kg' }] },
  lentejas: { nombre: { es: 'Lentejas', en: 'Lentils' }, unidadBase: 'g', tipo: 'legumbres', calorias: 116, proteinas: 9.0, hidratos: 20.0, grasas: 0.4, fibra: 7.9, precios: [{ supermercado: 'mercadona', precio: 2.29, unidad: 'kg' }, { supermercado: 'carrefour', precio: 2.09, unidad: 'kg' }, { supermercado: 'dia', precio: 2.15, unidad: 'kg' }] },
  garbanzos: { nombre: { es: 'Garbanzos', en: 'Chickpeas' }, unidadBase: 'g', tipo: 'legumbres', calorias: 164, proteinas: 8.9, hidratos: 27.4, grasas: 2.6, fibra: 7.6, precios: [{ supermercado: 'mercadona', precio: 2.49, unidad: 'kg' }, { supermercado: 'carrefour', precio: 2.19, unidad: 'kg' }] },
  judias_blancas: { nombre: { es: 'Judías blancas', en: 'White beans' }, unidadBase: 'g', tipo: 'legumbres', calorias: 114, proteinas: 7.3, hidratos: 21.4, grasas: 0.5, fibra: 5.1, precios: [{ supermercado: 'mercadona', precio: 2.39, unidad: 'kg' }, { supermercado: 'carrefour', precio: 2.09, unidad: 'kg' }] },
  huevo: { nombre: { es: 'Huevo', en: 'Egg' }, unidadBase: 'ud', tipo: 'carnes', calorias: 155, proteinas: 12.6, hidratos: 1.1, grasas: 11.0, fibra: 0, precios: [{ supermercado: 'mercadona', precio: 2.69, unidad: 'docena' }, { supermercado: 'carrefour', precio: 2.89, unidad: 'docena' }, { supermercado: 'dia', precio: 2.59, unidad: 'docena' }, { supermercado: 'lidl', precio: 2.29, unidad: 'docena' }, { supermercado: 'aldi', precio: 1.99, unidad: 'docena' }] },
  leche: { nombre: { es: 'Leche', en: 'Milk' }, unidadBase: 'ml', tipo: 'lacteos', calorias: 42, proteinas: 3.4, hidratos: 5.0, grasas: 1.0, fibra: 0, precios: [{ supermercado: 'mercadona', precio: 1.19, unidad: 'l' }, { supermercado: 'carrefour', precio: 1.09, unidad: 'l' }, { supermercado: 'dia', precio: 1.25, unidad: 'l' }, { supermercado: 'lidl', precio: 0.95, unidad: 'l' }] },
  mantequilla: { nombre: { es: 'Mantequilla', en: 'Butter' }, unidadBase: 'g', tipo: 'lacteos', calorias: 717, proteinas: 0.9, hidratos: 0.1, grasas: 81.0, fibra: 0, precios: [{ supermercado: 'mercadona', precio: 2.89, unidad: 'ud' }, { supermercado: 'carrefour', precio: 2.69, unidad: 'ud' }] },
  harina: { nombre: { es: 'Harina', en: 'Flour' }, unidadBase: 'g', tipo: 'pastas-cereales', calorias: 364, proteinas: 10.3, hidratos: 76.3, grasas: 1.0, fibra: 2.7, precios: [{ supermercado: 'mercadona', precio: 1.09, unidad: 'kg' }, { supermercado: 'carrefour', precio: 0.95, unidad: 'kg' }] },
  azucar: { nombre: { es: 'Azúcar', en: 'Sugar' }, unidadBase: 'g', tipo: 'otros', calorias: 387, proteinas: 0, hidratos: 100, grasas: 0, fibra: 0, precios: [{ supermercado: 'mercadona', precio: 1.19, unidad: 'kg' }, { supermercado: 'carrefour', precio: 0.99, unidad: 'kg' }] },
  limon: { nombre: { es: 'Limón', en: 'Lemon' }, unidadBase: 'ud', tipo: 'frutas', calorias: 29, proteinas: 1.1, hidratos: 9.3, grasas: 0.3, fibra: 2.8, precios: [{ supermercado: 'mercadona', precio: 1.99, unidad: 'kg' }, { supermercado: 'carrefour', precio: 1.79, unidad: 'kg' }] },
  zanahoria: { nombre: { es: 'Zanahoria', en: 'Carrot' }, unidadBase: 'g', tipo: 'verduras-hortalizas', calorias: 41, proteinas: 0.9, hidratos: 9.6, grasas: 0.2, fibra: 2.8, precios: [{ supermercado: 'mercadona', precio: 1.29, unidad: 'kg' }, { supermercado: 'carrefour', precio: 1.09, unidad: 'kg' }, { supermercado: 'lidl', precio: 0.99, unidad: 'kg' }] },
  patata: { nombre: { es: 'Patata', en: 'Potato' }, unidadBase: 'g', tipo: 'verduras-hortalizas', calorias: 77, proteinas: 2.0, hidratos: 17.5, grasas: 0.1, fibra: 2.2, precios: [{ supermercado: 'mercadona', precio: 1.79, unidad: 'kg' }, { supermercado: 'carrefour', precio: 1.49, unidad: 'kg' }, { supermercado: 'dia', precio: 1.59, unidad: 'kg' }] },
  calabacin: { nombre: { es: 'Calabacín', en: 'Zucchini' }, unidadBase: 'g', tipo: 'verduras-hortalizas', calorias: 17, proteinas: 1.2, hidratos: 3.1, grasas: 0.3, fibra: 1.0, precios: [{ supermercado: 'mercadona', precio: 2.49, unidad: 'kg' }, { supermercado: 'carrefour', precio: 2.19, unidad: 'kg' }] },
  berenjena: { nombre: { es: 'Berenjena', en: 'Eggplant' }, unidadBase: 'g', tipo: 'verduras-hortalizas', calorias: 25, proteinas: 1.0, hidratos: 6.0, grasas: 0.2, fibra: 3.0, precios: [{ supermercado: 'mercadona', precio: 2.69, unidad: 'kg' }, { supermercado: 'carrefour', precio: 2.39, unidad: 'kg' }] },
  espinacas: { nombre: { es: 'Espinacas', en: 'Spinach' }, unidadBase: 'g', tipo: 'verduras-hortalizas', calorias: 23, proteinas: 2.9, hidratos: 3.6, grasas: 0.4, fibra: 2.2, precios: [{ supermercado: 'mercadona', precio: 1.99, unidad: 'ud' }, { supermercado: 'carrefour', precio: 1.79, unidad: 'ud' }] },
  queso: { nombre: { es: 'Queso', en: 'Cheese' }, unidadBase: 'g', tipo: 'lacteos', calorias: 350, proteinas: 25.0, hidratos: 1.3, grasas: 27.0, fibra: 0, precios: [{ supermercado: 'mercadona', precio: 8.49, unidad: 'kg' }, { supermercado: 'carrefour', precio: 7.99, unidad: 'kg' }] },
  nata: { nombre: { es: 'Nata', en: 'Cream' }, unidadBase: 'ml', tipo: 'lacteos', calorias: 340, proteinas: 2.1, hidratos: 2.8, grasas: 36.0, fibra: 0, precios: [{ supermercado: 'mercadona', precio: 2.99, unidad: 'l' }, { supermercado: 'carrefour', precio: 2.69, unidad: 'l' }] },
  perejil: { nombre: { es: 'Perejil', en: 'Parsley' }, unidadBase: 'pizca', tipo: 'especias-condimentos', calorias: 36, proteinas: 3.0, hidratos: 6.3, grasas: 0.8, fibra: 3.3, precios: [{ supermercado: 'mercadona', precio: 0.79, unidad: 'ud' }] },
  laurel: { nombre: { es: 'Laurel', en: 'Bay leaf' }, unidadBase: 'ud', tipo: 'especias-condimentos', calorias: 313, proteinas: 7.6, hidratos: 75.0, grasas: 8.4, fibra: 26.3, precios: [{ supermercado: 'mercadona', precio: 1.15, unidad: 'ud' }] },
  pimenton: { nombre: { es: 'Pimentón', en: 'Paprika' }, unidadBase: 'cucharadita', tipo: 'especias-condimentos', calorias: 282, proteinas: 14.1, hidratos: 53.9, grasas: 13.0, fibra: 34.9, precios: [{ supermercado: 'mercadona', precio: 1.69, unidad: 'ud' }] },
  comino: { nombre: { es: 'Comino', en: 'Cumin' }, unidadBase: 'cucharadita', tipo: 'especias-condimentos', calorias: 375, proteinas: 17.8, hidratos: 44.2, grasas: 22.3, fibra: 10.5, precios: [{ supermercado: 'mercadona', precio: 1.59, unidad: 'ud' }] },
  canela: { nombre: { es: 'Canela', en: 'Cinnamon' }, unidadBase: 'cucharadita', tipo: 'especias-condimentos', calorias: 247, proteinas: 4.0, hidratos: 80.6, grasas: 1.2, fibra: 53.1, precios: [{ supermercado: 'mercadona', precio: 1.49, unidad: 'ud' }] },
  nuez_moscada: { nombre: { es: 'Nuez moscada', en: 'Nutmeg' }, unidadBase: 'pizca', tipo: 'especias-condimentos', calorias: 525, proteinas: 5.8, hidratos: 49.3, grasas: 36.3, fibra: 20.8, precios: [{ supermercado: 'mercadona', precio: 2.29, unidad: 'ud' }] },
  vinagre: { nombre: { es: 'Vinagre', en: 'Vinegar' }, unidadBase: 'ml', tipo: 'otros', calorias: 18, proteinas: 0, hidratos: 0.9, grasas: 0, fibra: 0, precios: [{ supermercado: 'mercadona', precio: 1.39, unidad: 'l' }, { supermercado: 'carrefour', precio: 1.19, unidad: 'l' }] },
  salsa_soja: { nombre: { es: 'Salsa de soja', en: 'Soy sauce' }, unidadBase: 'ml', tipo: 'especias-condimentos', calorias: 53, proteinas: 8.1, hidratos: 4.9, grasas: 0.6, fibra: 0.8, precios: [{ supermercado: 'mercadona', precio: 2.49, unidad: 'l' }] },
  miel: { nombre: { es: 'Miel', en: 'Honey' }, unidadBase: 'cucharada', tipo: 'otros', calorias: 304, proteinas: 0.3, hidratos: 82.4, grasas: 0, fibra: 0.2, precios: [{ supermercado: 'mercadona', precio: 5.99, unidad: 'kg' }, { supermercado: 'carrefour', precio: 5.49, unidad: 'kg' }] },
  pan: { nombre: { es: 'Pan', en: 'Bread' }, unidadBase: 'g', tipo: 'pastas-cereales', calorias: 265, proteinas: 9.0, hidratos: 49.0, grasas: 3.2, fibra: 2.7, precios: [{ supermercado: 'mercadona', precio: 1.25, unidad: 'ud' }, { supermercado: 'dia', precio: 1.15, unidad: 'ud' }] },
  lechuga: { nombre: { es: 'Lechuga', en: 'Lettuce' }, unidadBase: 'g', tipo: 'verduras-hortalizas', calorias: 15, proteinas: 1.4, hidratos: 2.9, grasas: 0.2, fibra: 1.3, precios: [{ supermercado: 'mercadona', precio: 0.99, unidad: 'ud' }, { supermercado: 'carrefour', precio: 0.89, unidad: 'ud' }] },
  maiz: { nombre: { es: 'Maíz', en: 'Corn' }, unidadBase: 'g', tipo: 'verduras-hortalizas', calorias: 86, proteinas: 3.3, hidratos: 19.0, grasas: 1.4, fibra: 2.7, precios: [{ supermercado: 'mercadona', precio: 1.79, unidad: 'ud' }, { supermercado: 'carrefour', precio: 1.59, unidad: 'ud' }] },
  guisantes: { nombre: { es: 'Guisantes', en: 'Peas' }, unidadBase: 'g', tipo: 'legumbres', calorias: 81, proteinas: 5.4, hidratos: 14.5, grasas: 0.4, fibra: 5.1, precios: [{ supermercado: 'mercadona', precio: 1.99, unidad: 'ud' }, { supermercado: 'carrefour', precio: 1.79, unidad: 'ud' }] },
  albahaca: { nombre: { es: 'Albahaca', en: 'Basil' }, unidadBase: 'pizca', tipo: 'especias-condimentos', calorias: 23, proteinas: 3.2, hidratos: 2.7, grasas: 0.6, fibra: 1.6, precios: [{ supermercado: 'mercadona', precio: 1.15, unidad: 'ud' }] },
  oregano: { nombre: { es: 'Orégano', en: 'Oregano' }, unidadBase: 'pizca', tipo: 'especias-condimentos', calorias: 265, proteinas: 9.0, hidratos: 68.9, grasas: 4.3, fibra: 42.5, precios: [{ supermercado: 'mercadona', precio: 1.39, unidad: 'ud' }] },
  romero: { nombre: { es: 'Romero', en: 'Rosemary' }, unidadBase: 'pizca', tipo: 'especias-condimentos', calorias: 131, proteinas: 3.3, hidratos: 20.7, grasas: 5.9, fibra: 14.1, precios: [{ supermercado: 'mercadona', precio: 1.45, unidad: 'ud' }] },
  tomillo: { nombre: { es: 'Tomillo', en: 'Thyme' }, unidadBase: 'pizca', tipo: 'especias-condimentos', calorias: 101, proteinas: 5.6, hidratos: 24.5, grasas: 1.7, fibra: 14.0, precios: [{ supermercado: 'mercadona', precio: 1.49, unidad: 'ud' }] },
};

async function main() {
  console.log('🌱 Cargando datos iniciales...');

  // Categorías
  for (const cat of CATEGORIAS) {
    await prisma.categoria.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }
  console.log(`✅ ${CATEGORIAS.length} categorías`);

  // Tipos de ingrediente
  const tiposMap: Record<string, string> = {};
  for (const tipo of TIPOS_INGREDIENTE) {
    const creado = await prisma.tipoIngrediente.upsert({ where: { slug: tipo.slug }, update: {}, create: tipo });
    tiposMap[tipo.slug] = creado.id;
  }
  console.log(`✅ ${TIPOS_INGREDIENTE.length} tipos de ingrediente`);

  // Ingredientes con datos nutricionales y precios
  let countIng = 0;
  let countPrecios = 0;
  for (const [key, data] of Object.entries(INGREDIENTES_DATA)) {
    const tipoId = tiposMap[data.tipo] || null;
    const ingrediente = await prisma.ingrediente.upsert({
      where: { id: key },
      update: { tipoId, calorias: data.calorias, proteinas: data.proteinas, hidratos: data.hidratos, grasas: data.grasas, fibra: data.fibra },
      create: { id: key, nombre: data.nombre, unidadBase: data.unidadBase, tipoId, esSistema: true, calorias: data.calorias, proteinas: data.proteinas, hidratos: data.hidratos, grasas: data.grasas, fibra: data.fibra },
    });
    countIng++;
    for (const precio of data.precios) {
      await prisma.precioIngrediente.upsert({
        where: { ingredienteId_supermercado_unidad: { ingredienteId: ingrediente.id, supermercado: precio.supermercado, unidad: precio.unidad } },
        update: { precio: precio.precio, fechaActualizacion: new Date() },
        create: { ingredienteId: ingrediente.id, supermercado: precio.supermercado, precio: precio.precio, unidad: precio.unidad },
      });
      countPrecios++;
    }
  }
  console.log(`✅ ${countIng} ingredientes con datos nutricionales`);
  console.log(`✅ ${countPrecios} precios en supermercados`);
  console.log('🎉 Seed completado');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
