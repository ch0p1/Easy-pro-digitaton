import JSZip from 'jszip';

export function generateImsManifestXml(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- 
  Manifiesto Oficial SCORM 1.2 - Easy Pro: Probabilidad y Estadística
  Texto Guía: Devore, Probabilidad y Estadística para Ingeniería y Ciencias
-->
<manifest identifier="easy_pro_probabilidad_scorm12" version="1.2"
  xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                      http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
  </metadata>
  <organizations default="EASY_PRO_COURSE_ORG">
    <organization identifier="EASY_PRO_COURSE_ORG">
      <title>Easy Pro: Probabilidad y Estadística (Devore)</title>
      <item identifier="ITEM_EASY_PRO_MAIN" identifierref="RES_EASY_PRO_APP">
        <title>Easy Pro - Entrena el Reconocimiento de Modelos y Distribuciones</title>
        <adlcp:masteryscore>80</adlcp:masteryscore>
        <adlcp:datafromlms></adlcp:datafromlms>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RES_EASY_PRO_APP" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html"/>
    </resource>
  </resources>
</manifest>`;
}

export function generateLmsInstallationGuide(): string {
  return `# Guía de Instalación del Paquete SCORM 1.2 de Easy Pro

Este paquete comprimido (.zip) cumple con el estándar **ADL SCORM 1.2** y es compatible directamente con:
- **Moodle** (versiones 3.x, 4.x)
- **Canvas LMS**
- **Blackboard Learn**
- **Chamilo LMS**
- **Schoology / Brightspace**

---

## 1. Instalación en Moodle

1. Ingresa a tu curso en Moodle y haz clic en **«Activar edición»**.
2. En la sección deseada, haz clic en **«Añadir una actividad o un recurso»**.
3. Selecciona la opción **«Paquete SCORM»**.
4. En el campo «Nombre», escribe: \`Easy Pro: Práctica de Probabilidad y Estadística\`.
5. En la sección **«Paquete»**, arrastra y suelta el archivo \`easy_pro_scorm_12.zip\`.
6. En **«Calificación»**:
   - Método de calificación: \`Calificación más alta\` o \`Promedio de calificaciones\`.
   - Calificación máxima: \`100\` (o \`5.0\` según la escala de tu universidad).
7. En **«Gestión de intentos»**:
   - Número de intentos: \`Ilimitados\` (conforme al principio pedagógico del curso sin vidas).
8. Haz clic en **«Guardar cambios y mostrar»**.

---

## 2. Variables SCORM 1.2 sincronizadas por Easy Pro

- \`cmi.core.lesson_status\`: Reporta \`incomplete\` al iniciar, y cambia a \`passed\` / \`completed\` cuando el estudiante alcanza la meta de maestría del 80%.
- \`cmi.core.score.raw\`: Calificación numérica de 0 a 100 basada en las etapas y temas dominados.
- \`cmi.core.session_time\`: Tiempo dedicado por sesión en el curso.
- \`cmi.suspend_data\`: Guarda el estado completo de temas aprobados, racha, XP y errores para que el estudiante pueda continuar desde cualquier navegador o computador dentro del LMS.
`;
}

export async function createScormZipBlob(): Promise<Blob> {
  const zip = new JSZip();

  // 1. imsmanifest.xml
  zip.file('imsmanifest.xml', generateImsManifestXml());

  // 2. Guía para el profesor / administrador LMS
  zip.file('LEEME_INSTALACION_LMS.md', generateLmsInstallationGuide());

  // 3. Mini redirector / launcher wrapper
  const launcherHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Easy Pro - Cargando SCORM 1.2...</title>
  <style>
    body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #FBF5EC; color: #8A1428; }
    .card { background: white; padding: 2rem; border-radius: 1rem; border: 1px solid rgba(138,20,40,0.2); text-align: center; max-width: 480px; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Easy Pro: Probabilidad y Estadística</h2>
    <p>Conectando con la API SCORM 1.2 del LMS...</p>
    <p><small>Redirigiendo a la plataforma de práctica interactiva...</small></p>
  </div>
  <script>
    // Búsqueda de API SCORM 1.2
    function findAPI(win) {
      var findAttempts = 0;
      while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
        findAttempts++;
        if (findAttempts > 10) return null;
        win = win.parent;
      }
      return win.API;
    }
    var api = findAPI(window) || (window.opener ? findAPI(window.opener) : null);
    if (api) {
      try {
        api.LMSInitialize("");
        api.LMSSetValue("cmi.core.lesson_status", "incomplete");
        api.LMSCommit("");
      } catch(e) {}
    }
    // Redirigir a la app principal
    window.location.href = window.location.origin + window.location.pathname.replace(/launcher\\.html$/, "") + "index.html";
  </script>
</body>
</html>`;
  zip.file('launcher.html', launcherHtml);

  return await zip.generateAsync({ type: 'blob' });
}
