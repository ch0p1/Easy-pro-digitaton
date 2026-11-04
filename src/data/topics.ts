import { TopicData } from '../types';

export const TOPICS_DATA: TopicData[] = [
  // --- 1. BINOMIAL ---
  {
    id: 'binomial',
    numero: 1,
    nombre: 'Distribución Binomial',
    subtitulo: 'Conteo de éxitos en n ensayos independientes con probabilidad constante',
    contrastePrincipal: 'Base del curso: n fijo vs. hasta el éxito; con reemplazo vs. sin reemplazo',
    notacion: 'b(x; n, p)',
    variable: 'x: número de éxitos en n ensayos fijos (x = 0, 1, 2, ..., n)',
    formula: 'C(n, x) \\cdot p^x \\cdot (1 - p)^{n - x}',
    esperanza: 'E(X) = n \\cdot p',
    varianza: 'V(X) = n \\cdot p \\cdot (1 - p)',
    advertencias: [
      'Los ensayos deben ser estrictamente independientes.',
      'La probabilidad p de éxito debe permanecer constante en cada ensayo.',
      'Si el muestreo es sin reemplazo en una población pequeña (n/N > 0.05), NO use Binomial, use Hipergeométrica.',
    ],
    etapas: [
      {
        id: 'pistas',
        titulo: 'Etapa 1: Pistas y Señales Clave',
        descripcion: 'Aprende a reconocer cuándo un enunciado describe un proceso Binomial y cuándo no.',
        tipo: 'lectura',
        ejercicios: [],
        pistasTeoria: {
          titulo: '¿Cómo identificar la Distribución Binomial?',
          senales: [
            'Se fija de antemano un número exacto de ensayos o intentos (n fijo).',
            'Cada ensayo tiene solo dos desenlaces posibles: éxito o falla.',
            'La probabilidad de éxito p no cambia entre ensayos (independencia o con reemplazo).',
            'La pregunta pide: "¿cuántos éxitos ocurren en total en esos n intentos?".',
          ],
          contraejemplo:
            'Si en lugar de fijar 10 tiros al blanco te preguntan "¿cuántos tiros necesitas hasta lograr el primer acierto?", la variable ya no es Binomial: es Geométrica.',
          formulaClave: 'P(X = x) = \\binom{n}{x} p^x (1 - p)^{n - x}, \\quad x \\in \\{0, 1, \\dots, n\\}',
        },
      },
      {
        id: 'reconocer',
        titulo: 'Etapa 2: Reconocer el Modelo',
        descripcion: 'Lee el enunciado y decide qué distribución modela el problema. ¡El texto no te dirá el nombre!',
        tipo: 'opcion-multiple',
        ejercicios: [
          {
            id: 'bin-rec-01',
            tema: 'binomial',
            etapa: 'reconocer',
            tipo: 'opcion-multiple',
            enunciado:
              'Una línea de ensamblaje produce microchips con una tasa de defecto del 4%. Un inspector selecciona al azar 15 microchips de una producción masiva de miles de unidades. ¿Qué distribución modela la cantidad de microchips defectuosos encontrados en la muestra?',
            opciones: ['Binomial', 'Hipergeométrica', 'Poisson', 'Geométrica'],
            correcta: 0,
            pistas_clave: ['15 microchips seleccionados (n fijo)', 'producción masiva (p constante = 0.04)', 'conteo de éxitos defectuosos'],
            explicacion:
              'Tenemos un tamaño de muestra fijo (n = 15), la probabilidad de defecto se mantiene constante (0.04) porque la producción es masiva (n/N < 0.05), y contamos el total de defectuosos.',
            error_comun: {
              1: 'La Hipergeométrica se usa solo cuando la población es finita y pequeña sin reemplazo (n/N > 0.05). Aquí la producción es de miles.',
              2: 'Poisson se aplica cuando se cuentan eventos en un continuo continuo de tiempo o espacio, o como aproximación con n muy grande y p muy pequeño.',
              3: 'La Geométrica cuenta intentos hasta el primer éxito, no éxitos en una muestra fija.',
            },
            confusion: 'binomial-vs-hipergeometrica',
            origen: 'original',
          },
          {
            id: 'bin-rec-02',
            tema: 'binomial',
            etapa: 'reconocer',
            tipo: 'opcion-multiple',
            enunciado:
              'Un examen de opción múltiple tiene 10 preguntas independientes, cada una con 4 alternativas y solo una correcta. Si un alumno responde todas completamente al azar, ¿qué modelo describe el número de preguntas aprobadas?',
            opciones: ['Geométrica', 'Binomial', 'Binomial Negativa', 'Hipergeométrica'],
            correcta: 1,
            pistas_clave: ['10 preguntas fijas (n = 10)', 'cada una independiente con p = 1/4 = 0.25', 'número total de aciertos'],
            explicacion:
              'El número de ensayos está fijado (n = 10), la probabilidad de acertar al azar en cada pregunta es idéntica (p = 0.25) e independiente.',
            error_comun: {
              0: 'La Geométrica respondería a: "¿cuántas preguntas debe responder hasta acertar la primera?". Aquí responde las 10.',
              2: 'La Binomial Negativa cuenta fallas hasta obtener r éxitos prefijados, no éxitos en 10 intentos fijos.',
              3: 'Las preguntas son independientes, no hay extracción sin reemplazo de una urna finita.',
            },
            confusion: 'binomial-vs-geometrica-nb',
            origen: 'original',
          },
        ],
      },
      {
        id: 'parametros',
        titulo: 'Etapa 3: Parametrizar',
        descripcion: 'Extrae con exactitud los parámetros del problema según las convenciones de Devore.',
        tipo: 'parametros',
        ejercicios: [
          {
            id: 'bin-par-01',
            tema: 'binomial',
            etapa: 'parametros',
            tipo: 'parametros',
            enunciado:
              'Un radar detecta con éxito el 75% de los drones no identificados que cruzan el espacio aéreo. En un día de maniobras se registran 6 vuelos independientes de drones.',
            pistas_clave: ['75% de probabilidad de éxito', '6 vuelos registrados'],
            explicacion:
              'El número de ensayos fijos es n = 6 y la probabilidad de éxito de detección por vuelo es p = 0.75.',
            parametrosEsperados: [
              { name: 'n', symbol: 'n', expectedValue: 6, description: 'Número fijo de ensayos' },
              { name: 'p', symbol: 'p', expectedValue: 0.75, description: 'Probabilidad de éxito en cada ensayo' },
            ],
            origen: 'curso',
          },
        ],
      },
      {
        id: 'calcular',
        titulo: 'Etapa 4: Calcular',
        descripcion: 'Resuelve el problema numérico del curso respetando 4 decimales.',
        tipo: 'numerico',
        ejercicios: [
          {
            id: 'bin-cal-01',
            tema: 'binomial',
            etapa: 'calcular',
            tipo: 'numerico',
            enunciado:
              'Un radar detecta un dron con p = 0.75. Si cruzan n = 6 drones de forma independiente, calcula la probabilidad exacta de que el radar detecte exactamente a 4 de ellos: b(4; 6, 0.75).',
            pistas_clave: ['b(4; 6, 0.75)', 'C(6, 4) * (0.75)^4 * (0.25)^2'],
            explicacion:
              'P(X = 4) = C(6, 4) * (0.75)^4 * (0.25)^2 = 15 * 0.31640625 * 0.0625 = 0.29663... Redondeado a 4 decimales: 0.2966.',
            valorEsperado: 0.2966,
            tolerancia: 0.0005,
            unidad: 'probabilidad',
            pasosSolucion: [
              'Identificar: n = 6, p = 0.75, x = 4.',
              'Fórmula: b(4; 6, 0.75) = C(6, 4) * (0.75)^4 * (0.25)^2.',
              'C(6, 4) = 15.',
              '(0.75)^4 = 0.31640625.',
              '(0.25)^2 = 0.0625.',
              'Producto: 15 * 0.31640625 * 0.0625 = 0.29663 -> 0.2966.',
            ],
            origen: 'curso',
          },
        ],
      },
      {
        id: 'contrastar',
        titulo: 'Etapa 5: Contrastar y Detectar Errores',
        descripcion: 'Pon a prueba tu discriminación entre Binomial y los modelos que se confunden con ella.',
        tipo: 'detecta-error',
        ejercicios: [
          {
            id: 'bin-con-01',
            tema: 'binomial',
            etapa: 'contrastar',
            tipo: 'detecta-error',
            enunciado:
              'Un estudiante intentó resolver el siguiente ejercicio:\n"En un examen con n = 20 preguntas y p = 0.3 de acertar, calcula la varianza del número de aciertos".\n\nEl estudiante calculó: V(X) = n * p = 20 * 0.3 = 6.0.\n\n¿Cuál es el error cometido?',
            opciones: [
              'Confundió la varianza V(X) con el valor esperado E(X); la varianza en la Binomial es n*p*(1-p) = 4.2.',
              'Calculó mal el producto 20 * 0.3 que debió dar 60.',
              'Debió usar la fórmula de la Hipergeométrica porque 20 es un número entero.',
              'En la Binomial la varianza siempre es igual a 1/p.',
            ],
            correcta: 0,
            pistas_clave: ['V(X) = n*p*(1-p)', 'E(X) = n*p'],
            explicacion:
              'El estudiante aplicó E(X) = n*p en vez de la fórmula de varianza para la Binomial V(X) = n*p*(1-p) = 20 * 0.3 * 0.7 = 4.2. (Solo en Poisson la varianza es igual a la media).',
            confusion: 'varianza-sin-media-cuadrada',
            origen: 'original',
          },
        ],
      },
    ],
  },

  // --- 2. HIPERGEOMÉTRICA ---
  {
    id: 'hipergeometrica',
    numero: 2,
    nombre: 'Distribución Hipergeométrica',
    subtitulo: 'Muestreo sin reemplazo en una población finita dividida en éxitos y fallas',
    contrastePrincipal: 'Binomial vs. Hipergeométrica (con reemplazo vs. sin reemplazo)',
    notacion: 'h(x; n, M, N)',
    variable: 'x: éxitos en la muestra de tamaño n (sin reemplazo)',
    formula: '\\frac{C(M, x) \\cdot C(N - M, n - x)}{C(N, n)}',
    esperanza: 'E(X) = n \\cdot \\frac{M}{N}',
    varianza: 'V(X) = \\left(\\frac{N - n}{N - 1}\\right) \\cdot n \\cdot \\left(\\frac{M}{N}\\right) \\cdot \\left(1 - \\frac{M}{N}\\right)',
    advertencias: [
      'N = tamaño de la población; M = número de éxitos en la población.',
      'n = tamaño de la muestra extraída SIN reemplazo.',
      'El factor (N - n)/(N - 1) es el factor de corrección por población finita.',
      'Si n / N <= 0.05, se puede aproximar por la Binomial con p = M / N.',
    ],
    etapas: [
      {
        id: 'pistas',
        titulo: 'Etapa 1: Pistas y Señales Clave',
        descripcion: 'Aprende a diferenciar el muestreo con y sin reemplazo.',
        tipo: 'lectura',
        ejercicios: [],
        pistasTeoria: {
          titulo: '¿Cómo identificar la Distribución Hipergeométrica?',
          senales: [
            'Población finita y conocida de tamaño N.',
            'Se conocen los elementos con la característica deseada M (éxitos) y el resto N - M (fallas).',
            'Se extrae una muestra de tamaño n SIN reemplazo (o simultáneamente).',
            'La probabilidad cambia en cada extracción debido a la falta de reposición.',
          ],
          contraejemplo:
            'Si las extracciones se realizan CON reemplazo, cada extracción es independiente y la probabilidad permanece constante: se vuelve Binomial.',
          formulaClave: 'P(X = x) = \\frac{\\binom{M}{x}\\binom{N - M}{n - x}}{\\binom{N}{n}}',
        },
      },
      {
        id: 'reconocer',
        titulo: 'Etapa 2: Reconocer el Modelo',
        descripcion: 'Decide si el enunciado describe Hipergeométrica o Binomial.',
        tipo: 'opcion-multiple',
        ejercicios: [
          {
            id: 'hip-rec-01',
            tema: 'hipergeometrica',
            etapa: 'reconocer',
            tipo: 'opcion-multiple',
            enunciado:
              'De un lote de 20 piezas industriales que contiene exactamente 4 piezas defectuosas, se seleccionan 5 piezas al azar y sin reemplazo para una prueba destructiva. ¿Qué modelo describe el número de piezas defectuosas en la muestra seleccionada?',
            opciones: ['Hipergeométrica', 'Binomial', 'Poisson', 'Binomial Negativa'],
            correcta: 0,
            pistas_clave: ['lote de 20 piezas (N = 20)', '4 defectuosas (M = 4)', 'se extraen 5 sin reemplazo (n = 5)'],
            explicacion:
              'La población es pequeña y finita (N = 20), el número de defectuosas totales está fijado (M = 4) y la extracción es SIN reemplazo, por lo que la probabilidad cambia en cada extracción.',
            error_comun: {
              1: 'La Binomial exige que los ensayos sean independientes con p constante. Sin reemplazo en un lote de 20, p cambia tras cada extracción (n/N = 5/20 = 0.25 > 0.05).',
              2: 'Poisson cuenta sucesos en un intervalo continuo de tiempo o espacio, no en un lote discreto sin reemplazo.',
              3: 'La Binomial Negativa fija el número de éxitos y cuenta ensayos/fallas, mientras aquí la muestra está fija en n = 5.',
            },
            confusion: 'binomial-vs-hipergeometrica',
            origen: 'original',
          },
          {
            id: 'hip-rec-02',
            tema: 'hipergeometrica',
            etapa: 'reconocer',
            tipo: 'opcion-multiple',
            enunciado:
              'Un comité de 4 personas se elegirá de un grupo compuesto por 8 ingenieros y 6 administradores. Si la selección se hace al azar, ¿qué distribución modela el número de ingenieros en el comité?',
            opciones: ['Hipergeométrica', 'Binomial', 'Geométrica', 'Normal'],
            correcta: 0,
            pistas_clave: ['grupo total 14 personas (N = 14)', '8 ingenieros (M = 8)', 'comité de 4 (sin reemplazo, una persona no se duplica)'],
            explicacion:
              'Al elegir un comité de personas, no se puede elegir dos veces a la misma persona: es un muestreo estricto sin reemplazo en una población finita (N = 14, M = 8, n = 4).',
            error_comun: {
              1: 'No puede ser Binomial porque al elegir una persona, la proporción de ingenieros restantes cambia.',
            },
            confusion: 'binomial-vs-hipergeometrica',
            origen: 'original',
          },
        ],
      },
      {
        id: 'parametros',
        titulo: 'Etapa 3: Parametrizar',
        descripcion: 'Identifica N, M y n con la notación de Devore h(x; n, M, N).',
        tipo: 'parametros',
        ejercicios: [
          {
            id: 'hip-par-01',
            tema: 'hipergeometrica',
            etapa: 'parametros',
            tipo: 'parametros',
            enunciado:
              'Un depósito contiene N = 20 proyectiles, de los cuales exactamente M = 5 tienen espoleta de proximidad. Se extraen al azar n = 4 proyectiles sin reposición.',
            pistas_clave: ['N = 20 total', 'M = 5 éxitos', 'n = 4 muestra'],
            explicacion:
              'En la notación del texto guía Devore h(x; n, M, N): N es la población total (20), M son los éxitos disponibles (5) y n es el tamaño de la muestra (4).',
            parametrosEsperados: [
              { name: 'N', symbol: 'N', expectedValue: 20, description: 'Tamaño total de la población' },
              { name: 'M', symbol: 'M', expectedValue: 5, description: 'Cantidad total de éxitos en la población' },
              { name: 'n', symbol: 'n', expectedValue: 4, description: 'Tamaño de la muestra extraída' },
            ],
            origen: 'curso',
          },
        ],
      },
      {
        id: 'calcular',
        titulo: 'Etapa 4: Calcular',
        descripcion: 'Calcula probabilidades hipergeométricas del banco verificado del curso.',
        tipo: 'numerico',
        ejercicios: [
          {
            id: 'hip-cal-01',
            tema: 'hipergeometrica',
            etapa: 'calcular',
            tipo: 'numerico',
            enunciado:
              'En un lote de N = 20 proyectiles con M = 5 con espoleta, se seleccionan n = 4 al azar sin reemplazo. Calcula la probabilidad exacta de obtener x = 2 proyectiles con espoleta: h(2; 4, 5, 20).',
            pistas_clave: ['h(2; 4, 5, 20)', 'C(5, 2) * C(15, 2) / C(20, 4)'],
            explicacion:
              'P(X = 2) = [C(5, 2) * C(15, 2)] / C(20, 4) = [10 * 105] / 4845 = 1050 / 4845 ≈ 0.2167.',
            valorEsperado: 0.2167,
            tolerancia: 0.0005,
            unidad: 'probabilidad',
            pasosSolucion: [
              'C(M, x) = C(5, 2) = 10',
              'C(N - M, n - x) = C(15, 2) = 105',
              'C(N, n) = C(20, 4) = 4845',
              'P(X = 2) = (10 * 105) / 4845 = 1050 / 4845 = 0.216718 -> 0.2167',
            ],
            origen: 'curso',
          },
        ],
      },
      {
        id: 'contrastar',
        titulo: 'Etapa 5: Contrastar (Condición de Aproximación)',
        descripcion: 'Verifica cuándo se puede aproximar la Hipergeométrica por Binomial.',
        tipo: 'opcion-multiple',
        ejercicios: [
          {
            id: 'hip-con-01',
            tema: 'hipergeometrica',
            etapa: 'contrastar',
            tipo: 'opcion-multiple',
            enunciado:
              '¿Bajo qué condición formal del curso es válida la aproximación de una distribución Hipergeométrica h(x; n, M, N) a una Binomial b(x; n, p = M/N)?',
            opciones: [
              'Cuando la fracción de muestreo n / N ≤ 0.05 (la muestra no supera el 5% de la población).',
              'Cuando n ≥ 100 y p ≤ 0.01.',
              'Cuando np ≥ 10 y n(1 - p) ≥ 10.',
              'Siempre que N sea mayor que 30.',
            ],
            correcta: 0,
            pistas_clave: ['n / N ≤ 0.05', 'fracción de muestreo pequeña'],
            explicacion:
              'La regla exacta del curso (Devore) establece que si la muestra no supera el 5% de la población (n/N ≤ 0.05), extraer sin reemplazo prácticamente no altera las probabilidades y se puede usar la Binomial con p = M/N.',
            error_comun: {
              1: 'Esa es la regla para aproximar Binomial a Poisson.',
              2: 'Esa es la regla para aproximar Binomial a Normal.',
            },
            confusion: 'binomial-vs-hipergeometrica',
            origen: 'original',
          },
        ],
      },
    ],
  },

  // --- 3. GEOMÉTRICA Y BINOMIAL NEGATIVA ---
  {
    id: 'geometrica-nb',
    numero: 3,
    nombre: 'Geométrica y Binomial Negativa',
    subtitulo: 'Ensayos hasta el primer éxito vs. fallas antes del r-ésimo éxito',
    contrastePrincipal: 'Binomial (n fijo) vs. Geométrica/Binomial Negativa (hasta alcanzar el éxito)',
    notacion: 'g(x; p) y nb(x; r, p)',
    variable: 'Geométrica: x ensayos hasta el 1er éxito (x=1,2,...). Binomial Negativa: x fallas antes del r-ésimo éxito (x=0,1,...)',
    formula: 'g(x; p) = (1 - p)^{x - 1} p \\quad \\mid \\quad nb(x; r, p) = C(x + r - 1, r - 1) p^r (1 - p)^x',
    esperanza: 'Geométrica: E(X) = 1/p \\quad \\mid \\quad Bin. Negativa: E(X) = r(1 - p)/p',
    varianza: 'Geométrica: V(X) = (1 - p)/p^2 \\quad \\mid \\quad Bin. Negativa: V(X) = r(1 - p)/p^2',
    advertencias: [
      '¡Atención a la convención del curso! La Geométrica cuenta ENSAYOS (x ≥ 1), mientras la Binomial Negativa cuenta FALLAS (x ≥ 0).',
      'No son equivalentes directos: ensayos en Geométrica = fallas en NB(r=1) + 1.',
      'Si se cuenta hasta el primer éxito (r = 1), la Binomial Negativa en fallas tiene E(X) = (1-p)/p, mientras la Geométrica en ensayos tiene E(X) = 1/p.',
    ],
    etapas: [
      {
        id: 'pistas',
        titulo: 'Etapa 1: Pistas y Señales Clave',
        descripcion: 'Aprende a distinguir cuándo el número de éxitos está fijado y el número de intentos es la variable aleatoria.',
        tipo: 'lectura',
        ejercicios: [],
        pistasTeoria: {
          titulo: '¿Cómo identificar Geométrica y Binomial Negativa?',
          senales: [
            'En Binomial, fijas n y cuentas cuántos éxitos obtuviste.',
            'En Geométrica, fijas 1 éxito y cuentas cuántos ensayos hiciste hasta lograrlo.',
            'En Binomial Negativa, fijas r éxitos y cuentas cuántas fallas ocurrieron antes de completar los r éxitos.',
            'Los ensayos son independientes con p constante.',
          ],
          contraejemplo:
            'Si un basquetbolista lanza 10 tiros libres (n=10 fijo), es Binomial. Si lanza tiros hasta embocar el primer triple, es Geométrica. Si lanza hasta embocar 3 triples y se cuentan los tiros fallados, es Binomial Negativa.',
          formulaClave: 'g(x; p) = (1-p)^{x-1}p, \\; x \\ge 1 \\quad \\mid \\quad nb(x; r, p) = \\binom{x+r-1}{r-1}p^r(1-p)^x, \\; x \\ge 0',
        },
      },
      {
        id: 'reconocer',
        titulo: 'Etapa 2: Reconocer el Modelo',
        descripcion: 'Distingue entre Binomial, Geométrica y Binomial Negativa.',
        tipo: 'opcion-multiple',
        ejercicios: [
          {
            id: 'geo-rec-01',
            tema: 'geometrica-nb',
            etapa: 'reconocer',
            tipo: 'opcion-multiple',
            enunciado:
              'Un perforador petrolero sabe que la probabilidad de que un pozo resulte productivo es del 20%. Perfora pozos sucesivamente hasta encontrar el primer pozo productivo. ¿Qué modelo describe el número total de pozos que deberá perforar?',
            opciones: ['Geométrica', 'Binomial', 'Binomial Negativa', 'Poisson'],
            correcta: 0,
            pistas_clave: ['perfora hasta encontrar el primer pozo', 'número total de pozos perforados (ensayos)', 'probabilidad constante 0.20'],
            explicacion:
              'Se realizan ensayos independientes hasta observar el PRIMER éxito (r = 1) y la variable cuenta el número total de ensayos. Esa es la definición exacta de la distribución Geométrica g(x; p).',
            error_comun: {
              1: 'La Binomial exige fijar de antemano el número de pozos n. Aquí no sabemos cuántos perforará.',
              2: 'La Binomial Negativa con r > 1 se usa cuando se buscan varios éxitos, y en la convención del curso cuenta fallas.',
            },
            confusion: 'binomial-vs-geometrica-nb',
            origen: 'original',
          },
          {
            id: 'geo-rec-02',
            tema: 'geometrica-nb',
            etapa: 'reconocer',
            tipo: 'opcion-multiple',
            enunciado:
              'Una reclutadora entrevista candidatos para un puesto con probabilidad 0.60 de ser idóneos. La empresa necesita contratar exactamente a 4 candidatos idóneos. Se desea modelar el número de candidatos rechazados (fallas) antes de completar las 4 contrataciones.',
            opciones: ['Binomial Negativa', 'Binomial', 'Hipergeométrica', 'Geométrica'],
            correcta: 0,
            pistas_clave: ['necesita contratar a 4 idóneos (r = 4 éxitos fijos)', 'modela los candidatos rechazados (fallas x)', 'p = 0.60'],
            explicacion:
              'El número de éxitos está prefijado en r = 4, y la variable aleatoria es el número de fallas x antes de alcanzar el 4º éxito: convención de la Binomial Negativa nb(x; r, p) de Devore.',
            error_comun: {
              0: '',
              1: 'La Binomial fija el número de entrevistas totales, no el número de contrataciones deseadas.',
              3: 'La Geométrica solo contempla el primer éxito (r = 1).',
            },
            confusion: 'binomial-vs-geometrica-nb',
            origen: 'original',
          },
        ],
      },
      {
        id: 'parametros',
        titulo: 'Etapa 3: Parametrizar',
        descripcion: 'Extrae los parámetros r, p y la variable x según la convención del curso.',
        tipo: 'parametros',
        ejercicios: [
          {
            id: 'geo-par-01',
            tema: 'geometrica-nb',
            etapa: 'parametros',
            tipo: 'parametros',
            enunciado:
              'En una línea de producción donde la probabilidad de que un producto sea aceptable es p = 0.60, se detiene el proceso al completar r = 4 artículos aptos. Se registraron 3 artículos defectuosos antes de lograrlo.',
            pistas_clave: ['p = 0.60', 'r = 4 éxitos fijados', 'x = 3 fallas observadas'],
            explicacion:
              'En nb(x; r, p): r = 4 es el número de éxitos fijado, p = 0.60 es la probabilidad de éxito, y x = 3 es el número de fallas previas.',
            parametrosEsperados: [
              { name: 'r', symbol: 'r', expectedValue: 4, description: 'Número requerido de éxitos' },
              { name: 'p', symbol: 'p', expectedValue: 0.6, description: 'Probabilidad de éxito en cada ensayo' },
              { name: 'x', symbol: 'x', expectedValue: 3, description: 'Número de fallas previas' },
            ],
            origen: 'curso',
          },
        ],
      },
      {
        id: 'calcular',
        titulo: 'Etapa 4: Calcular',
        descripcion: 'Resuelve los ejercicios verificados de Geométrica y Binomial Negativa.',
        tipo: 'numerico',
        ejercicios: [
          {
            id: 'geo-cal-01',
            tema: 'geometrica-nb',
            etapa: 'calcular',
            tipo: 'numerico',
            enunciado:
              'Si la probabilidad de éxito de una prueba es p = 0.20, calcula la probabilidad de que el primer éxito ocurra exactamente en el 5.º ensayo: g(5; 0.20).',
            pistas_clave: ['g(5; 0.20)', '(1 - 0.20)^4 * 0.20'],
            explicacion:
              'g(x; p) = (1 - p)^{x - 1} * p. Para x = 5 y p = 0.20: g(5; 0.20) = (0.80)^4 * 0.20 = 0.4096 * 0.20 = 0.08192 -> 0.0819.',
            valorEsperado: 0.0819,
            tolerancia: 0.0005,
            unidad: 'probabilidad',
            pasosSolucion: [
              'Ensayos x = 5, p = 0.20, fallas previas = 4.',
              'P(X = 5) = (0.80)^4 * (0.20)',
              '0.80^4 = 0.4096',
              '0.4096 * 0.20 = 0.08192 -> 0.0819',
            ],
            origen: 'curso',
          },
          {
            id: 'nb-cal-01',
            tema: 'geometrica-nb',
            etapa: 'calcular',
            tipo: 'numerico',
            enunciado:
              'Con r = 4 éxitos requeridos y p = 0.60 de éxito, calcula la probabilidad de que ocurran exactamente x = 3 fallas antes del 4.º éxito: nb(3; 4, 0.60).',
            pistas_clave: ['nb(3; 4, 0.60)', 'C(3 + 4 - 1, 4 - 1) * (0.60)^4 * (0.40)^3'],
            explicacion:
              'nb(x; r, p) = C(x + r - 1, r - 1) * p^r * (1 - p)^x. Para x = 3, r = 4, p = 0.60: C(6, 3) * (0.6)^4 * (0.4)^3 = 20 * 0.1296 * 0.064 = 0.165888 -> 0.1659.',
            valorEsperado: 0.1659,
            tolerancia: 0.0005,
            unidad: 'probabilidad',
            pasosSolucion: [
              'C(x + r - 1, r - 1) = C(3 + 4 - 1, 3) = C(6, 3) = 20.',
              'p^r = 0.60^4 = 0.1296.',
              '(1 - p)^x = 0.40^3 = 0.064.',
              '20 * 0.1296 * 0.064 = 0.165888 -> 0.1659.',
            ],
            origen: 'curso',
          },
        ],
      },
      {
        id: 'contrastar',
        titulo: 'Etapa 5: Contrastar (Ensayos vs. Fallas)',
        descripcion: 'Domina la conversión crítica entre ensayos de Geométrica y fallas de Binomial Negativa.',
        tipo: 'opcion-multiple',
        ejercicios: [
          {
            id: 'geo-con-01',
            tema: 'geometrica-nb',
            etapa: 'contrastar',
            tipo: 'opcion-multiple',
            enunciado:
              'En la convención de Devore, la Geométrica cuenta ensayos (X_G) y la Binomial Negativa cuenta fallas (X_NB con r = 1). ¿Cuál es la relación exacta entre ambas variables?',
            opciones: [
              'X_G (ensayos) = X_NB (fallas) + 1',
              'X_G (ensayos) = X_NB (fallas)',
              'X_G (ensayos) = X_NB (fallas) - 1',
              'Son exactamente idénticas sin ninguna transformación',
            ],
            correcta: 0,
            pistas_clave: ['ensayos = fallas + 1', 'el último ensayo es siempre el éxito'],
            explicacion:
              'Para lograr el primer éxito, el número total de ensayos incluye todas las fallas previas más el ensayo final exitoso: Ensayos = Fallas + 1.',
            confusion: 'binomial-vs-geometrica-nb',
            origen: 'original',
          },
        ],
      },
    ],
  },

  // --- 4. POISSON ---
  {
    id: 'poisson',
    numero: 4,
    nombre: 'Distribución de Poisson',
    subtitulo: 'Conteo de ocurrencias de un evento en un intervalo continuo de tiempo o espacio',
    contrastePrincipal: 'Poisson (conteo de eventos) vs. Exponencial (tiempo transcurrido)',
    notacion: 'p(x; \\mu), \\text{ con } \\mu = \\lambda t',
    variable: 'x: número de ocurrencias en el intervalo t (x = 0, 1, 2, ...)',
    formula: '\\frac{e^{-\\mu} \\cdot \\mu^x}{x!}, \\quad \\mu = \\lambda t',
    esperanza: 'E(X) = \\mu = \\lambda t',
    varianza: 'V(X) = \\mu = \\lambda t',
    advertencias: [
      '¡Error clásico del profesor! NO escalar la tasa: si la tasa λ está por hora y el intervalo es de 30 minutos (t = 0.5 h), debe usarse μ = λ * 0.5.',
      'Aproximación de Binomial a Poisson: n ≥ 100, p ≤ 0.01 y np ≤ 20 (regla simplificada: n ≥ 50 y np < 5). En ese caso μ = np.',
      'En Poisson, la media y la varianza son SIEMPRE IDÉNTICAS: E(X) = V(X) = μ.',
    ],
    etapas: [
      {
        id: 'pistas',
        titulo: 'Etapa 1: Pistas y Señales Clave',
        descripcion: 'Aprende a reconocer problemas de conteo en intervalos.',
        tipo: 'lectura',
        ejercicios: [],
        pistasTeoria: {
          titulo: '¿Cómo identificar la Distribución de Poisson?',
          senales: [
            'Se da una tasa promedio λ de ocurrencias por unidad de medida (tiempo, longitud, área, volumen).',
            'La variable aleatoria X cuenta CUÁNTAS veces ocurre el evento en un intervalo específico t.',
            'Los eventos ocurren de forma independiente y a una tasa constante.',
            'No hay un límite superior natural evidente para X (x = 0, 1, 2, 3, ...).',
          ],
          contraejemplo:
            'Si te preguntan "cuánto tiempo pasará hasta la próxima llamada", la variable mide TIEMPO CONTINUO, no conteo de eventos: es Exponencial, NO Poisson.',
          formulaClave: 'P(X = x) = \\frac{e^{-\\mu} \\mu^x}{x!}, \\quad \\text{con } \\mu = \\lambda t',
        },
      },
      {
        id: 'reconocer',
        titulo: 'Etapa 2: Reconocer el Modelo',
        descripcion: 'Detecta si la variable es Poisson o Exponencial.',
        tipo: 'opcion-multiple',
        ejercicios: [
          {
            id: 'poi-rec-01',
            tema: 'poisson',
            etapa: 'reconocer',
            tipo: 'opcion-multiple',
            enunciado:
              'Una centralita telefónica recibe un promedio de 8 llamadas por hora según un proceso de Poisson. Se desea saber la probabilidad de recibir exactamente 3 llamadas en los próximos 15 minutos. ¿Qué modelo se debe emplear?',
            opciones: ['Poisson', 'Exponencial', 'Binomial', 'Normal'],
            correcta: 0,
            pistas_clave: ['tasa de 8 llamadas por hora', 'intervalo de 15 minutos', 'cuenta cuántas llamadas (conteo discreto)'],
            explicacion:
              'La variable cuenta la cantidad entera de ocurrencias (llamadas) en un intervalo continuo de tiempo fijado (15 min = 0.25 h). Es Poisson con μ = 8 * 0.25 = 2.',
            error_comun: {
              1: 'La Exponencial mide el TIEMPO de espera entre llamadas, no la cantidad entera de llamadas.',
              2: 'La Binomial requiere ensayos discretos delimitados, no un flujo continuo de llegadas.',
            },
            confusion: 'poisson-vs-exponencial',
            origen: 'original',
          },
          {
            id: 'poi-rec-02',
            tema: 'poisson',
            etapa: 'reconocer',
            tipo: 'opcion-multiple',
            enunciado:
              'Un cable de fibra óptica presenta defectos a razón de 2 imperfecciones por metro. Se examina un tramo continuo de 2 metros y se cuenta el número de imperfecciones halladas.',
            opciones: ['Poisson', 'Binomial', 'Exponencial', 'Gamma'],
            correcta: 0,
            pistas_clave: ['tasa λ = 2 defectos/metro', 'tramo continuo de 2 metros (intervalo espacial)', 'conteo de imperfecciones'],
            explicacion:
              'Es un conteo de eventos sobre un intervalo espacial continuo con tasa λ = 2 e intervalo t = 2 m -> Poisson con μ = λt = 4.',
            error_comun: {
              2: 'La Exponencial mediría la distancia en metros entre una imperfección y la siguiente.',
            },
            confusion: 'poisson-vs-exponencial',
            origen: 'curso',
          },
        ],
      },
      {
        id: 'parametros',
        titulo: 'Etapa 3: Parametrizar y Escalar la Tasa',
        descripcion: 'Calcula correctamente μ = λ * t escalando unidades.',
        tipo: 'parametros',
        ejercicios: [
          {
            id: 'poi-par-01',
            tema: 'poisson',
            etapa: 'parametros',
            tipo: 'parametros',
            enunciado:
              'Llegan clientes a una sucursal bancaria a razón de λ = 12 clientes por hora. Se analiza un período de observación de 30 minutos (t = 0.5 horas).',
            pistas_clave: ['λ = 12 clientes/hora', 't = 0.5 horas', 'μ = λ * t = 6'],
            explicacion:
              'Para usar Poisson p(x; μ), el parámetro medio debe corresponder exactamente al intervalo analizado: μ = λ * t = 12 * 0.5 = 6 clientes.',
            parametrosEsperados: [
              { name: 'λ', symbol: 'λ', expectedValue: 12, description: 'Tasa original por hora' },
              { name: 't', symbol: 't', expectedValue: 0.5, description: 'Intervalo de tiempo en horas' },
              { name: 'μ', symbol: 'μ', expectedValue: 6, description: 'Parámetro medio escalado (μ = λt)' },
            ],
            origen: 'original',
          },
        ],
      },
      {
        id: 'calcular',
        titulo: 'Etapa 4: Calcular',
        descripcion: 'Resuelve problemas numéricos de Poisson del banco verificado.',
        tipo: 'numerico',
        ejercicios: [
          {
            id: 'poi-cal-01',
            tema: 'poisson',
            etapa: 'calcular',
            tipo: 'numerico',
            enunciado:
              'Con una tasa de λ = 2 imperfecciones por metro en un tramo de 2 metros (μ = 4), calcula la probabilidad exacta de que el tramo tenga exactamente x = 3 imperfecciones: p(3; 4).',
            pistas_clave: ['p(3; 4)', 'e^(-4) * 4^3 / 3!'],
            explicacion:
              'P(X = 3) = e^(-4) * 4^3 / 3! = e^(-4) * 64 / 6 ≈ 0.0183156 * 10.66667 = 0.195366... Redondeado a 4 decimales: 0.1954.',
            valorEsperado: 0.1954,
            tolerancia: 0.0005,
            unidad: 'probabilidad',
            pasosSolucion: [
              'μ = λ * t = 2 * 2 = 4.',
              'Fórmula: p(3; 4) = (e^(-4) * 4^3) / 3!.',
              'e^(-4) ≈ 0.0183156.',
              '4^3 = 64; 3! = 6.',
              '64 / 6 ≈ 10.66667.',
              '0.0183156 * 10.66667 = 0.195366 -> 0.1954.',
            ],
            origen: 'curso',
          },
          {
            id: 'poi-cal-02',
            tema: 'poisson',
            etapa: 'calcular',
            tipo: 'numerico',
            enunciado:
              'Una muestra grande de n = 2000 chips tiene una probabilidad de falla muy pequeña p = 0.002. Aproximando por Poisson con μ = np = 4, calcula la probabilidad de que fallen exactamente x = 3 chips.',
            pistas_clave: ['Aproximación Binomial a Poisson', 'μ = n * p = 2000 * 0.002 = 4', 'p(3; 4)'],
            explicacion:
              'Al ser n ≥ 100 y p ≤ 0.01 con np = 4, se aproxima mediante Poisson con μ = 4: P(X = 3) = e^(-4) * 4^3 / 3! ≈ 0.1954.',
            valorEsperado: 0.1954,
            tolerancia: 0.0005,
            unidad: 'probabilidad',
            pasosSolucion: [
              'Verificar condición: n = 2000 (≥ 100), p = 0.002 (≤ 0.01), np = 4 (≤ 20). Válida.',
              'μ = n * p = 4.',
              'P(X = 3) = e^(-4) * 4^3 / 6 ≈ 0.1954.',
            ],
            origen: 'curso',
          },
        ],
      },
      {
        id: 'contrastar',
        titulo: 'Etapa 5: Contrastar y Detectar Errores',
        descripcion: 'Detecta el error clásico de no escalar la tasa λ al intervalo.',
        tipo: 'detecta-error',
        ejercicios: [
          {
            id: 'poi-con-01',
            tema: 'poisson',
            etapa: 'contrastar',
            tipo: 'detecta-error',
            enunciado:
              'Un examen pedía: "Los accidentes ocurren a una tasa de 4 por semana. Calcula la probabilidad de 1 accidente en un período de 2 semanas".\n\nUn alumno calculó: p(1; 4) = e^(-4) * 4^1 / 1! = 0.0733.\n\n¿Cuál es el error cometido?',
            opciones: [
              'No escaló la tasa al intervalo de 2 semanas: debió usar μ = λ * t = 4 * 2 = 8, calculando p(1; 8).',
              'Debió usar la distribución Exponencial porque los accidentes son eventos de tiempo.',
              'La fórmula de Poisson lleva e^(+μ) en lugar de e^(-μ).',
              'El cálculo es completamente correcto.',
            ],
            correcta: 0,
            pistas_clave: ['intervalo de 2 semanas', 'μ = λ * t = 4 * 2 = 8', 'error de escala de tasa'],
            explicacion:
              '¡Este es uno de los errores más señalados por el profesor! Como el intervalo es de 2 semanas, el parámetro debe escalarse: μ = λt = 4 * 2 = 8. Usar μ = 4 calcula para una sola semana.',
            confusion: 'escala-de-tasa',
            origen: 'original',
          },
        ],
      },
    ],
  },

  // --- 5. EXPONENCIAL ---
  {
    id: 'exponencial',
    numero: 5,
    nombre: 'Distribución Exponencial',
    subtitulo: 'Tiempo transcurrido o distancia continua entre eventos sucesivos de Poisson',
    contrastePrincipal: 'Poisson (¿cuántos eventos?) vs. Exponencial (¿cuánto tiempo transcurre?)',
    notacion: 'Exp(\\lambda), \\text{ con } \\beta = 1/\\lambda',
    variable: 'x: tiempo continuo o distancia hasta el próximo evento (x ≥ 0)',
    formula: 'f(x) = \\lambda e^{-\\lambda x}, \\quad F(x) = P(X \\le x) = 1 - e^{-\\lambda x}',
    esperanza: 'E(X) = 1/\\lambda = \\beta',
    varianza: 'V(X) = 1/\\lambda^2 = \\beta^2',
    advertencias: [
      '¡Propiedad de pérdida de memoria! P(X > s + t | X > s) = P(X > t).',
      'En distribuciones continuas, P(X = x) = 0 exactamente. Jamás evalúes f(x) como una probabilidad puntual.',
      'Si se da la media de espera E(X) = 3 minutos, entonces λ = 1/3 por minuto.',
    ],
    etapas: [
      {
        id: 'pistas',
        titulo: 'Etapa 1: Pistas y Señales Clave',
        descripcion: 'Aprende a reconocer cuándo la variable es el tiempo continuo entre eventos.',
        tipo: 'lectura',
        ejercicios: [],
        pistasTeoria: {
          titulo: '¿Cómo identificar la Distribución Exponencial?',
          senales: [
            'Mide una magnitud continua: TIEMPO entre eventos, duración de una llamada, distancia hasta el primer fallo.',
            'Está asociada a un proceso de Poisson con tasa constante λ.',
            'La pregunta pide: "¿cuál es la probabilidad de que el evento ocurra antes de x tiempo, o después de x tiempo?".',
            'La función acumulada es directa y fácil de recordar: P(X ≤ x) = 1 - e^(-λx) y P(X > x) = e^(-λx).',
          ],
          contraejemplo:
            'Si te preguntan cuántas llamadas ingresan en 10 minutos, cuentas llamadas (discreto): es Poisson. Si te preguntan cuánto tiempo transcurre hasta la siguiente llamada, mides minutos (continuo): es Exponencial.',
          formulaClave: 'F(x) = P(X \\le x) = 1 - e^{-\\lambda x}, \\quad P(X > x) = e^{-\\lambda x}',
        },
      },
      {
        id: 'reconocer',
        titulo: 'Etapa 2: Reconocer el Modelo',
        descripcion: 'Distingue entre Poisson y Exponencial.',
        tipo: 'opcion-multiple',
        ejercicios: [
          {
            id: 'exp-rec-01',
            tema: 'exponencial',
            etapa: 'reconocer',
            tipo: 'opcion-multiple',
            enunciado:
              'El tiempo de atención en una ventanilla de servicio al cliente tiene un promedio de 3 minutos por usuario y sigue un decaimiento exponencial. ¿Qué distribución modela la probabilidad de que la atención de un usuario dure menos de 5 minutos?',
            opciones: ['Exponencial', 'Poisson', 'Normal', 'Uniforme continua'],
            correcta: 0,
            pistas_clave: ['tiempo de atención continuo', 'media de 3 minutos', 'pregunta por P(X ≤ 5 minutos)'],
            explicacion:
              'La variable aleatoria es el TIEMPO continuo transcurrido hasta completar un servicio. Corresponde a la distribución Exponencial con media 1/λ = 3 -> λ = 1/3.',
            error_comun: {
              1: 'Poisson modelaría cuántos clientes terminan su trámite en un bloque de tiempo fijo, no la duración del trámite de un cliente.',
            },
            confusion: 'poisson-vs-exponencial',
            origen: 'curso',
          },
        ],
      },
      {
        id: 'parametros',
        titulo: 'Etapa 3: Parametrizar',
        descripcion: 'Obtén λ a partir del tiempo medio E(X) = 1/λ.',
        tipo: 'parametros',
        ejercicios: [
          {
            id: 'exp-par-01',
            tema: 'exponencial',
            etapa: 'parametros',
            tipo: 'parametros',
            enunciado:
              'Un servidor web tarda en promedio 0.25 segundos en responder una solicitud. Se asume que el tiempo de respuesta tiene distribución exponencial.',
            pistas_clave: ['media E(X) = 0.25 segundos', 'λ = 1 / E(X) = 1 / 0.25 = 4'],
            explicacion:
              'En la distribución Exponencial, la esperanza es E(X) = 1/λ. Por tanto, la tasa λ es el inverso del tiempo medio: λ = 1 / 0.25 = 4 solicitudes por segundo.',
            parametrosEsperados: [
              { name: 'media', symbol: 'E(X)', expectedValue: 0.25, description: 'Tiempo medio de respuesta' },
              { name: 'λ', symbol: 'λ', expectedValue: 4, description: 'Tasa λ = 1 / E(X)' },
            ],
            origen: 'original',
          },
        ],
      },
      {
        id: 'calcular',
        titulo: 'Etapa 4: Calcular',
        descripcion: 'Resuelve el problema 1 del banco verificado del curso.',
        tipo: 'numerico',
        ejercicios: [
          {
            id: 'exp-cal-01',
            tema: 'exponencial',
            etapa: 'calcular',
            tipo: 'numerico',
            enunciado:
              'Si el tiempo de atención en una caja tiene media de 3 minutos (λ = 1/3 por minuto), calcula la probabilidad de que una atención dure a lo sumo 5 minutos: P(X ≤ 5).',
            pistas_clave: ['P(X ≤ 5) = 1 - e^(-λx)', 'λ = 1/3', 'x = 5'],
            explicacion:
              'P(X ≤ 5) = 1 - e^(-(1/3) * 5) = 1 - e^(-1.6667) = 1 - 0.1888756 ≈ 0.811124... Redondeado a 4 decimales: 0.8111.',
            valorEsperado: 0.8111,
            tolerancia: 0.0005,
            unidad: 'probabilidad',
            pasosSolucion: [
              'Identificar tasa: λ = 1 / 3.',
              'Fórmula acumulada: F(5) = 1 - e^(-5/3).',
              '-5/3 ≈ -1.66667.',
              'e^(-1.66667) ≈ 0.1888756.',
              '1 - 0.1888756 = 0.811124 -> 0.8111.',
            ],
            origen: 'curso',
          },
        ],
      },
      {
        id: 'contrastar',
        titulo: 'Etapa 5: Contrastar (Error conceptual en continuas)',
        descripcion: 'Detecta el error de evaluar la función de densidad como probabilidad puntual.',
        tipo: 'detecta-error',
        ejercicios: [
          {
            id: 'exp-con-01',
            tema: 'exponencial',
            etapa: 'contrastar',
            tipo: 'detecta-error',
            enunciado:
              'En un examen con una variable aleatoria continua Exponencial con λ = 2, se pregunta: "¿Cuál es la probabilidad exacta de que el evento ocurra en el instante exacto x = 3?".\n\nUn estudiante respondió: "P(X = 3) = f(3) = 2 * e^(-2 * 3) = 2 * e^(-6) = 0.00496".\n\n¿Cuál es el error conceptual?',
            opciones: [
              'En cualquier variable aleatoria continua, la probabilidad en un punto exacto es estrictamente cero: P(X = 3) = 0. Confundió la densidad f(x) con una probabilidad.',
              'La fórmula de la densidad era con signo positivo: f(3) = 2 * e^(+6).',
              'El cálculo debió hacerse con la distribución Poisson evaluada en x = 3.',
              'No hay error, la probabilidad puntual es f(x).',
            ],
            correcta: 0,
            pistas_clave: ['P(X = c) = 0 en continuas', 'f(x) es densidad, no probabilidad', 'error crítico del profesor'],
            explicacion:
              'Para toda variable continua, la probabilidad de cualquier valor puntual exacto es 0: P(X = c) = 0. f(x) es una función de densidad, no una probabilidad puntual.',
            confusion: 'probabilidad-en-continuas',
            origen: 'original',
          },
        ],
      },
    ],
  },

  // --- 6. GAMMA ---
  {
    id: 'gamma',
    numero: 6,
    nombre: 'Distribución Gamma',
    subtitulo: 'Tiempo continuo hasta presenciar el α-ésimo evento de Poisson',
    contrastePrincipal: 'Exponencial (tiempo hasta el 1er evento) vs. Gamma (tiempo hasta el α-ésimo evento)',
    notacion: 'Gama(\\alpha, \\beta), \\text{ con } \\beta = 1/\\lambda \\text{ (escala)}',
    variable: 'x: tiempo continuo hasta que ocurren α eventos de Poisson (x > 0)',
    formula: 'f(x; \\alpha, \\beta) = \\frac{x^{\\alpha - 1} e^{-x / \\beta}}{\\beta^\\alpha \\cdot \\Gamma(\\alpha)}',
    esperanza: 'E(X) = \\alpha \\cdot \\beta',
    varianza: 'V(X) = \\alpha \\cdot \\beta^2',
    advertencias: [
      '¡Convención obligatoria de Devore! β se utiliza como parámetro de ESCALA, NO de tasa.',
      'Si los eventos ocurren con tasa λ, el parámetro de escala es β = 1/λ.',
      'Cuando α = 1, la distribución Gamma se reduce exactamente a la distribución Exponencial con β = 1/λ.',
      'Para α entero positivo, Γ(α) = (α - 1)! (Distribución de Erlang).',
    ],
    etapas: [
      {
        id: 'pistas',
        titulo: 'Etapa 1: Pistas y Señales Clave',
        descripcion: 'Reconoce la generalización continua de la Exponencial.',
        tipo: 'lectura',
        ejercicios: [],
        pistasTeoria: {
          titulo: '¿Cómo identificar la Distribución Gamma?',
          senales: [
            'Mide tiempo continuo hasta acumular un número específico α de eventos de Poisson.',
            'Si α = 1 es el tiempo hasta el primer evento (Exponencial).',
            'Si α > 1 es el tiempo hasta el segundo, tercer o α-ésimo evento (Gamma / Erlang).',
            'Devore usa β como escala: E(X) = α * β y V(X) = α * β².',
          ],
          contraejemplo:
            'Si cuentas cuántas fallas ocurren antes del r-ésimo éxito en ensayos discretos independientes, es Binomial Negativa. Si mides el tiempo continuo transcurrido hasta el α-ésimo evento, es Gamma.',
          formulaClave: 'E(X) = \\alpha \\beta, \\quad V(X) = \\alpha \\beta^2, \\quad \\beta = 1/\\lambda',
        },
      },
      {
        id: 'reconocer',
        titulo: 'Etapa 2: Reconocer el Modelo',
        descripcion: 'Distingue entre Exponencial y Gamma.',
        tipo: 'opcion-multiple',
        ejercicios: [
          {
            id: 'gam-rec-01',
            tema: 'gamma',
            etapa: 'reconocer',
            tipo: 'opcion-multiple',
            enunciado:
              'En una planta nuclear, ciertas partículas radiactivas son registradas por un contador a una tasa de 0.5 partículas por minuto. Se desea modelar el tiempo total transcurrido hasta que el contador registre exactamente 3 partículas.',
            opciones: ['Gamma', 'Exponencial', 'Poisson', 'Binomial Negativa'],
            correcta: 0,
            pistas_clave: ['tiempo continuo', 'tasa 0.5 por minuto', 'hasta registrar exactamente 3 partículas (α = 3)'],
            explicacion:
              'Medimos el tiempo continuo hasta acumular α = 3 eventos de Poisson. Para α = 1 sería Exponencial; para α = 3 es Gamma con α = 3 y escala β = 1/0.5 = 2.',
            error_comun: {
              1: 'La Exponencial mide el tiempo hasta la primera partícula (α = 1). Para 3 partículas es Gamma.',
              2: 'Poisson modelaría cuántas partículas se registran en un tiempo fijado.',
              3: 'La Binomial Negativa cuenta ensayos/fallas discretas, no tiempo continuo.',
            },
            confusion: 'exponencial-vs-gamma',
            origen: 'curso',
          },
        ],
      },
      {
        id: 'parametros',
        titulo: 'Etapa 3: Parametrizar con Convención de Escala',
        descripcion: 'Define α (forma) y β (escala = 1/λ).',
        tipo: 'parametros',
        ejercicios: [
          {
            id: 'gam-par-01',
            tema: 'gamma',
            etapa: 'parametros',
            tipo: 'parametros',
            enunciado:
              'Una máquina falla a una tasa λ = 0.5 fallas por mes. Se desea calcular la distribución del tiempo hasta que ocurra la tercera falla (α = 3).',
            pistas_clave: ['α = 3 eventos', 'λ = 0.5', 'β escala = 1/λ = 2'],
            explicacion:
              'En Devore, Gamma usa β como parámetro de escala, siendo β = 1/λ = 1/0.5 = 2. El parámetro de forma es el número de eventos α = 3.',
            parametrosEsperados: [
              { name: 'α', symbol: 'α', expectedValue: 3, description: 'Parámetro de forma (número de eventos)' },
              { name: 'β', symbol: 'β', expectedValue: 2, description: 'Parámetro de escala (β = 1/λ)' },
            ],
            origen: 'curso',
          },
        ],
      },
      {
        id: 'calcular',
        titulo: 'Etapa 4: Calcular',
        descripcion: 'Resuelve el problema 9 del banco verificado del curso.',
        tipo: 'numerico',
        ejercicios: [
          {
            id: 'gam-cal-01',
            tema: 'gamma',
            etapa: 'calcular',
            tipo: 'numerico',
            enunciado:
              'Para un proceso con tasa λ = 0.5 (α = 3, β = 2), calcula la probabilidad de que el tiempo hasta el 3.er evento supere 6 unidades: P(X > 6).',
            pistas_clave: ['P(X > 6)', 'α = 3, β = 2', 'Equivalente a Poisson P(K < 3 con μ = 6 * 0.5 = 3)'],
            explicacion:
              'Que el tiempo hasta el 3.er evento sea mayor que 6 significa que en las primeras 6 unidades ocurrieron estrictamente MENOS de 3 eventos de Poisson con media μ = λt = 0.5 * 6 = 3: P(K ≤ 2) = e^(-3)[1 + 3 + 3^2/2] = e^(-3)[8.5] ≈ 0.42319 -> 0.4232.',
            valorEsperado: 0.4232,
            tolerancia: 0.002,
            unidad: 'probabilidad',
            pasosSolucion: [
              'Relación Gamma-Poisson: P(X > t) para Gamma(α, β=1/λ) es igual a P(K < α) para Poisson con μ = λt.',
              'μ = 0.5 * 6 = 3. α = 3.',
              'P(K ≤ 2) = p(0; 3) + p(1; 3) + p(2; 3).',
              'e^(-3) * (1 + 3 + 9/2) = e^(-3) * 8.5.',
              '0.049787 * 8.5 = 0.42319 -> 0.4232.',
            ],
            origen: 'curso',
          },
        ],
      },
      {
        id: 'contrastar',
        titulo: 'Etapa 5: Contrastar',
        descripcion: 'Verifica la relación de reducción cuando α = 1.',
        tipo: 'opcion-multiple',
        ejercicios: [
          {
            id: 'gam-con-01',
            tema: 'gamma',
            etapa: 'contrastar',
            tipo: 'opcion-multiple',
            enunciado:
              'Si una variable aleatoria sigue una distribución Gamma(α, β) con α = 1, ¿a qué distribución y con qué parámetro corresponde exactamente?',
            opciones: [
              'A una distribución Exponencial con parámetro λ = 1/β.',
              'A una distribución Normal estándar con media 0.',
              'A una distribución Poisson con media β.',
              'A una distribución Uniforme entre 0 y β.',
            ],
            correcta: 0,
            pistas_clave: ['α = 1 en Gamma', 'se reduce a Exponencial con λ = 1/β'],
            explicacion:
              'Al fijar α = 1, f(x; 1, β) = (1/β) e^(-x/β), que es la función de densidad de la Exponencial con tasa λ = 1/β.',
            confusion: 'exponencial-vs-gamma',
            origen: 'original',
          },
        ],
      },
    ],
  },

  // --- 7. NORMAL ---
  {
    id: 'normal',
    numero: 7,
    nombre: 'Distribución Normal',
    subtitulo: 'Variable continua simétrica con forma de campana y estandarización Z',
    contrastePrincipal: 'Aproximaciones: Binomial a Normal con corrección de continuidad ±0.5',
    notacion: 'N(\\mu, \\sigma^2)',
    variable: 'x: variable continua en (-\\\\infty, \\\\infty)',
    formula: 'f(x; \\mu, \\sigma) = \\frac{1}{\\sigma \\sqrt{2\\pi}} e^{-\\frac{(x - \\mu)^2}{2\\sigma^2}}, \\quad Z = \\frac{X - \\mu}{\\sigma}',
    esperanza: 'E(X) = \\mu',
    varianza: 'V(X) = \\sigma^2',
    advertencias: [
      'Para calcular probabilidades se estandariza con Z = (X - μ) / σ.',
      'Aproximación de Binomial a Normal: condiciones np ≥ 10 y n(1 - p) ≥ 10.',
      'Al aproximar una variable discreta por una continua, se DEBE aplicar la corrección por continuidad de ±0.5: P(X ≥ k) se convierte en P(X_norm ≥ k - 0.5).',
    ],
    etapas: [
      {
        id: 'pistas',
        titulo: 'Etapa 1: Pistas y Señales Clave',
        descripcion: 'Aprende cuándo usar estandarización y corrección por continuidad.',
        tipo: 'lectura',
        ejercicios: [],
        pistasTeoria: {
          titulo: '¿Cómo identificar la Distribución Normal y sus Aproximaciones?',
          senales: [
            'Variable continua con distribución simétrica acampanada alrededor de su media μ.',
            'Se especifica la media μ y la desviación estándar σ (o varianza σ²).',
            'O bien, proviene de una Binomial con n grande donde np ≥ 10 y n(1-p) ≥ 10.',
            'Para aproximar Binomial a Normal: μ = np, σ = √(np(1-p)), y corregir por ±0.5.',
          ],
          contraejemplo:
            'Si en una Binomial np < 5, NO use la Normal: use la aproximación de Poisson.',
          formulaClave: 'Z = \\frac{X - \\mu}{\\sigma}, \\quad P(a \\le X \\le b) = \\Phi\\left(\\frac{b - \\mu}{\\sigma}\\right) - \\Phi\\left(\\frac{a - \\mu}{\\sigma}\\right)',
        },
      },
      {
        id: 'reconocer',
        titulo: 'Etapa 2: Reconocer el Modelo y la Aproximación',
        descripcion: 'Evalúa cuándo corresponde Normal directa o aproximación.',
        tipo: 'opcion-multiple',
        ejercicios: [
          {
            id: 'nor-rec-01',
            tema: 'normal',
            etapa: 'reconocer',
            tipo: 'opcion-multiple',
            enunciado:
              'El diámetro de los pernos producidos por una máquina tiene distribución simétrica con media μ = 10.0 mm y desviación estándar σ = 0.03 mm. ¿Qué distribución permite calcular el porcentaje de pernos entre 9.97 mm y 10.06 mm?',
            opciones: ['Normal', 'Exponencial', 'Poisson', 'Binomial'],
            correcta: 0,
            pistas_clave: ['variable continua (diámetro en mm)', 'media μ = 10.0 y σ = 0.03', 'simétrica acampanada'],
            explicacion:
              'Es una variable continua simétrica con media y desviación conocidas: Distribución Normal N(10.0, 0.03^2).',
            confusion: 'discreta-vs-continua',
            origen: 'curso',
          },
          {
            id: 'nor-rec-02',
            tema: 'normal',
            etapa: 'reconocer',
            tipo: 'opcion-multiple',
            enunciado:
              'En una encuesta nacional se entrevistan n = 100 personas al azar con p = 0.25 a favor de una propuesta. Dado que np = 25 ≥ 10 y n(1-p) = 75 ≥ 10, ¿qué modelo continuo aproxima el número de personas a favor?',
            opciones: ['Normal con corrección por continuidad', 'Poisson con μ = 25', 'Gamma con α = 25', 'Exponencial con λ = 25'],
            correcta: 0,
            pistas_clave: ['np = 25 ≥ 10 y n(1-p) = 75 ≥ 10', 'aproximación a variable continua', 'corrección por continuidad ±0.5'],
            explicacion:
              'Cuando np ≥ 10 y n(1-p) ≥ 10, la suma de variables independientes converge a la Normal con μ = np = 25 y σ = √(np(1-p)) = √(18.75) ≈ 4.33, aplicando corrección por continuidad.',
            error_comun: {
              1: 'Poisson se usa cuando p es muy pequeño (p ≤ 0.01) y n grande. Aquí p = 0.25 es demasiado grande para Poisson.',
            },
            confusion: 'binomial-vs-normal-vs-poisson',
            origen: 'curso',
          },
        ],
      },
      {
        id: 'parametros',
        titulo: 'Etapa 3: Parametrizar y Estandarizar',
        descripcion: 'Calcula Z = (X - μ) / σ.',
        tipo: 'parametros',
        ejercicios: [
          {
            id: 'nor-par-01',
            tema: 'normal',
            etapa: 'parametros',
            tipo: 'parametros',
            enunciado:
              'Para un lote de pernos con μ = 10.0 y σ = 0.03, calcula los valores estandarizados Z para los límites x_1 = 9.97 y x_2 = 10.06.',
            pistas_clave: ['Z = (X - μ) / σ', 'Z_1 = (9.97 - 10) / 0.03 = -1.0', 'Z_2 = (10.06 - 10) / 0.03 = 2.0'],
            explicacion:
              'Z_1 = (9.97 - 10.0) / 0.03 = -0.03 / 0.03 = -1.0. Z_2 = (10.06 - 10.0) / 0.03 = 0.06 / 0.03 = 2.0.',
            parametrosEsperados: [
              { name: 'Z_1', symbol: 'Z_1', expectedValue: -1, description: 'Valor Z inferior' },
              { name: 'Z_2', symbol: 'Z_2', expectedValue: 2, description: 'Valor Z superior' },
            ],
            origen: 'curso',
          },
        ],
      },
      {
        id: 'calcular',
        titulo: 'Etapa 4: Calcular',
        descripcion: 'Resuelve los problemas 5 y 6 del banco verificado del curso.',
        tipo: 'numerico',
        ejercicios: [
          {
            id: 'nor-cal-01',
            tema: 'normal',
            etapa: 'calcular',
            tipo: 'numerico',
            enunciado:
              'Con μ = 10.0 y σ = 0.03, calcula la probabilidad de que un perno mida entre 9.97 mm y 10.06 mm: P(9.97 ≤ X ≤ 10.06).',
            pistas_clave: ['P(9.97 ≤ X ≤ 10.06) = Φ(2.0) - Φ(-1.0)', 'Φ(2.0) = 0.9772', 'Φ(-1.0) = 0.1587'],
            explicacion:
              'Z_1 = -1.0, Z_2 = 2.0. P(-1.0 ≤ Z ≤ 2.0) = Φ(2.0) - Φ(-1.0) = 0.97725 - 0.15866 = 0.81859 -> 0.8185.',
            valorEsperado: 0.8185,
            tolerancia: 0.002,
            unidad: 'probabilidad',
            pasosSolucion: [
              'Z_1 = (9.97 - 10) / 0.03 = -1.0.',
              'Z_2 = (10.06 - 10) / 0.03 = 2.0.',
              'Φ(2.0) ≈ 0.9772.',
              'Φ(-1.0) ≈ 0.1587.',
              '0.9772 - 0.1587 = 0.8185.',
            ],
            origen: 'curso',
          },
          {
            id: 'nor-cal-02',
            tema: 'normal',
            etapa: 'calcular',
            tipo: 'numerico',
            enunciado:
              'Aproximando una Binomial con n = 100 y p = 0.25 a la Normal con corrección de continuidad ±0.5, calcula P(X ≥ 30).',
            pistas_clave: ['μ = 25, σ = √18.75 ≈ 4.3301', 'P(X ≥ 30) con corrección = P(X_norm ≥ 29.5)', 'Z = (29.5 - 25) / 4.3301 = 1.04'],
            explicacion:
              'Con corrección por continuidad, P(X ≥ 30) = P(X_norm ≥ 29.5). Z = (29.5 - 25) / 4.330127 = 4.5 / 4.330127 = 1.03923 ≈ 1.04. 1 - Φ(1.04) = 1 - 0.8508 = 0.1492.',
            valorEsperado: 0.1492,
            tolerancia: 0.002,
            unidad: 'probabilidad',
            pasosSolucion: [
              'μ = np = 25. σ = √(100 * 0.25 * 0.75) = √18.75 ≈ 4.3301.',
              'Corrección de continuidad: P(X ≥ 30) -> P(X_norm ≥ 29.5).',
              'Z = (29.5 - 25) / 4.3301 = 1.0392 ≈ 1.04.',
              '1 - Φ(1.04) = 1 - 0.8508 = 0.1492.',
            ],
            origen: 'curso',
          },
        ],
      },
      {
        id: 'contrastar',
        titulo: 'Etapa 5: Contrastar (Las 3 Reglas de Aproximación)',
        descripcion: 'Domina cuándo aproximar a Poisson vs. cuándo aproximar a Normal.',
        tipo: 'opcion-multiple',
        ejercicios: [
          {
            id: 'nor-con-01',
            tema: 'normal',
            etapa: 'contrastar',
            tipo: 'opcion-multiple',
            enunciado:
              '¿Cuál es la diferencia fundamental para decidir aproximar una Binomial por Poisson o por la Normal?',
            opciones: [
              'Poisson se usa cuando p es muy pequeño (p ≤ 0.01) y np ≤ 20; la Normal se usa cuando tanto np ≥ 10 como n(1-p) ≥ 10.',
              'Poisson se usa para muestras impares y la Normal para muestras pares.',
              'La Normal solo se usa si la población es finita.',
              'Cualquiera de las dos produce exactamente el mismo resultado numérico.',
            ],
            correcta: 0,
            pistas_clave: ['Poisson para p raro/pequeño', 'Normal para np ≥ 10 y n(1-p) ≥ 10'],
            explicacion:
              'Poisson es la ley de los sucesos raros (p ≤ 0.01, np moderado). La Normal se sustenta en el Teorema Central del Límite y requiere un volumen suficiente de éxitos y fallas esperados (np ≥ 10 y n(1-p) ≥ 10).',
            confusion: 'binomial-vs-normal-vs-poisson',
            origen: 'original',
          },
        ],
      },
    ],
  },

  // --- 8. NIVEL INTEGRADOR ---
  {
    id: 'integrador',
    numero: 8,
    nombre: 'Nivel Integrador (Simulacro de Examen)',
    subtitulo: 'Los siete modelos mezclados al azar sin pistas del tema',
    contrastePrincipal: 'Prueba de validación real: decidir el modelo adecuado ante cualquier enunciado',
    notacion: 'Todos los modelos del curso',
    variable: 'Evaluación integral de toma de decisiones',
    formula: 'B(n, p) \\mid H(n, M, N) \\mid G(p) \\mid NB(r, p) \\mid P(\\lambda t) \\mid Exp(\\lambda) \\mid Gam(\\alpha, \\beta) \\mid N(\\mu, \\sigma^2)',
    esperanza: 'Integrador',
    varianza: 'Integrador',
    advertencias: [
      'Este nivel valida el objetivo pedagógico principal: "¿qué modelo uso y por qué?".',
      'El 80% o más de aciertos indica dominio del criterio de selección del curso Devore.',
    ],
    etapas: [
      {
        id: 'pistas',
        titulo: 'Etapa 1: Árbol de Decisión Rápido',
        descripcion: 'Repasa el mapa mental antes de comenzar el simulacro.',
        tipo: 'lectura',
        ejercicios: [],
        pistasTeoria: {
          titulo: 'Árbol de Decisión para el Examen',
          senales: [
            '1. ¿La variable es DISCRETA o CONTINUA?',
            '2. Si es DISCRETA: ¿cuenta éxitos en n fijo (Binomial / Hipergeométrica) o cuenta hasta alcanzar el éxito (Geométrica / Binomial Negativa) o cuenta ocurrencias en intervalo continuo (Poisson)?',
            '3. Si es CONTINUA: ¿mide tiempo hasta el primer evento (Exponencial), hasta el α-ésimo evento (Gamma), o es simétrica acampanada (Normal)?',
          ],
          contraejemplo:
            'Nunca memorices palabras clave aisladas; analiza la física del experimento: ¿qué se fijó de antemano y qué es la variable aleatoria?',
          formulaClave: '\\text{Decisión} = f(\\text{tipo de variable}, \\text{fijado vs aleatorio}, \\text{dependencia})',
        },
      },
      {
        id: 'reconocer',
        titulo: 'Etapa 2: Diagnóstico Mixto (15 Casos)',
        descripcion: 'Clasifica los siguientes enunciados reales sin pistas previas.',
        tipo: 'opcion-multiple',
        ejercicios: [
          {
            id: 'int-rec-01',
            tema: 'integrador',
            etapa: 'reconocer',
            tipo: 'opcion-multiple',
            enunciado:
              'Un radar marítimo registra en promedio 1.5 avistamientos por hora. ¿Cuál es el modelo para el tiempo que transcurrirá hasta detectar la próxima embarcación?',
            opciones: ['Exponencial', 'Poisson', 'Geométrica', 'Normal'],
            correcta: 0,
            pistas_clave: ['tiempo continuo', 'hasta detectar la PRÓXIMA (1er evento)', 'tasa 1.5/h'],
            explicacion: 'Mide tiempo continuo hasta el primer suceso de un proceso de Poisson: Exponencial.',
            confusion: 'poisson-vs-exponencial',
            origen: 'original',
          },
          {
            id: 'int-rec-02',
            tema: 'integrador',
            etapa: 'reconocer',
            tipo: 'opcion-multiple',
            enunciado:
              'Una caja contiene 12 bombillos de los cuales 3 están fundidos. Si se eligen 4 bombillos al azar para una lámpara sin reemplazo, ¿qué distribución describe los bombillos fundidos en la muestra?',
            opciones: ['Hipergeométrica', 'Binomial', 'Binomial Negativa', 'Poisson'],
            correcta: 0,
            pistas_clave: ['12 bombillos totales (N = 12)', '3 fundidos (M = 3)', '4 elegidos sin reemplazo'],
            explicacion: 'Población finita sin reemplazo donde n/N = 4/12 = 0.33 > 0.05: Hipergeométrica.',
            confusion: 'binomial-vs-hipergeometrica',
            origen: 'original',
          },
          {
            id: 'int-rec-03',
            tema: 'integrador',
            etapa: 'reconocer',
            tipo: 'opcion-multiple',
            enunciado:
              'Un tirador experto tiene una probabilidad del 85% de acertar a una diana. Si dispara 8 veces de forma independiente, ¿qué modelo describe el total de impactos certeros?',
            opciones: ['Binomial', 'Geométrica', 'Poisson', 'Hipergeométrica'],
            correcta: 0,
            pistas_clave: ['8 disparos fijos (n = 8)', 'probabilidad constante p = 0.85', 'conteo de éxitos'],
            explicacion: 'Número fijo de ensayos independientes con probabilidad constante: Binomial.',
            confusion: 'general',
            origen: 'original',
          },
          {
            id: 'int-rec-04',
            tema: 'integrador',
            etapa: 'reconocer',
            tipo: 'opcion-multiple',
            enunciado:
              'En una planta química ocurren microfugas con tasa λ = 0.2 por mes. Se desea modelar el tiempo en meses hasta que se acumulen 4 microfugas.',
            opciones: ['Gamma', 'Exponencial', 'Poisson', 'Binomial Negativa'],
            correcta: 0,
            pistas_clave: ['tiempo continuo', 'hasta acumular α = 4 eventos', 'tasa 0.2'],
            explicacion: 'Tiempo continuo hasta el α-ésimo evento de Poisson: Gamma con α = 4 y β = 1/0.2 = 5.',
            confusion: 'exponencial-vs-gamma',
            origen: 'original',
          },
          {
            id: 'int-rec-05',
            tema: 'integrador',
            etapa: 'reconocer',
            tipo: 'opcion-multiple',
            enunciado:
              'Un operario inspecciona bombillos uno a uno hasta encontrar el primer bombillo defectuoso, contando el número de bombillos inspeccionados.',
            opciones: ['Geométrica', 'Binomial', 'Binomial Negativa', 'Hipergeométrica'],
            correcta: 0,
            pistas_clave: ['inspecciona hasta encontrar el primer defectuoso', 'cuenta ensayos'],
            explicacion: 'Número de ensayos hasta observar el primer éxito: Distribución Geométrica g(x; p).',
            confusion: 'binomial-vs-geometrica-nb',
            origen: 'original',
          },
        ],
      },
      {
        id: 'parametros',
        titulo: 'Etapa 3: Parametrizar en Modo Examen',
        descripcion: 'Extrae con agilidad los parámetros ante enunciados complejos.',
        tipo: 'parametros',
        ejercicios: [
          {
            id: 'int-par-01',
            tema: 'integrador',
            etapa: 'parametros',
            tipo: 'parametros',
            enunciado:
              'Un proceso de Poisson genera partículas a razón de 3 por segundo. Se estudia un intervalo de observación de 4 segundos.',
            pistas_clave: ['λ = 3/s', 't = 4 s', 'μ = λt = 12'],
            explicacion: 'La media escalada es μ = 3 * 4 = 12.',
            parametrosEsperados: [
              { name: 'μ', symbol: 'μ', expectedValue: 12, description: 'Media escalada para 4 segundos' },
            ],
            origen: 'original',
          },
        ],
      },
      {
        id: 'calcular',
        titulo: 'Etapa 4: Batería de Cálculo Rápido',
        descripcion: 'Resuelve problemas combinados con la calculadora de apoyo.',
        tipo: 'numerico',
        ejercicios: [
          {
            id: 'int-cal-01',
            tema: 'integrador',
            etapa: 'calcular',
            tipo: 'numerico',
            enunciado:
              'Una variable Exponencial tiene tasa λ = 0.5. Calcula P(X > 4).',
            pistas_clave: ['P(X > 4) = e^(-λ * x)', 'e^(-0.5 * 4) = e^(-2)'],
            explicacion: 'P(X > 4) = e^(-0.5 * 4) = e^(-2) ≈ 0.135335 -> 0.1353.',
            valorEsperado: 0.1353,
            tolerancia: 0.0005,
            unidad: 'probabilidad',
            pasosSolucion: ['P(X > 4) = e^(-2) = 0.1353.'],
            origen: 'original',
          },
        ],
      },
      {
        id: 'contrastar',
        titulo: 'Etapa 5: Contrastar Confusiones Críticas',
        descripcion: 'Demuestra maestría en los 5 contrastes clave del curso.',
        tipo: 'detecta-error',
        ejercicios: [
          {
            id: 'int-con-01',
            tema: 'integrador',
            etapa: 'contrastar',
            tipo: 'detecta-error',
            enunciado:
              'En una prueba de control, se afirma: "Si tomamos 5 tornillos de una caja de 10 tornillos donde 3 son defectuosos, podemos modelar los defectuosos con una Binomial porque tornillo defectuoso es éxito y no defectuoso es falla".\n\n¿Por qué es falsa esta afirmación?',
            opciones: [
              'Porque la muestra (5) representa el 50% de la población (10): al no haber reemplazo, la probabilidad cambia y se viola la independencia. Debe usarse Hipergeométrica.',
              'Porque la probabilidad de defecto en tornillos siempre debe seguir una Normal.',
              'Porque se debe usar Poisson ya que 10 es un número pequeño.',
              'No es falsa, es perfectamente válida.',
            ],
            correcta: 0,
            pistas_clave: ['n/N = 5/10 = 0.5 > 0.05', 'viola independencia', 'Hipergeométrica obligatoria'],
            explicacion: 'Muestreo sin reemplazo con n/N > 0.05 exige Hipergeométrica.',
            confusion: 'binomial-vs-hipergeometrica',
            origen: 'original',
          },
        ],
      },
    ],
  },
];
