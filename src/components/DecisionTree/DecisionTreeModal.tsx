import React, { useState, useEffect } from 'react';
import { DECISION_TREE, DecisionNode } from '../../data/decisionTree';
import { TopicId } from '../../types';
import { Compass, RotateCcw, ArrowRight, CheckCircle2, BookOpen, Calculator, X } from 'lucide-react';

interface DecisionTreeModalProps {
  onClose: () => void;
  onSelectTopic: (topicId: TopicId) => void;
  onOpenCalculator: (topicId: TopicId) => void;
}

export const DecisionTreeModal: React.FC<DecisionTreeModalProps> = ({
  onClose,
  onSelectTopic,
  onOpenCalculator,
}) => {
  const [currentNodeId, setCurrentNodeId] = useState<string>('root');
  const [history, setHistory] = useState<string[]>(['root']);
  const [finalResult, setFinalResult] = useState<{
    topic: TopicId;
    notes: string;
    pathLabels: string[];
  } | null>(null);

  const currentNode: DecisionNode = DECISION_TREE[currentNodeId] || DECISION_TREE['root'];

  const handleSelectOption = (option: any) => {
    if (option.resultTopic) {
      setFinalResult({
        topic: option.resultTopic,
        notes: option.resultNotes || '',
        pathLabels: [...history.map((id) => DECISION_TREE[id]?.question), option.label],
      });
    } else if (option.nextNodeId) {
      setCurrentNodeId(option.nextNodeId);
      setHistory((prev) => [...prev, option.nextNodeId]);
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      const prevNode = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      setCurrentNodeId(prevNode);
      setFinalResult(null);
    }
  };

  const handleRestart = () => {
    setCurrentNodeId('root');
    setHistory(['root']);
    setFinalResult(null);
  };

  // WCAG 2.2: Escape key listener to close modal
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
      aria-labelledby="decision-tree-title"
      className="fixed inset-0 z-50 bg-[#1d1b1680] backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="surface-card-elevated max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto space-y-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Cerrar asistente de árbol de decisión"
          className="absolute top-5 right-5 p-2 rounded-full text-[#8A1428] hover:bg-[#8A142815] transition-colors focus-visible:ring-2 focus-visible:ring-[#8A1428]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#AC0B32]">
            <Compass className="w-4 h-4 text-[#C00418]" />
            Árbol de Decisión del Curso Devore
          </div>
          <h2 id="decision-tree-title" className="text-xl sm:text-2xl font-bold text-[#8A1428]">
            «¿Qué modelo uso y por qué?»
          </h2>
          <p className="text-xs sm:text-sm text-[#584141]">
            Responde las preguntas paso a paso para identificar la distribución exacta que describe tu problema.
          </p>
        </div>

        {/* Step Progression / Breadcrumbs */}
        <div className="flex items-center justify-between text-xs text-[#8A1428] border-b border-[#8A142815] pb-3">
          <span className="font-semibold">
            Paso {history.length} de {finalResult ? history.length : '3-4'}
          </span>
          <div className="flex items-center gap-3">
            {history.length > 1 && (
              <button
                onClick={handleBack}
                className="hover:underline font-medium text-[#584141]"
              >
                ← Volver un paso
              </button>
            )}
            <button
              onClick={handleRestart}
              className="flex items-center gap-1 hover:underline font-medium text-[#AC0B32]"
            >
              <RotateCcw className="w-3 h-3" />
              Reiniciar
            </button>
          </div>
        </div>

        {/* Content: Either Active Node Question OR Final Result Recommendation */}
        {!finalResult ? (
          <div className="space-y-4">
            {/* Question Card */}
            <div className="p-4 bg-[#FBF5EC] rounded-xl border border-[#8A14281A] space-y-1.5">
              <h3 className="text-base sm:text-lg font-bold text-[#8A1428]">
                {currentNode.question}
              </h3>
              {currentNode.clue && (
                <p className="text-xs text-[#584141] italic">
                  💡 Pista: {currentNode.clue}
                </p>
              )}
            </div>

            {/* Options list */}
            <div className="space-y-2.5">
              {currentNode.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  className="w-full text-left p-4 rounded-xl border border-[#8A142825] bg-white hover:border-[#AC0B32] hover:bg-[#FBF5EC50] hover:shadow-sm transition-all group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-sm sm:text-base text-[#8A1428] group-hover:text-[#AC0B32]">
                        {option.label}
                      </div>
                      <div className="text-xs text-[#584141] mt-1 leading-relaxed">
                        {option.description}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#8A1428] group-hover:text-[#AC0B32] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Final Decision Found */
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="p-5 bg-[#FFFFFF] border-2 border-[#2ECC71] rounded-xl shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#2ECC71] font-bold text-sm uppercase tracking-wide">
                <CheckCircle2 className="w-5 h-5 text-[#2ECC71]" />
                Modelo Identificado con Éxito
              </div>
              <h3 className="text-2xl font-extrabold text-[#8A1428] capitalize">
                {finalResult.topic === 'geometrica-nb'
                  ? 'Geométrica o Binomial Negativa'
                  : `Distribución ${finalResult.topic}`}
              </h3>
              <p className="text-sm text-[#1d1b16] leading-relaxed bg-[#FBF5EC] p-3 rounded-lg border border-[#8A142815]">
                {finalResult.notes}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  onSelectTopic(finalResult.topic);
                  onClose();
                }}
                className="tactile-btn-primary w-full sm:w-auto flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Practicar en Playground</span>
              </button>
              <button
                onClick={() => {
                  onOpenCalculator(finalResult.topic);
                  onClose();
                }}
                className="tactile-btn-secondary w-full sm:w-auto flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4 text-[#AC0B32]" />
                <span>Calcular en Calculadora</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
