/**
 * SCORM 1.2 API Wrapper & Session Manager
 * Conector estándar para LMS (Moodle, Blackboard, Canvas, Chamilo, etc.)
 */

export interface ScormLmsInfo {
  isConnected: boolean;
  studentName: string;
  studentId: string;
  lessonStatus: string;
  scoreRaw: string;
  suspendData: string;
  isSimulated?: boolean;
}

// Interfaz estándar de la API de SCORM 1.2 expuesta por el LMS
interface Scorm12API {
  LMSInitialize(param: string): string;
  LMSFinish(param: string): string;
  LMSGetValue(element: string): string;
  LMSSetValue(element: string, value: string): string;
  LMSCommit(param: string): string;
  LMSGetLastError(): string;
  LMSGetErrorString(errorCode: string): string;
  LMSGetDiagnostic(errorCode: string): string;
}

class Scorm12Manager {
  private api: Scorm12API | null = null;
  private isInitialized: boolean = false;
  private startTime: number = Date.now();
  private isSimulated: boolean = false;
  private mockStorage: Record<string, string> = {
    'cmi.core.student_name': 'Estudiante Demo (LMS)',
    'cmi.core.student_id': 'EST-2026-001',
    'cmi.core.lesson_status': 'incomplete',
    'cmi.core.score.raw': '0',
    'cmi.core.score.min': '0',
    'cmi.core.score.max': '100',
    'cmi.suspend_data': '',
  };

  constructor() {
    this.findAndInitApi();
  }

  /**
   * Búsqueda del objeto API de SCORM 1.2 en la jerarquía de ventanas
   */
  private findApi(win: Window): Scorm12API | null {
    let attempts = 0;
    const maxAttempts = 10;
    let currentWin: any = win;

    while (currentWin && attempts < maxAttempts) {
      try {
        if (currentWin.API) {
          return currentWin.API;
        }
      } catch (e) {
        // Bloqueo por cross-origin
        break;
      }

      if (currentWin.parent && currentWin.parent !== currentWin) {
        currentWin = currentWin.parent;
      } else {
        break;
      }
      attempts++;
    }

    // Probar también en window.opener si se abrió en popup
    if (win.opener) {
      try {
        if (win.opener.API) return win.opener.API;
      } catch (e) {
        // Ignorar
      }
    }

    return null;
  }

  public findAndInitApi(): boolean {
    if (this.isInitialized && this.api) return true;

    try {
      this.api = this.findApi(window);
      if (this.api) {
        const res = this.api.LMSInitialize('');
        this.isInitialized = res === 'true';
        if (this.isInitialized) {
          // Inicializar estado básico
          const status = this.getValue('cmi.core.lesson_status');
          if (!status || status === 'not attempted') {
            this.setValue('cmi.core.lesson_status', 'incomplete');
            this.setValue('cmi.core.score.min', '0');
            this.setValue('cmi.core.score.max', '100');
            this.commit();
          }
          this.startTime = Date.now();
          console.log('[SCORM 1.2] Conectado exitosamente con LMS.');
          return true;
        }
      }
    } catch (e) {
      console.warn('[SCORM 1.2] No se pudo conectar con LMS:', e);
    }
    return false;
  }

  public enableSimulator() {
    this.isSimulated = true;
    this.isInitialized = true;
    this.startTime = Date.now();
  }

  public isConnected(): boolean {
    return this.isInitialized;
  }

  public getValue(parameter: string): string {
    if (this.isSimulated) {
      return this.mockStorage[parameter] || '';
    }
    if (!this.api || !this.isInitialized) return '';
    try {
      return this.api.LMSGetValue(parameter);
    } catch (e) {
      console.warn(`[SCORM 1.2] Error obteniendo ${parameter}:`, e);
      return '';
    }
  }

  public setValue(parameter: string, value: string): boolean {
    if (this.isSimulated) {
      this.mockStorage[parameter] = value;
      return true;
    }
    if (!this.api || !this.isInitialized) return false;
    try {
      const res = this.api.LMSSetValue(parameter, value);
      return res === 'true';
    } catch (e) {
      console.warn(`[SCORM 1.2] Error seteando ${parameter}=${value}:`, e);
      return false;
    }
  }

  public commit(): boolean {
    if (this.isSimulated) return true;
    if (!this.api || !this.isInitialized) return false;
    try {
      return this.api.LMSCommit('') === 'true';
    } catch (e) {
      return false;
    }
  }

  public finish(): boolean {
    if (!this.isInitialized) return false;

    // Calcular tiempo de sesión en formato HH:MM:SS
    const durationSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    const hours = String(Math.floor(durationSeconds / 3600)).padStart(4, '0');
    const minutes = String(Math.floor((durationSeconds % 3600) / 60)).padStart(2, '0');
    const seconds = String(durationSeconds % 60).padStart(2, '0');
    const sessionTime = `${hours}:${minutes}:${seconds}`;

    this.setValue('cmi.core.session_time', sessionTime);
    this.commit();

    if (this.isSimulated) {
      this.isInitialized = false;
      return true;
    }

    if (this.api) {
      try {
        const res = this.api.LMSFinish('');
        this.isInitialized = false;
        return res === 'true';
      } catch (e) {
        return false;
      }
    }
    return false;
  }

  /**
   * Sincronizar el progreso de Easy Pro hacia el LMS
   * @param completionPercentage porcentaje 0 - 100
   * @param stateJson serialización del estado para suspend_data
   */
  public syncProgress(completionPercentage: number, stateJson: string) {
    if (!this.isInitialized) return;

    // Score de 0 a 100
    const roundedScore = Math.min(100, Math.max(0, Math.round(completionPercentage)));
    this.setValue('cmi.core.score.raw', String(roundedScore));

    // Si supera el 80% (meta pedagógica de Easy Pro), marcar como passed / completed
    if (roundedScore >= 80) {
      this.setValue('cmi.core.lesson_status', 'passed');
    } else if (roundedScore > 0) {
      this.setValue('cmi.core.lesson_status', 'incomplete');
    }

    // Almacenar el suspend_data (permite continuar en cualquier dispositivo dentro de Moodle/Canvas)
    this.setValue('cmi.suspend_data', stateJson);
    this.commit();
  }

  public getLmsInfo(): ScormLmsInfo {
    return {
      isConnected: this.isInitialized,
      studentName: this.getValue('cmi.core.student_name') || 'Estudiante Local',
      studentId: this.getValue('cmi.core.student_id') || 'LOCAL-USER',
      lessonStatus: this.getValue('cmi.core.lesson_status') || 'not attempted',
      scoreRaw: this.getValue('cmi.core.score.raw') || '0',
      suspendData: this.getValue('cmi.suspend_data'),
      isSimulated: this.isSimulated,
    };
  }
}

export const scorm12 = new Scorm12Manager();
