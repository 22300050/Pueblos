import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import logo from '../assets/Logo.png';
import parqueImg from '../assets/ParqueGps.jpg';
import { createClient } from "@supabase/supabase-js";


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

let watchId;
let viewerWatchId; 
if (!isViewer && navigator.geolocation) {   // ← añadimos !isViewer
  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const userCoords = [position.coords.longitude, position.coords.latitude];
userCoordsRef.current = userCoords;
if (liveChannelRef.current && liveSessionIdRef.current) {
      liveChannelRef.current.send({
        type: "broadcast",
        event: "loc",
        payload: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          ts: Date.now(),
          exp: liveExpiryRef.current,
        },
      });
    }
      if (!userMarker.current) {
        userMarker.current = new mapboxgl.Marker({ color: "#FF5733" })
          .setLngLat(userCoords)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText("Tu ubicación actual"))
          .addTo(map.current);
      } else {
        userMarker.current.setLngLat(userCoords);
      }

            // NUEVO: si NO venimos desde "mostrar en el mapa", entonces sí centramos al usuario
      const params = new URLSearchParams(window.location.search);
      const fromGoto = params.get("goto");
      if (fromGoto !== "la-venta") {
        map.current.flyTo({ center: userCoords, zoom: 14 });
      }

      // 🔔 Disparar alertas en tiempo real
      checarPOIsCercanos(userCoords);
      checarEventosProximos(userCoords);
    },
    (error) => {
      console.error("No se pudo obtener la ubicación:", error);
    },
    { enableHighAccuracy: true }
    
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
        viewerSelfMarkerRef.current = new mapboxgl.Marker({ color: "#9C27B0" }) // morado para el receptor
          .setLngLat(myLL)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setText("Mi ubicación"))
          .addTo(map.current);
      } else {
        viewerSelfMarkerRef.current.setLngLat(myLL);
      }
      // Nota: no publicamos coords del viewer; solo se muestran en su mapa.
    },
    (err) => {
      console.warn("No se pudo obtener ubicación del viewer:", err);
    },
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
  if (watchId) navigator.geolocation.clearWatch(watchId);
if (viewerWatchId) navigator.geolocation.clearWatch(viewerWatchId);

  if (viewerChannelRef.current) {
    viewerChannelRef.current.unsubscribe();
    viewerChannelRef.current = null;
  }

  stopLiveShare(true);
  map.current.remove();
};



}, []);
  return (
    <div className="text-[var(--color-text)]">
      {/* Header igual a Home.jsx */}
      <header className="sticky top-0 z-50 w-full py-4 px-6 flex justify-between items-center bg-[var(--color-primary)] shadow-md">
<Link to="/" className="flex items-center gap-4">
  <img src={logo} alt="Pueblos de Ensueño - Logotipo" className="h-10 sm:h-12 w-auto" />
  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide drop-shadow-md text-black">
    Pueblos de Ensueño
  </h1>
</Link>

<nav className="hidden md:flex gap-3 lg:gap-5 items-center">
  <Link to="/mapa">
    <button className="px-4 py-2 bg-[var(--orange-250)] hover:bg-[var(--color-secondary)] text-black rounded-full font-semibold shadow-sm transition">
      Mapa Interactivo
    </button>
  </Link>

  <button
    onClick={startLiveShare10m}
    className="px-4 py-2 bg-[var(--orange-250)] hover:bg-[var(--color-secondary)] text-black rounded-full font-semibold shadow-sm transition"
  >
    Compartir ubicación en tiempo real
  </button>
</nav>

        <button className="block md:hidden text-gray-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Nav */}
{/* Mobile Nav */}
{mobileMenuOpen && (
  <nav className="md:hidden bg-[var(--orange-250)] shadow-md px-6 py-4 space-y-2">
    <Link to="/mapa" onClick={() => setMobileMenuOpen(false)}>
      <button className="w-full px-4 py-2 bg-[var(--orange-250)] rounded-lg font-semibold transition">
        Mapa Interactivo
      </button>
    </Link>

    <button
      onClick={() => {
        setMobileMenuOpen(false);
        startLiveShare10m();
      }}
      className="w-full px-4 py-2 bg-[var(--orange-250)] rounded-lg font-semibold transition"
    >
      Compartir ubicación en tiempo real
    </button>
  </nav>
)}



      {/* Mapa + Panel lateral */}
      <div className="flex flex-col md:flex-row w-full min-h-[100dvh] bg-white">
  {/* Mapa */}
 <div className="flex-1 md:h-auto">
   <div ref={mapContainer} className="w-full h-[45vh] md:h-full" />
 </div>
        

        {/* Panel lateral */}
        <div className="w-full md:w-[420px] p-4 md:p-6 overflow-y-auto border-l border-gray-300 bg-gray-50 shadow-inner max-h-[55vh] md:max-h-none">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">{tituloCiudad}</h1>

          {/* Filtros 
          <div className="flex flex-wrap gap-2 mb-4">
            <button className="bg-gray-300 text-black px-4 py-1 rounded shadow text-sm hover:bg-gray-400">Mostrar todos</button>
            <button className="bg-purple-600 text-white px-4 py-1 rounded shadow text-sm hover:bg-purple-700">Artesanos</button>
            <button className="bg-indigo-600 text-white px-4 py-1 rounded shadow text-sm hover:bg-indigo-700">Monumentos</button>
          </div> 
*/}
          {/* Descripción */}
<p className="text-sm text-gray-600 mb-4">
  {descCiudad.split('\n').map((linea, i) => (
    <span key={i}>{linea}<br /></span>
  ))}
</p>


          {imagenPanel && (
  <div className="mb-4">
    <img
      src={imagenPanel}
      alt="Imagen del marcador"
      className="rounded shadow-md w-full"
      style={{ maxHeight: 220, objectFit: "cover" }}
    />
  </div>
)}


          {/* Lista ejemplo */}
          <div className="mt-6 text-sm bg-blue-50 text-blue-900 p-3 rounded space-y-4">
            <h2 className="text-lg font-bold text-center">📍 {tituloPanel}</h2>
            <ul className="space-y-2">
<li className="cursor-pointer bg-white border rounded px-3 py-2 shadow-sm hover:bg-green-100">
  {linkActor ? (
    // Cuando haya linkActor (ej. al hacer click en el marcador del museo),
    // el nombre mostrará un Link a esa ruta (monumento a la cabeza olmeca)
    <Link to={linkActor} className="text-blue-800 font-bold underline">
      {nombreActor}
    </Link>
  ) : (
    // Cuando NO haya linkActor (estado inicial “Parque Museo La Venta”),
    // el nombre funciona como botón para centrar / abrir el marcador
    <button
      onClick={focusLaVenta}
      className="text-blue-800 font-bold underline"
      aria-label="Centrar mapa en Parque Museo La Venta"
    >
      {nombreActor}
    </button>
  )}
  <br />
  <span className="text-gray-700">{descripcionActor}</span>
</li>

{artesanos.length > 0 && (
  <>
    <li className="border-t border-blue-300 pt-3 mt-3">
      <h3 className="text-center text-blue-900 text-sm font-semibold">🧵 Artesanos</h3>
    </li>
    {artesanos.map((a, idx) => (
      <li
        key={idx}
        className="cursor-pointer bg-white border rounded px-3 py-2 shadow-sm hover:bg-purple-100"
      >
        {a.link ? (
           <Link
   to={a.link}
   state={a.municipio ? { municipio: a.municipio } : undefined}
   className="text-blue-800 font-bold underline"
 >
            {a.nombre}
          </Link>
        ) : (
          <strong>{a.nombre}</strong>
        )}
        <br />
        <span className="text-gray-700">{a.descripcion}</span>
      </li>
    ))}
  </>
)}



              <li className="border-t border-blue-300 pt-3 mt-3">
                <h3 className="text-center text-blue-900 text-sm font-semibold">🎉 Eventos culturales</h3>
              </li>
              <li className="cursor-pointer bg-white border rounded px-3 py-2 shadow-sm hover:bg-yellow-100">
                <strong>Feria del Queso</strong><br />
                <span className="text-gray-600">Ubicación: 17.9892, -92.9302</span>
              </li>
              <li className="cursor-pointer bg-white border rounded px-3 py-2 shadow-sm hover:bg-yellow-100">
                <strong>Taller de Chocolate</strong><br />
                <span className="text-gray-600">Ubicación: 17.9855, -92.9231</span>
              </li>
            </ul>
  </div>
          </div>
        </div>
{notifTestReady && (
  <>
  </>
)}
      </div>
  );
}
