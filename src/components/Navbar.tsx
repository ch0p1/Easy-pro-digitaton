import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export type MainViewTab = 'home' | 'playground' | 'calculator' | 'library' | 'formulas';

interface NavbarProps {
  currentTab: MainViewTab;
  onTabChange: (tab: MainViewTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu on Escape key press (WCAG 2.2)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navItems: { id: MainViewTab; label: string }[] = [
    { id: 'home', label: 'Inicio' },
    { id: 'playground', label: 'Ruta de Práctica' },
    { id: 'calculator', label: 'Calculadora' },
    { id: 'library', label: 'Biblioteca' },
    { id: 'formulas', label: 'Fórmulas' },
  ];

  const handleSelectTab = (tab: MainViewTab) => {
    onTabChange(tab);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF5ECF0] backdrop-blur-md border-b border-transparent transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Mobile Hamburger Button (visible on mobile only: md:hidden) */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation-menu"
            aria-label={isMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            className="p-2.5 rounded-lg text-[#8A1428] hover:bg-[#8A142812] active:bg-[#8A142820] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border border-[#8A142825] bg-[#FFFFFF]"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-[#8A1428]" />
            ) : (
              <Menu className="w-6 h-6 text-[#8A1428]" />
            )}
          </button>

          {/* Active section label indicator on mobile header */}
          <span className="font-bold text-[#8A1428] text-lg tracking-tight truncate">
            {navItems.find((item) => item.id === currentTab)?.label}
          </span>
        </div>

        {/* Desktop Typographic Navigation Tabs (hidden on mobile: hidden md:flex) */}
        <nav
          aria-label="Navegación principal de escritorio"
          className="hidden md:flex items-center gap-1.5 lg:gap-2 overflow-x-auto py-1 no-scrollbar"
        >
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`relative px-4 py-2 text-base tracking-tight transition-all whitespace-nowrap rounded-md ${
                  isActive
                    ? 'text-[#8A1428] font-bold bg-[#8A14280A]'
                    : 'text-[#584141] font-medium hover:text-[#8A1428] hover:bg-[#8A142805]'
                }`}
              >
                <span>{item.label}</span>

                {/* Editorial underline accent for active tab */}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#8A1428] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Clean right brand tag */}
        <div className="hidden sm:flex items-center text-xs font-semibold text-[#8A1428] bg-[#8A14280C] px-3 py-1 rounded-md border border-[#8A142815]">
          <span>Devore 9.ª Ed.</span>
        </div>
      </div>

      {/* Spacious Mobile Dropdown Navigation Menu */}
      {isMenuOpen && (
        <>
          {/* Full-screen backdrop */}
          <div
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
            className="md:hidden fixed inset-0 top-16 bg-[#1D1B1680] backdrop-blur-xs z-40 transition-opacity"
          />

          {/* Clean, spacious navigation panel */}
          <nav
            id="mobile-navigation-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación móvil"
            className="md:hidden fixed top-16 left-0 right-0 z-50 bg-[#FFFFFF] border-b-2 border-[#8A142825] shadow-2xl max-h-[calc(100vh-4.5rem)] overflow-y-auto no-scrollbar animate-in slide-in-from-top-2 duration-150"
          >
            <div className="flex flex-col py-2 px-3 divide-y divide-[#8A142810]">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full text-left py-4.5 px-5 rounded-xl text-xl font-bold transition-all flex items-center justify-between min-h-[58px] ${
                      isActive
                        ? 'text-[#8A1428] bg-[#8A14280E] font-extrabold'
                        : 'text-[#1D1B16] hover:text-[#8A1428] hover:bg-[#FBF5EC]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8A1428]" />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </>
      )}
    </header>
  );
};
