import React, { useState } from 'react';
import { TOPICS_DATA } from '../../data/topics';
import { TopicId, StageId } from '../../types';
import {
  Play,
  ChevronDown,
  ChevronUp,
  Target,
  Compass,
} from 'lucide-react';
import { MathView } from '../MathView';

interface TopicRoadmapProps {
  onStartStage: (topicId: TopicId, stageId: StageId) => void;
  onOpenDecisionTree: () => void;
  onOpenQuickDrill: () => void;
}

export const TopicRoadmap: React.FC<TopicRoadmapProps> = ({
  onStartStage,
  onOpenDecisionTree,
  onOpenQuickDrill,
}) => {
  const [expandedTopic, setExpandedTopic] = useState<TopicId>('binomial');

  const toggleTopic = (id: TopicId) => {
    setExpandedTopic((prev) => (prev === id ? ('' as any) : id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Hero Banner */}
      <div className="surface-card p-6 md:p-8 border-l-4 border-l-[#8A1428] relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#AC0B32] bg-[#8A142812] px-2.5 py-1 rounded-full">
              Texto guía: Devore 9.ª Edición
            </span>
            <span className="text-xs font-medium text-[#584141]">Probabilidad & Estadística</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#8A1428] tracking-tight">
            Entrena el Reconocimiento de Modelos
          </h1>
          <p className="text-sm sm:text-base text-[#584141] leading-relaxed">
            El mayor desafío en los parciales no es calcular la fórmula, sino responder con certeza:{' '}
            <strong className="text-[#8A1428]">«¿qué distribución modela este problema y por qué?»</strong>. Elige cualquier tema y practica libremente en sus 5 etapas metodológicas.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenDecisionTree}
              className="tactile-btn-secondary px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm"
            >
              <Compass className="w-4 h-4 text-[#AC0B32]" />
              <span>Árbol de Decisión Interactivo</span>
            </button>
            <button
              onClick={onOpenQuickDrill}
              className="tactile-btn-primary px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm"
            >
              <Target className="w-4 h-4" />
              <span>Modo Práctica Rápida (Reconocer)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Roadmap List of 8 Topics */}
      <div className="space-y-4">
        {TOPICS_DATA.map((topic) => {
          const isExpanded = expandedTopic === topic.id;

          return (
            <div
              key={topic.id}
              className="surface-card transition-all hover:border-[#8A142833]"
            >
              {/* Topic Header Accordion Trigger */}
              <div
                onClick={() => toggleTopic(topic.id)}
                className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Topic badge node */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0 bg-[#8A1428] text-white shadow-sm">
                    <span>{topic.numero}</span>
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-lg sm:text-xl text-[#8A1428] truncate">
                      {topic.nombre}
                    </h3>
                    <p className="text-sm sm:text-base text-[#584141] line-clamp-1 mt-0.5">
                      {topic.subtitulo}
                    </p>
                    <div className="text-xs sm:text-sm text-[#AC0B32] font-semibold mt-1">
                      Contraste: {topic.contrastePrincipal}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="p-1.5 rounded-lg text-[#8A1428] hover:bg-[#8A14280F]">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Topic Expanded: 5 Stages Grid */}
              {isExpanded && (
                <div className="border-t border-[#8A142815] p-5 bg-[#FBF5EC40] space-y-4">
                  {/* Topic Key Formula Header */}
                  <div className="p-3 bg-white rounded-lg border border-[#8A142815] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                    <div>
                      <span className="font-semibold text-[#8A1428] block">Notación oficial:</span>
                      <MathView math={topic.notacion} inline />
                    </div>
                    <div>
                      <span className="font-semibold text-[#8A1428] block">Esperanza y Varianza:</span>
                      <div className="flex items-center gap-2">
                        <MathView math={topic.esperanza} inline />
                        <span>•</span>
                        <MathView math={topic.varianza} inline />
                      </div>
                    </div>
                  </div>

                  {/* 5 Stages Flow */}
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {topic.etapas.map((etapa, eIdx) => {
                      return (
                        <button
                          key={etapa.id}
                          onClick={() => onStartStage(topic.id, etapa.id)}
                          className="p-3.5 rounded-xl border bg-white border-[#8A142830] hover:border-[#AC0B32] hover:shadow-md cursor-pointer text-left transition-all flex flex-col justify-between min-h-[115px]"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#AC0B32]">
                                Etapa {eIdx + 1}
                              </span>
                              <Play className="w-3.5 h-3.5 text-[#FF051E] fill-[#FF051E]" />
                            </div>
                            <div className="font-bold text-xs sm:text-sm text-[#8A1428] line-clamp-1">
                              {etapa.titulo.split(':')[1]?.trim() || etapa.titulo}
                            </div>
                            <div className="text-xs text-[#584141] line-clamp-2 mt-1">
                              {etapa.descripcion}
                            </div>
                          </div>

                          <div className="mt-2 text-xs font-semibold text-[#FF051E] flex items-center gap-1">
                            <span>Practicar →</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
