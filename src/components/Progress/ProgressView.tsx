import React, { useState } from 'react';
import { AppState, TopicId, RecordedError } from '../../types';
import { TOPICS_DATA } from '../../data/topics';
import {
  Flame,
  Award,
  Zap,
  RotateCcw,
  Download,
  Upload,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Play,
  GraduationCap,
} from 'lucide-react';

interface ProgressViewProps {
  state: AppState;
  onExport: () => void;
  onImport: (json: string) => boolean;
  onReset: () => void;
  onStartReviewExercise: (error: RecordedError) => void;
  onOpenScormModal?: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  state,
  onExport,
  onImport,
  onReset,
  onStartReviewExercise,
  onOpenScormModal,
}) => {
  const [importText, setImportText] = useState<string>('');
  const [showImportBox, setShowImportBox] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const completedTopicsCount = TOPICS_DATA.filter(
    (t) => state.temas[t.id]?.completado
  ).length;

  const handleImportSubmit = () => {
    const success = onImport(importText);
    if (success) {
      setImportStatus('¡Progreso importado con éxito!');
      setShowImportBox(false);
      setImportText('');
    } else {
      setImportStatus('Error: formato JSON no válido.');
    }
  };

  // Group errors by confusion type
  const confusionsMap = state.errores.reduce((acc, err) => {
    acc[err.confusion] = (acc[err.confusion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Racha */}
        <div className="surface-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FF836C20] flex items-center justify-center text-[#FF836C]">
            <Flame className="w-7 h-7 fill-[#FF836C]" />
          </div>
          <div>
            <div className="text-xs text-[#584141] font-medium">Racha de Estudio</div>
            <div className="text-2xl font-black text-[#8A1428]">
              {state.racha.dias} {state.racha.dias === 1 ? 'Día' : 'Días'}
            </div>
          </div>
        </div>

        {/* XP */}
        <div className="surface-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FF051E15] flex items-center justify-center text-[#FF051E]">
            <Zap className="w-7 h-7 fill-[#FF051E]" />
          </div>
          <div>
            <div className="text-xs text-[#584141] font-medium">Experiencia Total</div>
            <div className="text-2xl font-black text-[#8A1428]">{state.xp} XP</div>
          </div>
        </div>

        {/* Medallas */}
        <div className="surface-card p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#2ECC7118] flex items-center justify-center text-[#2ECC71]">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs text-[#584141] font-medium">Temas Completados</div>
            <div className="text-2xl font-black text-[#8A1428]">
              {completedTopicsCount} / 8
            </div>
          </div>
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="surface-card p-6 space-y-4">
        <h3 className="text-lg font-bold text-[#8A1428] flex items-center gap-2">
          <Award className="w-5 h-5 text-[#FF836C]" />
          Medallero de Maestría por Tema
        </h3>
        <p className="text-xs text-[#584141]">
          Se desbloquea al aprobar las 4 etapas activas (Reconocer, Parametrizar, Calcular y Contrastar).
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TOPICS_DATA.map((t) => {
            const isDone = state.temas[t.id]?.completado;
            return (
              <div
                key={t.id}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isDone
                    ? 'bg-[#FFFFFF] border-[#2ECC71] shadow-xs'
                    : 'bg-[#FBF5EC80] border-[#8A142815] opacity-50'
                }`}
              >
                <div
                  className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    isDone ? 'bg-[#2ECC71] text-white shadow-xs' : 'bg-[#8A142815] text-[#8A142866]'
                  }`}
                >
                  <Award className="w-5 h-5" />
                </div>
                <div className="font-bold text-xs text-[#8A1428] line-clamp-1">{t.nombre}</div>
                <div className="text-[10px] mt-0.5 font-semibold">
                  {isDone ? (
                    <span className="text-[#2ECC71]">Dominado ✓</span>
                  ) : (
                    <span className="text-[#584141]">En progreso</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Repaso del Día / Banco de Errores */}
      <div className="surface-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#8A14281A] pb-3">
          <div>
            <h3 className="text-lg font-bold text-[#8A1428] flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[#AC0B32]" />
              Repaso del Día ({state.errores.length} ejercicios a reforzar)
            </h3>
            <p className="text-xs text-[#584141]">
              El sistema registra automáticamente los problemas fallados para volver a practicarlos.
            </p>
          </div>
        </div>

        {state.errores.length === 0 ? (
          <div className="p-8 text-center space-y-2 bg-[#FBF5EC] rounded-xl border border-[#8A142815]">
            <CheckCircle2 className="w-10 h-10 text-[#2ECC71] mx-auto" />
            <div className="font-bold text-[#8A1428] text-base">¡Bandeja de errores limpia!</div>
            <p className="text-xs text-[#584141]">
              No tienes preguntas pendientes por repasar. ¡Excelente dominio conceptual!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.errores.map((err, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#FBF5EC] rounded-xl border border-[#8A142820] flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-[#FF051E] bg-[#FF051E15] px-2 py-0.5 rounded-full">
                      {err.confusion}
                    </span>
                    <span className="text-xs text-[#584141] font-medium">{err.fecha}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-[#1d1b16] font-medium line-clamp-2">
                    {err.enunciado}
                  </div>
                </div>
                <button
                  onClick={() => onStartReviewExercise(err)}
                  className="tactile-btn-primary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm whitespace-nowrap flex-shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Repasar</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Backup and Restore */}
      <div className="surface-card p-6 space-y-4">
        <h3 className="text-base font-bold text-[#8A1428]">
          Gestión de Almacenamiento y Copia de Seguridad
        </h3>
        <p className="text-xs text-[#584141]">
          Exporta tu progreso en formato JSON para transferirlo a tu móvil o computadora, o restáuralo en cualquier momento.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onExport}
            className="tactile-btn-secondary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#8A1428]" />
            <span>Descargar Progreso (JSON)</span>
          </button>

          {onOpenScormModal && (
            <button
              onClick={onOpenScormModal}
              className="tactile-btn-secondary px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 border-[#AC0B32] text-[#8A1428]"
            >
              <GraduationCap className="w-4 h-4 text-[#FF051E]" />
              <span>Paquete SCORM 1.2 (Moodle)</span>
            </button>
          )}

          <button
            onClick={() => setShowImportBox(!showImportBox)}
            className="tactile-btn-secondary px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2"
          >
            <Upload className="w-4 h-4 text-[#8A1428]" />
            <span>Importar Archivo JSON</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('¿Seguro que deseas reiniciar todo el progreso a cero?')) {
                onReset();
              }
            }}
            className="px-4 py-2 text-xs font-semibold text-[#BA1A1A] hover:bg-[#BA1A1A10] rounded-lg transition-colors flex items-center gap-1.5 ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reiniciar todo</span>
          </button>
        </div>

        {showImportBox && (
          <div className="p-4 bg-[#FBF5EC] rounded-xl border border-[#8A142820] space-y-3">
            <span className="text-xs font-semibold text-[#8A1428] block">
              Pega aquí el contenido JSON de tu copia de seguridad:
            </span>
            <textarea
              rows={4}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{"version": 1, "xp": 100, ...}'
              className="w-full p-2 bg-white border border-[#8A142833] rounded font-mono text-xs text-[#8A1428] outline-none"
            />
            {importStatus && (
              <div className="text-xs font-bold text-[#AC0B32]">{importStatus}</div>
            )}
            <button
              onClick={handleImportSubmit}
              className="tactile-btn-primary px-4 py-2 rounded-lg text-xs font-bold"
            >
              Confirmar Importación
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
