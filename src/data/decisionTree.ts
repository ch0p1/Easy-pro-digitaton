import { TopicId } from '../types';

export interface DecisionNode {
  id: string;
  question: string;
  clue?: string;
  options: {
    label: string;
    description: string;
    nextNodeId?: string;
    resultTopic?: TopicId;
    resultNotes?: string;
  }[];
}

export const DECISION_TREE: Record<string, DecisionNode> = {
  root: {
    id: 'root',
    question: '1. ¿Qué tipo de variable aleatoria describe el problema?',
    clue: 'Revisa las unidades de medida: ¿son conteos de elementos enteros (0, 1, 2...) o magnitudes medibles continuas (tiempo, peso, distancia)?',
    options: [
      {
        label: 'Variable Discreta (Conteos enteros)',
        description: 'Cuenta número de defectuosos, tiros acertados, fallas o llamadas enteras.',
        nextNodeId: 'discreta_branch',
      },
      {
        label: 'Variable Continua (Tiempo, distancias, medidas)',
        description: 'Mide tiempo de espera, minutos, longitud en mm, etc.',
        nextNodeId: 'continua_branch',
      },
    ],
  },

  discreta_branch: {
    id: 'discreta_branch',
    question: '2. En tu variable discreta, ¿qué es exactamente lo que estás contando?',
    options: [
      {
        label: 'Éxitos en un número FIJO de intentos (n)',
        description: 'Se conoce de antemano el total de ensayos n y se cuenta cuántos salieron bien.',
        nextNodeId: 'fijo_branch',
      },
      {
        label: 'Intentos o fallas HASTA alcanzar el éxito',
        description: 'No sabes cuántos intentos harás; sigues probando hasta lograr una meta de éxitos.',
        nextNodeId: 'hasta_exito_branch',
      },
      {
        label: 'Ocurrencias en un intervalo continuo de tiempo o espacio',
        description: 'Llegadas de clientes por hora, defectos por metro de tela con tasa λ.',
        resultTopic: 'poisson',
        resultNotes:
          'Distribución de Poisson p(x; μ) con μ = λt. Recuerda escalar la tasa si el intervalo difiere de la unidad dada.',
      },
    ],
  },

  fijo_branch: {
    id: 'fijo_branch',
    question: '3. ¿Cómo se realiza la extracción o los ensayos?',
    options: [
      {
        label: 'Independientes con probabilidad CONSTANTE p (o con reemplazo / producción masiva)',
        description: 'La probabilidad no cambia tras cada extracción (n/N ≤ 0.05).',
        nextNodeId: 'binomial_check_approx',
      },
      {
        label: 'SIN reemplazo en una población finita conocida N',
        description: 'Se extraen n elementos de una caja con M éxitos y la fracción n/N > 0.05.',
        resultTopic: 'hipergeometrica',
        resultNotes:
          'Distribución Hipergeométrica h(x; n, M, N). Si n/N ≤ 0.05, puedes aproximarla por Binomial con p = M/N.',
      },
    ],
  },

  binomial_check_approx: {
    id: 'binomial_check_approx',
    question: '4. ¿Se cumplen condiciones especiales de aproximación?',
    options: [
      {
        label: 'No / Caso estándar Binomial',
        description: 'n moderado, se evalúa con la fórmula b(x; n, p).',
        resultTopic: 'binomial',
        resultNotes: 'Distribución Binomial b(x; n, p). E(X) = np, V(X) = np(1-p).',
      },
      {
        label: 'n muy grande (≥ 100) y p muy pequeño (≤ 0.01) con np ≤ 20',
        description: 'Ley de los sucesos raros.',
        resultTopic: 'poisson',
        resultNotes:
          'Aproximación de Binomial a Poisson con media μ = np.',
      },
      {
        label: 'np ≥ 10 y n(1 - p) ≥ 10',
        description: 'Muestra suficientemente grande en éxitos y fallas.',
        resultTopic: 'normal',
        resultNotes:
          'Aproximación de Binomial a Normal con μ = np, σ = √(np(1-p)) y corrección por continuidad ±0.5.',
      },
    ],
  },

  hasta_exito_branch: {
    id: 'hasta_exito_branch',
    question: '5. ¿Hasta cuántos éxitos se continúa ensayando?',
    options: [
      {
        label: 'Hasta el PRIMER éxito (r = 1) y cuentas ensayos (x ≥ 1)',
        description: 'Ejemplo: ¿en qué intento emboca el primer tiro?',
        resultTopic: 'geometrica-nb',
        resultNotes:
          'Distribución Geométrica g(x; p) = (1-p)^(x-1) * p. En Devore cuenta ensayos (x = 1, 2, ...). E(X) = 1/p.',
      },
      {
        label: 'Hasta el r-ésimo éxito (r > 1 o r fijado) y cuentas fallas (x ≥ 0)',
        description: 'Ejemplo: ¿cuántos candidatos rechaza antes de contratar a 4?',
        resultTopic: 'geometrica-nb',
        resultNotes:
          'Distribución Binomial Negativa nb(x; r, p) = C(x+r-1, r-1) * p^r * (1-p)^x. En Devore cuenta fallas (x = 0, 1, ...). E(X) = r(1-p)/p.',
      },
    ],
  },

  continua_branch: {
    id: 'continua_branch',
    question: '6. ¿Qué describe tu variable continua?',
    options: [
      {
        label: 'Tiempo continuo hasta que ocurre el SIGUIENTE evento de Poisson (1 evento)',
        description: 'Tiempo entre llegadas sucesivas, duración con decaimiento constante.',
        resultTopic: 'exponencial',
        resultNotes:
          'Distribución Exponencial Exp(λ) con F(x) = 1 - e^(-λx). Carencia de memoria. E(X) = 1/λ, V(X) = 1/λ².',
      },
      {
        label: 'Tiempo continuo hasta acumular α eventos de Poisson (α > 1)',
        description: 'Tiempo hasta registrar la 3ª partícula, o la 5ª falla.',
        resultTopic: 'gamma',
        resultNotes:
          'Distribución Gamma Gama(α, β) con β = 1/λ (escala según Devore). E(X) = αβ, V(X) = αβ².',
      },
      {
        label: 'Medida continua simétrica con forma de campana (media μ y desviación σ conocidas)',
        description: 'Pesos, diámetros, longitudes de piezas producidas por máquinas.',
        resultTopic: 'normal',
        resultNotes:
          'Distribución Normal N(μ, σ²). Se estandariza mediante Z = (X - μ) / σ.',
      },
    ],
  },
};
