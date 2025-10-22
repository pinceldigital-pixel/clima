// --- Service Worker (sw.js) ---

// Define un nombre para el caché. Cambia 'v1' si actualizas los archivos.
const CACHE_NAME = 'weather-app-cache-v1';

// Lista de archivos para almacenar en caché durante la instalación.
// Asegúrate de que estas rutas coincidan con la estructura de tu proyecto.
// Estas rutas deben coincidir con las de tu servidor web.
const urlsToCache = [
  '/', // La página principal (asumimos que es index.html en la raíz)
  '/manifest.json', // El manifiesto que tienes en el Canvas
  
  // Los iconos referenciados en tu manifest.json
  '/icon-192.png',
  '/icon-512.png',
  
  // Recursos externos que usa la app (CDN de Tailwind y Fuentes)
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap'
];

// Evento 'install': Se dispara cuando el Service Worker se instala.
self.addEventListener('install', event => {
  console.log('Service Worker: Instalando...');
  
  // Espera hasta que el caché se abra y todos los archivos base se añadan.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Cache abierto, añadiendo archivos base.');
        // addAll fallará si uno solo de los archivos no se puede descargar.
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Archivos base cacheados exitosamente.');
        // Forzar al SW "en espera" a convertirse en el SW activo.
        // Esto asegura que la app funcione offline desde la primera carga.
        return self.skipWaiting();
      })
      .catch(error => {
        // Esto es crucial para depurar. Si una ruta en urlsToCache es incorrecta, fallará aquí.
        console.error('Service Worker: Falló el cacheo de archivos base:', error);
      })
  );
});

// Evento 'fetch': Se dispara cada vez que la app pide un recurso (CSS, JS, imagen, página).
// Estrategia: "Cache First" (Primero caché)
self.addEventListener('fetch', event => {
  event.respondWith(
    // Intenta encontrar el recurso en el caché.
    caches.match(event.request)
      .then(response => {
        // Si el recurso está en el caché, lo devuelve desde allí.
        if (response) {
          return response;
        }
        
        // Si no está en el caché, lo busca en la red.
        console.log(`Service Worker: Recurso no encontrado en caché, buscando en red: ${event.request.url}`);
        return fetch(event.request);
      })
      .catch(error => {
        // Manejo de errores (por ejemplo, si la red falla y no está en caché)
        console.error('Service Worker: Error en fetch:', error);
        // Podrías devolver una página "offline" genérica aquí si quisieras.
      })
  );
});

// Evento 'activate': Se dispara cuando el Service Worker se activa.
// Se usa para limpiar cachés antiguos y asegurar que la app use la última versión.
self.addEventListener('activate', event => {
  console.log('Service Worker: Activando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          // Borra todos los cachés que no sean el actual (CACHE_NAME)
          // Esto es vital cuando subes una nueva versión (ej. 'v2')
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          console.log(`Service Worker: Borrando caché antiguo: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
    })
    .then(() => {
        console.log('Service Worker: Activado y cachés antiguos limpiados.');
        // Tomar control inmediato de todas las páginas abiertas.
        return self.clients.claim();
    })
  );
});