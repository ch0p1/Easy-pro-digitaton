import { describe, expect, it } from 'vitest';
import { TOPICS_DATA } from './topics';
import { TOPIC_ORDER, STAGE_ORDER } from '../scorm/progress';

describe('integridad del banco de ejercicios', () => {
  it('los ids de tema coinciden con los del estado y de SCORM', () => {
    expect(TOPICS_DATA.map((t) => t.id)).toEqual(TOPIC_ORDER);
  });

  const all = TOPICS_DATA.flatMap((t) => t.etapas.flatMap((e) => e.ejercicios.map((x) => ({ t, e, x }))));

  it('los ids de ejercicio son únicos', () => {
    const ids = all.map((a) => a.x.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada ejercicio pertenece a su tema y etapa', () => {
    for (const { t, e, x } of all) {
      expect(x.tema, x.id).toBe(t.id);
      expect(x.etapa, x.id).toBe(e.id);
      expect(STAGE_ORDER).toContain(e.id);
    }
  });

  it('opción múltiple y detecta-error: índice correcto válido y al menos 3 opciones', () => {
    for (const { x } of all.filter((a) => a.x.tipo === 'opcion-multiple' || a.x.tipo === 'detecta-error')) {
      expect(x.opciones!.length, x.id).toBeGreaterThanOrEqual(3);
      expect(Number.isInteger(x.correcta), x.id).toBe(true);
      expect(x.correcta!, x.id).toBeGreaterThanOrEqual(0);
      expect(x.correcta!, x.id).toBeLessThan(x.opciones!.length);
      // error_comun describe errores: nunca debe tener texto para la opción correcta
      // (se tolera una cadena vacía como marcador).
      for (const [k, msg] of Object.entries(x.error_comun ?? {})) {
        if (Number(k) === x.correcta) expect(msg, x.id).toBe('');
      }
    }
  });

  it('numéricos: valor esperado finito y tolerancia positiva', () => {
    for (const { x } of all.filter((a) => a.x.tipo === 'numerico')) {
      expect(Number.isFinite(x.valorEsperado), x.id).toBe(true);
      expect(x.tolerancia ?? 0.0005, x.id).toBeGreaterThan(0);
    }
  });
});
