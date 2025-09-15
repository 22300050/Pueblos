import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import logo from '../assets/Logo.png';
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { getSelecciones, removeSeleccion } from '../utils/itinerarioStore';
import { Link } from "react-router-dom";



 const iconoPorTipo = (tipo) => {
   if (tipo === 'evento') return '🎉';
   if (tipo === 'artesania') return '🧺';
   if (tipo === 'gastronomia') return '🍽️';
   if (tipo === 'taller') return '🎓';
   if (tipo === 'lugar' || tipo === 'sitio') return '📍';
   return '🎯';
 };


function Itinerario() {
  const { state } = useLocation();
  const navigate = useNavigate();
const [editDiaIdx, setEditDiaIdx] = useState(null);
const modoEdicion = editDiaIdx !== null;
  const [mostrarModal, setMostrarModal] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalIndex, setModalIndex] = useState(null);
  const pdfRef = useRef(null);
  const [diasData, setDiasData] = useState([]);
  const [selecciones, setSelecciones] = useState([]);
  const [imagenModalTransporte, setImagenModalTransporte] = useState(null);
  const transportesSeleccionados = React.useMemo(() => selecciones.filter(s => s.tipo === 'transporte'), [selecciones]);
const PRESENTACION_PURA = false;
// Datos actuales del itinerario (state o localStorage)
const datosRef = React.useMemo(
  () => (state || JSON.parse(localStorage.getItem("itinerario") || "{}")),
  [state]
);
const estadoActual = (datosRef?.estado || "Tabasco").trim();

// Municipios activos (1 ó 2) según modo y payload
const municipiosActivos = React.useMemo(() => {
  const { origen, destino, modoDestino, lugarInicio } = datosRef || {};
  // Manual: dos municipios si están
  if (modoDestino === "manual" && origen && destino) {
    return [origen.trim(), destino.trim()];
  }
  // Automático: si vienen origen y destino distintos, usar ambos
  if (origen && destino && origen.trim() && destino.trim() && origen.trim() !== destino.trim()) {
    return [origen.trim(), destino.trim()];
  }
  // Si no, caer a uno (lugarInicio u origen)
  const uno = (lugarInicio || origen || "").trim();
  return uno ? [uno] : [];
}, [datosRef]);

  const etiquetaPorTipo = (t = "") => {
  switch (t) {
    case "lugar_destacado":
    case "lugarDestacado":
      return "Actividad (lugar destacado)";
    case "sitio_imperdible":
    case "sitioImperdible":
      return "Actividad (sitio imperdible)";
    case "joya_poco_conocida":
    case "joyaPocoConocida":
      return "Actividad (joya poco conocida)";
    case "evento":
    case "eventoCultural":
      return "Evento cultural" ;
    case "artesania":
    case "artesanias":
      return "Artesanías";
    case "taller":
    case "talleresEspaciosTematicos":
      return "Talleres y espacios temáticos";
    case "gastronomia":
    case "gastronomiaTipica":
      return "Gastronomía típica";
    default:
      return "Actividad";
  }
};

useEffect(() => {
  if (PRESENTACION_PURA) return;           // ⛔ no mezclar nada aquí
  if (selecciones.length === 0 || diasData.length === 0) return;

  const clon = diasData.map(d => ({ ...d, actividades: [...d.actividades] }));
  const mesViaje = (state || JSON.parse(localStorage.getItem("itinerario")) || {}).mes || "";

  // 1) Orden: primero eventos que coinciden con el mes, luego el resto
const esEventoMes = (s) =>
  (s.tipo === 'evento' || s.tipo === 'eventoCultural') &&
  mesViaje &&
  String(s.meta?.mes ?? s.meta?.fecha ?? "")
    .toLowerCase()
    .includes(String(mesViaje).toLowerCase());


const ordenadas = [...selecciones]
.filter(s => s.estado === estadoActual && municipiosActivos.includes(s.municipio) && s.tipo !== 'transporte')
  .sort((a, b) => {
    // prioriza eventos que coinciden con el mes, luego alfabético
    const aMes = esEventoMes(a);
    const bMes = esEventoMes(b);
    if (aMes !== bMes) return aMes ? -1 : 1;
    return (a.nombre || "").localeCompare(b.nombre || "", "es");
  });




  // 2) Reparto round-robin (manteniendo la prioridad arriba)
  ordenadas.forEach((it, idx) => {
    const dIdx = idx % clon.length;
clon[dIdx].actividades.push({
  titulo: it.nombre,
   tipo: it.tipo,
  icono: it.icono || iconoPorTipo(it.tipo),
  meta: { ...(it.meta || {}), source: (it.meta && it.meta.source) || 'MunicipioDetalle' }
  });
  });

  setDiasData(clon);
  // opcional: clearSelecciones();
}, [selecciones, diasData.length, state, municipiosActivos.length]);



useEffect(() => {
  // lee el municipio elegido desde el payload
const todas = getSelecciones() || [];
const propias = todas.filter(s => s.estado === estadoActual);
setSelecciones(
  municipiosActivos.length > 0
    ? propias.filter(s => municipiosActivos.includes(s.municipio))
    : propias
);



}, [state, municipiosActivos.length]);

  const [intereses, setIntereses] = useState([]);
  useEffect(() => {
  const datosPrevios = state || JSON.parse(localStorage.getItem("itinerario"));
  if (datosPrevios) {
    const actualizado = {
      ...datosPrevios,
      diasData,
    };
    localStorage.setItem("itinerario", JSON.stringify(actualizado));
  }
  const datos = state || JSON.parse(localStorage.getItem("itinerario"));
}, [diasData]);
const mapRef = useRef(null);
const markerRefs = useRef([]);
const mapContainerRef = useRef(null);
const [mapColapsado, setMapColapsado] = useState(false);

const [marcadores, setMarcadores] = useState(() => {
  const guardados = localStorage.getItem("marcadores");
  return guardados ? JSON.parse(guardados) : [];
});



  

useEffect(() => {
 const datos = state || JSON.parse(localStorage.getItem("itinerario"));
  if (!datos) { navigate("/"); return; }
const mesActivo = String(datos?.mes || "").toLowerCase();
const esEvento = (a) => a?.tipo === "evento" || a?.tipo === "eventoCultural";
const coincideMesAct = (a) => {
  const etiqueta = String(a?.meta?.mes ?? a?.meta?.fecha ?? "").toLowerCase();
  return mesActivo && etiqueta.includes(mesActivo);
};

const originales = Array.isArray(datos.diasData) ? datos.diasData : [];
const purgados = originales.map(d => ({
  ...d,
  actividades: (d.actividades || []).filter(a => a.tipo !== 'transporte' && (!esEvento(a) || coincideMesAct(a)))
}));

setDiasData(purgados);

  // intereses
const keyIntereses = estadoActual === "Chiapas"
  ? "interesesMunicipios_Chiapas"
  : "interesesMunicipios_Tabasco";
const interesesGuardados = JSON.parse(localStorage.getItem(keyIntereses) || "[]");
setIntereses(interesesGuardados);

}, [state, navigate]);

useEffect(() => {
  if (!mapContainerRef.current || mapRef.current) return;

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

  const map = new mapboxgl.Map({
    container: mapContainerRef.current,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [-92.9475, 17.9895],
    zoom: 7,
  });

  mapRef.current = map;

  //  Controles y resize como en Mapa
  map.addControl(new mapboxgl.NavigationControl(), 'top-right');
  map.once('load', () => map.resize());
  setTimeout(() => map.resize(), 0);

  map.on("click", (e) => {
    const nueva = { lat: e.lngLat.lat, lng: e.lngLat.lng };
    const nuevos = [...marcadores, nueva];
    setMarcadores(nuevos);
    localStorage.setItem("marcadores", JSON.stringify(nuevos));
  });

  // Cleanup completo
  return () => {
    if (map.getLayer('route')) map.removeLayer('route');
    if (map.getSource('route')) map.removeSource('route');
    map.remove();
    mapRef.current = null;
  };
}, []);



useEffect(() => {
  const map = mapRef.current;
  if (!map) return;

  //  Limpiar marcadores anteriores
  markerRefs.current.forEach((marker) => marker.remove());
  markerRefs.current = [];

  //  Agregar nuevos marcadores
  marcadores.forEach((pos) => {
    const marker = new mapboxgl.Marker()
      .setLngLat([pos.lng, pos.lat])
      .addTo(map);

    marker.getElement().addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const nuevos = marcadores.filter(
        (m) => m.lat !== pos.lat || m.lng !== pos.lng
      );
      setMarcadores(nuevos);
      localStorage.setItem("marcadores", JSON.stringify(nuevos));
    });

    markerRefs.current.push(marker); 
  });

  // Dibujar ruta si hay 2 o más puntos
  if (marcadores.length < 2) return;

  const coordinates = marcadores.map((p) => [p.lng, p.lat]);
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates
    .map((c) => c.join(","))
    .join(";")}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const route = data.routes[0].geometry;

if (map.getLayer("route")) {
  map.removeLayer("route");
}
if (map.getSource("route")) {
  map.removeSource("route");
}

      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: route,
        },
      });

      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#FF5733",
          "line-width": 4,
        },
      });
      
    })
    .catch((err) => console.error("Error generando ruta:", err));
}, [marcadores]);
useEffect(() => {
  const onEsc = (e) => e.key === 'Escape' && setMenuAbierto(false);
  window.addEventListener('keydown', onEsc);
  return () => window.removeEventListener('keydown', onEsc);
}, []);


  const handleEdit = (diaIdx, actIdx, titulo) => {
    const nuevos = [...diasData];
    nuevos[diaIdx].actividades[actIdx] = {
      titulo,
      icono: nuevos[diaIdx].actividades[actIdx]?.icono || "🎯",
    };
    setDiasData(nuevos);
    setModalIndex(null);
  };

// Abre el panel de selección al crear la actividad
const handleAgregar = (diaIdx) => {
  const nuevos = [...diasData];
  const nuevaActividad = { titulo: "Actividad nueva", icono: "🎯" };

  nuevos[diaIdx].actividades.push(nuevaActividad);
  setDiasData(nuevos);

  // abrir el selector apuntando a la nueva actividad
  const actIdx = nuevos[diaIdx].actividades.length - 1;
  setModalIndex({ diaIdx, actIdx });
};


  const handleEliminar = (diaIdx, actIdx) => {
    const nuevos = [...diasData];
    nuevos[diaIdx].actividades.splice(actIdx, 1);
    setDiasData(nuevos);
  };
  const moverActividad = (fromDia, actIdx, toDia) => {
  const next = [...diasData];
  const [item] = next[fromDia].actividades.splice(actIdx, 1);
  next[toDia].actividades.push(item);
  setDiasData(next);
};

const borrarSeleccionDefinitiva = (titulo) => {
  const sel = getSelecciones().find(s => s.nombre === titulo);
  if (sel) {
    removeSeleccion(sel.id);
    setSelecciones(getSelecciones());
  }
};


const exportarPDF = () => {
  if (!pdfRef.current) return;
  const opt = {
    margin: [8, 8, 12, 8],
    filename: 'itinerario.pdf',
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };
  html2pdf().set(opt).from(pdfRef.current).save();
};


const persistido = JSON.parse(localStorage.getItem("itinerario") || "null");
if (!state && !persistido) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold">No hay datos disponibles.</h2>
      <button
        onClick={() => navigate("/mapa")}
        className="mt-4 px-4 py-2 bg-amber-300 rounded hover:bg-amber-400"
      >
        Volver al mapa
      </button>
    </div>
  );
}

const datos = state || persistido || {};
const { estado, dias, presupuesto, eventosSeleccionados } = datos;
const estadoTitulo = estado || "Tabasco";
const evento = (eventosSeleccionados && eventosSeleccionados[0]) || null;
// Eventos del mes según payload sugerido (si los hubo)
const eventosMesPayload = (eventosSeleccionados?.[0]?.eventosMes) || [];
// Coincide con el mes activo ya sea que el evento tenga meta.mes o meta.fecha
const coincideMes = (s, mes) => {
  const etiqueta = String(s?.meta?.mes ?? s?.meta?.fecha ?? '').toLowerCase();
  return Boolean(mes) && etiqueta.includes(String(mes).toLowerCase());
};
// Eventos del mes según lo que el usuario agregó manualmente desde MunicipioDetalle
const eventosDeMesUsuario = selecciones
  .filter(s =>
    municipiosActivos.includes(s.municipio) &&
    (s.tipo === "evento" || s.tipo === "eventoCultural") &&
    coincideMes(s, datosRef?.mes)
  )
  .map(s => s.nombre);




// Unimos y quitamos duplicados
const eventosMesTotales = Array.from(new Set([...eventosMesPayload, ...eventosDeMesUsuario]));
// ⛔ Oculta eventos de otros meses dentro de las tarjetas de días
const mesActivo = (datos?.mes || "").toLowerCase();
const esEvento = (a) => a?.tipo === "evento" || a?.tipo === "eventoCultural";
const coincideMesAct = (a) => {
  const etiqueta = String(a?.meta?.mes ?? a?.meta?.fecha ?? "").toLowerCase();
  return mesActivo && etiqueta.includes(mesActivo);
};

 // Opciones permitidas para el modal: SOLO lo ya seleccionado
const opcionesModal = Array.from(
  new Set(
    (diasData || []).flatMap(d => (d.actividades || []).map(a => a.titulo))
  )
);
 

  return (
    <>
<header className="bg-[var(--color-primary)] shadow-md sticky top-0 z-50 w-full">
  <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
    {/* Logo y título */}
<Link to="/" className="flex items-center gap-3 sm:gap-4">
  <img src={logo} alt="Logo" className="h-9 sm:h-12 w-auto" />
  <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-wide drop-shadow-md text-black">
    Pueblos de Ensueño
  </h1>
</Link>


    {/* Botón menú hamburguesa en móvil */}
    <div className="sm:hidden">
      <button
        onClick={() => setMenuAbierto(!menuAbierto)}
        className="text-gray-800 focus:outline-none"
        aria-label="Toggle menu"
      >
        {menuAbierto ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
    </div>

    {/* Menú desktop */}
    <nav className="hidden sm:flex sm:items-center sm:gap-2">
      {modoEdicion && (
        <button
          onClick={() => setEditDiaIdx(null)}
          className="px-4 py-2 rounded-full font-semibold shadow-sm bg-teal-200 hover:bg-teal-300 text-teal-900"
        >
          🔙 Regresar
        </button>
      )}
      <button
        onClick={exportarPDF}
        className="px-4 py-2 rounded-full font-semibold shadow-sm bg-amber-300 hover:bg-amber-400 text-black"
      >
        📄 Exportar
      </button>
      <button
        onClick={() => setMostrarModal(true)}
        className="px-4 py-2 rounded-full font-semibold shadow-sm bg-amber-300 hover:bg-amber-400 text-black"
      >
        💾 Guardar
      </button>
      <button
        onClick={() => navigate('/puntos-cercanos')}
        className="px-4 py-2 rounded-full font-semibold shadow-sm bg-white/70 hover:bg-white text-gray-800 border border-gray-200"
      >
        📍 Puntos cercanos
      </button>
      <button
        onClick={() => navigate('/mapa')}
        className="px-4 py-2 rounded-full font-semibold shadow-sm bg-white/70 hover:bg-white text-gray-800 border border-gray-200"
      >
        🗺️ Mapa
      </button>
      <button
        onClick={() => navigate('/')}
        className="px-4 py-2 rounded-full font-semibold shadow-sm bg-white/70 hover:bg-white text-gray-800 border border-gray-200"
      >
        🏠 Inicio
      </button>
    </nav>
  </div>

  {/* Menú móvil desplegable */}
  {menuAbierto && (
    <div className="sm:hidden px-4 pb-4">
      <div className="grid grid-cols-2 gap-2 bg-white/95 border border-gray-200 shadow rounded-2xl p-3">
        {modoEdicion && (
          <button
            onClick={() => { setEditDiaIdx(null); setMenuAbierto(false); }}
            className="px-3 py-2 rounded-full font-semibold bg-teal-200 hover:bg-teal-300 text-teal-900 text-sm"
          >
            🔙 Regresar
          </button>
        )}
        <button
          onClick={() => { exportarPDF(); setMenuAbierto(false); }}
          className="px-3 py-2 rounded-full font-semibold bg-amber-300 hover:bg-amber-400 text-black text-sm"
        >
          📄 Exportar
        </button>
        <button
          onClick={() => { setMostrarModal(true); setMenuAbierto(false); }}
          className="px-3 py-2 rounded-full font-semibold bg-amber-300 hover:bg-amber-400 text-black text-sm"
        >
          💾 Guardar
        </button>
        <button
          onClick={() => { navigate('/puntos-cercanos'); setMenuAbierto(false); }}
          className="px-3 py-2 rounded-full font-semibold bg-white/80 hover:bg-white text-gray-800 border border-gray-200 text-sm"
        >
          📍 Puntos
        </button>
        <button
          onClick={() => { navigate('/mapa'); setMenuAbierto(false); }}
          className="px-3 py-2 rounded-full font-semibold bg-white/80 hover:bg-white text-gray-800 border border-gray-200 text-sm"
        >
          🗺️ Mapa
        </button>
        <button
          onClick={() => { navigate('/'); setMenuAbierto(false); }}
          className="px-3 py-2 rounded-full font-semibold bg-white/80 hover:bg-white text-gray-800 border border-gray-200 text-sm"
        >
          🏠 Inicio
        </button>
      </div>
    </div>
  )}
</header>




<div className={`flex ${mapColapsado ? 'flex-col' : 'flex-col md:flex-row'} min-h-screen w-full`}>

  {/* PANEL IZQUIERDO — Información  */}
<aside
className={`relative ${mapColapsado ? 'w-full' : 'w-full md:w-[45%]'} 
              h-auto md:h-screen md:sticky md:top-0 overflow-y-auto 
              px-4 sm:px-6 py-6 bg-white/90`}
>
    {/* Botón tipo “chevron” en el borde derecho del panel  */}
<div className="block md:block">
  <button
onClick={() => {
  setMapColapsado(prev => {
    const next = !prev;
    // Si se va a MOSTRAR el mapa, reacomoda y centra
    if (!next && mapRef.current) {
      setTimeout(() => {
        mapRef.current.resize();
        mapRef.current.flyTo({
          center: [-92.9475, 17.9895],
          zoom: 7,
          essential: true,
        });
      }, 50);
    }
    return next;
  });
}}

    aria-label={mapColapsado ? "Mostrar mapa" : "Ocultar mapa"}
className="absolute md:right-[-14px] right-2 top-1/2 -translate-y-1/2
           w-7 h-12 rounded-full bg-white border border-gray-200 shadow
           flex items-center justify-center hover:bg-gray-50 z-10"
    title={mapColapsado ? "Mostrar mapa" : "Ocultar mapa"}
  >
    <span className="text-gray-600 text-lg leading-none">
      {mapColapsado ? "‹" : "›"}
    </span>
  </button>
</div>


    {/* Título */}
<h1 className="text-2xl sm:text-3xl font-extrabold mb-1 text-gray-900">
  {municipiosActivos.length === 2
    ? `${municipiosActivos[0]} → ${municipiosActivos[1]}`
    : (municipiosActivos[0] || "Villahermosa")}
</h1>


    {/* Intro breve (puedes ajustar el texto a tu gusto) */}
    <p className="text-gray-700 mb-5">
      Planifica tu viaje con actividades, eventos y rutas. Ajusta días, edita actividades y exporta tu itinerario en PDF.
    </p>

    {/* Acciones tipo “chips” */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      <button
        onClick={() => navigate('/mapa')}
        className="flex items-center justify-center gap-2 rounded-xl bg-white border px-3 py-2 shadow-sm hover:bg-gray-50"
      >
        🗺️ <span>Mapa</span>
      </button>
      <button
        onClick={exportarPDF}
        className="flex items-center justify-center gap-2 rounded-xl bg-white border px-3 py-2 shadow-sm hover:bg-gray-50"
      >
        📄 <span>Exportar</span>
      </button>
      <button
        onClick={() => setMostrarModal(true)}
        className="flex items-center justify-center gap-2 rounded-xl bg-white border px-3 py-2 shadow-sm hover:bg-gray-50"
      >
        💾 <span>Guardar</span>
      </button>
      <button
        onClick={() => navigate('/puntos-cercanos')}
        className="flex items-center justify-center gap-2 rounded-xl bg-white border px-3 py-2 shadow-sm hover:bg-gray-50"
      >
        📍 <span>Puntos</span>
      </button>
    </div>

    {/* Resumen del viaje */}
    <div className="mb-6 rounded-2xl border bg-white p-5 shadow-sm">
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div><span className="font-semibold">Días:</span> {dias}</div>
        <div>
          <span className="font-semibold">Presupuesto/día:</span> ${datos?.monedas?.MXN ?? presupuesto} MXN
          {datos?.monedas ? <> · ${datos.monedas.USD} USD · €{datos.monedas.EUR} EUR</> : null}
        </div>
<div><span className="font-semibold">Mes:</span> {datos?.mes || "—"}</div>
<div>
  <span className="font-semibold">Ruta:</span>{" "}
  {municipiosActivos.length === 2
    ? `${municipiosActivos[0]} → ${municipiosActivos[1]}`
    : (municipiosActivos[0] || "—")}
</div>

        <div className="col-span-2">
          <span className="font-semibold">Intereses:</span> {(datos?.interesesSeleccionados || []).join(", ") || "—"}
        </div>
        {transportesSeleccionados.length > 0 && (
      <div className="col-span-2">
        <span className="font-semibold">Transporte:</span>
        <div className="flex flex-wrap gap-2 mt-1">

{transportesSeleccionados.map((transporte, idx) => (
    <button
      key={idx}
      onClick={() => setImagenModalTransporte(transporte.imagen)}
      className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-full px-3 py-1 text-xs font-medium border border-emerald-200 transition cursor-pointer"
    >
      {transporte.nombre} ℹ️
    </button>
))}
        </div>
      </div>
    )}
      </div>
      {evento && (
        <p className="mt-2"><strong>Evento:</strong> {evento.icono} {evento.nombre}</p>
      )}
    </div>

    {/* Eventos del mes */}
    {eventosMesTotales && eventosMesTotales.length > 0 && (
      <div className="mb-6 rounded-2xl border bg-indigo-50 p-4 text-indigo-900 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">🎉 Eventos en tu mes</h3>
        <ul className="list-disc list-inside">
          {eventosMesTotales.map((e, i) => <li key={i}>{e}</li>)}
        </ul>
        <p className="text-sm mt-2 text-indigo-700">
* Coinciden con <strong>{datosRef?.mes}</strong>.
        </p>
      </div>
    )}

    {/* Lista de intereses guardados */}
    {intereses.length > 0 && (
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">📍 Municipios que te interesan</h2>
        <ul className="list-disc list-inside text-gray-700">
          {intereses.map((nombre, idx) => (
            <li key={idx} className="flex items-center gap-2">
              {nombre}
<button
  onClick={() => {
    const nuevos = intereses.filter((item) => item !== nombre);
    setIntereses(nuevos);
    // ✅ CORRECCIÓN: Usar la clave dinámica correcta según el estado.
    const keyIntereses = estadoActual === "Chiapas"
      ? "interesesMunicipios_Chiapas"
      : "interesesMunicipios_Tabasco";
    localStorage.setItem(keyIntereses, JSON.stringify(nuevos));
  }}
  className="text-red-500 hover:text-red-700 text-sm"
>
  ❌ Quitar
</button>
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Botón reset */}
    <div className="mb-8">
      <button
// DESPUÉS (Correcto)
onClick={() => {
  if (confirm("¿Estás seguro de reiniciar tu itinerario y borrar todos los municipios marcados?")) {
    // 1. Determina la clave correcta según el estado actual
    const keyIntereses = estadoActual === "Chiapas"
      ? "interesesMunicipios_Chiapas"
      : "interesesMunicipios_Tabasco";

    // 2. Borra todo usando la clave correcta
    localStorage.removeItem("itinerario");
    localStorage.removeItem(keyIntereses); // <-- Corrección aplicada
    localStorage.removeItem("marcadores");
    
    // 3. Navega al mapa general
    navigate("/mapa");
  }
}}
        className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold shadow-sm hover:bg-red-600 transition"
      >
        🗑 Reiniciar itinerario completo
      </button>
    </div>

    {/* Tarjetas de días (en el panel) */}
    <div ref={pdfRef} className="grid gap-6 grid-cols-1">
      {diasData.map((dia, idx) => (
        <div
          key={idx}
          onClick={() => setEditDiaIdx(idx)}
          className="bg-white border-4 border-teal-200 rounded-2xl shadow-xl p-6 cursor-pointer transition hover:shadow-2xl"
        >
          <h3 className="text-xl font-bold text-teal-700 mb-2">Día {dia.dia}</h3>

          {(() => {
            const actsVisibles = (dia.actividades || []).filter(a => {
              if (!esEvento(a)) return true;
              return coincideMesAct(a);
            });
            const lista = actsVisibles.length ? actsVisibles : [{ titulo: "Día libre", icono: "🧘" }];
            return lista.map((act, i) => (
              <div key={i} className="mb-4">
                <div className="text-gray-800">
                  <p className="font-bold">{etiquetaPorTipo(act.tipo)}</p>
                  <p>
                    {editDiaIdx === idx ? (
                      <span
                        onClick={(e) => { e.stopPropagation(); setModalIndex({ diaIdx: idx, actIdx: i }); }}
                        className="underline text-blue-600 cursor-pointer hover:text-blue-800"
                      >
                        {act.titulo}
                      </span>
                    ) : (act.titulo)}{" "}
                    {act.icono}
                  </p>
                </div>
                {editDiaIdx === idx && (
                  <div className="flex items-center gap-3 mt-2">
                    <select
                      className="border rounded px-2 py-1"
                      onMouseDown={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        e.stopPropagation();
                        const toDia = Number(e.target.value);
                        if (!Number.isNaN(toDia)) moverActividad(idx, i, toDia);
                      }}
                      defaultValue=""
                    >
                      <option value="" disabled>Mover a día…</option>
                      {diasData.map((d, j) => (
                        <option key={j} value={j}>Día {d.dia}</option>
                      ))}
                    </select>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleEliminar(idx, i); borrarSeleccionDefinitiva(act.titulo); }}
                      className="text-sm text-red-600 underline"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            ));
          })()}

          {editDiaIdx === idx && (
            <button
              onClick={(e) => { e.stopPropagation(); handleAgregar(idx); }}
              className="text-sm text-teal-600 hover:underline"
            >
              ➕ Agregar actividad
            </button>
          )}
        </div>
      ))}
    </div>
    
  </aside>
{/* MAPA A LA DERECHA */}
<div
className={`${mapColapsado ? "hidden" : "block"} w-full md:w-[55%] h-[250px] md:h-screen md:sticky md:top-0`}
>
  <div
    id="map"
    ref={mapContainerRef}
    style={{ width: "100%", height: "100%" }}
    className="bg-white rounded-2xl overflow-hidden"
  ></div>
</div>

</div>
{editDiaIdx !== null && diasData[editDiaIdx] && (
  <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex justify-center items-start overflow-y-auto pt-10 px-4">
    <div
      className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto p-6 sm:p-8 relative"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header del overlay */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-teal-700">
          Editar — Día {diasData[editDiaIdx]?.dia}
        </h2>
        <button
          onClick={() => setEditDiaIdx(null)}
          className="px-3 py-1 rounded-full font-semibold bg-amber-200 hover:bg-amber-300 text-black"
        >
          🔙 Regresar
        </button>
      </div>

      {/* Lista de actividades del día (con tu mismo filtro por mes activo) */}
      {(() => {
        const dia = diasData[editDiaIdx] || {};
        const actsVisibles = (dia.actividades || []).filter(a => {
          if (!esEvento(a)) return true;
          return coincideMesAct(a);
        });

        const lista = actsVisibles.length ? actsVisibles : [{ titulo: "Día libre", icono: "🧘" }];

        return lista.map((act, i) => {
          const detalles = act.meta?.detalles;
          return (
            <div key={i} className="mb-5">
              <div className="text-gray-800">
                <p className="font-bold">{etiquetaPorTipo(act.tipo)}</p>
                <p className="text-lg">
                  <span
                    onClick={() => setModalIndex({ diaIdx: editDiaIdx, actIdx: i })}
                    className="underline text-blue-600 cursor-pointer hover:text-blue-800"
                  >
                    {act.titulo}
                  </span>{" "}
                  {act.icono}
                </p>
              </div>

              {detalles && (
                <div className="mt-1 space-y-1">
                  <p className="text-gray-800"><strong>💰 Presupuesto:</strong> {detalles.presupuesto}</p>
                  <p className="text-gray-800"><strong>🗺️ Rutas:</strong> {detalles.rutas}</p>
                  <p className="text-gray-800"><strong>🍽️ Gastronomía:</strong> {detalles.gastronomia}</p>
                  <p className="text-gray-800"><strong>🏨 Hospedaje:</strong> {detalles.hospedaje}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-3">
                <select
                  className="border rounded px-2 py-1"
                  onChange={(e) => {
                    const toDia = Number(e.target.value);
                    if (!Number.isNaN(toDia)) moverActividad(editDiaIdx, i, toDia);
                  }}
                  defaultValue=""
                >
                  <option value="" disabled>Mover a día…</option>
                  {diasData.map((d, j) => (
                    <option key={j} value={j}>Día {d.dia}</option>
                  ))}
                </select>

                <button
                  onClick={() => { handleEliminar(editDiaIdx, i); borrarSeleccionDefinitiva(act.titulo); }}
                  className="text-sm text-red-600 underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        });
      })()}

      {/* Botón para crear y ABRIR selector en la nueva actividad */}
      <div className="mt-4">
        <button
          onClick={() => handleAgregar(editDiaIdx)}
          className="text-sm text-teal-600 hover:underline"
        >
          ➕ Agregar actividad
        </button>
      </div>

      {/* === PANEL DE SELECCIÓN (debajo del editor, horizontal) === */}
      {modalIndex && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-3 text-pink-600 text-center">
            Selecciona una nueva actividad
          </h3>

          {/* Carrusel horizontal */}
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-4">
              {opcionesModal.map((titulo, i) => (
                <button
                  key={i}
                  onClick={() => handleEdit(modalIndex.diaIdx, modalIndex.actIdx, titulo)}
                  className="min-w-[260px] max-w-[320px] text-left flex items-center gap-2 border border-pink-300 rounded-xl px-4 py-3 hover:bg-pink-50 transition shadow-sm"
                >
                  <span className="text-2xl">📍</span>
                  <span className="text-pink-800 font-semibold">{titulo}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => setModalIndex(null)}
              className="bg-gray-300 px-4 py-2 rounded-full hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Cerrar overlay */}
      <button
        aria-label="Cerrar"
        onClick={() => setEditDiaIdx(null)}
        className="absolute -top-3 -right-3 bg-white shadow px-3 py-1 rounded-full hover:bg-gray-100"
      >
        ✖
      </button>
    </div>
  </div>
)}
      {mostrarModal && (
  <div className="fixed inset-0 bg-black/50 z-[10000] flex justify-center items-start pt-10 px-4 overflow-y-auto">
    <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-pink-600 mb-4">
              🔒 Para guardar tu itinerario debes registrarte
            </h2>
            <p className="text-gray-700 mb-4">¿Quieres hacerlo ahora?</p>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={() => navigate("/register")}
                className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Registrarme
              </button>
              <button
                onClick={() => setMostrarModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold"
              >
                En otro momento
              </button>
            </div>
          </div>
        </div>
      )}
{imagenModalTransporte && (
  <div 
    className="fixed inset-0 bg-black/70 z-[10001] flex justify-center items-center p-4"
    onClick={() => setImagenModalTransporte(null)}
  >
    <div 
      className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto p-2 relative"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={() => setImagenModalTransporte(null)}
        className="absolute top-2 right-2 bg-white/80 rounded-full w-8 h-8 text-lg font-bold hover:bg-gray-200 z-10"
        aria-label="Cerrar"
      >
        &times;
      </button>
      <img 
        src={imagenModalTransporte} 
        alt="Tarifas de Transporte" 
        className="w-full h-auto rounded-md"
      />
    </div>
  </div>
)}
    </>
  );
}

export default Itinerario;
