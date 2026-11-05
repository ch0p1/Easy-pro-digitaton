import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { TopicRoadmap } from './TopicRoadmap';
import { TOPICS_DATA } from '../../data/topics';
import { SCORED_STAGES, STAGE_ORDER, TOPIC_ORDER } from '../../scorm/progress';
import type { AppState, StageId, TopicId } from '../../types';

type Temas = AppState['temas'];

function temasWith(approved: (t: TopicId, s: StageId) => boolean): Temas {
  const temas = {} as Temas;
  for (const t of TOPIC_ORDER) {
    const etapas = {} as Temas[TopicId]['etapas'];
    for (const s of STAGE_ORDER) etapas[s] = { aprobada: approved(t, s), intentos: 0, aciertos: 0 };
    temas[t] = { completado: false, etapas };
  }
  return temas;
}

const noop = () => {};
// React inserta marcadores <!-- --> entre textos interpolados al renderizar en servidor; no existen en el DOM.
const render = (progress: Temas, extra: Record<string, unknown> = {}) =>
  renderToString(
    createElement(TopicRoadmap, {
      progress,
      onStartStage: noop,
      onOpenDecisionTree: noop,
      onOpenQuickDrill: noop,
      ...extra,
    })
  ).replace(/<!-- -->/g, '');

const topicTag = (html: string, id: string) => html.match(new RegExp(`data-topic="${id}" data-status="([a-z-]+)"`))?.[1];

describe('mapa de ruta (HTML renderizado)', () => {
  it('estado nuevo: tema 1 abierto, temas 2 a 8 bloqueados con su motivo', () => {
    const html = render(temasWith(() => false));
    expect(topicTag(html, TOPIC_ORDER[0])).toBe('disponible');
    for (const t of TOPIC_ORDER.slice(1)) expect(topicTag(html, t), t).toBe('bloqueado');
    expect(html).toContain(`Bloqueado: completa «${TOPICS_DATA[0].nombre}» para desbloquearlo`);
    // Avance del curso en 0 %
    expect(html).toMatch(/aria-valuenow="0"/);
  });

  it('en el tema abierto, solo pistas y reconocer son accionables; el resto está deshabilitado', () => {
    const html = render(temasWith(() => false));
    for (const s of ['pistas', 'reconocer']) expect(html).toMatch(new RegExp(`data-stage="${s}" data-status="disponible"(?![^>]*disabled)`));
    for (const s of ['parametros', 'calcular', 'contrastar']) {
      expect(html, s).toMatch(new RegExp(`data-stage="${s}" data-status="bloqueada" disabled=""`));
    }
    expect(html).toContain('Aprueba «');
  });

  it('al completar el tema 1, el tema 2 queda disponible y el 3 sigue bloqueado', () => {
    const temas = temasWith((t, s) => t === TOPIC_ORDER[0] && SCORED_STAGES.includes(s));
    const html = render(temas, { focusTopic: TOPIC_ORDER[1] });
    expect(topicTag(html, TOPIC_ORDER[0])).toBe('completado');
    expect(topicTag(html, TOPIC_ORDER[1])).toBe('disponible');
    expect(topicTag(html, TOPIC_ORDER[2])).toBe('bloqueado');
    // 4 de 32 etapas calificables aprobadas = 13 %
    expect(html).toMatch(/aria-valuenow="13"/);
  });

  it('un tema bloqueado nunca se expande aunque se pida enfocarlo', () => {
    const html = render(temasWith(() => false), { focusTopic: TOPIC_ORDER[3] });
    expect(html).not.toContain(`id="topic-panel-${TOPIC_ORDER[3]}"`);
  });

  it('muestra el aviso accesible cuando se pasa', () => {
    const html = render(temasWith(() => false), { notice: 'Tema bloqueado de prueba' });
    expect(html).toContain('role="status"');
    expect(html).toContain('Tema bloqueado de prueba');
  });
});
