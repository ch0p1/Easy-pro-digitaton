import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Exercise, StageId, TopicId } from '../../types';
import { FeedbackDrawer } from './FeedbackDrawer';
import { MathView } from '../MathView';
import { shuffledOrder } from '../../utils/shuffle';
import { HelpCircle, Sparkles, Check, Send } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  topicId: TopicId;
  stageId: StageId;
  onCompleted: (isSuccess: boolean) => void;
  onOpenVideo?: () => void;
  onOpenCalculator?: () => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onCompleted,
  onOpenVideo,
  onOpenCalculator,
}) => {
  // Option multiple & detecta error state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Orden de presentación de las opciones (índices originales). Se mezcla una vez por ejercicio
  // para que la posición de la respuesta correcta no sea predecible. `selectedOption`, `correcta`
  // y `error_comun` siguen usando el índice original.
  const optionOrder = useMemo(
    () => shuffledOrder(exercise.opciones?.length ?? 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [exercise.id]
  );

  // Numeric state
  const [numericInput, setNumericInput] = useState<string>('');

  // Parametros state (parameter key -> string value)
  const [paramInputs, setParamInputs] = useState<Record<string, string>>({});

  // Submission & evaluation state
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [consecutiveFailures, setConsecutiveFailures] = useState<number>(0);

  // Reset local state when exercise changes
  useEffect(() => {
    setSelectedOption(null);
    setNumericInput('');
    setParamInputs({});
    setIsSubmitted(false);
    setIsCorrect(false);
  }, [exercise.id]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitted) return;

    let correct = false;

    if (exercise.tipo === 'opcion-multiple' || exercise.tipo === 'detecta-error') {
      if (selectedOption === null) return;
      correct = selectedOption === exercise.correcta;
    } else if (exercise.tipo === 'numerico') {
      const val = parseFloat(numericInput.replace(',', '.'));
      if (isNaN(val)) return;
      const expected = exercise.valorEsperado ?? 0;
      const tol = exercise.tolerancia ?? 0.0005;
      correct = Math.abs(val - expected) <= tol;
    } else if (exercise.tipo === 'parametros') {
      if (!exercise.parametrosEsperados) return;
      correct = exercise.parametrosEsperados.every((p) => {
        const userVal = parseFloat((paramInputs[p.name] || '').replace(',', '.'));
        const expVal = typeof p.expectedValue === 'number' ? p.expectedValue : parseFloat(p.expectedValue);
        return Math.abs(userVal - expVal) <= 0.01;
      });
    }

    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      setConsecutiveFailures(0);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#8A1428', '#FF051E', '#FF836C', '#2ECC71'],
        });
      } catch (err) {
        // Confetti fallback
      }
    } else {
      setConsecutiveFailures((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    onCompleted(true);
  };

  const handleRetry = () => {
    setIsSubmitted(false);
  };

  // Helper to highlight key clues in the enunciado when submitted
  const renderEnunciado = () => {
    return (
      <div className="text-lg sm:text-xl text-[#1D1B16] font-medium leading-relaxed whitespace-pre-line tracking-tight">
        {exercise.enunciado}
      </div>
    );
  };

  return (
    <div className="surface-card-elevated p-6 md:p-8 space-y-6 max-w-3xl mx-auto">
      {/* Exercise Header */}
      <div className="flex items-center justify-between border-b border-[#8A142815] pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#AC0B32] bg-[#8A142810] px-2.5 py-1 rounded-full">
            {exercise.tipo === 'opcion-multiple' && 'Reconocer Modelo'}
            {exercise.tipo === 'parametros' && 'Identificar Parámetros'}
            {exercise.tipo === 'numerico' && 'Cálculo Numérico'}
            {exercise.tipo === 'detecta-error' && 'Detecta el Error'}
          </span>
          {exercise.origen === 'curso' && (
            <span className="text-[11px] font-semibold text-[#8A1428] bg-[#FF836C25] px-2 py-0.5 rounded-full">
              ★ Problema Verificado del Curso
            </span>
          )}
        </div>

        {onOpenCalculator && (
          <button
            onClick={onOpenCalculator}
            className="text-xs text-[#8A1428] hover:text-[#FF051E] flex items-center gap-1 font-medium transition-colors"
          >
            <span>Abrir Calculadora</span>
          </button>
        )}
      </div>

      {/* Enunciado */}
      <div className="space-y-3">
        {renderEnunciado()}
      </div>

      {/* Dynamic Interactive Input Section */}
      <div className="space-y-4 pt-2">
        {/* Type: Opcion Multiple or Detecta Error */}
        {(exercise.tipo === 'opcion-multiple' || exercise.tipo === 'detecta-error') &&
          exercise.opciones && (
            <fieldset className="space-y-2.5">
              <legend className="sr-only">
                Opciones de respuesta para el ejercicio: {exercise.enunciado}
              </legend>
              {optionOrder.map((idx, pos) => {
                const opcion = exercise.opciones![idx];
                const isSelected = selectedOption === idx;
                let optionStyle =
                  'bg-white border-[#8A142825] text-[#1d1b16] hover:bg-[#FBF5EC] hover:border-[#8A142840]';

                if (isSelected) {
                  optionStyle = 'bg-[#8A1428] text-white border-[#8A1428] shadow-sm font-semibold';
                }

                if (isSubmitted) {
                  if (idx === exercise.correcta) {
                    optionStyle = 'bg-[#1E824C] text-white border-[#1E824C] font-semibold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-[#BA0F23] text-white border-[#BA0F23] font-semibold';
                  } else {
                    optionStyle = 'bg-gray-100 text-gray-500 border-gray-200 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={isSubmitted}
                    onClick={() => setSelectedOption(idx)}
                    className={`w-full text-left p-4 sm:p-4.5 rounded-xl border-1.5 transition-all flex items-center justify-between text-base sm:text-lg min-h-[52px] ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold font-mono ${
                          isSelected || (isSubmitted && idx === exercise.correcta)
                            ? 'bg-white/20 text-white'
                            : 'bg-[#8A142815] text-[#8A1428]'
                        }`}
                      >
                        {String.fromCharCode(65 + pos)}
                      </span>
                      <span className="leading-snug">{opcion}</span>
                    </div>
                    {isSubmitted && idx === exercise.correcta && (
                      <Check className="w-5 h-5 text-white flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </fieldset>
          )}

        {/* Type: Numerico */}
        {exercise.tipo === 'numerico' && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 bg-[#FBF5EC] rounded-xl border border-[#8A142820] space-y-2">
              <label
                htmlFor={`numeric-${exercise.id}`}
                className="block text-xs font-bold text-[#8A1428] uppercase tracking-wide"
              >
                Ingresa tu respuesta (convención del curso: 4 decimales)
              </label>
              <div className="flex items-center gap-3">
                <input
                  id={`numeric-${exercise.id}`}
                  type="text"
                  inputMode="decimal"
                  placeholder="ej. 0.2966"
                  disabled={isSubmitted}
                  value={numericInput}
                  onChange={(e) => setNumericInput(e.target.value)}
                  aria-describedby={`numeric-hint-${exercise.id}`}
                  className="flex-1 p-3 bg-white border-2 border-[#8A142833] focus:border-[#AC0B32] focus:ring-2 focus:ring-[#AC0B3215] rounded-lg text-lg font-mono font-bold text-[#8A1428] outline-none transition-all"
                />
                <span className="text-sm font-semibold text-[#3D2B2B]">
                  {exercise.unidad || 'probabilidad'}
                </span>
              </div>
              <p id={`numeric-hint-${exercise.id}`} className="text-xs text-[#3D2B2B]">
                Tolerancia de validación: ±{exercise.tolerancia ?? 0.0005}. Puedes usar punto o coma.
              </p>
            </div>
          </form>
        )}

        {/* Type: Parametros */}
        {exercise.tipo === 'parametros' && exercise.parametrosEsperados && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset className="p-4 bg-[#FBF5EC] rounded-xl border border-[#8A142820] space-y-3">
              <legend className="text-xs font-bold text-[#8A1428] uppercase tracking-wide block">
                Identifica el valor numérico de cada parámetro:
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {exercise.parametrosEsperados.map((p) => (
                  <div key={p.name} className="p-3 bg-white rounded-lg border border-[#8A142820] space-y-1">
                    <label
                      htmlFor={`param-${exercise.id}-${p.name}`}
                      className="flex items-center justify-between text-xs text-[#8A1428] font-bold"
                    >
                      <span className="font-mono text-sm">{p.symbol}</span>
                      <span className="text-[#3D2B2B] font-medium">{p.description}</span>
                    </label>
                    <input
                      id={`param-${exercise.id}-${p.name}`}
                      type="text"
                      placeholder={`Valor para ${p.symbol}`}
                      disabled={isSubmitted}
                      value={paramInputs[p.name] || ''}
                      onChange={(e) =>
                        setParamInputs({ ...paramInputs, [p.name]: e.target.value })
                      }
                      className="w-full p-2 bg-[#FBF5EC50] border border-[#8A142833] focus:border-[#AC0B32] rounded text-sm font-mono font-semibold text-[#8A1428] outline-none min-h-[44px]"
                    />
                  </div>
                ))}
              </div>
            </fieldset>
          </form>
        )}

        {/* Screen Reader Live Region for status announcement */}
        <div aria-live="polite" className="sr-only">
          {isSubmitted && (isCorrect ? 'Respuesta correcta.' : 'Respuesta incorrecta. Revisa el planteamiento y la retroalimentación.')}
        </div>

        {/* Check Button (before submit) */}
        {!isSubmitted && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={
                exercise.tipo === 'opcion-multiple' || exercise.tipo === 'detecta-error'
                  ? selectedOption === null
                  : exercise.tipo === 'numerico'
                  ? !numericInput.trim()
                  : false
              }
              className="tactile-btn-primary w-full py-3.5 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Comprobar Respuesta</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Immediate Pedagogical Feedback Drawer */}
      {isSubmitted && (
        <FeedbackDrawer
          exercise={exercise}
          isCorrect={isCorrect}
          selectedOptionIndex={selectedOption ?? undefined}
          userAnswer={numericInput}
          consecutiveFailures={consecutiveFailures}
          onNext={handleNext}
          onRetry={handleRetry}
          onOpenVideo={onOpenVideo}
        />
      )}
    </div>
  );
};