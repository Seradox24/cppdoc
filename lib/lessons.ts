export type LessonId = 'bienvenida' | 'introduccion';

// Añade aquí las próximas lecciones y crea su ruta en app/.
export const lessons = [
  {
    id: 'bienvenida' as const,
    title: 'Bienvenida',
    href: '/',
    description: 'Tu punto de partida y un primer experimento visual.',
    minutes: 4,
    keywords: 'escala slider actor laboratorio',
  },
  {
    id: 'introduccion' as const,
    title: 'Introducción a C++',
    href: '/introduccion',
    description: 'Del lenguaje a los objetos de tu juego.',
    minutes: 8,
    keywords: 'blueprint unreal float variables codigo diagrama',
  },
];

export const upcomingGroups = [
  {
    title: 'FUNDAMENTOS DE C++',
    items: [
      'Variables y tipos',
      'Operadores',
      'Condicionales',
      'Bucles',
      'Funciones',
    ],
  },
  {
    title: 'PENSAR EN OBJETOS',
    items: [
      'Clases y objetos',
      'Punteros y referencias',
      'Memoria y ciclo de vida',
    ],
  },
  {
    title: 'DENTRO DE UNREAL',
    items: ['Actors y componentes', 'C++ y Blueprints', 'Tu primer gameplay'],
  },
];

export const sources = {
  blueprint:
    'https://dev.epicgames.com/documentation/en-us/unreal-engine/coding-in-unreal-engine-blueprint-vs-cplusplus',
  quickStart:
    'https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-cpp-quick-start',
};
