export const learningGroups = [
  {
    id: 'cpp',
    title: 'Introducción a C++ sin Unreal Engine',
    shortTitle: 'C++ sin Unreal Engine',
    href: '/cpp',
    description:
      'Primero el lenguaje: datos, funciones, decisiones y objetos. Un recorrido independiente del motor.',
  },
  {
    id: 'unreal-engine',
    title: 'C++ en Unreal Engine',
    shortTitle: 'C++ en Unreal Engine',
    href: '/unreal-engine',
    description:
      'Después llevaremos las bases de C++ al motor. Definiremos las actividades cuando lleguemos a esta etapa.',
  },
] as const;

// El orden de este catálogo define el temario, el menú y anterior/siguiente.
export const cppActivities = [
  {
    slug: 'introduccion',
    title: 'Introducción a C++',
    description: 'El punto de partida para conocer el lenguaje.',
  },
  {
    slug: 'entorno-y-compilacion',
    title: 'Entorno y compilación',
    description: 'Preparar las herramientas y ejecutar un primer programa.',
    suggested: true,
  },
  {
    slug: 'tipos-de-datos-y-variables',
    title: 'Tipos de datos y variables',
    description: 'Los datos de un programa y cómo representarlos.',
    ready: true,
  },
  {
    slug: 'formato-de-variables',
    title: 'Formato de variables',
    description: 'Nombres, declaraciones y convenciones de escritura.',
    ready: true,
  },
  {
    slug: 'funciones-y-flujo-de-ejecucion',
    title: 'Funciones y flujo de ejecución',
    description: 'Organizar instrucciones y seguir su orden de ejecución.',
  },
  {
    slug: 'asignacion-y-operadores',
    title: 'Asignación de variables y operadores',
    description: 'Cambiar valores y construir expresiones.',
  },
  {
    slug: 'entrada-y-salida',
    title: 'Entrada y salida',
    description: 'Interactuar con un programa desde la consola.',
    suggested: true,
  },
  {
    slug: 'condicionales',
    title: 'Condicionales',
    description: 'Tomar decisiones y elegir caminos.',
  },
  {
    slug: 'structs',
    title: 'Structs',
    description: 'Agrupar datos relacionados en una estructura.',
  },
  {
    slug: 'bucles-while',
    title: 'Bucles while',
    description: 'Repetir instrucciones mientras se cumpla una condición.',
  },
  {
    slug: 'bucles-for',
    title: 'Bucles for',
    description: 'Controlar repeticiones con un contador.',
  },
  {
    slug: 'arrays',
    title: 'Arrays',
    description: 'Organizar y recorrer varios elementos.',
  },
  {
    slug: 'strings-y-vectores',
    title: 'Strings y vectores',
    description: 'Trabajar con texto y colecciones de tamaño variable.',
    suggested: true,
  },
  {
    slug: 'parametros-y-retorno',
    title: 'Parámetros y retorno de funciones',
    description: 'Pasar datos a una función y obtener resultados.',
    suggested: true,
  },
  {
    slug: 'alcance-y-tiempo-de-vida',
    title: 'Alcance y tiempo de vida',
    description: 'Dónde existe una variable y durante cuánto tiempo.',
    suggested: true,
  },
  {
    slug: 'clases-y-objetos',
    title: 'Clases y objetos',
    description: 'Reunir datos y comportamiento en objetos.',
  },
  {
    slug: 'referencias',
    title: 'Referencias',
    description: 'Acceder a un dato existente mediante otro nombre.',
  },
  {
    slug: 'punteros-y-memoria',
    title: 'Punteros y memoria',
    description: 'Introducir direcciones, acceso y gestión de recursos.',
    suggested: true,
  },
  {
    slug: 'herencia',
    title: 'Herencia',
    description: 'Extender clases y relacionar comportamientos.',
  },
] as const;

export type GroupId = (typeof learningGroups)[number]['id'];
export type LessonId =
  | 'bienvenida'
  | `cpp-${(typeof cppActivities)[number]['slug']}`;
export type Lesson = {
  id: LessonId;
  title: string;
  href: string;
  description: string;
  group: GroupId | null;
  status: 'ready' | 'planned';
  keywords: string;
  suggested?: boolean;
};

export const lessons: Lesson[] = [
  {
    id: 'bienvenida',
    title: 'Bienvenida',
    href: '/',
    description: 'Tu punto de partida y un primer experimento visual.',
    group: null,
    status: 'ready',
    keywords: 'escala slider actor laboratorio inicio',
  },
  ...cppActivities.map((activity) => ({
    id: `cpp-${activity.slug}` as const,
    title: activity.title,
    href: `/cpp/${activity.slug}`,
    description: activity.description,
    group: 'cpp' as const,
    status:
      'ready' in activity && activity.ready
        ? ('ready' as const)
        : ('planned' as const),
    keywords: `${activity.title} ${activity.slug} c++ sin unreal`,
    suggested: 'suggested' in activity && activity.suggested,
  })),
];

export const publishedLessons = lessons.filter(
  (lesson) => lesson.status === 'ready',
);
export const getGroupLessons = (group: GroupId) =>
  lessons.filter((lesson) => lesson.group === group);

export const sources = {
  blueprint:
    'https://dev.epicgames.com/documentation/en-us/unreal-engine/coding-in-unreal-engine-blueprint-vs-cplusplus',
  quickStart:
    'https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-cpp-quick-start',
};
