import React, { useEffect, useRef, useState } from 'react';
import tabascoSvg from '../assets/Tabasco_only.svg?raw';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import gifVillahermosa from '../assets/Villahermosa.gif';
import logo from '../assets/Logo.png';
import { Menu } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getSelecciones } from '../utils/itinerarioStore';
import popurriTabasco from '../assets/Popurri Tabasco.mp3';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
function MapaTabasco({ onRegresar, estado, eventos }) {
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, name: '', x: 0, y: 0 });
// Leer mes guardado en localStorage al iniciar
const itinerarioPersistido = JSON.parse(localStorage.getItem("itinerario") || "{}");

const [formData, setFormData] = useState({ 
  dias: '',
  tipo: '',
  lugarInicio: itinerarioPersistido?.lugarInicio || '',
  ultimoLugar: '',
  intereses: '',
  mes: itinerarioPersistido?.mes || '',
  email: '',
 modoDestino: (itinerarioPersistido?.modoDestino === 'automatico'
                 ? 'auto'
                 : (itinerarioPersistido?.modoDestino || ''))
});


  const [eventoIndex, setEventoIndex] = useState(0);
  
  // 🔹 Escuchar cambios de mes desde MunicipioDetalle (y otros componentes)
useEffect(() => {
  const handleStorageChange = () => {
    const itinerarioPersistido = JSON.parse(localStorage.getItem("itinerario") || "null");
    if (itinerarioPersistido?.mes) {
      setFormData(prev => ({ ...prev, mes: itinerarioPersistido.mes }));
    }
   if (itinerarioPersistido?.lugarInicio) {
     setFormData(prev => ({
       ...prev,
       lugarInicio: itinerarioPersistido.lugarInicio,
       modoDestino: (itinerarioPersistido.modoDestino === 'automatico'
                       ? 'auto'
                       : (itinerarioPersistido.modoDestino || 'auto'))
     }));
   }

  };

  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);

  const [errorEvento, setErrorEvento] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  useEffect(() => {
  if (!formData.mes) return;
  // Año por defecto: si ya eligió fechaInicio, usa ese año; si no, el actual
  const hoy = new Date();
  const yyyy = fechaInicio ? new Date(fechaInicio).getFullYear() : hoy.getFullYear();
  const { inicio, fin } = clampFechaAlMes(yyyy, formData.mes, formData.dias || 1);
  // Ajusta fecha inicio al primer día del mes; fecha fin limitada por días y mes
  const iso = d => d.toISOString().split("T")[0];
  setFechaInicio(iso(inicio));
  setFechaFin(iso(fin));
}, [formData.mes, formData.dias]); // cambia al elegir mes o días

  const [presupuestoInput, setPresupuestoInput] = useState('');
  const [mostrarZonas, setMostrarZonas] = useState(false);
  const [gifVisible, setGifVisible] = useState(false);
  const [gifPosition, setGifPosition] = useState({ x: 0, y: 0 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vistaMovil, setVistaMovil] = useState('mapa'); // 'mapa' | 'itinerario'
  const [seleccionando, setSeleccionando] = useState(null);
  const [confirmacionDias, setConfirmacionDias] = useState('');
  const [tooltipSeleccion, setTooltipSeleccion] = useState('');
  const timeoutRef = useRef(null);
  const [mostrarMapaMapbox, setMostrarMapaMapbox] = useState(false);
  // Fullscreen solo para Mapbox en móviles
const [mapboxFull, setMapboxFull] = useState(false);
  const [mapaFull, setMapaFull] = useState(false);
  const [clickCoords, setClickCoords] = useState(null);
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  // Ref y tamaño para limitar el confeti al carrusel de eventos
  const eventsRef = useRef(null);
  const [eventsSize, setEventsSize] = useState({ width: 0, height: 0 });
   useEffect(() => {
    if (eventsRef.current) { const { width, height } = eventsRef.current.getBoundingClientRect(); setEventsSize({ width, height });}}, [mostrarZonas, eventoIndex]);
  const navigate = useNavigate();
  // Variants para slide + fade-in del mapa
  const mapVariants = { hidden: { opacity: 0, y: 20 },visible: {opacity: 1,y: 0,transition: { duration: 0.8, ease: 'easeOut' } }};
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 300], ['0%', '20%']);
  const zonasVillahermosa = [
    {
      nombre: 'Centro Histórico / Zona Luz',
      descripcion: 'Casco antiguo con plazas, catedral, arquitectura colonial y ambiente cultural.'
    },
    {
      nombre: 'Paseo Tabasco',
      descripcion: 'Avenida principal con monumentos, tiendas y vida urbana activa.'
    },
    {
      nombre: 'Parque Tomás Garrido y Laguna de las Ilusiones',
      descripcion: 'Espacio natural con malecón, teatro al aire libre, laguna y senderos.'
    },
    {
      nombre: 'Tabasco 2000',
      descripcion: 'Zona moderna con centros comerciales, oficinas, hoteles y bancos.'
    },
    {
      nombre: 'Yumká',
      descripcion: 'Reserva ecológica con animales, selva y educación ambiental.'
    },
    {
      nombre: 'Museo Carlos Pellicer',
      descripcion: 'Museo de antropología con piezas olmecas y mayas.'
    },
    {
      nombre: 'Museo Papagayo',
      descripcion: 'Museo interactivo ideal para familias y niños con juegos educativos.'
    }
  ];
const municipiosTabasco = [
  { nombre: 'Balancán',      coords: [-91.5394, 17.7994] },
  { nombre: 'Cardenas',      coords: [-93.6700, 17.9894] },
  { nombre: 'Centla',        coords: [-92.6283, 18.4083] },
  { nombre: 'Centro',        coords: [-92.9199, 17.9895] },
  { nombre: 'Comalcalco',    coords: [-93.0446, 18.2603] },
  { nombre: 'Cunduacán',     coords: [-93.1715, 18.0707] },
  { nombre: 'Emiliano Zapata', coords: [-91.8272, 17.7415] },
  { nombre: 'Huimanguillo',  coords: [-93.3796, 17.8476] },
  { nombre: 'Jalapa',        coords: [-92.7982, 17.7105] },
  { nombre: 'Jalpa de Méndez', coords: [-93.0675, 18.1754] },
  { nombre: 'Jonuta',        coords: [-91.9984, 18.0000] },
  { nombre: 'Macuspana',     coords: [-92.5973, 17.7579] },
  { nombre: 'Nacajuca',      coords: [-92.9834, 18.1694] },
  { nombre: 'Paraíso',       coords: [-93.2170, 18.4086] },
  { nombre: 'Tacotalpa',     coords: [-92.9401, 17.4612] },
  { nombre: 'Teapa',         coords: [-92.9494, 17.5478] },
  { nombre: 'Tenosique',     coords: [-91.4225, 17.4694] }
];
// ----- Catálogo mínimo para recomendaciones (extiende cuando quieras) -----
const CATALOGO = [
  {
    municipio: "Centro",
    categorias: ["Gastronomía", "Museos", "Compras", "Arte"],
    costoMedio: 1500, // MXN por día
    eventosPorMes: {
      Enero: [], Febrero: [], Marzo: ["La Cultural"], Abril: [],
      Mayo: ["Feria Tabasco", "La Cultural"], Junio: ["La Cultural"],
      Julio: [], Agosto: [], Septiembre: [], Octubre: ["Festival del Chocolate"],
      Noviembre: ["Festival del Cacao"], Diciembre: []
    },
    actividadesBase: ["Museo La Venta", "Laguna de las Ilusiones", "Zona Luz", "Yumká"]
  },
  {
    municipio: "Comalcalco",
    categorias: ["Museos", "Aventura", "Gastronomía"],
    costoMedio: 1200,
    eventosPorMes: {
      Enero: [], Febrero: [], Marzo: [], Abril: [],
      Mayo: [], Junio: [], Julio: [], Agosto: [],
      Septiembre: [], Octubre: ["Festival del Chocolate"], Noviembre: ["Festival del Cacao"], Diciembre: []
    },
    actividadesBase: ["Zona Arqueológica de Comalcalco", "Fábricas de chocolate"]
  },
  {
    municipio: "Paraíso",
    categorias: ["Naturaleza", "Aventura"],
    costoMedio: 1000,
    eventosPorMes: {
      Enero: [], Febrero: [], Marzo: [], Abril: [],
      Mayo: [], Junio: [], Julio: [], Agosto: [],
      Septiembre: [], Octubre: [], Noviembre: [], Diciembre: []
    },
    actividadesBase: ["Playa Paraíso", "Puerto Dos Bocas"]
  }
];

// ----- Helpers -----
const tipoPresupuestoADinero = (tipo) => {
  // valores por día aproximados
  if (tipo === "Económico") return 800;
  if (tipo === "Moderado") return 1500;
  if (tipo === "Confort") return 2800;
  if (tipo === "Lujo") return 5000;
  return 1500;
};

const convertirMonedas = (mxn) => {
  // TIPO FIJO DEMO; si luego tienes API, reemplaza aquí
  const USD = (mxn / 17.5);
  const EUR = (mxn / 19);
  return {
    MXN: Math.round(mxn),
    USD: Math.round(USD),
    EUR: Math.round(EUR),
  };
};

const sugerirRuta = ({ mes, intereses = [], tipo }) => {
  const interesList = Array.isArray(intereses) ? intereses : (intereses ? intereses.split(", ").filter(Boolean) : []);
  const candidatos = CATALOGO
    .filter(m => {
      const okInteres = interesList.length === 0 || m.categorias.some(c => interesList.includes(c));
      const okMes = m.eventosPorMes[mes]?.length ? true : okInteres; // si hay evento en el mes, lo favorecemos
      return okInteres || okMes;
    })
    .sort((a, b) => {
      const evA = (a.eventosPorMes[mes] || []).length;
      const evB = (b.eventosPorMes[mes] || []).length;
      // más eventos primero; si empatan, prioriza más categorías coincidentes
      const matchA = a.categorias.filter(c => interesList.includes(c)).length;
      const matchB = b.categorias.filter(c => interesList.includes(c)).length;
      return (evB - evA) || (matchB - matchA);
    });

  const inicio = candidatos[0]?.municipio || "Centro";
  const fin = candidatos[1]?.municipio || candidatos[0]?.municipio || "Centro";

  // actividades sugeridas: toma del top y mezcla con eventos del mes
  const eventosMes = (candidatos[0]?.eventosPorMes[mes] || []).slice(0, 2);
  const actBase = (candidatos[0]?.actividadesBase || []).slice(0, 6);
  const actividades = [...eventosMes, ...actBase];
  return { inicio, fin, actividades, eventosMes };
};

const clampFechaAlMes = (yyyy, mesNombre, dias) => {
  // ajusta fecha fin para que no se salga del mes
  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const mIdx = Math.max(0, meses.indexOf(mesNombre));
  const inicio = new Date(yyyy, mIdx, 1);
  const finMes = new Date(yyyy, mIdx + 1, 0); // último día del mes
  const fin = new Date(inicio);
  fin.setDate(inicio.getDate() + Math.max(0, (parseInt(dias || "1",10) - 1)));
  if (fin > finMes) return { inicio, fin: finMes };
  return { inicio, fin };
};

useEffect(() => {
  // Solo dibuja el SVG cuando:
  // - estás en la vista "mapa"
  // - NO estás mostrando Mapbox
  if (vistaMovil !== 'mapa') return;
  if (mostrarMapaMapbox) return;
  if (!containerRef.current) return;

  containerRef.current.innerHTML = tabascoSvg;

  const svg = containerRef.current.querySelector('svg');
  if (svg) {
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    svg.style.display = 'block';

    if (!svg.querySelector('defs')) {
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.innerHTML = `
        <filter id="bordeConSombra" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="0" stdDeviation="1.2" flood-color="black" flood-opacity="0.5"/>
        </filter>
      `;
      svg.prepend(defs);
    }
  }

  const paths = containerRef.current.querySelectorAll('path');
  paths.forEach((path) => {
    const titleTag = path.querySelector('title');
    let name = titleTag ? titleTag.textContent : 'Municipio';

    path.addEventListener('mouseenter', (e) => {
      const rect = containerRef.current.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;
      setTooltip({ visible: true, name, x: relX, y: relY });
      if (name.toLowerCase().includes('centro') || name.toLowerCase().includes('villahermosa')) {
        setGifVisible(true);
        setGifPosition({ x: relX, y: relY });
      }
    });
    path.addEventListener('mouseleave', () => {
      setTooltip({ visible: false, name: '', x: 0, y: 0 });
      setGifVisible(false);
    });
    path.addEventListener('click', () => {
      const seleccion = document.body.getAttribute('data-seleccionando');
      if (seleccion === 'inicio') {
        setFormData((prev) => ({ ...prev, lugarInicio: name }));
        setSeleccionando(null);
        document.body.removeAttribute('data-seleccionando');
        return;
      }
      if (seleccion === 'fin') {
        setFormData((prev) => ({ ...prev, ultimoLugar: name }));
        setSeleccionando(null);
        document.body.removeAttribute('data-seleccionando');
        return;
      }
      navigate(`/municipio/${name}`);
    });

    if (titleTag) titleTag.remove();

    // Si quieres SIN borde, comenta estas 3:
    path.setAttribute('stroke', '#000000');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linejoin', 'round');
  });
}, [vistaMovil, mostrarMapaMapbox]);

useEffect(() => {
  // 👇 Solo inicializa si la vista móvil está en "mapa"
  if (vistaMovil !== 'mapa') return;
  if (!mostrarMapaMapbox || !mapContainer.current) return;
const map = new mapboxgl.Map({
  container: mapContainer.current,
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-92.9, 17.9],
  zoom: 7.5,
  pitch: 0,
  bearing: 0,
});




// Asegurar que pinta al volver de hidden → visible (móvil)
map.once('load', () => {
  map.resize();
});
setTimeout(() => map.resize(), 0); // backup por si el load fue antes

map.dragRotate.disable();
map.touchZoomRotate.disableRotation();
map.addControl(new mapboxgl.NavigationControl(), 'top-right');

// (opcional) si rotas el dispositivo o cambias tamaño:
window.addEventListener('resize', () => map.resize());

  // ✅ Aquí va el click listener (fuera del map.on('load'))
map.on('click', (e) => {
  const { lng, lat } = e.lngLat;
  // 1) Guardamos en estado
  setClickCoords({ lng, lat });
  // 2) (Opcional) mostramos el popup como antes
  new mapboxgl.Popup({ closeOnClick: true, offset: 10 })
    .setLngLat([lng, lat])
    .setHTML(`
      <strong>📍 Coordenadas</strong><br>
      Lat: ${lat.toFixed(5)}<br>
      Lng: ${lng.toFixed(5)}
    `)
    .addTo(map);
});
  // 🔸 Marcadores de zonas de interés
  zonasVillahermosa.forEach((zona) => {
    new mapboxgl.Marker({ color: "#FF5733" })
      .setLngLat(getCoordenadasZona(zona.nombre))
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<strong>${zona.nombre}</strong><br>${zona.descripcion}`))
      .addTo(map);
  });
  // 🔹 Marcadores de municipios
municipiosTabasco.forEach((municipio) => {
  const el = document.createElement('div');
  el.className = 'marker';
  el.style.width = '18px';
  el.style.height = '18px';
  el.style.borderRadius = '50%';
  el.style.backgroundColor = '#1E90FF';
  el.style.cursor = 'pointer';
  const marker = new mapboxgl.Marker(el)
    .setLngLat(municipio.coords)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<strong>${municipio.nombre}</strong><br>Municipio de Tabasco`
      )
    )
    .addTo(map);
el.addEventListener('click', () => {
  const seleccion = document.body.getAttribute("data-seleccionando");
  if (seleccion === 'inicio') {
    setFormData(prev => ({ ...prev, lugarInicio: municipio.nombre }));
    setSeleccionando(null);
    document.body.removeAttribute("data-seleccionando");
    return; // 👈 no navegar
  }
  if (seleccion === 'fin') {
    setFormData(prev => ({ ...prev, ultimoLugar: municipio.nombre }));
    setSeleccionando(null);
    document.body.removeAttribute("data-seleccionando");
    return; // 👈 no navegar
  }
  navigate(`/municipio/${municipio.nombre}`);
});

});
  return () => map.remove();
}, [mostrarMapaMapbox, vistaMovil]);


 const buildDiasDataDesdeSelecciones = ({ municipio, dias, mes }) => {
   const todas = (getSelecciones() || []).filter(s => s.municipio === municipio);
   const eventosDelMesPrimero = (s) =>
     s.tipo === 'evento' &&
     mes &&
     String(s.meta?.mes || s.meta?.fecha || '').toLowerCase()
       .includes(String(mes).toLowerCase());
   const ordenadas = [...todas].sort((a,b) => (eventosDelMesPrimero(b)?1:0) - (eventosDelMesPrimero(a)?1:0));
   const n = Math.max(1, parseInt(dias || '1', 10));
   const diasData = Array.from({ length: n }, (_, i) => ({ dia: i + 1, actividades: [] }));
   ordenadas.forEach((s, idx) => {
     const d = idx % n;
     diasData[d].actividades.push({
       titulo: s.nombre,
       icono: s.icono || '📍',
       tipo: s.tipo, 
       meta: s.meta || {},
     });
   });
   return diasData;
 };

// --- Subcomponente para reutilizar el formulario de itinerario ---
const ItinerarioForm = () => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      const errores = [];
      if (!formData.dias) errores.push("📅 Indica los días de viaje");
      if (!formData.tipo) errores.push("💰 Elige un presupuesto estimado");
      if (!formData.mes) errores.push("📆 Elige un mes");
      if (!fechaInicio || !fechaFin) errores.push("🗓 Selecciona fechas de viaje");
      if (errores.length > 0) { setErrorEvento(errores); return; }
      setErrorEvento(false);

      let { lugarInicio, ultimoLugar } = formData;
      const interesesArr = formData.intereses ? formData.intereses.split(", ").filter(Boolean) : [];
      const presupuestoMXN = tipoPresupuestoADinero(formData.tipo);
      const monedas = convertirMonedas(presupuestoMXN);

      let actividadesSugeridas = [];
      let eventosMes = [];
      let diasData = [];

      if ((formData.modoDestino === "auto") && lugarInicio) {
        diasData = buildDiasDataDesdeSelecciones({
          municipio: lugarInicio,
          dias: formData.dias,
          mes: formData.mes
        });
        ultimoLugar = ultimoLugar || lugarInicio;
      } else if (!lugarInicio || !ultimoLugar) {
        const sugerencia = sugerirRuta({
          mes: formData.mes,
          intereses: interesesArr,
          tipo: formData.tipo
        });
        lugarInicio = lugarInicio || sugerencia.inicio;
        ultimoLugar = ultimoLugar || sugerencia.fin;
        actividadesSugeridas = sugerencia.actividades;
        eventosMes = sugerencia.eventosMes;
      }

      if (actividadesSugeridas.length === 0) {
        actividadesSugeridas = [`Desde ${lugarInicio} hasta ${ultimoLugar}`];
      }

      const payload = {
        estado,
        dias: `${fechaInicio} a ${fechaFin}`,
        presupuesto: presupuestoMXN,
        monedas,
        email: formData.email || "",
        mes: formData.mes,
        interesesSeleccionados: interesesArr,
        origen: lugarInicio,
        destino: ultimoLugar,
        eventosSeleccionados: [{
          nombre: formData.tipo,
          icono: "🎯",
          fechas: `${fechaInicio} a ${fechaFin}`,
          elementos: interesesArr.join(", "),
          actividades: actividadesSugeridas.join(", "),
          eventosMes
        }],
        ...(diasData.length ? { diasData } : {})
      };

      localStorage.setItem("itinerario", JSON.stringify(payload));
      navigate("/itinerario", { state: payload });
    }}
    className="flex flex-col gap-4 text-sm"
  >
    <label className="font-bold text-lg text-center">
      {mostrarMapaMapbox ? '📍 Explora los municipios de Tabasco' : '🐯 ITINERARIOS DE VIAJE'}
    </label>

    {Array.isArray(errorEvento) && errorEvento.length > 0 && (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
        <ul className="list-disc list-inside">
          {errorEvento.map((msg, i) => <li key={i}>{msg}</li>)}
        </ul>
      </div>
    )}

    {/* Modo destino */}
    <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-full px-3 py-1 mb-4 text-sm">
      <span className="text-gray-700 whitespace-nowrap">¿Sabes a dónde ir?</span>
      <div className="flex gap-2">
        <button
          type="button"
          className={`px-3 py-1 rounded-full transition text-xs ${
            formData.modoDestino === "manual" ? "bg-green-300 text-green-900" : "bg-gray-200 hover:bg-green-200"
          }`}
          onClick={() => setFormData({ ...formData, modoDestino: "manual" })}
        >
          Elegir
        </button>
        <button
          type="button"
          className={`px-3 py-1 rounded-full transition text-xs ${
            formData.modoDestino === "auto" ? "bg-blue-300 text-blue-900" : "bg-gray-200 hover:bg-blue-200"
          }`}
          onClick={() => setFormData(prev => ({ ...prev, modoDestino: "auto" }))}
        >
          Automático
        </button>
      </div>
    </div>

    {formData.modoDestino === 'auto' && formData.lugarInicio && (
      <div className="mb-3 text-sm">
        <span className="inline-block bg-green-100 text-green-900 border border-green-300 px-3 py-1 rounded-full">
          ✅ Destino seleccionado: <strong>{formData.lugarInicio}</strong> (desde Municipios)
        </span>
      </div>
    )}

    {formData.modoDestino !== "auto" && (
      <>
        <button
          type="button"
          onClick={() => {
            setSeleccionando('inicio');
            document.body.setAttribute("data-seleccionando", "inicio");
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setTooltipSeleccion("🖱 Haz clic en el mapa para elegir tu primera parada");
            timeoutRef.current = setTimeout(() => setTooltipSeleccion(''), 3000);
          }}
          className="w-full border border-blue-300 rounded-full px-4 py-2 bg-blue-100 hover:bg-blue-200 transition text-left"
        >
          {formData.lugarInicio || 'Seleccionar primera parada'}
        </button>

        <button
          type="button"
          onClick={() => {
            setSeleccionando('fin');
            document.body.setAttribute("data-seleccionando", "fin");
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            setTooltipSeleccion("🖱 Haz clic en el mapa para elegir tu última parada");
            timeoutRef.current = setTimeout(() => setTooltipSeleccion(''), 3000);
          }}
          className="w-full border border-green-300 rounded-full px-4 py-2 bg-green-100 hover:bg-green-200 transition text-left"
        >
          {formData.ultimoLugar || 'Seleccionar última parada'}
        </button>
      </>
    )}

    {/* Días */}
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-medium text-gray-800">📅 Días de viaje</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            const actual = parseInt(formData.dias || "1");
            if (actual > 1) setFormData({ ...formData, dias: String(actual - 1) });
          }}
          className="px-3 py-1 bg-gray-200 rounded-full text-lg font-bold hover:bg-gray-300"
        >−</button>
        
  <button
    type="button"
    onClick={() => {
      const actual = parseInt(formData.dias || "0");
      if (actual < 30) setFormData({ ...formData, dias: String(actual + 1) });
    }}
    className="px-3 py-1 bg-gray-200 rounded-full text-lg font-bold hover:bg-gray-300"
  >+</button>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={formData.dias || ''}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            const num = parseInt(val);
            if (!isNaN(num) && num > 0 && num <= 30) {
              setFormData({ ...formData, dias: String(num) });
            } else if (val === "") {
              setFormData({ ...formData, dias: "" });
            }
          }}
          placeholder="1"
          className="w-24 text-center border border-gray-300 rounded-full px-4 py-2"
        />
        <button
          type="button"
          onClick={() => {
            const n = parseInt(formData.dias || "0", 10);
            if (n > 0 && n <= 30) {
              setConfirmacionDias(`✅ Se han seleccionado ${formData.dias} día${formData.dias === "1" ? '' : 's'} de viaje`);
            } else {
              setConfirmacionDias("⚠️ Ingrese un número válido entre 1 y 30");
            }
            setTimeout(() => setConfirmacionDias(''), 3000);
          }}
          className="ml-2 bg-yellow-400 text-black font-bold px-4 py-2 rounded-full hover:bg-yellow-500"
        >OK</button>
      </div>
      {confirmacionDias && (
        <div className="mt-2 p-3 border-l-4 border-green-500 bg-green-100 text-green-800 rounded-md shadow-sm text-sm font-medium">
          {confirmacionDias}
        </div>
      )}
    </div>

    {/* Selects */}
    <select
      value={formData.tipo || ''}
      onChange={e => setFormData({ ...formData, tipo: e.target.value })}
      className="w-full border border-gray-300 rounded-full px-4 py-2 bg-white"
      required
    >
      <option value="" disabled>💰 Presupuesto estimado</option>
      <option value="Económico">💸 Económico (hasta $1,000 MXN por día)</option>
      <option value="Moderado">💼 Moderado ($1,000 – $2,000 MXN por día)</option>
      <option value="Confort">🏨 Confort ($2,000 – $4,000 MXN por día)</option>
      <option value="Lujo">💎 Lujo total (más de $4,000 MXN por día)</option>
    </select>

    <select
      value={formData.mes || ''}
      onChange={e => {
        const nuevoMes = e.target.value;
        setFormData({ ...formData, mes: nuevoMes });
        const it = JSON.parse(localStorage.getItem("itinerario") || "{}");
        localStorage.setItem("itinerario", JSON.stringify({ ...it, mes: nuevoMes }));
      }}
      className="w-full border border-gray-300 rounded-full px-4 py-2 bg-white"
      required
    >
      <option value="" disabled>📆 Selecciona un mes</option>
      {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map(m => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>

    <select
      value=""
      onChange={(e) => {
        const valor = e.target.value;
        if (valor === 'Cerrar') {
          setFormData({ ...formData, intereses: '' });
        } else {
          const actuales = formData.intereses?.split(', ').filter(Boolean) || [];
          if (!actuales.includes(valor)) {
            const nuevos = [...actuales, valor];
            setFormData({ ...formData, intereses: nuevos.join(', ') });
          }
        }
      }}
      className="w-full border border-gray-300 rounded-full px-4 py-2 bg-white"
    >
      <option value="" disabled>🎯 Intereses</option>
      <option value="Naturaleza">Naturaleza</option>
      <option value="Compras">Compras</option>
      <option value="Arte">Arte</option>
      <option value="Museos">Museos</option>
      <option value="Gastronomía">Gastronomía</option>
      <option value="Aventura">Aventura</option>
      <option value="Acceso gratuito">Acceso gratuito</option>
      <option value="Cerrar" className="text-red-500">Cerrar</option>
    </select>

    {formData.intereses && formData.intereses.split(', ').length > 0 && (
      <div className="flex flex-wrap gap-2 mt-2">
        {formData.intereses.split(', ').map((interes, idx) => (
          <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2">
            {interes}
            <button
              type="button"
              onClick={() => {
                const restantes = formData.intereses.split(', ').filter((i) => i !== interes);
                setFormData({ ...formData, intereses: restantes.join(', ') });
              }}
              className="text-red-500 hover:text-red-700 font-bold"
            >✕</button>
          </span>
        ))}
      </div>
    )}

    {/* Fechas */}
    <div className="flex flex-col gap-2">
      <label className="block text-sm font-medium text-gray-800">Fechas de viaje</label>
      <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
        <input
          type="date"
          min={
            formData.mes
              ? (() => {
                  const hoy = new Date();
                  const yyyy = fechaInicio ? new Date(fechaInicio).getFullYear() : hoy.getFullYear();
                  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
                  const mIdx = Math.max(0, meses.indexOf(formData.mes));
                  return new Date(yyyy, mIdx, 1).toISOString().split("T")[0];
                })()
              : ""
          }
          max={
            formData.mes
              ? (() => {
                  const hoy = new Date();
                  const yyyy = fechaInicio ? new Date(fechaInicio).getFullYear() : hoy.getFullYear();
                  const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
                  const mIdx = Math.max(0, meses.indexOf(formData.mes));
                  return new Date(yyyy, mIdx + 1, 0).toISOString().split("T")[0];
                })()
              : ""
          }
          value={fechaInicio}
          onChange={e => { setFechaInicio(e.target.value); setFechaFin(''); }}
          className="w-full sm:w-[48%] border border-amber-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          required
        />
        <span className="text-gray-600">→</span>
        <input
          type="date"
          min={fechaInicio}
          max={
            (() => {
              if (!fechaInicio || !formData.mes || !formData.dias) return '';
              const inicio = new Date(fechaInicio);
              const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
              const yyyy = inicio.getFullYear();
              const mIdx = Math.max(0, meses.indexOf(formData.mes));
              const finDeMes = new Date(yyyy, mIdx + 1, 0);
              const finPorDias = new Date(inicio);
              finPorDias.setDate(inicio.getDate() + parseInt(formData.dias,10) - 1);
              const fin = finPorDias < finDeMes ? finPorDias : finDeMes;
              return fin.toISOString().split('T')[0];
            })()
          }
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          disabled={!fechaInicio}
          className="w-full sm:w-[48%] border border-amber-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:bg-gray-100"
          required
        />
      </div>
    </div>

    {/* Botones finales */}
    <div className="flex justify-between items-center mt-4">
      <button type="button" onClick={onRegresar} className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-200">
        Regresar
      </button>
      <button type="submit" className="bg-yellow-400 text-black font-bold px-6 py-2 rounded-full hover:bg-yellow-500">
        CREAR
      </button>
    </div>

    <div className="flex justify-center gap-4 mt-4 text-xl text-gray-600">
      <i className="fab fa-facebook-square" />
      <i className="fab fa-twitter" />
      <i className="fab fa-instagram" />
      <i className="far fa-envelope" />
    </div>
  </form>
);


return (
  <>
    {/* HEADER */}
    <header className="sticky top-0 z-50 w-full py-4 px-6 flex justify-between items-center bg-[var(--color-primary)] shadow-md">
<Link to="/" className="flex items-center gap-4">
  <img src={logo} alt="Pueblos de Ensueño - Logotipo" className="h-10 sm:h-12 w-auto" />
  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide drop-shadow-md text-black">
    Pueblos de Ensueño
  </h1>
</Link>
<div className="md:hidden fixed bottom-3 left-3 right-3 z-40">
  <audio id="popurri-player-mobile" controls preload="auto" className="w-full rounded-md border border-amber-300 bg-white/90" >
    <source src={popurriTabasco} type="audio/mpeg" />
  </audio>
</div>

<nav className="hidden md:flex gap-3 lg:gap-5 items-center">
<Link to="/">
  <button className="px-4 py-2 bg-[var(--orange-250)] hover:bg-[var(--color-secondary)] text-black rounded-full font-semibold shadow-sm transition">
    Ir al Home
  </button>
</Link>

  {/* Reproductor en header: permanece montado */}
  <audio
    id="popurri-player"
    controls
    preload="auto"
    className="h-10 w-48 sm:w-56 rounded-md border border-amber-300 bg-white/80"
  >
    <source src={popurriTabasco} type="audio/mpeg" />
    Tu navegador no soporta la reproducción de audio.
  </audio>
</nav>


      <button className="block md:hidden text-gray-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <Menu size={24} />
      </button>
      
    </header>
    {/* NAV MOBILE */}
    {mobileMenuOpen && (
      <nav className="md:hidden bg-[var(--color-tertiary)] shadow-md px-6 py-4 space-y-2">
<Link to="/">
  <button className="w-full px-4 py-2 bg-[var(--color-tertiary)] hover:bg-[var(--color-secondary)] rounded-lg font-semibold transition">
    Ir al Home
  </button>
</Link>

      </nav>
    )}
    {/* Toggle móvil: Mapa / Itinerario */}
<div className="md:hidden px-6 py-2">
  <div className="flex gap-2 rounded-full bg-white/80 p-1 shadow border">
    <button
      onClick={() => setVistaMovil('mapa')}
      className={`flex-1 px-3 py-2 rounded-full ${vistaMovil === 'mapa' ? 'bg-yellow-400 font-bold' : ''}`}
      aria-pressed={vistaMovil === 'mapa'}
    >
      🗺️ Mapa
    </button>
    <button
      onClick={() => setVistaMovil('itinerario')}
      className={`flex-1 px-3 py-2 rounded-full ${vistaMovil === 'itinerario' ? 'bg-yellow-400 font-bold' : ''}`}
      aria-pressed={vistaMovil === 'itinerario'}
    >
      📋 Itinerario
    </button>
  </div>
</div>
    {/* CONTENIDO PRINCIPAL */}
<div
  className="relative min-h-[100dvh] p-6 overflow-hidden text-gray-800 bg-gradient-to-b from-[var(--color-cuatro)] to-[var(--color-verde)] transition-all duration-300 ease-in-out"
>
{/* Contenedor del mapa + formulario a la derecha */}
<div className={`${vistaMovil !== 'mapa' ? 'hidden md:block' : ''}`}>
  <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 xl:px-8">
<div
  className={[
    'relative rounded-xl shadow-lg overflow-hidden',
    'h-[80vh] sm:h-[85vh] md:h-[90vh] lg:h-[100vh]',
    (mapboxFull && mostrarMapaMapbox && vistaMovil === 'mapa')
      ? 'fixed inset-0 z-[60] rounded-none shadow-none h-[100dvh]'
      : '',
  ].join(' ')}
>
      {/* Botones flotantes del mapa */}
      <div className="absolute top-2 left-2 z-20 flex gap-2">
        <button
          onClick={() => setMostrarMapaMapbox(v => !v)}
          className="bg-white border border-gray-300 px-4 py-2 rounded shadow hover:bg-gray-100 transition"
        >
          {mostrarMapaMapbox ? '🌐 Ver mapa SVG' : '🗺️ Ver mapa Mapbox'}
        </button>
      </div>

      {/* Layout: mapa (izquierda) + panel derecho (formulario) */}
      <div className="flex flex-col lg:flex-row h-full">
        {/* MAPA */}
        <div className="relative flex-1">
          {mostrarMapaMapbox ? (
            <>
              <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
              {clickCoords && (
                <div className="absolute bottom-3 left-3 z-40 bg-white/85 p-2 rounded shadow text-xs">
                  <div className="font-medium">📍 Coordenadas</div>
                  <div>Lat: {clickCoords.lat.toFixed(5)}</div>
                  <div>Lng: {clickCoords.lng.toFixed(5)}</div>
                </div>
              )}
            </>
          ) : (
            <div
              ref={containerRef}
              className="absolute inset-0 w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
            >
              {tooltipSeleccion && (
                <div className="absolute top-3 right-3 z-40 bg-white/90 text-blue-900 text-sm font-medium px-3 py-2 rounded-xl shadow-lg border border-blue-300">
                  {tooltipSeleccion}
                </div>
              )}
              {tooltip.visible && (
                <div
                  className="absolute z-40 bg-yellow-200 text-gray-800 text-xs sm:text-sm font-bold px-3 py-2 rounded-xl shadow-lg border-2 border-amber-300"
                  style={{
                    top: Math.min(tooltip.y + 24, window.innerHeight - 56),
                    left: Math.min(tooltip.x + 24, window.innerWidth - 160),
                  }}
                >
                  🌸 {tooltip.name}
                </div>
              )}
              {gifVisible && (
                <img
                  src={gifVillahermosa}
                  alt="Villahermosa"
                  className="absolute z-30 w-40 sm:w-52 rounded-xl shadow-lg border-4 border-white"
                  style={{ top: gifPosition.y + 40, left: gifPosition.x + 40 }}
                />
              )}
            </div>
          )}
        </div>

{/* PANEL DERECHO: formulario (solo en escritorio/tablet) */}
<aside
  className={`hidden md:block md:w-[420px] h-full bg-white/90 backdrop-blur p-6 
              border-t lg:border-t-0 lg:border-l border-gray-200 overflow-y-auto 
              ${mostrarZonas ? 'border-yellow-300' : 'border-teal-300'}`}
>
  <ItinerarioForm />
</aside>

      </div>
    </div>
  </div>
</div>
{/* Vista móvil de Itinerario: formulario a pantalla completa */}
{vistaMovil === 'itinerario' && (
  <div className="md:hidden w-full max-w-screen-xl mx-auto px-4 sm:px-6 xl:px-8">
    <aside className="w-full bg-white/90 backdrop-blur p-6 border-t border-gray-200 overflow-y-auto rounded-xl shadow-lg">
      <ItinerarioForm />
    </aside>
  </div>
)}

      </div>
    </>
  );
}
export default MapaTabasco;
function getCoordenadasZona(nombre) {
  const coords = {
    'Centro Histórico / Zona Luz': [-92.928, 17.989],
    'Paseo Tabasco': [-92.920, 17.990],
    'Parque Tomás Garrido y Laguna de las Ilusiones': [-92.942, 17.998],
    'Tabasco 2000': [-92.905, 17.998],
    'Yumká': [-92.831, 18.019],
    'Museo Carlos Pellicer': [-92.928, 17.986],
    'Museo Papagayo': [-92.921, 17.983],
  };
  return coords[nombre] || [-92.9, 17.9];
}