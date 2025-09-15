import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import mapboxgl from 'mapbox-gl';

// --- RUTAS DE ASSETS ---
import tabascoSvg from '../../assets/svg/Tabasco.svg?raw';
import gifVillahermosa from '../../assets/img/tabasco/Villahermosa.gif';
import popurriTabasco from '../../assets/img/tabasco/PopurriTabasco.mp3';
import { getSelecciones } from '../../utils/itinerarioStore';
import 'mapbox-gl/dist/mapbox-gl.css';


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function MapaTabasco({ onRegresar, estado, eventos }) {
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, name: '', x: 0, y: 0 });

  // Leer mes guardado en localStorage al iniciar
  const getInitialFormDataTabasco = () => {
    try {
      const draft = JSON.parse(localStorage.getItem("itinerario") || "{}");
      // Solo usar el borrador si pertenece a Tabasco o si no tiene estado definido.
      if (draft.estado === "Tabasco" || !draft.estado) {
        return {
          dias: '',
          tipo: '',
          lugarInicio: draft.lugarInicio || '',
          ultimoLugar: '',
          intereses: '',
          mes: draft.mes || '',
          email: '',
          modoDestino: (draft.modoDestino === 'automatico' ? 'auto' : (draft.modoDestino || ''))
        };
      }
    } catch (e) {
      console.error("Error al leer el borrador del itinerario:", e);
    }

    // Si el borrador es de otro estado o hay un error, empezar de cero.
    return {
      dias: '', tipo: '', lugarInicio: '', ultimoLugar: '',
      intereses: '', mes: '', email: '', modoDestino: ''
    };
  };

  const [formData, setFormData] = useState(getInitialFormDataTabasco);


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

  // Sincroniza el mes del dropdown con la fecha de inicio seleccionada
  useEffect(() => {
    if (fechaInicio) {
        const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
        const [year, month, day] = fechaInicio.split('-').map(Number);
        const startDate = new Date(year, month - 1, day);
        const monthName = meses[startDate.getMonth()];
        if (formData.mes !== monthName) {
            setFormData(prev => ({ ...prev, mes: monthName }));
        }
    }
  }, [fechaInicio]);

  // Calcula la fecha final automáticamente basado en la fecha de inicio y el número de días
  useEffect(() => {
    if (fechaInicio && formData.dias) {
      const [year, month, day] = fechaInicio.split('-').map(Number);
      const startDate = new Date(year, month - 1, day);
      startDate.setDate(startDate.getDate() + parseInt(formData.dias, 10) - 1);
      const newEndDate = startDate.toISOString().split('T')[0];
      setFechaFin(newEndDate);
    } else {
      setFechaFin('');
    }
  }, [fechaInicio, formData.dias]);

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
  // Estados del modo selección
  const [selecting, setSelecting] = useState(false);
  const [selectedMunicipios, setSelectedMunicipios] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("interesesMunicipios_Tabasco")) ?? [];
    } catch { return []; }
  });

  const toggleMunicipio = (nombre) => {
    setSelectedMunicipios(prev =>
      prev.includes(nombre)
        ? prev.filter(m => m !== nombre)
        : [...prev, nombre]
    );
  };

  const exitSelecting = () => {
    setSelecting(false);
  };

  const saveIntereses = () => {
    localStorage.setItem("interesesMunicipios_Tabasco", JSON.stringify(selectedMunicipios));
    // Opcional: sincroniza con el borrador del itinerario
    try {
      const it = JSON.parse(localStorage.getItem("itinerario")) || {};
      it.interesesSeleccionados = selectedMunicipios;
      if (!it.modoDestino) it.modoDestino = "automatico";
      if (!it.lugarInicio && selectedMunicipios[0]) it.lugarInicio = selectedMunicipios[0];
      localStorage.setItem("itinerario", JSON.stringify(it));
    } catch {}
    setSelecting(false);
  };

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  // Ref y tamaño para limitar el confeti al carrusel de eventos
  const eventsRef = useRef(null);
  const [eventsSize, setEventsSize] = useState({ width: 0, height: 0 });
   useEffect(() => {
    if (eventsRef.current) { const { width, height } = eventsRef.current.getBoundingClientRect(); setEventsSize({ width, height });}}, [mostrarZonas, eventoIndex]);
  const navigate = useNavigate();
  const doRegresar = () => {
    navigate('/mapa', { replace: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
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
    { nombre: 'Balancán',      coords: [-91.53461, 17.79953] },
    { nombre: 'Cardenas',      coords: [-93.37498, 17.99024] },
    { nombre: 'Centla',        coords: [-92.64063, 18.53639] },
    { nombre: 'Centro',        coords: [-92.9199, 17.9895] },
    { nombre: 'Comalcalco',    coords: [-93.22458, 18.25434] },
    { nombre: 'Cunduacán',     coords: [-93.17529, 18.06490] },
    { nombre: 'Emiliano Zapata', coords: [-91.77324, 17.73491] },
    { nombre: 'Huimanguillo',  coords: [-93.39110, 17.83520] },
    { nombre: 'Jalapa',        coords: [-92.81256, 17.72047] },
    { nombre: 'Jalpa de Méndez', coords: [-93.0675, 18.1754] },
    { nombre: 'Jonuta',        coords: [-92.13646, 18.08910] },
    { nombre: 'Macuspana',     coords: [-92.5973, 17.7579] },
    { nombre: 'Nacajuca',      coords: [-92.9834, 18.1694] },
    { nombre: 'Paraíso',       coords: [-93.2170, 18.4086] },
    { nombre: 'Tacotalpa',     coords: [-92.82570, 17.59481] },
    { nombre: 'Teapa',         coords: [-92.94880, 17.55858] },
    { nombre: 'Tenosique',     coords: [-91.4225, 17.4694] }
  ];
  // ⬇️ Picker de Origen/Destino
  const [showODPicker, setShowODPicker] = useState(false);
  const [origenSel, setOrigenSel] = useState(formData.lugarInicio || "");
  const [destinoSel, setDestinoSel] = useState(formData.ultimoLugar || "");
  // utilitario rápido para lista ordenada alfabéticamente
  const listaMunicipios = [...municipiosTabasco]
    .map(m => m.nombre)
    .sort((a,b) => a.localeCompare(b, 'es'));
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
      new mapboxgl.Popup({ closeOnClick: true, offset: 10, className: 'custom-popup' })
        .setLngLat([lng, lat])
        .setHTML(`
          <strong>📍 Coordenadas</strong><br>
          Lat: ${lat.toFixed(5)}<br>
          Lng: ${lng.toFixed(5)}
        `)
        .addTo(map);
    });

    // Marcadores de zonas de interés personalizados
    zonasVillahermosa.forEach((zona) => {
        const el = document.createElement('div');
        el.className = 'custom-marker-zona';
        el.innerHTML = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="map-marker-alt" class="svg-inline--fa fa-map-marker-alt fa-w-12" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67a24 24 0 0 1-35.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path></svg>`;

        new mapboxgl.Marker(el)
        .setLngLat(getCoordenadasZona(zona.nombre))
        .setPopup(new mapboxgl.Popup({ offset: 35, className: 'custom-popup' }).setHTML(`<h3>${zona.nombre}</h3><p>${zona.descripcion}</p>`))
        .addTo(map);
    });

    // Marcadores de municipios personalizados
    municipiosTabasco.forEach((municipio) => {
      const el = document.createElement('div');
      el.className = 'custom-marker-municipio';

      const marker = new mapboxgl.Marker(el)
        .setLngLat(municipio.coords)
        .setPopup(
          new mapboxgl.Popup({ offset: 25, className: 'custom-popup' }).setHTML(
            `<h3>${municipio.nombre}</h3><p>Municipio de Tabasco</p>`
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
 // ✅ NUEVO: arma diasData mezclando selecciones de VARIOS municipios
const buildDiasDataDesdeMultiplesSelecciones = ({ municipios = [], dias, mes }) => {
  if (!Array.isArray(municipios) || municipios.length === 0) return [];

  // trae todas las selecciones de esos municipios
  const todas = (getSelecciones() || []).filter(s => municipios.includes(s.municipio));

  // prioriza eventos del mes activo
  const esEventoDelMes = (s) =>
    s.tipo === 'evento' &&
    mes &&
    String(s.meta?.mes || s.meta?.fecha || '').toLowerCase()
      .includes(String(mes).toLowerCase());

  const ordenadas = [...todas].sort((a, b) => (esEventoDelMes(b) ? 1 : 0) - (esEventoDelMes(a) ? 1 : 0));

  // reparte en round-robin por día para balancear
  const n = Math.max(1, parseInt(dias || '1', 10));
  const diasData = Array.from({ length: n }, (_, i) => ({ dia: i + 1, actividades: [] }));

  ordenadas.forEach((s, idx) => {
    const d = idx % n;
    diasData[d].actividades.push({
      titulo: s.nombre,
      icono: s.icono || '📍',
      tipo: s.tipo,
      meta: s.meta || {},
      municipio: s.municipio,
    });
  });

  return diasData;
};


// --- Subcomponente para reutilizar el formulario de itinerario ---
const ItinerarioForm = () => {
  // --- CAMBIO DE DISEÑO ---: Lista de intereses para los nuevos botones
  const interesesDisponibles = ["Naturaleza", "Compras", "Arte", "Museos", "Gastronomía", "Aventura"];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const errores = [];
        if (!formData.dias) errores.push("📅 Indica los días de viaje");
        if (!formData.tipo) errores.push("💰 Elige un presupuesto estimado");
        if (!formData.mes) errores.push("📆 Elige un mes");
        if (!fechaInicio || !fechaFin) errores.push("🗓 Selecciona fechas de viaje");
         if (formData.modoDestino === "manual") {
     if (!formData.lugarInicio) errores.push("🏁 Elige el Origen (municipio)");
     if (!formData.ultimoLugar) errores.push("🎯 Elige el Destino (municipio)");
   }
        if (errores.length > 0) { setErrorEvento(errores); return; }
        setErrorEvento(false);

        let { lugarInicio, ultimoLugar } = formData;
        const interesesArr = formData.intereses ? formData.intereses.split(", ").filter(Boolean) : [];
        const presupuestoMXN = tipoPresupuestoADinero(formData.tipo);
        const monedas = convertirMonedas(presupuestoMXN);

        let actividadesSugeridas = [];
        let eventosMes = [];
        let diasData = [];

        // lee la lista que se guarda cuando el usuario da "Me interesa"
        let municipiosInteres = [];
        try {
            municipiosInteres = JSON.parse(localStorage.getItem("interesesMunicipios_Tabasco")) || [];
        } catch { municipiosInteres = []; }

        // ✅ CORRECCIÓN: Primero revisamos si la intención es un viaje de enfoque local.
        if ((formData.modoDestino === "auto") && lugarInicio) {
            // Esta condición ahora tiene prioridad y se ejecutará correctamente.
            diasData = buildDiasDataDesdeSelecciones({
            municipio: lugarInicio,
            dias: formData.dias,
            mes: formData.mes
            });
            ultimoLugar = ultimoLugar || lugarInicio;

        } else if (municipiosInteres.length >= 2) {
            // Esta lógica solo se ejecutará si el modo NO es "auto", es decir, un viaje multi-destino intencional.
            if (!lugarInicio)  lugarInicio  = municipiosInteres[0];
            if (!ultimoLugar)  ultimoLugar  = municipiosInteres[municipiosInteres.length - 1];

            diasData = buildDiasDataDesdeMultiplesSelecciones({
            municipios: municipiosInteres,
            dias: formData.dias,
            mes: formData.mes
            });
            
        } else if (!lugarInicio || !ultimoLugar) {
            // La sugerencia fallback sigue funcionando igual.
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

        if (actividadesSugeridas.length === 0 && (!diasData || diasData.length === 0)) {
            // al menos una actividad descriptiva
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
      // --- CAMBIO DE DISEÑO ---: Se aumenta el espaciado general del formulario
      className="flex flex-col gap-6 text-sm"
    >
      {/* --- CAMBIO DE DISEÑO ---: Encabezado del formulario más prominente y centrado */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Planea tu Aventura</h2>
        <p className="text-slate-500 text-sm">Completa los datos para crear tu ruta ideal por Tabasco</p>
      </div>


      {Array.isArray(errorEvento) && errorEvento.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
          <ul className="list-disc list-inside">
            {errorEvento.map((msg, i) => <li key={i}>{msg}</li>)}
          </ul>
        </div>
      )}

      {/* --- CAMBIO DE DISEÑO (ORDEN LÓGICO) ---: Sección 1 para fechas y duración */}
      <div className="space-y-4 rounded-lg border border-slate-200 p-4">
        <label className="block text-sm font-semibold text-slate-700">1. ¿Cuándo y por cuánto tiempo?</label>
        
        <div className="relative">
          <select
            value={formData.mes || ''}
            onChange={e => {
              const nuevoMes = e.target.value;
              setFormData({ ...formData, mes: nuevoMes });
              const it = JSON.parse(localStorage.getItem("itinerario") || "{}");
              localStorage.setItem("itinerario", JSON.stringify({ ...it, mes: nuevoMes }));
            }}
            className="w-full appearance-none border-2 border-slate-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            required
          >
            <option value="" disabled>Elige el mes de inicio</option>
            {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>

        <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const actual = parseInt(formData.dias || "1");
                if (actual > 1) setFormData({ ...formData, dias: String(actual - 1) });
              }}
              className="w-10 h-10 flex items-center justify-center bg-slate-200 rounded-full text-lg font-bold hover:bg-slate-300 transition-colors"
            >−</button>
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
              placeholder="N° de días"
              className="w-full text-center text-lg font-semibold border-2 border-slate-200 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
            <button
              type="button"
              onClick={() => {
                const actual = parseInt(formData.dias || "0");
                if (actual < 30) setFormData({ ...formData, dias: String(actual + 1) });
              }}
              className="w-10 h-10 flex items-center justify-center bg-slate-200 rounded-full text-lg font-bold hover:bg-slate-300 transition-colors"
            >+</button>
        </div>

        {/* --- LÓGICA CORREGIDA ---: Se eliminan las restricciones y la fecha final es de solo lectura */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full pt-2">
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            required
          />
          <span className="text-slate-500 font-semibold">→</span>
          <input
            type="date"
            min={fechaInicio || ''}
            value={fechaFin}
            readOnly
            className="w-full border-2 border-slate-200 rounded-lg px-4 py-2 bg-slate-100 cursor-not-allowed focus:outline-none transition"
            required
          />
        </div>
      </div>

      {/* --- CAMBIO DE DISEÑO (ORDEN LÓGICO) ---: Sección 2 para la ruta */}
      <div className="space-y-4 rounded-lg border border-slate-200 p-4">
        <label className="block text-sm font-semibold text-slate-700">2. Elige tu ruta</label>
        <div className="flex items-center justify-between bg-slate-100 rounded-lg p-1 text-sm">
          <span className="text-slate-600 pl-2">¿Sabes a dónde ir?</span>
          <div className="flex gap-1">
            <button
              type="button"
              className={`px-3 py-1 rounded-md transition text-xs font-semibold ${
                formData.modoDestino === "manual" ? "bg-white text-orange-600 shadow" : "bg-transparent text-slate-500 hover:bg-white/50"
              }`}
              onClick={() => {
                setFormData(prev => ({ ...prev, modoDestino: "manual" }));
                setOrigenSel(formData.lugarInicio || "");
                setDestinoSel(formData.ultimoLugar || "");
                setShowODPicker(true);
              }}
            >
              Elegir
            </button>
            <button
              type="button"
              className={`px-3 py-1 rounded-md transition text-xs font-semibold ${
                formData.modoDestino === "auto" ? "bg-white text-orange-600 shadow" : "bg-transparent text-slate-500 hover:bg-white/50"
              }`}
              onClick={() => setFormData(prev => ({ ...prev, modoDestino: "auto" }))}
            >
              Automático
            </button>
          </div>
        </div>
        {formData.modoDestino === "manual" && (formData.lugarInicio || formData.ultimoLugar) && (
          <div className="text-xs space-y-1">
            {formData.lugarInicio && (
              <span className="inline-block bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full mr-2">
                Origen: <strong>{formData.lugarInicio}</strong>
              </span>
            )}
            {formData.ultimoLugar && (
              <span className="inline-block bg-sky-100 text-sky-900 px-3 py-1 rounded-full">
                Destino: <strong>{formData.ultimoLugar}</strong>
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* --- CAMBIO DE DISEÑO (ORDEN LÓGICO) ---: Sección 3 para estilo y gustos */}
       <div className="space-y-4 rounded-lg border border-slate-200 p-4">
        <label className="block text-sm font-semibold text-slate-700">3. Define tu estilo y gustos</label>
        <div className="relative">
          <select
            value={formData.tipo || ''}
            onChange={e => setFormData({ ...formData, tipo: e.target.value })}
            className="w-full appearance-none border-2 border-slate-200 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            required
          >
            <option value="" disabled>💰 Presupuesto estimado</option>
            <option value="Económico">💸 Económico (hasta $1,000 MXN)</option>
            <option value="Moderado">💼 Moderado ($1,000 – $2,000 MXN)</option>
            <option value="Confort">🏨 Confort ($2,000 – $4,000 MXN)</option>
            <option value="Lujo">💎 Lujo (más de $4,000 MXN)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700">
             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-2">
          {interesesDisponibles.map(interes => {
            const isSelected = formData.intereses?.includes(interes);
            return (
              <button
                key={interes}
                type="button"
                onClick={() => {
                  const actuales = formData.intereses?.split(', ').filter(Boolean) || [];
                  if (isSelected) {
                    const nuevos = actuales.filter(i => i !== interes);
                    setFormData({ ...formData, intereses: nuevos.join(', ') });
                  } else {
                    const nuevos = [...actuales, interes];
                    setFormData({ ...formData, intereses: nuevos.join(', ') });
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-all ${
                  isSelected
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'bg-white hover:bg-orange-50 hover:border-orange-300 border-slate-200'
                }`}
              >
                {interes}
              </button>
            );
          })}
        </div>
      </div>

      {/* --- CAMBIO DE DISEÑO ---: Botones finales con más jerarquía visual */}
      <div className="flex flex-col gap-3 pt-6 border-t border-slate-200">
        <button type="submit" className="w-full bg-orange-500 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
          CREAR MI ITINERARIO
        </button>
        <button type="button" onClick={doRegresar} className="w-full bg-transparent text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
          Regresar al mapa
        </button>
      </div>
    </form>
  );
};


return (
  <>
    <style>{`
      .custom-marker-municipio {
        width: 18px;
        height: 18px;
        background-color: #1E90FF;
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 0 0 2px rgba(30, 144, 255, 0.5);
        transition: transform 0.1s ease-in-out;
      }
      .custom-marker-municipio:hover {
        transform: scale(1.2);
      }
      .custom-marker-zona {
        width: 28px;
        height: 28px;
        color: #FF5733;
        cursor: pointer;
        filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));
        transition: transform 0.1s ease-in-out;
      }
      .custom-marker-zona:hover {
        transform: scale(1.2);
      }
      .custom-popup .mapboxgl-popup-content {
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        background-color: white;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border: none;
      }
      .custom-popup .mapboxgl-popup-tip {
        display: none;
      }
      .custom-popup h3 {
        font-weight: 700;
        font-size: 1rem;
        color: #1e293b;
        margin-bottom: 0.25rem;
        margin-top: 0;
      }
       .custom-popup p {
        font-size: 0.875rem;
        color: #64748b;
        margin: 0;
       }
       .custom-popup .mapboxgl-popup-close-button {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: none;
          border-radius: 50%;
          background-color: transparent;
          cursor: pointer;
          font-size: 20px;
          line-height: 1;
          color: #9ca3af; /* gris-400 */
          transition: background-color 0.2s, color 0.2s;
       }
       .custom-popup .mapboxgl-popup-close-button:hover {
          background-color: #f3f4f6; /* gris-100 */
          color: #1f2937; /* gris-800 */
       }
      
      /* --- ESTILOS PARA EL REPRODUCTOR DE AUDIO --- */
      .custom-audio-player {
        background-color: white;
        border-radius: 50px;
        padding: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        border: 1px solid #e2e8f0;
        width: 300px;
        transition: all 0.3s ease;
      }
      .custom-audio-player:hover {
        box-shadow: 0 8px 20px rgba(0,0,0,0.2);
        transform: translateY(-2px);
      }
      .custom-audio-player::-webkit-media-controls-enclosure {
        background-color: transparent;
      }
      .custom-audio-player::-webkit-media-controls-panel {
        padding: 0;
        margin: 0;
      }
      .custom-audio-player::-webkit-media-controls-timeline {
        border-radius: 4px;
        height: 6px;
        background-color: #f1f5f9;
        border: none;
        margin: 0 10px;
      }
      .custom-audio-player::-webkit-media-controls-play-button,
      .custom-audio-player::-webkit-media-controls-pause-button {
        color: #F39106;
        border-radius: 50%;
        background-color: #fef3c7;
      }

    `}</style>

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
    <div className="relative min-h-[100dvh] p-6 overflow-hidden text-gray-800 bg-[#EAEAEA]">
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
            {/* Layout: mapa (izquierda) + panel derecho (formulario) */}
            <div className="flex flex-col lg:flex-row h-full">
              {/* MAPA (NUEVO DISEÑO) --- CON CORRECCIÓN PARA MÓVIL --- */}
              <div className="relative flex-1 p-2 sm:p-4 lg:p-6">
                {/* 1. Forma de color desfasada (fondo) */}
                <div className="absolute inset-0 bg-[#F39106] rounded-3xl"></div>

                {/* 2. Contenedor principal del mapa con fondo blanco y detalles */}
                <div className="relative z-10 w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
                  {/* Encabezado del mapa con el selector SVG/Mapbox */}
                  <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800">
                      Mapa de <span className="text-[#F39106]">Tabasco</span>
                    </h2>
                    <button
                      onClick={() => setMostrarMapaMapbox(v => !v)}
                      className="bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition text-sm font-medium"
                    >
                      {mostrarMapaMapbox ? '🗺️ Ver SVG' : '🌐 Ver Mapbox'}
                    </button>
                  </div>

                  {/* Contenido del mapa (SVG o Mapbox) */}
                  <div className="relative flex-1 overflow-hidden">
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
                          <div className="absolute top-3 right-3 z-40 bg-white text-zinc-800 text-sm font-medium px-4 py-2 rounded-lg shadow-xl border border-gray-200">
                            {tooltipSeleccion}
                          </div>
                        )}
                        {tooltip.visible && (
                          <div
                            className="absolute z-40 bg-white text-zinc-800 text-sm p-2.5 rounded-lg shadow-xl border border-gray-200 pointer-events-none flex items-center gap-2"
                            style={{
                              top: Math.min(tooltip.y + 24, window.innerHeight - 56),
                              left: Math.min(tooltip.x + 24, window.innerWidth - 160),
                            }}
                          >
                            <span className="text-lg leading-none" aria-hidden="true">📍</span>
                            <span className="font-semibold">{tooltip.name}</span>
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
                </div> 
              </div>

              {/* --- CAMBIO DE DISEÑO ---: Contenedor del panel derecho con nuevos estilos */}
              <aside
                className={`hidden md:block md:w-[420px] h-full bg-slate-50 p-6 lg:p-8 
                            border-t lg:border-t-0 lg:border-l border-slate-200 overflow-y-auto`}
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

      {/* --- REPRODUCTOR DE MÚSICA POSICIONADO A LA IZQUIERDA --- */}
      <div className="fixed bottom-6 left-6 z-50">
        <audio 
          src={popurriTabasco} 
          controls 
          loop
          className="custom-audio-player"
        >
          Tu navegador no soporta el elemento de audio.
        </audio>
      </div>
    </div>
    {showODPicker && (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40">
        <div className="w-full max-w-lg bg-white white:bg-neutral-900 rounded-2xl shadow-xl border dark:border-neutral-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Elegir Origen y Destino</h3>
            <button
              onClick={() => setShowODPicker(false)}
              className="rounded-md px-2 py-1 border dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Origen</label>
              <select
                value={origenSel}
                onChange={(e) => setOrigenSel(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-100 text-gray-900"

              >
                <option value="" disabled>Selecciona municipio…</option>
                {listaMunicipios.map((nom) => (
                  <option key={nom} value={nom}>{nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Destino</label>
              <select
                value={destinoSel}
                onChange={(e) => setDestinoSel(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-100 text-gray-900"

              >
                <option value="" disabled>Selecciona municipio…</option>
                {listaMunicipios.map((nom) => (
                  <option key={nom} value={nom}>{nom}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-600 dark:text-gray-300">
            Consejo: puedes elegir el mismo municipio para un viaje local (origen = destino).
          </div>

          <div className="flex justify-end gap-2 mt-5">
            <button
              onClick={() => setShowODPicker(false)}
              className="px-3 py-2 rounded-lg border dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                // ✅ Validar que ambos estén en "Me interesa" (Tabasco)
                const intereses = JSON.parse(localStorage.getItem("interesesMunicipios_Tabasco") || "[]");
                if (!origenSel || !destinoSel) {
                  alert("Elige origen y destino.");
                  return;
                }
                if (!intereses.includes(origenSel) || !intereses.includes(destinoSel)) {
                  alert('Debes marcar "Me interesa" en ambos municipios antes de elegirlos.');
                  return;
                }
                if (!origenSel || !destinoSel) return;

                // fija en el formulario
                setFormData(prev => ({
                  ...prev,
                  modoDestino: "manual",
                  lugarInicio: origenSel,
                  ultimoLugar: destinoSel
                }));

                // opcional: persiste en el borrador del itinerario
                try {
                  const it = JSON.parse(localStorage.getItem("itinerario") || "{}");
                  localStorage.setItem("itinerario", JSON.stringify({
                    ...it,
                    modoDestino: "manual",
                    origen: origenSel,
                    destino: destinoSel,
                    lugarInicio: origenSel
                  }));
                } catch {}

                setShowODPicker(false);
              }}
              className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    )}
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