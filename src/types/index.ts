export type TopicId =
  | 'binomial'
  | 'hipergeometrica'
  | 'geometrica-nb'
  | 'poisson'
  | 'exponencial'
  | 'gamma'
  | 'normal'
  | 'integrador';

export type StageId = 'pistas' | 'reconocer' | 'parametros' | 'calcular' | 'contrastar';

export type ExerciseType =
  | 'opcion-multiple'
  | 'numerico'
  | 'drag-formula'
  | 'parametros'
  | 'detecta-error';

export type ConfusionType =
  | 'binomial-vs-hipergeometrica'
  | 'binomial-vs-geometrica-nb'
  | 'poisson-vs-exponencial'
  | 'exponencial-vs-gamma'
  | 'binomial-vs-normal-vs-poisson'
  | 'escala-de-tasa'
  | 'probabilidad-en-continuas'
  | 'varianza-sin-media-cuadrada'
  | 'discreta-vs-continua'
  | 'general';

export interface ExerciseParamTarget {
  name: string;
  symbol: string;
  expectedValue: number | string;
  description: string;
  unit?: string;
}

export interface FormulaSlot {
  id: string;
  expectedToken: string;
  label: string;
}

export interface Exercise {
  id: string;
  tema: TopicId;
  etapa: StageId;
  tipo: ExerciseType;
  enunciado: string;
  contexto?: string;
  pistas_clave: string[];
  explicacion: string;
  confusion?: ConfusionType;
  video_ref?: {
    tema: TopicId;
    tipo: 'teoria' | 'reconocimiento' | 'python' | 'r' | 'calculadora';
  };
  origen?: 'original' | 'curso';

  // Specific to opcion-multiple & detecta-error
  opciones?: string[];
  correcta?: number; // index
  error_comun?: Record<number, string>; // index -> explanatory feedback

  // Specific to numerico
  valorEsperado?: number;
  tolerancia?: number;
  unidad?: string;
  pasosSolucion?: string[];

  // Specific to parametros
  parametrosEsperados?: ExerciseParamTarget[];

  // Specific to drag-formula
  formulaPlantilla?: string; // LaTeX representation with placeholders
  formulaFragmentosDisponibles?: string[];
  fragmentosCorrectos?: string[];

  // Specific to detecta-error
  procedimientoConError?: string;
  dondeEstaElError?: string;
}

export interface StageData {
  id: StageId;
  titulo: string;
  descripcion: string;
  tipo: ExerciseType | 'lectura';
  ejercicios: Exercise[];
  pistasTeoria?: {
    titulo: string;
    senales: string[];
    contraejemplo: string;
    formulaClave: string;
  };
}

export interface TopicData {
  id: TopicId;
  numero: number;
  nombre: string;
  subtitulo: string;
  contrastePrincipal: string;
  notacion: string;
  variable: string;
  formula: string;
  esperanza: string;
  varianza: string;
  etapas: StageData[];
  advertencias?: string[];
}

export interface UserTopicProgress {
  completado: boolean;
  etapas: Record<StageId, {
    aprobada: boolean;
    intentos: number;
    aciertos: number;
  }>;
}

export interface RecordedError {
  ejercicioId: string;
  tema: TopicId;
  etapa: StageId;
  fecha: string;
  confusion: ConfusionType;
  enunciado: string;
  respuestaDada: string;
  respuestaCorrecta: string;
}

export interface AppState {
  version: number;
  temas: Record<TopicId, UserTopicProgress>;
  errores: RecordedError[];
  sonidosHabilitados: boolean;
}
