import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { addSeleccion, getSelecciones, removeSeleccion } from "../utils/itinerarioStore";
const normalizar = (txt = "") =>
  txt.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// -----------------------------------------------------------------------------
// DATOS BÁSICOS DE CHIAPAS (puedes ampliar libremente)
// -----------------------------------------------------------------------------
const datosMunicipiosChiapas = {
  'Tuxtla Gutiérrez': {
    descripcion:
      'Capital del estado; base perfecta para Cañón del Sumidero, Parque de la Marimba y ZOOMAT.',
    lugares: [
      'Parque de la Marimba',
      'Miradores del Cañón del Sumidero',
      'ZOOMAT (Zoológico Miguel Álvarez del Toro)'
    ],
    sitiosTop: [
      'Parque de la Marimba',
      'Cañón del Sumidero (embarcadero Chiapa de Corzo)',
      'ZOOMAT'
    ],
    sitiosOcultos: [
      'Mirador Los Chiapa',
      'Senderos interpretativos del Zapotal',
      'Mercado 5 de Mayo (antojitos)'
    ],
    eventos: [{ nombre: 'Fiesta Grande de Chiapa de Corzo', fecha: 'Enero' }],
    artesanias: [
      { nombre: 'Laca chiapaneca', precio: 'desde $150' },
      { nombre: 'Marimbas en miniatura', precio: 'desde $250' }
    ],
    talleres: ['Taller de marimba', 'Taller de laca tradicional'],
    gastronomia: ['Cochito horneado', 'Tamales chiapanecos', 'Sopa de pan']
  },
  'San Cristóbal de las Casas': {
    descripcion:
      'Ciudad colonial en los Altos, epicentro cultural, artesanal y cafetero de Chiapas.',
    lugares: [
      'Andador Eclesiástico',
      'Iglesia y Exconvento de Santo Domingo (artesanías)',
      'Museo del Ámbar'
    ],
    sitiosTop: ['Andador Eclesiástico', 'Templo de Santo Domingo', 'Museo del Ámbar'],
    sitiosOcultos: ['Barrio del Cerrillo', 'La Merced y andadores secundarios', 'Museo Kakaw (chocolate)'],
    eventos: [{ nombre: 'Festival Cervantino Barroco', fecha: 'Octubre' }],
    artesanias: [
      { nombre: 'Textiles tzotziles', precio: 'desde $100' },
      { nombre: 'Joyería en ámbar', precio: 'desde $120' }
    ],
    talleres: ['Taller de telar de cintura', 'Catación de café de altura'],
    gastronomia: ['Tascalate', 'Pan coleto', 'Café de altura']
  },
  Palenque: {
    descripcion:
      'Zona arqueológica maya en la selva; base para cascadas como Misol-Ha y Agua Azul.',
    lugares: ['Zona Arqueológica de Palenque', 'Cascadas de Misol-Ha', 'Cascadas de Agua Azul'],
    sitiosTop: ['Zona Arqueológica de Palenque', 'Misol-Ha', 'Agua Azul'],
    sitiosOcultos: ['Cascada de Roberto Barrios', 'Laguna Azul (comunidades)'],
    eventos: [{ nombre: 'Equinoccio en Palenque', fecha: 'Marzo' }],
    artesanias: [
      { nombre: 'Tallado en madera', precio: 'desde $120' },
      { nombre: 'Máscaras y réplicas mayas', precio: 'desde $180' }
    ],
    talleres: ['Guiado arqueológico', 'Senderismo interpretativo'],
    gastronomia: ['Mole chiapaneco', 'Pozol con cacao']
  },
  'Comitán de Domínguez': {
    descripcion:
      'Ciudad colonial cercana a Lagos de Montebello; ambiente tranquilo y cultural.',
    lugares: ['Centro histórico', 'Museo Rosario Castellanos', 'Lagos de Montebello (cercanías)'],
    sitiosTop: ['Centro histórico', 'Teatro Junchavín', 'Lagos de Montebello (ruta)'],
    sitiosOcultos: ['Cenotes y lagunas menos concurridas', 'Museos locales poco visitados'],
    eventos: [],
    artesanias: [{ nombre: 'Madera tallada', precio: 'desde $90' }],
    talleres: ['Talleres literarios / culturales (temporales)'],
    gastronomia: ['Chinculguaje', 'Longaniza de Comitán']
  },
  'Chiapa de Corzo': {
    descripcion:
      'Pueblo Mágico a minutos de Tuxtla; embarcadero al Cañón del Sumidero.',
    lugares: ['Embarcadero al Cañón del Sumidero', 'La Pila (kiosco mudéjar)', 'Museo de la Laca'],
    sitiosTop: ['Embarcadero', 'La Pila', 'Museo de la Laca'],
    sitiosOcultos: ['Talleres familiares de laca', 'Mercado y dulces tradicionales'],
    eventos: [{ nombre: 'Fiesta Grande de Enero', fecha: 'Enero' }],
    artesanias: [{ nombre: 'Laca', precio: 'desde $150' }],
    talleres: ['Taller de laca tradicional'],
    gastronomia: ['Pepita con tasajo', 'Sopa de chipilín']
  },
  Tapachula: {
    descripcion:
      'Ciudad cafetalera y puerta al Pacífico; cercana a volcanes y fincas.',
    lugares: ['Centro histórico', 'Museo del Café', 'Volcán Tacaná (región)'],
    sitiosTop: ['Museo del Café', 'Parque Hidalgo', 'Ruta del café'],
    sitiosOcultos: ['Fincas cafetaleras boutique', 'Mercados con chocolate artesanal'],
    eventos: [],
    artesanias: [{ nombre: 'Café y cacao', precio: 'desde $80' }],
    talleres: ['Catas de café'],
    gastronomia: ['Mariscos y cocina costeña', 'Tamales de chipilín']
  },
  Ocosingo: {
    descripcion:
      'Municipio extenso con vestigios mayas y naturaleza serrana.',
    lugares: ['Toniná (zona arqueológica)', 'Cascadas de las Golondrinas'],
    sitiosTop: ['Toniná', 'Cascadas cercanas'],
    sitiosOcultos: ['Comunidades tseltales con talleres'],
    eventos: [],
    artesanias: [{ nombre: 'Textiles tseltales', precio: 'desde $90' }],
    talleres: ['Talleres comunitarios (textil, madera)'],
    gastronomia: ['Tamales de chipilín', 'Pozol']
  }
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

 const datos = Object.entries(datosMunicipiosChiapas).find(
   ([key]) => normalizar(key) === normalizar(nombre)
 )?.[1];
 const theme = THEME_BY_MUNICIPIO[nombre] || THEME_BY_MUNICIPIO._default;

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
      const intereses = JSON.parse(localStorage.getItem('interesesMunicipios') || '[]');
      if (intereses.includes(nombre)) setInteresado(true);
    } catch {}

    // cargar selecciones previas
    try {
      const actuales = (getSelecciones?.() || []).map(s => s.id);
      setSeleccionesIds(new Set(actuales));
    } catch {}
  }, [nombre]);

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


  const idDe = (payload) => `${nombre}-${payload.tipo}-${payload.nombre}`;
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
      const ok = addSeleccion({ id, municipio: nombre, ...enriched });
      const next = new Set(seleccionesIds); next.add(id); setSeleccionesIds(next);
      setUltimoIdAgregado(id);
      alert(`✅ ${payload.nombre} (${payload.tipo}) se agregó a tu itinerario${ok ? '' : ' (ya estaba antes)'}`);
    }
  };

const manejarInteres = () => {
  setInteresado(true);
  try {
    const intereses = JSON.parse(localStorage.getItem("interesesMunicipios") || "[]");
    if (!intereses.includes(nombre)) {
      intereses.push(nombre);
      localStorage.setItem("interesesMunicipios", JSON.stringify(intereses));
    }

    const it = JSON.parse(localStorage.getItem("itinerario") || "{}");

   localStorage.setItem(
     "itinerario",
     JSON.stringify({
       ...it,
       modoDestino: "automatico",
       lugarInicio: nombre
     })
   );
  } catch {}
  alert(`🌟 Marcaste interés por visitar ${nombre}`);
};



  const getMedia = (categoria, itemNombre) => {
    const m = MEDIA_BY_MUNICIPIO[nombre] || {};
    return (m[categoria] && m[categoria][itemNombre]) || theme.header; // nunca null
  };

  const getEventoImg = (evento) => {
    if (!evento) return theme.header;
    const base = evento.split(' (')[0].split(' –')[0].trim();
    return MEDIA_EVENTOS[evento] || MEDIA_EVENTOS[base] || theme.header;
  };

  const eventosFiltrados = (datos.eventos || []).filter(ev =>
    !mesSeleccionado || (ev.fecha || '').toLowerCase().includes(mesSeleccionado.toLowerCase())
  );

  return (
    <div className={`${theme.bg} min-h-[100dvh]`}> 
      {/* Header */}
      <header className="relative h-[220px] md:h-[280px] w-full overflow-hidden">
        <img src={theme.header} alt={nombre} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-6">
          <div>
            <h1 className={`text-3xl md:text-4xl font-extrabold drop-shadow ${theme.title}`}>{nombre}</h1>
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
