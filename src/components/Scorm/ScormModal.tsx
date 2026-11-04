import React, { useState, useEffect } from 'react';
import { scorm12, ScormLmsInfo } from '../../scorm/scorm12';
import { generateImsManifestXml, createScormZipBlob } from '../../scorm/scormGenerator';
import {
  Download,
  CheckCircle2,
  AlertCircle,
  FileCode,
  GraduationCap,
  Sparkles,
  Server,
  Play,
  RotateCcw,
  X,
  BookOpen,
} from 'lucide-react';

interface ScormModalProps {
  onClose: () => void;
  completionPercentage?: number;
}

export const ScormModal: React.FC<ScormModalProps> = ({ onClose, completionPercentage = 100 }) => {
  const [lmsInfo, setLmsInfo] = useState<ScormLmsInfo>(scorm12.getLmsInfo());
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [showManifestCode, setShowManifestCode] = useState<boolean>(false);

  useEffect(() => {
    // Sincronizar info periódicamente
    const interval = setInterval(() => {
      setLmsInfo(scorm12.getLmsInfo());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const blob = await createScormZipBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `easy_pro_scorm_12_${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error generando zip SCORM:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSimulateLms = () => {
    scorm12.enableSimulator();
    scorm12.syncProgress(completionPercentage, JSON.stringify({ simulated: true }));
    setLmsInfo(scorm12.getLmsInfo());
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

  const manifestXml = generateImsManifestXml();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scorm-modal-title"
      className="fixed inset-0 z-50 bg-[#1d1b1680] backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="surface-card-elevated max-w-3xl w-full p-6 sm:p-8 relative max-h-[92vh] overflow-y-auto space-y-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Cerrar panel de integración SCORM"
          className="absolute top-5 right-5 p-2 rounded-full text-[#8A1428] hover:bg-[#8A142815] transition-colors focus-visible:ring-2 focus-visible:ring-[#8A1428]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pr-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#AC0B32]">
            <GraduationCap className="w-4 h-4 text-[#C00418]" />
            Compatibilidad e Integración LMS
          </div>
          <h2 id="scorm-modal-title" className="text-2xl font-extrabold text-[#8A1428]">
            Easy Pro en Formato SCORM 1.2
          </h2>
          <p className="text-xs sm:text-sm text-[#584141] leading-relaxed">
            <strong>Sí, totalmente compatible.</strong> Easy Pro cumple con las especificaciones de empaquetado ADL SCORM 1.2 para integrarse de forma nativa en <strong>Moodle, Canvas, Blackboard, Chamilo y Brightspace</strong>.
          </p>
        </div>

        {/* Connection Status Banner */}
        <div className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border-[#8A142820] shadow-xs">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                lmsInfo.isConnected
                  ? 'bg-[#2ECC7120] text-[#2ECC71]'
                  : 'bg-[#8A142810] text-[#8A1428]'
              }`}
            >
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-[#584141] font-medium">Estado de Conexión SCORM 1.2:</div>
              <div className="text-sm font-bold text-[#8A1428] flex items-center gap-1.5">
                {lmsInfo.isConnected ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2ECC71] inline-block animate-pulse" />
                    <span>Conectado al LMS ({lmsInfo.isSimulated ? 'Simulador activo' : 'Moodle/Canvas'})</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span>Ejecutándose en Modo Web Autónomo (Fuera de LMS)</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {!lmsInfo.isConnected && (
            <button
              onClick={handleSimulateLms}
              className="tactile-btn-secondary px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5 fill-[#8A1428]" />
              <span>Probar Simulador LMS</span>
            </button>
          )}
        </div>

        {/* Live SCORM Variables Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#8A1428] uppercase tracking-wider flex items-center gap-2">
            <span>Variables CMI Sincronizadas en Tiempo Real:</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#FBF5EC] rounded-lg border border-[#8A142815] space-y-1">
              <span className="font-mono text-[#8A1428] font-bold block">cmi.core.lesson_status</span>
              <div className="text-sm font-bold text-[#AC0B32] capitalize">
                {lmsInfo.lessonStatus || (completionPercentage >= 80 ? 'passed' : 'incomplete')}
              </div>
              <div className="text-[11px] text-[#584141]">
                Umbral de aprobación: <strong>≥ 80%</strong> en el temario Devore.
              </div>
            </div>

            <div className="p-3 bg-[#FBF5EC] rounded-lg border border-[#8A142815] space-y-1">
              <span className="font-mono text-[#8A1428] font-bold block">cmi.core.score.raw (0 - 100)</span>
              <div className="text-sm font-bold text-[#AC0B32]">
                {Math.round(completionPercentage)} / 100 puntos
              </div>
              <div className="text-[11px] text-[#584141]">
                Se reporta directamente al libro de calificaciones de Moodle.
              </div>
            </div>

            <div className="p-3 bg-[#FBF5EC] rounded-lg border border-[#8A142815] space-y-1">
              <span className="font-mono text-[#8A1428] font-bold block">cmi.suspend_data</span>
              <div className="text-xs font-semibold text-[#2ECC71]">
                Sincronización activa ✓
              </div>
              <div className="text-[11px] text-[#584141]">
                Guarda los temas y etapas aprobadas para retomar la sesión sin perder progreso.
              </div>
            </div>

            <div className="p-3 bg-[#FBF5EC] rounded-lg border border-[#8A142815] space-y-1">
              <span className="font-mono text-[#8A1428] font-bold block">cmi.core.student_name</span>
              <div className="text-xs font-semibold text-[#8A1428]">
                {lmsInfo.studentName}
              </div>
              <div className="text-[11px] text-[#584141]">
                ID: {lmsInfo.studentId}
              </div>
            </div>
          </div>
        </div>

        {/* Export & Download Section */}
        <div className="p-5 bg-white border border-[#8A142825] rounded-xl space-y-4">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-[#8A1428] flex items-center gap-2">
              <Download className="w-5 h-5 text-[#FF051E]" />
              Descargar Paquete SCORM 1.2 (.zip)
            </h4>
            <p className="text-xs text-[#584141] leading-relaxed">
              Genera el archivo comprimido estandarizado que contiene el manifiesto <code>imsmanifest.xml</code>, los metadatos LOM y el launcher de comunicación con el LMS para subirlo directamente a la plataforma virtual de tu universidad.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="tactile-btn-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Empaquetando SCORM...' : 'Descargar easy_pro_scorm_12.zip'}</span>
            </button>

            <button
              onClick={() => setShowManifestCode(!showManifestCode)}
              className="tactile-btn-secondary px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-1.5"
            >
              <FileCode className="w-4 h-4 text-[#AC0B32]" />
              <span>{showManifestCode ? 'Ocultar XML' : 'Ver imsmanifest.xml'}</span>
            </button>
          </div>

          {showManifestCode && (
            <div className="space-y-2 pt-2 animate-in fade-in duration-150">
              <div className="text-xs text-[#584141] font-semibold">
                Contenido generado de <code>imsmanifest.xml</code>:
              </div>
              <pre className="p-4 bg-[#1d1b16] text-[#FBF5EC] rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-[#8A142830]">
                <code>{manifestXml}</code>
              </pre>
            </div>
          )}
        </div>

        {/* LMS Instructions Checklist */}
        <div className="p-4 bg-[#FBF5EC] rounded-xl border border-[#8A142820] space-y-2 text-xs">
          <span className="font-bold text-[#8A1428] block">
            Pasos para instalarlo en Moodle en 3 minutos:
          </span>
          <ol className="list-decimal list-inside space-y-1 text-[#584141]">
            <li>Descarga el archivo <code>easy_pro_scorm_12.zip</code> con el botón de arriba.</li>
            <li>En tu aula de Moodle, activa edición y selecciona <strong>«Añadir una actividad o recurso» → «Paquete SCORM»</strong>.</li>
            <li>Arrastra el archivo <code>.zip</code> al campo de paquete.</li>
            <li>En «Calificación», selecciona <em>Calificación más alta</em> (escala 100).</li>
            <li>En «Gestión de intentos», deja <em>Intentos ilimitados</em> y guarda los cambios.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
