import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import jicaraImg from '../assets/jícara.gif';
import canastaImg from '../assets/canasta.mimbre.jpg';
import guayaberaImg from '../assets/guayabera.jpg';
import molcajeteImg from '../assets/molcajete.jpg';
import blusaImg from '../assets/blusa.png';
import ceramicaImg from '../assets/ceramica.jpg';
import mueblesImg from '../assets/muebles-de-mimbre.webp';
import tabasquenaImg from '../assets/mujer.jpg';
import cestasImg from '../assets/cestas.jpg';
import logo from '../assets/Logo.png';
import { Menu } from 'lucide-react';
import tirasBordadasImg from '../assets/TirasBordadas.jpeg';
import bisuteriaMaderaImg from "../assets/BisuteríaMadera.jpg";

export default function ProductosTabasco() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
// 1) Catálogo completo (deja tus mismos productos)
const productosAll = [
  { id: 1, nombre: "Jícara decorada a mano", artesano: "Doña Lupita", horario: "10:00 a 18:00", precio: "$150 MXN", imagen: jicaraImg },
  { id: 2, nombre: "Canasta de mimbre tradicional", artesano: "Don Martín Pérez", horario: "09:00 a 17:00", precio: "$90 MXN", imagen: canastaImg },
  { id: 3, nombre: "Guayabera con bordado de chaquira", artesano: "Artesanos de Tapijulapa", horario: "10:00 a 19:00", precio: "$450 MXN", imagen: guayaberaImg },
  { id: 4, nombre: "Molcajete de piedra volcánica", artesano: "Don Evaristo López", horario: "08:00 a 15:00", precio: "$280 MXN", imagen: molcajeteImg },
  { id: 5, nombre: "Blusa típica bordada", artesano: "Colectivo Tékila", horario: "11:00 a 20:00", precio: "$320 MXN", imagen: blusaImg },
  { id: 6, nombre: "Cerámica artesanal decorativa", artesano: "Alfarería Uxpanapa", horario: "09:00 a 17:00", precio: "$200 - $600 MXN", imagen: ceramicaImg },
  { id: 7, nombre: "Juego de muebles de mimbre", artesano: "Mueblería Manos de Tabasco", horario: "08:00 a 18:00", precio: "$2,500 - $8,000 MXN", imagen: mueblesImg },
  { id: 8, nombre: "Figura típica tabasqueña", artesano: "Talleres de Comalcalco", horario: "10:00 a 19:00", precio: "$320 MXN", imagen: tabasquenaImg },
  { id: 9, nombre: "Cestas de palma multicolor", artesano: "Mujeres de Nacajuca", horario: "09:00 a 16:00", precio: "$100 - $180 MXN", imagen: cestasImg },
  { id: 10, nombre: "Tiras bordadas típicas", artesano: "Colectivo Textil Tabasco", horario: "09:00 a 17:00", precio: "$280 MXN", imagen: tirasBordadasImg },
{ id: 11, nombre: "Bisutería de madera artesanal", artesano: "César Augusto Reynosa Reyes", horario: "10:00 a 18:00", precio: "Variado entre $70 a $300 MXN", imagen: bisuteriaMaderaImg },];
// 2) Lee el municipio de la navegación (state o ?municipio=)
const location = useLocation();
// Estado para vista Comerciar y traducción
const [tradeProduct, setTradeProduct] = useState(null);
// Bloquear scroll del body cuando el modal Comerciar está abierto
useEffect(() => {
  if (tradeProduct) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
  return () => {
    document.body.style.overflow = 'auto';
  };
}, [tradeProduct]);

 const [fromLang, setFromLang] = useState('español');
 const [toLang, setToLang] = useState("yokot'an (chontal)");
const [sourceText, setSourceText] = useState('');
// --- Intercambiar idiomas (flecha)
function swapLangs() {
  const temp = fromLang;
  setFromLang(toLang);
  setToLang(temp);
}

// --- Sugerencias por idioma de origen (demo)
const suggestionSets = {
  "español": [
    "hola", "gracias", "¿cuánto?", "precio", "quiero comprar", "artesanía", "horario", "¿dónde está?"
  ],
  "inglés": [
    "hello", "thank you", "how much?", "price", "i want to buy", "handicraft", "opening hours", "where is it?"
  ],
  "yokot'an (chontal)": [
    "Jamej", "Yajintik", "Jats’ k’uch’?", "K’uch’", "K’ele’", "Jach’ t’ujum", "Tsan"
  ],
};

// Normaliza el nombre del idioma para leer el set
function normalizeLangName(name) {
  const n = (name || "").toLowerCase();
  if (n.includes("yokot")) return "yokot'an (chontal)";
  if (n.includes("ingl")) return "inglés";
  return "español";
}

const suggestions = suggestionSets[normalizeLangName(fromLang)] || [];

// Insertar sugerencia en el textarea (respetando espacio)
function addSuggestion(s) {
  setSourceText(s);
}


// --- Utilidad para regex seguro (por si hay signos, tildes, etc.)
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// --- Reemplazo por frases/palabras (case-insensitive, conserva capitalización inicial)
function replaceByDict(text, dict, {useWordBoundary = true} = {}) {
  let out = text;
  const entries = Object.entries(dict).sort((a,b) => b[0].length - a[0].length); // priorizar frases largas
  for (const [src, dst] of entries) {
    const pattern = useWordBoundary ? `\\b${escapeRegExp(src)}\\b` : `${escapeRegExp(src)}`;
    const re = new RegExp(pattern, 'gi');
    out = out.replace(re, (m) => {
      const capital = m[0] === m[0].toUpperCase();
      return capital ? dst.charAt(0).toUpperCase() + dst.slice(1) : dst;
    });
  }
  return out;
}

// Diccionario minimal de ejemplo (demo). Podemos ampliarlo después.
const yokotanGlossary = {
  "hola": "Jamej",
  "buenos días": "Jamej wits’",
  "buenas tardes": "Jamej ts’ej",
  "buenas noches": "Jamej ajk’",
  "gracias": "Yajintik",
  "por favor": "T’uch’uje’",
  "sí": "Ji'",
  "no": "Ma’",
  "¿cuánto?": "Jats’ k’uch’?",
  "precio": "K’uch’",
  "vender": "Tso’ob",
  "comprar": "Tso’on",
  "artesanía": "Jach’ t’ujum",
  "dónde": "Tsan",
  "cuándo": "Júun",
  "quiero": "K’ele’",
  "necesito": "Ka'aj",
};
// Cambia este valor por la forma correcta en yokot'an (chontal)
const CHONTAL_HORARIO = "Horario (yokot'an)"; // TODO: reemplazar por la forma validada

// Ampliar yokotanGlossary con variantes y frases completas
Object.assign(yokotanGlossary, {
  // Variantes de "¿cuánto?"
  "cuánto": "Jats’ k’uch’?",
  "cuanto": "Jats’ k’uch’?",
  "¿cuanto?": "Jats’ k’uch’?",

  // Frases completas de ubicación
  "dónde está": "Tsan",
  "donde esta": "Tsan",

  // Horario
  "horario": CHONTAL_HORARIO,
});

// Invertido para Yokot’an -> Español (demo)
const yokotanToEs = Object.fromEntries(
  Object.entries(yokotanGlossary).map(([es, yo]) => [yo.toLowerCase(), es])
);

// Mini glosario ES <-> EN (palabras útiles de comercio)
const esToEn = {
  "hola": "hello",
  "buenos días": "good morning",
  "buenas tardes": "good afternoon",
  "buenas noches": "good evening",
  "gracias": "thank you",
  "por favor": "please",
  "precio": "price",
  "¿cuánto?": "how much?",
  "vender": "sell",
  "comprar": "buy",
  "artesanía": "handicraft",
  "cesta": "basket",
  "madera": "wood",
  "abierto": "open",
  "cerrado": "closed",
  "horario": "opening hours",
  "dónde está": "where is it?",
"donde esta": "where is it?",
  "quiero": "i want",
  "necesito": "i need",
};
// Inglés -> Chontal
function translateEnToYokotan(text) {
  if (!text) return "";
  // Paso 1: Inglés -> Español
  let toEs = replaceByDict(text, enToEs, { useWordBoundary: true });
  // Paso 2: Español -> Chontal
  let toYo = replaceByDict(toEs, yokotanGlossary, { useWordBoundary: true });
  return toYo ? `${toYo}  (≈ demo yokot'an)` : "";
}

// Chontal -> Inglés
function translateYokotanToEn(text) {
  if (!text) return "";
  // Paso 1: Chontal -> Español
  let toEs = replaceByDict(text, yokotanToEs, { useWordBoundary: false });
  // Paso 2: Español -> Inglés
  let toEn = replaceByDict(toEs, esToEn, { useWordBoundary: true });
  return toEn ? `${toEn}  (≈ demo en)` : "";
}

const enToEs = Object.fromEntries(Object.entries(esToEn).map(([es, en]) => [en, es]));



// Traducción muy simple palabra/frase (demo). Para producción: API o glosario curado.
function translateToYokotan(text) {
  if (!text) return "";
  const out = replaceByDict(text, yokotanGlossary, {useWordBoundary: true});
  return out ? `${out}  (≈ demo yokot'an)` : "";
}


// Resultado según selección
const translatedText = translate(sourceText, fromLang, toLang);
  function translateYokotanToEs(text) {
  if (!text) return "";
  // en Yokot’an hay apóstrofes, evita \b
  const out = replaceByDict(text, yokotanToEs, {useWordBoundary: false});
  return out ? `${out}  (≈ demo español)` : "";
}
function translateEsToEn(text) {
  if (!text) return "";
  const out = replaceByDict(text, esToEn, {useWordBoundary: true});
  return out ? `${out}  (≈ demo en)` : "";
}
function translateEnToEs(text) {
  if (!text) return "";
  const out = replaceByDict(text, enToEs, {useWordBoundary: true});
  return out ? `${out}  (≈ demo es)` : "";
}

// Router según selección
function translate(text, from, to) {
  if (!text) return "";
  const f = from.toLowerCase();
  const t = to.toLowerCase();

  // Chontal -> Español
  if (f.includes("yokot") && t === "español") return translateYokotanToEs(text);

  // Español -> Chontal
  if (f === "español" && t.includes("yokot")) return translateToYokotan(text);

  // Español -> Inglés
  if (f === "español" && t === "inglés") return translateEsToEn(text);

  // Inglés -> Español
  if (f === "inglés" && t === "español") return translateEnToEs(text);

// Inglés -> Chontal
if (f === "inglés" && t.includes("yokot")) return translateEnToYokotan(text);

// Chontal -> Inglés
if (f.includes("yokot") && t === "inglés") return translateYokotanToEn(text);

  return text;
}


const municipioFromState = location.state?.municipio || '';
const municipioFromQuery = new URLSearchParams(location.search).get('municipio') || '';
const municipio = municipioFromState || municipioFromQuery || '';
const backTo = municipio
  ? `/municipio/${encodeURIComponent(municipio)}`
  : '/mapa-tabasco';


// 3) “Reparte” qué muestra cada municipio (IDs del catálogo)
const productosPorMunicipio = {
  // Distribución (pueden repetirse; luego los ajustas a tu gusto)
  "Balancán":          [1, 6],
  "Cardenas":          [2, 7],
  "Centla":            [1, 9],
  "Centro":            [1, 2, 10, 11], // Figura típica, Canasta
  "Comalcalco":        [6, 8], // Cerámica, Figura típica
  "Cunduacán":         [2, 6], // Canasta, Cerámica
  "Emiliano Zapata":   [1, 4], // Jícara, Molcajete
  "Huimanguillo":      [7, 4], // Muebles mimbre, Molcajete
  "Jalapa":            [5, 4], // Blusa bordada, Molcajete
  "Jalpa de Méndez":   [5, 2], // Blusa, Canasta
  "Jonuta":            [9, 1], // Cestas palma, Jícara
  "Macuspana":         [4, 7], // Molcajete, Muebles mimbre
  "Nacajuca":          [9, 2], // Cestas palma, Canasta
  "Paraíso":           [7, 2], // Acentuado
  "Paraiso":           [7, 2], // Alias sin acento por si llega así
  "Tacotalpa":         [3, 6], // Guayabera, Cerámica
  "Teapa":             [3, 4], // Guayabera, Molcajete
  "Tenosique":         [1, 3], // Jícara, Guayabera
};

// 4) Calcula la lista final a mostrar
const idsSeleccionados = productosPorMunicipio[municipio] || null;
const productos = idsSeleccionados
  ? productosAll.filter(p => idsSeleccionados.includes(p.id))
  : productosAll;


  return (
<div className="text-[var(--color-text)]">
  {/* Header */}
  <header className="sticky top-0 z-50 w-full py-4 px-6 flex justify-between items-center bg-[var(--color-primary)] shadow-md">
    <div className="flex items-center gap-4">
      <img src={logo} alt="Logo" className="h-10 sm:h-12 w-auto" />
      <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide drop-shadow-md text-black">
        Pueblos de Ensueño
      </h1>
    </div>
    <nav className="hidden md:flex gap-3 lg:gap-5 items-center">
      {['/puntos-cercanos','/mapa','/InterestsSelector','/login'].map((path, i) => (
        <Link key={i} to={path}>
          <button className="px-5 py-3 bg-[var(--orange-250)] hover:bg-[var(--color-secondary)] text-black rounded-full font-semibold shadow-sm transition">
            {['Puntos cercanos','Mapa Interactivo','Invitado','Iniciar sesión'][i]}
          </button>
        </Link>
      ))}
    </nav>
    <button className="block md:hidden text-gray-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
      <Menu size={24} />
    </button>
  </header>

  {/* Mobile Nav */}
  {mobileMenuOpen && (
    <nav className="md:hidden bg-[var(--orange-250)] shadow-md px-6 py-4 space-y-2">
      {['/puntos-cercanos','/mapa','/InterestsSelector','/login'].map((path, i) => (
        <Link key={i} to={path}>
          <button className="w-full px-5 py-3 bg-[var(--orange-250)] hover:bg-[var(--color-secondary)] text-black rounded-lg font-semibold transition">
            {['Puntos cercanos','Mapa Interactivo','Invitado','Iniciar sesión'][i]}
          </button>
        </Link>
      ))}
    </nav>
  )}
  {/* CONTENIDO principal */}
<main className="min-h-screen p-4 bg-gradient-to-br from-rose-100 via-amber-100 to-lime-100">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
    <h1 className="text-2xl sm:text-3xl font-bold text-pink-600">
      {`Productos Artesanales de ${municipio || 'Tabasco'}`}
    </h1>

    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
<Link
  to={backTo}
  state={municipio ? { municipio } : undefined}
  className="w-full sm:w-auto text-center bg-pink-500 text-white py-2 px-4 sm:px-6 rounded-full shadow-md hover:bg-pink-600 transition"
>
  {`← Volver a ${municipio ? municipio : 'el mapa'}`}
</Link>


      <a
        href="https://wise.com/mx/currency-converter/mxn-to-usd-rate"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full sm:w-auto text-center bg-green-500 text-white py-2 px-4 sm:px-6 rounded-full shadow-md hover:bg-green-600 transition"
      >
        Convertidor de divisas
      </a>
    </div>
  </div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
    {productos.map(producto => (
      <div
        key={producto.id}
        className="bg-white rounded-2xl shadow-lg p-4 border border-pink-200 flex flex-col"
      >
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-52 sm:h-64 md:h-72 lg:h-80 object-cover rounded-lg mb-4"
        />
        <h3 className="text-lg sm:text-xl font-bold text-pink-700 mb-2">{producto.nombre}</h3>
        <p className="text-sm text-gray-700 mb-1">👤 <strong>{producto.artesano}</strong></p>
        <p className="text-sm text-gray-600 mb-1">🕐 {producto.horario}</p>
        <p className="text-sm text-gray-600 mb-3">💰 {producto.precio}</p>

        <div className="mt-auto flex flex-col gap-2">
          <button className="w-full text-yellow-500 hover:text-yellow-600 transition flex items-center justify-center gap-1">
            <span className="material-icons">star</span>
            Me interesa
          </button>
          <button className="w-full bg-blue-100 text-blue-700 font-medium px-4 py-2 rounded-lg hover:bg-blue-200 transition flex items-center justify-center gap-2">
            <span className="material-icons">location_on</span>
            Mostrar en el mapa
          </button>
<button
  className="w-full bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 transition flex items-center justify-center gap-2 rounded-md py-2"
  onClick={() => setTradeProduct(producto)}
>
  <span className="material-icons">shopping_cart</span>
  Comerciar
</button>

        </div>
      </div>
    ))}
  </div>
  {tradeProduct && (
  <section className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
    <div className="
  bg-white
  w-full h-dvh rounded-none p-3
  overflow-y-auto
  md:w-4/5 md:max-h-[90vh] md:h-auto md:rounded-2xl md:p-6
  lg:w-3/4 xl:w-2/3
  shadow-xl
">

      {/* Header consistente */}
      <header className="flex items-center justify-between pb-3 md:pb-4 border-b">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-8" />
          <h2 className="text-xl md:text-2xl font-bold text-pink-700">
            Comerciar — {tradeProduct?.nombre}
          </h2>
        </div>
<button
    className="px-4 py-2 text-sm md:text-base rounded-md border hover:bg-gray-50 active:scale-[0.99]"
    onClick={() => setTradeProduct(null)}
  >
    Cerrar
  </button>
</header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 py-4 md:py-6">
        {/* Imagen / ficha */}
        <div>
          <img src={tradeProduct?.imagen} alt={tradeProduct?.nombre} className="w-full h-72 md:h-64 object-cover rounded-lg" />
          <div className="mt-4 space-y-1 text-sm">
            <p className="font-semibold">{tradeProduct?.nombre}</p>
            <p>👤 {tradeProduct?.artesano}</p>
            <p>🕐 {tradeProduct?.horario}</p>
            <p>💰 {tradeProduct?.precio}</p>
          </div>
        </div>

        {/* Zona de traducción estilo captura */}
        <div>
          <div className="flex items-center gap-2 mb-2 text-sm">
            <span className="px-2 py-1 rounded bg-gray-100">Texto</span>
            <span className="px-2 py-1 rounded bg-gray-100">Imágenes</span>
            <span className="px-2 py-1 rounded bg-gray-100">Documentos</span>
            <span className="px-2 py-1 rounded bg-gray-100">Sitios web</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm md:text-base mb-2">
<label className="text-gray-600 mr-1">Detectar idioma</label>
<select className="border rounded px-2 py-2" value={fromLang} onChange={(e) => setFromLang(e.target.value)}>
  <option>español</option><option>inglés</option><option>yokot'an (chontal)</option>
</select>

  <button
    type="button"
    aria-label="Intercambiar idiomas"
    className="inline-flex items-center justify-center rounded-full border px-3 py-2 hover:bg-gray-50"
    onClick={swapLangs}
    title="Intercambiar idiomas"
  >
    <span className="material-icons">swap_horiz</span>
  </button>


<select className="border rounded px-2 py-2" value={toLang} onChange={(e) => setToLang(e.target.value)}>
   <option>yokot'an (chontal)</option>
   <option>español</option>
   <option>inglés</option>
 </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <textarea className="w-full h-56 md:h-48 border rounded-lg p-3 resize-none"
              placeholder="Escribe el texto a traducir..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            />

            <div className="w-full h-56 md:h-48 border rounded-lg p-3 bg-gray-50 overflow-y-auto">
              <div className="text-gray-400">{translatedText ? '' : 'Traducción'}</div>
              <div>{translatedText}</div>
            </div>
          </div>
{/* Sugerencias rápidas según idioma de origen */}
<div className="mt-3 flex items-center gap-2 overflow-x-auto [&>*]:shrink-0 pb-1">
  <span className="text-sm text-gray-600">Sugerencias:</span>
  {suggestions.map((s) => (
    <button
      key={s}
      type="button"
      className="text-sm px-2 py-1 rounded-full border hover:bg-gray-50"
      onClick={() => addSuggestion(s)}
      title={`Insertar "${s}"`}
    >
      {s}
    </button>
  ))}
</div>

          <div className="mt-3 flex justify-end">
               <button className="w-full md:w-auto px-4 py-3 border rounded-md hover:bg-gray-50"
   onClick={() => translatedText && navigator.clipboard.writeText(translatedText)}
 >
   Copiar traducción
 </button>
          </div>
        </div>
      </div>

      {/* Footer consistente */}
      <footer className="pt-4 border-t text-center text-sm text-gray-500">
        © 2025 Pueblos de Ensueño
      </footer>
    </div>
  </section>
)}
</main>
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
