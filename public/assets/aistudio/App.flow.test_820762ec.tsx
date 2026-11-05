// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { Exercise } from './types';
import { TOPICS_DATA } from './data/topics';
import { SCORED_STAGES, STAGE_ORDER, TOPIC_ORDER, encodeSuspendData } from './scorm/progress';

// jsdom no implementa canvas: se simula el confeti de las respuestas correctas.
vi.mock('canvas-confetti', () => ({ default: () => {} }));

/** Simula un LMS SCORM 1.2 mínimo y registra lo que la app le escribe. */
function installFakeLms(initial: Record<string, string> = {}) {
  const data: Record<string, string> = { ...initial };
  const writes: Array<[string, string]> = [];
  (window as any).API = {
    LMSInitialize: () => 'true',
    LMSFinish: () => 'true',
    LMSGetValue: (k: string) => data[k] ?? '',
    LMSSetValue: (k: string, v: string) => {
      data[k] = v;
      writes.push([k, v]);
      return 'true';
    },
    LMSCommit: () => 'true',
    LMSGetLastError: () => '0',
    LMSGetErrorString: () => '',
    LMSGetDiagnostic: () => '',
  };
  return { data, writes };
}

async function loadApp() {
  vi.resetModules(); // scorm12 busca window.API al importarse
  const mod = await import('./App');
  return mod.default;
}

const topicEl = (container: HTMLElement, id: string) => container.querySelector(`[data-topic="${id}"]`) as HTMLElement;
const stageBtn = (container: HTMLElement, topic: string, stage: string) =>
  container.querySelector(`[data-topic="${topic}"] [data-stage="${stage}"]`) as HTMLButtonElement;

function openRoadmap() {
  fireEvent.click(screen.getAllByRole('button', { name: 'Ruta de Práctica' })[0]);
}

/** Resuelve correctamente un ejercicio usando la interfaz, como lo haría un estudiante. */
async function solveExercise(ex: Exercise) {
  if (ex.tipo === 'opcion-multiple' || ex.tipo === 'detecta-error') {
    const target = ex.opciones![ex.correcta!];
    // Cada opción lleva una letra (A, B, ...) y luego el texto; las opciones se muestran mezcladas.
    const btn = screen.getAllByRole('radio').find((r) => r.textContent!.slice(1) === target);
    expect(btn, `${ex.id}: no se encontró la opción «${target}»`).toBeTruthy();
    fireEvent.click(btn!);
  } else if (ex.tipo === 'numerico') {
    fireEvent.change(document.getElementById(`numeric-${ex.id}`)!, { target: { value: String(ex.valorEsperado) } });
  } else if (ex.tipo === 'parametros') {
    for (const p of ex.parametrosEsperados!) {
      fireEvent.change(document.getElementById(`param-${ex.id}-${p.name}`)!, { target: { value: String(p.expectedValue) } });
    }
  } else {
    throw new Error(`tipo no soportado en la prueba: ${ex.tipo}`);
  }
  fireEvent.click(screen.getByRole('button', { name: /Comprobar Respuesta/ }));
  fireEvent.click(await screen.findByRole('button', { name: 'Continuar' }));
}

async function solveCurrentStage(topicId: string, stageId: string) {
  const stage = TOPICS_DATA.find((t) => t.id === topicId)!.etapas.find((e) => e.id === stageId)!;
  for (const ex of stage.ejercicios) await solveExercise(ex);
  await screen.findByText('¡Etapa Aprobada con Éxito!');
}

beforeEach(() => {
  localStorage.clear();
  delete (window as any).API;
});
afterEach(() => {
  cleanup();
  delete (window as any).API;
});

describe('flujo completo en la app: cada bloque se desbloquea al completar el anterior', () => {
  it('recorre el tema 1 por la interfaz y desbloquea el tema 2 (y solo ese)', async () => {
    const lms = installFakeLms();
    const App = await loadApp();
    const { container } = render(<App />);
    openRoadmap();

    // Estado inicial: solo el tema 1 está abierto.
    expect(topicEl(container, 'binomial').dataset.status).toBe('disponible');
    for (const t of TOPIC_ORDER.slice(1)) expect(topicEl(container, t).dataset.status, t).toBe('bloqueado');
    // Dentro del tema 1: reconocer abierta, las demás bloqueadas y deshabilitadas.
    expect(stageBtn(container, 'binomial', 'reconocer').disabled).toBe(false);
    for (const s of ['parametros', 'calcular', 'contrastar']) {
      expect(stageBtn(container, 'binomial', s).disabled, s).toBe(true);
    }

    // La nota SCORM empieza en 0 (antes enviaba 100 al abrir) y nunca marca «passed».
    const scoresAtStart = lms.writes.filter(([k]) => k === 'cmi.core.score.raw').map(([, v]) => v);
    expect(scoresAtStart.length).toBeGreaterThan(0);
    expect(new Set(scoresAtStart)).toEqual(new Set(['0']));
    expect(lms.writes.some(([k, v]) => k === 'cmi.core.lesson_status' && v === 'passed')).toBe(false);

    // Etapa 1 (reconocer) → ofrece «Siguiente etapa» y desbloquea parámetros.
    fireEvent.click(stageBtn(container, 'binomial', 'reconocer'));
    await solveCurrentStage('binomial', 'reconocer');
    fireEvent.click(screen.getByRole('button', { name: /Siguiente etapa: Parametrizar/ }));

    // Etapas 2 y 3.
    await solveCurrentStage('binomial', 'parametros');
    fireEvent.click(screen.getByRole('button', { name: /Siguiente etapa: Calcular/ }));
    await solveCurrentStage('binomial', 'calcular');
    fireEvent.click(screen.getByRole('button', { name: /Siguiente etapa: Contrastar/ }));

    // Etapa 4: al terminarla, el bloque queda completo y se ofrece ir al siguiente.
    await solveCurrentStage('binomial', 'contrastar');
    expect(screen.getByText(/Se desbloqueó «Distribución Hipergeométrica»/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Ir a «Distribución Hipergeométrica»/ }));

    // De vuelta en el mapa: tema 1 completado, tema 2 abierto y expandido, tema 3 aún bloqueado.
    expect(topicEl(container, 'binomial').dataset.status).toBe('completado');
    expect(topicEl(container, 'hipergeometrica').dataset.status).toBe('disponible');
    expect(topicEl(container, 'geometrica-nb').dataset.status).toBe('bloqueado');
    expect(container.querySelector('#topic-panel-hipergeometrica')).toBeTruthy();
    expect(stageBtn(container, 'hipergeometrica', 'reconocer').disabled).toBe(false);
    expect(stageBtn(container, 'hipergeometrica', 'parametros').disabled).toBe(true);

    // SCORM: nota real (4 de 32 etapas = 13 %), estado compacto, sin «passed».
    const lastScore = [...lms.writes].reverse().find(([k]) => k === 'cmi.core.score.raw')![1];
    expect(lastScore).toBe('13');
    expect(lms.data['cmi.suspend_data'].startsWith('v2|')).toBe(true);
    expect(lms.data['cmi.suspend_data'].length).toBeLessThan(100);
    expect(lms.writes.some(([k, v]) => k === 'cmi.core.lesson_status' && v === 'passed')).toBe(false);

    // Persistencia local: el progreso sobrevive a recargar la app (sin LMS).
    cleanup();
    delete (window as any).API;
    const App2 = await loadApp();
    const second = render(<App2 />);
    openRoadmap();
    expect(topicEl(second.container, 'binomial').dataset.status).toBe('completado');
    expect(topicEl(second.container, 'hipergeometrica').dataset.status).toBe('disponible');
  }, 60000);

  it('al reanudar desde el LMS (suspend_data compacto) se restaura el avance', async () => {
    const temas: any = {};
    for (const t of TOPIC_ORDER) {
      temas[t] = { completado: false, etapas: {} };
      for (const s of STAGE_ORDER) {
        temas[t].etapas[s] = { aprobada: ['binomial', 'hipergeometrica'].includes(t) && SCORED_STAGES.includes(s), intentos: 0, aciertos: 0 };
      }
    }
    installFakeLms({ 'cmi.suspend_data': encodeSuspendData({ temas }) });
    const App = await loadApp();
    const { container } = render(<App />);
    openRoadmap();
    expect(topicEl(container, 'binomial').dataset.status).toBe('completado');
    expect(topicEl(container, 'hipergeometrica').dataset.status).toBe('completado');
    expect(topicEl(container, 'geometrica-nb').dataset.status).toBe('disponible');
    expect(topicEl(container, 'poisson').dataset.status).toBe('bloqueado');
  });
});
