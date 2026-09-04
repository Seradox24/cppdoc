# C++ visual

Cuaderno visual en español para aprender primero C++ y después aplicarlo a Unreal Engine. La bienvenida es independiente; el aprendizaje se organiza en dos grupos.

## Desarrollo local

Requiere Node.js 22.13 o posterior. Se utiliza npm y se incluye `package-lock.json`.

```sh
npm install
npm run dev
```

Abre la dirección que imprime el servidor (normalmente http://localhost:3000).

```sh
npm run build
npm run typecheck
npm run lint
```

## Tecnologías

- React 19 y TypeScript.
- Vinext / Vite, con rutas de App Router y componentes React.
- Tailwind CSS 4, estilos propios en `app/globals.css`, primitivas shadcn / Base UI y Lucide.
- SVG para la proyección isométrica del laboratorio, actualizada con estado React.
- `localStorage` para el progreso del navegador. No necesita base de datos, credenciales ni Unreal instalado.

## Grupos y páginas

- `/`: bienvenida, ruta de aprendizaje y laboratorio original de escala de un Actor.
- `/cpp`: temario de **Introducción a C++ sin Unreal Engine**, con 19 actividades ordenadas.
- `/cpp/tipos-de-datos-y-variables`: primera actividad publicada de C++ básico, con explorador de seis tipos, ejecución paso a paso, cuatro ejercicios y un programa completo.
- `/cpp/formato-de-variables`: actividad de legibilidad y convenciones, separada de tipos, asignaciones y funciones.
- `/cpp/funciones-y-flujo-de-ejecucion`: anatomía de una función, prototipo, definición y recorrido interactivo de una llamada desde `main` hasta `return`.
- `/cpp/asignacion-y-operadores`: inicialización, reasignación, lectura de valores, familias de operadores, cartera interactiva y precedencia.
- `/cpp/[slug]`: página individual de cada actividad, con anterior/siguiente. Las demás actividades siguen pendientes de contenido.
- `/unreal-engine`: grupo **C++ en Unreal Engine**, reservado para definir actividades más adelante.
- `/introduccion`: redirección compatible hacia `/cpp/introduccion`.

El buscador (Ctrl/Cmd + K) incluye grupos y páginas pendientes, y señala su estado. Los grupos del menú son plegables. Solo el contenido publicado cuenta para el progreso; una página pendiente no puede marcarse como completada. El progreso de la bienvenida se conserva y la introducción antigua no marca la nueva actividad como leída.

Se añadieron seis actividades sugeridas: entorno y compilación, entrada y salida, strings y vectores, parámetros y retorno, alcance y tiempo de vida, y punteros y memoria. Se distinguen en el temario.

La introducción original, que mezclaba C++ con Unreal, permanece en `components/learning/introduction.tsx` como borrador sin publicar. Se podrá adaptar cuando se desarrolle el grupo de Unreal.

## Tipos de datos y variables

La lección adapta el material de la cartera: compartimentos y datos identificables. Se separan nombre, tipo y valor, y se añaden `char`, `double` y `std::string`. La reasignación, los operadores y las funciones se reservan para sus actividades correspondientes.

- `components/learning/variables-lesson.tsx` compone el explorador de tipos, la anatomía de una declaración y los ejercicios con feedback.
- `components/learning/variables-lesson.css` mantiene los estilos de la actividad aislados.
- `lib/variables-lab.ts` genera los ejemplos y ejercicios para cada tipo y valor inicial. También escapa los textos para los literales C++.
- Los experimentos usan estado React. La actividad se puede marcar como completada con el sistema de progreso existente.

El tipo y los valores viven en `VariablesLesson`. El laboratorio superior y el selector que permanece visible al bajar comparten la selección. La declaración explicada y los ejercicios se actualizan juntos. Cada tipo mantiene el último valor elegido al volver a seleccionarlo.

Los consejos y las cuatro preguntas se adaptan al tipo, incluida la diferencia entre una cadena vacía construida por defecto y un tipo fundamental local sin inicializador.

Las comprobaciones de los seis tipos, sus valores editados, la salida y los literales de texto se ejecutan con `node --experimental-strip-types --test tests/variables-lab.test.mjs`.

## Fundamentos separados por actividad

Las actividades evitan repetir el mismo concepto en distintas páginas. “Tipos de datos y variables” explica qué se guarda; “Formato de variables” se limita a legibilidad y convenciones; “Funciones y flujo de ejecución” sigue llamadas y retornos; “Asignación y operadores” cambia valores y resuelve expresiones.

- `components/learning/variable-format-lesson.tsx` contiene comparaciones visuales, convenciones y ejercicios de formato.
- `components/learning/function-flow-lesson.tsx` contiene la anatomía y el recorrido interactivo de funciones.
- `components/learning/assignment-operators-lesson.tsx` contiene la línea temporal de valores, los operadores, la cartera y la precedencia.
- `components/learning/cpp-code-editor.tsx` y `components/learning/cpp-foundations.css` comparten el editor numerado y el sistema visual de estas actividades.
- `lib/assignment-lab.ts` resuelve los resultados de los laboratorios de operadores; `tests/assignment-lab.test.mjs` verifica sus casos principales.

Los controles no compilan C++. Sus límites son didácticos, no los rangos de los tipos; los diagramas no representan tamaños reales en memoria. Se aclara que `int puntos = 3.8;` descarta la fracción, mientras que las llaves rechazan esa conversión; que las variables locales sin inicializador no empiezan automáticamente en cero; y que los decimales de punto flotante pueden ser aproximados.

## Cómo añadir una lección

1. Para añadir una actividad de C++ básico, agrega su `slug`, título y descripción a `cppActivities` en `lib/lessons.ts`. Su posición determina el orden del temario, menú y navegación. El identificador, la ruta y el contador se derivan automáticamente.
2. `app/cpp/[slug]/page.tsx` crea sus rutas y usa `PendingLesson` como plantilla. Las rutas desconocidas devuelven 404.
3. Cuando desarrollemos un tema, crea su componente en `components/learning/` y selecciónalo desde la ruta en lugar de `PendingLesson`. Envuélvelo en `LearningShell` y utiliza `CompleteLesson` al final.
4. Añade `ready: true` a esa actividad en `cppActivities` al publicar su contenido; las demás se consideran `planned`. `publishedLessons` determina qué cuenta para el progreso; el menú y las vistas generales reflejan el estado automáticamente.
5. Para ampliar la etapa de Unreal, añade sus actividades al catálogo `lessons`, amplía `LessonId` y crea su ruta. Para futuros grupos, amplía `learningGroups` y crea su página con `CourseOverview`.
6. Mantén los experimentos en componentes independientes. `ScaleLab` es un ejemplo de estado, control, código y visualización vinculados. Verifica tipos y compilación antes de publicar.

Los tokens de color, tipografía y tamaños adaptables están centralizados en `app/globals.css`.

## Alcance de los ejemplos

El laboratorio simula la escala en el navegador; no ejecuta C++ ni se conecta al editor de Unreal. El código se presenta como fragmentos educativos, con su contexto y requisitos indicados en cada ejemplo. La ilustración de la bienvenida está etiquetada como pseudocódigo.

Referencias oficiales utilizadas:

- [C++ y Blueprint](https://dev.epicgames.com/documentation/en-us/unreal-engine/coding-in-unreal-engine-blueprint-vs-cplusplus)
- [Primeros pasos de programación](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-cpp-quick-start)
- [Tipos fundamentales de C++](https://learn.microsoft.com/en-us/cpp/cpp/fundamental-types-cpp?view=msvc-170)
- [Inicialización con llaves y conversiones](https://eel.is/c++draft/dcl.init.list)
- [Cadenas de texto](https://eel.is/c++draft/string.classes)

## Publicación

El proyecto conserva la configuración de Sites en `.openai/hosting.json`. `npm run build` prepara el Worker y los recursos estáticos. El desarrollo local sigue funcionando de forma independiente.

Versión privada: [C++ visual](https://cpp-visual-unreal.seradox30.chatgpt.site). Si cambias de dominio, actualiza `metadataBase` en `app/layout.tsx` para que la imagen de vista previa apunte al origen correcto.
