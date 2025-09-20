import { useState, useEffect, useRef } from 'react';
import { addSeleccion, getSelecciones, removeSeleccion } from '../utils/itinerarioStore';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Construction, Plus, Check, X, HandHeart, Star, Gem, ChevronLeft, ChevronRight, Eye, ArrowLeft } from 'lucide-react';

// --- DATOS ORIGINALES (COMPLETOS Y CON RUTAS RESTAURADAS) ---
// La imagen de Nacajuca se usa como genérica para todos los headers.

const datosMunicipios = {
  "Balancán": {
    descripcion: "Balancán se encuentra al oriente del estado y es famoso por su biodiversidad y zonas ribereñas.",
    lugares: [{ nombre: "Reserva de la Biosfera Usumacinta", descripcion: "Una vasta área protegida con una increíble diversidad de flora y fauna." }, { nombre: "Río San Pedro", descripcion: "Ideal para paseos en lancha y observación de aves." }]
  },
  "Cardenas": {
    descripcion: "Cárdenas es un municipio importante por su agricultura y la cercanía a la costa del Golfo.",
    lugares: [{ nombre: "Playa Pico de Oro", descripcion: "Disfruta de la brisa del mar y la arena dorada." }, { nombre: "Centro de la ciudad", descripcion: "Recorre sus calles y descubre la vida local." }]
  },
  "Centla": {
    descripcion: "Centla alberga la Reserva de la Biosfera Pantanos de Centla, un importante humedal del sur de México.",
    lugares: [{ nombre: "Reserva de Pantanos de Centla", descripcion: "El humedal más grande de Norteamérica, un paraíso para el ecoturismo." }, { nombre: "Frontera", descripcion: "Ciudad portuaria con una rica historia y gastronomía." }],
    rutasComunitarias: [
      "Corredor Turístico de los Pantanos: Recorridos en lancha guiados por cooperativas locales a través de los manglares de la Reserva de la Biosfera Pantanos de Centla.",
      "Ruta de Observación de Aves en Comunidades Ribereñas: Experiencias guiadas por pescadores locales para avistar fauna nativa y migratoria."
    ]
  },
  "Centro": {
    descripcion: "Centro es el municipio donde se ubica Villahermosa, capital de Tabasco, y concentra la mayor actividad económica y cultural.",
    lugares: [
        { nombre: "Parque-Museo La Venta", descripcion: "Museo al aire libre con una de las colecciones olmecas más importantes del país." },
        { nombre: "Malecón “Carlos A. Madrazo”", descripcion: "Corredor peatonal y ciclovía con nueva infraestructura urbana junto al río Grijalva." },
        { nombre: "Laguna de las Ilusiones", descripcion: "Símbolo natural de la ciudad; con miradores y parques a su alrededor." },
        { nombre: "Museo Regional de Antropología", descripcion: "Exhibe el patrimonio arqueológico y etnográfico de la región, destacando las culturas Olmeca y Maya." },
        { nombre: "Yumká", descripcion: "Centro de Interpretación y Convivencia con la Naturaleza con recorridos por selva y sabana." }
    ],
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
  ],
    transportePublico: [
  {
    nombre: "Combis / Transbus (Rutas Urbanas)",
    tarifa: "Aprox. $10.50 MXN (público general)",
    contacto: "N/A",
    imagen: new URL('../assets/transporte/tarifas_combi.jpg', import.meta.url).href
  },
  {
    nombre: "Radio Taxis",
    tarifa: "Tarifa mínima aprox. $35 - $45 MXN",
    contacto: "Radio Taxi Gaviota: 993 354 0000",
    imagen: new URL('../assets/transporte/tarifas_taxi_colectivo.jpg', import.meta.url).href
  },
  {
    nombre: "Taxis Colectivos (a otros municipios)",
    tarifa: "Desde $30 MXN (depende del destino)",
    contacto: "Salidas desde la terminal de autobuses",
    imagen: new URL('../assets/transporte/tarifas_taxi_colectivo.jpg', import.meta.url).href
  }
]
  },
  "Comalcalco": {
    descripcion: "Comalcalco destaca por su zona arqueológica de origen maya construida con ladrillos de barro.",
    lugares: [{nombre: "Zona Arqueológica de Comalcalco", descripcion: "Impresionante sitio maya construido con ladrillos de barro cocido."}, {nombre: "Fábricas de chocolate", descripcion: "Descubre el proceso artesanal del cacao en las haciendas locales."}],
transportePublico: [
      {
        nombre: "Pochimóvil (Moto-taxis)",
        tarifa: "Aprox. $10 - $25 MXN (rutas cortas dentro de la ciudad)",
        contacto: "Disponibles en toda la ciudad",
        imagen: new URL('../assets/transporte/pochimovil.jpg', import.meta.url).href
      },
      {
        nombre: "Taxis Locales y Colectivos",
        tarifa: "Desde $30 MXN (local) / Tarifas variables a rancherías",
        contacto: "Base en el parque central y mercado",
        imagen: new URL('../assets/transporte/taxi.jpg', import.meta.url).href
      }
    ]
  },
  "Cunduacán": {
    descripcion: "Municipio conocido por su agricultura y cercanía a Villahermosa.",
    lugares: [{nombre: "Centro cultural", descripcion: "Espacio dedicado a la difusión de la cultura local."}, {nombre: "Río Mezcalapa", descripcion: "Disfruta de la naturaleza y paisajes ribereños."}]
  },
  "Emiliano Zapata": {
    descripcion: "Ubicado en la frontera con Chiapas, tiene paisajes naturales y ríos atractivos.",
    lugares: [{nombre: "Malecón del Usumacinta", descripcion: "Un hermoso paseo junto al río más caudaloso de México."}, {nombre: "Zona ecoturística", descripcion: "Ideal para el contacto con la naturaleza y actividades al aire libre."}]
  },
  "Huimanguillo": {
    descripcion: "Municipio extenso con riqueza ganadera y petrolera.",
    lugares: [{nombre: "Grutas de Villa Luz", descripcion: "Explora cuevas y disfruta de sus aguas sulfurosas."}, {nombre: "Balnearios naturales", descripcion: "Refréscate en las aguas de sus ríos y cascadas."}]
  },
  "Jalapa": {
    descripcion: "Conocido por su vegetación, cafetales y artesanías.",
    lugares: [{nombre: "Parque central", descripcion: "El corazón del pueblo, rodeado de vegetación."}, {nombre: "Fincas cafetaleras", descripcion: "Conoce el proceso del café de la región."}]
  },
  "Jalpa de Méndez": {
    descripcion: "Famoso por su producción de horchata de coco y eventos culturales.",
    lugares: [{nombre: "Mercado municipal", descripcion: "Prueba la gastronomía y compra productos locales."}, {nombre: "Iglesia principal", descripcion: "Un bello ejemplo de la arquitectura religiosa de la zona."}]
  },
  "Jonuta": {
    descripcion: "Municipio tranquilo con actividad pesquera.",
    lugares: [{nombre: "Río Usumacinta", descripcion: "Navega y disfruta de los paisajes del imponente río."}, {nombre: "Zona de pesca", descripcion: "Ideal para los aficionados a la pesca deportiva."}],
    rutasComunitarias: [
      "Encuentro con Manatíes en Jonuteek: Un proyecto de turismo comunitario dedicado a la conservación y avistamiento respetuoso del manatí en su hábitat natural."
    ]
  },
  "Macuspana": {
    descripcion: "Municipio natal de importantes figuras políticas, con selvas y ríos.",
    lugares: [{nombre: "Grutas de Macuspana", descripcion: "Un sistema de cuevas con impresionantes formaciones rocosas."}, {nombre: "Balnearios naturales", descripcion: "Disfruta de un día en familia en sus refrescantes aguas."}]
  },
"Nacajuca": {
  descripcion: "Zona chontal con rica cultura, tradiciones y artesanías.",
  lugares: [{nombre: "Poblados chontales", descripcion: "Sumérgete en la cultura viva de las comunidades indígenas."}, {nombre: "Artesanías típicas", descripcion: "Admira y adquiere piezas únicas de cestería y bordado."}],
  rutasComunitarias: [
      "Ruta Biji Yokot'an (Corredor del Pejelagarto): Un recorrido por comunidades chontales para descubrir la gastronomía ancestral, talleres de artesanías y la vida local.",
      "Recorrido por los Camellones Chontales: Explora el sistema agrícola prehispánico y aprende sobre la cultura viva de la mano de guías comunitarios."
    ],

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
    lugares: [{nombre: "Puerto Dos Bocas", descripcion: "Importante puerto industrial y comercial."}, {nombre: "Playa Paraíso", descripcion: "Relájate en sus tranquilas playas y disfruta del sol."}],
    transportePublico: [
      {
        nombre: "Taxis Locales",
        tarifa: "Aprox. $30 - $50 MXN dentro de la ciudad",
        contacto: "Base principal cerca del parque central",
        imagen: new URL('../assets/transporte/taxi.jpg', import.meta.url).href
      },
      {
        nombre: "Transporte Suburbano (Vans)",
        tarifa: "Aprox. $25 - $40 MXN (rutas a Comalcalco y Villahermosa)",
        contacto: "Salidas desde la terminal local",
        imagen: new URL('../assets/transporte/combi.jpg', import.meta.url).href
      }
    ]
  },
  "Tacotalpa": {
    descripcion: "Ubicado en la sierra, con atractivos naturales y cafetalales.",
    lugares: [{nombre: "Villa Tapijulapa", descripcion: "Pueblo Mágico con calles empedradas y casas coloridas."}, {nombre: "Grutas de Coconá", descripcion: "Un mundo subterráneo de estalactitas y estalagmitas."}],
    rutasComunitarias: [
      "Ruta Ecoturística Agua Selva: Un desarrollo comunitario que ofrece senderismo, cañonismo y rappel en un área con más de 50 cascadas.",
      "Experiencia Eco Aventura en Tapijulapa: Visita guiada por locales a la Cueva de la Sardina Ciega y al santuario de murciélagos al atardecer."
    ],
    transportePublico: [
      {
        nombre: "Taxis Colectivos (Desde Teapa)",
        tarifa: "Aprox. $20 - $30 MXN por persona",
        contacto: "Base de salida en el mercado de Teapa",
        imagen: new URL('../assets/transporte/colectivo.jpg', import.meta.url).href
      },
      {
        nombre: "Transporte Local (Taxis)",
        tarifa: "Tarifas variables para moverse entre Tapijulapa y la cabecera",
        contacto: "Disponibles en el parque principal de Tapijulapa",
        imagen: new URL('../assets/transporte/taxi.jpg', import.meta.url).href
      }
    ]
  },
  "Teapa": {
    descripcion: "Conocido por su café, montañas y paisajes.",
    lugares: [{nombre: "Cerro El Madrigal", descripcion: "Ideal para senderismo y disfrutar de vistas panorámicas."}, {nombre: "Balnearios", descripcion: "Refréscate en las pozas naturales de sus ríos."}]
  },
  "Tenosique": {
    descripcion: "Municipio fronterizo con Chiapas y Guatemala, con historia y zonas naturales.",
    lugares: [{nombre: "Cueva del Tigre", descripcion: "Una cueva con vestigios mayas y un arroyo subterráneo."}, {nombre: "Zona arqueológica de Pomoná", descripcion: "Antigua ciudad maya con impresionantes templos y plazas."}],
    rutasComunitarias: [
      "Aventura en el Cañón del Usumacinta con Wayak Xuul: Cooperativa local que ofrece tours de aventura y naturaleza en el río Usumacinta.",
      "Ruta a los Manantiales de Santa Margarita: Paseo en lancha para flotar en las aguas cristalinas de este manantial, una experiencia ofrecida por guías locales."
    ]
  },
};
const THEME_BY_MUNICIPIO = {
    "Balancán": { header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href },
    "Cardenas": { header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href },
    "Centla": { header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href },
    "Centro": { header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href },
    "Comalcalco": { header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href },
    "Cunduacán": { header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href },
    "Emiliano Zapata": { header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href },
    "Huimanguillo": { header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href },
    "Jalapa": { header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href },
    "Jalpa de Méndez": { header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href },
    "Jonuta": { header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href },
    "Macuspana": { header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href },
    "Nacajuca": { header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href },
    "Paraíso": { header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href },
    "Tacotalpa": { header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href },
    "Teapa": { header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href },
    "Tenosique": { header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href },
    _default: { header: new URL('../assets/nacajuca-header.jpg', import.meta.url).href }
};
const MEDIA_BY_MUNICIPIO = {
  Centro: {
    lugares: {
        "Parque-Museo La Venta": new URL('../assets/museo.jpg', import.meta.url).href,
        "Malecón “Carlos A. Madrazo”": new URL('../assets/malecon.jpeg', import.meta.url).href,
        "Laguna de las Ilusiones": new URL('../assets/Laguna-de-las-ilusiones.jpg', import.meta.url).href,
        "Museo Regional de Antropología": new URL('../assets/museo-regional.jpg', import.meta.url).href,
        "Yumká": new URL('../assets/yumka.jpg', import.meta.url).href
    },
    gastronomia: {
      "Puchero tabasqueño": new URL('../assets/gastro-puchero.jpg', import.meta.url).href,
      "Pejelagarto asado": new URL('../assets/gastro-pejelagarto.jpg', import.meta.url).href,
      "Pozol y chorote": new URL('../assets/gastro-pozol.jpg', import.meta.url).href,
      "Tamales de chipilín": new URL('../assets/gastro-chipilin.jpg', import.meta.url).href,
      "Chocolate/cacao local (marcas como CACEP)": new URL('../assets/gastro-cacao.png', import.meta.url).href,
    },
    artesanias: {
      "Máscaras chontales": new URL('../assets/artesano.gif', import.meta.url).href,
      "Cacao artesanal": new URL('../assets/artesano.gif', import.meta.url).href,
    },
  },
};
const MEDIA_EVENTOS = {
  "Feria Tabasco": new URL('../assets/evento-feria-tabasco.jpg', import.meta.url).href,
  "Festival del Chocolate": new URL('../assets/evento-chocolate.jpg', import.meta.url).href,
  "Celebrando la Eternidad":  new URL('../assets/evento-dia-muertos.jpg', import.meta.url).href,
};
const eventosCentroPorMes = {
  Enero: [ "Pellicer Visual (artes visuales en homenaje a Carlos Pellicer; arranca el año)", "Programación cultural de enero vía Agenda DECUR" ],
  Febrero: [ "Tardes de Carnaval (pre-carnaval, 28 feb–2 mar; música y comparsas en espacios públicos)", "Programa cultural febrero (cartelera oficial)" ],
  Marzo: [ "Festival Guayacán & Macuilí (floraciones urbanas; conciertos, teatro, exposiciones)" ],
  Abril: [ "Ciclo 'De la ciudad a la comunidad' – Tardes musicales en el quiosco (Parque Mestre)", "Agenda abril (talleres/expos en CCV y sedes barriales)" ],
  Mayo: [ "Feria Tabasco (Parque Tabasco 'Dora María'; palenque, exposición ganadera, desfile) – 1 al 11 de mayo" ],
  Junio: [ "Festival Villahermosa (arte, música, literatura; sedes CCV y Zona Luz)" ],
  Julio: [ "Mis Vacaciones en la Biblioteca (talleres infantiles/juveniles en bibliotecas municipales)" ],
  Agosto: [ "Agenda Cultural agosto: 7 Villas & Música Centro + talleres de verano en colonias y bibliotecas (Parques Parrilla, Tamulté, Los Pajaritos, CCV)" ],
  Septiembre: [ "Fiestas Patrias – verbenas y conciertos en Parque Manuel Mestre (sábados del mes)" ],
  Octubre: [ "Celebrando la Eternidad (Día de Muertos en Centro Histórico/Zona Luz: altares, catrinas, desfile)" ],
  Noviembre: [ "Festival del Chocolate (exposiciones y catas; sede en Villahermosa) – 13 al 16 de noviembre" ],
  Diciembre: [ "Nochebuena en Centro (programa navideño en foros, plazas y parques; música, pastorelas)" ]
};

// --- COMPONENTES DE UI ---

const Section = ({ children, className = '' }) => (
    <section className={`py-12 sm:py-16 ${className}`}>
        <div className="container mx-auto px-4 sm:px-8">
            {children}
        </div>
    </section>
);

const SectionHeader = ({ title, subtitle, children }) => (
  <div className="text-center md:flex md:items-center md:justify-between mb-10">
    <div className="md:text-left">
      <h2 className="text-3xl font-bold text-zinc-800 mb-2">{title}</h2>
      {subtitle && <p className="text-slate-600 max-w-3xl">{subtitle}</p>}
    </div>
    {children && <div className="mt-4 md:mt-0">{children}</div>}
  </div>
);

const InfoCard = ({ icon: Icon, title, onClick, count }) => (
  <div
    onClick={onClick}
    className="bg-white rounded-2xl p-6 shadow-lg border-t-4 border-orange-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer text-center h-full flex flex-col items-center justify-center"
  >
    <Icon className="w-10 h-10 mb-4 text-orange-500" strokeWidth={1.5} />
    <h3 className="font-bold text-lg text-zinc-800">{title}</h3>
    {count > 0 && 
      <p className="text-sm text-slate-500 mt-1">{count} {count === 1 ? 'opción' : 'opciones'}</p>
    }
  </div>
);

const CarouselCard = ({ title, img, onAdd, isAdded, date }) => (
  <div className="flex-shrink-0 w-72 snap-center bg-white rounded-2xl shadow-lg overflow-hidden group">
    <div className="relative">
      <img src={img} alt={title} className="w-full h-40 object-cover" />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
       <button
        onClick={onAdd}
        className={`absolute top-3 right-3 w-9 h-9 rounded-full grid place-content-center shadow-md transition-all duration-200 transform group-hover:scale-110 ${
          isAdded 
            ? 'bg-green-500 text-white' 
            : 'bg-white/80 text-zinc-700 hover:bg-white'
        }`}
        aria-label={isAdded ? "Quitar" : "Agregar"}
      >
        {isAdded ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
      </button>
    </div>
    <div className="p-4">
      <h4 className="font-bold text-zinc-800 truncate">{title}</h4>
      {date && <p className="text-sm text-slate-500">{date}</p>}
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL ---

export default function MunicipioDetalle() {
  const { nombre } = useParams();
  const datos = datosMunicipios[nombre];
  const theme = THEME_BY_MUNICIPIO[nombre] || THEME_BY_MUNICIPIO._default;
  const carouselRefs = { eventos: useRef(null), gastronomia: useRef(null) };

  const [seleccionesIds, setSeleccionesIds] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', items: [], type: '' });
  const [interesado, setInteresado] = useState(false);
  const [mesSeleccionado, setMesSeleccionado] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const interesesActuales = JSON.parse(localStorage.getItem("interesesMunicipios_Tabasco")) || [];
    setInteresado(interesesActuales.includes(nombre));
    const actuales = (getSelecciones() || []).map(s => s.id);
    setSeleccionesIds(new Set(actuales));
  }, [nombre]);

  const getMedia = (categoria, itemNombre) => (MEDIA_BY_MUNICIPIO[nombre]?.[categoria]?.[itemNombre] || theme.header);
  const getEventoImg = (evento) => (MEDIA_EVENTOS[evento.split(' (')[0].trim()] || theme.header);

  if (!datos) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-zinc-800">Municipio no encontrado</h2>
      </div>
    );
  }

  const idDe = (payload) => `${nombre}-${payload.tipo}-${payload.nombre}`;
  const estaAgregado = (payload) => seleccionesIds.has(idDe(payload));

  const toggleSeleccion = (payload) => {
    const id = idDe(payload);
    const yaAgregado = seleccionesIds.has(id);
    
    if (yaAgregado) {
      removeSeleccion(id);
    } else {
      const enriched = { ...payload, meta: { ...(payload.meta || {}), source: 'MunicipioDetalle' } };
      addSeleccion({ id, municipio: nombre, estado: "Tabasco", ...enriched });
    }
    
    const next = new Set(seleccionesIds);
    yaAgregado ? next.delete(id) : next.add(id);
    setSeleccionesIds(next);
  };
  
  const manejarInteres = () => {
    setInteresado(true);
    let interesesActuales = JSON.parse(localStorage.getItem("interesesMunicipios_Tabasco")) || [];
    interesesActuales = interesesActuales.filter(m => m !== nombre);
    interesesActuales.unshift(nombre);
    localStorage.setItem("interesesMunicipios_Tabasco", JSON.stringify(interesesActuales));
  };

  const openModal = (title, items, type) => {
    if(!items || items.length === 0) return;
    setModalContent({ title, items, type });
    setModalOpen(true);
  };

  const scrollCarousel = (key, dir) => {
    const container = carouselRefs[key].current;
    if (container) {
      const scrollAmount = container.offsetWidth * 0.75;
      container.scrollBy({ left: dir === 'next' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
    }
  };

  const getEventosDelMes = (mes) => {
    if (!mes) {
        if (nombre === "Centro") {
             return Object.values(eventosCentroPorMes).flat().map(name => {
                const parts = name.split(' – ');
                return { nombre: parts[0], fecha: parts[1] || 'Varios' };
            });
        }
        return datos.eventos || [];
    }
    
    if (nombre === "Centro") {
        return (eventosCentroPorMes[mes] || []).map(name => {
            const parts = name.split(' – ');
            return { nombre: parts[0], fecha: parts[1] || mes };
        });
    }
    return (datos.eventos || []).filter(ev => (ev.fecha || "").toLowerCase().includes(mes.toLowerCase()));
  };
  
  const eventosParaMostrar = getEventosDelMes(mesSeleccionado);
  const countItems = (arr) => arr?.length || 0;

  return (
    <div className="bg-slate-50">
      <div className="relative h-80">
        <img src={theme.header} alt={`Paisaje de ${nombre}`} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="absolute top-0 right-0 p-4">
          <Link to="/mapa-tabasco" className="flex items-center gap-2 text-white bg-slate-800 px-4 py-2 rounded-full hover:bg-slate-700 transition-colors duration-300">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al mapa</span>
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 p-8 text-white">
            <h1 className="text-4xl sm:text-5xl font-black drop-shadow-lg">{nombre}</h1>
            <p className="mt-2 max-w-2xl text-lg opacity-90">{datos.descripcion}</p>
        </div>
      </div>

      <main className="space-y-12">
        <Section>
          <SectionHeader title="¿Qué hacer en este destino?" subtitle="Explora las principales atracciones y experiencias que te esperan."/>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <InfoCard icon={MapPin} title="Lugares" onClick={() => openModal('Lugares Destacados', datos.lugares, 'lugarDestacado')} count={countItems(datos.lugares)} />
            <InfoCard icon={Star} title="Imperdibles" onClick={() => openModal('Sitios Imperdibles', datos.sitiosTop, 'sitioImperdible')} count={countItems(datos.sitiosTop)} />
            <InfoCard icon={Gem} title="Joyitas Ocultas" onClick={() => openModal('Joyitas Ocultas', datos.sitiosOcultos, 'joyaPocoConocida')} count={countItems(datos.sitiosOcultos)} />
            <InfoCard icon={HandHeart} title="Rutas Comunitarias" onClick={() => openModal('Rutas Comunitarias', datos.rutasComunitarias, 'rutaComunitaria')} count={countItems(datos.rutasComunitarias)} />
            <InfoCard icon={Construction} title="Talleres" onClick={() => openModal('Talleres y Espacios', datos.talleres, 'taller')} count={countItems(datos.talleres)} />
          </div>
        </Section>
        
        {countItems(datos.eventos) > 0 && (
          <Section>
             <SectionHeader title="Eventos Culturales" subtitle="Vive las tradiciones y festividades locales.">
                <select
                  value={mesSeleccionado}
                  onChange={(e) => setMesSeleccionado(e.target.value)}
                  className="border border-slate-300 rounded-lg px-4 py-2"
                >
                  <option value="">Todos los meses</option>
                  {Object.keys(eventosCentroPorMes).map((mes) => (
                    <option key={mes} value={mes}>{mes}</option>
                  ))}
                </select>
             </SectionHeader>
            {eventosParaMostrar.length > 0 ? (
              <div className="flex items-center">
                 <button onClick={() => scrollCarousel('eventos', 'prev')} className="p-2 rounded-full bg-white shadow-md transition hover:scale-110 hidden lg:grid place-content-center mr-4"><ChevronLeft/></button>
                <div ref={carouselRefs.eventos} className="flex-1 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth no-scrollbar">
                  {eventosParaMostrar.map((evento, idx) => (
                    <CarouselCard
                      key={`evento-${idx}`}
                      title={evento.nombre}
                      img={getEventoImg(evento.nombre)}
                      isAdded={estaAgregado({ tipo: 'evento', nombre: evento.nombre })}
                      onAdd={() => toggleSeleccion({ tipo: 'evento', nombre: evento.nombre, meta: { mes: evento.fecha } })}
                      date={evento.fecha}
                    />
                  ))}
                </div>
                 <button onClick={() => scrollCarousel('eventos', 'next')} className="p-2 rounded-full bg-white shadow-md transition hover:scale-110 hidden lg:grid place-content-center ml-4"><ChevronRight/></button>
              </div>
            ) : (
              <p className="text-center text-slate-500 bg-white p-6 rounded-2xl shadow-inner">No hay eventos para el mes seleccionado.</p>
            )}
          </Section>
        )}

        {countItems(datos.gastronomia) > 0 && (
          <Section className="bg-white">
            <SectionHeader title="Gastronomía Típica" subtitle={`Sabores que definen a ${nombre}.`} />
            <div className="flex items-center">
              <button onClick={() => scrollCarousel('gastronomia', 'prev')} className="p-2 rounded-full bg-white shadow-md transition hover:scale-110 hidden lg:grid place-content-center mr-4"><ChevronLeft/></button>
              <div ref={carouselRefs.gastronomia} className="flex-1 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth no-scrollbar">
                {datos.gastronomia.map((plato, idx) => (
                   <CarouselCard
                    key={`gastro-${idx}`}
                    title={plato}
                    img={getMedia('gastronomia', plato)}
                    isAdded={estaAgregado({ tipo: 'gastronomia', nombre: plato })}
                    onAdd={() => toggleSeleccion({ tipo: 'gastronomia', nombre: plato })}
                  />
                ))}
              </div>
              <button onClick={() => scrollCarousel('gastronomia', 'next')} className="p-2 rounded-full bg-white shadow-md transition hover:scale-110 hidden lg:grid place-content-center ml-4"><ChevronRight/></button>
            </div>
          </Section>
        )}

        {countItems(datos.transportePublico) > 0 && (
            <Section className="bg-white">
                <SectionHeader title="Transporte Público" subtitle="Opciones para moverte dentro y fuera del municipio."/>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {datos.transportePublico.map((transporte, idx) => (
                        <div key={idx} className="bg-white rounded-2xl shadow-lg overflow-hidden border-t-4 border-amber-500 flex flex-col">
                            <img src={transporte.imagen} alt={transporte.nombre} className="w-full h-40 object-cover" />
                            <div className="p-6 flex-grow flex flex-col">
                                <h3 className="font-bold text-xl text-zinc-800">{transporte.nombre}</h3>
                                <p className="text-sm mt-2 text-slate-600 flex-grow"><span className="font-semibold">Tarifa:</span> {transporte.tarifa}</p>
                                {transporte.contacto !== "N/A" && 
                                  <p className="text-sm text-slate-600"><span className="font-semibold">Contacto:</span> {transporte.contacto}</p>
                                }
                                <button
                                  onClick={() => toggleSeleccion({ tipo: 'transporte', nombre: transporte.nombre })}
                                  className={`mt-4 w-full px-4 py-2 text-sm font-bold rounded-full transition ${estaAgregado({ tipo: 'transporte', nombre: transporte.nombre }) ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
                                >
                                  {estaAgregado({ tipo: 'transporte', nombre: transporte.nombre }) ? 'Quitar Info' : 'Guardar Info'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        )}

        <Section>
            <div className="bg-white rounded-2xl p-8 grid md:grid-cols-2 gap-8 items-center border-t-4 border-green-500">
                 <div>
                    <h3 className="font-bold text-2xl text-zinc-800 mb-3">¿Listo para explorar {nombre}?</h3>
                    <p className="text-slate-600">Marca este municipio como de tu interés o explora los productos artesanales que tiene para ofrecer.</p>
                </div>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={manejarInteres}
                        className={`w-full text-center px-5 py-3 rounded-full font-semibold text-white transition-colors ${interesado ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600'}`}
                    >
                      {interesado ? '¡Agregado a mis intereses!' : 'Me interesa visitar'}
                    </button>
                    <Link
                        to="/productos-tabasco" 
                        state={{ municipio: nombre }}
                        className="w-full text-center px-5 py-3 rounded-full font-semibold text-zinc-700 bg-slate-200 hover:bg-slate-300 transition-colors"
                    >
                        Ver Artesanías de {nombre}
                    </Link>
                </div>
            </div>
        </Section>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-xl font-bold text-zinc-800">{modalContent.title}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5"/></button>
            </div>
            <div className="p-5 overflow-y-auto space-y-3">
              {modalContent.items?.map((item, idx) => {
                const nombreItem = typeof item === 'object' ? item.nombre : item;
                const payload = { tipo: modalContent.type, nombre: nombreItem };
                const isAdded = estaAgregado(payload);
                
                return (
                  <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden">
                    {modalContent.type === 'lugarDestacado' ? (
                        <div className="w-full">
                            <img src={getMedia('lugares', nombreItem)} alt={nombreItem} className="w-full h-48 object-cover"/>
                            <div className="p-4">
                                <h4 className="font-bold text-lg text-zinc-800 mb-1">{nombreItem}</h4>
                                <p className="text-sm text-slate-600 mb-4">{item.descripcion}</p>
                                <div className="flex items-center gap-2">
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); toggleSeleccion(payload); }}
                                      className={`flex-1 text-center py-2 text-sm font-bold rounded-full transition ${isAdded ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                                    >
                                      {isAdded ? 'Quitar' : 'Agregar'}
                                    </button>
                                    <button className="flex-1 text-center py-2 text-sm font-bold rounded-full transition bg-slate-200 text-slate-700 hover:bg-slate-300">
                                       Ver más
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                       <div className="flex items-center justify-between p-3">
                            <p className="font-semibold text-zinc-700 pr-4">{nombreItem}</p>
                            <button 
                              onClick={() => toggleSeleccion(payload)}
                              className={`flex-shrink-0 px-3 py-1 text-xs font-bold rounded-full transition ${isAdded ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                            >
                              {isAdded ? (modalContent.type === 'taller' ? 'INSCRITO' : 'QUITAR') : (modalContent.type === 'taller' ? 'INSCRIBIRSE' : 'AGREGAR')}
                            </button>
                       </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

