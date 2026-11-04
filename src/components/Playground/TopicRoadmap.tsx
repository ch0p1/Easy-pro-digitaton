import React, { useState } from 'react';
import { TOPICS_DATA } from '../../data/topics';
import { TopicData, TopicId, StageId } from '../../types';
import {
  Lock,
  CheckCircle,
  Play,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  Calculator,
  Compass,
} from 'lucide-react';
import { MathView } from '../MathView';

interface TopicRoadmapProps {
  unlockedCheck: (t: TopicId) => boolean;
  stageUnlockedCheck: (t: TopicId, s: StageId) => boolean;
  userTopicsState: Record<TopicId, any>;
  onStartStage: (topicId: TopicId, stageId: StageId) => void;
  onOpenDecisionTree: () => void;
  onOpenQuickDrill: () => void;
}

export const TopicRoadmap: React.FC<TopicRoadmapProps> = ({
  unlockedCheck,
  stageUnlockedCheck,
  userTopicsState,
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
      {/* Hero Banner with pedagogical mission */}
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
            <strong className="text-[#8A1428]">«¿qué distribución modela este problema y por qué?»</strong>. Domina las 5 etapas por tema con reintentos ilimitados.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenDecisionTree}
              className="tactile-btn-secondary px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm"
            >
              <Compass className="w-4 h-4 text-[#AC0B32]" />
              <span>Árbol de Decisión Interactivo</span>
            </button>
            <button
              onClick={onOpenQuickDrill}
              className="tactile-btn-primary px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm"
            >
              <Target className="w-4 h-4" />
              <span>Modo Práctica Rápida (Reconocer)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Roadmap List of 8 Topics */}
      <div className="space-y-4">
        {TOPICS_DATA.map((topic, index) => {
          const isUnlocked = unlockedCheck(topic.id);
          const isCompleted = userTopicsState[topic.id]?.completado ?? false;
          const isExpanded = expandedTopic === topic.id;

          // Approved stages count
          const stagesObj = userTopicsState[topic.id]?.etapas || {};
          const approvedCount = ['reconocer', 'parametros', 'calcular', 'contrastar'].filter(
            (s) => stagesObj[s]?.aprobada
          ).length;

          return (
            <div
              key={topic.id}
              className={`surface-card transition-all ${
                !isUnlocked ? 'opacity-60 bg-[#FBF5EC80]' : 'hover:border-[#8A142833]'
              }`}
            >
              {/* Topic Header Accordion Trigger */}
              <div
                onClick={() => isUnlocked && toggleTopic(topic.id)}
                className={`p-5 flex items-center justify-between gap-4 cursor-pointer select-none ${
                  !isUnlocked ? 'cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  {/* Topic badge node */}
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0 transition-transform ${
                      isCompleted
                        ? 'bg-[#2ECC71] text-white shadow-sm'
                        : isUnlocked
                        ? 'bg-[#8A1428] text-white shadow-sm'
                        : 'bg-[#8A14281A] text-[#8A142866]'
                    }`}
                  >
                    {isCompleted ? (
                      <Award className="w-6 h-6" />
                    ) : isUnlocked ? (
                      <span>{topic.numero}</span>
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg sm:text-xl text-[#8A1428] truncate">
                        {topic.nombre}
                      </h3>
                      {isCompleted && (
                        <span className="text-xs bg-[#2ECC7118] text-[#1e824c] px-2.5 py-0.5 rounded-full font-semibold">
                          Completado
                        </span>
                      )}
                      {!isUnlocked && (
                        <span className="text-xs bg-[#8A142810] text-[#8A142880] px-2.5 py-0.5 rounded-full font-medium">
                          Bloqueado
                        </span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-[#584141] line-clamp-1 mt-0.5">
                      {topic.subtitulo}
                    </p>
                    <div className="text-xs sm:text-sm text-[#AC0B32] font-semibold mt-1">
                      Contraste: {topic.contrastePrincipal}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {isUnlocked && (
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-semibold text-[#8A1428]">
                        {approvedCount}/4 etapas
                      </div>
                      <div className="w-20 h-1.5 bg-[#8A142815] rounded-full overflow-hidden mt-1">
                        <div
                          className="h-full bg-[#FF051E] rounded-full transition-all duration-300"
                          style={{ width: `${(approvedCount / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {isUnlocked && (
                    <div className="p-1.5 rounded-lg text-[#8A1428] hover:bg-[#8A14280F]">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Topic Expanded: 5 Stages Grid */}
              {isUnlocked && isExpanded && (
                <div className="border-t border-[#8A142815] p-5 bg-[#FBF5EC40] space-y-4">
                  {/* Topic Key Formula Header */}
                  <div className="p-3 bg-white rounded-lg border border-[#8A142815] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
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
                      const isStageApproved = stagesObj[etapa.id]?.aprobada ?? false;
                      const isStageOpen = stageUnlockedCheck(topic.id, etapa.id);

                      return (
                        <button
                          key={etapa.id}
                          disabled={!isStageOpen}
                          onClick={() => onStartStage(topic.id, etapa.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[110px] ${
                            isStageApproved
                              ? 'bg-white border-[#2ECC71] shadow-sm hover:border-[#2ECC71]'
                              : isStageOpen
                              ? 'bg-white border-[#8A142830] hover:border-[#AC0B32] hover:shadow-md cursor-pointer'
                              : 'bg-[#FBF5EC80] border-[#8A142815] opacity-50 cursor-not-allowed'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#AC0B32]">
                                Etapa {eIdx + 1}
                              </span>
                              {isStageApproved ? (
                                <CheckCircle className="w-4 h-4 text-[#2ECC71]" />
                              ) : isStageOpen ? (
                                <Play className="w-3.5 h-3.5 text-[#FF051E] fill-[#FF051E]" />
                              ) : (
                                <Lock className="w-3.5 h-3.5 text-[#8A142860]" />
                              )}
                            </div>
                            <div className="font-bold text-xs text-[#8A1428] line-clamp-1">
                              {etapa.titulo.split(':')[1]?.trim() || etapa.titulo}
                            </div>
                            <div className="text-[11px] text-[#584141] line-clamp-2 mt-1">
                              {etapa.descripcion}
                            </div>
                          </div>

                          <div className="mt-2 text-[10px] font-semibold text-[#8A1428] flex items-center gap-1">
                            {isStageApproved ? (
                              <span className="text-[#2ECC71]">Aprobada ✓</span>
                            ) : isStageOpen ? (
                              <span className="text-[#FF051E]">Iniciar →</span>
                            ) : (
                              <span className="text-[#584141]">Requiere ant.</span>
                            )}
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
