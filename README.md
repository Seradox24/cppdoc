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
- `/cpp/[slug]`: página individual de cada actividad, pendiente de contenido, con anterior/siguiente.
- `/unreal-engine`: grupo **C++ en Unreal Engine**, reservado para definir actividades más adelante.
- `/introduccion`: redirección compatible hacia `/cpp/introduccion`.

El buscador (Ctrl/Cmd + K) incluye grupos y páginas pendientes, y señala su estado. Los grupos del menú son plegables. Solo el contenido publicado cuenta para el progreso; una página pendiente no puede marcarse como completada. El progreso de la bienvenida se conserva y la introducción antigua no marca la nueva actividad como leída.

Se añadieron seis actividades sugeridas: entorno y compilación, entrada y salida, strings y vectores, parámetros y retorno, alcance y tiempo de vida, y punteros y memoria. Se distinguen en el temario.

La introducción original, que mezclaba C++ con Unreal, permanece en `components/learning/introduction.tsx` como borrador sin publicar. Se podrá adaptar cuando se desarrolle el grupo de Unreal. Las páginas nuevas no incluyen lecciones ni ejercicios desarrollados todavía.

## Cómo añadir una lección

1. Para añadir una actividad de C++ básico, agrega su `slug`, título y descripción a `cppActivities` en `lib/lessons.ts`. Su posición determina el orden del temario, menú y navegación. El identificador, la ruta y el contador se derivan automáticamente.
2. `app/cpp/[slug]/page.tsx` crea sus rutas y usa `PendingLesson` como plantilla. Las rutas desconocidas devuelven 404.
3. Cuando desarrollemos un tema, crea su componente en `components/learning/` y selecciónalo desde la ruta en lugar de `PendingLesson`. Envuélvelo en `LearningShell` y utiliza `CompleteLesson` al final.
4. Cambia el estado de esa actividad a `ready` al publicar su contenido; `publishedLessons` determina qué cuenta para el progreso. El estado actual de las actividades es `planned`.
5. Para ampliar la etapa de Unreal, añade sus actividades al catálogo `lessons`, amplía `LessonId` y crea su ruta. Para futuros grupos, amplía `learningGroups` y crea su página con `CourseOverview`.
6. Mantén los experimentos en componentes independientes. `ScaleLab` es un ejemplo de estado, control, código y visualización vinculados. Verifica tipos y compilación antes de publicar.

Los tokens de color, tipografía y tamaños adaptables están centralizados en `app/globals.css`.

## Alcance de los ejemplos

El laboratorio simula la escala en el navegador; no ejecuta C++ ni se conecta al editor de Unreal. El código se presenta como fragmentos educativos, con su contexto y requisitos indicados en cada ejemplo. La ilustración de la bienvenida está etiquetada como pseudocódigo.

Referencias oficiales utilizadas:

- [C++ y Blueprint](https://dev.epicgames.com/documentation/en-us/unreal-engine/coding-in-unreal-engine-blueprint-vs-cplusplus)
- [Primeros pasos de programación](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-cpp-quick-start)

## Publicación

El proyecto conserva la configuración de Sites en `.openai/hosting.json`. `npm run build` prepara el Worker y los recursos estáticos. El desarrollo local sigue funcionando de forma independiente.

Versión privada: [C++ visual](https://cpp-visual-unreal.seradox30.chatgpt.site). Si cambias de dominio, actualiza `metadataBase` en `app/layout.tsx` para que la imagen de vista previa apunte al origen correcto.
