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

const INGREDIENTES = [
  { nombre: { es: 'Tomate', en: 'Tomato' }, unidadBase: 'g' },
  { nombre: { es: 'Cebolla', en: 'Onion' }, unidadBase: 'g' },
  { nombre: { es: 'Ajo', en: 'Garlic' }, unidadBase: 'ud' },
  { nombre: { es: 'Pimiento', en: 'Bell pepper' }, unidadBase: 'g' },
  { nombre: { es: 'Aceite de oliva', en: 'Olive oil' }, unidadBase: 'ml' },
  { nombre: { es: 'Sal', en: 'Salt' }, unidadBase: 'pizca' },
  { nombre: { es: 'Pimienta', en: 'Pepper' }, unidadBase: 'pizca' },
  { nombre: { es: 'Arroz', en: 'Rice' }, unidadBase: 'g' },
  { nombre: { es: 'Pasta', en: 'Pasta' }, unidadBase: 'g' },
  { nombre: { es: 'Pollo', en: 'Chicken' }, unidadBase: 'g' },
  { nombre: { es: 'Ternera', en: 'Beef' }, unidadBase: 'g' },
  { nombre: { es: 'Cerdo', en: 'Pork' }, unidadBase: 'g' },
  { nombre: { es: 'Merluza', en: 'Hake' }, unidadBase: 'g' },
  { nombre: { es: 'Lentejas', en: 'Lentils' }, unidadBase: 'g' },
  { nombre: { es: 'Garbanzos', en: 'Chickpeas' }, unidadBase: 'g' },
  { nombre: { es: 'Judías blancas', en: 'White beans' }, unidadBase: 'g' },
  { nombre: { es: 'Huevo', en: 'Egg' }, unidadBase: 'ud' },
  { nombre: { es: 'Leche', en: 'Milk' }, unidadBase: 'ml' },
  { nombre: { es: 'Mantequilla', en: 'Butter' }, unidadBase: 'g' },
  { nombre: { es: 'Harina', en: 'Flour' }, unidadBase: 'g' },
  { nombre: { es: 'Azúcar', en: 'Sugar' }, unidadBase: 'g' },
  { nombre: { es: 'Limón', en: 'Lemon' }, unidadBase: 'ud' },
  { nombre: { es: 'Zanahoria', en: 'Carrot' }, unidadBase: 'g' },
  { nombre: { es: 'Patata', en: 'Potato' }, unidadBase: 'g' },
  { nombre: { es: 'Calabacín', en: 'Zucchini' }, unidadBase: 'g' },
  { nombre: { es: 'Berenjena', en: 'Eggplant' }, unidadBase: 'g' },
  { nombre: { es: 'Espinacas', en: 'Spinach' }, unidadBase: 'g' },
  { nombre: { es: 'Queso', en: 'Cheese' }, unidadBase: 'g' },
  { nombre: { es: 'Nata', en: 'Cream' }, unidadBase: 'ml' },
  { nombre: { es: 'Perejil', en: 'Parsley' }, unidadBase: 'pizca' },
  { nombre: { es: 'Laurel', en: 'Bay leaf' }, unidadBase: 'ud' },
  { nombre: { es: 'Pimentón', en: 'Paprika' }, unidadBase: 'cucharadita' },
  { nombre: { es: 'Comino', en: 'Cumin' }, unidadBase: 'cucharadita' },
  { nombre: { es: 'Canela', en: 'Cinnamon' }, unidadBase: 'cucharadita' },
  { nombre: { es: 'Nuez moscada', en: 'Nutmeg' }, unidadBase: 'pizca' },
  { nombre: { es: 'Vinagre', en: 'Vinegar' }, unidadBase: 'ml' },
  { nombre: { es: 'Salsa de soja', en: 'Soy sauce' }, unidadBase: 'ml' },
  { nombre: { es: 'Miel', en: 'Honey' }, unidadBase: 'cucharada' },
  { nombre: { es: 'Pan', en: 'Bread' }, unidadBase: 'g' },
  { nombre: { es: 'Lechuga', en: 'Lettuce' }, unidadBase: 'g' },
  { nombre: { es: 'Maíz', en: 'Corn' }, unidadBase: 'g' },
  { nombre: { es: 'Guisantes', en: 'Peas' }, unidadBase: 'g' },
  { nombre: { es: 'Albahaca', en: 'Basil' }, unidadBase: 'pizca' },
  { nombre: { es: 'Orégano', en: 'Oregano' }, unidadBase: 'pizca' },
  { nombre: { es: 'Romero', en: 'Rosemary' }, unidadBase: 'pizca' },
  { nombre: { es: 'Tomillo', en: 'Thyme' }, unidadBase: 'pizca' },
];

async function main() {
  console.log('🌱 Cargando datos iniciales...');

  for (const cat of CATEGORIAS) {
    await prisma.categoria.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ ${CATEGORIAS.length} categorías creadas`);

  for (const ing of INGREDIENTES) {
    await prisma.ingrediente.create({
      data: { ...ing, esSistema: true },
    });
  }
  console.log(`✅ ${INGREDIENTES.length} ingredientes creados`);

  console.log('🎉 Seed completado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
