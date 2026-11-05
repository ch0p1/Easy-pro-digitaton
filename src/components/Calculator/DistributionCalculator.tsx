import React, { useState, useMemo } from 'react';
import { TopicId } from '../../types';
import {
  binomial,
  hypergeometric,
  geometric,
  negativeBinomial,
  poisson,
  exponential,
  gammaDist,
  normal,
} from '../../calc/distributions';
import { MathView } from '../MathView';
import { Calculator as CalcIcon, BarChart3 } from 'lucide-react';

interface Props {
  initialTopic?: TopicId;
}

export const DistributionCalculator: React.FC<Props> = ({ initialTopic = 'binomial' }) => {
  const [selectedTopic, setSelectedTopic] = useState<TopicId>(
    initialTopic === 'integrador' ? 'binomial' : initialTopic
  );

  // Binomial state
  const [binN, setBinN] = useState<number>(6);
  const [binP, setBinP] = useState<number>(0.75);
  const [binX, setBinX] = useState<number>(4);

  // Hipergeometrica state
  const [hypN, setHypN] = useState<number>(20);
  const [hypM, setHypM] = useState<number>(5);
  const [hypSampleN, setHypSampleN] = useState<number>(4);
  const [hypX, setHypX] = useState<number>(2);

  // Geometrica state (ensayos x >= 1)
  const [geomP, setGeomP] = useState<number>(0.2);
  const [geomX, setGeomX] = useState<number>(5);

  // Binomial Negativa state (fallas x >= 0)
  const [nbR, setNbR] = useState<number>(4);
  const [nbP, setNbP] = useState<number>(0.6);
  const [nbX, setNbX] = useState<number>(3);

  // Poisson state
  const [poiLambda, setPoiLambda] = useState<number>(2);
  const [poiT, setPoiT] = useState<number>(2);
  const [poiX, setPoiX] = useState<number>(3);

  // Exponencial state
  const [expLambda, setExpLambda] = useState<number>(1 / 3);
  const [expX, setExpX] = useState<number>(5);

  // Gamma state
  const [gamAlpha, setGamAlpha] = useState<number>(3);
  const [gamBeta, setGamBeta] = useState<number>(2);
  const [gamX, setGamX] = useState<number>(6);

  // Normal state
  const [normMu, setNormMu] = useState<number>(10.0);
  const [normSigma, setNormSigma] = useState<number>(0.03);
  const [normA, setNormA] = useState<number>(9.97);
  const [normB, setNormB] = useState<number>(10.06);


  // Calculations per topic
  const calcOutput = useMemo(() => {
    switch (selectedTopic) {
      case 'binomial': {
        const pmf = binomial.pmf(binX, binN, binP);
        const cdf = binomial.cdf(binX, binN, binP);
        const mean = binomial.mean(binN, binP);
        const variance = binomial.variance(binN, binP);
        return {
          exact: pmf,
          lessEqual: cdf,
          greaterEqual: 1 - binomial.cdf(binX - 1, binN, binP),
          mean,
          variance,
          formulaLatex: `b(${binX}; ${binN}, ${binP}) = \\binom{${binN}}{${binX}} (${binP})^{${binX}} (1 - ${binP})^{${binN - binX}}`,
          points: Array.from({ length: binN + 1 }, (_, i) => ({
            k: i,
            prob: binomial.pmf(i, binN, binP),
            highlighted: i === binX,
          })),
        };
      }
      case 'hipergeometrica': {
        const pmf = hypergeometric.pmf(hypX, hypSampleN, hypM, hypN);
        const cdf = hypergeometric.cdf(hypX, hypSampleN, hypM, hypN);
        const mean = hypergeometric.mean(hypSampleN, hypM, hypN);
        const variance = hypergeometric.variance(hypSampleN, hypM, hypN);
        const maxK = Math.min(hypSampleN, hypM);
        return {
          exact: pmf,
          lessEqual: cdf,
          greaterEqual: 1 - hypergeometric.cdf(hypX - 1, hypSampleN, hypM, hypN),
          mean,
          variance,
          formulaLatex: `h(${hypX}; ${hypSampleN}, ${hypM}, ${hypN}) = \\frac{\\binom{${hypM}}{${hypX}} \\binom{${hypN - hypM}}{${hypSampleN - hypX}}}{\\binom{${hypN}}{${hypSampleN}}}`,
          points: Array.from({ length: maxK + 1 }, (_, i) => ({
            k: i,
            prob: hypergeometric.pmf(i, hypSampleN, hypM, hypN),
            highlighted: i === hypX,
          })),
        };
      }
      case 'geometrica-nb': {
        const pGeom = geometric.pmf(geomX, geomP);
        const cdfGeom = geometric.cdf(geomX, geomP);
        const pNb = negativeBinomial.pmf(nbX, nbR, nbP);
        const cdfNb = negativeBinomial.cdf(nbX, nbR, nbP);
        return {
          geomExact: pGeom,
          geomCdf: cdfGeom,
          geomMean: geometric.mean(geomP),
          geomVar: geometric.variance(geomP),
          nbExact: pNb,
          nbCdf: cdfNb,
          nbMean: negativeBinomial.mean(nbR, nbP),
          nbVar: negativeBinomial.variance(nbR, nbP),
        };
      }
      case 'poisson': {
        const mu = poiLambda * poiT;
        const pmf = poisson.pmf(poiX, mu);
        const cdf = poisson.cdf(poiX, mu);
        const mean = poisson.mean(mu);
        const variance = poisson.variance(mu);
        const points = Array.from({ length: Math.max(12, Math.ceil(mu * 2.5)) }, (_, i) => ({
          k: i,
          prob: poisson.pmf(i, mu),
          highlighted: i === poiX,
        }));
        return {
          exact: pmf,
          lessEqual: cdf,
          greaterEqual: 1 - poisson.cdf(poiX - 1, mu),
          mean,
          variance,
          mu,
          formulaLatex: `p(${poiX}; \\mu=${mu.toFixed(2)}) = \\frac{e^{-${mu.toFixed(2)}} (${mu.toFixed(2)})^{${poiX}}}{${poiX}!}`,
          points,
        };
      }
      case 'exponencial': {
        const cdf = exponential.cdf(expX, expLambda);
        const mean = exponential.mean(expLambda);
        const variance = exponential.variance(expLambda);
        return {
          lessEqual: cdf,
          greater: 1 - cdf,
          mean,
          variance,
          formulaLatex: `P(X \\le ${expX}) = 1 - e^{-${expLambda.toFixed(4)} \\cdot ${expX}}`,
        };
      }
      case 'gamma': {
        const cdf = gammaDist.cdf(gamX, gamAlpha, gamBeta);
        const mean = gammaDist.mean(gamAlpha, gamBeta);
        const variance = gammaDist.variance(gamAlpha, gamBeta);
        return {
          lessEqual: cdf,
          greater: 1 - cdf,
          mean,
          variance,
          formulaLatex: `f(x; \\alpha=${gamAlpha}, \\beta=${gamBeta}) = \\frac{x^{${gamAlpha - 1}} e^{-x / ${gamBeta}}}{${gamBeta}^${gamAlpha} \\Gamma(${gamAlpha})}`,
        };
      }
      case 'normal': {
        const pRange = normal.range(normA, normB, normMu, normSigma);
        const zA = (normA - normMu) / normSigma;
        const zB = (normB - normMu) / normSigma;
        const mean = normal.mean(normMu);
        const variance = normal.variance(normSigma);
        return {
          pRange,
          zA,
          zB,
          mean,
          variance,
          formulaLatex: `P(${normA} \\le X \\le ${normB}) = \\Phi(${zB.toFixed(2)}) - \\Phi(${zA.toFixed(2)})`,
        };
      }
      default:
        return null;
    }
  }, [
    selectedTopic,
    binN,
    binP,
    binX,
    hypN,
    hypM,
    hypSampleN,
    hypX,
    geomP,
    geomX,
    nbR,
    nbP,
    nbX,
    poiLambda,
    poiT,
    poiX,
    expLambda,
    expX,
    gamAlpha,
    gamBeta,
    gamX,
    normMu,
    normSigma,
    normA,
    normB,
  ]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="surface-card p-6 border-l-4 border-l-[#8A1428] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#AC0B32]">
            <CalcIcon className="w-4 h-4 text-[#FF051E]" />
            Calculadora Estadística Devore (Fase 1-3)
          </div>
          <h2 className="text-2xl font-bold text-[#8A1428] mt-1">
            Calculadora Oficial de Distribuciones
          </h2>
          <p className="text-sm text-[#584141] mt-1">
            Cálculo de masa, densidades, áreas acumuladas y validación matemática exacta con 4 decimales.
          </p>
        </div>
      </div>

      {/* Model Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-transparent no-scrollbar">
        {[
          { id: 'binomial', label: '1. Binomial' },
          { id: 'hipergeometrica', label: '2. Hipergeométrica' },
          { id: 'geometrica-nb', label: '3. Geométrica & NB' },
          { id: 'poisson', label: '4. Poisson' },
          { id: 'exponencial', label: '5. Exponencial' },
          { id: 'gamma', label: '6. Gamma' },
          { id: 'normal', label: '7. Normal' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTopic(t.id as TopicId)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedTopic === t.id
                ? 'bg-[#8A1428] text-white shadow-sm font-semibold'
                : 'bg-white text-[#8A1428] hover:bg-[#8A14280F] border border-[#8A14281A]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid: Inputs on Left, Output & Graphic on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Inputs Column */}
        <div className="md:col-span-5 surface-card p-5 space-y-4">
          <h3 className="text-base font-semibold text-[#8A1428] flex items-center justify-between">
            <span>Parámetros de Entrada</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#8A142810] text-[#8A1428] font-mono">
              Devore
            </span>
          </h3>

          {/* Binomial Inputs */}
          {selectedTopic === 'binomial' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#8A1428]">Número de ensayos (n):</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={binN}
                  onChange={(e) => setBinN(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium focus:outline-[#AC0B32]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8A1428]">Probabilidad de éxito (p):</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={binP}
                  onChange={(e) => setBinP(Math.max(0, Math.min(1, parseFloat(e.target.value) || 0)))}
                  className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium focus:outline-[#AC0B32]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8A1428]">Éxitos evaluados (x):</label>
                <input
                  type="number"
                  min="0"
                  max={binN}
                  value={binX}
                  onChange={(e) => setBinX(Math.max(0, Math.min(binN, parseInt(e.target.value) || 0)))}
                  className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium focus:outline-[#AC0B32]"
                />
              </div>
            </div>
          )}

          {/* Hipergeométrica Inputs */}
          {selectedTopic === 'hipergeometrica' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#8A1428]">Población total (N):</label>
                <input
                  type="number"
                  min="2"
                  value={hypN}
                  onChange={(e) => setHypN(Math.max(2, parseInt(e.target.value) || 2))}
                  className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium focus:outline-[#AC0B32]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8A1428]">Éxitos en la población (M):</label>
                <input
                  type="number"
                  min="1"
                  max={hypN}
                  value={hypM}
                  onChange={(e) => setHypM(Math.max(1, Math.min(hypN, parseInt(e.target.value) || 1)))}
                  className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium focus:outline-[#AC0B32]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8A1428]">Tamaño de muestra (n):</label>
                <input
                  type="number"
                  min="1"
                  max={hypN}
                  value={hypSampleN}
                  onChange={(e) =>
                    setHypSampleN(Math.max(1, Math.min(hypN, parseInt(e.target.value) || 1)))
                  }
                  className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium focus:outline-[#AC0B32]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8A1428]">Éxitos en la muestra (x):</label>
                <input
                  type="number"
                  min="0"
                  max={Math.min(hypSampleN, hypM)}
                  value={hypX}
                  onChange={(e) =>
                    setHypX(Math.max(0, Math.min(hypSampleN, parseInt(e.target.value) || 0)))
                  }
                  className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium focus:outline-[#AC0B32]"
                />
              </div>
            </div>
          )}

          {/* Geometrica & Binomial Negativa */}
          {selectedTopic === 'geometrica-nb' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#8A142808] rounded-lg border border-[#8A14281A] space-y-2">
                <span className="text-xs font-bold text-[#8A1428] uppercase tracking-wide">
                  Geométrica: Ensayos hasta 1er éxito
                </span>
                <div>
                  <label className="text-xs font-semibold text-[#8A1428]">Probabilidad (p):</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.01"
                    max="1"
                    value={geomP}
                    onChange={(e) => setGeomP(parseFloat(e.target.value) || 0.1)}
                    className="w-full mt-1 p-2 bg-white border border-[#8A142833] rounded text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#8A1428]">Ensayo de 1er éxito (x ≥ 1):</label>
                  <input
                    type="number"
                    min="1"
                    value={geomX}
                    onChange={(e) => setGeomX(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full mt-1 p-2 bg-white border border-[#8A142833] rounded text-sm"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#8A142808] rounded-lg border border-[#8A14281A] space-y-2">
                <span className="text-xs font-bold text-[#8A1428] uppercase tracking-wide">
                  Binomial Negativa: Fallas antes de r éxitos
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-[#8A1428]">Éxitos (r):</label>
                    <input
                      type="number"
                      min="1"
                      value={nbR}
                      onChange={(e) => setNbR(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full mt-1 p-2 bg-white border border-[#8A142833] rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#8A1428]">Probabilidad (p):</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0.01"
                      max="1"
                      value={nbP}
                      onChange={(e) => setNbP(parseFloat(e.target.value) || 0.1)}
                      className="w-full mt-1 p-2 bg-white border border-[#8A142833] rounded text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#8A1428]">Fallas previas (x ≥ 0):</label>
                  <input
                    type="number"
                    min="0"
                    value={nbX}
                    onChange={(e) => setNbX(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full mt-1 p-2 bg-white border border-[#8A142833] rounded text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Poisson Inputs */}
          {selectedTopic === 'poisson' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#8A1428]">Tasa (λ por unidad):</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.01"
                  value={poiLambda}
                  onChange={(e) => setPoiLambda(Math.max(0.01, parseFloat(e.target.value) || 1))}
                  className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8A1428]">Intervalo de medida (t):</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.01"
                  value={poiT}
                  onChange={(e) => setPoiT(Math.max(0.01, parseFloat(e.target.value) || 1))}
                  className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium"
                />
              </div>
              <div className="p-2 bg-[#8A14280F] rounded text-xs text-[#8A1428]">
                Media escalada calculada: <strong>μ = λt = {(poiLambda * poiT).toFixed(3)}</strong>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8A1428]">Ocurrencias evaluadas (x):</label>
                <input
                  type="number"
                  min="0"
                  value={poiX}
                  onChange={(e) => setPoiX(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium"
                />
              </div>
            </div>
          )}

          {/* Exponencial Inputs */}
          {selectedTopic === 'exponencial' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#8A1428]">
                  Tasa (λ) [o inverso de la media]:
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.001"
                  value={Number(expLambda.toFixed(4))}
                  onChange={(e) => setExpLambda(Math.max(0.0001, parseFloat(e.target.value) || 0.1))}
                  className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium"
                />
                <div className="text-[11px] text-[#584141] mt-1">
                  Media de espera E(X) = {(1 / expLambda).toFixed(3)} unidades.
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8A1428]">Tiempo evaluado (x ≥ 0):</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={expX}
                  onChange={(e) => setExpX(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium"
                />
              </div>
            </div>
          )}

          {/* Gamma Inputs */}
          {selectedTopic === 'gamma' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#8A1428]">
                  Parámetro de forma (α = sucesos):
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={gamAlpha}
                  onChange={(e) => setGamAlpha(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8A1428]">
                  Parámetro de escala (β = 1/λ según Devore):
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={gamBeta}
                  onChange={(e) => setGamBeta(Math.max(0.1, parseFloat(e.target.value) || 1))}
                  className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8A1428]">Tiempo evaluado (x):</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.01"
                  value={gamX}
                  onChange={(e) => setGamX(Math.max(0.01, parseFloat(e.target.value) || 1))}
                  className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium"
                />
              </div>
            </div>
          )}

          {/* Normal Inputs */}
          {selectedTopic === 'normal' && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#8A1428]">Media (μ):</label>
                <input
                  type="number"
                  step="0.1"
                  value={normMu}
                  onChange={(e) => setNormMu(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#8A1428]">Desviación estándar (σ):</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.0001"
                  value={normSigma}
                  onChange={(e) => setNormSigma(Math.max(0.0001, parseFloat(e.target.value) || 0.1))}
                  className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-[#8A1428]">Límite inferior (a):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={normA}
                    onChange={(e) => setNormA(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#8A1428]">Límite superior (b):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={normB}
                    onChange={(e) => setNormB(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 p-2 bg-[#FBF5EC] border border-[#8A142833] rounded text-sm text-[#8A1428] font-medium"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Output Column with Live Region for Screen Readers */}
        <div className="md:col-span-7 space-y-4">
          <div
            role="region"
            aria-live="polite"
            aria-label="Resultados del cálculo estadístico"
            className="surface-card p-5 space-y-4"
          >
            <h3 className="text-base font-semibold text-[#8A1428] flex items-center justify-between">
              <span>Resultados Numéricos</span>
              <span className="text-xs text-[#AC0B32] font-mono">4 decimales exactos</span>
            </h3>

            {/* Calculations display */}
            {selectedTopic === 'geometrica-nb' && calcOutput && (
              <div className="space-y-4">
                <div className="p-3 bg-[#FBF5EC] rounded-lg border border-[#8A14281A] space-y-1">
                  <div className="text-xs text-[#8A1428] font-semibold">
                    Geométrica g({geomX}; {geomP}):
                  </div>
                  <div className="text-2xl font-bold text-[#8A1428]">
                    P(X = {geomX}) = {calcOutput.geomExact?.toFixed(4)}
                  </div>
                  <div className="text-xs text-[#584141]">
                    P(X ≤ {geomX}) = {calcOutput.geomCdf?.toFixed(4)} | Media E(X) ={' '}
                    {calcOutput.geomMean?.toFixed(2)} | Var V(X) = {calcOutput.geomVar?.toFixed(3)}
                  </div>
                </div>

                <div className="p-3 bg-[#FBF5EC] rounded-lg border border-[#8A14281A] space-y-1">
                  <div className="text-xs text-[#8A1428] font-semibold">
                    Binomial Negativa nb({nbX}; {nbR}, {nbP}) [en fallas]:
                  </div>
                  <div className="text-2xl font-bold text-[#8A1428]">
                    P(X = {nbX}) = {calcOutput.nbExact?.toFixed(4)}
                  </div>
                  <div className="text-xs text-[#584141]">
                    P(X ≤ {nbX}) = {calcOutput.nbCdf?.toFixed(4)} | Media E(X) ={' '}
                    {calcOutput.nbMean?.toFixed(2)} | Var V(X) = {calcOutput.nbVar?.toFixed(3)}
                  </div>
                </div>
              </div>
            )}

            {selectedTopic !== 'geometrica-nb' && calcOutput && (
              <div className="space-y-3">
                {/* Discrete main result */}
                {selectedTopic !== 'exponencial' &&
                  selectedTopic !== 'gamma' &&
                  selectedTopic !== 'normal' && (
                    <div className="p-4 bg-[#FBF5EC] rounded-xl border border-[#8A142820] flex items-baseline justify-between">
                      <div>
                        <div className="text-xs text-[#584141] font-medium">Probabilidad puntual P(X = x)</div>
                        <div className="text-3xl font-bold text-[#8A1428]">
                          {calcOutput.exact?.toFixed(4)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-[#584141] font-medium">P(X ≤ x)</div>
                        <div className="text-xl font-semibold text-[#AC0B32]">
                          {calcOutput.lessEqual?.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  )}

                {/* Continuous results */}
                {selectedTopic === 'exponencial' && (
                  <div className="p-4 bg-[#FBF5EC] rounded-xl border border-[#8A142820] space-y-2">
                    <div className="text-xs text-[#584141] font-medium">
                      Función acumulada P(X ≤ {expX})
                    </div>
                    <div className="text-3xl font-bold text-[#8A1428]">
                      {calcOutput.lessEqual?.toFixed(4)}
                    </div>
                    <div className="text-xs text-[#584141]">
                      Supervivencia P(X &gt; {expX}) = <strong>{calcOutput.greater?.toFixed(4)}</strong>
                    </div>
                  </div>
                )}

                {selectedTopic === 'gamma' && (
                  <div className="p-4 bg-[#FBF5EC] rounded-xl border border-[#8A142820] space-y-2">
                    <div className="text-xs text-[#584141] font-medium">
                      Cola derecha P(X &gt; {gamX})
                    </div>
                    <div className="text-3xl font-bold text-[#8A1428]">
                      {calcOutput.greater?.toFixed(4)}
                    </div>
                    <div className="text-xs text-[#584141]">
                      P(X ≤ {gamX}) = <strong>{calcOutput.lessEqual?.toFixed(4)}</strong>
                    </div>
                  </div>
                )}

                {selectedTopic === 'normal' && (
                  <div className="p-4 bg-[#FBF5EC] rounded-xl border border-[#8A142820] space-y-2">
                    <div className="text-xs text-[#584141] font-medium">
                      Área en el rango P({normA} ≤ X ≤ {normB})
                    </div>
                    <div className="text-3xl font-bold text-[#8A1428]">
                      {calcOutput.pRange?.toFixed(4)}
                    </div>
                    <div className="text-xs text-[#584141] flex gap-4">
                      <span>
                        Z₁ = <strong>{calcOutput.zA?.toFixed(2)}</strong>
                      </span>
                      <span>
                        Z₂ = <strong>{calcOutput.zB?.toFixed(2)}</strong>
                      </span>
                    </div>
                  </div>
                )}

                {/* Moments: E(X) and V(X) */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-2.5 bg-white border border-[#8A14281A] rounded-lg">
                    <div className="text-[11px] text-[#584141]">Esperanza E(X)</div>
                    <div className="text-lg font-semibold text-[#8A1428]">
                      {calcOutput.mean?.toFixed(4)}
                    </div>
                  </div>
                  <div className="p-2.5 bg-white border border-[#8A14281A] rounded-lg">
                    <div className="text-[11px] text-[#584141]">Varianza V(X)</div>
                    <div className="text-lg font-semibold text-[#8A1428]">
                      {calcOutput.variance?.toFixed(4)}
                    </div>
                  </div>
                </div>

                {/* Formula rendering */}
                {calcOutput.formulaLatex && (
                  <div className="pt-2">
                    <div className="text-xs text-[#584141] mb-1">Fórmula evaluada:</div>
                    <div className="p-2.5 bg-white border border-[#8A142815] rounded-lg overflow-x-auto">
                      <MathView math={calcOutput.formulaLatex} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Probability Distribution SVG Visualizer for Discrete models */}
          {calcOutput && 'points' in calcOutput && Array.isArray(calcOutput.points) && (
            <div className="surface-card p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#8A1428]">
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-[#AC0B32]" />
                  Diagrama de Masa P(X = k)
                </span>
                <span className="text-[11px] text-[#584141]">Columna roja = valor seleccionado</span>
              </div>
              <div className="h-32 flex items-end gap-1.5 pt-4 px-2 bg-[#FBF5EC] rounded-lg overflow-x-auto border border-[#8A142815]">
                {(() => {
                  const pts = calcOutput.points as { k: number; prob: number; highlighted: boolean }[];
                  const maxProb = Math.max(...pts.map((p) => p.prob || 0.001));
                  return pts.map((pt) => {
                    const heightPercent = Math.max(4, Math.round((pt.prob / maxProb) * 100));
                  return (
                    <div
                      key={pt.k}
                      className="flex-1 min-w-[20px] flex flex-col items-center justify-end h-full group relative"
                    >
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t transition-all ${
                          pt.highlighted
                            ? 'bg-[#FF051E] ring-2 ring-[#8A1428]'
                            : 'bg-[#8A1428] opacity-60 hover:opacity-90'
                        }`}
                      />
                      <span className="text-[10px] font-mono text-[#8A1428] mt-1">{pt.k}</span>
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-1 hidden group-hover:block bg-[#8A1428] text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none z-10 whitespace-nowrap">
                        k={pt.k}: {pt.prob.toFixed(4)}
                      </div>
                    </div>
                  );
                });
              })()}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
