import { useState, useEffect, useRef } from 'react';
import { addSeleccion, getSelecciones, removeSeleccion } from '../utils/itinerarioStore';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import logo from '../assets/Logo.png';



const datosMunicipios = {
  "Balancán": {
    descripcion: "Balancán se encuentra al oriente del estado y es famoso por su biodiversidad y zonas ribereñas.",
    lugares: ["Reserva de la Biosfera Usumacinta", "Río San Pedro"]
  },
  "Cardenas": {
    descripcion: "Cárdenas es un municipio importante por su agricultura y la cercanía a la costa del Golfo.",
    lugares: ["Playa Pico de Oro", "Centro de la ciudad"]
  },
  "Centla": {
    descripcion: "Centla alberga la Reserva de la Biosfera Pantanos de Centla, un importante humedal del sur de México.",
    lugares: ["Reserva de Pantanos de Centla", "Frontera"]
  },
  "Centro": {
    descripcion: "Centro es el municipio donde se ubica Villahermosa, capital de Tabasco, y concentra la mayor actividad económica y cultural.",
    lugares: ["Parque-Museo La Venta – museo al aire libre con una de las colecciones olmecas más importantes del país (cabezas colosales, altares, estelas).", "Malecón “Carlos A. Madrazo” (río Grijalva) – corredor peatonal y ciclovía con nueva infraestructura urbana e iluminación; obra inaugurada en 2024.", "Laguna de las Ilusiones – símbolo natural de la ciudad; miradores y parques a su alrededor.", "Museo Regional de Antropología “Carlos Pellicer Cámara” – arqueología y etnografía regional (Olmeca y Maya).","Yumká (Centro de Interpretación y Convivencia con la Naturaleza) – recorrido guiado por selva, sabana y humedales."],
    sitiosTop: [
  "Parque-Museo La Venta (olmecas + zoológico ligero a cielo abierto, junto a la Laguna de las Ilusiones).",
  "Malecón Carlos A. Madrazo / corredor del Grijalva (nuevo paseo ribereño con actividades dominicales ‘Tertulias del Grijalva’).",
  "Centro Histórico de Villahermosa / Barrio Mágico Zona Luz (Plaza de Armas, Catedral, casonas, Casa Barrio Mágico y rutas peatonales).",
  "Museo Regional de Antropología “Carlos Pellicer Cámara” (colección maya/olmeca/zoque clave para entender Tabasco).",
  "Yumká – Área Natural Protegida (safari y educación ambiental).",
  "Planetario Tabasco 2000 (OMNIMAX, talleres y funciones)."
],
    sitiosOcultos: [
  "Parque Tomás Garrido Canabal – pulmón urbano junto a la laguna, con el Mirador de las Águilas y conexión al circuito cultural del área.",
  "MUSEVI (Museo Elevado de Villahermosa) – pasarela-museo contemporánea sobre Paseo Tabasco, parte del 'Paseo de las Ilusiones'.",
  "Parque La Pólvora – áreas verdes y senderos alrededor de una laguna urbana, ideal para birding y ejercicio.",
  "Barrio Mágico Zona Luz – centro histórico con el Callejón Puerto Escondido, Escalinatas de Lerdo, Parroquia de la Inmaculada y Observatorio Turístico; rutas peatonales poco explotadas por el turismo."
],
    eventos: [
    { nombre: "Feria Tabasco", fecha: "Mayo" }],
    artesanias: [
    { nombre: "Máscaras chontales", precio: "desde $250" },
    { nombre: "Cacao artesanal", precio: "desde $120" }],
 talleres: [
    "Casa universitaria CacaCacao – Talleres y catas alrededor del cacao",
    "Pa’que te quedes en Villa – Tours urbanos (ruta del cacao, cantinas, mercado Pino Suárez, city tour)",
    "Bibliotecas municipales (DECUR) – Cursos/talleres temporales"
  ],
  gastronomia: [
    "Puchero tabasqueño",
    "Pejelagarto asado",
    "Pozol y chorote",
    "Tamales de chipilín",
    "Chocolate/cacao local (marcas como CACEP)"
  ]
    
  },
  "Comalcalco": {
    descripcion: "Comalcalco destaca por su zona arqueológica de origen maya construida con ladrillos de barro.",
    lugares: ["Zona Arqueológica de Comalcalco", "Fábricas de chocolate"]
  },
  "Cunduacán": {
    descripcion: "Municipio conocido por su agricultura y cercanía a Villahermosa.",
    lugares: ["Centro cultural", "Río Mezcalapa"]
  },
  "Emiliano Zapata": {
    descripcion: "Ubicado en la frontera con Chiapas, tiene paisajes naturales y ríos atractivos.",
    lugares: ["Malecón del Usumacinta", "Zona ecoturística"]
  },
  "Huimanguillo": {
    descripcion: "Municipio extenso con riqueza ganadera y petrolera.",
    lugares: ["Grutas de Villa Luz", "Balnearios naturales"]
  },
  "Jalapa": {
    descripcion: "Conocido por su vegetación, cafetales y artesanías.",
    lugares: ["Parque central", "Fincas cafetaleras"]
  },
  "Jalpa de Méndez": {
    descripcion: "Famoso por su producción de horchata de coco y eventos culturales.",
    lugares: ["Mercado municipal", "Iglesia principal"]
  },
  "Jonuta": {
    descripcion: "Municipio tranquilo con actividad pesquera.",
    lugares: ["Río Usumacinta", "Zona de pesca"]
  },
  "Macuspana": {
    descripcion: "Municipio natal de importantes figuras políticas, con selvas y ríos.",
    lugares: ["Grutas de Macuspana", "Balnearios naturales"]
  },
"Nacajuca": {
  descripcion: "Zona chontal con rica cultura, tradiciones y artesanías.",
  lugares: ["Poblados chontales", "Artesanías típicas"],

  sitiosTop: [
    "Poblado Mazateupa – conocido por sus artesanías en palma y bordados.",
    "Iglesia de San Antonio de Padua – arquitectura colonial en la cabecera municipal.",
    "Laguna de Nacajuca – paseo en cayuco y avistamiento de aves."
  ],

  sitiosOcultos: [
    "Comunidad Tapotzingo – talleres de alfarería tradicional.",
    "La Playita en Guatacalca – recreación local poco conocida.",
    "Senderos ecoturísticos en Oxiacaque."
  ],

  eventos: [
    { nombre: "Fiesta Patronal de San Antonio de Padua", fecha: "Junio" },
    { nombre: "Festival de la Palma y la Cestería", fecha: "Octubre" }
  ],

  artesanias: [
    { nombre: "Cestería de palma", precio: "desde $80" },
    { nombre: "Bordados chontales", precio: "desde $150" },
    { nombre: "Máscaras y figuras de madera", precio: "desde $200" }
  ],

  talleres: [
    "Taller de cestería en Mazateupa",
    "Taller de alfarería en Tapotzingo",
    "Visitas guiadas a comunidades chontales"
  ],

  gastronomia: [
    "Chirmol de pato",
    "Tamales de chipilín",
    "Pescado en hoja de momo",
    "Pozol con cacao"
  ]
},

  "Paraíso": {
    descripcion: "Puerto y municipio costero, con playas y desarrollo petrolero.",
    lugares: ["Puerto Dos Bocas", "Playa Paraíso"]
  },
  "Tacotalpa": {
    descripcion: "Ubicado en la sierra, con atractivos naturales y cafetales.",
    lugares: ["Villa Tapijulapa", "Grutas de Coconá"]
  },
  "Teapa": {
    descripcion: "Conocido por su café, montañas y paisajes.",
    lugares: ["Cerro El Madrigal", "Balnearios"]
  },
  "Tenosique": {
    descripcion: "Municipio fronterizo con Chiapas y Guatemala, con historia y zonas naturales.",
    lugares: ["Cueva del Tigre", "Zona arqueológica de Pomoná"]
  }
};
// 🎨 Tema por municipio (colores, clases y medios)
const THEME_BY_MUNICIPIO = {
  "Balancán": {
    header: new URL('../assets/balancan-header.jpg', import.meta.url).href,
    bg: 'bg-teal-50', title: 'text-teal-800', card: 'bg-white/80',
    btnPrimary: 'bg-teal-600 hover:bg-teal-700 text-white',
    btnSecondary: 'bg-teal-100 hover:bg-teal-200 text-teal-800',
    badge: 'bg-teal-100 text-teal-800'
  },
  "Cardenas": {
    header: new URL('../assets/cardenas-header.jpg', import.meta.url).href,
    bg: 'bg-amber-50', title: 'text-amber-800', card: 'bg-white/80',
    btnPrimary: 'bg-amber-600 hover:bg-amber-700 text-white',
    btnSecondary: 'bg-amber-100 hover:bg-amber-200 text-amber-800',
    badge: 'bg-amber-100 text-amber-800'
  },
  "Centla": {
    header: new URL('../assets/centla-header.jpg', import.meta.url).href,
    bg: 'bg-sky-50', title: 'text-sky-800', card: 'bg-white/80',
    btnPrimary: 'bg-sky-600 hover:bg-sky-700 text-white',
    btnSecondary: 'bg-sky-100 hover:bg-sky-200 text-sky-800',
    badge: 'bg-sky-100 text-sky-800'
  },
  "Centro": {
    header: new URL('../assets/centro-header.jpg', import.meta.url).href,
    bg: 'bg-emerald-50', title: 'text-emerald-800', card: 'bg-white/80',
    btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    btnSecondary: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-800'
  },
  "Comalcalco": {
    header: new URL('../assets/comalcalco-header.jpg', import.meta.url).href,
    bg: 'bg-orange-50', title: 'text-orange-800', card: 'bg-white/80',
    btnPrimary: 'bg-orange-600 hover:bg-orange-700 text-white',
    btnSecondary: 'bg-orange-100 hover:bg-orange-200 text-orange-800',
    badge: 'bg-orange-100 text-orange-800'
  },
  "Cunduacán": {
    header: new URL('../assets/cunduacan-header.jpg', import.meta.url).href,
    bg: 'bg-yellow-50', title: 'text-yellow-800', card: 'bg-white/80',
    btnPrimary: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    btnSecondary: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800',
    badge: 'bg-yellow-100 text-yellow-800'
  },
  "Emiliano Zapata": {
    header: new URL('../assets/emiliano-zapata-header.jpg', import.meta.url).href,
    bg: 'bg-lime-50', title: 'text-lime-800', card: 'bg-white/80',
    btnPrimary: 'bg-lime-600 hover:bg-lime-700 text-white',
    btnSecondary: 'bg-lime-100 hover:bg-lime-200 text-lime-800',
    badge: 'bg-lime-100 text-lime-800'
  },
  "Huimanguillo": {
    header: new URL('../assets/huimanguillo-header.jpg', import.meta.url).href,
    bg: 'bg-blue-50', title: 'text-blue-800', card: 'bg-white/80',
    btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
    btnSecondary: 'bg-blue-100 hover:bg-blue-200 text-blue-800',
    badge: 'bg-blue-100 text-blue-800'
  },
  "Jalapa": {
    header: new URL('../assets/jalapa-header.jpg', import.meta.url).href,
    bg: 'bg-lime-50', title: 'text-lime-800', card: 'bg-white/80',
    btnPrimary: 'bg-lime-600 hover:bg-lime-700 text-white',
    btnSecondary: 'bg-lime-100 hover:bg-lime-200 text-lime-800',
    badge: 'bg-lime-100 text-lime-800'
  },
  "Jalpa de Méndez": {
    header: new URL('../assets/jalpa-header.jpg', import.meta.url).href,
    bg: 'bg-fuchsia-50', title: 'text-fuchsia-800', card: 'bg-white/80',
    btnPrimary: 'bg-fuchsia-600 hover:bg-fuchsia-700 text-white',
    btnSecondary: 'bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-800',
    badge: 'bg-fuchsia-100 text-fuchsia-800'
  },
  "Jonuta": {
    header: new URL('../assets/jonuta-header.jpg', import.meta.url).href,
    bg: 'bg-rose-50', title: 'text-rose-800', card: 'bg-white/80',
    btnPrimary: 'bg-rose-600 hover:bg-rose-700 text-white',
    btnSecondary: 'bg-rose-100 hover:bg-rose-200 text-rose-800',
    badge: 'bg-rose-100 text-rose-800'
  },
  "Macuspana": {
    header: new URL('../assets/macuspana-header.jpg', import.meta.url).href,
    bg: 'bg-stone-50', title: 'text-stone-800', card: 'bg-white/80',
    btnPrimary: 'bg-stone-600 hover:bg-stone-700 text-white',
    btnSecondary: 'bg-stone-100 hover:bg-stone-200 text-stone-800',
    badge: 'bg-stone-100 text-stone-800'
  },
  "Nacajuca": {
    header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href,
    bg: 'bg-emerald-50', title: 'text-emerald-800', card: 'bg-white/80',
    btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    btnSecondary: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-800'
  },
  "Paraíso": {
    header: new URL('../assets/paraiso-header.jpg', import.meta.url).href,
    bg: 'bg-cyan-50', title: 'text-cyan-800', card: 'bg-white/80',
    btnPrimary: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    btnSecondary: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-800',
    badge: 'bg-cyan-100 text-cyan-800'
  },
  "Tacotalpa": {
    header: new URL('../assets/tacotalpa-header.jpg', import.meta.url).href,
    bg: 'bg-green-50', title: 'text-green-800', card: 'bg-white/80',
    btnPrimary: 'bg-green-600 hover:bg-green-700 text-white',
    btnSecondary: 'bg-green-100 hover:bg-green-200 text-green-800',
    badge: 'bg-green-100 text-green-800'
  },
  "Teapa": {
    header: new URL('../assets/teapa-header.jpg', import.meta.url).href,
    bg: 'bg-emerald-50', title: 'text-emerald-800', card: 'bg-white/80',
    btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    btnSecondary: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-800'
  },
  "Tenosique": {
    header: new URL('../assets/tenosique-header.jpg', import.meta.url).href,
    bg: 'bg-indigo-50', title: 'text-indigo-800', card: 'bg-white/80',
    btnPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    btnSecondary: 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800',
    badge: 'bg-indigo-100 text-indigo-800'
  },

  // Fallback
  _default: {
    header: null,
    bg: 'bg-amber-50', title: 'text-amber-800', card: 'bg-white/80',
    btnPrimary: 'bg-amber-600 hover:bg-amber-700 text-white',
    btnSecondary: 'bg-amber-100 hover:bg-amber-200 text-amber-800',
    badge: 'bg-amber-100 text-amber-800'
  }
};


const eventosCentroPorMes = {
  Enero: [
    "Pellicer Visual (artes visuales en homenaje a Carlos Pellicer; arranca el año)",
    "Programación cultural de enero vía Agenda DECUR"
  ],
  Febrero: [
    "Tardes de Carnaval (pre-carnaval, 28 feb–2 mar; música y comparsas en espacios públicos)",
    "Programa cultural febrero (cartelera oficial)"
  ],
  Marzo: [
    "Festival Guayacán & Macuilí (floraciones urbanas; conciertos, teatro, exposiciones)"
  ],
  Abril: [
    "Ciclo 'De la ciudad a la comunidad' – Tardes musicales en el quiosco (Parque Mestre)",
    "Agenda abril (talleres/expos en CCV y sedes barriales)"
  ],
  Mayo: [
    "Feria Tabasco (Parque Tabasco 'Dora María'; palenque, exposición ganadera, desfile) – 1 al 11 de mayo"
  ],
  Junio: [
    "Festival Villahermosa (arte, música, literatura; sedes CCV y Zona Luz)"
  ],
  Julio: [
    "Mis Vacaciones en la Biblioteca (talleres infantiles/juveniles en bibliotecas municipales)"
  ],
  Agosto: [
    "Agenda Cultural agosto: 7 Villas & Música Centro + talleres de verano en colonias y bibliotecas (Parques Parrilla, Tamulté, Los Pajaritos, CCV)"
  ],
  Septiembre: [
    "Fiestas Patrias – verbenas y conciertos en Parque Manuel Mestre (sábados del mes)"
  ],
  Octubre: [
    "Celebrando la Eternidad (Día de Muertos en Centro Histórico/Zona Luz: altares, catrinas, desfile)"
  ],
  Noviembre: [
    "Festival del Chocolate (exposiciones y catas; sede en Villahermosa) – 13 al 16 de noviembre"
  ],
  Diciembre: [
    "Nochebuena en Centro (programa navideño en foros, plazas y parques; música, pastorelas)"
  ]
};


function MunicipioDetalle() {
  const { nombre } = useParams();
  // Agregar selección al itinerario del usuario (dentro del componente)
const agregar = (payload) => {
  const id = `${nombre}-${payload.tipo}-${payload.nombre}`;
  const enriched = { ...payload, meta: { ...(payload.meta || {}), source: 'MunicipioDetalle' } };
  const ok = addSeleccion({ id, municipio: nombre, ...enriched });
  alert(`✅ ${payload.nombre} (${payload.tipo}) se registró en tu itinerario${ok ? '' : ' (ya estaba antes)'}`);
  setUltimoIdAgregado(id);
};



  const [interesado, setInteresado] = useState(false);
  useEffect(() => {
  const interesesActuales = JSON.parse(localStorage.getItem("interesesMunicipios")) || [];
  if (interesesActuales.includes(nombre)) {
    setInteresado(true);
  }
}, [nombre]);

  const [ultimoIdAgregado, setUltimoIdAgregado] = useState(null);
  const [seleccionesIds, setSeleccionesIds] = useState(new Set());
  const datos = datosMunicipios[nombre];
  // 🎨 Tema activo
const theme = THEME_BY_MUNICIPIO[nombre] || THEME_BY_MUNICIPIO._default;
// Leer mes guardado en localStorage al iniciar
const itinerarioPersistido = JSON.parse(localStorage.getItem("itinerario") || "{}");
const [mesSeleccionado, setMesSeleccionado] = useState(itinerarioPersistido?.mes || '');
const mesSelectRef = useRef(null);

// Detectar cambios en localStorage mientras la app está abierta
useEffect(() => {
  const handleStorageChange = () => {
    const it = JSON.parse(localStorage.getItem("itinerario") || "null");
    if (it?.mes) setMesSeleccionado(it.mes);
    try {
      const actuales = (getSelecciones() || []).map(s => s.id);
      setSeleccionesIds(new Set(actuales));
    } catch {}
   };

  window.addEventListener("storage", handleStorageChange);
  return () => window.removeEventListener("storage", handleStorageChange);
}, []);



// También actualizar al volver a este componente o cambiar de municipio
useEffect(() => {
  const it = JSON.parse(localStorage.getItem("itinerario") || "null");
  setMesSeleccionado(it?.mes || "");
  try {
    const actuales = (getSelecciones() || []).map(s => s.id);
    setSeleccionesIds(new Set(actuales));
  } catch {}
 }, [nombre]);


const navigate = useNavigate();
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


// Filtra eventos del municipio por el mes seleccionado (si hay mes)
const eventosFiltrados = (datos.eventos || []).filter(ev => {
  if (!mesSeleccionado) return true; // si aún no eligió mes, muestra todos
  return (ev.fecha || "").toLowerCase().includes(mesSeleccionado.toLowerCase());
});


  if (!datos) return <h2 className="p-10">Municipio no encontrado</h2>;

const manejarInteres = () => {
  setInteresado(true);
  localStorage.setItem("modoDestino", "automatico");
  alert(`¡Gracias! Has marcado interés en visitar ${nombre}`);

  // Guardar en localStorage
  const interesesActuales = JSON.parse(localStorage.getItem("interesesMunicipios")) || [];
  if (!interesesActuales.includes(nombre)) {
    interesesActuales.push(nombre);
    localStorage.setItem("interesesMunicipios", JSON.stringify(interesesActuales));
  }
 //  Guardar como destino en modo automático
const itinerarioPersistido = JSON.parse(localStorage.getItem("itinerario") || "{}");
localStorage.setItem("itinerario", JSON.stringify({
  ...itinerarioPersistido,
  lugarInicio: nombre,
  modoDestino: "automatico"
}));
};
const idDe = (payload) => `${nombre}-${payload.tipo}-${payload.nombre}`;

const estaAgregado = (payload) => seleccionesIds.has(idDe(payload));

const toggleSeleccion = (payload) => {
  const id = idDe(payload);
  if (seleccionesIds.has(id)) {
    removeSeleccion(id);
    const next = new Set(seleccionesIds);
    next.delete(id);
    setSeleccionesIds(next);
    setUltimoIdAgregado(null);
    alert(`❌ ${payload.nombre} (${payload.tipo}) se quitó de tu itinerario`);
  } else {
    const enriched = { ...payload, meta: { ...(payload.meta || {}), source: 'MunicipioDetalle' } };
    const ok = addSeleccion({ id, municipio: nombre, ...enriched });
    const next = new Set(seleccionesIds);
    next.add(id);
    setSeleccionesIds(next);
    setUltimoIdAgregado(id);
    alert(`✅ ${payload.nombre} (${payload.tipo}) se agregó a tu itinerario${ok ? '' : ' (ya estaba antes)'}`);
  }
};


  return (
      <div className="text-[var(--color-text)]">
    {/* ===== Header de Home ===== */}
    <header className="sticky top-0 z-50 w-full py-4 px-6 flex justify-between items-center bg-[var(--color-primary)] shadow-md">
<Link to="/" className="flex items-center gap-4">
  <img src={logo} alt="Pueblos de Ensueño - Logotipo" className="h-10 sm:h-12 w-auto" />
  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide drop-shadow-md text-black">
    Pueblos de Ensueño
  </h1>
</Link>

<nav className="hidden md:flex gap-3 lg:gap-5 items-center">
  <Link to="/mapa-tabasco">
    <button className="px-4 py-2 bg-[var(--orange-250)] hover:bg-[var(--color-secondary)] rounded-full font-semibold shadow-sm transition">
      ← Regresar al mapa
    </button>
  </Link>
  <Link to="/productos-tabasco" state={{ municipio: nombre }}>
    <button className="px-4 py-2 bg-[var(--orange-250)] hover:bg-[var(--color-secondary)] rounded-full font-semibold shadow-sm transition">
      {`Productos Artesanales de ${nombre || 'Centro'}`}
    </button>
  </Link>
  <button
    onClick={manejarInteres}
    className={`px-4 py-2 bg-[var(--orange-250)] hover:bg-[var(--color-secondary)] rounded-full font-semibold shadow-sm transition`}
  >
    {interesado ? '¡Te interesa!' : 'Me interesa'}
  </button>
</nav>


      <button className="block md:hidden text-gray-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
        <Menu size={24} />
      </button>
    </header>
{/* NAV MOBILE */}
{mobileMenuOpen && (
  <nav id="menu-movil" className="md:hidden bg-white shadow-md px-6 py-4 space-y-2 border-t border-black/10">
    <Link to="/mapa-tabasco">
      <button className="w-full px-4 py-2 rounded-lg font-semibold bg-[var(--color-primary)] hover:brightness-110 transition">
        ← Regresar al mapa
      </button>
    </Link>
    <Link to="/productos-tabasco" state={{ municipio: nombre }}>
      <button className="w-full px-4 py-2 rounded-lg font-semibold bg-[var(--color-secondary)] hover:brightness-110 transition">
        {`Productos Artesanales de ${nombre || 'Centro'}`}
      </button>
    </Link>
    <button
      onClick={manejarInteres}
      className={`w-full px-4 py-2 rounded-lg font-semibold text-white transition ${
        interesado ? 'bg-green-600' : 'bg-emerald-600 hover:bg-emerald-700'
      }`}
    >
      {interesado ? '¡Te interesa!' : 'Me interesa'}
    </button>
  </nav>
)}


{/* Contenido del municipio */}
<div className={`p-8 max-w-4xl mx-auto ${theme.bg}`}>
      {theme.header && (
  <img
    src={theme.header}
    alt={`Header ${nombre}`}
    className="w-full h-48 object-cover rounded-2xl mb-4"
  />
)}
<h1 className={`text-4xl font-bold mb-4 ${theme.title}`}>{nombre}</h1>

      <p className="mb-4 text-lg">{datos.descripcion}</p>

<h2 className={`text-2xl font-semibold mb-2 ${theme.title}`}>Lugares destacados:</h2>
<ul className="mb-6">
  {datos.lugares.map((lugar, idx) => (
    <li key={`lugar-${idx}`} className="flex items-center justify-between py-1">
      <span>📍 {lugar}</span>
      <button
        onClick={() => toggleSeleccion({ tipo: 'lugarDestacado', nombre: lugar })}
        className="text-sm bg-emerald-500 text-white px-2 py-1 rounded"
      >
        {estaAgregado({ tipo:'lugarDestacado', nombre:lugar }) ? 'Quitar' : 'Agregar'}
      </button>
    </li>
  ))}
</ul>

      <h2 className="text-2xl font-semibold mt-6">Sitios imperdibles</h2>
<ul className="mb-4">
  {(datos.sitiosTop || []).map((n, i) => (
    <li key={`top-${i}`} className="flex items-center justify-between py-1">
      <span>⭐ {n}</span>
<button
  onClick={() => toggleSeleccion({ tipo: 'sitioImperdible', nombre: n, categoria: 'top' })}
  className="text-sm bg-emerald-500 text-white px-2 py-1 rounded"
>
  {estaAgregado({ tipo:'sitioImperdible', nombre:n }) ? 'Quitar' : 'Agregar'}
</button>

    </li>
  ))}
</ul>

<h2 className="text-2xl font-semibold">Joyitas poco conocidas</h2>
<ul className="mb-4">
  {(datos.sitiosOcultos || []).map((n, i) => (
    <li key={`hide-${i}`} className="flex items-center justify-between py-1">
      <span>🌿 {n}</span>
<button
  onClick={() => toggleSeleccion({ tipo: 'joyaPocoConocida', nombre: n, categoria: 'oculto' })}
  className="text-sm bg-emerald-500 text-white px-2 py-1 rounded"
>
  {estaAgregado({ tipo:'joyaPocoConocida', nombre:n }) ? 'Quitar' : 'Agregar'}
</button>

    </li>
  ))}
</ul>

<div className="flex items-center justify-between">
  <h2 className="text-2xl font-semibold">Eventos culturales</h2>
  <select
  ref={mesSelectRef}
    value={mesSeleccionado}
    onChange={(e) => {
      const nuevoMes = e.target.value;
      setMesSeleccionado(nuevoMes);

      // 🔹 Guardar el mes en localStorage igual que en MapaTabasco
      const itinerarioPersistido = JSON.parse(localStorage.getItem("itinerario") || "{}");
      localStorage.setItem(
        "itinerario",
        JSON.stringify({
          ...itinerarioPersistido,
          mes: nuevoMes
        })
      );

      //  Notificar a otras pestañas/componentes que cambió
      window.dispatchEvent(new Event("storage"));
    }}
    className="ml-4 border border-gray-300 rounded px-3 py-1 text-sm"
  >
    <option value="">Selecciona un mes</option>
    {Object.keys(eventosCentroPorMes).map((mes) => (
      <option key={mes} value={mes}>{mes}</option>
    ))}
  </select>
</div>



{nombre === "Centro" ? (
  !mesSeleccionado ? (
    <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
      <p>Para ver los eventos culturales de cada mes tienes que escoger un mes. ¿Quieres hacerlo ahora?</p>
      <button
   onClick={() => {
     mesSelectRef.current?.focus();
     mesSelectRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
     // pequeño “flash”:
     mesSelectRef.current?.classList.add('ring-2','ring-blue-400');
     setTimeout(() => mesSelectRef.current?.classList.remove('ring-2','ring-blue-400'), 1000);
   }}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Seleccionar mes
      </button>
    </div>
  ) : (
    <ul className="mb-4">
      {(eventosCentroPorMes[mesSeleccionado] && eventosCentroPorMes[mesSeleccionado].length > 0
        ? eventosCentroPorMes[mesSeleccionado]
        : ["No hay eventos este mes"]
      ).map((nombreEvento, i) => (
        <li key={`ev-${i}`} className="flex items-center justify-between py-1">
          <span>🎭 {nombreEvento} · {mesSeleccionado}</span>
          {nombreEvento !== "No hay eventos este mes" && (
            <button
              onClick={() => toggleSeleccion({
                tipo: 'evento',
                nombre: nombreEvento,
                meta: { mes: mesSeleccionado }
              })}
              className="text-sm bg-indigo-500 text-white px-2 py-1 rounded"
            >
              {estaAgregado({ tipo:'evento', nombre: nombreEvento /* o ev.nombre */ }) ? 'Quitar' : 'Agregar'}
            </button>
          )}
        </li>
      ))}
    </ul>
  )
) : (
  !mesSeleccionado ? (
    <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
      <p>Para conocer los eventos primero selecciona un mes.</p>
<button
   onClick={() => {
     mesSelectRef.current?.focus();
     mesSelectRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
     // pequeño “flash” visual opcional:
     mesSelectRef.current?.classList.add('ring-2','ring-blue-400');
     setTimeout(() => mesSelectRef.current?.classList.remove('ring-2','ring-blue-400'), 1000);
   }}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Seleccionar mes
      </button>
    </div>
  ) : (
    <ul className="mb-4">
      {(datos.eventos || [])
        .filter(ev =>
          (ev.fecha || "").toLowerCase().includes(mesSeleccionado.toLowerCase())
        )
        .map((ev, i) => (
          <li key={`ev-${i}`} className="flex items-center justify-between py-1">
            <span>🎭 {ev.nombre} · {ev.fecha}</span>
<button
  onClick={() => toggleSeleccion({
    tipo: 'evento',
    nombre: ev.nombre,
    meta: { fecha: ev.fecha, mes: mesSeleccionado }
  })}
  className="text-sm bg-indigo-500 text-white px-2 py-1 rounded"
>
  {estaAgregado({ tipo: 'evento', nombre: ev.nombre }) ? 'Quitar' : 'Agregar'}
</button>
          </li>
        ))}
    </ul>
  )
)}


<h2 className="text-2xl font-semibold">Artesanías y comida</h2>
<ul className="mb-6">
  {(datos.artesanias || []).map((a, i) => (
    <li key={`art-${i}`} className="flex items-center justify-between py-1">
      <span>🧺 {a.nombre} {a.precio ? `· ${a.precio}` : ''}</span>
      <div className="flex gap-2">
<button
  onClick={() => toggleSeleccion({ tipo: 'Artesanías', nombre: a.nombre, meta: { precio: a.precio } })}
  className="text-sm bg-pink-500 text-white px-2 py-1 rounded"
>
  {estaAgregado({ tipo:'Artesanías', nombre:a.nombre }) ? 'Quitar' : 'Agregar'}
</button>

        <button
          onClick={() => alert('🛒 (Demo) Añadido al carrito')}
          className="text-sm bg-orange-500 text-white px-2 py-1 rounded"
        >
          Comprar
        </button>
      </div>
    </li>
  ))}
</ul>
<h2 className="text-2xl font-semibold">Talleres y espacios temáticos</h2>
<ul className="mb-6">
  {(datos.talleres || []).map((t, i) => (
    <li key={`taller-${i}`} className="flex items-center justify-between py-1">
      <span>🎓 {t}</span>
      <button
        onClick={() => toggleSeleccion({ tipo: 'Talleres y espacios temáticos', nombre: t })}
        className="text-sm bg-blue-500 text-white px-2 py-1 rounded"
      >
        {estaAgregado({ tipo:'Talleres y espacios temáticos', nombre:t }) ? 'Quitar' : 'Agregar'}
      </button>
    </li>
  ))}
</ul>

<h2 className="text-2xl font-semibold">Gastronomía típica</h2>
<ul className="mb-6">
  {(datos.gastronomia || []).map((g, i) => (
    <li key={`gastronomia-${i}`} className="flex items-center justify-between py-1">
      <span>🍽️ {g}</span>
      <button
        onClick={() => toggleSeleccion({ tipo: 'Gastronomía típica', nombre: g })}
        className="text-sm bg-green-500 text-white px-2 py-1 rounded"
      >
        {estaAgregado({ tipo:'Gastronomía típica', nombre:g }) ? 'Quitar' : 'Agregar'}
      </button>
    </li>
  ))}
</ul>


      <div className="flex gap-4 mt-6">
<Link to="/mapa-tabasco">
<button className={`${theme.btnPrimary} px-4 py-2 rounded transition`}>
  ← Regresar al mapa
</button>
</Link>
<Link
  to="/productos-tabasco"
  state={{ municipio: nombre }} //  pasa el municipio
>
 <button className={`${theme.btnSecondary} px-4 py-2 rounded-lg shadow transition`}>
    {`Productos Artesanales de ${nombre || 'Tabasco'}`}
  </button>
</Link>




        <button
          onClick={manejarInteres}
          className={`px-4 py-2 rounded text-white transition ${
  interesado ? 'bg-green-600' : theme.btnPrimary
}`}
        >
          {interesado ? '¡Te interesa!' : 'Me interesa'}
        </button>
      </div>
    </div>

    {/* ===== Footer de Home ===== */}
    <footer className="py-10 text-center bg-[var(--color-primary)] text-black">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4">
        <div>
          <img src={logo} alt="Logo Pueblos de Ensueño" className="h-10 mb-3" />
          <p>Conectando viajeros con el patrimonio cultural de México.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-black">Enlaces</h4>
          <ul className="space-y-1">
            <li><Link to="/puntos-cercanos">Puntos cercanos</Link></li>
            <li><Link to="/mapa">Mapa interactivo</Link></li>
            <li><Link to="/InterestsSelector">Invitado</Link></li>
            <li><Link to="/login">Iniciar sesión</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-black">Tecnologías</h4>
          <ul className="space-y-1">
            <li>React.js</li>
            <li>Node.js</li>
            <li>AWS</li>
            <li>MariaDB</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-black">Contacto</h4>
          <p>9934535365</p>
          <p>✉️ info@pueblosdeensueno.mx</p>
          <p>📍 Villahermosa Tabasco</p>
        </div>
      </div>
      <div className="mt-8 pt-4 text-sm text-black">
        © 2025 Pueblos de Ensueño. Todos los derechos reservados.
      </div>
    </footer>

  </div>
  );
}

export default MunicipioDetalle;
