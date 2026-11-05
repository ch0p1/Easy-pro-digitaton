# rules.ts

```typescript
import type { AppState, StageId, TopicId } from '../types';
import { SCORED_STAGES, TOPIC_ORDER } from '../scorm/progress';

/**
 * Reglas de desbloqueo secuencial (funciones puras, sin React):
 *  - Un tema se desbloquea cuando TODOS los temas anteriores están completados.
 *  - Dentro de un tema, cada etapa se desbloquea al aprobar la anterior
 *    (reconocer → parámetros → calcular → contrastar).
 *  - «Pistas» es lectura: siempre disponible en un tema desbloqueado.
 *  - Un tema está completado cuando sus 4 etapas calificables están aprobadas.
 */
type Temas = AppState['temas'];

export type StageStatus = 'bloqueada' | 'disponible' | 'aprobada';
export type TopicStatus = 'bloqueado' | 'disponible' | 'en-curso' | 'completado';

export function isStageApproved(temas: Temas, topic: TopicId, stage: StageId): boolean {
  return Boolean(temas?.[topic]?.etapas?.[stage]?.aprobada);
}

export function approvedStageCount(temas: Temas, topic: TopicId): number {
  return SCORED_STAGES.filter((s) => isStageApproved(temas, topic, s)).length;
}

export function isTopicCompleted(temas: Temas, topic: TopicId): boolean {
  return approvedStageCount(temas, topic) === SCORED_STAGES.length;
}

/** Primer tema anterior a `topic` que aún no está completado (el que bloquea), o null. */
export function blockingTopic(temas: Temas, topic: TopicId): TopicId | null {
  const idx = TOPIC_ORDER.indexOf(topic);
  for (let i = 0; i < idx; i++) {
    if (!isTopicCompleted(temas, TOPIC_ORDER[i])) return TOPIC_ORDER[i];
  }
  return null;
}

export function isTopicUnlocked(temas: Temas, topic: TopicId): boolean {
  return blockingTopic(temas, topic) === null;
}

/** Etapa calificable inmediatamente anterior, o null para 'pistas' y 'reconocer'. */
export function previousScoredStage(stage: StageId): StageId | null {
  const i = SCORED_STAGES.indexOf(stage);
  return i > 0 ? SCORED_STAGES[i - 1] : null;
}

/** Siguiente etapa calificable, o null si es la última (o 'pistas'). */
export function nextScoredStage(stage: StageId): StageId | null {
  const i = SCORED_STAGES.indexOf(stage);
  return i >= 0 && i + 1 < SCORED_STAGES.length ? SCORED_STAGES[i + 1] : null;
}

export function isStageUnlocked(temas: Temas, topic: TopicId, stage: StageId): boolean {
  if (!isTopicUnlocked(temas, topic)) return false;
  const prev = previousScoredStage(stage);
  return prev === null || isStageApproved(temas, topic, prev);
}

export function getStageStatus(temas: Temas, topic: TopicId, stage: StageId): StageStatus {
  if (isStageApproved(temas, topic, stage)) return 'aprobada';
  return isStageUnlocked(temas, topic, stage) ? 'disponible' : 'bloqueada';
}

export function getTopicStatus(temas: Temas, topic: TopicId): TopicStatus {
  if (!isTopicUnlocked(temas, topic)) return 'bloqueado';
  const n = approvedStageCount(temas, topic);
  if (n === SCORED_STAGES.length) return 'completado';
  return n > 0 ? 'en-curso' : 'disponible';
}

export function nextTopic(topic: TopicId): TopicId | null {
  const i = TOPIC_ORDER.indexOf(topic);
  return i >= 0 && i + 1 < TOPIC_ORDER.length ? TOPIC_ORDER[i + 1] : null;
}

/** Tema donde el estudiante debe continuar: el primero sin completar (o el último). */
export function firstOpenTopic(temas: Temas): TopicId {
  return TOPIC_ORDER.find((t) => !isTopicCompleted(temas, t)) ?? TOPIC_ORDER[TOPIC_ORDER.length - 1];
}

export function completedTopicCount(temas: Temas): number {
  return TOPIC_ORDER.filter((t) => isTopicCompleted(temas, t)).length;
}
```