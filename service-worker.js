// Nome della cache per le risorse dell'app
// HO AGGIUNTO UN NUOVO NUMERO DI VERSIONE (V3) per forzare il Service Worker a reinstallarsi e cachare la NUOVA icona.
const CACHE_NAME = 'fitness-tracker-v3'; 

// Risorse essenziali da mettere in cache.
const urlsToCache = [
    './', // Riferimento alla root (index.html)
    './index.html',
    './manifest.json',
    './icon.png' // L'ICONA PERSONALIZZATA DEVE ESSERE CACHATA
    // Non serve mettere in cache service-worker.js
];

/**
 * Evento: Installazione
 * Eseguito quando il Service Worker viene installato per la prima volta.
 */
self.addEventListener('install', (event) => {
    // Apriamo una cache e aggiungiamo tutti i file essenziali
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker installato. File in pre-cache.');
                return cache.addAll(urlsToCache);
            })
    );
});

/**
 * Evento: Fetch (Richieste di Rete)
 * Eseguito per intercettare tutte le richieste di rete dall'app.
 */
self.addEventListener('fetch', (event) => {
    // Cerchiamo la risorsa prima nella cache.
    // Se non la troviamo, andiamo in rete.
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Trovato in cache, lo restituiamo immediatamente.
                if (response) {
                    return response;
                }

                // Non trovato, facciamo il fetch in rete.
                return fetch(event.request);
            })
            // Aggiungiamo un fallback per il debug se il fetch fallisce
            .catch(error => {
                console.error('Fetch fallito, Service Worker non ha trovato risorse.', error);
            })
    );
});

/**
 * Evento: Attivazione
 * Eseguito dopo l'installazione; pulisce le vecchie cache.
 */
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Cancella le vecchie cache (pulizia)
                        console.log('Service Worker: Eliminazione vecchia cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // Assicuriamo che la pagina sia controllata dal nuovo service worker
    event.waitUntil(self.clients.claim());
});