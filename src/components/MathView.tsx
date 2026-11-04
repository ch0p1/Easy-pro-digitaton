import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  inline?: boolean;
  className?: string;
}

export const MathView: React.FC<MathViewProps> = ({ math, inline = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(math, {
        displayMode: !inline,
        throwOnError: false,
        strict: false,
      });
    } catch (err) {
      console.warn('KaTeX render error:', err);
      return math;
    }
  }, [math, inline]);

  if (inline) {
    return (
      <span
        className={`inline-block font-serif text-[#8A1428] px-1 py-0.5 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div
      className={`overflow-x-auto py-2 text-[#8A1428] font-serif ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
