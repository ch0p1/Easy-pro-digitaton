import React from 'react';
import { MainViewTab } from '../Navbar';
import {
  Compass,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: MainViewTab) => void;
  onOpenDecisionTree: () => void;
  onOpenScormModal?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onOpenDecisionTree,
  onOpenScormModal,
}) => {
  const modules = [
    {
      id: 'playground' as MainViewTab,
      numero: '01',
      title: 'Ruta de Práctica (Playground)',
      subtitle: 'Entrenamiento pedagógico en 5 etapas secuenciales',
      description:
        'El corazón del sistema. Recorre los 8 temas del temario de Devore mediante un flujo interactivo que entrena la lectura crítica, la parametrización exacta y la resolución numérica sin memorización mecánica.',
      etapas: [
        { name: '1. Pistas', desc: 'Señales del enunciado y contraejemplos' },
        { name: '2. Reconocer', desc: 'Identificar el modelo sin ver el nombre' },
        { name: '3. Parametrizar', desc: 'Extraer n, p, λ, t, α, β con exactitud' },
        { name: '4. Calcular', desc: 'Cálculo con tolerancia del curso (±0.0005)' },
        { name: '5. Contrastar', desc: 'Confusiones críticas y detección de errores' },
      ],
      cta: 'Explorar Ruta de Temas',
      action: () => onNavigate('playground'),
      tag: 'Eje Pedagógico Central',
    },
    {
      id: 'calculator' as MainViewTab,
      numero: '02',
      title: 'Calculadora Estadística Oficial',
      subtitle: 'Cálculo exacto de probabilidades, densidades y momentos',
      description:
        'Motor de cómputo en JavaScript puro para las 8 distribuciones del curso. Calcula probabilidades puntuales, acumuladas, valores esperados y varianzas, e incluye el banco oficial de 10 ejercicios del curso verificados para contrastar tus resultados.',
      features: [
        'Diagrama visual de masa y densidad en SVG en tiempo real',
        'Cálculo de P(X = x), P(X ≤ x), P(X > x) y P(a ≤ X ≤ b)',
        'Banco verificado del curso: carga los problemas del examen en 1 clic',
      ],
      cta: 'Abrir Calculadora',
      action: () => onNavigate('calculator'),
      tag: 'Herramienta de Cómputo',
    },
    {
      id: 'library' as MainViewTab,
      numero: '03',
      title: 'Biblioteca Técnica y Multimedia',
      subtitle: 'Recursos teóricos, scripts computacionales y guías físicas',
      description:
        'Repositorio estructurado para profundizar en cada distribución. Diseñado para funcionar 100% sin conexión a internet y cargar videos explicativos solo bajo demanda para optimizar memoria y datos.',
      features: [
        'Sección «Cómo reconocerlo» con preguntas de control mental',
        'Scripts oficiales listos para usar en Python (SciPy) y R',
        'Guía paso a paso para GeoGebra y calculadoras Casio fx-991/Sharp',
      ],
      cta: 'Consultar Biblioteca',
      action: () => onNavigate('library'),
      tag: 'Recurso de Consulta',
    },
    {
      id: 'formulas' as MainViewTab,
      numero: '04',
      title: 'Fórmulas y Guía de Decisión',
      subtitle: 'Fichas técnicas en KaTeX según las convenciones de Devore',
      description:
        'Catálogo de fórmulas con rigor matemático: Geométrica en ensayos (x ≥ 1), Binomial Negativa en fallas (x ≥ 0) y Gamma con escala β = 1/λ. Incluye las tres reglas formales de aproximación y vista imprimible para llevar al examen.',
      features: [
        'Reglas exactas: Hipergeométrica a Binomial, Binomial a Poisson y Normal',
        'Pistas clave y contraejemplos para cada ficha de distribución',
        'Modo optimizado para imprimir o exportar como PDF limpio',
      ],
      cta: 'Ver Formulario Imprimible',
      action: () => onNavigate('formulas'),
      tag: 'Fichas y Notación Devore',
    },
  ];

  const tools = [
    {
      title: 'Árbol de Decisión Interactivo',
      desc: 'Asistente socrático que responde a la pregunta «¿qué modelo uso y por qué?» guiándote paso a paso ante cualquier enunciado.',
      btn: 'Iniciar Árbol',
      action: onOpenDecisionTree,
      icon: Compass,
    },
    {
      title: 'Formulario y Reglas de Aproximación',
      desc: 'Consulta las condiciones formales de aproximación del curso y genera fichas técnicas de modelos listas para estudiar.',
      btn: 'Ver Formulario',
      action: () => onNavigate('formulas'),
      icon: BookOpen,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Hero Presentation */}
      <section className="surface-card p-6 sm:p-10 border-l-4 border-l-[#8A1428] relative overflow-hidden space-y-5">
        <div className="max-w-3xl space-y-3">
          <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-[#AC0B32]">
            <span className="bg-[#8A14280E] px-2.5 py-1 rounded-md uppercase tracking-wider font-mono">
              Texto Guía: Devore (9.ª Edición)
            </span>
            <span>•</span>
            <span className="text-[#584141]">Probabilidad y Estadística para Ingeniería</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#8A1428] tracking-tight leading-[1.15]">
            Aprende a Decidir Qué Modelo Usar y Por Qué
          </h1>

          <p className="text-base sm:text-lg text-[#584141] leading-relaxed">
            La dificultad principal en los exámenes de estadística no radica en operar una fórmula, sino en <strong className="text-[#8A1428]">reconocer qué distribución gobierna la situación descrita en el problema</strong>. Esta plataforma transforma el estudio memorístico en una práctica activa de discriminación entre modelos contrastados.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('playground')}
              className="tactile-btn-primary px-5 py-3 rounded-lg text-sm sm:text-base font-bold flex items-center gap-2 shadow-sm"
            >
              <span>Comenzar con la Ruta de Práctica</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenDecisionTree}
              className="tactile-btn-secondary px-4 py-3 rounded-lg text-sm sm:text-base font-semibold flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#AC0B32]" />
              <span>Abrir Árbol de Decisión</span>
            </button>
          </div>
        </div>
      </section>

      {/* Overview of The 5 Principles */}
      <section className="space-y-4">
        <div className="border-b border-[#8A14281A] pb-3 flex items-baseline justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#8A1428]">
              Guía de Módulos del Sistema
            </h2>
            <p className="text-sm sm:text-base text-[#584141] mt-0.5">
              Conoce el propósito de cada sección y cómo utilizarlas para preparar tus parciales.
            </p>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 gap-5">
          {modules.map((m) => (
            <div
              key={m.numero}
              className="surface-card p-6 sm:p-7 space-y-4 hover:border-[#8A142833] transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#8A142812] pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-[#AC0B32] bg-[#8A14280E] px-2.5 py-1 rounded-md">
                    Módulo {m.numero}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#8A1428]">
                    {m.title}
                  </h3>
                </div>
                <span className="text-xs sm:text-sm text-[#584141] font-medium bg-[#FBF5EC] border border-[#8A142815] px-2.5 py-0.5 rounded-md w-fit">
                  {m.tag}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm sm:text-base font-semibold text-[#AC0B32]">{m.subtitle}</div>
                <p className="text-sm sm:text-base text-[#1D1B16] leading-relaxed">
                  {m.description}
                </p>
              </div>

              {/* Specific features / stages list */}
              {m.etapas && (
                <div className="p-4 bg-[#FBF5EC] rounded-xl border border-[#8A142815] space-y-2.5">
                  <span className="text-xs font-bold text-[#8A1428] uppercase tracking-wider block">
                    Las 5 Etapas de Aprendizaje por Tema:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs sm:text-sm">
                    {m.etapas.map((et, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded-lg border border-[#8A142810] space-y-1"
                      >
                        <div className="font-bold text-[#8A1428] text-xs sm:text-sm">{et.name}</div>
                        <div className="text-xs text-[#584141] line-clamp-2 leading-tight">
                          {et.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {m.features && (
                <div className="p-4 bg-[#FBF5EC] rounded-xl border border-[#8A142815] space-y-2">
                  <span className="text-xs font-bold text-[#8A1428] uppercase tracking-wider block">
                    Capacidades Principales:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-[#1D1B16]">
                    {m.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 bg-white p-2.5 rounded-lg border border-[#8A142810]">
                        <CheckCircle2 className="w-4 h-4 text-[#2ECC71] flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action trigger */}
              <div className="pt-2 flex items-center justify-end">
                <button
                  onClick={m.action}
                  className="tactile-btn-secondary px-4 py-2.5 rounded-lg text-sm sm:text-base font-bold flex items-center gap-1.5"
                >
                  <span>{m.cta}</span>
                  <ArrowRight className="w-4 h-4 text-[#AC0B32]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Auxiliary Global Tools */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-[#8A1428]">
          Herramientas Complementarias
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tools.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div
                key={idx}
                className="surface-card p-5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#8A1428]">
                    <Icon className="w-4 h-4 text-[#AC0B32]" />
                    <span>{t.title}</span>
                  </div>
                  <p className="text-xs text-[#584141] leading-relaxed">{t.desc}</p>
                </div>
                <div>
                  <button
                    onClick={t.action}
                    className="tactile-btn-secondary w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <span>{t.btn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pedagogical Summary Matrix */}
      <section className="surface-card p-6 space-y-4">
        <h3 className="text-base font-bold text-[#8A1428]">
          Estructura de Temas Cubiertos (Devore)
        </h3>
        <p className="text-xs text-[#584141]">
          Los 7 modelos canónicos contrastados y el Nivel Integrador final:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            { n: '1', name: 'Binomial', tag: 'Éxitos en n fijos' },
            { n: '2', name: 'Hipergeométrica', tag: 'Sin reemplazo finita' },
            { n: '3', name: 'Geométrica & NB', tag: 'Hasta el éxito (x ensayos / fallas)' },
            { n: '4', name: 'Poisson', tag: 'Conteo en intervalo (μ = λt)' },
            { n: '5', name: 'Exponencial', tag: 'Tiempo entre eventos (continuo)' },
            { n: '6', name: 'Gamma', tag: 'Tiempo hasta α eventos (β escala)' },
            { n: '7', name: 'Normal', tag: 'Simétrica continua & aprox. Z' },
            { n: '8', name: 'Integrador', tag: 'Simulacro mixto de examen' },
          ].map((item) => (
            <div
              key={item.n}
              className="p-3 bg-[#FBF5EC] rounded-lg border border-[#8A142815] space-y-0.5"
            >
              <div className="flex items-center gap-1.5 font-bold text-[#8A1428]">
                <span className="text-[10px] bg-[#8A142815] px-1.5 rounded font-mono">
                  #{item.n}
                </span>
                <span>{item.name}</span>
              </div>
              <div className="text-[11px] text-[#584141]">{item.tag}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
