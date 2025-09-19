import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Share2, Landmark, Users, CalendarDays } from 'lucide-react';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import parqueImg from '../../assets/ParqueGps.jpg';
import { createClient } from "@supabase/supabase-js";

// --- El resto de tu configuración y lógica permanece igual ---
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
// Utilidad para calcular distancias (Haversine)
const haversineMeters = (a, b) => {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371000; // m
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);
  const lat1 = toRad(a[1]);
  const lat2 = toRad(b[1]);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

// Puntos de Interés (POIs) con radio de cercanía
const POIS = [
  {
    id: "la-venta",
    nombre: "Parque Museo La Venta",
    coords: [-92.93410087912596, 18.001935869415224],
    radio: 250,
    mensaje: "¡Estás cerca del Parque Museo La Venta! 🗿",
    
  },
    {
    id: "prueba-coords",
    nombre: "Sitio de prueba",
    coords: [-92.89925, 18.02468], // [lng, lat]
    radio: 120, // metros
    mensaje: "¡Estás cerca del Sitio de prueba! 📍",
  },

];

// Eventos (mock para probar)
const EVENTOS = [
  {
    id: "feria-queso",
    titulo: "Feria del Queso",
    inicia: new Date("2025-08-10T16:00:00-06:00").getTime(),
    categoria: "gastronomía",
    coords: [-92.9302, 17.9892],
  },
  {
    id: "taller-chocolate",
    titulo: "Taller de Chocolate",
    inicia: new Date("2025-08-10T18:00:00-06:00").getTime(),
    categoria: "taller",
    coords: [-92.9231, 17.9855],
  },
    {
    id: "evento-prueba",
    titulo: "Evento de Prueba",
    inicia: Date.now() + 10 * 60 * 1000, // empieza en ~10 minutos
    categoria: "taller",                 // coincide con INTERESES_USUARIO
    coords: [-92.89925, 18.02468],
  },

];

// Intereses del usuario (conecta esto a tu selector si ya lo tienes)
const INTERESES_USUARIO = new Set(["gastronomía", "taller"]);

export default function PuntosCercanos() {
  const viewerChannelRef = useRef(null);
  const viewerSelfMarkerRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mapContainer = useRef(null);
  const userMarker = useRef(null);
  const map = useRef(null);
  const [imagenPanel, setImagenPanel] = useState(null);
  const [tituloPanel, setTituloPanel] = useState("Zonas culturales");
  const [nombreActor, setNombreActor] = useState("Parque Museo La Venta");
  const [descripcionActor, setDescripcionActor] = useState("Museo al aire libre con cabezas de piedra y altares antiguos. Abierto 8:00–16:00 h.");
  const [tituloCiudad, setTituloCiudad] = useState("Villahermosa");
  const [descCiudad, setDescCiudad] = useState("Villahermosa es la capital del estado mexicano de Tabasco, destacada por su gran cantidad de atracciones: museos, parques ecológicos, ríos, cultura y gastronomía.");
  const [linkActor, setLinkActor] = useState(null);
  const [notifTestReady, setNotifTestReady] = useState(false);
  const userCoordsRef = useRef(null);
  const liveChannelRef = useRef(null);
  const liveSessionIdRef = useRef(null);
  const liveExpiryRef = useRef(null);
  const liveTimeoutRef = useRef(null);
  const [artesanos, setArtesanos] = useState([]);
  const markerLaVentaRef = useRef(null);
  // cerca de otros refs:
const liveWatchIdRef = useRef(null);
const markerMariaRef = useRef(null);

useEffect(() => {
  // Activa el botón cuando el mapa esté listo o al montar
  setNotifTestReady(true);
}, []);

const probarNotificacion = async () => {
  await notificar("Prueba de notificación", "¡Funciona! 🎉");
};

 const focusLaVenta = () => {
   if (!map.current || !markerLaVentaRef.current) return;
   // Centrar y hacer zoom al marcador
   const ll = markerLaVentaRef.current.getLngLat();
   map.current.flyTo({ center: ll, zoom: 16 });
   // Disparar el mismo comportamiento del click en el marcador
   markerLaVentaRef.current.getElement().dispatchEvent(new Event("click"));
 };
 const focusMaria = () => {
  if (!map.current || !markerMariaRef.current) return;
  const ll = markerMariaRef.current.getLngLat();
  map.current.flyTo({ center: ll, zoom: 16 });
  markerMariaRef.current.getElement().dispatchEvent(new Event("click"));
};
const markerMatildeRef = useRef(null);

const focusMatilde = () => {
  if (!map.current || !markerMatildeRef.current) return;
  const ll = markerMatildeRef.current.getLngLat();
  map.current.flyTo({ center: ll, zoom: 16 });
  markerMatildeRef.current.getElement().dispatchEvent(new Event("click"));
};


  // Refs para notificaciones y control anti-spam
const notifPermPromiseRef = useRef(null);
const proximidadesDisparadasRef = useRef(new Set());
const eventosNotificadosRef = useRef(new Set());

// Pide permiso de notificaciones (solicitado 1 sola vez)
const solicitarPermisosNotificaciones = async () => {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  if (!notifPermPromiseRef.current) {
    notifPermPromiseRef.current = Notification.requestPermission();
  }
  const res = await notifPermPromiseRef.current;
  return res === "granted";
};

// Helper de notificaciones: SIEMPRE vía Service Worker en móvil (con diagnóstico)
const notificar = async (titulo, cuerpo) => {
  const ok = await solicitarPermisosNotificaciones();
  if (!ok) {
    alert("Permiso de notificaciones NO concedido");
    return;
  }

  const opts = {
    body: cuerpo,
    tag: "poi-evento-test",
    renotify: true,
    icon: "/icon-192.png",
    // badge: "/badge-72.png",
  };

  if (!("serviceWorker" in navigator)) {
    alert("Este navegador no soporta Service Worker");
    return;
  }

  try {
    const reg = await navigator.serviceWorker.ready;
    if (!reg || !reg.active) {
      alert("Service Worker no está activo aún. Intenta recargar la página.");
      return;
    }
    await reg.showNotification(titulo, opts);
    console.log("[notificar] showNotification OK");
  } catch (e) {
    console.error("[notificar] error en showNotification:", e);
    alert("Error en showNotification:\n" + (e?.message || JSON.stringify(e)));
  }
};


// Checar cercanía a POIs
const checarPOIsCercanos = async (userCoords) => {
  for (const poi of POIS) {
    const d = haversineMeters(userCoords, poi.coords);
    const key = `poi:${poi.id}`;
    const inside = d <= poi.radio;
    const wasInside = proximidadesDisparadasRef.current.has(key);

    if (inside && !wasInside) {
      proximidadesDisparadasRef.current.add(key);
      notificar("Lugar cercano", poi.mensaje);
    }
    if (!inside && wasInside) {
      proximidadesDisparadasRef.current.delete(key);
    }
  }
};


// Checar eventos próximos (tiempo y cercanía)
const checarEventosProximos = async (userCoords) => {
  const ahora = Date.now();
  const ventanaMs = 90 * 60 * 1000;

  for (const ev of EVENTOS) {
    if (!INTERESES_USUARIO.has(ev.categoria)) continue;

    const cerca = haversineMeters(userCoords, ev.coords) <= 1500;
    const pronto = ev.inicia >= ahora && ev.inicia <= ahora + ventanaMs;

    const key = `ev:${ev.id}`;
    const inside = cerca && pronto;
    const wasInside = eventosNotificadosRef.current.has(key);

    if (inside && !wasInside) {
      eventosNotificadosRef.current.add(key);
      const minutos = Math.round((ev.inicia - ahora) / 60000);
      notificar("Evento próximo", `${ev.titulo} comienza en ~${minutos} min cerca de ti`);
    }
    if (!inside && wasInside) {
      eventosNotificadosRef.current.delete(key);
    }
  }
};

// --- COMPARTIR UBICACIÓN (pegar debajo de checarEventosProximos) ---
const compartirUbicacion = async () => {
  const coords = userCoordsRef.current;
  if (!coords) {
    alert("Aún no tengo tu ubicación. Espera un momento y vuelve a intentar.");
    return;
  }
  const [lng, lat] = coords;
  const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  const texto = `Esta es mi ubicación ahora mismo: ${lat.toFixed(6)}, ${lng.toFixed(6)}\n${mapsUrl}`;

  try {
    // Web Share API si está disponible
    if (navigator.share && (await navigator.canShare?.({ text: texto }))) {
      await navigator.share({
        title: "Mi ubicación en tiempo real",
        text: texto,
        url: mapsUrl
      });
    } else if (navigator.clipboard?.writeText) {
      // Copiar al portapapeles como fallback
      await navigator.clipboard.writeText(texto);
      alert("Link de ubicación copiado al portapapeles ✅");
    } else {
      // Fallback básico
      prompt("Copia este link de ubicación:", texto);
    }
  } catch (e) {
    console.error("Error al compartir:", e);
    alert("No se pudo compartir. Intenta nuevamente.");
  }
};

const stopLiveShare = async (silent = false) => {
  try {
    if (liveTimeoutRef.current) {
      clearTimeout(liveTimeoutRef.current);
      liveTimeoutRef.current = null;
    }
    if (liveChannelRef.current) {
      await liveChannelRef.current.unsubscribe();
      liveChannelRef.current = null;
    }
    liveSessionIdRef.current = null;
    liveExpiryRef.current = null;
    if (!silent) alert("Dejaste de compartir tu ubicación.");
  } catch (e) {
    console.error("stopLiveShare error:", e);
  }
};

const startLiveShare10m = async () => {
  // si ya hay una sesión anterior, ciérrala
  if (liveChannelRef.current) await stopLiveShare(true);

  const sessionId = crypto.randomUUID();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 min

  // Crea canal
  const channel = supabase.channel(`live-${sessionId}`, {
    config: { broadcast: { ack: true } },
  });
  await channel.subscribe();

  liveChannelRef.current = channel;
  liveSessionIdRef.current = sessionId;
  liveExpiryRef.current = expiresAt;

  // arma el link del viewer (misma página con query)
  const url = new URL(window.location.href);
  url.searchParams.set("sid", sessionId);
  url.searchParams.set("exp", String(expiresAt));
  const shareUrl = url.toString();

  // Generar link de Google Maps con posición actual
let mapsUrl = "";
if (userCoordsRef.current) {
  const [lng, lat] = userCoordsRef.current;
  mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
}

// Texto con ambos enlaces
const texto = `Sigue mi ubicación en vivo por 10 minutos:\n${shareUrl}\n${mapsUrl}`;

  try {
if (navigator.share && (await navigator.canShare?.({ text: texto }))) {
  await navigator.share({ title: "Ubicación en vivo (10 min)", text: texto });
} else if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link de seguimiento copiado ✅ (válido por 10 minutos)");
    } else {
      prompt("Copia este link de seguimiento (10 min):", shareUrl);
    }
  } catch (e) {
    console.error("share error:", e);
  }

  // programar auto-cierre
  liveTimeoutRef.current = setTimeout(() => {
    stopLiveShare(true);
    alert("El enlace de seguimiento expiró (10 min).");
  }, expiresAt - Date.now());
};

// por si cierran la pestaña
useEffect(() => {
  const onUnload = () => stopLiveShare(true);
  window.addEventListener("beforeunload", onUnload);
  return () => window.removeEventListener("beforeunload", onUnload);
}, []);


useEffect(() => {
  // lee query params al inicio del efecto
  const params = new URLSearchParams(window.location.search);
  map.current = new mapboxgl.Map({
    container: mapContainer.current,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-92.9302, 17.9892],
    zoom: 13,
    attributionControl: false,
  });
notificar("Bienvenido", "Has entrado a Pueblos de Ensueño 🎉");
  // 1. MARCADOR FIJO
const markerCoords = [-92.93410087912596, 18.001935869415224];
const markerFijo = new mapboxgl.Marker({ color: "#1E88E5" })
  .setLngLat(markerCoords)
  .setPopup(new mapboxgl.Popup().setText("Parque Museo La Venta"))
  .addTo(map.current);
  markerLaVentaRef.current = markerFijo;
  // si llegan con ?goto=la-venta, enfoca ese marcador
const goto = params.get("goto");
if (goto === "la-venta") {
  focusLaVenta();
}
// --- MARÍA LUCIANO CRUZ (Artesana en Nacajuca) ---
const mariaLL = [-93.01, 18.2026667]; // [lng, lat]
const markerMaria = new mapboxgl.Marker({ color: "#2E7D32" })
  .setLngLat(mariaLL)
  .setPopup(new mapboxgl.Popup().setText("María Luciano Cruz — Cestería de palma"))
  .addTo(map.current);

// guarda referencia para focusMaria()
markerMariaRef.current = markerMaria;

// Al hacer click en su pin, actualiza el panel derecho
markerMaria.getElement().addEventListener("click", () => {
  setTituloPanel("Artesanos");
  setNombreActor("María Luciano Cruz");
  setDescripcionActor("Cestería de palma · 09:00–17:00 · $120–$400 MXN");
  setTituloCiudad("Nacajuca");
  setDescCiudad("Zona chontal con rica cultura, tradiciones y artesanías.");
  setImagenPanel(null);
  setLinkActor(null);
});
// --- MATILDE DE LA CRUZ ESTEBAN ---
const matildeLL = [-93.0121334948471, 18.211434390766073]; // [lng, lat]
const markerMatilde = new mapboxgl.Marker({ color: "#2E7D32" })
  .setLngLat(matildeLL)
  .setPopup(new mapboxgl.Popup().setText("Matilde de la Cruz Esteban — Sombreros y cestería"))
  .addTo(map.current);
markerMatildeRef.current = markerMatilde;

markerMatilde.getElement().addEventListener("click", () => {
  setTituloPanel("Artesanos");
  setNombreActor("Matilde de la Cruz Esteban");
  setDescripcionActor("Sombreros y cestería · 09:00–18:00 · $120–$900 MXN");
  setTituloCiudad("Nacajuca");
  setDescCiudad("Zona chontal con rica cultura, tradiciones y artesanías.");
  setImagenPanel(null);
  setLinkActor(null);
});


// --- Coordenadas por query (?lat=...&lng=...&label=...) ---
const latParam = parseFloat(params.get("lat"));
const lngParam = parseFloat(params.get("lng"));
const labelParam = params.get("label") || "Ubicación";
const hasQueryTarget = !Number.isNaN(latParam) && !Number.isNaN(lngParam);


if (!Number.isNaN(latParam) && !Number.isNaN(lngParam)) {
  const ll = [lngParam, latParam];
  const markerArtesano = new mapboxgl.Marker({ color: "#2E7D32" })
    .setLngLat(ll)
    .setPopup(new mapboxgl.Popup().setText(labelParam))
    .addTo(map.current);

  map.current.flyTo({ center: ll, zoom: 16 });
}



  const markerPrueba = new mapboxgl.Marker({ color: "#E91E63" })
  .setLngLat([-92.89925, 18.02468])
  .setPopup(new mapboxgl.Popup().setText("Sitio de prueba"))
  .addTo(map.current);

  markerPrueba.getElement().addEventListener("click", () => {
  setTituloPanel("Actores y eventos");
  setNombreActor("Sitio de prueba");
  setDescripcionActor("Explora este punto de interés.");
  setTituloCiudad("Villahermosa");
  setDescCiudad("...");
  setImagenPanel(null);
  setLinkActor(null);

  // ❇️ Oculta “Artesanos”
  setArtesanos([]);
});


// Cuando se haga click en el marcador, actualiza el estado
markerFijo.getElement().addEventListener("click", () => {
  setImagenPanel(parqueImg);
  setTituloPanel("Zonas culturales");
  setDescripcionActor("Escultura olmeca");
  setTituloCiudad("Museo La Venta");
  setDescCiudad("Museo al aire libre con cabezas de piedra y altares antiguos, así como un zoológico con jaguares y más.\n El parque esta abierto de 8:00 a 16:00 hrs.\nEl costo es el siguiente:\nEntrada general: $40.00 \nNacionales: $35.00 \nEstudiantes $10.00 \nNiños hasta 5 años: Sin costo \nNiños de 6 a 10 años: $10.00");
  setLinkActor("/monumento/cabeza-olmeca");
  setNombreActor("Monumento a la Cabeza Olmeca");
  setDescripcionActor("Escultura olmeca — información y detalles");
 setArtesanos([
   {
     nombre: "César Augusto Reynosa Reyes",
     descripcion: "Bisutería de madera artesanal — 10:00 a 18:00 · $70–$300 MXN",
     link: "/productos-tabasco",
     municipio: "Centro"       // ← lo usaremos para pasar el estado al Link
   }
 ]);
});
// 2. GEOLOCALIZACIÓN USUARIO (como antes)
const sid = params.get("sid");
const expParam = params.get("exp");
const isViewer = !!sid;

let viewerWatchId;
if (!isViewer && navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userCoords = [position.coords.longitude, position.coords.latitude];
      userCoordsRef.current = userCoords;

      // crea el marcador si no existe
      if (!userMarker.current) {
        userMarker.current = new mapboxgl.Marker({ color: "#FF5733" })
          .setLngLat(userCoords)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText("Tu ubicación actual"))
          .addTo(map.current);
      } else {
        userMarker.current.setLngLat(userCoords);
      }

      // centra SOLO si NO venías con destino (?lat/lng) ni con ?goto=la-venta
      const fromGoto = new URLSearchParams(window.location.search).get("goto");
      if (fromGoto !== "la-venta" && !hasQueryTarget) {
        map.current.flyTo({ center: userCoords, zoom: 14 });
      }

      // si quieres checar POIs/eventos solo una vez (no en tiempo real):
      checarPOIsCercanos(userCoords);
      checarEventosProximos(userCoords);
    },
    (error) => {
      console.error("No se pudo obtener la ubicación:", error);
    },
    { enableHighAccuracy: true, maximumAge: 60000, timeout: 10000 }
  );
}


// --- MODO VIEWER: si hay sid en la URL, suscríbete al canal y muestra el pin remoto
(async () => {
  if (!sid) return;                           // ✅ valida que exista sid

  const expMs = Number(expParam || "0");      // ✅ define expMs
  const now = Date.now();                     // ✅ define now
  if (expMs && now > expMs) {                 // ✅ aborta si ya expiró
    alert("Este enlace de seguimiento ya expiró.");
    return;
  }

  const ch = supabase.channel(`live-${sid}`, { config: { broadcast: { ack: true } } });
  await ch.subscribe();
  viewerChannelRef.current = ch;
// 👤 Mostrar también la ubicación del receptor (viewer)
if (navigator.geolocation) {
  viewerWatchId = navigator.geolocation.watchPosition(
    (pos) => {
      const myLL = [pos.coords.longitude, pos.coords.latitude];
      if (!viewerSelfMarkerRef.current) {
        viewerSelfMarkerRef.current = new mapboxgl.Marker({ color: "#9C27B0" }) // morado
          .setLngLat(myLL)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText("Mi ubicación"))
          .addTo(map.current);
      } else {
        viewerSelfMarkerRef.current.setLngLat(myLL);
      }
    },
    (err) => console.warn("No se pudo obtener ubicación del viewer:", err),
    { enableHighAccuracy: true }
  );
}

const followerMarker = new mapboxgl.Marker({ color: "#2962FF" });
ch.on("broadcast", { event: "loc" }, (msg) => {
  const { lat, lng, exp } = msg.payload || {};
  if (typeof lat !== "number" || typeof lng !== "number") return;
  const ll = [lng, lat];
  followerMarker.setLngLat(ll).addTo(map.current);
  map.current.flyTo({ center: ll, zoom: 15 });
  if (exp && Date.now() > exp) {
    alert("El seguimiento terminó.");
    ch.unsubscribe();
    viewerChannelRef.current = null;
  }
});

// cortar por tiempo aunque no lleguen más eventos
if (expMs) {
  setTimeout(() => {
    alert("El seguimiento terminó.");
    ch.unsubscribe();
    viewerChannelRef.current = null;
  }, expMs - now);
}
})();


return () => {
  if (viewerWatchId) navigator.geolocation.clearWatch(viewerWatchId);

  if (liveWatchIdRef.current) {
    navigator.geolocation.clearWatch(liveWatchIdRef.current);
    liveWatchIdRef.current = null;
  }

  if (viewerChannelRef.current) {
    viewerChannelRef.current.unsubscribe();
    viewerChannelRef.current = null;
  }

  stopLiveShare(true);
  map.current.remove();
};

}, []);

  return (
    <div className="text-zinc-800">
      {/* Mapa + Panel lateral */}
      <div className="flex flex-col md:flex-row w-full h-screen bg-white overflow-hidden">
        
        {/* Mapa */}
        <div className="relative flex-1 h-1/2 md:h-full">
          <div ref={mapContainer} className="w-full h-full" />
          <div className="absolute bottom-6 right-6 z-10">
            <button 
                onClick={startLiveShare10m} 
                className="flex items-center gap-3 px-5 py-3 bg-orange-500 text-white font-bold rounded-full shadow-2xl hover:bg-orange-600 transition-all transform hover:scale-105"
            >
                <Share2 size={22} />
                <span>Compartir por 10 min</span>
            </button>
          </div>
        </div>
        
        {/* ▼▼▼ INICIA PANEL LATERAL MODIFICADO ▼▼▼ */}
        <div className="w-full md:w-[420px] border-l border-gray-200 bg-slate-50 flex flex-col h-1/2 md:h-full">
          
          {/* --- Cabecera Fija (no se desplaza) --- */}
          <div className="p-4 md:p-6 flex-shrink-0 border-b border-slate-200">
            <h1 className="text-2xl font-bold mb-1 text-gray-800">{tituloCiudad}</h1>
            <p className="text-sm text-gray-600">
              {descCiudad.split('\n').map((linea, i) => (
                  <span key={i}>{linea}<br /></span>
              ))}
            </p>
          </div>
          
          {/* --- Contenedor con Scroll --- */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {imagenPanel && (
              <div className="mb-6 rounded-lg overflow-hidden shadow-md">
                  <img
                  src={imagenPanel}
                  alt="Imagen del marcador"
                  className="w-full h-48 object-cover"
                  />
              </div>
            )}

            {/* --- Lista de Secciones --- */}
            <div className="space-y-6">
              
              {/* --- Sección: Zonas Culturales --- */}
              <div>
                <h3 className="flex items-center gap-3 text-lg font-bold text-zinc-700 mb-3 border-b pb-2">
                  <Landmark size={20} className="text-orange-500" />
                  <span>{tituloPanel}</span>
                </h3>
                <ul className="space-y-2">
                  <li>
                    <button onClick={focusLaVenta} className="w-full text-left p-3 bg-white rounded-lg shadow-sm border border-transparent hover:border-orange-400 hover:bg-orange-50 transition-all group">
                      <p className="font-semibold text-zinc-800 group-hover:text-orange-600">
                        {linkActor ? <Link to={linkActor}>{nombreActor}</Link> : nombreActor}
                      </p>
                      <p className="text-xs text-zinc-500">{descripcionActor}</p>
                    </button>
                  </li>
                  {/* Si hay artesanos asociados a la zona cultural, se muestran aquí */}
                  {artesanos.map((a, idx) => (
                      <li key={idx} className="ml-4">
                          <Link to={a.link} state={a.municipio ? { municipio: a.municipio } : undefined} className="block w-full text-left p-3 bg-white rounded-lg shadow-sm border border-transparent hover:border-emerald-400 hover:bg-emerald-50 transition-all group">
                              <p className="font-semibold text-sm text-emerald-800 group-hover:text-emerald-600">{a.nombre}</p>
                              <p className="text-xs text-zinc-500">{a.descripcion}</p>
                          </Link>
                      </li>
                  ))}
                </ul>
              </div>

              {/* --- Sección: Artesanos --- */}
              <div>
                <h3 className="flex items-center gap-3 text-lg font-bold text-zinc-700 mb-3 border-b pb-2">
                  <Users size={20} className="text-orange-500" />
                  <span>Artesanos</span>
                </h3>
                <ul className="space-y-2">
                  <li>
                    <button onClick={focusMaria} className="w-full text-left p-3 bg-white rounded-lg shadow-sm border border-transparent hover:border-orange-400 hover:bg-orange-50 transition-all group">
                      <p className="font-semibold text-zinc-800 group-hover:text-orange-600">María Luciano Cruz</p>
                      <p className="text-xs text-zinc-500">Cestería de palma · Nacajuca · 09:00–17:00</p>
                    </button>
                  </li>
                  <li>
                    <button onClick={focusMatilde} className="w-full text-left p-3 bg-white rounded-lg shadow-sm border border-transparent hover:border-orange-400 hover:bg-orange-50 transition-all group">
                      <p className="font-semibold text-zinc-800 group-hover:text-orange-600">Matilde de la Cruz Esteban</p>
                      <p className="text-xs text-zinc-500">Sombreros y cestería · Nacajuca · 09:00–18:00</p>
                    </button>
                  </li>
                </ul>
              </div>

              {/* --- Sección: Eventos Culturales --- */}
              <div>
                <h3 className="flex items-center gap-3 text-lg font-bold text-zinc-700 mb-3 border-b pb-2">
                  <CalendarDays size={20} className="text-orange-500" />
                  <span>Eventos Culturales</span>
                </h3>
                <ul className="space-y-2">
                  <li className="p-3 bg-white rounded-lg shadow-sm">
                    <p className="font-semibold text-zinc-800">Feria del Queso</p>
                    <p className="text-xs text-zinc-500">Ubicación: 17.9892, -92.9302</p>
                  </li>
                  <li className="p-3 bg-white rounded-lg shadow-sm">
                    <p className="font-semibold text-zinc-800">Taller de Chocolate</p>
                    <p className="text-xs text-zinc-500">Ubicación: 17.9855, -92.9231</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* ▲▲▲ FIN PANEL LATERAL MODIFICADO ▲▲▲ */}
      </div>
      {notifTestReady && <></>}
    </div>
  );
}