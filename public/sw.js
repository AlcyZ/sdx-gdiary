self.addEventListener("install", (event) => {
    console.log("Service Worker installiert");
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    console.log("Service Worker aktiviert");
    return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    // Einfacher Durchleitungsmodus: alles normal übers Netz laden
    event.respondWith(fetch(event.request));
});
