import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { ThemeMode } from '../hooks/useTheme';

interface ThemeToggleProps {
  mode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  variant?: 'header' | 'mobile-row' | 'mobile-header-button';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  mode,
  resolvedTheme,
  setMode,
  variant = 'header',
}) => {
  // Mobile header single button (cycles between modes: claro -> oscuro -> sistema)
  if (variant === 'mobile-header-button') {
    const handleCycle = () => {
      if (mode === 'light') setMode('dark');
      else if (mode === 'dark') setMode('system');
      else setMode('light');
    };

    const currentLabel =
      mode === 'light'
        ? 'Tema actual: Claro (clic para cambiar a Oscuro)'
        : mode === 'dark'
        ? 'Tema actual: Oscuro (clic para cambiar a Sistema)'
        : `Tema actual: Sistema (${resolvedTheme === 'dark' ? 'Oscuro' : 'Claro'})`;

    return (
      <button
        type="button"
        onClick={handleCycle}
        aria-label={currentLabel}
        title={currentLabel}
        className="p-2.5 rounded-lg text-[#8A1428] hover:bg-[#8A142812] active:bg-[#8A142820] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border border-[#8A142825] bg-white/80"
      >
        {mode === 'light' && <Sun className="w-5 h-5 text-[#BA0F23]" />}
        {mode === 'dark' && <Moon className="w-5 h-5 text-[#FF8596]" />}
        {mode === 'system' && <Monitor className="w-5 h-5 text-[#8A1428]" />}
      </button>
    );
  }

  // Mobile menu full-width row
  if (variant === 'mobile-row') {
    return (
      <div className="py-4 px-2 space-y-2.5">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#584141]">
          <span>Tema de la interfaz</span>
          <span className="font-mono text-[11px] text-[#8A1428]">
            {mode === 'system' ? `Auto (${resolvedTheme})` : mode}
          </span>
        </div>

        <div
          role="radiogroup"
          aria-label="Seleccionar tema visual"
          className="grid grid-cols-3 gap-2"
        >
          <button
            type="button"
            role="radio"
            aria-checked={mode === 'light'}
            onClick={() => setMode('light')}
            className={`flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-sm font-semibold transition-all min-h-[48px] border ${
              mode === 'light'
                ? 'bg-[#8A1428] text-white border-[#8A1428] shadow-sm'
                : 'bg-white/80 text-[#1D1B16] border-[#8A142820] hover:bg-[#8A14280A]'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Claro</span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={mode === 'dark'}
            onClick={() => setMode('dark')}
            className={`flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-sm font-semibold transition-all min-h-[48px] border ${
              mode === 'dark'
                ? 'bg-[#8A1428] text-white border-[#8A1428] shadow-sm'
                : 'bg-white/80 text-[#1D1B16] border-[#8A142820] hover:bg-[#8A14280A]'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Oscuro</span>
          </button>

          <button
            type="button"
            role="radio"
            aria-checked={mode === 'system'}
            onClick={() => setMode('system')}
            className={`flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl text-sm font-semibold transition-all min-h-[48px] border ${
              mode === 'system'
                ? 'bg-[#8A1428] text-white border-[#8A1428] shadow-sm'
                : 'bg-white/80 text-[#1D1B16] border-[#8A142820] hover:bg-[#8A14280A]'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>Sistema</span>
          </button>
        </div>
      </div>
    );
  }

  // Desktop header compact segmented control
  return (
    <div
      role="radiogroup"
      aria-label="Seleccionar tema visual"
      className="inline-flex items-center p-0.5 rounded-lg border border-[#8A142820] bg-white/70 backdrop-blur-xs text-xs font-medium"
    >
      <button
        type="button"
        role="radio"
        aria-checked={mode === 'light'}
        aria-label="Tema Claro"
        title="Tema Claro"
        onClick={() => setMode('light')}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all ${
          mode === 'light'
            ? 'bg-[#8A1428] text-white font-semibold shadow-xs'
            : 'text-[#584141] hover:text-[#8A1428] hover:bg-[#8A14280C]'
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
        <span className="hidden lg:inline">Claro</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={mode === 'dark'}
        aria-label="Tema Oscuro"
        title="Tema Oscuro"
        onClick={() => setMode('dark')}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all ${
          mode === 'dark'
            ? 'bg-[#8A1428] text-white font-semibold shadow-xs'
            : 'text-[#584141] hover:text-[#8A1428] hover:bg-[#8A14280C]'
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
        <span className="hidden lg:inline">Oscuro</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={mode === 'system'}
        aria-label={`Tema del Sistema (${resolvedTheme === 'dark' ? 'Oscuro' : 'Claro'})`}
        title={`Tema del Sistema: Detecta automáticamente la preferencia de tu sistema operativo (Activo: ${
          resolvedTheme === 'dark' ? 'Oscuro' : 'Claro'
        })`}
        onClick={() => setMode('system')}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all ${
          mode === 'system'
            ? 'bg-[#8A1428] text-white font-semibold shadow-xs'
            : 'text-[#584141] hover:text-[#8A1428] hover:bg-[#8A14280C]'
        }`}
      >
        <Monitor className="w-3.5 h-3.5" />
        <span className="hidden lg:inline">Sistema</span>
      </button>
    </div>
  );
};
