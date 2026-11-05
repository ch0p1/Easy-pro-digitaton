import React, { useState, useMemo, useEffect } from 'react';
import { TOPICS_DATA } from '../../data/topics';
import { Exercise, TopicId } from '../../types';
import { ExerciseCard } from './ExerciseCard';
import { Target, X, Shuffle, CheckCircle, RotateCcw } from 'lucide-react';
import { shuffledOrder } from '../../utils/shuffle';

interface QuickDrillModalProps {
  unlockedCheck?: (t: TopicId) => boolean;
  onClose: () => void;
  onOpenCalculator?: () => void;
}

export const QuickDrillModal: React.FC<QuickDrillModalProps> = ({
  unlockedCheck,
  onClose,
  onOpenCalculator,
}) => {
  // Collect all 'reconocer' exercises from all topics that are unlocked
  const availableExercises: Exercise[] = useMemo(() => {
    const list: Exercise[] = [];
    TOPICS_DATA.forEach((topic) => {
      // Solo temas ya desbloqueados (si no se indica la regla, se incluyen todos)
      if (unlockedCheck && !unlockedCheck(topic.id)) return;
      topic.etapas.forEach((stage) => {
        if (stage.id === 'reconocer') {
          list.push(...stage.ejercicios);
        }
      });
    });
    // Mezcla uniforme (Fisher-Yates)
    return shuffledOrder(list.length).map((i) => list[i]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [drillScore, setDrillScore] = useState<number>(0);

  const currentExercise = availableExercises[currentIndex] || availableExercises[0];

  const handleNext = () => {
    setDrillScore((prev) => prev + 1);
    setCompletedCount((prev) => prev + 1);
    if (currentIndex + 1 < availableExercises.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Loop or finish
      setCurrentIndex(0);
    }
  };

  // WCAG 2.2: Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quickdrill-modal-title"
      className="fixed inset-0 z-50 bg-[#1d1b1680] backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="surface-card-elevated max-w-3xl w-full p-6 sm:p-8 relative max-h-[95vh] overflow-y-auto space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Cerrar entrenamiento rápido"
          className="absolute top-5 right-5 p-2 rounded-full text-[#8A1428] hover:bg-[#8A142815] transition-colors focus-visible:ring-2 focus-visible:ring-[#8A1428]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#8A14281A] pb-3 pr-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#AC0B32]">
              <Target className="w-4 h-4 text-[#C00418]" />
              Entrenamiento de Decisión Rápida (5-10 min)
            </div>
            <h2 id="quickdrill-modal-title" className="text-xl font-bold text-[#8A1428] mt-0.5">
              Identifica el Modelo al Vuelo
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-[#8A1428]">
              Aciertos: {drillScore}
            </span>
            <div className="text-[11px] text-[#584141]">
              Caso {currentIndex + 1} de {availableExercises.length}
            </div>
          </div>
        </div>

        {/* Exercise Card */}
        {currentExercise && (
          <ExerciseCard
            key={currentExercise.id}
            exercise={currentExercise}
            topicId={currentExercise.tema}
            stageId={currentExercise.etapa}
            onCompleted={() => handleNext()}
            onOpenCalculator={onOpenCalculator}
          />
        )}
      </div>
    </div>
  );
};