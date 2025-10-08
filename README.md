# Clima PWA de Daniel

App PWA instalable (Android/desktop) que muestra temperatura actual y 3 días siguientes usando Open‑Meteo (sin API key).

## Cómo usar
1. Abre `index.html` con un servidor local (por ejemplo: Live Server en VS Code, `python -m http.server`, etc.).
   > Nota: Los Service Workers requieren servir archivos por HTTP/HTTPS.
2. Presioná **"Actualizar BA"** o **"Usar mi ubicación"**.
3. En el navegador, usá **Agregar a la pantalla de inicio** para instalarla.

## Archivos
- `index.html`: UI y lógica (React + Babel vía CDN).
- `service-worker.js`: caché offline (app shell y última respuesta de Open‑Meteo).
- `manifest.webmanifest`: metadatos PWA + iconos.
- `assets/icons/icon-192.png`, `assets/icons/icon-512.png`: iconos.

## Notas
- Funciona sin API key. Requiere conexión al menos una vez para cachear librerías.
- La app muestra datos de **Open‑Meteo** para Buenos Aires por defecto y puede usar tu geolocalización.
