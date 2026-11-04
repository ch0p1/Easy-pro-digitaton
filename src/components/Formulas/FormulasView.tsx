import React, { useState } from 'react';
import { TOPICS_DATA } from '../../data/topics';
import { MathView } from '../MathView';
import { Printer, BookOpen, AlertTriangle, CheckCircle, Search } from 'lucide-react';

export const FormulasView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredTopics = TOPICS_DATA.filter((t) => {
    if (t.id === 'integrador') return false;
    const term = searchTerm.toLowerCase();
    return (
      t.nombre.toLowerCase().includes(term) ||
      t.contrastePrincipal.toLowerCase().includes(term) ||
      t.subtitulo.toLowerCase().includes(term)
    );
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 print:p-0 print:m-0">
      {/* Header and Print action */}
      <div className="surface-card p-6 border-l-4 border-l-[#8A1428] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#AC0B32]">
            <BookOpen className="w-4 h-4 text-[#FF051E]" />
            Compendio Oficial y Guía de Decisión
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#8A1428] mt-1">
            Fichas Técnicas de Modelos Devore
          </h2>
          <p className="text-sm sm:text-base text-[#584141] mt-1">
            Formulario con notación estricta del curso, pistas clave de discriminación, contraejemplos y condiciones de aproximación.
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="tactile-btn-primary px-4 py-2.5 rounded-lg text-sm sm:text-base font-semibold flex items-center gap-2 shadow-sm whitespace-nowrap"
        >
          <Printer className="w-4 h-4" />
          <span>Imprimir / Guardar PDF</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative print:hidden">
        <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8A142866]" />
        <input
          type="text"
          placeholder="Buscar distribución por nombre, variable o contraste..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#8A142825] focus:border-[#AC0B32] focus:ring-2 focus:ring-[#AC0B3215] rounded-xl text-sm sm:text-base text-[#8A1428] outline-none"
        />
      </div>

      {/* Rules of Approximations Box */}
      <div className="surface-card p-5 space-y-3 print:border-black">
        <h3 className="text-base sm:text-lg font-bold text-[#8A1428] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#FF051E]" />
          Reglas Exactas de Aproximación del Curso
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs sm:text-sm">
          <div className="p-3.5 bg-[#FBF5EC] rounded-lg border border-[#8A142815]">
            <div className="font-bold text-[#8A1428] mb-1">Hipergeométrica → Binomial</div>
            <div className="text-[#584141]">
              Condición: <strong className="text-[#8A1428]">n / N ≤ 0.05</strong>
            </div>
            <div className="text-xs text-[#584141] mt-1">Parámetro: p = M / N.</div>
          </div>
          <div className="p-3.5 bg-[#FBF5EC] rounded-lg border border-[#8A142815]">
            <div className="font-bold text-[#8A1428] mb-1">Binomial → Poisson</div>
            <div className="text-[#584141]">
              Condición: <strong className="text-[#8A1428]">n ≥ 100, p ≤ 0.01 y np ≤ 20</strong>
            </div>
            <div className="text-xs text-[#584141] mt-1">
              (Regla simplificada: n ≥ 50 y np &lt; 5). Media: μ = np.
            </div>
          </div>
          <div className="p-3.5 bg-[#FBF5EC] rounded-lg border border-[#8A142815]">
            <div className="font-bold text-[#8A1428] mb-1">Binomial → Normal</div>
            <div className="text-[#584141]">
              Condición: <strong className="text-[#8A1428]">np ≥ 10 y n(1 - p) ≥ 10</strong>
            </div>
            <div className="text-xs text-[#584141] mt-1">
              μ = np, σ = √(np(1-p)). ¡Corrección ±0.5 obligatoria!
            </div>
          </div>
        </div>
      </div>

      {/* Topic Formula Cards */}
      <div className="space-y-4">
        {filteredTopics.map((topic) => {
          const pistasInfo = topic.etapas.find((e) => e.id === 'pistas')?.pistasTeoria;

          return (
            <div
              key={topic.id}
              className="surface-card p-6 space-y-4 print:break-inside-avoid print:border-black"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#8A14281A] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#AC0B32] uppercase tracking-wider">
                      Modelo #{topic.numero}
                    </span>
                    <span className="text-xs text-[#584141]">•</span>
                    <span className="text-xs sm:text-sm text-[#584141] font-mono">{topic.notacion}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#8A1428] mt-0.5">{topic.nombre}</h3>
                </div>
                <div className="text-xs sm:text-sm font-medium text-[#AC0B32] bg-[#8A14280F] px-2.5 py-1 rounded-full w-fit">
                  {topic.contrastePrincipal}
                </div>
              </div>

              {/* Main Formula & Moments */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-8 p-4 bg-[#FBF5EC] rounded-xl border border-[#8A142815]">
                  <div className="text-xs sm:text-sm font-semibold text-[#8A1428] mb-1.5">
                    Función de probabilidad / densidad:
                  </div>
                  <div className="text-lg sm:text-xl">
                    <MathView math={topic.formula} />
                  </div>
                  <div className="text-xs sm:text-sm text-[#584141] mt-2 font-mono">
                    Variable: {topic.variable}
                  </div>
                </div>

                <div className="md:col-span-4 p-4 bg-white rounded-xl border border-[#8A142815] space-y-2">
                  <div className="text-xs sm:text-sm font-semibold text-[#8A1428]">Esperanza y Varianza:</div>
                  <div className="text-sm font-mono space-y-1.5 text-[#8A1428]">
                    <div>
                      <MathView math={topic.esperanza} inline />
                    </div>
                    <div>
                      <MathView math={topic.varianza} inline />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pistas clave and Contraejemplo */}
              {pistasInfo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs sm:text-sm">
                  <div className="p-3.5 bg-white rounded-lg border border-[#8A142815] space-y-1.5">
                    <span className="font-bold text-[#8A1428] uppercase tracking-wider block text-xs">
                      🎯 Señales clave para elegir este modelo:
                    </span>
                    <ul className="space-y-1 text-[#1D1B16]">
                      {pistasInfo.senales.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#2ECC71] font-bold">✓</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-[#FF051E08] rounded-lg border border-[#FF051E25] space-y-1.5">
                    <span className="font-bold text-[#FF051E] uppercase tracking-wider block text-xs">
                      ⚠️ Contraejemplo típico:
                    </span>
                    <p className="text-[#8A1428] leading-relaxed">
                      {pistasInfo.contraejemplo}
                    </p>
                  </div>
                </div>
              )}

              {/* Warnings if any */}
              {topic.advertencias && topic.advertencias.length > 0 && (
                <div className="p-3 bg-[#8A142808] rounded-lg border border-[#8A142815] text-[11px] text-[#8A1428] space-y-0.5">
                  <span className="font-bold block">Reglas de convención de Devore:</span>
                  {topic.advertencias.map((adv, aIdx) => (
                    <div key={aIdx}>• {adv}</div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
