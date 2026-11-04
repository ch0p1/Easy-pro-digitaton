# Easy Pro: documentación técnica y pedagógica (v2)

PWA de práctica para el curso de Probabilidad y Estadística. Versión corregida del 3 de noviembre de 2026: incorpora el enfoque pedagógico, el temario real del curso, las convenciones del profesor y las decisiones técnicas que faltaban.

## 1. Objetivo y problema

**Problema.** Los estudiantes memorizan fórmulas, pero no saben **cuál distribución aplicar** a un enunciado.

**Objetivo.** Entrenar la decisión «¿qué modelo uso y por qué?» con práctica corta, retroalimentación inmediata y mecánica tipo Duolingo, apoyada por una biblioteca de videos.

**Usuario.** Estudiantes de un curso con temario fijo (texto guía: Devore, *Probabilidad y Estadística para Ingeniería y Ciencias*). Uso previsto: sesiones de 5 a 10 minutos, en casa y antes de parciales.

**Metas propuestas (a ajustar tras un piloto).**

- 80 % o más de aciertos en el Nivel Integrador al terminar el temario.
- Mejora entre prueba previa y posterior de cada tema.
- Menos errores en las confusiones críticas (sección 4).

## 2. Principio de diseño

El centro de la app es **reconocer la situación**, no armar la fórmula.

| Antes | Ahora |
| --- | --- |
| Cada tema se aprende aislado | Cada tema se aprende contrastado con el que se confunde con él |
| Ejercicio central: arrastrar fragmentos de fórmula | Ejercicio central: leer un enunciado y decidir el modelo |
| Feedback: verde o rojo | Feedback: qué pista del enunciado indicaba la respuesta |

El examen del curso permite tablas estadísticas y calculadora, así que la app enseña a **plantear** el problema y deja el cálculo a una calculadora integrada.

## 3. Alcance y temario

| # | Tema | Contraste principal |
| --- | --- | --- |
| 1 | Binomial | Base |
| 2 | Hipergeométrica | Binomial (con o sin reemplazo) |
| 3 | Geométrica y Binomial negativa | Binomial (n fijo o hasta el éxito) |
| 4 | Poisson | Binomial (aproximación) |
| 5 | Exponencial | Poisson (tiempo o conteo) |
| 6 | Gamma | Exponencial (primer evento o α-ésimo) |
| 7 | Normal | Aproximaciones y estandarización |
| 8 | Nivel Integrador | Los siete temas mezclados |

Temas **opcionales**, pendientes de confirmar con el profesor: Uniforme continua, Weibull, Triangular. El nombre «Quasso» del documento original no aparece en ninguna fuente del curso; el tema se llama simplemente **Poisson**.

### Notación del curso (obligatoria en toda la app)

| Distribución | Notación | Variable | Función de probabilidad o densidad | E(X) | V(X) |
| --- | --- | --- | --- | --- | --- |
| Binomial | b(x; n, p) | éxitos en n ensayos fijos | C(n,x) · p^x · (1−p)^(n−x) | np | np(1−p) |
| Hipergeométrica | h(x; n, M, N) | éxitos en muestra de n sin reemplazo; N población, M éxitos en la población | C(M,x) · C(N−M, n−x) / C(N,n) | n·M/N | ((N−n)/(N−1)) · n · (M/N) · (1−M/N) |
| Geométrica | g(x; p) | **ensayos** hasta el primer éxito, x = 1, 2, … | (1−p)^(x−1) · p | 1/p | (1−p)/p² |
| Binomial negativa | nb(x; r, p) | **fallas** antes del r-ésimo éxito, x = 0, 1, … | C(x+r−1, r−1) · p^r · (1−p)^x | r(1−p)/p | r(1−p)/p² |
| Poisson | p(x; μ), con μ = λt | ocurrencias en un intervalo | e^(−μ) · μ^x / x! | μ | μ |
| Exponencial | Exp(λ), β = 1/λ | tiempo entre eventos de Poisson | λ · e^(−λx); F(x) = 1 − e^(−λx) | 1/λ | 1/λ² |
| Gamma | Gama(α, β) | tiempo hasta el α-ésimo evento de Poisson | x^(α−1) · e^(−x/β) / (β^α · Γ(α)) | αβ | αβ² |
| Normal | N(μ, σ²) | variable continua simétrica | densidad normal; se estandariza con Z = (X − μ)/σ | μ | σ² |

**Advertencias de convención.**

- La Geométrica cuenta **ensayos** y la Binomial negativa cuenta **fallas**. No son equivalentes directos: ensayos de la Geométrica = fallas de NB(r=1) + 1. La app incluye un ejercicio de conversión.
- Gamma usa **β como escala**, no como tasa. Con tasa λ, β = 1/λ.

## 4. Criterios de decisión

### Árbol de decisión

| Pregunta clave | Modelo |
| --- | --- |
| ¿Cuento éxitos en n ensayos fijos, independientes, con p constante? | Binomial |
| ¿Igual, pero sin reemplazo en una población finita? | Hipergeométrica |
| ¿Cuento ensayos hasta el primer éxito? | Geométrica |
| ¿Cuento fallas (o ensayos) hasta el r-ésimo éxito? | Binomial negativa |
| ¿Cuento eventos en un intervalo de tiempo, área o volumen con tasa λ? | Poisson |
| ¿Mido el tiempo entre eventos consecutivos de Poisson? | Exponencial |
| ¿Mido el tiempo hasta presenciar α eventos de Poisson? | Gamma |
| ¿Variable continua simétrica, con media y desviación conocidas? | Normal |

### Aproximaciones (condiciones exactas del curso)

| Aproximación | Condición | Parámetros |
| --- | --- | --- |
| Hipergeométrica a Binomial | n/N ≤ 0.05 | p = M/N |
| Binomial a Poisson | n ≥ 100, p ≤ 0.01 y np ≤ 20 (regla simplificada: n ≥ 50 y np < 5) | μ = np |
| Binomial a Normal | np ≥ 10 y n(1−p) ≥ 10 | μ = np, σ² = np(1−p), corrección por continuidad ±0.5 |

Los ejercicios de aproximación se escriben de modo que cumplan **ambas** reglas de Binomial a Poisson, hasta que el profesor confirme cuál usa.

### Confusiones críticas (cada una tiene ejercicios dedicados)

1. Binomial vs. Hipergeométrica (con o sin reemplazo).
2. Binomial vs. Geométrica vs. Binomial negativa (n fijo o hasta el éxito; ensayos o fallas).
3. Poisson vs. Exponencial (cuántos eventos o cuánto tiempo).
4. Exponencial vs. Gamma (primer evento o α-ésimo).
5. Binomial vs. Normal vs. Poisson (aproximaciones).

### Errores frecuentes señalados en el material del profesor

- No escalar la tasa: usar λ por hora cuando el intervalo es de 30 minutos (se requiere μ = λt).
- Tratar f(x) como probabilidad en variables continuas (P(X = x) = 0).
- Calcular V(X) sin restar μ²: V(X) = E(X²) − μ².

Cada uno se convierte en un ejercicio de tipo «detecta el error».

## 5. Estructura de cada tema (5 etapas)

| Etapa | Qué hace el estudiante | Tipo de ejercicio |
| --- | --- | --- |
| 1. Pistas | Lee las señales del modelo y su contraejemplo | Lectura |
| 2. Reconocer | Elige la distribución a partir de un enunciado | Opción múltiple |
| 3. Parametrizar | Identifica parámetros (n, p, N, M, λ, t…) | Parámetros |
| 4. Calcular | Resuelve el problema numérico | Numérico y drag & drop de fórmula |
| 5. Contrastar | Enunciados mezclados con el tema anterior | Opción múltiple y detecta el error |

Un tema queda **completado** al aprobar las etapas 2 a 5. Se aprueba una etapa con todos sus ejercicios correctos; los reintentos son ilimitados y no hay sistema de vidas.

## 6. Progresión

- **Dentro del tema:** etapas secuenciales.
- **Entre temas:** secuencial, como en la versión original. Un tema se desbloquea cuando el anterior está completado en el almacenamiento local.
- **Prueba de nivel opcional** por tema: permite saltarlo si se acierta un mínimo de ejercicios de las etapas 2 y 4.
- **Nivel Integrador:** 15 a 20 enunciados mezclados de todos los temas. Es la validación real del objetivo.
- **Entrenamiento de decisión:** modo siempre abierto con enunciados aleatorios de los temas ya desbloqueados. No altera el progreso.

## 7. Módulos

### A. Playground

- Mapa de ruta con los siete temas y el Integrador; cada tema se expande en sus cinco etapas.
- Tipos de ejercicio: `opcion-multiple`, `numerico`, `drag-formula`, `parametros`, `detecta-error`.
- Feedback inmediato con explicación y resaltado de las frases del enunciado que determinaban la respuesta. Cada opción incorrecta puede llevar un mensaje específico.
- Tras dos fallos seguidos en una etapa, se sugiere el video correspondiente de la Biblioteca.
- Drag & drop con alternativa táctil y de teclado: tocar para seleccionar el fragmento y tocar la zona de destino.
- Se registran los errores por confusión crítica (por ejemplo, «confunde Poisson con Exponencial») para alimentar el repaso.

### B. Biblioteca

- Cinco videos por tema: Teoría, Python, R, GeoGebra y Calculadora. Se agrega una sección **«Cómo reconocerlo»**.
- Los iframes se cargan **solo al abrir** la pestaña de cada video, para no cargar 35 iframes a la vez.
- Gestión sin conexión: `navigator.onLine` más los eventos `online` y `offline`. Sin conexión, se ocultan los iframes y se muestra un banner de advertencia.
- Cada tema incluye un resumen en texto que funciona sin conexión.

### C. Fórmulas

- Catálogo de fórmulas renderizadas con KaTeX.
- Cada ficha incluye: fórmula, significado de los parámetros, **cuándo usarla** (pistas), contraejemplo, esperanza y varianza.
- Descarga en PDF como **guía de decisión**, no solo como compendio de fórmulas. Ver riesgo de exportación en la sección 13.

### D. Calculadora

- Por distribución: P(X = x), P(X ≤ x), P(X ≥ x), media y varianza.
- Normal con estandarización y percentiles; Gamma con función gamma incompleta.
- Implementada en JavaScript puro (log-gamma, error function, serie de la gamma incompleta). Se valida con los ejercicios verificados de la sección 9 como pruebas automáticas.

### E. Progreso y motivación

- XP por ejercicio, racha diaria y medalla por tema completado. No hay vidas.
- **Repaso del día:** reinyecta los ejercicios fallados, con fecha.
- Exportar e importar el progreso como archivo JSON.

## 8. Modelo de datos

### Ejercicio (los ejercicios son datos, no HTML)

```js
{
  id: 'hiper-rec-03',
  tema: 'hipergeometrica',
  etapa: 'reconocer', // pistas | reconocer | parametrizar | calcular | contrastar
  tipo: 'opcion-multiple', // opcion-multiple | numerico | drag-formula | parametros | detecta-error
  enunciado: 'De un lote de 20 piezas con 4 defectuosas se extraen 5 sin reemplazo. ¿Qué modelo describe el número de defectuosas?',
  opciones: ['Binomial', 'Hipergeométrica', 'Poisson', 'Normal'],
  correcta: 1,
  pistas_clave: ['población finita', 'sin reemplazo'],
  explicacion: 'Sin reemplazo, p cambia en cada extracción: no se cumple la independencia de la Binomial.',
  error_comun: { 0: 'La Binomial exige ensayos independientes con p constante.' },
  confusion: 'binomial-vs-hipergeometrica',
  video_ref: { tema: 'hipergeometrica', tipo: 'teoria' },
  origen: 'original' // original | curso
}
```

Para ejercicios numéricos se agrega `generador: () => ({ enunciado, respuesta })`, con valores aleatorios y respuesta calculada por la calculadora de la app. Así los problemas no se memorizan.

### Estado local (versionado)

```js
{
  version: 1,
  temas: {
    binomial: {
      completado: false,
      etapas: { reconocer: { aprobada: false, intentos: 0, aciertos: 0 } }
    }
  },
  errores: [{ ejercicioId: 'poisson-cal-02', fecha: '2026-11-03', confusion: 'poisson-vs-exponencial' }],
  xp: 0,
  racha: { dias: 0, ultimaFecha: null }
}
```

Toda lectura y escritura de `localStorage` va dentro de `try/catch`. Si el almacenamiento no está disponible, la app funciona en memoria y lo avisa. Al cambiar `version`, se ejecuta una migración.

### Validación de respuestas numéricas

- Probabilidades con 4 decimales (convención del curso); valores z y parámetros con 2 decimales.
- Tolerancia: ±0.0005 en cálculos exactos; ±0.002 cuando el método esperado usa tablas (Normal, Gamma).

## 9. Banco inicial de ejercicios del curso

Los cálculos de los diez problemas fueron verificados de nuevo. Los enunciados deben contrastarse con el PDF original antes de publicarlos como «ejercicios del curso» (`origen: 'curso'`).

| # | Tema | Datos | Se pide | Respuesta |
| --- | --- | --- | --- | --- |
| 1 | Exponencial | media 3 min (λ = 1/3) | P(X ≤ 5) | 0.8111 |
| 2 | Binomial | n = 6, p = 0.75 | P(X = 4) | 0.2966 |
| 3 | Hipergeométrica | N = 20, M = 5, n = 4 | P(X = 2) | 0.2167 |
| 4 | Poisson | λ = 2 por metro, 2 metros (μ = 4) | P(X = 3) | 0.1954 |
| 5 | Normal | μ = 10.0, σ = 0.03 | P(9.97 ≤ X ≤ 10.06) | 0.8185 |
| 6 | Binomial a Normal | n = 100, p = 0.25, corrección ±0.5 | P(X ≥ 30) | 0.1492 |
| 7 | Geométrica | p = 0.20 | primer éxito en el 5.º ensayo | 0.0819 |
| 8 | Binomial negativa | r = 4, p = 0.60 | 3 fallas antes del 4.º éxito | 0.1659 |
| 9 | Gamma | λ = 0.5 (α = 3, β = 2) | P(X > 6) | 0.4232 |
| 10 | Binomial a Poisson | n = 2000, p = 0.002 (μ = 4) | P(X = 3) | 0.1954 |

**Notas de calidad de datos.**

- El problema del transistor (f(x) = 20 000 / x³, x > 100) queda **excluido** hasta confirmar las unidades en el PDF. Los resultados 0.96, 0.04 y E = 200 solo son válidos si X está en horas; la afirmación «cientos de horas» es incompatible con ellos.
- En el problema de los malos hábitos de los estudiantes (estadística descriptiva), la guía generada daba E = 0.868; el valor correcto es **E = 1.268**, con V ≈ 0.8682 y CV ≈ 0.735. No forma parte del banco de distribuciones.
- Estos problemas nombran la distribución o la insinúan. Los ejercicios de las etapas Reconocer y Contrastar se redactan como originales, sin nombrar el modelo.

## 10. Stack y arquitectura técnica

- **Frontend:** HTML5, CSS3 y JavaScript puro (módulos ES). Sin frameworks.
- **Persistencia:** `localStorage`, con exportación e importación en JSON.
- **Matemática:** KaTeX **alojado localmente** (no solo por CDN, porque debe funcionar sin conexión).
- **PDF:** jsPDF, también local.
- **PWA real:** `manifest.webmanifest` y Service Worker que almacena en caché la aplicación, KaTeX y jsPDF.
- **Hosting:** estático con HTTPS (requisito de los Service Workers).

```
/index.html
/manifest.webmanifest
/sw.js
/css/        tokens.css, app.css
/js/         app.js, router.js, store.js
/js/engine/  render de ejercicios, validación, feedback
/js/calc/    distribuciones y pruebas
/data/temas/ binomial.js, hipergeometrica.js, ...
/vendor/     katex/, jspdf/
```

El código base original está en un solo archivo. Con siete temas y cinco tipos de ejercicio se vuelve inmanejable, por lo que la **Fase 0** lo separa en módulos. Agregar un tema pasa a ser agregar datos, no código.

## 11. Identidad visual y accesibilidad

| Uso | Color |
| --- | --- |
| Fondo | #0A0A0A |
| Texto | #FFFFFF |
| Paneles secundarios | #1A1A1A |
| Acento primario (botones, UI) | #C0392B |
| Éxito | #2ECC71 |

- El rojo carmesí del acento primario y el rojo del feedback negativo se parecen. El feedback negativo debe distinguirse por **icono (✕), texto y animación**, no solo por color, sobre un panel de fondo rojo oscuro.
- El carmesí sobre fondo negro tiene bajo contraste para texto pequeño. Se usa en botones con texto blanco y en elementos grandes, no en texto de cuerpo.
- Todo estado correcto o incorrecto lleva icono y texto (también para daltonismo).
- Objetivos táctiles de al menos 44 px y navegación completa por teclado.

## 12. Hoja de ruta

| Fase | Contenido | Criterio de aceptación |
| --- | --- | --- |
| 0 | Refactor modular, ejercicios como datos, almacén versionado, motor de ejercicios | El nivel 1 actual funciona igual sobre la nueva estructura |
| 1 | Binomial migrado a 5 etapas; calculadora base y pruebas | Las pruebas reproducen las respuestas de la sección 9 |
| 2 | Hipergeométrica, Geométrica y Binomial negativa, Poisson | Cada tema tiene sus 5 etapas y ejercicios de contraste |
| 3 | Exponencial, Gamma, Normal, Nivel Integrador, Entrenamiento | El Integrador mezcla los 7 temas |
| 4 | PWA sin conexión, XP, racha, repaso, exportar e importar | La app abre y funciona en modo avión |
| 5 | Biblioteca completa, PDF, piloto con estudiantes | Datos de la prueba previa y posterior de al menos un grupo |

## 13. Instrucciones para la IA de desarrollo (Stitch)

Actúa como desarrollador frontend senior. Trabajas sobre la PWA «Easy Pro». Reglas:

1. Stack estricto: JavaScript puro (módulos ES), HTML5, CSS3, KaTeX y jsPDF locales. Sin frameworks y sin backend.
2. Respeta la notación de la sección 3 en todos los textos, fórmulas y ejercicios (Geométrica en ensayos, Binomial negativa en fallas, Gamma con β escala).
3. Los ejercicios son **datos** con el esquema de la sección 8. No escribas HTML a mano por ejercicio.
4. Cada tema sigue las 5 etapas de la sección 5 y completa cuando se aprueban las etapas 2 a 5.
5. Los enunciados de Reconocer no nombran la distribución. Incluye `pistas_clave`, `explicacion` y `error_comun` en cada ejercicio.
6. Todo cálculo se hace con `/js/calc/` y debe reproducir la sección 9. Si no coincide, no se publica.
7. Respeta la identidad visual y las reglas de accesibilidad de la sección 11.
8. Sin sistema de vidas. Reintentos ilimitados. Los datos viven en `localStorage` con `try/catch` y versión.
9. Trabaja por fases (sección 12). Entrega una fase completa antes de pasar a la siguiente.
10. Si un dato del curso falta o es ambiguo, indícalo y no lo inventes.

## 14. Decisiones abiertas y riesgos

| Tema | Estado |
| --- | --- |
| Uniforme, Weibull y Triangular | Confirmar con el profesor si se evalúan |
| Regla de Binomial a Poisson | Dos reglas en el material; confirmar cuál se usa |
| Distribución de temas por parcial | No encontrada en las fuentes |
| Transistor (unidades) | Revisar el PDF original; excluido por ahora |
| Literalidad de los enunciados del banco | Contrastar con el PDF antes de marcarlos como del curso |
| Exportación a PDF de fórmulas KaTeX | jsPDF no renderiza KaTeX; elegir entre rasterizar con html2canvas, imágenes pregeneradas o fórmulas en texto plano |
| Videos | Quién los produce o selecciona (cinco por tema) |
| Medición del aprendizaje | Definir el grupo piloto y la prueba previa y posterior |
