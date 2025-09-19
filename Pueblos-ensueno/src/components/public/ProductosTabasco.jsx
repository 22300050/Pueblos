import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import jicaraImg from '../../assets/jícara.gif';
import canastaImg from '../../assets/canasta.mimbre.jpg';
import guayaberaImg from '../../assets/guayabera.jpg';
import molcajeteImg from '../../assets/molcajete.jpg';
import blusaImg from '../../assets/blusa.png';
import ceramicaImg from '../../assets/ceramica.jpg';
import mueblesImg from '../../assets/muebles-de-mimbre.webp';
import tabasquenaImg from '../../assets/mujer.jpg';
import cestasImg from '../../assets/cestas.jpg';
import { Search, X, Heart } from 'lucide-react';
import tirasBordadasImg from '../../assets/TirasBordadas.jpeg';
import bisuteriaMaderaImg from "../../assets/BisuteríaMadera.jpg";
import mariaLucianoCruzImg from '../../assets/maria-luciano-cruz.jpg';
import bolsoGuanoImg from '../../assets/Bolsa-de-guano.jpg';
import tortilleroImg from '../../assets/tortillero.jpg';
import abanicoImg from '../../assets/abanico.jpg';
import carmenHernandezImg from '../../assets/Carmen Hernandez Lopez.jpg';
import matildeSombreroImg from '../../assets/Sombrero chontal.jpg';
import matildeSombrerosImg from '../../assets/Sombreros.jpg';
import matildeBolsaJacintoImg from '../../assets/Bolsa de canasta de jacinto.jpg';
import matildeBolsaGuanoImg from '../../assets/Bolsa de guano.jpg';
import matildeBolsaPalmaImg from '../../assets/Bolsa de mano de palma.jpg';
import matildeCanastaBejucoImg from '../../assets/Canasta de bejuco.jpg';
import matildeCentroMesaImg from '../../assets/Centro de mesa.jpg';
import matildePortraitImg from '../../assets/Matilde.jpg';


export default function ProductosTabasco() {
  const navigate = useNavigate();

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
    { id: 11, nombre: "Bisutería de madera artesanal", artesano: "César Augusto Reynosa Reyes", horario: "10:00 a 18:00", precio: "Variado entre $70 a $300 MXN", imagen: bisuteriaMaderaImg },
    { id: 12, nombre: "María Luciano Cruz", artesano: "María Luciano Cruz", horario: "Sin horario", precio: "$30 – $100 MXN", imagen: mariaLucianoCruzImg},
    { id: 13, nombre: "Carmen Hernández López — Carpintero", artesano: "Carmen Hernández López", horario: "07:00 a 17;00", precio: "Cotización según pieza", imagen: carmenHernandezImg},
    { id: 14, nombre: "Matilde de la Cruz Esteban — Sombreros y cestería", artesano: "Matilde de la Cruz Esteban", horario: "09:00–18:00", precio: "$120 – $900 MXN", imagen: matildePortraitImg},
    { id: 15, nombre: "Bolsa de guano", artesano: "María Luciano Cruz", horario: "Sin horario", precio: "$60 MXN", imagen: bolsoGuanoImg },
    { id: 16, nombre: "Tortillero de palma", artesano: "María Luciano Cruz", horario: "Sin horario", precio: "$30 MXN", imagen: tortilleroImg },
    { id: 17, nombre: "Abanico tejido", artesano: "María Luciano Cruz", horario: "Sin horario", precio: "$30 MXN", imagen: abanicoImg },
    { id: 18, nombre: "Sombrero chontal", artesano: "Matilde de la Cruz Esteban", horario: "09:00–18:00", precio: "$130 MXN", imagen: matildeSombreroImg },
    { id: 19, nombre: "Sombreros (varios)", artesano: "Matilde de la Cruz Esteban", horario: "09:00–18:00", precio: "$130 – $150 MXN", imagen: matildeSombrerosImg },
    { id: 20, nombre: "Bolsa jacinto (canasta)", artesano: "Matilde de la Cruz Esteban", horario: "09:00–18:00", precio: "$250 MXN", imagen: matildeBolsaJacintoImg },
    { id: 21, nombre: "Bolsa de guano de palma", artesano: "Matilde de la Cruz Esteban", horario: "09:00–18:00", precio: "$70 MXN", imagen: matildeBolsaGuanoImg },
    { id: 22, nombre: "Bolsa de mano (palma)", artesano: "Matilde de la Cruz Esteban", horario: "09:00–18:00", precio: "$250MXN", imagen: matildeBolsaPalmaImg },
    { id: 23, nombre: "Canasta de bejuco", artesano: "Matilde de la Cruz Esteban", horario: "09:00–18:00", precio: "$170 - 300 MXN", imagen: matildeCanastaBejucoImg },
    { id: 24, nombre: "Centro de mesa de palma", artesano: "Matilde de la Cruz Esteban", horario: "09:00–18:00", precio: "$80 MXN", imagen: matildeCentroMesaImg },
  ];

  const location = useLocation();

  const [viewMode, setViewMode] = useState('artesanias');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedArtisans, setSelectedArtisans] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [activeCatalog, setActiveCatalog] = useState(null);
  const [tradeProduct, setTradeProduct] = useState(null);
  const [catalogProduct, setCatalogProduct] = useState(null);

  const FAV_KEY = 'pde_favoritos_artesanias';
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(FAV_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const isFavorite = (id) => favorites.includes(id);
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (tradeProduct || catalogProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [tradeProduct, catalogProduct]);

  const [fromLang, setFromLang] = useState('español');
  const [toLang, setToLang] = useState("yokot'an (chontal)");
  const [sourceText, setSourceText] = useState('');
  function swapLangs() {
    const temp = fromLang;
    setFromLang(toLang);
    setToLang(temp);
  }
  const suggestionSets = {
    "español": ["hola", "gracias", "¿cuánto?", "precio", "quiero comprar", "artesanía", "horario", "¿dónde está?"],
    "inglés": ["hello", "thank you", "how much?", "price", "i want to buy", "handicraft", "opening hours", "where is it?"],
    "yokot'an (chontal)": ["Jamej", "Yajintik", "Jats’ k’uch’?", "K’uch’", "K’ele’", "Jach’ t’ujum", "Tsan"],
  };
  function normalizeLangName(name) {
    const n = (name || "").toLowerCase();
    if (n.includes("yokot")) return "yokot'an (chontal)";
    if (n.includes("ingl")) return "inglés";
    return "español";
  }
  const suggestions = suggestionSets[normalizeLangName(fromLang)] || [];
  function addSuggestion(s) {
    setSourceText(s);
  }
  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  function replaceByDict(text, dict, {useWordBoundary = true} = {}) {
    let out = text;
    const entries = Object.entries(dict).sort((a,b) => b[0].length - a[0].length);
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
  const yokotanGlossary = {"hola": "Jamej","buenos días": "Jamej wits’","buenas tardes": "Jamej ts’ej","buenas noches": "Jamej ajk’","gracias": "Yajintik","por favor": "T’uch’uje’","sí": "Ji'","no": "Ma’","¿cuánto?": "Jats’ k’uch’?","precio": "K’uch’","vender": "Tso’ob","comprar": "Tso’on","artesanía": "Jach’ t’ujum","dónde": "Tsan","cuándo": "Júun","quiero": "K’ele’","necesito": "Ka'aj",};
  const CHONTAL_HORARIO = "Horario (yokot'an)";
  Object.assign(yokotanGlossary, {"cuánto": "Jats’ k’uch’?","cuanto": "Jats’ k’uch’?","¿cuanto?": "Jats’ k’uch’?","dónde está": "Tsan","donde esta": "Tsan","horario": CHONTAL_HORARIO,});
  const yokotanToEs = Object.fromEntries(Object.entries(yokotanGlossary).map(([es, yo]) => [yo.toLowerCase(), es]));
  const esToEn = {"hola": "hello","buenos días": "good morning","buenas tardes": "good afternoon","buenas noches": "good evening","gracias": "thank you","por favor": "please","precio": "price","¿cuánto?": "how much?","vender": "sell","comprar": "buy","artesanía": "handicraft","cesta": "basket","madera": "wood","abierto": "open","cerrado": "closed","horario": "opening hours","dónde está": "where is it?","donde esta": "where is it?","quiero": "i want","necesito": "i need",};
  function translateEnToYokotan(text) {
    if (!text) return "";
    let toEs = replaceByDict(text, enToEs, { useWordBoundary: true });
    let toYo = replaceByDict(toEs, yokotanGlossary, { useWordBoundary: true });
    return toYo ? `${toYo}  (≈ demo yokot'an)` : "";
  }
  function translateYokotanToEn(text) {
    if (!text) return "";
    let toEs = replaceByDict(text, yokotanToEs, { useWordBoundary: false });
    let toEn = replaceByDict(toEs, esToEn, { useWordBoundary: true });
    return toEn ? `${toEn}  (≈ demo en)` : "";
  }
  const enToEs = Object.fromEntries(Object.entries(esToEn).map(([es, en]) => [en, es]));
  function translateToYokotan(text) {
    if (!text) return "";
    const out = replaceByDict(text, yokotanGlossary, {useWordBoundary: true});
    return out ? `${out}  (≈ demo yokot'an)` : "";
  }
  const translatedText = translate(sourceText, fromLang, toLang);
    function translateYokotanToEs(text) {
    if (!text) return "";
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
  function translate(text, from, to) {
    if (!text) return "";
    const f = from.toLowerCase();
    const t = to.toLowerCase();
    if (f.includes("yokot") && t === "español") return translateYokotanToEs(text);
    if (f === "español" && t.includes("yokot")) return translateToYokotan(text);
    if (f === "español" && t === "inglés") return translateEsToEn(text);
    if (f === "inglés" && t === "español") return translateEnToEs(text);
    if (f === "inglés" && t.includes("yokot")) return translateEnToYokotan(text);
    if (f.includes("yokot") && t === "inglés") return translateYokotanToEn(text);
    return text;
  }

  const municipioFromState = location.state?.municipio || '';
  const municipioFromQuery = new URLSearchParams(location.search).get('municipio') || '';
  const municipio = municipioFromState || municipioFromQuery || '';
  const backTo = municipio
    ? `/municipio/${encodeURIComponent(municipio)}`
    : '/mapa-tabasco';

  const productosPorMunicipio = {
    "Balancán":          [1, 6], "Cardenas":          [2, 7], "Centla":            [1, 9],
    "Centro":            [1, 2, 10, 11], "Comalcalco":        [6, 8], "Cunduacán":         [2, 6],
    "Emiliano Zapata":   [1, 4], "Huimanguillo":      [7, 4], "Jalapa":            [5, 4],
    "Jalpa de Méndez":   [5, 2], "Jonuta":            [9, 1], "Macuspana":         [4, 7],
    "Nacajuca":          [9, 2, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    "Paraíso":           [7, 2], "Paraiso":           [7, 2], "Tacotalpa":         [3, 6],
    "Teapa":             [3, 4], "Tenosique":         [1, 3],
  };
  
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    const match = priceString.replace(/,/g, '').match(/(\d+)/);
    return match ? parseFloat(match[0]) : 0;
  };
  
  const priceRanges = [
    { label: 'Menos de $100', min: 0, max: 99.99 }, { label: '$100 - $300', min: 100, max: 300 },
    { label: '$301 - $1000', min: 301, max: 1000 }, { label: 'Más de $1000', min: 1001, max: Infinity },
  ];
  
  const productTypeKeywords = ['Jícara', 'Canasta', 'Guayabera', 'Molcajete', 'Blusa', 'Cerámica', 'Muebles', 'Figura', 'Cestas', 'Sombrero', 'Bolsa', 'Bisutería', 'Tortillero', 'Abanico'];
  
  const { availableTypes, availableArtisans } = useMemo(() => {
    const idsSeleccionados = productosPorMunicipio[municipio] || null;
    const productosBase = idsSeleccionados ? productosAll.filter(p => idsSeleccionados.includes(p.id)) : productosAll;
    const types = new Set();
    const artisans = new Set();
    productosBase.forEach(p => {
      if (![12, 13, 14].includes(p.id)) {
        artisans.add(p.artesano);
        productTypeKeywords.forEach(keyword => {
          if (p.nombre.toLowerCase().includes(keyword.toLowerCase())) { types.add(keyword); }
        });
      }
    });
    return { availableTypes: Array.from(types).sort(), availableArtisans: Array.from(artisans).sort() };
  }, [municipio]);
  
  const artesanosConPerfil = ["María Luciano Cruz", "Carmen Hernández López", "Matilde de la Cruz Esteban"];
  
  const productosFiltrados = useMemo(() => {
      let productos = (productosPorMunicipio[municipio] ? productosAll.filter(p => productosPorMunicipio[municipio].includes(p.id)) : productosAll);
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        productos = productos.filter(p => p.nombre.toLowerCase().includes(lowerCaseQuery) || p.artesano.toLowerCase().includes(lowerCaseQuery));
      }
      if (selectedTypes.length > 0) {
        productos = productos.filter(p => selectedTypes.some(type => p.nombre.toLowerCase().includes(type.toLowerCase())));
      }
      if (selectedArtisans.length > 0) {
        productos = productos.filter(p => selectedArtisans.includes(p.artesano));
      }
      if (selectedPriceRange) {
        const range = priceRanges.find(r => r.label === selectedPriceRange);
        if (range) {
          productos = productos.filter(p => {
            const price = parsePrice(p.precio);
            return price >= range.min && price <= range.max;
          });
        }
      }
      return productos;
    }, [municipio, searchQuery, selectedTypes, selectedArtisans, selectedPriceRange]);
  
  const artesanosParaMostrar = useMemo(() => {
      const artesanosMap = new Map();
      productosFiltrados.forEach(producto => {
          if (artesanosConPerfil.includes(producto.artesano)) {
              if (!artesanosMap.has(producto.artesano)) {
                  artesanosMap.set(producto.artesano, {
                      nombre: producto.artesano,
                      productoPerfil: productosAll.find(p => p.artesano === producto.artesano && [12, 13, 14].includes(p.id)) || producto,
                  });
              }
          }
      });
      return Array.from(artesanosMap.values());
  }, [productosFiltrados]);
  
  const handleShowCatalog = (item) => {
    const artisanName = item.artesano ? item.artesano : item.nombre;
    const catalogItems = productosAll.filter(p => p.artesano === artisanName && ![12, 13, 14].includes(p.id));
    setActiveCatalog(catalogItems.length ? catalogItems : []);
    const perfil = productosAll.find(p => [12, 13, 14].includes(p.id) && p.artesano === artisanName);
    setCatalogProduct(perfil || item);
  };
  
  const handleTypeChange = (type) => setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  const handleArtisanChange = (artisan) => setSelectedArtisans(prev => prev.includes(artisan) ? prev.filter(a => a !== artisan) : [...prev, artisan]);
  const clearAllFilters = () => { setSelectedTypes([]); setSelectedArtisans([]); setSelectedPriceRange(''); };
  const openTrade = (producto) => { setTradeProduct(producto); };

  const FilterSidebar = () => (
    <aside className="w-72 bg-white p-4 border-r border-gray-200 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-pink-700">Filtros</h2>
        <button onClick={clearAllFilters} className="text-sm text-pink-600 hover:underline">Limpiar</button>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Tipo de Producto</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {availableTypes.map(type => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => handleTypeChange(type)} className="form-checkbox text-pink-600 rounded" />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Artesano</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {availableArtisans.map(artisan => (
            <label key={artisan} className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" checked={selectedArtisans.includes(artisan)} onChange={() => handleArtisanChange(artisan)} className="form-checkbox text-pink-600 rounded" />
              <span>{artisan}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Precio</h3>
        <div className="space-y-2">
          <label className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="price" checked={!selectedPriceRange} onChange={() => setSelectedPriceRange('')} className="form-radio text-pink-600" />
              <span>Todos</span>
          </label>
          {priceRanges.map(range => (
            <label key={range.label} className="flex items-center space-x-2 cursor-pointer">
              <input type="radio" name="price" checked={selectedPriceRange === range.label} onChange={() => setSelectedPriceRange(range.label)} className="form-radio text-pink-600" />
              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="text-[var(--color-text)]">
      <main className="min-h-screen bg-gradient-to-br from-rose-100 via-amber-100 to-lime-100">
        <div className="container mx-auto p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-pink-600">
                  {`Artesanías de ${municipio || 'Tabasco'}`}
                </h1>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Link to={backTo} state={municipio ? { municipio } : undefined} className="w-full sm:w-auto text-center bg-pink-500 text-white py-2 px-4 sm:px-6 rounded-full shadow-md hover:bg-pink-600 transition">
                      {`← Volver a ${municipio ? municipio : 'el mapa'}`}
                    </Link>
                    <a href="https://wise.com/mx/currency-converter/mxn-to-usd-rate" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center bg-green-500 text-white py-2 px-4 sm:px-6 rounded-full shadow-md hover:bg-green-600 transition">
                        Convertidor de divisas
                    </a>
                </div>
            </div>

            <div className="flex gap-6">
                <div className="hidden md:block">
                  <FilterSidebar />
                </div>
                
                {isFilterSidebarOpen && (
                  <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsFilterSidebarOpen(false)}>
                    <div className="fixed inset-y-0 left-0 z-50 shadow-lg w-[85vw] max-w-sm bg-white" onClick={(e) => e.stopPropagation()}>
                      <FilterSidebar />
                    </div>
                  </div>
                )}
                
                <div className="flex-1">
                    <div className="mb-6 bg-white/50 p-4 rounded-xl shadow-md backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsFilterSidebarOpen(true)} className="md:hidden p-2 rounded-full border bg-white">
                                <Search className="text-gray-700" size={20} />
                            </button>
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar por artesanía o artesano..." className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-pink-500 focus:border-pink-500" />
                                {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"><X size={20} /></button>}
                            </div>
                        </div>
                        <div className="flex justify-center gap-2 mt-4">
                            <button onClick={() => setViewMode('artesanias')} className={`px-6 py-2 rounded-full font-semibold transition ${viewMode === 'artesanias' ? 'bg-pink-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-pink-100'}`}>
                                Ver Artesanías
                            </button>
                            <button onClick={() => setViewMode('artesanos')} className={`px-6 py-2 rounded-full font-semibold transition ${viewMode === 'artesanos' ? 'bg-pink-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-pink-100'}`}>
                                Ver Artesanos
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                        {viewMode === 'artesanias' && productosFiltrados.filter(p => ![12, 13, 14].includes(p.id)).map(producto => (
                            <div key={producto.id} className="bg-white rounded-2xl shadow-lg p-4 border border-pink-200 flex flex-col">
                                <img src={producto.imagen} alt={producto.nombre} className="w-full rounded-lg mb-4 object-cover aspect-[4/3] sm:aspect-[3/2] md:h-72" />
                                <h3 className="text-lg sm:text-xl font-bold text-pink-700 mb-2 break-words">{producto.nombre}</h3>
                                <p className="text-sm text-gray-700 mb-1 break-words">👤 <strong>{producto.artesano}</strong></p>
                                <p className="text-sm text-gray-600 mb-1">🕐 {producto.horario}</p>
                                <p className="text-sm text-gray-600 mb-3">💰 {producto.precio}</p>
                                <div className="mt-auto flex flex-col gap-2">
                                    <button type="button" onClick={() => toggleFavorite(producto.id)} aria-label={isFavorite(producto.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition ${isFavorite(producto.id) ? 'bg-pink-600 text-white border-pink-600 hover:bg-pink-700' : 'bg-white text-pink-700 border-pink-300 hover:bg-pink-50'}`}>
                                        <Heart size={18} className={isFavorite(producto.id) ? 'fill-current' : ''} />
                                        {isFavorite(producto.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                                    </button>
                                    <button className="w-full bg-pink-100 text-pink-700 font-medium px-4 py-2 rounded-lg hover:bg-pink-200 transition" onClick={() => openTrade(producto)} type="button">
                                        Comerciar
                                    </button>
                                </div>
                            </div>
                        ))}
                        {viewMode === 'artesanos' && artesanosParaMostrar.map(artesano => (
                            <div key={artesano.nombre} className="bg-white rounded-2xl shadow-lg p-4 border border-pink-200 flex flex-col cursor-pointer" onClick={() => handleShowCatalog(artesano)}>
                                <img src={artesano.productoPerfil.imagen} alt={artesano.nombre} className="w-full h-72 object-cover rounded-lg mb-4" />
                                <h3 className="text-lg sm:text-xl font-bold text-pink-700 mb-2">{artesano.nombre}</h3>
                                <p className="text-sm text-gray-700 mb-1">Ver las artesanías de <strong>{artesano.nombre.split(' ')[0]}</strong>.</p>
                                <div className="mt-auto flex flex-col gap-2 pt-3">
                                    <button className="w-full bg-pink-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-pink-700 transition">Ver Catálogo</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {(viewMode === 'artesanias' && productosFiltrados.filter(p => ![12, 13, 14].includes(p.id)).length === 0 || viewMode === 'artesanos' && artesanosParaMostrar.length === 0) && (
                      <div className="text-center py-10 col-span-full">
                          <p className="text-gray-600 text-lg">No se encontraron resultados que coincidan con los filtros actuales.</p>
                          <button onClick={clearAllFilters} className="mt-4 text-pink-600 hover:underline">Limpiar todos los filtros</button>
                      </div>
                    )}
                </div>
            </div>
        </div>
      </main>
      
      {catalogProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4"
          onClick={() => { setActiveCatalog([]); setCatalogProduct(null); }}
        >
          <div
            className="bg-white rounded-t-2xl md:rounded-2xl shadow-xl w-full md:max-w-4xl max-h-[92vh] md:max-h-[90vh] overflow-y-auto pb-[env(safe-area-inset-bottom)]"
            onClick={(e) => e.stopPropagation()}
          >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-pink-700">
              Catálogo de {catalogProduct.artesano || catalogProduct.nombre}
            </h2>
            <button
              className="p-2 rounded-lg hover:bg-gray-100"
              onClick={() => { setActiveCatalog([]); setCatalogProduct(null); }}
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {activeCatalog && activeCatalog.length > 0 ? (
              activeCatalog.map((item) => (
                <div key={item.id} className="border rounded-xl p-3">
                  <img
                    src={item.imagen}
                    alt={item.nombre}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold text-pink-700">{item.nombre}</h3>
                  <p className="text-sm text-gray-600">💰 {item.precio}</p>

                  <div className="mt-3">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(item.id)}
                      className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition ${
                        isFavorite(item.id)
                          ? 'bg-pink-600 text-white border-pink-600 hover:bg-pink-700'
                          : 'bg-white text-pink-700 border-pink-300 hover:bg-pink-50'
                      }`}
                      aria-label={isFavorite(item.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                      <Heart size={18} className={isFavorite(item.id) ? 'fill-current' : ''} />
                      {isFavorite(item.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">Este artesano aún no tiene productos en el catálogo.</p>
            )}
          </div>
        </div>
      </div>
      )}

      {tradeProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4"
          onClick={() => setTradeProduct(null)}
        >
          <div
            className="bg-white rounded-t-2xl md:rounded-2xl shadow-xl w-full md:max-w-4xl max-h-[92vh] md:max-h-[90vh] overflow-y-auto pb-[env(safe-area-inset-bottom)]"
            onClick={(e) => e.stopPropagation()}
          >
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-pink-700">
              Comerciar con {tradeProduct.artesano} — {tradeProduct.nombre}
            </h2>
            <button
              className="p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setTradeProduct(null)}
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">De</label>
              <select className="border rounded-lg p-2 w-full"
                value={fromLang}
                onChange={(e) => setFromLang(e.target.value)}
              >
                <option>español</option>
                <option>inglés</option>
                <option>yokot'an (chontal)</option>
              </select>
            </div>

            <div className="flex items-end justify-center">
              <button
                type="button"
                onClick={swapLangs}
                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50"
                aria-label="Intercambiar idiomas"
                title="Intercambiar idiomas"
              >
                ⇄
              </button>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">A</label>
              <select
                className="border rounded-lg p-2"
                value={toLang}
                onChange={(e) => setToLang(e.target.value)}
              >
                <option>español</option>
                <option>inglés</option>
                <option>yokot'an (chontal)</option>
              </select>
            </div>
          </div>

          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1">Escribe tu mensaje</label>
              <textarea
                className="w-full h-40 border rounded-lg p-3"
                placeholder="Escribe aquí… p. ej. ¿Cuánto cuesta? ¿Tiene en otra medida?"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />
              {suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => addSuggestion(s)}
                      className="text-sm px-3 py-1 rounded-full border bg-white hover:bg-pink-50"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1">Traducción</label>
              <div className="w-full h-40 border rounded-lg p-3 bg-gray-50 overflow-y-auto">
                {translate(sourceText, fromLang, toLang)}
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  '¿Cuánto cuesta?',
                  '¿Tiene descuento por mayoreo?',
                  '¿Puede personalizar este producto?',
                  '¿En qué horario puedo pasar?',
                  'Quiero comprar esta artesanía.',
                ].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSourceText(p)}
                    className="text-sm px-3 py-1 rounded-full border bg-white hover:bg-pink-50"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t">
            <button
              className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              onClick={() => setSourceText('')}
              type="button"
            >
              Limpiar
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700"
              onClick={() => navigator.clipboard?.writeText(translate(sourceText, fromLang, toLang))}
              type="button"
              title="Copiar traducción"
            >
              Copiar traducción
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}