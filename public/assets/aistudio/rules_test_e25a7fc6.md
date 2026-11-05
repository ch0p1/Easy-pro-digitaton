# rules.test.ts

```typescript
import { describe, expect, it } from 'vitest';
import type { AppState, StageId, TopicId } from '../types';
import { SCORED_STAGES, STAGE_ORDER, TOPIC_ORDER } from '../scorm/progress';
import {
  blockingTopic,
  completedTopicCount,
  firstOpenTopic,
  getStageStatus,
  getTopicStatus,
  isStageUnlocked,
  isTopicUnlocked,
  nextScoredStage,
  nextTopic,
  previousScoredStage,
} from './rules';

type Temas = AppState['temas'];

/** Construye un progreso donde `approved(topic, stage)` decide qué etapas están aprobadas. */
function temasWith(approved: (t: TopicId, s: StageId) => boolean): Temas {
  const temas = {} as Temas;
  for (const t of TOPIC_ORDER) {
    const etapas = {} as Temas[TopicId]['etapas'];
    for (const s of STAGE_ORDER) etapas[s] = { aprobada: approved(t, s), intentos: 0, aciertos: 0 };
    temas[t] = { completado: false, etapas };
  }
  return temas;
}

const fresh = () => temasWith(() => false);
const completeTopics = (n: number) => temasWith((t, s) => TOPIC_ORDER.indexOf(t) < n && SCORED_STAGES.includes(s));

describe('desbloqueo secuencial de temas', () => {
  it('estado nuevo: solo el primer tema está abierto', () => {
    const temas = fresh();
    expect(TOPIC_ORDER.map((t) => isTopicUnlocked(temas, t))).toEqual([true, ...Array(7).fill(false)]);
    expect(getTopicStatus(temas, TOPIC_ORDER[0])).toBe('disponible');
    expect(getTopicStatus(temas, TOPIC_ORDER[1])).toBe('bloqueado');
  });

  it('completar el tema N desbloquea exactamente el tema N+1', () => {
    for (let n = 1; n < TOPIC_ORDER.length; n++) {
      const temas = completeTopics(n);
      const unlocked = TOPIC_ORDER.filter((t) => isTopicUnlocked(temas, t));
      expect(unlocked).toEqual(TOPIC_ORDER.slice(0, n + 1));
    }
  });

  it('un tema a medias (3 de 4 etapas) no desbloquea el siguiente', () => {
    const temas = temasWith((t, s) => t === 'binomial' && ['reconocer', 'parametros', 'calcular'].includes(s));
    expect(getTopicStatus(temas, 'binomial')).toBe('en-curso');
    expect(isTopicUnlocked(temas, 'hipergeometrica')).toBe(false);
    expect(blockingTopic(temas, 'hipergeometrica')).toBe('binomial');
  });

  it('el Integrador exige los 7 temas previos, aunque haya datos de temas posteriores', () => {
    // Todos completos salvo geometrica-nb (p. ej. datos antiguos de cuando todo estaba abierto)
    const temas = temasWith((t, s) => t !== 'geometrica-nb' && SCORED_STAGES.includes(s));
    expect(isTopicUnlocked(temas, 'integrador')).toBe(false);
    expect(blockingTopic(temas, 'integrador')).toBe('geometrica-nb');
    expect(isTopicUnlocked(completeTopics(7), 'integrador')).toBe(true);
  });

  it('contadores y tema donde continuar', () => {
    expect(completedTopicCount(fresh())).toBe(0);
    expect(completedTopicCount(completeTopics(3))).toBe(3);
    expect(firstOpenTopic(fresh())).toBe('binomial');
    expect(firstOpenTopic(completeTopics(3))).toBe(TOPIC_ORDER[3]);
    expect(firstOpenTopic(completeTopics(8))).toBe('integrador');
    expect(nextTopic('binomial')).toBe('hipergeometrica');
    expect(nextTopic('integrador')).toBeNull();
  });
});

describe('desbloqueo secuencial de etapas', () => {
  it('pistas y reconocer están abiertas; el resto se bloquea', () => {
    const temas = fresh();
    expect(getStageStatus(temas, 'binomial', 'pistas')).toBe('disponible');
    expect(getStageStatus(temas, 'binomial', 'reconocer')).toBe('disponible');
    for (const s of ['parametros', 'calcular', 'contrastar'] as StageId[]) {
      expect(getStageStatus(temas, 'binomial', s)).toBe('bloqueada');
    }
  });

  it('aprobar una etapa abre solo la siguiente', () => {
    const temas = temasWith((t, s) => t === 'binomial' && s === 'reconocer');
    expect(getStageStatus(temas, 'binomial', 'reconocer')).toBe('aprobada');
    expect(getStageStatus(temas, 'binomial', 'parametros')).toBe('disponible');
    expect(getStageStatus(temas, 'binomial', 'calcular')).toBe('bloqueada');
  });

  it('las etapas de un tema bloqueado están todas bloqueadas', () => {
    const temas = fresh();
    for (const s of STAGE_ORDER) expect(isStageUnlocked(temas, 'poisson', s)).toBe(false);
  });

  it('orden de etapas', () => {
    expect(previousScoredStage('pistas')).toBeNull();
    expect(previousScoredStage('reconocer')).toBeNull();
    expect(previousScoredStage('contrastar')).toBe('calcular');
    expect(nextScoredStage('reconocer')).toBe('parametros');
    expect(nextScoredStage('contrastar')).toBeNull();
    expect(nextScoredStage('pistas')).toBeNull();
  });
});

describe('recorrido completo del curso en orden', () => {
  it('en cada paso solo la siguiente etapa está disponible y todo lo posterior bloqueado', () => {
    const approved = new Set<string>();
    const temas = (): Temas => temasWith((t, s) => approved.has(`${t}/${s}`));

    for (const topic of TOPIC_ORDER) {
      for (const stage of SCORED_STAGES) {
        // Antes de aprobar: esta etapa está disponible...
        expect(getStageStatus(temas(), topic, stage), `${topic}/${stage}`).toBe('disponible');
        // ...y ninguna posterior (de este ni de otros temas) lo está.
        for (const t2 of TOPIC_ORDER) {
          for (const s2 of SCORED_STAGES) {
            const isAfter =
              TOPIC_ORDER.indexOf(t2) > TOPIC_ORDER.indexOf(topic) ||
              (t2 === topic && SCORED_STAGES.indexOf(s2) > SCORED_STAGES.indexOf(stage));
            if (isAfter) expect(getStageStatus(temas(), t2, s2), `${t2}/${s2} tras ${topic}/${stage}`).toBe('bloqueada');
          }
        }
        approved.add(`${topic}/${stage}`);
      }
      expect(getTopicStatus(temas(), topic)).toBe('completado');
    }
    expect(completedTopicCount(temas())).toBe(TOPIC_ORDER.length);
  });
});
```