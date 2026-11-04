import React from 'react';
import { Flame, Zap, GraduationCap } from 'lucide-react';

export type MainViewTab = 'home' | 'playground' | 'calculator' | 'library' | 'formulas' | 'progress';

interface NavbarProps {
  currentTab: MainViewTab;
  onTabChange: (tab: MainViewTab) => void;
  xp: number;
  rachaDias: number;
  onOpenScormModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  xp,
  rachaDias,
  onOpenScormModal,
}) => {
  const navItems: { id: MainViewTab; label: string; mobileLabel: string }[] = [
    { id: 'home', label: 'Inicio', mobileLabel: 'Inicio' },
    { id: 'playground', label: 'Ruta de Práctica', mobileLabel: 'Ruta' },
    { id: 'calculator', label: 'Calculadora', mobileLabel: 'Calculadora' },
    { id: 'library', label: 'Biblioteca', mobileLabel: 'Biblioteca' },
    { id: 'formulas', label: 'Fórmulas', mobileLabel: 'Fórmulas' },
    { id: 'progress', label: 'Progreso', mobileLabel: 'Progreso' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFFEE] backdrop-blur-md border-b border-[#8A142818] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4">
        {/* Typographic Navigation Tabs */}
        <nav
          aria-label="Navegación principal"
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 no-scrollbar -mx-2 px-2"
        >
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative px-3.5 sm:px-4 py-2 text-sm sm:text-base tracking-tight transition-all whitespace-nowrap rounded-md ${
                  isActive
                    ? 'text-[#8A1428] font-bold bg-[#8A14280A]'
                    : 'text-[#584141] font-medium hover:text-[#8A1428] hover:bg-[#8A142805]'
                }`}
              >
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.mobileLabel}</span>

                {/* Editorial underline accent for active tab */}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#8A1428] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Indicators: Academic Metrics and SCORM Integration */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Daily Streak */}
          <div
            title={`Racha de estudio: ${rachaDias} días activos`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FBF5EC] border border-[#8A14281A] text-sm font-semibold text-[#8A1428] select-none"
          >
            <Flame className="w-4 h-4 fill-[#FF836C] text-[#FF836C]" />
            <span className="font-mono tabular-nums">{rachaDias}d</span>
          </div>

          {/* XP Metric */}
          <div
            title={`Puntos acumulados: ${xp} XP`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#FFFFFF] border border-[#8A14281A] text-sm font-semibold text-[#8A1428] select-none"
          >
            <Zap className="w-4 h-4 fill-[#FF051E] text-[#FF051E]" />
            <span className="font-mono tabular-nums">{xp}</span>
            <span className="text-xs text-[#584141] font-normal uppercase">XP</span>
          </div>

          {/* SCORM 1.2 Action */}
          {onOpenScormModal && (
            <button
              onClick={onOpenScormModal}
              title="Integración y exportación de paquete SCORM 1.2 para LMS (Moodle / Canvas)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#8A142828] text-[#8A1428] hover:bg-[#8A14280A] hover:border-[#8A142850] text-sm font-semibold transition-all shadow-2xs"
            >
              <GraduationCap className="w-4 h-4 text-[#AC0B32]" />
              <span className="font-mono tracking-tight text-xs sm:text-sm">SCORM 1.2</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
