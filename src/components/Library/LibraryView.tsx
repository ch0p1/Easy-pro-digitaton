import React, { useState, useEffect } from 'react';
import { LIBRARY_DATA } from '../../data/library';
import { TopicId } from '../../types';
import {
  Video,
  Code,
  Compass,
  BookOpen,
  WifiOff,
  Wifi,
  ExternalLink,
  Play,
  Copy,
  Check,
} from 'lucide-react';
import { MathView } from '../MathView';

interface LibraryViewProps {
  initialTopic?: TopicId;
}

type LibraryTab = 'reconocimiento' | 'teoria' | 'python' | 'r' | 'geogebra_calc';

export const LibraryView: React.FC<LibraryViewProps> = ({ initialTopic = 'binomial' }) => {
  const [selectedTopic, setSelectedTopic] = useState<TopicId>(
    initialTopic === 'integrador' ? 'binomial' : initialTopic
  );
  const [activeTab, setActiveTab] = useState<LibraryTab>('reconocimiento');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [loadVideo, setLoadVideo] = useState<boolean>(false);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Reset video lazy state when topic or tab changes
  useEffect(() => {
    setLoadVideo(false);
  }, [selectedTopic, activeTab]);

  const currentResource = LIBRARY_DATA[selectedTopic];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Offline Alert Banner if offline */}
      {!isOnline && (
        <div className="p-3.5 bg-[#FFF3CD] border border-[#FFEEBA] text-[#856404] rounded-xl flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-[#856404]" />
            <span>
              <strong>Modo sin conexión activo:</strong> Los resúmenes teóricos, fórmulas y códigos están disponibles sin internet. Los videos externos están pausados.
            </span>
          </div>
          <span className="font-mono text-xs">PWA Offline</span>
        </div>
      )}

      {/* Header */}
      <div className="surface-card p-6 border-l-4 border-l-[#8A1428] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#AC0B32]">
            <BookOpen className="w-4 h-4 text-[#FF051E]" />
            Biblioteca Multimedia del Curso
          </div>
          <h2 className="text-2xl font-bold text-[#8A1428] mt-1">
            Biblioteca Técnica y Pedagógica
          </h2>
          <p className="text-sm text-[#584141] mt-1">
            Cómo reconocer cada modelo, supuestos teóricos, código en Python/R y guías para GeoGebra y Calculadora física.
          </p>
        </div>
      </div>

      {/* Topic Horizontal Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#8A14281A]">
        {[
          { id: 'binomial', label: '1. Binomial' },
          { id: 'hipergeometrica', label: '2. Hipergeométrica' },
          { id: 'geometrica-nb', label: '3. Geométrica & NB' },
          { id: 'poisson', label: '4. Poisson' },
          { id: 'exponencial', label: '5. Exponencial' },
          { id: 'gamma', label: '6. Gamma' },
          { id: 'normal', label: '7. Normal' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedTopic(t.id as TopicId)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              selectedTopic === t.id
                ? 'bg-[#8A1428] text-white shadow-sm font-semibold'
                : 'bg-white text-[#8A1428] hover:bg-[#8A14280F] border border-[#8A14281A]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Subtabs per Topic */}
      <div className="flex items-center gap-2 flex-wrap text-xs sm:text-sm font-semibold border-b border-[#8A14281A] pb-3">
        {[
          { id: 'reconocimiento', label: '🎯 Cómo Reconocerlo', icon: Compass },
          { id: 'teoria', label: '📖 Teoría y Supuestos', icon: BookOpen },
          { id: 'python', label: '🐍 Python (SciPy)', icon: Code },
          { id: 'r', label: '📊 Código en R', icon: Code },
          { id: 'geogebra_calc', label: '📐 GeoGebra y Calculadora', icon: Video },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as LibraryTab)}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-[#8A142815] text-[#8A1428] border-b-2 border-[#AC0B32]'
                  : 'text-[#584141] hover:text-[#8A1428] hover:bg-white'
              }`}
            >
              <Icon className="w-4 h-4 text-[#AC0B32]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subtab Content Cards */}
      <div className="surface-card p-6 md:p-8 space-y-6">
        {/* 1. Cómo reconocerlo */}
        {activeTab === 'reconocimiento' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#8A1428]">
                Señales Clave para {currentResource.nombre}
              </h3>
              <p className="text-sm text-[#584141]">
                Identifica estas 4 características en el enunciado antes de formular cualquier cálculo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentResource.comoReconocerlo.claves.map((clave, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#FBF5EC] rounded-xl border border-[#8A142815] flex items-start gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-[#8A1428] text-white flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-[#1d1b16] font-medium leading-relaxed">
                    {clave}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#FF051E0A] border-l-4 border-[#FF051E] rounded-r-xl space-y-1">
              <span className="font-bold text-xs text-[#FF051E] uppercase tracking-wider block">
                Trampa típica de parcial:
              </span>
              <p className="text-sm text-[#8A1428] leading-relaxed">
                {currentResource.comoReconocerlo.trampaTipica}
              </p>
            </div>

            <div className="p-4 bg-white border border-[#8A142820] rounded-xl space-y-1">
              <span className="font-bold text-xs text-[#AC0B32] uppercase tracking-wider block">
                Pregunta de control mental:
              </span>
              <p className="text-sm font-semibold text-[#8A1428]">
                {currentResource.comoReconocerlo.preguntaDeControl}
              </p>
            </div>
          </div>
        )}

        {/* 2. Teoría y Supuestos */}
        {activeTab === 'teoria' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-[#8A1428]">Fundamentación Teórica</h3>
              <p className="text-sm text-[#584141] leading-relaxed">
                {currentResource.teoria.resumen}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#8A1428] uppercase tracking-wider">
                Supuestos matemáticos del modelo:
              </h4>
              <ul className="space-y-2 text-sm text-[#1d1b16]">
                {currentResource.teoria.supuestos.map((sup, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#FF051E] font-bold">•</span>
                    <span>{sup}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#8A1428] uppercase tracking-wider">
                Propiedades y Momentos:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentResource.teoria.propiedades.map((prop, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#FBF5EC] rounded-lg border border-[#8A142815] text-xs font-mono font-semibold text-[#8A1428]"
                  >
                    {prop}
                  </div>
                ))}
              </div>
            </div>

            {/* Video Section with Lazy Loading & Offline Fallback */}
            <div className="pt-4 border-t border-[#8A142815] space-y-3">
              <h4 className="text-sm font-bold text-[#8A1428] flex items-center gap-2">
                <Video className="w-4 h-4 text-[#FF051E]" />
                Cápsula Audiovisual Explicativa
              </h4>

              {isOnline ? (
                !loadVideo ? (
                  <div className="p-8 bg-[#FBF5EC] border border-[#8A142820] rounded-xl flex flex-col items-center justify-center text-center space-y-3">
                    <Play className="w-12 h-12 text-[#FF051E] fill-[#FF051E] opacity-90 cursor-pointer hover:scale-105 transition-transform" />
                    <div>
                      <div className="font-bold text-sm text-[#8A1428]">
                        Video: Fundamentos de {currentResource.nombre}
                      </div>
                      <div className="text-xs text-[#584141]">
                        Haz clic para cargar el reproductor embebido (ahorra datos y memoria).
                      </div>
                    </div>
                    <button
                      onClick={() => setLoadVideo(true)}
                      className="tactile-btn-primary px-4 py-2 rounded-lg text-xs font-semibold shadow-sm"
                    >
                      Cargar Video
                    </button>
                  </div>
                ) : (
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-[#8A142820] bg-black">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube-nocookie.com/embed/${currentResource.teoria.videoId}?autoplay=1`}
                      title={`Video de ${currentResource.nombre}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )
              ) : (
                <div className="p-4 bg-[#FBF5EC] rounded-xl border border-[#8A142820] text-xs text-[#584141] flex items-center gap-2">
                  <WifiOff className="w-4 h-4 text-[#8A1428]" />
                  <span>Sin conexión a internet: El reproductor de video se activará automáticamente al reconectarte.</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Python Code */}
        {activeTab === 'python' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#8A1428]">
                  Implementación en Python (SciPy)
                </h3>
                <p className="text-xs text-[#584141]">
                  Código ejecutable verificado con los datos del curso.
                </p>
              </div>
              <button
                onClick={() => handleCopy(currentResource.pythonCode)}
                className="tactile-btn-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-[#2ECC71]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? '¡Copiado!' : 'Copiar código'}</span>
              </button>
            </div>
            <pre className="p-4 bg-[#1d1b16] text-[#FBF5EC] rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-[#8A142830]">
              <code>{currentResource.pythonCode}</code>
            </pre>
          </div>
        )}

        {/* 4. R Code */}
        {activeTab === 'r' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#8A1428]">
                  Implementación en R (Comandos del Curso)
                </h3>
                <p className="text-xs text-[#584141]">
                  Funciones d... (densidad/masa) y p... (acumulada).
                </p>
              </div>
              <button
                onClick={() => handleCopy(currentResource.rCode)}
                className="tactile-btn-secondary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-[#2ECC71]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? '¡Copiado!' : 'Copiar código'}</span>
              </button>
            </div>
            <pre className="p-4 bg-[#1d1b16] text-[#FBF5EC] rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-[#8A142830]">
              <code>{currentResource.rCode}</code>
            </pre>
          </div>
        )}

        {/* 5. GeoGebra & Calculadora */}
        {activeTab === 'geogebra_calc' && (
          <div className="space-y-6">
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#8A1428]">Guía de GeoGebra</h3>
              <div className="p-4 bg-[#FBF5EC] rounded-xl border border-[#8A142820] text-sm text-[#1d1b16] leading-relaxed">
                {currentResource.geogebraGuia}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-[#8A1428]">
                Instrucciones para Calculadoras Casio / Sharp
              </h3>
              <div className="p-4 bg-white rounded-xl border border-[#8A142820] text-sm text-[#1d1b16] leading-relaxed">
                {currentResource.calculadoraGuia}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
