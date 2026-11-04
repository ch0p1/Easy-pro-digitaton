import React from 'react';
import { CheckCircle2, XCircle, Lightbulb, Video, ArrowRight, RotateCcw } from 'lucide-react';
import { Exercise } from '../../types';

interface FeedbackDrawerProps {
  exercise: Exercise;
  isCorrect: boolean;
  selectedOptionIndex?: number;
  userAnswer?: string;
  consecutiveFailures: number;
  onNext: () => void;
  onRetry: () => void;
  onOpenVideo?: () => void;
}

export const FeedbackDrawer: React.FC<FeedbackDrawerProps> = ({
  exercise,
  isCorrect,
  selectedOptionIndex,
  consecutiveFailures,
  onNext,
  onRetry,
  onOpenVideo,
}) => {
  const commonTrapMessage =
    selectedOptionIndex !== undefined && exercise.error_comun
      ? exercise.error_comun[selectedOptionIndex]
      : null;

  return (
    <div
      role="alert"
      className={`mt-6 p-5 rounded-xl border transition-all ${
        isCorrect
          ? 'bg-[#FFFFFF] border-[#1E824C] shadow-[0_8px_24px_-4px_rgba(30,130,76,0.15)]'
          : 'bg-[#FFFFFF] border-[#BA0F23] shadow-[0_8px_24px_-4px_rgba(186,15,35,0.15)]'
      }`}
    >
      {/* Header status */}
      <div className="flex items-center justify-between pb-3 border-b border-[#8A142815]">
        <div className="flex items-center gap-2.5">
          {isCorrect ? (
            <div className="flex items-center gap-2 text-[#1E824C] font-bold text-lg">
              <CheckCircle2 className="w-6 h-6 text-[#1E824C]" aria-hidden="true" />
              <span>¡Respuesta Correcta! (+20 XP)</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[#BA0F23] font-bold text-lg">
              <XCircle className="w-6 h-6 text-[#BA0F23]" aria-hidden="true" />
              <span>Revisa el planteamiento</span>
            </div>
          )}
        </div>

        {/* Action Button */}
        {isCorrect ? (
          <button
            onClick={onNext}
            className="tactile-btn-primary px-5 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 shadow-sm min-h-[44px]"
          >
            <span>Continuar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onRetry}
            className="tactile-btn-secondary px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Intentar de nuevo</span>
          </button>
        )}
      </div>

      {/* Pedagogical body */}
      <div className="mt-4 space-y-3 text-sm">
        {/* Specific trap explanation if wrong */}
        {!isCorrect && commonTrapMessage && (
          <div className="p-3 bg-[#FF051E0D] border-l-4 border-[#FF051E] rounded-r text-[#8A1428]">
            <span className="font-bold text-[#FF051E] block mb-0.5">Trampa clásica de examen:</span>
            {commonTrapMessage}
          </div>
        )}

        {/* Pistas clave del enunciado */}
        {exercise.pistas_clave && exercise.pistas_clave.length > 0 && (
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#AC0B32]">
              <Lightbulb className="w-3.5 h-3.5 text-[#FF836C]" />
              Pistas determinantes en el enunciado:
            </div>
            <div className="flex flex-wrap gap-2">
              {exercise.pistas_clave.map((pista, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-[#FBF5EC] text-[#8A1428] border border-[#8A142825] rounded-full text-xs font-medium"
                >
                  🎯 {pista}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pedagogical explanation */}
        <div className="text-[#1d1b16] bg-[#FBF5EC80] p-3 rounded-lg border border-[#8A142810] leading-relaxed">
          <span className="font-semibold text-[#8A1428] block mb-1">Por qué este modelo:</span>
          {exercise.explicacion}
        </div>

        {/* Solution steps if numeric */}
        {exercise.pasosSolucion && exercise.pasosSolucion.length > 0 && (
          <div className="p-3 bg-[#FFFFFF] rounded-lg border border-[#8A142815] space-y-1">
            <span className="text-xs font-semibold text-[#8A1428] block">Paso a paso del cálculo:</span>
            <ol className="list-decimal list-inside text-xs text-[#584141] space-y-1">
              {exercise.pasosSolucion.map((paso, idx) => (
                <li key={idx}>{paso}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Video suggestion if 2 consecutive failures */}
        {consecutiveFailures >= 2 && onOpenVideo && (
          <div className="p-3 bg-[#8A14280F] border border-[#8A142825] rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-[#FF051E]" />
              <div className="text-xs text-[#8A1428]">
                <strong>¿Te trabaste?</strong> Repasa la cápsula en video de la Biblioteca para este tema.
              </div>
            </div>
            <button
              onClick={onOpenVideo}
              className="text-xs font-bold text-[#8A1428] underline hover:text-[#FF051E]"
            >
              Ver video
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
