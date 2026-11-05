import React, { useEffect, useState } from 'react';
import { TOPICS_DATA } from '../../data/topics';
import { AppState, TopicId, StageId } from '../../types';
import {
  Play,
  ChevronDown,
  ChevronUp,
  Target,
  Compass,
  Lock,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { MathView } from '../MathView';
import { SCORED_STAGES, completionPercentage } from '../../scorm/progress';
import {
  approvedStageCount,
  blockingTopic,
  completedTopicCount,
  firstOpenTopic,
  getStageStatus,
  getTopicStatus,
  previousScoredStage,
} from '../../progress/rules';

interface TopicRoadmapProps {
  /** Progreso guardado por tema (state.temas). */
  progress: AppState['temas'];
  onStartStage: (topicId: TopicId, stageId: StageId) => void;
  onOpenDecisionTree: () => void;
  onOpenQuickDrill: () => void;
  /** Tema que debe aparecer expandido (por ejemplo, el recién desbloqueado). */
  focusTopic?: TopicId | null;
  /** Aviso accesible (por ejemplo, «tema bloqueado»). */
  notice?: string | null;
  onDismissNotice?: () => void;
}

const topicName = (id: TopicId) => TOPICS_DATA.find((t) => t.id === id)?.nombre ?? id;
const shortStageTitle = (titulo: string) => titulo.split(':')[1]?.trim() || titulo;

export const TopicRoadmap: React.FC<TopicRoadmapProps> = ({
  progress,
  onStartStage,
  onOpenDecisionTree,
  onOpenQuickDrill,
  focusTopic,
  notice,
  onDismissNotice,
}) => {
  const [expandedTopic, setExpandedTopic] = useState<TopicId | ''>(focusTopic ?? firstOpenTopic(progress));

  useEffect(() => {
    if (focusTopic) setExpandedTopic(focusTopic);
  }, [focusTopic]);

  const toggleTopic = (id: TopicId) => {
    setExpandedTopic((prev) => (prev === id ? '' : id));
  };

  const percentage = completionPercentage({ temas: progress });
  const completedTopics = completedTopicCount(progress);

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
            <strong className="text-[#8A1428]">«¿qué distribución modela este problema y por qué?»</strong>. Avanza en orden: cada tema y cada etapa se desbloquea al aprobar la anterior.
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

      {/* Avance global */}
      <div className="surface-card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-bold text-[#8A1428]">Avance del curso</span>
            <span className="text-sm font-mono font-bold text-[#8A1428]">{percentage}%</span>
          </div>
          <div
            role="progressbar"
            aria-label="Avance del curso"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percentage}
            className="mt-2 h-2.5 bg-[#8A142815] rounded-full overflow-hidden"
          >
            <div className="h-full bg-[#8A1428] rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
          </div>
        </div>
        <div className="text-sm text-[#584141] sm:text-right flex-shrink-0">
          <span className="font-bold text-[#8A1428]">{completedTopics}</span> de {TOPICS_DATA.length} bloques completados
        </div>
      </div>

      {notice && (
        <div role="status" className="p-4 rounded-xl border border-[#8A142840] bg-white flex items-start justify-between gap-3 text-sm text-[#1d1b16]">
          <div className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 mt-0.5 text-[#8A1428] flex-shrink-0" aria-hidden="true" />
            <span>{notice}</span>
          </div>
          {onDismissNotice && (
            <button type="button" onClick={onDismissNotice} className="text-xs font-semibold text-[#8A1428] underline flex-shrink-0">
              Entendido
            </button>
          )}
        </div>
      )}

      {/* Roadmap List of 8 Topics */}
      <div className="space-y-4">
        {TOPICS_DATA.map((topic) => {
          const status = getTopicStatus(progress, topic.id);
          const locked = status === 'bloqueado';
          const completed = status === 'completado';
          const isExpanded = !locked && expandedTopic === topic.id;
          const approved = approvedStageCount(progress, topic.id);
          const blocker = locked ? blockingTopic(progress, topic.id) : null;
          const panelId = `topic-panel-${topic.id}`;

          return (
            <div
              key={topic.id}
              data-topic={topic.id}
              data-status={status}
              className={`surface-card transition-all ${locked ? 'bg-[#F4EEE4]' : 'hover:border-[#8A142833]'}`}
            >
              {/* Cabecera del tema */}
              <div
                onClick={() => !locked && toggleTopic(topic.id)}
                className={`p-5 flex items-center justify-between gap-4 select-none ${locked ? '' : 'cursor-pointer'}`}
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-base sm:text-lg flex-shrink-0 shadow-sm ${
                      locked ? 'bg-[#D9D0C3] text-[#584141]' : completed ? 'bg-[#1E824C] text-white' : 'bg-[#8A1428] text-white'
                    }`}
                  >
                    {locked ? <Lock className="w-5 h-5" aria-hidden="true" /> : completed ? <CheckCircle2 className="w-6 h-6" aria-hidden="true" /> : <span>{topic.numero}</span>}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold text-lg sm:text-xl text-[#8A1428]">
                      <button
                        type="button"
                        disabled={locked}
                        aria-expanded={locked ? undefined : isExpanded}
                        aria-controls={locked ? undefined : panelId}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTopic(topic.id);
                        }}
                        className="text-left truncate max-w-full disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">Tema {topic.numero}: </span>
                        {topic.nombre}
                      </button>
                    </h3>
                    <p className="text-sm sm:text-base text-[#584141] line-clamp-1 mt-0.5">{topic.subtitulo}</p>
                    {locked && blocker ? (
                      <div className="text-xs sm:text-sm text-[#584141] font-semibold mt-1 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Bloqueado: completa «{topicName(blocker)}» para desbloquearlo</span>
                      </div>
                    ) : (
                      <div className="text-xs sm:text-sm text-[#AC0B32] font-semibold mt-1">
                        Contraste: {topic.contrastePrincipal}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {!locked && (
                    <div className="hidden sm:flex flex-col items-end gap-1">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          completed ? 'bg-[#E6F4EC] text-[#14663A]' : 'bg-[#8A142812] text-[#8A1428]'
                        }`}
                      >
                        {completed ? 'Completado' : status === 'en-curso' ? `${approved} de ${SCORED_STAGES.length} etapas` : 'Disponible'}
                      </span>
                      <div
                        role="progressbar"
                        aria-label={`Etapas aprobadas de ${topic.nombre}`}
                        aria-valuemin={0}
                        aria-valuemax={SCORED_STAGES.length}
                        aria-valuenow={approved}
                        className="w-24 h-1.5 bg-[#8A142815] rounded-full overflow-hidden"
                      >
                        <div className="h-full bg-[#8A1428] rounded-full" style={{ width: `${(approved / SCORED_STAGES.length) * 100}%` }} />
                      </div>
                    </div>
                  )}
                  {!locked && (
                    <div className="p-1.5 rounded-lg text-[#8A1428] hover:bg-[#8A14280F]" aria-hidden="true">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  )}
                  {locked && <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#D9D0C3] text-[#3F3333]">Bloqueado</span>}
                </div>
              </div>

              {/* Etapas del tema */}
              {isExpanded && (
                <div id={panelId} className="border-t border-[#8A142815] p-5 bg-[#FBF5EC40] space-y-4">
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

                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {topic.etapas.map((etapa, eIdx) => {
                      const stageStatus = getStageStatus(progress, topic.id, etapa.id);
                      const stageLocked = stageStatus === 'bloqueada';
                      const stageDone = stageStatus === 'aprobada';
                      const prev = previousScoredStage(etapa.id);
                      const prevTitle = prev
                        ? shortStageTitle(topic.etapas.find((e) => e.id === prev)?.titulo ?? '')
                        : '';

                      return (
                        <button
                          key={etapa.id}
                          type="button"
                          data-stage={etapa.id}
                          data-status={stageStatus}
                          disabled={stageLocked}
                          onClick={() => onStartStage(topic.id, etapa.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[115px] ${
                            stageLocked
                              ? 'bg-[#F4EEE4] border-[#D9D0C3] cursor-not-allowed'
                              : stageDone
                              ? 'bg-white border-[#1E824C80] hover:border-[#1E824C] hover:shadow-md cursor-pointer'
                              : 'bg-white border-[#8A142830] hover:border-[#AC0B32] hover:shadow-md cursor-pointer'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className={`text-[11px] font-bold uppercase tracking-wider ${stageLocked ? 'text-[#584141]' : 'text-[#AC0B32]'}`}>
                                Etapa {eIdx + 1}
                              </span>
                              {stageLocked ? (
                                <Lock className="w-3.5 h-3.5 text-[#584141]" aria-hidden="true" />
                              ) : stageDone ? (
                                <CheckCircle2 className="w-4 h-4 text-[#1E824C]" aria-hidden="true" />
                              ) : (
                                <Play className="w-3.5 h-3.5 text-[#FF051E] fill-[#FF051E]" aria-hidden="true" />
                              )}
                            </div>
                            <div className={`font-bold text-xs sm:text-sm line-clamp-1 ${stageLocked ? 'text-[#584141]' : 'text-[#8A1428]'}`}>
                              {shortStageTitle(etapa.titulo)}
                            </div>
                            <div className="text-xs text-[#584141] line-clamp-2 mt-1">{etapa.descripcion}</div>
                          </div>

                          <div
                            className={`mt-2 text-xs font-semibold flex items-center gap-1 ${
                              stageLocked ? 'text-[#584141]' : stageDone ? 'text-[#14663A]' : 'text-[#FF051E]'
                            }`}
                          >
                            {stageLocked ? (
                              <span>Aprueba «{prevTitle}» primero</span>
                            ) : stageDone ? (
                              <>
                                <RotateCcw className="w-3 h-3" aria-hidden="true" />
                                <span>Aprobada · Repasar</span>
                              </>
                            ) : (
                              <span>{etapa.id === 'pistas' ? 'Leer →' : 'Practicar →'}</span>
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