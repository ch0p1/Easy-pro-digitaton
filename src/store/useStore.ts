import { useState, useEffect, useCallback } from 'react';
import { AppState, TopicId, StageId, RecordedError } from '../types';
import { scorm12 } from '../scorm/scorm12';

const STORAGE_KEY = 'easy_pro_academic_state_v1';
const CURRENT_VERSION = 1;

const INITIAL_TOPICS: TopicId[] = [
  'binomial',
  'hipergeometrica',
  'geometrica',
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

function loadState(): AppState {
  try {
    // 1. Prioritize SCORM suspend_data if running inside an LMS
    const lmsSuspendData = scorm12.getValue('cmi.suspend_data');
    if (lmsSuspendData) {
      try {
        const parsedLms = JSON.parse(lmsSuspendData);
        if (parsedLms && parsedLms.temas) {
          return { ...getInitialState(), ...parsedLms, version: CURRENT_VERSION };
        }
      } catch (e) {
        // Fallback to local storage
      }
    }

    // 2. Local storage
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialState();
    const parsed = JSON.parse(raw);
    if (parsed.version !== CURRENT_VERSION) {
      const initial = getInitialState();
      return { ...initial, ...parsed, version: CURRENT_VERSION };
    }
    return parsed;
  } catch (e) {
    console.warn('Error reading localStorage, using memory state:', e);
    return getInitialState();
  }
}

function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    scorm12.syncProgress(100, JSON.stringify(state));
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

        return {
          ...prev,
          temas: {
            ...prev.temas,
            [topicId]: {
              ...topic,
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

  // All topics and stages are fully accessible and unlocked
  const isTopicUnlocked = useCallback((_topicId: TopicId): boolean => {
    return true;
  }, []);

  const isStageUnlocked = useCallback((_topicId: TopicId, _stageId: StageId): boolean => {
    return true;
  }, []);

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
        setState({ ...parsed, version: CURRENT_VERSION });
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
