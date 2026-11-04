import React from 'react';
import { TopicData } from '../../types';
import { MathView } from '../MathView';
import { BookOpen, Lightbulb, AlertTriangle, ArrowRight, X } from 'lucide-react';

interface PistasReaderModalProps {
  topic: TopicData;
  onClose: () => void;
  onContinueToReconocer: () => void;
}

export const PistasReaderModal: React.FC<PistasReaderModalProps> = ({
  topic,
  onClose,
  onContinueToReconocer,
}) => {
  const pistasStage = topic.etapas.find((e) => e.id === 'pistas');
  const info = pistasStage?.pistasTeoria;

  if (!info) return null;

  // WCAG 2.2: Escape key listener
  React.useEffect(() => {
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
      aria-labelledby="pistas-modal-title"
      className="fixed inset-0 z-50 bg-[#1d1b1680] backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="surface-card-elevated max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          aria-label="Cerrar lectura de pistas"
          className="absolute top-5 right-5 p-2 rounded-full text-[#8A1428] hover:bg-[#8A142815] transition-colors focus-visible:ring-2 focus-visible:ring-[#8A1428]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#AC0B32]">
            <BookOpen className="w-4 h-4 text-[#C00418]" />
            Etapa 1: Pistas y Señales Clave
          </div>
          <h2 id="pistas-modal-title" className="text-2xl sm:text-3xl font-bold text-[#8A1428]">{topic.nombre}</h2>
          <p className="text-sm sm:text-base text-[#584141] font-medium">{info.titulo}</p>
        </div>

        {/* Signals List */}
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8A1428] block">
            4 Señales Clave del Enunciado:
          </span>
          <div className="space-y-2">
            {info.senales.map((s, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#FBF5EC] rounded-xl border border-[#8A142815] flex items-start gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-[#8A1428] text-white flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-base text-[#1D1B16] font-medium leading-relaxed">{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Counterexample */}
        <div className="p-4 bg-[#FF051E0A] border-l-4 border-[#FF051E] rounded-r-xl space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-xs text-[#FF051E] uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-[#FF051E]" />
            <span>Contraejemplo (No te confundas):</span>
          </div>
          <p className="text-sm sm:text-base text-[#8A1428] leading-relaxed">
            {info.contraejemplo}
          </p>
        </div>

        {/* Key formula block */}
        <div className="p-4 bg-white rounded-xl border border-[#8A142820] space-y-2">
          <span className="text-xs font-semibold text-[#8A1428] block">Fórmula de partida:</span>
          <div className="overflow-x-auto text-base">
            <MathView math={info.formulaClave} />
          </div>
        </div>

        {/* Action Button to advance directly to Stage 2 (Reconocer) */}
        <button
          onClick={onContinueToReconocer}
          className="tactile-btn-primary w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm"
        >
          <span>Comenzar Etapa 2: Reconocer</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
