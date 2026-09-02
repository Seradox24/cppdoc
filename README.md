# C++ visual

Cuaderno visual en español para aprender C++ en el contexto de Unreal Engine. Incluye dos páginas completas y una navegación preparada para futuros contenidos.

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

## Contenido inicial

- `/`: bienvenida, ruta de aprendizaje y laboratorio de escala de un Actor.
- `/introduccion`: lenguaje frente a API del motor, diagrama C++ / Blueprint / Actor, declaración interactiva, ejemplos `.h` y `.cpp`, y una pregunta con retroalimentación.

Los controles funcionan con teclado y táctil. El buscador se abre desde la cabecera o con Ctrl/Cmd + K. El progreso se marca manualmente y se puede desmarcar. Los temas pendientes están identificados y no navegan a páginas vacías.

## Cómo añadir una lección

1. Añade su identificador al tipo `LessonId` y sus metadatos a `lessons` en `lib/lessons.ts`.
2. Crea `app/tu-leccion/page.tsx` siguiendo `app/introduccion/page.tsx`. Declara sus metadatos y utiliza `LearningShell` con el identificador nuevo.
3. Crea el contenido en `components/learning/`. Usa la introducción como patrón: concepto breve, ejemplo visual, explicación y comprobación.
4. Usa `CompleteLesson` para registrar el progreso. Retira el tema de `upcomingGroups` cuando esté disponible y actualiza los textos de la ruta de bienvenida.
5. Mantén los experimentos en componentes independientes. `ScaleLab` es un ejemplo de estado, control, código y visualización vinculados.
6. Verifica tipos y compilación antes de publicar.

Los tokens de color, tipografía y tamaños adaptables están centralizados en `app/globals.css`.

## Alcance de los ejemplos

El laboratorio simula la escala en el navegador; no ejecuta C++ ni se conecta al editor de Unreal. El código se presenta como fragmentos educativos, con su contexto y requisitos indicados en cada ejemplo. La ilustración de la bienvenida está etiquetada como pseudocódigo.

Referencias oficiales utilizadas:

- [C++ y Blueprint](https://dev.epicgames.com/documentation/en-us/unreal-engine/coding-in-unreal-engine-blueprint-vs-cplusplus)
- [Primeros pasos de programación](https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-cpp-quick-start)

## Publicación

El proyecto conserva la configuración de Sites en `.openai/hosting.json`. `npm run build` prepara el Worker y los recursos estáticos. El desarrollo local sigue funcionando de forma independiente.

Versión privada: [C++ visual](https://cpp-visual-unreal.seradox30.chatgpt.site). Si cambias de dominio, actualiza `metadataBase` en `app/layout.tsx` para que la imagen de vista previa apunte al origen correcto.
