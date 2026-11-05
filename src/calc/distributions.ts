/**
 * Easy Pro - Motor de Cálculo Estadístico
 * Implementación de distribuciones de probabilidad según el texto guía Devore.
 * Valida automáticamente con el banco de 10 ejercicios del curso (Sección 9).
 */

// --- Funciones auxiliares y combinatoria ---

export function logGamma(z: number): number {
  // Coeficientes de Lanczos para aproximación de log(Gamma(z))
  const p = [
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.138571095857209,
    9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  if (z < 0.5) {
    return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  }
  z -= 1;
  let x = 0.99999999999980993;
  for (let i = 0; i < p.length; i++) {
    x += p[i] / (z + i + 1);
  }
  const t = z + p.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

export function gamma(z: number): number {
  return Math.exp(logGamma(z));
}

export function logFactorial(n: number): number {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 0;
  return logGamma(n + 1);
}

export function combinations(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  if (k > n / 2) k = n - k;
  // Para valores moderados usar producto directo
  if (n < 30) {
    let res = 1;
    for (let i = 1; i <= k; i++) {
      res = (res * (n - i + 1)) / i;
    }
    return Math.round(res);
  }
  return Math.round(Math.exp(logFactorial(n) - logFactorial(k) - logFactorial(n - k)));
}

/** log C(n, k) en escala logarítmica: evita el desbordamiento de C(n, k) para n grande. */
export function logCombinations(n: number, k: number): number {
  if (k < 0 || k > n) return -Infinity;
  if (k === 0 || k === n) return 0;
  return logFactorial(n) - logFactorial(k) - logFactorial(n - k);
}

// Umbral desde el cual se calcula en escala logarítmica (por debajo, C(n,k) exacto y rápido).
const LOG_SPACE_THRESHOLD = 30;

// Función de error (erf): aproximación de Abramowitz & Stegun 7.1.26 (error absoluto máx. 1.5e-7)
export function erf(x: number): number {
  // Constantes de aproximación de Abramowitz & Stegun (7.1.26)
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t) * Math.exp(-absX * absX);

  return sign * y;
}

// Tope de iteraciones: la convergencia requiere del orden de sqrt(a) términos (a grande => más).
const MAX_GAMMA_ITER = 100000;

// Función gamma incompleta regularizada P(a, x) = gamma(a, x) / Gamma(a)
export function regularizedGammaP(a: number, x: number): number {
  if (x <= 0) return 0;
  if (a <= 0) return NaN;

  // Si x < a + 1 usamos serie de potencias
  if (x < a + 1.0) {
    let ap = a;
    let del = 1.0 / a;
    let sum = del;
    for (let n = 1; n <= MAX_GAMMA_ITER; n++) {
      ap += 1.0;
      del *= x / ap;
      sum += del;
      if (Math.abs(del) < Math.abs(sum) * 1e-15) {
        break;
      }
    }
    return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
  } else {
    // Fracción continua de Legendre para x >= a + 1
    let b = x + 1.0 - a;
    let c = 1.0 / 1e-30;
    let d = 1.0 / b;
    let h = d;
    for (let i = 1; i <= MAX_GAMMA_ITER; i++) {
      const an = -i * (i - a);
      b += 2.0;
      d = an * d + b;
      if (Math.abs(d) < 1e-30) d = 1e-30;
      c = b + an / c;
      if (Math.abs(c) < 1e-30) c = 1e-30;
      d = 1.0 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1.0) < 1e-15) {
        break;
      }
    }
    const q = Math.exp(-x + a * Math.log(x) - logGamma(a)) * h;
    return 1.0 - q;
  }
}

// --- 1. Binomial b(x; n, p) ---
export const binomial = {
  pmf(x: number, n: number, p: number): number {
    if (x < 0 || x > n || !Number.isInteger(x)) return 0;
    if (p === 0) return x === 0 ? 1 : 0;
    if (p === 1) return x === n ? 1 : 0;
    if (n < LOG_SPACE_THRESHOLD) {
      return combinations(n, x) * Math.pow(p, x) * Math.pow(1 - p, n - x);
    }
    return Math.exp(logCombinations(n, x) + x * Math.log(p) + (n - x) * Math.log1p(-p));
  },
  cdf(x: number, n: number, p: number): number {
    if (x < 0) return 0;
    if (x >= n) return 1;
    let sum = 0;
    const floorX = Math.floor(x);
    for (let i = 0; i <= floorX; i++) {
      sum += binomial.pmf(i, n, p);
    }
    return Math.min(1, sum);
  },
  mean(n: number, p: number): number {
    return n * p;
  },
  variance(n: number, p: number): number {
    return n * p * (1 - p);
  },
};

// --- 2. Hipergeométrica h(x; n, M, N) ---
export const hypergeometric = {
  pmf(x: number, n: number, M: number, N: number): number {
    if (x < 0 || x > n || !Number.isInteger(x)) return 0;
    if (x > M || n - x > N - M) return 0;
    if (N < LOG_SPACE_THRESHOLD) {
      return (combinations(M, x) * combinations(N - M, n - x)) / combinations(N, n);
    }
    return Math.exp(
      logCombinations(M, x) + logCombinations(N - M, n - x) - logCombinations(N, n)
    );
  },
  cdf(x: number, n: number, M: number, N: number): number {
    const minX = Math.max(0, n - (N - M));
    const maxX = Math.min(n, M);
    if (x < minX) return 0;
    if (x >= maxX) return 1;
    let sum = 0;
    for (let i = minX; i <= Math.floor(x); i++) {
      sum += hypergeometric.pmf(i, n, M, N);
    }
    return Math.min(1, sum);
  },
  mean(n: number, M: number, N: number): number {
    return (n * M) / N;
  },
  variance(n: number, M: number, N: number): number {
    return ((N - n) / (N - 1)) * n * (M / N) * (1 - M / N);
  },
};

// --- 3. Geométrica g(x; p) (Cuenta ENSAYOS hasta el 1er éxito: x = 1, 2, ...) ---
export const geometric = {
  pmf(x: number, p: number): number {
    if (x < 1 || !Number.isInteger(x)) return 0;
    return Math.pow(1 - p, x - 1) * p;
  },
  cdf(x: number, p: number): number {
    if (x < 1) return 0;
    return 1 - Math.pow(1 - p, Math.floor(x));
  },
  mean(p: number): number {
    return 1 / p;
  },
  variance(p: number): number {
    return (1 - p) / (p * p);
  },
};

// --- 4. Binomial Negativa nb(x; r, p) (Cuenta FALLAS antes del r-ésimo éxito: x = 0, 1, ...) ---
export const negativeBinomial = {
  pmf(x: number, r: number, p: number): number {
    if (x < 0 || !Number.isInteger(x)) return 0;
    if (p === 1) return x === 0 ? 1 : 0;
    if (x + r - 1 < LOG_SPACE_THRESHOLD) {
      return combinations(x + r - 1, r - 1) * Math.pow(p, r) * Math.pow(1 - p, x);
    }
    return Math.exp(logCombinations(x + r - 1, r - 1) + r * Math.log(p) + x * Math.log1p(-p));
  },
  cdf(x: number, r: number, p: number): number {
    if (x < 0) return 0;
    let sum = 0;
    for (let i = 0; i <= Math.floor(x); i++) {
      sum += negativeBinomial.pmf(i, r, p);
    }
    return Math.min(1, sum);
  },
  mean(r: number, p: number): number {
    return (r * (1 - p)) / p;
  },
  variance(r: number, p: number): number {
    return (r * (1 - p)) / (p * p);
  },
};

// --- 5. Poisson p(x; mu) con mu = lambda * t ---
export const poisson = {
  pmf(x: number, mu: number): number {
    if (x < 0 || !Number.isInteger(x) || mu < 0) return 0;
    if (mu === 0) return x === 0 ? 1 : 0;
    // Log-space para evitar overflow
    const logP = -mu + x * Math.log(mu) - logFactorial(x);
    return Math.exp(logP);
  },
  cdf(x: number, mu: number): number {
    if (x < 0) return 0;
    let sum = 0;
    for (let i = 0; i <= Math.floor(x); i++) {
      sum += poisson.pmf(i, mu);
    }
    return Math.min(1, sum);
  },
  mean(mu: number): number {
    return mu;
  },
  variance(mu: number): number {
    return mu;
  },
};

// --- 6. Exponencial Exp(lambda), con beta = 1/lambda ---
export const exponential = {
  pdf(x: number, lambda: number): number {
    if (x < 0 || lambda <= 0) return 0;
    return lambda * Math.exp(-lambda * x);
  },
  cdf(x: number, lambda: number): number {
    if (x <= 0 || lambda <= 0) return 0;
    return 1 - Math.exp(-lambda * x);
  },
  mean(lambda: number): number {
    return 1 / lambda;
  },
  variance(lambda: number): number {
    return 1 / (lambda * lambda);
  },
};

// --- 7. Gamma Gama(alpha, beta) con beta escala = 1/lambda ---
export const gammaDist = {
  pdf(x: number, alpha: number, beta: number): number {
    if (x <= 0 || alpha <= 0 || beta <= 0) return 0;
    const logVal =
      (alpha - 1) * Math.log(x) - x / beta - alpha * Math.log(beta) - logGamma(alpha);
    return Math.exp(logVal);
  },
  cdf(x: number, alpha: number, beta: number): number {
    if (x <= 0 || alpha <= 0 || beta <= 0) return 0;
    return regularizedGammaP(alpha, x / beta);
  },
  mean(alpha: number, beta: number): number {
    return alpha * beta;
  },
  variance(alpha: number, beta: number): number {
    return alpha * beta * beta;
  },
};

// --- 8. Normal N(mu, sigma^2) ---
export const normal = {
  pdf(x: number, mu: number, sigma: number): number {
    if (sigma <= 0) return 0;
    const factor = 1 / (sigma * Math.sqrt(2 * Math.PI));
    const expTerm = -0.5 * Math.pow((x - mu) / sigma, 2);
    return factor * Math.exp(expTerm);
  },
  cdf(x: number, mu: number, sigma: number): number {
    if (sigma <= 0) return x >= mu ? 1 : 0;
    const z = (x - mu) / sigma;
    return 0.5 * (1 + erf(z / Math.SQRT2));
  },
  range(a: number, b: number, mu: number, sigma: number): number {
    return normal.cdf(b, mu, sigma) - normal.cdf(a, mu, sigma);
  },
  mean(mu: number): number {
    return mu;
  },
  variance(sigma: number): number {
    return sigma * sigma;
  },
};

// --- Banco de validación del curso (Sección 9) ---
export interface CourseExerciseValidation {
  id: number;
  tema: string;
  descripcion: string;
  valorCalculado: number;
  valorEsperado: number;
  tolerancia: number;
  pasa: boolean;
}

export function validateCourseBank(): CourseExerciseValidation[] {
  // 1. Exponencial: media 3 min (lambda = 1/3), P(X <= 5) = 0.8111
  const ex1 = exponential.cdf(5, 1 / 3);

  // 2. Binomial: n = 6, p = 0.75, P(X = 4) = 0.2966
  const ex2 = binomial.pmf(4, 6, 0.75);

  // 3. Hipergeométrica: N = 20, M = 5, n = 4, P(X = 2) = 0.2167
  const ex3 = hypergeometric.pmf(2, 4, 5, 20);

  // 4. Poisson: lambda = 2 por metro, 2 metros (mu = 4), P(X = 3) = 0.1954
  const ex4 = poisson.pmf(3, 4);

  // 5. Normal: mu = 10.0, sigma = 0.03, P(9.97 <= X <= 10.06) = 0.8185
  const ex5 = normal.range(9.97, 10.06, 10.0, 0.03);

  // 6. Binomial a Normal: n = 100, p = 0.25, corrección +-0.5, P(X >= 30) = 0.1492
  // mu = 25, var = 18.75, std = sqrt(18.75). P(X >= 30) con corrección = P(X >= 29.5)
  // Z = (29.5 - 25) / sqrt(18.75) = 4.5 / 4.330127 = 1.03923 -> 1 - Phi(1.03923)
  const muBin = 100 * 0.25;
  const stdBin = Math.sqrt(100 * 0.25 * 0.75);
  const ex6 = 1 - normal.cdf(29.5, muBin, stdBin);

  // 7. Geométrica: p = 0.20, primer éxito en el 5º ensayo: g(5; 0.20) = 0.0819
  const ex7 = geometric.pmf(5, 0.2);

  // 8. Binomial negativa: r = 4, p = 0.60, 3 fallas antes del 4º éxito: nb(3; 4, 0.60) = 0.1659
  const ex8 = negativeBinomial.pmf(3, 4, 0.6);

  // 9. Gamma: lambda = 0.5 (alpha = 3, beta = 2), P(X > 6) = 0.4232
  const ex9 = 1 - gammaDist.cdf(6, 3, 2);

  // 10. Binomial a Poisson: n = 2000, p = 0.002 (mu = 4), P(X = 3) = 0.1954
  const ex10 = poisson.pmf(3, 4);

  const tests: CourseExerciseValidation[] = [
    {
      id: 1,
      tema: 'Exponencial',
      descripcion: 'media 3 min (λ = 1/3), P(X ≤ 5)',
      valorCalculado: Number(ex1.toFixed(4)),
      valorEsperado: 0.8111,
      tolerancia: 0.0005,
      pasa: Math.abs(ex1 - 0.8111) <= 0.0005,
    },
    {
      id: 2,
      tema: 'Binomial',
      descripcion: 'n = 6, p = 0.75, P(X = 4)',
      valorCalculado: Number(ex2.toFixed(4)),
      valorEsperado: 0.2966,
      tolerancia: 0.0005,
      pasa: Math.abs(ex2 - 0.2966) <= 0.0005,
    },
    {
      id: 3,
      tema: 'Hipergeométrica',
      descripcion: 'N = 20, M = 5, n = 4, P(X = 2)',
      valorCalculado: Number(ex3.toFixed(4)),
      valorEsperado: 0.2167,
      tolerancia: 0.0005,
      pasa: Math.abs(ex3 - 0.2167) <= 0.0005,
    },
    {
      id: 4,
      tema: 'Poisson',
      descripcion: 'λ = 2/m, 2m (μ = 4), P(X = 3)',
      valorCalculado: Number(ex4.toFixed(4)),
      valorEsperado: 0.1954,
      tolerancia: 0.0005,
      pasa: Math.abs(ex4 - 0.1954) <= 0.0005,
    },
    {
      id: 5,
      tema: 'Normal',
      descripcion: 'μ = 10.0, σ = 0.03, P(9.97 ≤ X ≤ 10.06)',
      valorCalculado: Number(ex5.toFixed(4)),
      valorEsperado: 0.8185,
      tolerancia: 0.002,
      pasa: Math.abs(ex5 - 0.8185) <= 0.002,
    },
    {
      id: 6,
      tema: 'Binomial a Normal',
      descripcion: 'n = 100, p = 0.25, corrección ±0.5, P(X ≥ 30)',
      valorCalculado: Number(ex6.toFixed(4)),
      valorEsperado: 0.1492,
      tolerancia: 0.002,
      pasa: Math.abs(ex6 - 0.1492) <= 0.002,
    },
    {
      id: 7,
      tema: 'Geométrica',
      descripcion: 'p = 0.20, primer éxito en el 5º ensayo',
      valorCalculado: Number(ex7.toFixed(4)),
      valorEsperado: 0.0819,
      tolerancia: 0.0005,
      pasa: Math.abs(ex7 - 0.0819) <= 0.0005,
    },
    {
      id: 8,
      tema: 'Binomial negativa',
      descripcion: 'r = 4, p = 0.60, 3 fallas antes del 4º éxito',
      valorCalculado: Number(ex8.toFixed(4)),
      valorEsperado: 0.1659,
      tolerancia: 0.0005,
      pasa: Math.abs(ex8 - 0.1659) <= 0.0005,
    },
    {
      id: 9,
      tema: 'Gamma',
      descripcion: 'λ = 0.5 (α = 3, β = 2), P(X > 6)',
      valorCalculado: Number(ex9.toFixed(4)),
      valorEsperado: 0.4232,
      tolerancia: 0.002,
      pasa: Math.abs(ex9 - 0.4232) <= 0.002,
    },
    {
      id: 10,
      tema: 'Binomial a Poisson',
      descripcion: 'n = 2000, p = 0.002 (μ = 4), P(X = 3)',
      valorCalculado: Number(ex10.toFixed(4)),
      valorEsperado: 0.1954,
      tolerancia: 0.0005,
      pasa: Math.abs(ex10 - 0.1954) <= 0.0005,
    },
  ];

  return tests;
}
