// public/sw.js

self.addEventListener("install", (event) => {
  console.log("✅ Service Worker instalado");
  self.skipWaiting(); // activa inmediatamente
});

self.addEventListener("activate", (event) => {
  console.log("✅ Service Worker activado");
  return self.clients.claim();
});

// Opcional: manejo de peticiones (aquí lo dejamos vacío)
self.addEventListener("fetch", (event) => {
  // console.log("Interceptando:", event.request.url);
});

// Manejo de notificaciones push (si en el futuro quieres usarlo)
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "📢 Notificación";
  const body = data.body || "Tienes una nueva alerta";
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icon-192.png", // asegúrate de tener este ícono en /public
    })
  );
});
