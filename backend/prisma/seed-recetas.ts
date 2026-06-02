// prisma/seed-recetas.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapeo de categorías por slug a ID
const CAT_IDS: Record<string, string> = {
  legumbres: 'cmpwgsr260000moch0xtcss5w',
  pastas: 'cmpwgsr2l0001moch254ptgts',
  carnes: 'cmpwgsr2s0002mochmvrmqb4n',
  pescados: 'cmpwgsr310003moch0kwgsjpf',
  verduras: 'cmpwgsr3e0004mochvhuf3bdi',
  sopas: 'cmpwgsr3t0005mochb882wz5b',
  ensaladas: 'cmpwgsr410006mochbkfjbi41',
  postres: 'cmpwgsr490007mochq3lf56pi',
  salsas: 'cmpwgsr4i0008mochse2dsnoi',
  desayunos: 'cmpwgsr4q0009mochk1s4q6pd',
  pan: 'cmpwgsr4x000amochuhiv4fm6',
  bebidas: 'cmpwgsr58000bmochtjc0c5eg',
};

const RECETAS = [
  // === LEGUMBRES ===
  {
    nombre: { es: 'Lentejas estofadas', en: 'Stewed lentils' },
    categoriaId: CAT_IDS.legumbres,
    tiempoMin: 45,
    porciones: 4,
    instrucciones: {
      es: '1. Poner las lentejas en remojo 30 min.\n2. En una olla, sofreír la cebolla, el ajo y la zanahoria picados.\n3. Añadir el tomate triturado y el pimentón.\n4. Agregar las lentejas escurridas y cubrir con agua.\n5. Cocinar a fuego medio 30-35 min.\n6. Añadir sal y laurel al final.',
      en: '1. Soak lentils for 30 min.\n2. In a pot, sauté chopped onion, garlic and carrot.\n3. Add crushed tomato and paprika.\n4. Add drained lentils and cover with water.\n5. Cook over medium heat 30-35 min.\n6. Add salt and bay leaf at the end.'
    },
    ingredientes: [
      { ingredienteId: 'lentejas', cantidad: 400, unidad: 'g' },
      { ingredienteId: 'cebolla', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'ajo', cantidad: 2, unidad: 'ud' },
      { ingredienteId: 'zanahoria', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'tomate', cantidad: 2, unidad: 'ud' },
      { ingredienteId: 'pimenton', cantidad: 1, unidad: 'cucharadita' },
      { ingredienteId: 'laurel', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'aceite_oliva', cantidad: 3, unidad: 'cucharada' },
      { ingredienteId: 'sal', cantidad: 1, unidad: 'pizca' },
    ],
  },
  {
    nombre: { es: 'Garbanzos con espinacas', en: 'Chickpeas with spinach' },
    categoriaId: CAT_IDS.legumbres,
    tiempoMin: 40,
    porciones: 4,
    instrucciones: {
      es: '1. Si usas garbanzos secos, poner en remojo la noche anterior.\n2. Sofreír cebolla y ajo en aceite de oliva.\n3. Añadir el tomate triturado y cocinar 5 min.\n4. Agregar los garbanzos cocidos y las espinacas.\n5. Cocinar todo junto 15 min.\n6. Sazonar con comino, pimentón y sal.',
      en: '1. If using dried chickpeas, soak overnight.\n2. Sauté onion and garlic in olive oil.\n3. Add crushed tomato and cook 5 min.\n4. Add cooked chickpeas and spinach.\n5. Cook together 15 min.\n6. Season with cumin, paprika and salt.'
    },
    ingredientes: [
      { ingredienteId: 'garbanzos', cantidad: 400, unidad: 'g' },
      { ingredienteId: 'espinacas', cantidad: 300, unidad: 'g' },
      { ingredienteId: 'cebolla', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'ajo', cantidad: 3, unidad: 'ud' },
      { ingredienteId: 'tomate', cantidad: 2, unidad: 'ud' },
      { ingredienteId: 'comino', cantidad: 1, unidad: 'cucharadita' },
      { ingredienteId: 'pimenton', cantidad: 1, unidad: 'cucharadita' },
      { ingredienteId: 'aceite_oliva', cantidad: 3, unidad: 'cucharada' },
      { ingredienteId: 'sal', cantidad: 1, unidad: 'pizca' },
    ],
  },
  {
    nombre: { es: 'Judías blancas con verduras', en: 'White beans with vegetables' },
    categoriaId: CAT_IDS.legumbres,
    tiempoMin: 50,
    porciones: 4,
    instrucciones: {
      es: '1. Poner las judías en remojo la noche anterior.\n2. Escurrir y cocinar en agua con laurel 30 min.\n3. En otra olla, sofreír cebolla, pimiento y zanahoria.\n4. Añadir el tomate y cocinar 10 min.\n5. Mezclar las judías escurridas con el sofrito.\n6. Cocinar todo junto 10 min más. Sazonar.',
      en: '1. Soak beans overnight.\n2. Drain and cook in water with bay leaf 30 min.\n3. In another pot, sauté onion, pepper and carrot.\n4. Add tomato and cook 10 min.\n5. Mix drained beans with the sofrito.\n6. Cook together 10 more min. Season.'
    },
    ingredientes: [
      { ingredienteId: 'judias_blancas', cantidad: 400, unidad: 'g' },
      { ingredienteId: 'cebolla', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'pimiento', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'zanahoria', cantidad: 2, unidad: 'ud' },
      { ingredienteId: 'tomate', cantidad: 2, unidad: 'ud' },
      { ingredienteId: 'laurel', cantidad: 2, unidad: 'ud' },
      { ingredienteId: 'aceite_oliva', cantidad: 3, unidad: 'cucharada' },
      { ingredienteId: 'sal', cantidad: 1, unidad: 'pizca' },
    ],
  },

  // === PASTAS ===
  {
    nombre: { es: 'Pasta al pomodoro', en: 'Pasta with tomato sauce' },
    categoriaId: CAT_IDS.pastas,
    tiempoMin: 25,
    porciones: 4,
    instrucciones: {
      es: '1. Hervir agua con sal y cocinar la pasta al dente.\n2. En una sartén, calentar aceite de oliva y dorar el ajo.\n3. Añadir el tomate triturado, albahaca y orégano.\n4. Cocinar la salsa 15 min a fuego medio.\n5. Escurrir la pasta y mezclar con la salsa.\n6. Servir con queso rallado por encima.',
      en: '1. Boil salted water and cook pasta al dente.\n2. In a pan, heat olive oil and brown garlic.\n3. Add crushed tomato, basil and oregano.\n4. Cook sauce 15 min over medium heat.\n5. Drain pasta and mix with sauce.\n6. Serve with grated cheese on top.'
    },
    ingredientes: [
      { ingredienteId: 'pasta', cantidad: 400, unidad: 'g' },
      { ingredienteId: 'tomate', cantidad: 4, unidad: 'ud' },
      { ingredienteId: 'ajo', cantidad: 3, unidad: 'ud' },
      { ingredienteId: 'albahaca', cantidad: 1, unidad: 'pizca' },
      { ingredienteId: 'oregano', cantidad: 1, unidad: 'pizca' },
      { ingredienteId: 'queso', cantidad: 50, unidad: 'g' },
      { ingredienteId: 'aceite_oliva', cantidad: 3, unidad: 'cucharada' },
      { ingredienteId: 'sal', cantidad: 1, unidad: 'pizca' },
    ],
  },
  {
    nombre: { es: 'Arroz con pollo', en: 'Rice with chicken' },
    categoriaId: CAT_IDS.pastas,
    tiempoMin: 40,
    porciones: 4,
    instrucciones: {
      es: '1. Cortar el pollo en trozos y salpimentar.\n2. Dorar el pollo en una olla con aceite de oliva. Reservar.\n3. En el mismo aceite, sofreír cebolla, pimiento y ajo.\n4. Añadir el arroz y rehogar 2 min.\n5. Incorporar el pollo, cubrir con caldo y cocinar 18 min.\n6. Dejar reposar 5 min antes de servir.',
      en: '1. Cut chicken into pieces and season.\n2. Brown chicken in a pot with olive oil. Set aside.\n3. In the same oil, sauté onion, pepper and garlic.\n4. Add rice and stir 2 min.\n5. Add chicken, cover with broth and cook 18 min.\n6. Let rest 5 min before serving.'
    },
    ingredientes: [
      { ingredienteId: 'arroz', cantidad: 300, unidad: 'g' },
      { ingredienteId: 'pollo', cantidad: 500, unidad: 'g' },
      { ingredienteId: 'cebolla', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'pimiento', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'ajo', cantidad: 2, unidad: 'ud' },
      { ingredienteId: 'aceite_oliva', cantidad: 3, unidad: 'cucharada' },
      { ingredienteId: 'sal', cantidad: 1, unidad: 'pizca' },
      { ingredienteId: 'pimienta', cantidad: 1, unidad: 'pizca' },
    ],
  },

  // === CARNES ===
  {
    nombre: { es: 'Pollo al horno con patatas', en: 'Roast chicken with potatoes' },
    categoriaId: CAT_IDS.carnes,
    tiempoMin: 60,
    porciones: 4,
    instrucciones: {
      es: '1. Precalentar el horno a 200°C.\n2. Cortar las patatas en rodajas y colocar en una bandeja.\n3. Salpimentar el pollo y colocar sobre las patatas.\n4. Añadir ajo, romero, tomillo y un chorro de aceite.\n5. Hornear 45-50 min hasta que el pollo esté dorado.\n6. Servir caliente con las patatas.',
      en: '1. Preheat oven to 200°C.\n2. Slice potatoes and place on a tray.\n3. Season chicken and place on top of potatoes.\n4. Add garlic, rosemary, thyme and a drizzle of oil.\n5. Bake 45-50 min until chicken is golden.\n6. Serve hot with potatoes.'
    },
    ingredientes: [
      { ingredienteId: 'pollo', cantidad: 800, unidad: 'g' },
      { ingredienteId: 'patata', cantidad: 4, unidad: 'ud' },
      { ingredienteId: 'ajo', cantidad: 4, unidad: 'ud' },
      { ingredienteId: 'romero', cantidad: 1, unidad: 'pizca' },
      { ingredienteId: 'tomillo', cantidad: 1, unidad: 'pizca' },
      { ingredienteId: 'aceite_oliva', cantidad: 4, unidad: 'cucharada' },
      { ingredienteId: 'sal', cantidad: 1, unidad: 'pizca' },
      { ingredienteId: 'pimienta', cantidad: 1, unidad: 'pizca' },
    ],
  },
  {
    nombre: { es: 'Ternera guisada con verduras', en: 'Beef stew with vegetables' },
    categoriaId: CAT_IDS.carnes,
    tiempoMin: 90,
    porciones: 4,
    instrucciones: {
      es: '1. Cortar la ternera en cubos y salpimentar.\n2. Dorar la carne en una olla con aceite. Reservar.\n3. Sofreír cebolla, zanahoria y pimiento.\n4. Añadir el tomate y cocinar 5 min.\n5. Incorporar la ternera y cubrir con agua o caldo.\n6. Cocinar a fuego bajo 60-70 min hasta que la tierna.',
      en: '1. Cut beef into cubes and season.\n2. Brown meat in a pot with oil. Set aside.\n3. Sauté onion, carrot and pepper.\n4. Add tomato and cook 5 min.\n5. Add beef and cover with water or broth.\n6. Cook over low heat 60-70 min until tender.'
    },
    ingredientes: [
      { ingredienteId: 'ternera', cantidad: 600, unidad: 'g' },
      { ingredienteId: 'cebolla', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'zanahoria', cantidad: 2, unidad: 'ud' },
      { ingredienteId: 'pimiento', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'tomate', cantidad: 2, unidad: 'ud' },
      { ingredienteId: 'laurel', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'aceite_oliva', cantidad: 3, unidad: 'cucharada' },
      { ingredienteId: 'sal', cantidad: 1, unidad: 'pizca' },
      { ingredienteId: 'pimienta', cantidad: 1, unidad: 'pizca' },
    ],
  },
  {
    nombre: { es: 'Cerdo agridulce', en: 'Sweet and sour pork' },
    categoriaId: CAT_IDS.carnes,
    tiempoMin: 35,
    porciones: 4,
    instrucciones: {
      es: '1. Cortar el cerdo en tiras y salpimentar.\n2. Dorar en una sartén con aceite. Reservar.\n3. En la misma sartén, saltear cebolla y pimiento.\n4. Añadir salsa de soja, miel y vinagre.\n5. Incorporar el cerdo y cocinar 10 min.\n6. Servir con arroz blanco.',
      en: '1. Cut pork into strips and season.\n2. Brown in a pan with oil. Set aside.\n3. In the same pan, sauté onion and pepper.\n4. Add soy sauce, honey and vinegar.\n5. Add pork and cook 10 min.\n6. Serve with white rice.'
    },
    ingredientes: [
      { ingredienteId: 'cerdo', cantidad: 500, unidad: 'g' },
      { ingredienteId: 'cebolla', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'pimiento', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'salsa_soja', cantidad: 3, unidad: 'cucharada' },
      { ingredienteId: 'miel', cantidad: 2, unidad: 'cucharada' },
      { ingredienteId: 'vinagre', cantidad: 1, unidad: 'cucharada' },
      { ingredienteId: 'aceite_oliva', cantidad: 2, unidad: 'cucharada' },
      { ingredienteId: 'sal', cantidad: 1, unidad: 'pizca' },
      { ingredienteId: 'pimienta', cantidad: 1, unidad: 'pizca' },
    ],
  },
  {
    nombre: { es: 'Huevos revueltos con espinacas', en: 'Scrambled eggs with spinach' },
    categoriaId: CAT_IDS.carnes,
    tiempoMin: 10,
    porciones: 2,
    instrucciones: {
      es: '1. Calentar un poco de mantequilla en una sartén.\n2. Añadir las espinacas y saltear 2 min.\n3. Batir los huevos con un poco de sal.\n4. Verter sobre las espinacas y remover suavemente.\n5. Cocinar a fuego bajo hasta que cuajen.\n6. Servir inmediatamente.',
      en: '1. Heat some butter in a pan.\n2. Add spinach and sauté 2 min.\n3. Beat eggs with a pinch of salt.\n4. Pour over spinach and stir gently.\n5. Cook over low heat until set.\n6. Serve immediately.'
    },
    ingredientes: [
      { ingredienteId: 'huevo', cantidad: 4, unidad: 'ud' },
      { ingredienteId: 'espinacas', cantidad: 150, unidad: 'g' },
      { ingredienteId: 'mantequilla', cantidad: 20, unidad: 'g' },
      { ingredienteId: 'sal', cantidad: 1, unidad: 'pizca' },
    ],
  },

  // === PESCADOS ===
  {
    nombre: { es: 'Merluza al horno', en: 'Baked hake' },
    categoriaId: CAT_IDS.pescados,
    tiempoMin: 30,
    porciones: 4,
    instrucciones: {
      es: '1. Precalentar el horno a 180°C.\n2. Colocar los lomos de merluza en una bandeja.\n3. Añadir ajo picado, perejil, limón y aceite.\n4. Salpimentar al gusto.\n5. Hornear 18-20 min hasta que esté cocida.\n6. Servir con patatas cocidas.',
      en: '1. Preheat oven to 180°C.\n2. Place hake fillets on a tray.\n3. Add minced garlic, parsley, lemon and oil.\n4. Season to taste.\n5. Bake 18-20 min until cooked.\n6. Serve with boiled potatoes.'
    },
    ingredientes: [
      { ingredienteId: 'merluza', cantidad: 600, unidad: 'g' },
      { ingredienteId: 'ajo', cantidad: 3, unidad: 'ud' },
      { ingredienteId: 'perejil', cantidad: 1, unidad: 'pizca' },
      { ingredienteId: 'limon', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'aceite_oliva', cantidad: 3, unidad: 'cucharada' },
      { ingredienteId: 'sal', cantidad: 1, unidad: 'pizca' },
      { ingredienteId: 'pimienta', cantidad: 1, unidad: 'pizca' },
    ],
  },
  {
    nombre: { es: 'Merluza en salsa verde', en: 'Hake in green sauce' },
    categoriaId: CAT_IDS.pescados,
    tiempoMin: 25,
    porciones: 4,
    instrucciones: {
      es: '1. En una cazuela, pochar ajo y cebolla en aceite.\n2. Añadir perejil picado y un poco de harina.\n3. Verter caldo de pescado poco a poco.\n4. Colocar los lomos de merluza en la salsa.\n5. Cocinar a fuego suave 12-15 min.\n6. Rectificar de sal y servir.',
      en: '1. In a pot, sauté garlic and onion in oil.\n2. Add chopped parsley and a bit of flour.\n3. Pour fish stock gradually.\n4. Place hake fillets in the sauce.\n5. Cook over low heat 12-15 min.\n6. Adjust salt and serve.'
    },
    ingredientes: [
      { ingredienteId: 'merluza', cantidad: 600, unidad: 'g' },
      { ingredienteId: 'ajo', cantidad: 4, unidad: 'ud' },
      { ingredienteId: 'cebolla', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'perejil', cantidad: 2, unidad: 'pizca' },
      { ingredienteId: 'harina', cantidad: 1, unidad: 'cucharada' },
      { ingredienteId: 'aceite_oliva', cantidad: 3, unidad: 'cucharada' },
      { ingredienteId: 'sal', cantidad: 1, unidad: 'pizca' },
    ],
  },

  // === VERDURAS ===
  {
    nombre: { es: 'Pisto manchego', en: 'Spanish ratatouille' },
    categoriaId: CAT_IDS.verduras,
    tiempoMin: 35,
    porciones: 4,
    instrucciones: {
      es: '1. Cortar todas las verduras en trozos pequeños.\n2. En una sartén grande, calentar aceite de oliva.\n3. Sofreír la cebolla y el ajo.\n4. Añadir el pimiento, calabacín y berenjena.\n5. Incorporar el tomate y cocinar 20 min.\n6. Sazonar con sal y una pizca de azúcar.',
      en: '1. Cut all vegetables into small pieces.\n2. In a large pan, heat olive oil.\n3. Sauté onion and garlic.\n4. Add pepper, zucchini and eggplant.\n5. Add tomato and cook 20 min.\n6. Season with salt and a pinch of sugar.'
    },
    ingredientes: [
      { ingredienteId: 'calabacin', cantidad: 2, unidad: 'ud' },
      { ingredienteId: 'berenjena', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'pimiento', cantidad: 2, unidad: 'ud' },
      { ingredienteId: 'tomate', cantidad: 3, unidad: 'ud' },
      { ingredienteId: 'cebolla', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'ajo', cantidad: 2, unidad: 'ud' },
      { ingredienteId: 'azucar', cantidad: 1, unidad: 'pizca' },
      { ingredienteId: 'aceite_oliva', cantidad: 4, unidad: 'cucharada' },
      { ingredienteId: 'sal', cantidad: 1, unidad: 'pizca' },
    ],
  },
  {
    nombre: { es: 'Ensalada mediterránea', en: 'Mediterranean salad' },
    categoriaId: CAT_IDS.ensaladas,
    tiempoMin: 10,
    porciones: 2,
    instrucciones: {
      es: '1. Lavar y cortar la lechuga.\n2. Cortar tomate, cebolla y pepino en rodajas.\n3. Añadir aceitunas y queso en cubos.\n4. Aliñar con aceite de oliva, vinagre y sal.\n5. Mezclar bien y servir fresca.',
      en: '1. Wash and cut lettuce.\n2. Slice tomato, onion and cucumber.\n3. Add olives and cheese cubes.\n4. Dress with olive oil, vinegar and salt.\n5. Mix well and serve fresh.'
    },
    ingredientes: [
      { ingredienteId: 'lechuga', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'tomate', cantidad: 2, unidad: 'ud' },
      { ingredienteId: 'cebolla', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'queso', cantidad: 80, unidad: 'g' },
      { ingredienteId: 'aceite_oliva', cantidad: 2, unidad: 'cucharada' },
      { ingredienteId: 'vinagre', cantidad: 1, unidad: 'cucharada' },
      { ingredienteId: 'sal', cantidad: 1, unidad: 'pizca' },
    ],
  },

  // === SOPAS Y CREMAS ===
  {
    nombre: { es: 'Crema de calabacín', en: 'Zucchini cream' },
    categoriaId: CAT_IDS.sopas,
    tiempoMin: 30,
    porciones: 4,
    instrucciones: {
      es: '1. Pelar y trocear los calabacines, patata y cebolla.\n2. Sofreír la cebolla en aceite de oliva.\n3. Añadir el calabacín y la patata.\n4. Cubrir con caldo y cocinar 20 min.\n5. Triturar hasta obtener una crema fina.\n6. Añadir nata y rectificar de sal.',
      en: '1. Peel and chop zucchini, potato and onion.\n2. Sauté onion in olive oil.\n3. Add zucchini and potato.\n4. Cover with broth and cook 20 min.\n5. Blend until smooth.\n6. Add cream and adjust salt.'
    },
    ingredientes: [
      { ingredienteId: 'calabacin', cantidad: 3, unidad: 'ud' },
      { ingredienteId: 'patata', cantidad: 2, unidad: 'ud' },
      { ingredienteId: 'cebolla', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'nata', cantidad: 100, unidad: 'ml' },
      { ingredienteId: 'aceite_oliva', cantidad: 2, unidad: 'cucharada' },
      { ingredienteId: 'sal', cantidad: 1, unidad: 'pizca' },
    ],
  },
  {
    nombre: { es: 'Sopa de ajo', en: 'Garlic soup' },
    categoriaId: CAT_IDS.sopas,
    tiempoMin: 25,
    porciones: 4,
    instrucciones: {
      es: '1. Pelar y laminar los ajos.\n2. Dorar los ajos en aceite de oliva.\n3. Añadir el pimentón y rehogar brevemente.\n4. Incorporar el pan cortado en trozos.\n5. Cubrir con caldo y cocinar 15 min.\n6. Servir con un huevo poché opcional.',
      en: '1. Peel and slice garlic.\n2. Brown garlic in olive oil.\n3. Add paprika and stir briefly.\n4. Add bread cut into pieces.\n5. Cover with broth and cook 15 min.\n6. Serve with optional poached egg.'
    },
    ingredientes: [
      { ingredienteId: 'ajo', cantidad: 6, unidad: 'ud' },
      { ingredienteId: 'pan', cantidad: 100, unidad: 'g' },
      { ingredienteId: 'pimenton', cantidad: 1, unidad: 'cucharadita' },
      { ingredienteId: 'huevo', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'aceite_oliva', cantidad: 3, unidad: 'cucharada' },
      { ingredienteId: 'sal', cantidad: 1, unidad: 'pizca' },
    ],
  },

  // === ENSALADAS ===
  {
    nombre: { es: 'Ensalada César', en: 'Caesar salad' },
    categoriaId: CAT_IDS.ensaladas,
    tiempoMin: 15,
    porciones: 2,
    instrucciones: {
      es: '1. Lavar y trocear la lechuga.\n2. Cortar el pollo en tiras y dorar en sartén.\n3. Preparar la salsa: mezclar limón, ajo, aceite y queso.\n4. Añadir picatostes de pan tostado.\n5. Mezclar todo y servir.',
      en: '1. Wash and chop lettuce.\n2. Cut chicken into strips and brown in pan.\n3. Prepare dressing: mix lemon, garlic, oil and cheese.\n4. Add toasted croutons.\n5. Mix everything and serve.'
    },
    ingredientes: [
      { ingredienteId: 'lechuga', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'pollo', cantidad: 200, unidad: 'g' },
      { ingredienteId: 'limon', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'ajo', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'queso', cantidad: 40, unidad: 'g' },
      { ingredienteId: 'pan', cantidad: 50, unidad: 'g' },
      { ingredienteId: 'aceite_oliva', cantidad: 2, unidad: 'cucharada' },
      { ingredienteId: 'sal', cantidad: 1, unidad: 'pizca' },
    ],
  },

  // === POSTRES ===
  {
    nombre: { es: 'Arroz con leche', en: 'Rice pudding' },
    categoriaId: CAT_IDS.postres,
    tiempoMin: 40,
    porciones: 4,
    instrucciones: {
      es: '1. Hervir el arroz en leche con canela y limón.\n2. Cocinar a fuego bajo 30 min, removiendo.\n3. Añadir el azúcar y cocinar 5 min más.\n4. Retirar la canela y la piel de limón.\n5. Dejar enfriar y servir espolvoreado con canela.',
      en: '1. Boil rice in milk with cinnamon and lemon.\n2. Cook over low heat 30 min, stirring.\n3. Add sugar and cook 5 more min.\n4. Remove cinnamon and lemon peel.\n5. Let cool and serve dusted with cinnamon.'
    },
    ingredientes: [
      { ingredienteId: 'arroz', cantidad: 100, unidad: 'g' },
      { ingredienteId: 'leche', cantidad: 1, unidad: 'l' },
      { ingredienteId: 'azucar', cantidad: 80, unidad: 'g' },
      { ingredienteId: 'canela', cantidad: 1, unidad: 'cucharadita' },
      { ingredienteId: 'limon', cantidad: 1, unidad: 'ud' },
    ],
  },
  {
    nombre: { es: 'Torrijas', en: 'Spanish French toast' },
    categoriaId: CAT_IDS.postres,
    tiempoMin: 20,
    porciones: 4,
    instrucciones: {
      es: '1. Calentar la leche con canela y azúcar.\n2. Cortar el pan en rebanadas gruesas.\n3. Empapar las rebanadas en la leche caliente.\n4. Pasar por huevo batido.\n5. Freír en aceite caliente hasta dorar.\n6. Espolvorear con azúcar y canela.',
      en: '1. Heat milk with cinnamon and sugar.\n2. Cut bread into thick slices.\n3. Soak slices in hot milk.\n4. Dip in beaten egg.\n5. Fry in hot oil until golden.\n6. Sprinkle with sugar and cinnamon.'
    },
    ingredientes: [
      { ingredienteId: 'pan', cantidad: 8, unidad: 'ud' },
      { ingredienteId: 'leche', cantidad: 500, unidad: 'ml' },
      { ingredienteId: 'huevo', cantidad: 2, unidad: 'ud' },
      { ingredienteId: 'azucar', cantidad: 60, unidad: 'g' },
      { ingredienteId: 'canela', cantidad: 1, unidad: 'cucharadita' },
      { ingredienteId: 'aceite_oliva', cantidad: 100, unidad: 'ml' },
    ],
  },
  {
    nombre: { es: 'Natillas caseras', en: 'Homemade custard' },
    categoriaId: CAT_IDS.postres,
    tiempoMin: 20,
    porciones: 4,
    instrucciones: {
      es: '1. Calentar la leche con canela y piel de limón.\n2. En un bol, mezclar yemas con azúcar y harina.\n3. Verter la leche caliente poco a poco sin dejar de remover.\n4. Cocinar a fuego bajo hasta que espese.\n5. Servir en cuencos con una galleta encima.',
      en: '1. Heat milk with cinnamon and lemon peel.\n2. In a bowl, mix yolks with sugar and flour.\n3. Pour hot milk gradually while stirring.\n4. Cook over low heat until thickened.\n5. Serve in bowls with a cookie on top.'
    },
    ingredientes: [
      { ingredienteId: 'leche', cantidad: 500, unidad: 'ml' },
      { ingredienteId: 'huevo', cantidad: 3, unidad: 'ud' },
      { ingredienteId: 'azucar', cantidad: 60, unidad: 'g' },
      { ingredienteId: 'harina', cantidad: 1, unidad: 'cucharada' },
      { ingredienteId: 'canela', cantidad: 1, unidad: 'cucharadita' },
      { ingredienteId: 'limon', cantidad: 1, unidad: 'ud' },
    ],
  },

  // === SALSAS ===
  {
    nombre: { es: 'Salsa boloñesa', en: 'Bolognese sauce' },
    categoriaId: CAT_IDS.salsas,
    tiempoMin: 45,
    porciones: 4,
    instrucciones: {
      es: '1. Sofreír cebolla, zanahoria y ajo picados.\n2. Añadir la ternera picada y dorar.\n3. Incorporar el tomate triturado.\n4. Añadir orégano, laurel y un poco de vino.\n5. Cocinar a fuego bajo 30 min.\n6. Sazonar y servir sobre pasta.',
      en: '1. Sauté chopped onion, carrot and garlic.\n2. Add ground beef and brown.\n3. Add crushed tomato.\n4. Add oregano, bay leaf and a bit of wine.\n5. Cook over low heat 30 min.\n6. Season and serve over pasta.'
    },
    ingredientes: [
      { ingredienteId: 'ternera', cantidad: 400, unidad: 'g' },
      { ingredienteId: 'cebolla', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'zanahoria', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'ajo', cantidad: 2, unidad: 'ud' },
      { ingredienteId: 'tomate', cantidad: 3, unidad: 'ud' },
      { ingredienteId: 'oregano', cantidad: 1, unidad: 'pizca' },
      { ingredienteId: 'laurel', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'aceite_oliva', cantidad: 2, unidad: 'cucharada' },
      { ingredienteId: 'sal', cantidad: 1, unidad: 'pizca' },
    ],
  },

  // === DESAYUNOS ===
  {
    nombre: { es: 'Tostada con tomate y aceite', en: 'Toast with tomato and olive oil' },
    categoriaId: CAT_IDS.desayunos,
    tiempoMin: 5,
    porciones: 1,
    instrucciones: {
      es: '1. Tostar el pan en la tostadora o sartén.\n2. Rallar el tomate maduro sobre la tostada.\n3. Añadir un chorrito de aceite de oliva.\n4. Espolvorear con sal.\n5. Opcional: añadir ajo rallado o jamón.',
      en: '1. Toast bread in toaster or pan.\n2. Grate ripe tomato over toast.\n3. Add a drizzle of olive oil.\n4. Sprinkle with salt.\n5. Optional: add grated garlic or ham.'
    },
    ingredientes: [
      { ingredienteId: 'pan', cantidad: 2, unidad: 'ud' },
      { ingredienteId: 'tomate', cantidad: 1, unidad: 'ud' },
      { ingredienteId: 'aceite_oliva', cantidad: 1, unidad: 'cucharada' },
      { ingredienteId: 'sal', cantidad: 1, unidad: 'pizca' },
    ],
  },
  {
    nombre: { es: 'Crepes dulces', en: 'Sweet crepes' },
    categoriaId: CAT_IDS.desayunos,
    tiempoMin: 20,
    porciones: 4,
    instrucciones: {
      es: '1. Mezclar harina, huevos, leche y azúcar.\n2. Batir hasta obtener una masa líquida sin grumos.\n3. Calentar una sartén con un poco de mantequilla.\n4. Verter un cucharón de masa y girar para cubrir.\n5. Cocinar 1 min por cada lado.\n6. Servir con miel, nata o fruta.',
      en: '1. Mix flour, eggs, milk and sugar.\n2. Beat until smooth batter.\n3. Heat a pan with a bit of butter.\n4. Pour a ladle of batter and swirl to cover.\n5. Cook 1 min each side.\n6. Serve with honey, cream or fruit.'
    },
    ingredientes: [
      { ingredienteId: 'harina', cantidad: 120, unidad: 'g' },
      { ingredienteId: 'huevo', cantidad: 2, unidad: 'ud' },
      { ingredienteId: 'leche', cantidad: 250, unidad: 'ml' },
      { ingredienteId: 'azucar', cantidad: 20, unidad: 'g' },
      { ingredienteId: 'mantequilla', cantidad: 20, unidad: 'g' },
      { ingredienteId: 'miel', cantidad: 2, unidad: 'cucharada' },
    ],
  },

  // === PAN Y MASAS ===
  {
    nombre: { es: 'Pan casero básico', en: 'Basic homemade bread' },
    categoriaId: CAT_IDS.pan,
    tiempoMin: 120,
    porciones: 8,
    instrucciones: {
      es: '1. Mezclar harina, sal y levadura.\n2. Añadir agua tibia y amasar 10 min.\n3. Dejar reposar 1 hora hasta que doble su tamaño.\n4. Formar el pan y dejar reposar 30 min más.\n5. Hornear a 220°C durante 30-35 min.\n6. Dejar enfriar sobre una rejilla.',
      en: '1. Mix flour, salt and yeast.\n2. Add warm water and knead 10 min.\n3. Let rest 1 hour until doubled in size.\n4. Shape bread and let rest 30 more min.\n5. Bake at 220°C for 30-35 min.\n6. Let cool on a rack.'
    },
    ingredientes: [
      { ingredienteId: 'harina', cantidad: 500, unidad: 'g' },
      { ingredienteId: 'sal', cantidad: 10, unidad: 'g' },
      { ingredienteId: 'aceite_oliva', cantidad: 2, unidad: 'cucharada' },
    ],
  },
];

async function main() {
  console.log('🍳 Cargando recetas de ejemplo...');

  // Obtener el primer usuario disponible (el que acaba de registrarse)
  const usuario = await prisma.usuario.findFirst();
  if (!usuario) {
    console.error('❌ No hay usuarios en la BD. Regístrate primero en la app.');
    await prisma.$disconnect();
    return;
  }

  console.log(`✅ Usuario encontrado: ${usuario.nombre} (${usuario.id})`);

  let count = 0;
  for (const receta of RECETAS) {
    try {
      await prisma.receta.create({
        data: {
          nombre: receta.nombre,
          instrucciones: receta.instrucciones,
          categoriaId: receta.categoriaId,
          usuarioId: usuario.id,
          tiempoMin: receta.tiempoMin,
          porciones: receta.porciones,
          publica: true,
          ingredientes: {
            create: receta.ingredientes,
          },
        },
      });
      count++;
      console.log(`  ✅ ${receta.nombre.es}`);
    } catch (err: any) {
      console.error(`  ❌ Error en "${receta.nombre.es}": ${err.message}`);
    }
  }

  console.log(`\n🎉 ${count} recetas creadas correctamente`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
