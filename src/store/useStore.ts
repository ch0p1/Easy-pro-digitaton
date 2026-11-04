import { useState, useEffect, useCallback } from 'react';
import { AppState, TopicId, StageId, ConfusionType, RecordedError } from '../types';
import { scorm12 } from '../scorm/scorm12';

const STORAGE_KEY = 'easy_pro_est_v2';
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

const STAGES_LIST: StageId[] = ['pistas', 'reconocer', 'parametros', 'calcular', 'contrastar'];

function getInitialState(): AppState {
  const temasState: Record<string, any> = {};

  INITIAL_TOPICS.forEach((t) => {
    const etapasObj: Record<string, any> = {};
    STAGES_LIST.forEach((s) => {
      etapasObj[s] = {
        aprobada: s === 'pistas', // Pistas start read or easily read
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
    xp: 0,
    racha: {
      dias: 1,
      ultimaFecha: new Date().toISOString().slice(0, 10),
    },
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
      // Migrate if version changes
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

    // Sync to SCORM LMS
    const completedCount = INITIAL_TOPICS.filter((t) => state.temas[t]?.completado).length;
    const completionPercentage = (completedCount / INITIAL_TOPICS.length) * 100;
    scorm12.syncProgress(completionPercentage, JSON.stringify(state));
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

  // Daily streak check
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    setState((prev) => {
      if (!prev.racha.ultimaFecha) {
        return {
          ...prev,
          racha: { dias: 1, ultimaFecha: today },
        };
      }
      if (prev.racha.ultimaFecha === today) {
        return prev;
      }
      const last = new Date(prev.racha.ultimaFecha);
      const curr = new Date(today);
      const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));
      if (diffDays === 1) {
        return {
          ...prev,
          racha: { dias: prev.racha.dias + 1, ultimaFecha: today },
        };
      } else if (diffDays > 1) {
        return {
          ...prev,
          racha: { dias: 1, ultimaFecha: today },
        };
      }
      return prev;
    });
  }, []);

  const addXP = useCallback((points: number) => {
    setState((prev) => ({
      ...prev,
      xp: prev.xp + points,
    }));
  }, []);

  const recordStageCompletion = useCallback(
    (topicId: TopicId, stageId: StageId, isSuccess: boolean, pointsEarned: number = 20) => {
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

        // A topic is completed if stages 2 to 5 (reconocer, parametros, calcular, contrastar) are approved!
        const requiredApproved = ['reconocer', 'parametros', 'calcular', 'contrastar'].every(
          (s) => updatedEtapas[s as StageId]?.aprobada
        );

        return {
          ...prev,
          xp: isSuccess ? prev.xp + pointsEarned : prev.xp,
          temas: {
            ...prev.temas,
            [topicId]: {
              ...topic,
              completado: requiredApproved,
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

  const isTopicUnlocked = useCallback(
    (topicId: TopicId): boolean => {
      // First topic (Binomial) is always unlocked
      if (topicId === 'binomial') return true;
      const index = INITIAL_TOPICS.indexOf(topicId);
      if (index <= 0) return true;
      const prevTopicId = INITIAL_TOPICS[index - 1];
      return !!state.temas[prevTopicId]?.completado;
    },
    [state.temas]
  );

  const isStageUnlocked = useCallback(
    (topicId: TopicId, stageId: StageId): boolean => {
      if (!isTopicUnlocked(topicId)) return false;
      const stageIdx = STAGES_LIST.indexOf(stageId);
      if (stageIdx <= 0) return true;
      const prevStageId = STAGES_LIST[stageIdx - 1];
      return !!state.temas[topicId]?.etapas[prevStageId]?.aprobada;
    },
    [isTopicUnlocked, state.temas]
  );

  const exportStateJSON = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `easy_pro_progreso_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [state]);

  const importStateJSON = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed.xp === 'number' && parsed.temas) {
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

  const completedTopics = INITIAL_TOPICS.filter((t) => state.temas[t]?.completado).length;
  const completionPercentage = (completedTopics / INITIAL_TOPICS.length) * 100;

  return {
    state,
    completionPercentage,
    addXP,
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
