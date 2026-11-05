import { describe, expect, it } from 'vitest';
import {
  binomial,
  hypergeometric,
  geometric,
  negativeBinomial,
  poisson,
  exponential,
  gammaDist,
  normal,
  validateCourseBank,
} from './distributions';

const FUNCS: Record<string, (...a: number[]) => number> = {
  'binomial.pmf': binomial.pmf,
  'binomial.cdf': binomial.cdf,
  'hypergeometric.pmf': hypergeometric.pmf,
  'hypergeometric.cdf': hypergeometric.cdf,
  'negativeBinomial.pmf': negativeBinomial.pmf,
  'negativeBinomial.cdf': negativeBinomial.cdf,
  'poisson.pmf': poisson.pmf,
  'poisson.cdf': poisson.cdf,
  'gammaDist.cdf': gammaDist.cdf,
  'normal.cdf': normal.cdf,
  'geometric.pmf': geometric.pmf,
  'exponential.cdf': exponential.cdf,
};

// Valores de referencia generados con SciPy (scipy.stats), incluidos casos de n grande
// que antes desbordaban (Infinity/NaN) y de gamma con alfa grande.
const REFERENCE: Array<[string, Array<[number[], number]>]> = [
  ['binomial.pmf', [
    [[4.0, 6.0, 0.75], 0.296630859375],
    [[500.0, 2000.0, 0.25], 0.02059757143332069],
    [[533.0, 1100.0, 0.5], 0.014227024701128108],
    [[731.0, 1500.0, 0.5], 0.012732058242893873],
    [[3.0, 2000.0, 0.002], 0.19546453071634098],
    [[1000.0, 2000.0, 0.5], 0.017839011145854313],
  ]],
  ['binomial.cdf', [
    [[550.0, 1100.0, 0.5], 0.512025828884116],
    [[1000.0, 1100.0, 0.9], 0.8547818813918534],
    [[750.0, 1500.0, 0.5], 0.5102989287562382],
    [[500.0, 2000.0, 0.25], 0.5120143601681715],
  ]],
  ['hypergeometric.pmf', [
    [[2.0, 4.0, 5.0, 20.0], 0.21671826625386997],
    [[600.0, 1200.0, 2500.0, 5000.0], 0.02641467715524068],
    [[200.0, 1200.0, 2500.0, 5000.0], 1.938656478609313e-165],
  ]],
  ['hypergeometric.cdf', [
    [[600.0, 1200.0, 2500.0, 5000.0], 0.5132073385776212],
    [[800.0, 1200.0, 2500.0, 5000.0], 1.0],
  ]],
  ['negativeBinomial.pmf', [
    [[3.0, 4.0, 0.6], 0.16588800000000006],
    [[500.0, 50.0, 0.1], 0.00414218873329836],
  ]],
  ['negativeBinomial.cdf', [
    [[100.0, 20.0, 0.2], 0.8482864875366571],
  ]],
  ['poisson.pmf', [
    [[3.0, 4.0], 0.19536681481316454],
    [[800.0, 800.0], 0.014103270421591058],
  ]],
  ['poisson.cdf', [
    [[800.0, 800.0], 0.5094016579999424],
    [[10.0, 4.0], 0.9971602338794863],
  ]],
  ['gammaDist.cdf', [
    [[6.0, 3.0, 2.0], 0.5768099188731566],
    [[1000.0, 1000.0, 1.0], 0.5042052441802155],
    [[500.0, 1000.0, 0.5], 0.5042052441802155],
    [[2000.0, 1000.0, 2.0], 0.5042052441802155],
    [[1100.0, 1000.0, 1.0], 0.9989406767460701],
    [[300.0, 500.0, 1.0], 3.807423416288127e-26],
  ]],
  ['normal.cdf', [
    [[1.04, 0.0, 1.0], 0.8508300496690187],
    [[-1.0, 0.0, 1.0], 0.15865525393145707],
    [[2.0, 0.0, 1.0], 0.9772498680518208],
    [[-4.0, 0.0, 1.0], 3.167124183311986e-05],
    [[29.5, 25.0, 4.330127018922194], 0.8506512220025149],
  ]],
  ['geometric.pmf', [
    [[5.0, 0.2], 0.08192000000000002],
  ]],
  ['exponential.cdf', [
    [[5.0, 0.3333333333333333], 0.8111243971624382],
  ]],
];

describe('motor de cálculo frente a SciPy', () => {
  for (const [name, cases] of REFERENCE) {
    it(name, () => {
      for (const [args, expected] of cases) {
        const got = FUNCS[name](...args);
        expect(Number.isFinite(got), `${name}(${args}) = ${got}`).toBe(true);
        // La Normal usa A&S 7.1.26 (error absoluto <= 1.5e-7); el resto, error relativo muy pequeño.
        if (name === 'normal.cdf') expect(Math.abs(got - expected)).toBeLessThan(2e-7);
        else expect(Math.abs(got - expected)).toBeLessThanOrEqual(Math.abs(expected) * 1e-9 + 1e-15);
      }
    });
  }
});

describe('banco de ejercicios del curso', () => {
  it('los 10 problemas verificados pasan', () => {
    const results = validateCourseBank();
    expect(results).toHaveLength(10);
    for (const r of results) expect(r.pasa, `problema ${r.id} (${r.tema})`).toBe(true);
  });
});
