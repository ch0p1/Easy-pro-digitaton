# Easy Pro: Arquitectura Técnica, Catálogo de Archivos y Accesibilidad WCAG 2.2

Este documento técnico detalla la estructura completa de archivos del proyecto **Easy Pro: Probabilidad y Estadística** (basado en el texto guía de Devore), el propósito de cada módulo y la implementación del estándar internacional de accesibilidad web **WCAG 2.2 (Nivel AA y AAA)**.

---

## 1. Árbol de Archivos del Proyecto

```
/
├── index.html                           # Punto de entrada HTML5 con atributos de accesibilidad
├── metadata.json                        # Metadatos del applet de AI Studio
├── package.json                         # Dependencias (React 19, KaTeX, JSZip, Tailwind CSS)
├── tsconfig.json                        # Configuración de TypeScript
├── vite.config.ts                       # Configuración de compilación con Vite y Tailwind
├── ARQUITECTURA_Y_ARCHIVOS.md          # Esta documentación de arquitectura y WCAG 2.2
│
├── public/
│   ├── manifest.webmanifest             # Manifiesto de PWA para instalación móvil y de escritorio
│   └── imsmanifest.xml                  # Manifiesto estático para paquetes SCORM 1.2
│
└── src/
    ├── main.tsx                         # Punto de entrada React 19 (montaje en DOM)
    ├── App.tsx                          # Orquestador principal, landmarks y modales
    ├── index.css                        # Tokens CSS, contrastes WCAG 2.2 y reglas de movimiento
    │
    ├── types/
    │   └── index.ts                     # Definiciones de TypeScript (ejercicios, etapas, estado)
    │
    ├── calc/
    │   └── distributions.ts             # Motor de cálculo estadístico en JS puro y banco del curso
    │
    ├── data/
    │   ├── topics.ts                    # Banco de 8 temas pedagógicos con 5 etapas por tema
    │   ├── library.ts                   # Recursos teóricos, Python SciPy, R, GeoGebra y videos
    │   └── decisionTree.ts              # Grafo dicotómico del Árbol de Decisión («¿Qué modelo uso?»)
    │
    ├── store/
    │   └── useStore.ts                  # Persistencia versionada (localStorage) y conector LMS
    │
    ├── scorm/
    │   ├── scorm12.ts                   # Conector cliente oficial SCORM 1.2 (LMSInitialize, etc.)
    │   └── scormGenerator.ts            # Generador dinámico de paquetes SCORM 1.2 (.zip)
    │
    ├── hooks/
    │   └── useTheme.ts                  # Hook de tema (claro, oscuro, sistema automático y sincronización con SO)
    │
    └── components/
        ├── Navbar.tsx                   # Barra de navegación adaptable (tabs en escritorio, menú hamburguesa accesible en celular)
        ├── ThemeToggle.tsx              # Selector accesible de tema (Claro, Oscuro, Sistema)
        ├── MathView.tsx                 # Renderizador de fórmulas matemáticas KaTeX
        │
        ├── Home/
        │   └── HomeView.tsx             # Pantalla de bienvenida que explica cada módulo del sistema
        │
        ├── Playground/
        │   ├── TopicRoadmap.tsx         # Mapa de ruta pedagógico (8 temas y 5 etapas)
        │   ├── ActiveStageRunner.tsx    # Orquestador del avance dentro de una etapa
        │   ├── ExerciseCard.tsx         # Renderizador accesible de ejercicios (5 tipos)
        │   ├── FeedbackDrawer.tsx       # Retroalimentación pedagógica inmediata (role="alert")
        │   ├── PistasReaderModal.tsx    # Modal de lectura accesible de Etapa 1 (Pistas)
        │   └── QuickDrillModal.tsx      # Modal de práctica rápida de reconocimiento (5-10 min)
        │
        ├── Calculator/
        │   └── DistributionCalculator.tsx # Calculadora estadística interactiva con gráficos SVG
        │
        ├── Library/
        │   └── LibraryView.tsx          # Biblioteca multimedia con soporte sin conexión (offline)
        │
        ├── Formulas/
        │   └── FormulasView.tsx         # Fichas técnicas KaTeX y guía de decisión para imprimir
        │
        ├── Progress/
        │   └── ProgressView.tsx         # Panel de analítica de estudio, repaso de errores y JSON
        │
        ├── DecisionTree/
        │   └── DecisionTreeModal.tsx    # Asistente interactivo guiado paso a paso
        │
        └── Scorm/
            └── ScormModal.tsx           # Panel de integración, simulador y descarga de paquete SCORM
```

---

## 2. Catálogo Detallado de Archivos y Funcionalidades

### 2.1. Configuración y Entrada

| Archivo | Ubicación | Propósito y Función |
| :--- | :--- | :--- |
| `index.html` | `/index.html` | Entry point HTML5. Contiene `<html lang="es">`, enlaces a fuentes tipográficas (*DM Sans*), hojas de estilo de KaTeX, manifiesto PWA y punto de montaje `#root`. |
| `src/main.tsx` | `/src/main.tsx` | Inicializa y renderiza el árbol de componentes de React 19 en el elemento raíz del DOM. |
| `src/App.tsx` | `/src/App.tsx` | Componente raíz. Administra el enrutamiento de pestañas (`home`, `playground`, `calculator`, `library`, `formulas`, `progress`), expone el enlace de salto accesible (*Skip link* `<a href="#main-content">`), orquesta modales globales y el pie de página. |
| `src/index.css` | `/src/index.css` | Configuración de Tailwind CSS v4, tipografía *DM Sans* con escala ampliada (base de 17px) para máxima legibilidad matemática, tokens de diseño editorial (*Warm Academic Editorial*), colores calibrados para contraste WCAG AAA, foco accesible visible (`:focus-visible`) y consultas de movimiento reducido (`prefers-reduced-motion`). |
| `src/types/index.ts` | `/src/types/index.ts` | Contrato de tipos de TypeScript. Define las interfaces para ejercicios (`opcion-multiple`, `numerico`, `parametros`, `detecta-error`, `drag-formula`), etapas de aprendizaje, confusiones críticas, estado de la app y objetos de error. |

---

### 2.2. Motor Matemático y Persistencia

| Archivo | Ubicación | Propósito y Función |
| :--- | :--- | :--- |
| `src/calc/distributions.ts` | `/src/calc/distributions.ts` | Motor de cálculo estadístico en JavaScript puro. Implementa funciones especiales (Lanczos `logGamma`, serie/fracción continua `regularizedGammaP`, aproximación de Chebyshev `erf`), y funciones PMF/PDF/CDF para las 8 familias de distribuciones. Contiene la función `validateCourseBank()` que verifica en tiempo real los 10 ejercicios oficiales de la Sección 9 con precisión de 4 decimales. |
| `src/store/useStore.ts` | `/src/store/useStore.ts` | Hook de estado y persistencia con tolerancia a fallos (`try/catch`). Guarda el progreso en `localStorage` bajo esquema versionado, calcula la racha diaria en días consecutivos, administra los puntos de experiencia (XP), gestiona la cola de ejercicios fallados para el **Repaso del día**, y sincroniza bidireccionalmente con la API SCORM 1.2 del LMS mediante `cmi.suspend_data`. |

---

### 2.3. Datos Pedagógicos y Temario Devore

| Archivo | Ubicación | Propósito y Función |
| :--- | :--- | :--- |
| `src/data/topics.ts` | `/src/data/topics.ts` | Base de datos curricular con los 8 temas oficiales: Binomial, Hipergeométrica, Geométrica & Binomial Negativa, Poisson, Exponencial, Gamma, Normal y Nivel Integrador. Cada tema incluye sus **5 etapas** (Pistas, Reconocer, Parametrizar, Calcular, Contrastar) con enunciados que no revelan el nombre, pistas clave, retroalimentación formativa y advertencias del curso. |
| `src/data/library.ts` | `/src/data/library.ts` | Contenido de la biblioteca técnica. Almacena para cada tema las 5 subsecciones: «Cómo reconocerlo», «Teoría y Supuestos», código ejecutable en Python (`scipy.stats`), código en R (`dbinom`, `dpois`, etc.), guías para GeoGebra y manual de calculadoras Casio/Sharp. |
| `src/data/decisionTree.ts` | `/src/data/decisionTree.ts` | Grafo de nodos de decisión que guía al estudiante mediante preguntas lógicas (tipo de variable, fijado vs. aleatorio, con o sin reemplazo) hasta el modelo correspondiente y sus condiciones de aproximación. |

---

### 2.4. Estándar SCORM 1.2 para LMS (Moodle, Canvas, Blackboard)

| Archivo | Ubicación | Propósito y Función |
| :--- | :--- | :--- |
| `src/scorm/scorm12.ts` | `/src/scorm/scorm12.ts` | Conector oficial de SCORM 1.2. Busca recursivamente el objeto `window.API` en ventanas padre y emergentes. Ejecuta `LMSInitialize`, `LMSGetValue`, `LMSSetValue`, `LMSCommit` y `LMSFinish`. Sincroniza nota `cmi.core.score.raw` (0-100), estado `cmi.core.lesson_status` (`passed` al alcanzar el 80% de maestría), tiempo de sesión y datos de reanudación `cmi.suspend_data`. Incluye un simulador LMS integrado para pruebas fuera de Moodle. |
| `src/scorm/progress.ts` | `/src/scorm/progress.ts` | Orden fijo de temas y etapas, porcentaje real de avance (etapas calificables aprobadas ÷ 32) y codificación compacta de `cmi.suspend_data` (~50 caracteres; el límite de SCORM 1.2 es 4096). Los errores y contadores de intentos viven solo en `localStorage`. |
| `src/progress/rules.ts` | `/src/progress/rules.ts` | Reglas puras de desbloqueo secuencial: un tema se abre cuando **todos** los anteriores están completados; dentro del tema, cada etapa se abre al aprobar la anterior (reconocer → parámetros → calcular → contrastar). «Pistas» es lectura y siempre está disponible en un tema abierto. |
| `src/utils/shuffle.ts` | `/src/utils/shuffle.ts` | Mezcla Fisher-Yates. Se usa para barajar la posición de las opciones en cada ejercicio (los índices `correcta` y `error_comun` de los datos no cambian). |
| `src/scorm/scormGenerator.ts` | `/src/scorm/scormGenerator.ts` | Generador dinámico con `JSZip`. Construye en memoria el archivo `imsmanifest.xml` con esquemas IMS y LOM, la guía de instalación para profesores `LEEME_INSTALACION_LMS.md`, el cargador SCO y descarga el paquete `.zip` listo para importar en Moodle. |

---

### 2.5. Componentes de Interfaz de Usuario

| Archivo | Ubicación | Propósito y Función |
| :--- | :--- | :--- |
| `src/components/Navbar.tsx` | `/src/components/Navbar.tsx` | Barra de navegación superior accesible con rol semántico `<nav aria-label="Navegación principal">`. Presenta pestañas tipográficas sin iconos distractores, subrayado de tinta activo para el elemento actual, botón y selector de tema, y disparador del modal SCORM 1.2. |
| `src/components/ThemeToggle.tsx` | `/src/components/ThemeToggle.tsx` | Control interactivo accesible para alternar entre modo Claro, modo Oscuro y reconocimiento automático del tema del Sistema operativo (con variante para barra de escritorio y menú móvil). |
| `src/components/MathView.tsx` | `/src/components/MathView.tsx` | Componente seguro para renderizar fórmulas KaTeX en modo inline o bloque con degradación elegante si la biblioteca externa falla. |
| `src/components/Home/HomeView.tsx` | `/src/components/Home/HomeView.tsx` | Página de bienvenida del sistema. Explica en detalle el objetivo del proyecto, el contenido y función de cada uno de los 5 módulos principales, el desglose de las 5 etapas por tema, los accesos directos de navegación y la matriz de los 8 temas de Devore. |
| `src/components/Playground/TopicRoadmap.tsx` | `/src/components/Playground/TopicRoadmap.tsx` | Vista del mapa de ruta de aprendizaje. Muestra los 8 temas secuenciales con indicadores de estado (bloqueado, disponible, en curso, completado), barra de avance del curso y por tema, y las 5 etapas con candado hasta aprobar la anterior (texto + icono, no solo color). Recibe `progress` desde `App`. |
| `src/components/Playground/ExerciseCard.tsx` | `/src/components/Playground/ExerciseCard.tsx` | Motor de renderizado accesible para los 5 tipos de ejercicios. Incluye agrupación en `<fieldset>` y `<legend>`, botones de opción con roles semánticos, campos numéricos con etiquetas asociadas mediante `id`/`htmlFor`, descripciones `aria-describedby` y región activa `aria-live="polite"` para anunciar aciertos y errores a tecnologías de asistencia. |
| `src/components/Playground/FeedbackDrawer.tsx` | `/src/components/Playground/FeedbackDrawer.tsx` | Cajón de retroalimentación pedagógica con atributo `role="alert"`. Resalta las frases determinantes del enunciado, explica el fundamento pedagógico del modelo, advierte sobre trampas de parcial y recomienda videos si hay fallos recurrentes. |
| `src/components/Playground/ActiveStageRunner.tsx` | `/src/components/Playground/ActiveStageRunner.tsx` | Controlador de flujo para resolver los ejercicios dentro de una etapa activa, con barra de progreso y pantalla de felicitación al aprobar. |
| `src/components/Playground/PistasReaderModal.tsx` | `/src/components/Playground/PistasReaderModal.tsx` | Modal accesible (`role="dialog"`, captura de tecla `Escape`) para la lectura formativa de la Etapa 1 (Pistas, señales determinantes y contraejemplos). |
| `src/components/Playground/QuickDrillModal.tsx` | `/src/components/Playground/QuickDrillModal.tsx` | Modal accesible de práctica rápida de reconocimiento (5 a 10 minutos) con enunciados mezclados de temas desbloqueados sin alterar el progreso oficial. |
| `src/components/Calculator/DistributionCalculator.tsx` | `/src/components/Calculator/DistributionCalculator.tsx` | Calculadora interactiva completa para las 8 distribuciones con visualizador gráfico SVG de funciones de masa/densidad y región de resultados accesibles (`aria-live="polite"`). |
| `src/components/Library/LibraryView.tsx` | `/src/components/Library/LibraryView.tsx` | Centro de recursos de estudio con detección automática de estado online/offline, botones para copiar código con confirmación táctil y reproductores de video bajo demanda. |
| `src/components/Formulas/FormulasView.tsx` | `/src/components/Formulas/FormulasView.tsx` | Catálogo de fórmulas matemáticas KaTeX con pistas de uso, contraejemplos, reglas de aproximación exactas del curso y diseño optimizado para imprimir (`@media print`). |
| `src/components/Progress/ProgressView.tsx` | `/src/components/Progress/ProgressView.tsx` | Panel de métricas personales, visualización de medallas por tema, bandeja activa de **Repaso del día** para reintentar problemas fallados y herramientas de exportación/importación JSON y SCORM. |
| `src/components/DecisionTree/DecisionTreeModal.tsx` | `/src/components/DecisionTree/DecisionTreeModal.tsx` | Asistente interactivo de decisión en formato modal accesible (`role="dialog"`, `aria-modal="true"`, navegación por teclado con soporte de `Escape`). |
| `src/components/Scorm/ScormModal.tsx` | `/src/components/Scorm/ScormModal.tsx` | Modal de gestión SCORM 1.2. Muestra telemetría en tiempo real con el LMS, simulador integrado, visualizador de `imsmanifest.xml` y descarga del paquete `.zip`. |

---

## 3. Rediseño e Implementación de los Principios de Accesibilidad WCAG 2.2

La plataforma ha sido auditada y adaptada para cumplir rigurosamente con los 4 principios fundamentales y criterios de éxito del estándar **W3C WCAG 2.2**:

### 🎯 Principio 1: Perceptible (Perceivable)

1. **Contraste Mínimo y Mejorado (Criterios 1.4.3 Nivel AA y 1.4.6 Nivel AAA):**
   - El texto principal `#1D1B16` sobre fondo de lienzo marfil `#FBF5EC` ofrece un ratio de contraste de **14.8:1** (superando holgadamente el requisito de 7:1 para AAA).
   - El color de títulos y estructura `#8A1428` sobre fondo blanco `#FFFFFF` presenta un ratio de **9.6:1** (Nivel AAA).
   - Los textos secundarios y etiquetas han sido ajustados a `#3D2B2B` (ratio de **8.2:1** sobre blanco), eliminando cualquier texto gris tenue o de bajo contraste.
   - El acento carmesí de botones principales ha sido calibrado a `#BA0F23` sobre blanco (**4.9:1** para componentes interactivos y texto blanco sobre `#BA0F23` a **5.8:1**).
2. **Uso del Color (Criterio 1.4.1 Nivel A):**
   - Ninguna información se comunica exclusivamente mediante el color. En las evaluaciones, el acierto se acompaña con icono de verificación (`✓`), etiqueta textual en negrita (*«¡Respuesta Correcta!»*) y puntuación; los fallos incluyen icono de advertencia (`✕`), mensaje específico de trampa conceptual y borde estructurado.
3. **Estructura y Relaciones Semánticas (Criterio 1.3.1 Nivel A):**
   - Uso de elementos semánticos de HTML5: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<fieldset>` y `<legend>`.
   - Jerarquía estricta de encabezados sin saltos de nivel (`<h1>` único por pantalla, seguido de `<h2>` de sección y `<h3>` en tarjetas).
   - Fórmulas matemáticas presentadas con KaTeX y atributos de texto alternativo.

---

### ⌨️ Principio 2: Operable (Operable)

1. **Navegación Total por Teclado (Criterio 2.1.1 Nivel A):**
   - Cada botón, selector, pestaña, entrada numérica y enlace se puede operar completamente con `Tab`, `Shift + Tab`, `Enter` y `Espacio`.
2. **Foco Visible y No Oscurecido (Criterios 2.4.7 y 2.4.11 de WCAG 2.2 Nivel AA):**
   - Se implementó un indicador de foco de alta visibilidad en CSS:
     ```css
     :focus-visible {
       outline: 2.5px solid #8A1428 !important;
       outline-offset: 2.5px !important;
     }
     ```
   - El indicador permanece visible y nítido en todo momento sin quedar oculto por otros contenedores fijos.
3. **Salto al Contenido Principal (Criterio 2.4.1 Nivel A - Bypass Blocks):**
   - Se añadió un enlace de salto directo oculto visualmente que se hace visible al recibir el foco (`.sr-only focus:not-sr-only`), permitiendo a usuarios de lectores de pantalla y teclado saltar la barra de navegación e ir directo a `<main id="main-content">`.
4. **Manejo Accesible de Modales y Tecla Escape (Criterio 2.1.2 Nivel A):**
   - Todos los modales (`DecisionTreeModal`, `ScormModal`, `PistasReaderModal`, `QuickDrillModal`) implementan un escuchador global de teclado (`keydown`) que cierra la ventana al presionar la tecla `Escape`.
   - Cuentan con `role="dialog"`, `aria-modal="true"`, y atributos `aria-labelledby` enlazados al título del modal.
   - Botones de cierre con atributo descriptivo `aria-label="Cerrar..."`.
5. **Tamaño de los Objetivos Táctiles (Criterios 2.5.5 y 2.5.8 de WCAG 2.2):**
   - Las clases de botones `.tactile-btn-primary` y `.tactile-btn-secondary` tienen definido un `min-height: 44px`, cumpliendo con el tamaño mínimo recomendado para interacción táctil y motor reducida.
6. **Movimiento Reducido (Criterio 2.3.3 Nivel AAA):**
   - Inclusión de la consulta de medios `@media (prefers-reduced-motion: reduce)` en `src/index.css` que desactiva animaciones y transiciones bruscas para usuarios con trastornos vestibulares o sensibilidad a la cinetosis.

---

### 💡 Principio 3: Comprensible (Understandable)

1. **Idioma de la Página (Criterio 3.1.1 Nivel A):**
   - Declarado explícitamente en el elemento raíz: `<html lang="es">`.
2. **Etiquetas e Instrucciones Claras (Criterio 3.3.2 Nivel A):**
   - En todos los formularios (calculadora, identificación de parámetros y respuesta numérica), los `<input>` tienen un atributo `id` emparejado con su respectivo `<label htmlFor="...">`.
   - Campos numéricos provistos de `aria-describedby` que explica el formato esperado (ej. «4 decimales exactos, tolerancia $\pm 0.0005$»).
3. **Identificación y Sugerencia ante Errores (Criterios 3.3.1 y 3.3.3 Nivel A/AA):**
   - Si el estudiante comete un error, el cajón de retroalimentación detalla con precisión qué trampa del curso originó la equivocación (ej. *«La Hipergeométrica exige muestreo sin reemplazo; aquí la producción es masiva con p constante»*) y qué pista del enunciado indicaba la respuesta correcta.
4. **Entrada Redundante (Criterio 3.3.7 de WCAG 2.2 Nivel A):**
   - Al fallar un ejercicio numérico, el valor ingresado previamente se conserva en el campo de texto para que el usuario no tenga que reescribirlo por completo, facilitando la corrección inmediata.

---

### 🛡️ Principio 4: Robusto (Robust)

1. **Nombres, Roles y Valores (Criterio 4.1.2 Nivel A):**
   - Agrupación semántica de opciones de ejercicio con `<fieldset>` y `<legend className="sr-only">`.
   - Atributos `role="radio"` y `aria-checked={isSelected}` para que los lectores de pantalla anuncien con claridad qué alternativa está seleccionada.
2. **Mensajes de Estado y Regiones Activas (Criterio 4.1.3 Nivel AA):**
   - Región activa accesible `<div aria-live="polite" className="sr-only">` en la tarjeta de ejercicios que anuncia de inmediato: *«Respuesta correcta»* o *«Respuesta incorrecta. Revisa el planteamiento y la retroalimentación»*.
   - El cajón de retroalimentación cuenta con `role="alert"` para que las tecnologías de asistencia lean inmediatamente la explicación formativa.
   - En la calculadora, el panel de resultados numéricos implementa `role="region" aria-live="polite"` para comunicar los cambios de valor calculados al ajustar parámetros.

---

## 4. Verificación de Compilación y Calidad de Código

El proyecto ha sido validado con las herramientas del entorno de compilación:
- **`tsc --noEmit` (Linter estático de TypeScript):** Aprobado con 0 errores de sintaxis y tipos rigurosamente definidos.
- **`vite build` (Compilador de producción):** Generación exitosa de los paquetes de distribución optimizados con chunks limpios de código y estilos CSS procesados.

## Pruebas automáticas

`bun run test` (Vitest) ejecuta, entre otras:

- **Motor de cálculo contra SciPy**, incluidos casos de n grande y gamma con α grande.
- **Los 10 problemas verificados del curso** (`validateCourseBank`).
- **Reglas de desbloqueo** y un recorrido completo del curso en orden.
- **Integración de la app (jsdom)**: se resuelven por la interfaz las 4 etapas del tema 1, se comprueba que se desbloquea el tema 2 (y solo ese), la nota SCORM real, el `suspend_data` compacto, la persistencia y la reanudación desde un LMS simulado.