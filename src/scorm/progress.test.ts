import { describe, expect, it } from 'vitest';
import type { AppState } from '../types';
import {
  SCORED_STAGES,
  STAGE_ORDER,
  TOPIC_ORDER,
  completionPercentage,
  decodeSuspendData,
  encodeSuspendData,
} from './progress';

function stateWith(approved: (topic: string, stage: string) => boolean): Pick<AppState, 'temas'> {
  const temas: any = {};
  for (const t of TOPIC_ORDER) {
    temas[t] = { completado: false, etapas: {} };
    for (const s of STAGE_ORDER) {
      temas[t].etapas[s] = { aprobada: approved(t, s), intentos: 3, aciertos: 2 };
    }
  }
  return { temas };
}

describe('progreso SCORM', () => {
  it('un estado nuevo da nota 0 (antes enviaba 100 siempre)', () => {
    expect(completionPercentage(stateWith(() => false))).toBe(0);
  });

  it('todas las etapas calificables aprobadas dan 100', () => {
    expect(completionPercentage(stateWith((_t, s) => SCORED_STAGES.includes(s as any)))).toBe(100);
  });

  it('la etapa de lectura (pistas) no cuenta', () => {
    expect(completionPercentage(stateWith((_t, s) => s === 'pistas'))).toBe(0);
  });

  it('el avance parcial es proporcional', () => {
    // 1 de 8 temas completo => 12.5% => 13
    expect(completionPercentage(stateWith((t, s) => t === 'binomial' && SCORED_STAGES.includes(s as any)))).toBe(13);
  });

  it('suspend_data es compacto (muy por debajo de 4096 caracteres) y se recupera igual', () => {
    const st = stateWith((t, s) => t !== 'normal' && s !== 'contrastar');
    const encoded = encodeSuspendData(st);
    expect(encoded.length).toBeLessThan(100);
    const decoded = decodeSuspendData(encoded)!;
    for (const t of TOPIC_ORDER) {
      for (const s of STAGE_ORDER) {
        expect(decoded[t]!.etapas[s].aprobada).toBe(st.temas[t].etapas[s].aprobada);
      }
    }
  });

  it('rechaza formatos desconocidos', () => {
    expect(decodeSuspendData('')).toBeNull();
    expect(decodeSuspendData('{"temas":{}}')).toBeNull();
    expect(decodeSuspendData('v2|01111')).toBeNull();
  });
});
