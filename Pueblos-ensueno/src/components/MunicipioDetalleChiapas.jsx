import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { addSeleccion, getSelecciones, removeSeleccion } from "../utils/itinerarioStore";
const normalizar = (txt = "") =>
  txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
// Función para crear una plantilla segura si un municipio no tiene datos
const makeEmptyMunicipio = (nombre) => ({
  descripcion: `Estamos trabajando para agregar la información detallada de ${nombre}. ¡Vuelve pronto!`,
  lugares: [],
  sitiosTop: [],
  sitiosOcultos: [],
  eventos: [],
  artesanias: [],
  talleres: [],
  gastronomia: []
});
// -----------------------------------------------------------------------------
// DATOS BÁSICOS DE CHIAPAS (puedes ampliar libremente)
// -----------------------------------------------------------------------------
const datosMunicipiosChiapas = {
  'Tuxtla Gutiérrez': {
    descripcion:
      'Capital del estado; centro de conexión ideal para explorar el Cañón del Sumidero, el Parque de la Marimba y el zoológico regional.',
    lugares: [
      'Parque de la Marimba',
      'Miradores del Cañón del Sumidero',
      'ZOOMAT (Zoológico Miguel Álvarez del Toro)',
      'Jardín Botánico Faustino Miranda'
    ],
    eventos: [
      { nombre: 'Feria de San Marcos', fecha: 'Abril' },
      { nombre: 'Festival del Tamal Tuxtleco', fecha: 'Diciembre' }
    ],
    artesanias: [
      { nombre: 'Laca chiapaneca', precio: 'desde $150' },
      { nombre: 'Marimbas en miniatura', precio: 'desde $250' }
    ],
    gastronomia: ['Cochito horneado', 'Tamales de chipilín con bola', 'Tascalate frío']
  },
  'San Cristóbal de las Casas': {
    descripcion:
      'Pueblo Mágico en los Altos de Chiapas, epicentro cultural, artesanal y cafetero del estado.',
    lugares: [
      'Andador Eclesiástico y Catedral de San Cristóbal',
      'Iglesia y Ex-convento de Santo Domingo (mercado de artesanías)',
      'Museo del Ámbar de Chiapas',
      'Barrio de Guadalupe y su iglesia'
    ],
    eventos: [
      { nombre: 'Feria de la Primavera y de la Paz', fecha: 'Abril' },
      { nombre: 'Festival Internacional Cervantino Barroco', fecha: 'Octubre' }
    ],
    artesanias: [
      { nombre: 'Textiles tzotziles y tzeltales', precio: 'desde $100' },
      { nombre: 'Joyería en ámbar certificado', precio: 'desde $120' }
    ],
    gastronomia: ['Sopa de pan', 'Asado coleto', 'Café de altura orgánico'],
    rutasComunitarias: [
        "Ruta de los Textiles Tzotziles: Visita a cooperativas en San Juan Chamula y Zinacantán para aprender sobre el telar de cintura con mujeres artesanas.",
        "Medicina Tradicional en los Altos: Recorrido guiado por médicos tradicionales en comunidades para conocer el uso de plantas curativas locales."
    ]
  },
  'Palenque': {
    descripcion:
      'Impresionante zona arqueológica maya inmersa en la selva; base para cascadas como Misol-Ha y Agua Azul.',
    lugares: [
      'Zona Arqueológica de Palenque',
      'Cascadas de Misol-Ha',
      'Cascadas de Agua Azul',
      'Ecoparque Aluxes (rescate de fauna)'
    ],
    eventos: [
      { nombre: 'Equinoccio de Primavera (en la zona arqueológica)', fecha: 'Marzo' },
      { nombre: 'Fiesta de Santo Domingo de Guzmán', fecha: 'Agosto' }
    ],
    artesanias: [
      { nombre: 'Tallado en madera con motivos mayas', precio: 'desde $120' },
      { nombre: 'Réplicas de máscaras y estelas mayas', precio: 'desde $180' }
    ],
    gastronomia: ['Pescado shote con momo', 'Mole chiapaneco', 'Pozol con cacao'],
    rutasComunitarias: [
        "Ecoturismo Comunitario en la Selva: Visita al centro ecoturístico 'Las Guacamayas', gestionado por la comunidad para la conservación de la guacamaya roja."
    ]
  },
  'Comitán de Domínguez': {
    descripcion:
      'Pueblo Mágico de ambiente colonial y cuna de Rosario Castellanos. Cercano a los Lagos de Montebello.',
    lugares: [
      'Centro Histórico y Parque Central',
      'Zona Arqueológica de Tenam Puente',
      'Cascadas El Chiflón',
      'Parque Nacional Lagos de Montebello'
    ],
    eventos: [
        { nombre: 'Fiesta de San Caralampio', fecha: 'Febrero' },
        { nombre: 'Festival Internacional Rosario Castellanos', fecha: 'Octubre' }
    ],
    artesanias: [
      { nombre: 'Juguetes de madera tallada', precio: 'desde $90' },
      { nombre: 'Textiles de lana de la región', precio: 'desde $200' }
    ],
    gastronomia: ['Chinculguaje (gordita de frijol)', 'Butifarra y longaniza de Comitán', 'Bebida "Comiteco"'],
     rutasComunitarias: [
        "Experiencia en los Lagos de Montebello: Paseos en balsa de troncos guiados por locales y visita a cooperativas de café orgánico en las comunidades aledañas al parque nacional."
    ]
  },
  'Chiapa de Corzo': {
    descripcion:
      'Pueblo Mágico a orillas del Grijalva y principal embarcadero para el Cañón del Sumidero. Famoso por su Fiesta Grande.',
    lugares: [
      'Embarcadero al Cañón del Sumidero',
      'La Pila (fuente estilo mudéjar en la plaza)',
      'Ex-convento de Santo Domingo (Museo de la Laca)',
      'Ruinas de la Iglesia de San Sebastián'
    ],
    eventos: [
        { nombre: 'Fiesta Grande de Enero (Parachicos, Patrimonio de la Humanidad)', fecha: 'Enero' }
    ],
    artesanias: [
      { nombre: 'Artesanía en laca (jícaras, máscaras)', precio: 'desde $150' },
      { nombre: 'Bordados de contado', precio: 'desde $250' }
    ],
    gastronomia: ['Pepita con tasajo', 'Cochito horneado', 'Dulces típicos (suspiros, chimbos)']
  },
  'Tapachula': {
    descripcion:
      'La "Perla del Soconusco". Ciudad cafetalera y puerta al Pacífico; cercana a volcanes, fincas y manglares.',
    lugares: [
      'Ruta del Café (Fincas cafetaleras como Argovia o Hamburgo)',
      'Zona Arqueológica de Izapa',
      'Volcán Tacaná (senderismo)',
      'Puerto Chiapas (terminal de cruceros y mariscos)'
    ],
    eventos: [
      { nombre: 'Expo Feria Tapachula Internacional', fecha: 'Marzo' },
      { nombre: 'Festival Internacional Fray Matías de Córdova', fecha: 'Noviembre' }
    ],
    artesanias: [
      { nombre: 'Café de altura en grano o molido', precio: 'desde $100' },
      { nombre: 'Chocolate artesanal de la región', precio: 'desde $80' }
    ],
    gastronomia: ['Mariscos frescos del Pacífico', 'Tamales de iguana', 'Plátano frito relleno'],
     rutasComunitarias: [
        "Ruta del Café del Soconusco: Recorridos por fincas sociales (cooperativas) para conocer el proceso del café de altura, desde la siembra hasta la taza, guiados por los propios productores."
    ]
  },
  'Ocosingo': {
    descripcion:
      'Municipio extenso en el corazón de la Selva Lacandona, con imponentes vestigios mayas y naturaleza exuberante.',
    lugares: [
      'Zona Arqueológica de Toniná (pirámide más alta de Mesoamérica)',
      'Cascadas Las Golondrinas',
      'Reserva de la Biósfera Montes Azules (acceso)',
      'Laguna Miramar'
    ],
    eventos: [
      { nombre: 'Feria de la Candelaria', fecha: 'Febrero' }
    ],
    artesanias: [
      { nombre: 'Textiles tseltales y lacandones', precio: 'desde $90' },
      { nombre: 'Queso de bola de Ocosingo', precio: 'desde $150' }
    ],
    gastronomia: ['Queso de bola relleno de carne', 'Tamales de azafrán', 'Caldo de shuti (caracol de río)'],
    rutasComunitarias: [
        "Inmersión en la Selva Lacandona: Estancia en el campamento 'Lacanjá Chansayab', gestionado por familias lacandonas, con caminatas interpretativas y recorridos por ríos."
    ]
  }
};
// === Catálogo mensual por MUNICIPIO (Chiapas) ===
const eventosChiapasPorMunicipio = {
  "Tuxtla Gutiérrez": {
    Enero: [], Febrero: [], Marzo: [], Abril: [], Mayo: [], Junio: [],
    Julio: [], Agosto: [], Septiembre: [], Octubre: [], Noviembre: [],
    Diciembre: ["Festejos a la Virgen de Guadalupe (12 dic)"],
  },
  "San Cristóbal de las Casas": {
    Enero: [], Febrero: [], Marzo: [], Abril: ["Feria de la Primavera y de la Paz"],
    Mayo: [], Junio: [], Julio: ["Fiesta de San Cristóbal Mártir (25 jul)"],
    Agosto: ["Expo Internacional del Ámbar"], Septiembre: [],
    Octubre: ["Festival Cervantino Barroco"], Noviembre: ["Día de Muertos"],
    Diciembre: ["Virgen de Guadalupe (12 dic)"],
  },
  "Palenque": {
    Enero: [], Febrero: [], Marzo: ["Equinoccio de Primavera (20–21)"],
    Abril: [], Mayo: [], Junio: [], Julio: [], Agosto: [],
    Septiembre: ["Equinoccio de Otoño (22–23)"], Octubre: [], Noviembre: [], Diciembre: [],
  },
  "Comitán de Domínguez": {
    Enero: [], Febrero: ["Fiesta de San Caralampio"], Marzo: [], Abril: [],
    Mayo: [], Junio: [], Julio: [], Agosto: [], Septiembre: [],
    Octubre: [], Noviembre: [], Diciembre: [],
  },
  "Chiapa de Corzo": {
    Enero: ["Fiesta Grande (Parachicos, 4–23)"], Febrero: [], Marzo: [], Abril: [],
    Mayo: [], Junio: [], Julio: [], Agosto: [], Septiembre: [],
    Octubre: [], Noviembre: [], Diciembre: [],
  },
  "Tapachula": {
    Enero: [], Febrero: [], Marzo: ["Expo Feria Tapachula (variable)"],
    Abril: ["Expo Feria Tapachula (algunas ediciones)"],
    Mayo: ["Expo Feria Tapachula (algunas ediciones)"], Junio: [], Julio: [],
    Agosto: [], Septiembre: [], Octubre: [], Noviembre: ["Festival Fray Matías"],
    Diciembre: [],
  },
  "Ocosingo": {
    Enero: [], Febrero: [], Marzo: [], Abril: [], Mayo: [], Junio: [],
    Julio: [], Agosto: [], Septiembre: [], Octubre: [], Noviembre: [], Diciembre: [],
  },
};

// helper: SOLO del mes y del municipio actual (usa catálogo + eventos propios que coincidan)
const getEventosDelMesMunicipio = (municipio, mes, datosMunicipio) => {
  if (!mes) return (datosMunicipio?.eventos || []);
  const cat = (eventosChiapasPorMunicipio[municipio] && eventosChiapasPorMunicipio[municipio][mes]) || [];
  const propios = (datosMunicipio?.eventos || [])
    .filter(ev => String(ev.fecha || "").toLowerCase().includes(mes.toLowerCase()))
    .map(ev => ev.nombre);
  const unicos = Array.from(new Set([...cat, ...propios]));
  return unicos.map(nombre => ({ nombre, fecha: mes }));
};


// -----------------------------------------------------------------------------
// TEMA VISUAL + MEDIOS (imágenes). Ajusta rutas a tus assets.
// -----------------------------------------------------------------------------
const THEME_BY_MUNICIPIO = {
  'Tuxtla Gutiérrez': {
    header: new URL('../../assets/chiapas/tuxtla-header.jpg', import.meta.url).href,
    bg: 'bg-emerald-50', title: 'text-emerald-800', card: 'bg-white/80',
    btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    btnSecondary: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-800'
  },
  'San Cristóbal de las Casas': {
    header: new URL('../../assets/chiapas/sancris-header.jpg', import.meta.url).href,
    bg: 'bg-rose-50', title: 'text-rose-800', card: 'bg-white/80',
    btnPrimary: 'bg-rose-600 hover:bg-rose-700 text-white',
    btnSecondary: 'bg-rose-100 hover:bg-rose-200 text-rose-800',
    badge: 'bg-rose-100 text-rose-800'
  },
  Palenque: {
    header: new URL('../../assets/chiapas/palenque-header.jpg', import.meta.url).href,
    bg: 'bg-teal-50', title: 'text-teal-800', card: 'bg-white/80',
    btnPrimary: 'bg-teal-600 hover:bg-teal-700 text-white',
    btnSecondary: 'bg-teal-100 hover:bg-teal-200 text-teal-800',
    badge: 'bg-teal-100 text-teal-800'
  },
  'Comitán de Domínguez': {
    header: new URL('../../assets/chiapas/comitan-header.jpg', import.meta.url).href,
    bg: 'bg-amber-50', title: 'text-amber-800', card: 'bg-white/80',
    btnPrimary: 'bg-amber-600 hover:bg-amber-700 text-white',
    btnSecondary: 'bg-amber-100 hover:bg-amber-200 text-amber-800',
    badge: 'bg-amber-100 text-amber-800'
  },
  'Chiapa de Corzo': {
    header: new URL('../../assets/chiapas/chiapa-header.jpg', import.meta.url).href,
    bg: 'bg-cyan-50', title: 'text-cyan-800', card: 'bg-white/80',
    btnPrimary: 'bg-cyan-600 hover:bg-cyan-700 text-white',
    btnSecondary: 'bg-cyan-100 hover:bg-cyan-200 text-cyan-800',
    badge: 'bg-cyan-100 text-cyan-800'
  },
  Tapachula: {
    header: new URL('../../assets/chiapas/tapachula-header.jpg', import.meta.url).href,
    bg: 'bg-lime-50', title: 'text-lime-800', card: 'bg-white/80',
    btnPrimary: 'bg-lime-600 hover:bg-lime-700 text-white',
    btnSecondary: 'bg-lime-100 hover:bg-lime-200 text-lime-800',
    badge: 'bg-lime-100 text-lime-800'
  },
  Ocosingo: {
    header: new URL('../../assets/chiapas/ocosingo-header.jpg', import.meta.url).href,
    bg: 'bg-stone-50', title: 'text-stone-800', card: 'bg-white/80',
    btnPrimary: 'bg-stone-600 hover:bg-stone-700 text-white',
    btnSecondary: 'bg-stone-100 hover:bg-stone-200 text-stone-800',
    badge: 'bg-stone-100 text-stone-800'
  },
  _default: {
    header: new URL('../../assets/chiapas/chiapas-generic.jpg', import.meta.url).href,
    bg: 'bg-emerald-50', title: 'text-emerald-800', card: 'bg-white/80',
    btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    btnSecondary: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-800'
  }
};

// Imágenes por categoría (puedes cambiar las rutas a tus assets)
const MEDIA_BY_MUNICIPIO = {
  'Tuxtla Gutiérrez': {
    lugares: {
      'Parque de la Marimba': new URL('../../assets/chiapas/tuxtla-marimba.jpg', import.meta.url).href,
      'Miradores del Cañón del Sumidero': new URL('../../assets/chiapas/sumidero-miradores.jpg', import.meta.url).href,
      'ZOOMAT (Zoológico Miguel Álvarez del Toro)': new URL('../../assets/chiapas/zoomat.jpg', import.meta.url).href
    },
    gastronomia: {
      'Cochito horneado': new URL('../../assets/chiapas/tuxtla-cochito.jpg', import.meta.url).href,
      'Tamales chiapanecos': new URL('../../assets/chiapas/tamales-chiapanecos.jpg', import.meta.url).href,
      'Sopa de pan': new URL('../../assets/chiapas/sopa-pan.jpg', import.meta.url).href
    },
    artesanias: {
      'Laca chiapaneca': new URL('../../assets/chiapas/laca.jpg', import.meta.url).href,
      'Marimbas en miniatura': new URL('../../assets/chiapas/marimba-mini.jpg', import.meta.url).href
    }
  },
  'San Cristóbal de las Casas': {
    lugares: {
      'Andador Eclesiástico': new URL('../../assets/chiapas/sancris-andador.jpg', import.meta.url).href,
      'Iglesia y Exconvento de Santo Domingo (artesanías)': new URL('../../assets/chiapas/santo-domingo.jpg', import.meta.url).href,
      'Museo del Ámbar': new URL('../../assets/chiapas/museo-ambar.jpg', import.meta.url).href
    },
    gastronomia: {
      Tascalate: new URL('../../assets/chiapas/tascalate.jpg', import.meta.url).href,
      'Pan coleto': new URL('../../assets/chiapas/pan-coleto.jpg', import.meta.url).href,
      'Café de altura': new URL('../../assets/chiapas/cafe-altura.jpg', import.meta.url).href
    },
    artesanias: {
      'Textiles tzotziles': new URL('../../assets/chiapas/textiles.jpg', import.meta.url).href,
      'Joyería en ámbar': new URL('../../assets/chiapas/ambar.jpg', import.meta.url).href
    }
  },
  Palenque: {
    lugares: {
      'Zona Arqueológica de Palenque': new URL('../../assets/chiapas/palenque-zona.jpg', import.meta.url).href,
      'Cascadas de Misol-Ha': new URL('../../assets/chiapas/misolha.jpg', import.meta.url).href,
      'Cascadas de Agua Azul': new URL('../../assets/chiapas/agua-azul.jpg', import.meta.url).href
    },
    gastronomia: {
      'Mole chiapaneco': new URL('../../assets/chiapas/mole-chiapaneco.jpg', import.meta.url).href,
      'Pozol con cacao': new URL('../../assets/chiapas/pozol-cacao.jpg', import.meta.url).href
    },
    artesanias: {
      'Tallado en madera': new URL('../../assets/chiapas/madera.jpg', import.meta.url).href,
      'Máscaras y réplicas mayas': new URL('../../assets/chiapas/mascaras.jpg', import.meta.url).href
    }
  }
};

const MEDIA_EVENTOS = {
  'Fiesta Grande de Chiapa de Corzo': new URL('../../assets/chiapas/evento-chiapa-grande.jpg', import.meta.url).href,
  'Festival Cervantino Barroco': new URL('../../assets/chiapas/evento-cervantino.jpg', import.meta.url).href,
  'Equinoccio en Palenque': new URL('../../assets/chiapas/evento-equinoccio.jpg', import.meta.url).href
};

// -----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL
// -----------------------------------------------------------------------------
export default function MunicipioDetalleChiapas() {
  const { nombre } = useParams();
  const navigate = useNavigate();

  // Usar clave canónica para que siempre coincida con datos y catálogo
  const municipioKey = useMemo(() => {
    return Object.keys(datosMunicipiosChiapas).find(
      (k) => normalizar(k) === normalizar(nombre)
    ) || nombre;
  }, [nombre]);

  const getDatosCompletos = (key) => {
  const datosBase = datosMunicipiosChiapas[key];
  if (!datosBase) {
    return makeEmptyMunicipio(key); // Si no existe, devuelve la plantilla vacía
  }
  // Si existe, se asegura de que todas las propiedades (lugares, eventos, etc.) sean arrays
  return {
    ...makeEmptyMunicipio(key),
    ...datosBase,
  };
};

const datos = getDatosCompletos(municipioKey);
  const theme = THEME_BY_MUNICIPIO[municipioKey] || THEME_BY_MUNICIPIO._default;


  // Estado de intereses y selecciones
  const [interesado, setInteresado] = useState(false);
  const [seleccionesIds, setSeleccionesIds] = useState(new Set());
  const [ultimoIdAgregado, setUltimoIdAgregado] = useState(null);

  // Mes sincronizado con itinerario general
  const itPersist = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('itinerario') || '{}') || {}; } catch { return {}; }
  }, []);
  const [mesSeleccionado, setMesSeleccionado] = useState(itPersist?.mes || '');

useEffect(() => {
  // cargar interés previo
  try {
const intereses = JSON.parse(localStorage.getItem('interesesMunicipios_Chiapas') || '[]');
if (intereses.includes(municipioKey)) setInteresado(true);
    } catch {}

    // cargar selecciones previas
    try {
      const actuales = (getSelecciones?.() || []).map(s => s.id);
      setSeleccionesIds(new Set(actuales));
    } catch {}
  }, [municipioKey]);

  useEffect(() => {
    const onStorage = () => {
      try {
        const it = JSON.parse(localStorage.getItem('itinerario') || 'null');
        if (it?.mes) setMesSeleccionado(it.mes);
        const actuales = (getSelecciones?.() || []).map(s => s.id);
        setSeleccionesIds(new Set(actuales));
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

if (!datos) {
  return (
    <div className="p-10 text-center">
      <h2 className="text-xl font-semibold mb-3">
        Información próximamente disponible para este municipio
      </h2>
      <p className="text-slate-600 mb-4">
        Estamos trabajando para agregar los lugares destacados, eventos y experiencias.
      </p>
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 rounded-lg bg-emerald-600 text-white"
      >
        Regresar
      </button>
    </div>
  );
}


const idDe = (payload) => `${municipioKey}-${payload.tipo}-${payload.nombre}`;
const estaAgregado = (payload) => seleccionesIds.has(idDe(payload));
  

  const toggleSeleccion = (payload) => {
    const id = idDe(payload);
    if (seleccionesIds.has(id)) {
      removeSeleccion(id);
      const next = new Set(seleccionesIds); next.delete(id); setSeleccionesIds(next);
      setUltimoIdAgregado(null);
      alert(`❌ ${payload.nombre} (${payload.tipo}) se quitó de tu itinerario`);
    } else {
      const enriched = { ...payload, meta: { ...(payload.meta || {}), source: 'MunicipioDetalleChiapas' } };
      const ok = addSeleccion({ id, municipio: municipioKey, estado: "Chiapas", ...enriched });
      const next = new Set(seleccionesIds); next.add(id); setSeleccionesIds(next);
      setUltimoIdAgregado(id);
      alert(`✅ ${payload.nombre} (${payload.tipo}) se agregó a tu itinerario${ok ? '' : ' (ya estaba antes)'}`);
    }
  };

const manejarInteres = () => {
  setInteresado(true);
  alert(`🌟 Marcaste interés por visitar ${municipioKey}`);

  try {
    // 1. Leemos la lista completa de intereses de Chiapas.
    let interesesActuales = JSON.parse(localStorage.getItem("interesesMunicipios_Chiapas") || "[]");

    // 2. Quitamos el municipio actual si ya estaba para evitar duplicados y poder moverlo al frente.
    interesesActuales = interesesActuales.filter(m => m !== municipioKey);

    // 3. Añadimos el municipio actual AL PRINCIPIO de la lista.
    interesesActuales.unshift(municipioKey);

    // 4. Guardamos la lista reordenada.
    localStorage.setItem("interesesMunicipios_Chiapas", JSON.stringify(interesesActuales));

    // 5. Actualizamos el borrador del itinerario para activar el modo de "Enfoque Local".
    const it = JSON.parse(localStorage.getItem("itinerario") || "{}");
    localStorage.setItem("itinerario", JSON.stringify({
      ...it,
      modoDestino: "auto",
      lugarInicio: municipioKey,
      // Aseguramos que el estado sea el correcto en el borrador
      estado: "Chiapas" 
    }));
  } catch (e) {
    console.error("Error al manejar el interés:", e);
  }
};



  const getMedia = (categoria, itemNombre) => {
    const m = MEDIA_BY_MUNICIPIO[municipioKey] || {};
    return (m[categoria] && m[categoria][itemNombre]) || theme.header; // nunca null
  };

  const getEventoImg = (evento) => {
    if (!evento) return theme.header;
    const base = evento.split(' (')[0].split(' –')[0].trim();
    return MEDIA_EVENTOS[evento] || MEDIA_EVENTOS[base] || theme.header;
  };

const eventosFiltrados = mesSeleccionado
  ? getEventosDelMesMunicipio(municipioKey, mesSeleccionado, datos)
  : (datos.eventos || []);



  return (
    <div className={`${theme.bg} min-h-[100dvh]`}> 
      {/* Header */}
      <header className="relative h-[220px] md:h-[280px] w-full overflow-hidden">
        <img src={theme.header} alt={municipioKey} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-6">
          <div>
            <h1 className={`text-3xl md:text-4xl font-extrabold drop-shadow ${theme.title}`}>{municipioKey}</h1>
            
            <p className="text-white/90 max-w-3xl mt-1">{datos.descripcion}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={manejarInteres} className={`px-3 py-1.5 rounded-lg ${theme.btnPrimary}`}>{interesado ? '★ Me interesa (marcado)' : '☆ Me interesa'}</button>
              <Link to="/mapa-chiapas" className={`px-3 py-1.5 rounded-lg ${theme.btnSecondary}`}>Volver al mapa</Link>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda: Lugares */}
        <section className="lg:col-span-2 space-y-6">
          {/* Lugares destacados */}
          <div className={`${theme.card} rounded-2xl p-5 shadow border border-black/5`}>
            <h2 className="text-xl font-bold mb-3">Lugares destacados</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
               {datos.lugares.length === 0 ? (
               <p className="text-slate-600 text-sm">Aún no hay lugares cargados para este municipio.</p>
                 ) : datos.lugares.map((lugar) => (
                <article key={lugar} className="rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200">
                  <div className="aspect-[16/10] bg-slate-100">
                    <img src={getMedia('lugares', lugar)} alt={lugar} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-slate-800 text-sm">{lugar}</h3>
                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={() => toggleSeleccion({ tipo: 'lugar', nombre: lugar, icono: '📍' })}
                        className={`px-2 py-1 rounded-md text-xs font-medium border ${estaAgregado({ tipo: 'lugar', nombre: lugar }) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white hover:bg-emerald-50 border-emerald-300 text-emerald-700'}`}
                      >
                        {estaAgregado({ tipo: 'lugar', nombre: lugar }) ? 'Agregado' : 'Agregar'}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Eventos del mes */}
          <div className={`${theme.card} rounded-2xl p-5 shadow border border-black/5`}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">Eventos</h2>
              <select
                value={mesSeleccionado}
                onChange={(e) => {
                  setMesSeleccionado(e.target.value);
                  try {
                    const it = JSON.parse(localStorage.getItem('itinerario') || '{}');
                    localStorage.setItem('itinerario', JSON.stringify({ ...it, mes: e.target.value }));
                  } catch {}
                }}
                className="border rounded-lg px-3 py-1 text-sm"
              >
                <option value="">Todos</option>
                {["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            {eventosFiltrados.length === 0 ? (
              <p className="text-slate-600 text-sm">No hay eventos listados para el mes seleccionado.</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventosFiltrados.map((ev) => (
                  <article key={ev.nombre} className="rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200">
                    <div className="aspect-[16/10] bg-slate-100">
                      <img src={getEventoImg(ev.nombre)} alt={ev.nombre} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-slate-800 text-sm">{ev.nombre}</h3>
                      <p className="text-xs text-slate-600">{ev.fecha}</p>
                      <div className="mt-2">
                        <button
                          onClick={() => toggleSeleccion({ tipo: 'evento', nombre: ev.nombre, icono: '🎉', meta: { mes: ev.fecha } })}
                          className={`px-2 py-1 rounded-md text-xs font-medium border ${estaAgregado({ tipo: 'evento', nombre: ev.nombre }) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white hover:bg-emerald-50 border-emerald-300 text-emerald-700'}`}
                        >
                          {estaAgregado({ tipo: 'evento', nombre: ev.nombre }) ? 'Agregado' : 'Agregar'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
{Array.isArray(datos.rutasComunitarias) && datos.rutasComunitarias.length > 0 && (
            <div className={`${theme.card} rounded-2xl p-5 shadow border border-black/5`}>
              <h2 className="text-xl font-bold mb-3">Rutas de turismo comunitario</h2>
              <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-4">
                {datos.rutasComunitarias.map((ruta) => (
                  <article key={ruta} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-semibold text-teal-700">EXPERIENCIA LOCAL</p>
                      <p className="text-sm font-medium text-slate-800 mt-1">{ruta}</p>
                    </div>
                    <button
                      onClick={() => toggleSeleccion({ tipo: 'rutaComunitaria', nombre: ruta, icono: '🤝' })}
                      className={`mt-3 w-full px-2 py-1 rounded-md text-xs font-medium border ${estaAgregado({ tipo: 'rutaComunitaria', nombre: ruta }) ? 'bg-teal-600 text-white border-teal-600' : 'bg-white hover:bg-teal-50 border-teal-300 text-teal-700'}`}
                    >
                      {estaAgregado({ tipo: 'rutaComunitaria', nombre: ruta }) ? 'Agregado a mi ruta' : 'Agregar a mi ruta'}
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}
          {/* Talleres */}
          {Array.isArray(datos.talleres) && datos.talleres.length > 0 && (
            <div className={`${theme.card} rounded-2xl p-5 shadow border border-black/5`}>
              <h2 className="text-xl font-bold mb-3">Talleres y experiencias</h2>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {datos.talleres.map((t) => (
                  <li key={t} className="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800">{t}</span>
                    <button
                      onClick={() => toggleSeleccion({ tipo: 'taller', nombre: t, icono: '🧑\u200D🎨' })}
                      className={`px-2 py-1 rounded-md text-xs font-medium border ${estaAgregado({ tipo: 'taller', nombre: t }) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white hover:bg-emerald-50 border-emerald-300 text-emerald-700'}`}
                    >
                      {estaAgregado({ tipo: 'taller', nombre: t }) ? 'Agregado' : 'Agregar'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Columna derecha: Gastronomía y Artesanías */}
        <aside className="space-y-6">
          {/* Gastronomía */}
          <div className={`${theme.card} rounded-2xl p-5 shadow border border-black/5`}>
            <h2 className="text-xl font-bold mb-3">Gastronomía típica</h2>
            <ul className="space-y-3">
              {(datos.gastronomia || []).map((g) => (
                <li key={g} className="flex items-center gap-3 bg-white rounded-xl p-2 border border-slate-200">
                  <img src={getMedia('gastronomia', g)} alt={g} className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-slate-800">{g}</div>
                    <button
                      onClick={() => toggleSeleccion({ tipo: 'gastronomia', nombre: g, icono: '🍽️' })}
                      className={`mt-1 px-2 py-1 rounded-md text-xs font-medium border ${estaAgregado({ tipo: 'gastronomia', nombre: g }) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white hover:bg-emerald-50 border-emerald-300 text-emerald-700'}`}
                    >
                      {estaAgregado({ tipo: 'gastronomia', nombre: g }) ? 'Agregado' : 'Agregar'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Artesanías */}
          {Array.isArray(datos.artesanias) && datos.artesanias.length > 0 && (
            <div className={`${theme.card} rounded-2xl p-5 shadow border border-black/5`}>
              <h2 className="text-xl font-bold mb-3">Artesanías</h2>
              <ul className="space-y-3">
                {datos.artesanias.map((a) => (
                  <li key={a.nombre} className="flex items-center gap-3 bg-white rounded-xl p-2 border border-slate-200">
                    <img src={getMedia('artesanias', a.nombre)} alt={a.nombre} className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-800">{a.nombre}</div>
                      <div className="text-xs text-slate-600">{a.precio}</div>
                      <button
                        onClick={() => toggleSeleccion({ tipo: 'artesania', nombre: a.nombre, icono: '🧶' })}
                        className={`mt-1 px-2 py-1 rounded-md text-xs font-medium border ${estaAgregado({ tipo: 'artesania', nombre: a.nombre }) ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white hover:bg-emerald-50 border-emerald-300 text-emerald-700'}`}
                      >
                        {estaAgregado({ tipo: 'artesania', nombre: a.nombre }) ? 'Agregado' : 'Agregar'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
