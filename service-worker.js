// Nome della cache per questa versione dell'app
const CACHE_NAME = 'fitness-tracker-v1';

// File essenziali da pre-caricare nella cache
// Il tuo unico file HTML è l'elemento fondamentale.
const urlsToCache = [
    './',
    'index.html',
    'manifest.json',
    'https://cdn.tailwindcss.com', // Tailwind CSS
    'https://unpkg.com/lucide@latest' // Icone Lucide
];

// Evento di installazione: memorizza tutti i file essenziali
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Evento fetch: intercetta le richieste e serve dalla cache se possibile
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Ritorna la risorsa dalla cache se presente
                if (response) {
                    return response;
                }
                // Altrimenti, prosegui con la richiesta di rete
                return fetch(event.request);
            })
    );
});

// Evento di attivazione: pulizia delle vecchie cache
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});