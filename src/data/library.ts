import { TopicId } from '../types';

export interface LibraryTopicResource {
  topicId: TopicId;
  nombre: string;
  comoReconocerlo: {
    claves: string[];
    trampaTipica: string;
    preguntaDeControl: string;
  };
  teoria: {
    resumen: string;
    supuestos: string[];
    propiedades: string[];
    videoId?: string;
  };
  pythonCode: string;
  rCode: string;
  geogebraGuia: string;
  calculadoraGuia: string;
}

export const LIBRARY_DATA: Record<TopicId, LibraryTopicResource> = {
  binomial: {
    topicId: 'binomial',
    nombre: 'Distribución Binomial',
    comoReconocerlo: {
      claves: [
        'Número fijo de ensayos n establecido antes de iniciar el experimento.',
        'Solo dos resultados posibles por ensayo: éxito (S) o falla (F).',
        'Probabilidad de éxito p idéntica y constante en cada ensayo.',
        'Ensayos mutuamente independientes (con reemplazo o de población masiva).',
      ],
      trampaTipica:
        'Confundir con Hipergeométrica cuando el enunciado menciona una muestra sin reemplazo de una población pequeña (n/N > 0.05).',
      preguntaDeControl:
        '¿El enunciado dice cuántos ensayos se realizan en total ANTES de empezar? Si sí -> Binomial.',
    },
    teoria: {
      resumen:
        'Modela el número total de éxitos en n ensayos de Bernoulli idénticos e independientes. Su función de masa de probabilidad es b(x; n, p) = C(n, x) * p^x * (1-p)^(n-x).',
      supuestos: [
        'El experimento consiste en n ensayos idénticos.',
        'Cada ensayo termina en éxito o falla.',
        'La probabilidad de éxito p permanece constante.',
        'Los ensayos son independientes.',
      ],
      propiedades: ['E(X) = n * p', 'V(X) = n * p * (1 - p)', 'Desviación estándar: σ = √(np(1-p))'],
      videoId: 'bXvK7gZ20rU',
    },
    pythonCode: `# Binomial en Python con SciPy
from scipy.stats import binom

n, p, x = 6, 0.75, 4

# P(X = 4) exacto
p_exacto = binom.pmf(x, n, p)
print(f"P(X = 4) = {p_exacto:.4f}")  # 0.2966

# P(X <= 4) acumulado
p_acum = binom.cdf(x, n, p)
print(f"P(X <= 4) = {p_acum:.4f}")

# Media y varianza
media, var = binom.stats(n, p, moments='mv')
print(f"Media = {media}, Varianza = {var}")`,
    rCode: `# Binomial en R
n <- 6
p <- 0.75
x <- 4

# P(X = 4)
dbinom(x, size = n, prob = p) # 0.2966

# P(X <= 4)
pbinom(x, size = n, prob = p)

# Media y varianza
media <- n * p
varianza <- n * p * (1 - p)`,
    geogebraGuia:
      'En GeoGebra: 1. Abre el menú "Cálculos de Probabilidad". 2. Selecciona "Binomial". 3. Configura n = 6 y p = 0.75. 4. Selecciona el intervalo deseado (igualdad o acumulado).',
    calculadoraGuia:
      'En CASIO fx-991LA / ClassWiz: Menú -> Distribución (7) -> Binomial PD (4) -> Variable (2). Ingresa x = 4, N = 6, p = 0.75 -> Presiona "=" -> Resultado: 0.29663.',
  },

  hipergeometrica: {
    topicId: 'hipergeometrica',
    nombre: 'Distribución Hipergeométrica',
    comoReconocerlo: {
      claves: [
        'Población finita de tamaño N con M éxitos y N - M fallas.',
        'Se extrae una muestra de n elementos de manera simultánea o SIN reemplazo.',
        'La probabilidad de éxito cambia en cada extracción.',
        'Fracción de muestreo n / N > 0.05.',
      ],
      trampaTipica:
        'Usar la Binomial cuando la extracción es sin reemplazo en una población pequeña.',
      preguntaDeControl:
        '¿Las extracciones se hacen sin devolver los elementos a una población finita? Si sí -> Hipergeométrica.',
    },
    teoria: {
      resumen:
        'Modela el número de éxitos en una muestra de n observaciones tomadas sin reemplazo de una población finita N que contiene exactamente M éxitos.',
      supuestos: [
        'Población finita de N elementos.',
        'M elementos etiquetados como éxitos, N-M como fallas.',
        'Muestra de n elementos tomada sin reemplazo.',
      ],
      propiedades: [
        'E(X) = n * (M / N)',
        'V(X) = [(N - n)/(N - 1)] * n * (M/N) * (1 - M/N)',
        'Factor de corrección por población finita: (N-n)/(N-1)',
      ],
      videoId: 'K3p2c3Z3k9Q',
    },
    pythonCode: `# Hipergeométrica en Python
from scipy.stats import hypergeom

# N = 20 total, M = 5 éxitos en población, n = 4 tamaño de muestra
N, M, n, x = 20, 5, 4, 2

# P(X = 2)
prob = hypergeom.pmf(x, N, M, n)
print(f"P(X = 2) = {prob:.4f}")  # 0.2167

media, var = hypergeom.stats(N, M, n, moments='mv')
print(f"E(X) = {media:.4f}, V(X) = {var:.4f}")`,
    rCode: `# Hipergeométrica en R
# Nota en R: m = M (éxitos), n = N - M (fallas), k = n (muestra)
M <- 5
N <- 20
n_muestra <- 4
x <- 2

dhyper(x, m = M, n = N - M, k = n_muestra) # 0.2167`,
    geogebraGuia:
      'En GeoGebra: Menú Probabilidad -> Hipergeométrica. Ingresa Población = 20, Éxitos = 5, Muestra = 4. Observa el diagrama de barras discreto.',
    calculadoraGuia:
      'En CASIO fx-991: No tiene menú directo; usa combinatorias: (5 C 2 * 15 C 2) ÷ (20 C 4) = 1050 ÷ 4845 = 0.2167.',
  },

  'geometrica-nb': {
    topicId: 'geometrica-nb',
    nombre: 'Geométrica y Binomial Negativa',
    comoReconocerlo: {
      claves: [
        'Geométrica: ¿cuántos ensayos hasta obtener el PRIMER éxito (x ≥ 1)?',
        'Binomial Negativa: ¿cuántas fallas antes de conseguir el r-ésimo éxito (x ≥ 0)?',
        'Los ensayos son independientes con p constante.',
        'El número de éxitos está fijado; el número de ensayos es la variable.',
      ],
      trampaTipica:
        'Confundir si la variable cuenta ensayos o fallas. En Devore: Geométrica = ensayos; Binomial Negativa = fallas.',
      preguntaDeControl:
        '¿El experimento termina cuando se alcanza una cantidad fija de éxitos? Si sí -> Geométrica o Binomial Negativa.',
    },
    teoria: {
      resumen:
        'La Geométrica modela los ensayos hasta el 1er éxito con g(x; p) = (1-p)^(x-1)*p. La Binomial Negativa modela las fallas antes del r-ésimo éxito con nb(x; r, p) = C(x+r-1, r-1)*p^r*(1-p)^x.',
      supuestos: [
        'Ensayos independientes de Bernoulli.',
        'Probabilidad p constante.',
        'El proceso continúa hasta registrar el número meta de éxitos.',
      ],
      propiedades: [
        'Geométrica: E(X) = 1/p, V(X) = (1-p)/p²',
        'Binomial Negativa (fallas): E(X) = r(1-p)/p, V(X) = r(1-p)/p²',
      ],
      videoId: 'U6gM8xY0w1s',
    },
    pythonCode: `# Geométrica y Binomial Negativa en Python
from scipy.stats import geom, nbinom

# Geométrica: ensayos hasta el 1er éxito (p = 0.20, x = 5)
p_geom = geom.pmf(5, 0.20)
print(f"P(Geom = 5) = {p_geom:.4f}")  # 0.0819

# Binomial Negativa: 3 fallas antes del 4º éxito (r = 4, p = 0.60)
p_nb = nbinom.pmf(3, 4, 0.60)
print(f"P(NB = 3 fallas) = {p_nb:.4f}")  # 0.1659`,
    rCode: `# En R:
# dgeom cuenta FALLAS antes del 1er éxito, por lo que para 5 ensayos se pasan 4 fallas:
dgeom(4, prob = 0.20) # 0.0819

# dnbinom en R cuenta FALLAS (coincide con Devore):
dnbinom(3, size = 4, prob = 0.60) # 0.1659`,
    geogebraGuia:
      'En GeoGebra: Elige distribución de Pascal (Binomial Negativa) o Geométrica. Ajusta r y p para visualizar las asimetrías a la derecha.',
    calculadoraGuia:
      'Cálculo directo: Geométrica: (0.80)^4 * 0.20 = 0.0819. Binomial Negativa: (6 C 3) * (0.6)^4 * (0.4)^3 = 20 * 0.1296 * 0.064 = 0.1659.',
  },

  poisson: {
    topicId: 'poisson',
    nombre: 'Distribución de Poisson',
    comoReconocerlo: {
      claves: [
        'Conteo discreto de sucesos raros o independientes en un intervalo continuo.',
        'Tasa media λ por unidad y tiempo/espacio t dado -> parámetro μ = λt.',
        'No existe un límite superior estricto prefijado en la variable.',
        'La media y la varianza son siempre iguales: E(X) = V(X) = μ.',
      ],
      trampaTipica:
        'Olvidar escalar la tasa al intervalo de interés (usar λ en vez de μ = λt).',
      preguntaDeControl:
        '¿Cuentas cuántas veces ocurre algo en un periodo o espacio con tasa promedio? Si sí -> Poisson.',
    },
    teoria: {
      resumen:
        'Describe la probabilidad de que ocurran x eventos en un intervalo continuo cuando los eventos son independientes y ocurren con tasa constante λ. p(x; μ) = e^(-μ) * μ^x / x!.',
      supuestos: [
        'Los eventos ocurren uno a la vez.',
        'La probabilidad de ocurrencia en un subintervalo es proporcional a la longitud.',
        'Los conteos en intervalos disjuntos son independientes.',
      ],
      propiedades: ['E(X) = μ = λt', 'V(X) = μ = λt', 'Desviación estándar: σ = √μ'],
      videoId: 'jqaX1gVlE_g',
    },
    pythonCode: `# Poisson en Python
from scipy.stats import poisson

# Tasa 2 por metro en tramo de 2 metros -> mu = 4
mu = 4
x = 3

p3 = poisson.pmf(x, mu)
print(f"P(X = 3) = {p3:.4f}")  # 0.1954

# Acumulada P(X <= 3)
print(f"P(X <= 3) = {poisson.cdf(3, mu):.4f}")`,
    rCode: `# Poisson en R
mu <- 4
dpois(3, lambda = mu) # 0.1954
ppois(3, lambda = mu) # acumulada`,
    geogebraGuia:
      'En GeoGebra: Elige "Poisson", ingresa λ = 4. Observa cómo al crecer λ la distribución se va haciendo simétrica.',
    calculadoraGuia:
      'En CASIO ClassWiz: Menú -> Distribución -> Poisson PD -> Variable -> x = 3, λ = 4 -> Resultado: 0.19536.',
  },

  exponencial: {
    topicId: 'exponencial',
    nombre: 'Distribución Exponencial',
    comoReconocerlo: {
      claves: [
        'Tiempo continuo transcurrido hasta que ocurre el siguiente evento de Poisson.',
        'Función de supervivencia sin memoria: P(X > s + t | X > s) = P(X > t).',
        'Tasa λ = 1 / media; o media β = 1 / λ.',
        'Función de distribución acumulada muy sencilla: F(x) = 1 - e^(-λx).',
      ],
      trampaTipica:
        'Pensar que P(X = x) tiene valor no nulo. En continuas, P(X = x) = 0.',
      preguntaDeControl:
        '¿Mides el tiempo continuo de espera entre eventos consecutivos? Si sí -> Exponencial.',
    },
    teoria: {
      resumen:
        'Es la contraparte continua de Poisson: mientras Poisson cuenta cuántos eventos ocurren, la Exponencial mide el tiempo continuo entre eventos consecutivos.',
      supuestos: [
        'Proceso de Poisson subyacente con tasa constante λ.',
        'Propiedad de carencia de memoria (amnésica).',
      ],
      propiedades: [
        'f(x) = λ e^(-λx) para x ≥ 0',
        'F(x) = P(X ≤ x) = 1 - e^(-λx)',
        'P(X > x) = e^(-λx)',
        'E(X) = 1/λ, V(X) = 1/λ²',
      ],
      videoId: 'bN9a8n2V4pA',
    },
    pythonCode: `# Exponencial en Python
# SciPy parametriza con scale = 1/lambda = media
from scipy.stats import expon

media = 3.0  # lambda = 1/3
scale = media

# P(X <= 5)
prob = expon.cdf(5, scale=scale)
print(f"P(X <= 5) = {prob:.4f}")  # 0.8111`,
    rCode: `# Exponencial en R (usa rate = lambda)
lambda_rate <- 1 / 3
pexp(5, rate = lambda_rate) # 0.8111`,
    geogebraGuia:
      'En GeoGebra: Probabilidad -> Exponencial -> Ingresa λ = 0.33333. Área bajo la curva a la izquierda de x = 5.',
    calculadoraGuia:
      'Cálculo directo en calculadora: 1 - e^(-(1/3) * 5) = 1 - e^(-1.6667) = 0.8111.',
  },

  gamma: {
    topicId: 'gamma',
    nombre: 'Distribución Gamma',
    comoReconocerlo: {
      claves: [
        'Tiempo continuo transcurrido hasta presenciar el α-ésimo evento de Poisson.',
        'Generalización de la Exponencial cuando α > 1.',
        'En Devore: β es escala, donde β = 1/λ. E(X) = αβ.',
        'Para α entero positivo (Erlang): se relaciona con la suma de α variables exponenciales.',
      ],
      trampaTipica:
        'Confundir β como tasa en vez de escala. En el curso de Devore β = 1/λ (escala).',
      preguntaDeControl:
        '¿Mides el tiempo hasta que ocurran varios (α) eventos continuos? Si sí -> Gamma.',
    },
    teoria: {
      resumen:
        'La distribución Gamma Gama(α, β) modela el tiempo continuo hasta acumular α eventos en un proceso de Poisson con tasa λ (escala β = 1/λ). Para α = 1 es la Exponencial.',
      supuestos: [
        'Sucesos de Poisson independientes con tasa constante.',
        'α representa la forma (número de sucesos), β la escala.',
      ],
      propiedades: ['E(X) = α * β', 'V(X) = α * β²', 'Desviación estándar: σ = β√α'],
      videoId: 'f9V0b7C1m3g',
    },
    pythonCode: `# Gamma en Python (a = alpha, scale = beta)
from scipy.stats import gamma

alpha = 3
beta = 2  # escala (lambda = 0.5)

# P(X > 6)
prob_mayor_6 = 1 - gamma.cdf(6, a=alpha, scale=beta)
print(f"P(X > 6) = {prob_mayor_6:.4f}")  # 0.4232`,
    rCode: `# Gamma en R
# En R: shape = alpha, scale = beta
1 - pgamma(6, shape = 3, scale = 2) # 0.4232`,
    geogebraGuia:
      'En GeoGebra: Menú Probabilidad -> Gamma. Parámetros α = 3 y β = 2. Selecciona la cola derecha para x > 6.',
    calculadoraGuia:
      'Usando la equivalencia con Poisson: P(Gamma(3, 2) > 6) = P(Poisson(μ = 6 * 0.5 = 3) ≤ 2) = e^(-3)(1 + 3 + 4.5) = 0.4232.',
  },

  normal: {
    topicId: 'normal',
    nombre: 'Distribución Normal',
    comoReconocerlo: {
      claves: [
        'Variable continua simétrica con forma de campana centrada en la media μ.',
        'Se especifica media μ y desviación σ (o varianza σ²).',
        'Aproximación de Binomial cuando np ≥ 10 y n(1-p) ≥ 10.',
        'Uso del valor estandarizado Z = (X - μ) / σ.',
      ],
      trampaTipica:
        'Olvidar la corrección por continuidad de ±0.5 al aproximar la Binomial discreta.',
      preguntaDeControl:
        '¿La variable es continua, simétrica y acampanada, o una aproximación con np ≥ 10? Si sí -> Normal.',
    },
    teoria: {
      resumen:
        'La distribución más importante de la estadística. La regla empírica establece que el 68.27% cae en μ ± σ, el 95.45% en μ ± 2σ y el 99.73% en μ ± 3σ.',
      supuestos: [
        'Variable continua sobre todo el eje real.',
        'Simetría perfecta alrededor de μ.',
        'Teorema Central del Límite: la suma de muchas variables independientes tiende a ser normal.',
      ],
      propiedades: ['E(X) = μ', 'V(X) = σ²', 'Z = (X - μ)/σ sigue una N(0, 1)'],
      videoId: 'iYiOBLKEqV8',
    },
    pythonCode: `# Normal en Python
from scipy.stats import norm

# Caso pernos: mu = 10.0, sigma = 0.03
mu, sigma = 10.0, 0.03
p_rango = norm.cdf(10.06, mu, sigma) - norm.cdf(9.97, mu, sigma)
print(f"P(9.97 <= X <= 10.06) = {p_rango:.4f}")  # 0.8185

# Caso Binomial a Normal: n = 100, p = 0.25 -> P(X >= 30) con corrección (X >= 29.5)
import numpy as np
mu_bin = 100 * 0.25
std_bin = np.sqrt(100 * 0.25 * 0.75)
p_bin_norm = 1 - norm.cdf(29.5, mu_bin, std_bin)
print(f"P(Binomial aprox >= 30) = {p_bin_norm:.4f}")  # 0.1492`,
    rCode: `# Normal en R
pnorm(10.06, mean = 10.0, sd = 0.03) - pnorm(9.97, mean = 10.0, sd = 0.03) # 0.8185

# Binomial a Normal
1 - pnorm(29.5, mean = 25, sd = sqrt(18.75)) # 0.1492`,
    geogebraGuia:
      'En GeoGebra: Elige "Normal", ingresa μ = 10 y σ = 0.03. Selecciona el intervalo entre dos valores [9.97, 10.06].',
    calculadoraGuia:
      'En CASIO ClassWiz: Menú Distribución -> Normal CD (2) -> Lower: 9.97, Upper: 10.06, σ: 0.03, μ: 10.0 -> 0.81859.',
  },

  integrador: {
    topicId: 'integrador',
    nombre: 'Nivel Integrador',
    comoReconocerlo: {
      claves: [
        'Enunciados de examen con las 7 distribuciones combinadas sin previo aviso.',
        'Requiere identificar primero: ¿Discreta o Continua?',
        'Segundo: ¿Qué magnitud se cuenta o mide?',
        'Tercero: ¿Se cumplen las condiciones de aproximación?',
      ],
      trampaTipica:
        'Apurarse a meter números a la calculadora sin haber validado si el modelo es el correcto.',
      preguntaDeControl:
        '¿Puedes defender con 2 argumentos pedagógicos por qué este modelo es el único aplicable?',
    },
    teoria: {
      resumen:
        'El nivel integrador es el entrenamiento fundamental para los parciales de la Universidad. Simula las preguntas reales del texto de Devore.',
      supuestos: ['Dominio integrado de las 7 familias de distribuciones del curso.'],
      propiedades: ['80% de aciertos es el umbral de maestría recomendada.'],
      videoId: 'K3p2c3Z3k9Q',
    },
    pythonCode: `# Comparador general de modelos en Python
print("Easy Pro - Motor de Decisión Integrador")`,
    rCode: `# Script resumen para exámenes en R
summary_models <- c("dbinom", "dhyper", "dgeom", "dnbinom", "dpois", "dexp", "dgamma", "dnorm")`,
    geogebraGuia:
      'Utiliza la vista de probabilidades múltiples de GeoGebra para contrastar curvas simultáneamente.',
    calculadoraGuia:
      'En tu calculadora, crea una hoja de fórmulas rápidas con los números de menú de cada distribución.',
  },
};
