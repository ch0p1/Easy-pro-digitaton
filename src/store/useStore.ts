import { useState, useEffect, useCallback } from 'react';
import { AppState, TopicId, StageId, RecordedError } from '../types';
import { scorm12 } from '../scorm/scorm12';
import * as rules from '../progress/rules';
import {
  SCORED_STAGES,
  completionPercentage,
  decodeSuspendData,
  encodeSuspendData,
} from '../scorm/progress';

const STORAGE_KEY = 'easy_pro_academic_state_v1';
const CURRENT_VERSION = 1;

const INITIAL_TOPICS: TopicId[] = [
  'binomial',
  'hipergeometrica',
  'geometrica-nb',
  'poisson',
  'exponencial',
  'gamma',
  'normal',
  'integrador',
];

const STAGES_LIST: StageId[] = [
  'pistas',
  'reconocer',
  'parametros',
  'calcular',
  'contrastar',
];

function getInitialState(): AppState {
  const temasState: Record<TopicId, any> = {} as any;
  INITIAL_TOPICS.forEach((t) => {
    const etapasObj: Record<StageId, any> = {} as any;
    STAGES_LIST.forEach((s) => {
      etapasObj[s] = {
        aprobada: false,
        intentos: 0,
        aciertos: 0,
      };
    });
    temasState[t] = {
      completado: false,
      etapas: etapasObj,
    };
  });

  return {
    version: CURRENT_VERSION,
    temas: temasState,
    errores: [],
    sonidosHabilitados: true,
  };
}

/**
 * Mezcla un estado guardado con el estado inicial. La mezcla es por tema, de modo que los
 * temas añadidos en versiones nuevas aparecen aunque el usuario ya tuviera datos guardados.
 */
function mergeWithInitial(parsed: Partial<AppState> & { temas?: Record<string, any> }): AppState {
  const initial = getInitialState();
  const savedTemas: Record<string, any> = { ...(parsed.temas ?? {}) };
  // Migración: versiones anteriores guardaban el tema 3 como 'geometrica'.
  if (savedTemas['geometrica'] && !savedTemas['geometrica-nb']) {
    savedTemas['geometrica-nb'] = savedTemas['geometrica'];
  }
  delete savedTemas['geometrica'];
  return {
    ...initial,
    ...parsed,
    temas: { ...initial.temas, ...savedTemas },
    errores: Array.isArray(parsed.errores) ? parsed.errores : [],
    version: CURRENT_VERSION,
  };
}

function loadState(): AppState {
  let local: AppState | null = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.temas) local = mergeWithInitial(parsed);
    }
  } catch (e) {
    console.warn('Error reading localStorage, using memory state:', e);
  }

  // Si se ejecuta dentro de un LMS (SCORM), su progreso tiene prioridad.
  try {
    const lmsSuspendData = scorm12.getValue('cmi.suspend_data');
    if (lmsSuspendData) {
      const lmsTemas = decodeSuspendData(lmsSuspendData);
      if (lmsTemas) {
        return mergeWithInitial({ ...(local ?? {}), temas: lmsTemas as AppState['temas'] });
      }
      // Compatibilidad: formato anterior (estado completo en JSON).
      const legacy = JSON.parse(lmsSuspendData);
      if (legacy && legacy.temas) return mergeWithInitial(legacy);
    }
  } catch (e) {
    // suspend_data ilegible: se usa localStorage
  }

  return local ?? getInitialState();
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Error writing localStorage:', e);
  }
  try {
    // Nota real y estado compacto (SCORM 1.2 limita suspend_data a 4096 caracteres).
    scorm12.syncProgress(completionPercentage(state), encodeSuspendData(state));
  } catch (e) {
    console.warn('Error writing state:', e);
  }
}

export function useAppStore() {
  const [state, setState] = useState<AppState>(loadState);

  // Sync state to local storage on change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const recordStageCompletion = useCallback(
    (topicId: TopicId, stageId: StageId, isSuccess: boolean) => {
      setState((prev) => {
        const topic = prev.temas[topicId] || { completado: false, etapas: {} };
        const stage = topic.etapas[stageId] || { aprobada: false, intentos: 0, aciertos: 0 };

        const updatedStage = {
          aprobada: stage.aprobada || isSuccess,
          intentos: stage.intentos + 1,
          aciertos: isSuccess ? stage.aciertos + 1 : stage.aciertos,
        };

        const updatedEtapas = {
          ...topic.etapas,
          [stageId]: updatedStage,
        };
        const completado = SCORED_STAGES.every((s) => updatedEtapas[s]?.aprobada);

        return {
          ...prev,
          temas: {
            ...prev.temas,
            [topicId]: {
              ...topic,
              completado,
              etapas: updatedEtapas,
            },
          },
        };
      });
    },
    []
  );

  const recordError = useCallback((error: RecordedError) => {
    setState((prev) => ({
      ...prev,
      errores: [error, ...prev.errores.slice(0, 99)],
    }));
  }, []);

  const clearResolvedError = useCallback((ejercicioId: string) => {
    setState((prev) => ({
      ...prev,
      errores: prev.errores.filter((e) => e.ejercicioId !== ejercicioId),
    }));
  }, []);

  // Desbloqueo secuencial: cada tema (y cada etapa) se abre al completar el anterior.
  const isTopicUnlocked = useCallback(
    (topicId: TopicId): boolean => rules.isTopicUnlocked(state.temas, topicId),
    [state.temas]
  );

  const isStageUnlocked = useCallback(
    (topicId: TopicId, stageId: StageId): boolean => rules.isStageUnlocked(state.temas, topicId, stageId),
    [state.temas]
  );

  const exportStateJSON = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `easy_pro_datos_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [state]);

  const importStateJSON = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.temas) {
        setState(mergeWithInitial(parsed));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Import error:', e);
      return false;
    }
  }, []);

  const resetAllProgress = useCallback(() => {
    const fresh = getInitialState();
    setState(fresh);
  }, []);

  return {
    state,
    recordStageCompletion,
    recordError,
    clearResolvedError,
    isTopicUnlocked,
    isStageUnlocked,
    exportStateJSON,
    importStateJSON,
    resetAllProgress,
  };
}
