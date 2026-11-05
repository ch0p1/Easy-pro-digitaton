import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'easy_pro_theme_mode';

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch {
      // Fallback si localStorage no está disponible
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;
    const hasMatchMedia = typeof window !== 'undefined' && typeof window.matchMedia === 'function';
    const mediaQuery = hasMatchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

    const applyTheme = () => {
      let isDark = false;
      if (mode === 'dark') {
        isDark = true;
      } else if (mode === 'light') {
        isDark = false;
      } else {
        // modo 'system': reconoce la preferencia del sistema operativo si matchMedia existe
        isDark = mediaQuery ? mediaQuery.matches : false;
      }

      setResolvedTheme(isDark ? 'dark' : 'light');

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      // Actualizar la meta etiqueta theme-color para navegadores móviles
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', isDark ? '#121110' : '#8A1428');
      }
    };

    applyTheme();

    const handleSystemChange = () => {
      if (mode === 'system') {
        applyTheme();
      }
    };

    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    }
  }, [mode]);

  const selectMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
    try {
      localStorage.setItem(STORAGE_KEY, newMode);
    } catch {
      // Manejar posibles excepciones de cuota o modo incógnito
    }
  }, []);

  return {
    mode,
    resolvedTheme,
    setMode: selectMode,
  };
}
