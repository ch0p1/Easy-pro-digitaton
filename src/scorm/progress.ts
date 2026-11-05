import type { AppState, StageId, TopicId } from '../types';

/** Orden fijo de temas y etapas: la codificación depende de él. */
export const TOPIC_ORDER: TopicId[] = [
  'binomial',
  'hipergeometrica',
  'geometrica-nb',
  'poisson',
  'exponencial',
  'gamma',
  'normal',
  'integrador',
];

export const STAGE_ORDER: StageId[] = ['pistas', 'reconocer', 'parametros', 'calcular', 'contrastar'];

/** 'pistas' es solo lectura y nunca se aprueba: no cuenta para la nota. */
export const SCORED_STAGES: StageId[] = ['reconocer', 'parametros', 'calcular', 'contrastar'];

const SUSPEND_PREFIX = 'v2|';

/** Porcentaje real de avance (0-100): etapas calificables aprobadas / total. */
export function completionPercentage(state: Pick<AppState, 'temas'>): number {
  const total = TOPIC_ORDER.length * SCORED_STAGES.length;
  let approved = 0;
  for (const topic of TOPIC_ORDER) {
    for (const stage of SCORED_STAGES) {
      if (state.temas?.[topic]?.etapas?.[stage]?.aprobada) approved++;
    }
  }
  return Math.round((approved / total) * 100);
}

/**
 * Codificación compacta para cmi.suspend_data (SCORM 1.2 admite 4096 caracteres).
 * Una cadena de 5 caracteres ('0'/'1') por tema, separadas por comas: ~50 caracteres.
 * Los errores y los contadores de intentos viven solo en localStorage.
 */
export function encodeSuspendData(state: Pick<AppState, 'temas'>): string {
  const parts = TOPIC_ORDER.map((topic) =>
    STAGE_ORDER.map((stage) => (state.temas?.[topic]?.etapas?.[stage]?.aprobada ? '1' : '0')).join('')
  );
  return SUSPEND_PREFIX + parts.join(',');
}

/** Inversa de encodeSuspendData. Devuelve null si el texto no tiene el formato v2. */
export function decodeSuspendData(raw: string): Partial<AppState['temas']> | null {
  if (!raw || !raw.startsWith(SUSPEND_PREFIX)) return null;
  const parts = raw.slice(SUSPEND_PREFIX.length).split(',');
  if (parts.length !== TOPIC_ORDER.length) return null;
  const temas: Partial<AppState['temas']> = {};
  for (let i = 0; i < TOPIC_ORDER.length; i++) {
    const bits = parts[i];
    if (!/^[01]{5}$/.test(bits)) return null;
    const etapas = {} as AppState['temas'][TopicId]['etapas'];
    STAGE_ORDER.forEach((stage, j) => {
      etapas[stage] = { aprobada: bits[j] === '1', intentos: 0, aciertos: 0 };
    });
    temas[TOPIC_ORDER[i]] = {
      completado: SCORED_STAGES.every((s) => etapas[s].aprobada),
      etapas,
    };
  }
  return temas;
}
