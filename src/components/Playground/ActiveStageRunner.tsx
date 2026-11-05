import React, { useState } from 'react';
import { TopicData, StageId, Exercise } from '../../types';
import { ExerciseCard } from './ExerciseCard';
import { ArrowLeft, CheckCircle2, Award, ChevronRight } from 'lucide-react';

interface ActiveStageRunnerProps {
  topic: TopicData;
  stageId: StageId;
  onBackToRoadmap: () => void;
  onStageFinished: (isSuccess: boolean) => void;
  /** Mensaje tras aprobar (p. ej. «Se desbloqueó el tema 2»). */
  continueMessage?: string;
  /** Texto y acción del botón principal tras aprobar la etapa. */
  continueLabel?: string;
  onContinue?: () => void;
  onOpenVideo?: () => void;
  onOpenCalculator?: () => void;
}

export const ActiveStageRunner: React.FC<ActiveStageRunnerProps> = ({
  topic,
  stageId,
  onBackToRoadmap,
  onStageFinished,
  continueMessage,
  continueLabel,
  onContinue,
  onOpenVideo,
  onOpenCalculator,
}) => {
  const currentStage = topic.etapas.find((e) => e.id === stageId);
  const exercises = currentStage?.ejercicios || [];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [stageFinished, setStageFinished] = useState<boolean>(false);

  if (exercises.length === 0) {
    return (
      <div className="surface-card p-8 text-center space-y-4 max-w-xl mx-auto">
        <h3 className="text-xl font-bold text-[#8A1428]">Etapa completada</h3>
        <p className="text-sm text-[#584141]">
          Esta etapa contiene lectura formativa completada con éxito.
        </p>
        <button
          onClick={onBackToRoadmap}
          className="tactile-btn-primary px-5 py-2.5 rounded-xl font-bold text-sm"
        >
          Volver a la Ruta
        </button>
      </div>
    );
  }

  const currentExercise = exercises[currentIndex];

  const handleExerciseCompleted = () => {
    if (currentIndex + 1 < exercises.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setStageFinished(true);
      onStageFinished(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Navigation and Stage Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToRoadmap}
          className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#8A1428] hover:text-[#FF051E] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a la Ruta</span>
        </button>

        <div className="text-right">
          <div className="text-xs font-bold text-[#8A1428]">
            Ejercicio {currentIndex + 1} de {exercises.length}
          </div>
          {/* Stage mini progress bar */}
          <div className="w-24 h-1.5 bg-[#8A142815] rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-[#FF051E] rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / exercises.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stage Context Tag */}
      <div className="bg-white p-3.5 rounded-xl border border-[#8A142815] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#8A1428]">{topic.nombre}</span>
          <span className="text-[#8A142840]">/</span>
          <span className="text-[#AC0B32] font-semibold">{currentStage?.titulo}</span>
        </div>
        <span className="text-[11px] text-[#584141] hidden sm:inline">Reintentos ilimitados</span>
      </div>

      {/* Exercise Runner or Completion Celebration Screen */}
      {!stageFinished ? (
        currentExercise && (
          <ExerciseCard
            key={currentExercise.id}
            exercise={currentExercise}
            topicId={topic.id}
            stageId={stageId}
            onCompleted={handleExerciseCompleted}
            onOpenVideo={onOpenVideo}
            onOpenCalculator={onOpenCalculator}
          />
        )
      ) : (
        <div className="surface-card p-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-[#2ECC7118] text-[#2ECC71] mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#8A1428]">
              ¡Etapa Aprobada con Éxito!
            </h3>
            <p className="text-sm text-[#584141] mt-1">
              Has demostrado el criterio de decisión requerido para esta etapa.
            </p>
          </div>
          {continueMessage && (
            <p role="status" className="text-sm font-semibold text-[#14663A] bg-[#E6F4EC] rounded-lg px-4 py-2.5">
              {continueMessage}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {onContinue && continueLabel && (
              <button
                onClick={onContinue}
                className="tactile-btn-primary py-3 px-8 rounded-xl font-bold text-sm shadow-sm"
              >
                {continueLabel}
              </button>
            )}
            <button
              onClick={onBackToRoadmap}
              className={
                onContinue && continueLabel
                  ? 'tactile-btn-secondary py-3 px-8 rounded-xl font-bold text-sm'
                  : 'tactile-btn-primary py-3 px-8 rounded-xl font-bold text-sm shadow-sm'
              }
            >
              {onContinue && continueLabel ? 'Volver a la Ruta' : 'Continuar en la Ruta'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};