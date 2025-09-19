// 📦 Librerías
import React, { useState, useEffect, useMemo } from 'react'; 
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, X, Heart, Filter, ArrowLeft } from 'lucide-react';

// 🛍️ Productos
import abanicoImg from '../../assets/img/tabasco/producto/abanico.jpg';
import bisuteriaMaderaImg from '../../assets/img/tabasco/producto/BisuteríaMadera.jpg';
import blusaImg from '../../assets/img/tabasco/producto/blusa.png';
import bolsoGuanoImg from '../../assets/img/tabasco/producto/Bolsa-de-guano.jpg';
import matildeBolsaJacintoImg from '../../assets/img/tabasco/producto/Bolsa de canasta de jacinto.jpg';
import matildeBolsaGuanoImg from '../../assets/img/tabasco/producto/Bolsa de guano.jpg';
import matildeBolsaPalmaImg from '../../assets/img/tabasco/producto/Bolsa de mano de palma.jpg';
import matildeCanastaBejucoImg from '../../assets/img/tabasco/producto/Canasta de bejuco.jpg';
import canastaImg from '../../assets/img/tabasco/producto/canasta.mimbre.jpg';
import ceramicaImg from '../../assets/img/tabasco/producto/ceramica.jpg';
import matildeCentroMesaImg from '../../assets/img/tabasco/producto/Centro de mesa.jpg';
import cestasImg from '../../assets/img/tabasco/producto/cestas.jpg';
import guayaberaImg from '../../assets/img/tabasco/producto/guayabera.jpg';
import jicaraImg from '../../assets/img/tabasco/producto/jícara.gif';
import molcajeteImg from '../../assets/img/tabasco/producto/molcajete.jpg';
import mueblesImg from '../../assets/img/tabasco/producto/muebles-de-mimbre.webp';
import matildeSombreroImg from '../../assets/img/tabasco/producto/Sombrero chontal.jpg';
import matildeSombrerosImg from '../../assets/img/tabasco/producto/Sombreros.jpg';
import tirasBordadasImg from '../../assets/img/tabasco/producto/TirasBordadas.jpeg';
import tortilleroImg from '../../assets/img/tabasco/producto/tortillero.jpg';
import tabasquenaImg from '../../assets/img/tabasco/producto/mujer.jpg';

// 👩‍🎨 Personas
import carmenHernandezImg from '../../assets/img/tabasco/artesano/Carmen Hernandez Lopez.jpg';
import mariaLucianoCruzImg from '../../assets/img/tabasco/artesano/maria-luciano-cruz.jpg';
import matildePortraitImg from '../../assets/img/tabasco/artesano/Matilde.jpg';

export default function ProductosTabasco() {
  const navigate = useNavigate();

  // --- El resto de tu lógica, estados y funciones permanecen sin cambios ---
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
    } catch { return []; }
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
    return () => { document.body.style.overflow = 'auto'; };
  }, [tradeProduct, catalogProduct]);
  
  const [fromLang, setFromLang] = useState('español');
  const [toLang, setToLang] = useState("yokot'an (chontal)");
  const [sourceText, setSourceText] = useState('');
  const swapLangs = () => { setFromLang(toLang); setToLang(fromLang); };
  
  const translate = (text, from, to) => {
    if (!text) return "";
    return `Traducción de '${text}' de ${from} a ${to}`;
  };

  const municipioFromState = location.state?.municipio || '';
  const municipioFromQuery = new URLSearchParams(location.search).get('municipio') || '';
  const municipio = municipioFromState || municipioFromQuery || '';
  const backTo = municipio ? `/municipio/${encodeURIComponent(municipio)}` : '/mapa-tabasco';

  const productosPorMunicipio = {
    "Balancán": [1, 6], "Cardenas": [2, 7], "Centla": [1, 9],
    "Centro": [1, 2, 10, 11], "Comalcalco": [6, 8], "Cunduacán": [2, 6],
    "Emiliano Zapata": [1, 4], "Huimanguillo": [7, 4], "Jalapa": [5, 4],
    "Jalpa de Méndez": [5, 2], "Jonuta": [9, 1], "Macuspana": [4, 7],
    "Nacajuca": [9, 2, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    "Paraíso": [7, 2], "Paraiso": [7, 2], "Tacotalpa": [3, 6],
    "Teapa": [3, 4], "Tenosique": [1, 3],
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
    const ids = productosPorMunicipio[municipio] || null;
    const productosBase = ids ? productosAll.filter(p => ids.includes(p.id)) : productosAll;
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
        const query = searchQuery.toLowerCase();
        productos = productos.filter(p => p.nombre.toLowerCase().includes(query) || p.artesano.toLowerCase().includes(query));
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
      const map = new Map();
      productosFiltrados.forEach(p => {
          if (artesanosConPerfil.includes(p.artesano) && !map.has(p.artesano)) {
              map.set(p.artesano, {
                  nombre: p.artesano,
                  productoPerfil: productosAll.find(item => item.artesano === p.artesano && [12, 13, 14].includes(item.id)) || p,
              });
          }
      });
      return Array.from(map.values());
  }, [productosFiltrados]);
  
  const handleShowCatalog = (item) => {
    const artisanName = item.artesano || item.nombre;
    const catalogItems = productosAll.filter(p => p.artesano === artisanName && ![12, 13, 14].includes(p.id));
    setActiveCatalog(catalogItems);
    const perfil = productosAll.find(p => [12, 13, 14].includes(p.id) && p.artesano === artisanName);
    setCatalogProduct(perfil || item);
  };
  
  const handleTypeChange = (type) => setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  const handleArtisanChange = (artisan) => setSelectedArtisans(prev => prev.includes(artisan) ? prev.filter(a => a !== artisan) : [...prev, artisan]);
  const clearAllFilters = () => { setSelectedTypes([]); setSelectedArtisans([]); setSelectedPriceRange(''); };
  const openTrade = (producto) => { setTradeProduct(producto); };

  const FilterSidebar = () => (
    <aside className="w-72 bg-white p-6 border-r border-slate-200 h-full overflow-y-auto rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-zinc-800">Filtros</h2>
            <button onClick={clearAllFilters} className="text-sm font-semibold text-orange-600 hover:underline">Limpiar</button>
        </div>
        <div className="space-y-6">
            <div>
                <h3 className="font-semibold mb-3 text-zinc-700">Tipo de Producto</h3>
                <div className="space-y-2 pr-2">
                    {availableTypes.map(type => (
                        <label key={type} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-100">
                            <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => handleTypeChange(type)} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                            <span className="text-zinc-600">{type}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="font-semibold mb-3 text-zinc-700">Artesano</h3>
                <div className="space-y-2 pr-2">
                    {availableArtisans.map(artisan => (
                        <label key={artisan} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-100">
                            <input type="checkbox" checked={selectedArtisans.includes(artisan)} onChange={() => handleArtisanChange(artisan)} className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                            <span className="text-zinc-600">{artisan}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="font-semibold mb-3 text-zinc-700">Precio</h3>
                <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-100">
                        <input type="radio" name="price" checked={!selectedPriceRange} onChange={() => setSelectedPriceRange('')} className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500" />
                        <span className="text-zinc-600">Todos</span>
                    </label>
                    {priceRanges.map(range => (
                        <label key={range.label} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-slate-100">
                            <input type="radio" name="price" checked={selectedPriceRange === range.label} onChange={() => setSelectedPriceRange(range.label)} className="h-4 w-4 border-gray-300 text-orange-600 focus:ring-orange-500" />
                            <span className="text-zinc-600">{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    </aside>
  );

  return (
    <div className="bg-slate-50">
      <main className="min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 pb-6 border-b border-slate-200 gap-4">
                <div>
                    <Link to={backTo} state={municipio ? { municipio } : undefined} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-orange-600 transition-colors mb-2">
                      <ArrowLeft size={16} />
                      {`Volver a ${municipio ? municipio : 'el mapa'}`}
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-black text-zinc-800">
                      Artesanías de <span className="text-orange-600">{municipio || 'Tabasco'}</span>
                    </h1>
                </div>
                <a href="https://wise.com/mx/currency-converter/mxn-to-usd-rate" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto text-center bg-green-500 text-white py-2 px-5 rounded-full shadow-md hover:bg-green-600 transition font-semibold">
                    Convertidor de divisas
                </a>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="hidden lg:block w-72 flex-shrink-0">
                  <FilterSidebar />
                </div>
                
                {isFilterSidebarOpen && (
                  <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsFilterSidebarOpen(false)}>
                    <div className="fixed inset-y-0 left-0 z-50 shadow-lg w-[85vw] max-w-sm" onClick={(e) => e.stopPropagation()}>
                      <FilterSidebar />
                    </div>
                  </div>
                )}
                
                <div className="flex-1">
                    <div className="mb-6">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsFilterSidebarOpen(true)} className="lg:hidden p-3 rounded-full border bg-white shadow-sm">
                                <Filter className="text-zinc-700" size={20} />
                            </button>
                            <div className="relative flex-grow">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Buscar por artesanía o artesano..." className="w-full pl-12 pr-10 py-3 border border-slate-300 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                                {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800"><X size={20} /></button>}
                            </div>
                        </div>
                        <div className="flex justify-center border border-slate-200 bg-white p-1 rounded-full gap-1 mt-4 max-w-sm mx-auto shadow-sm">
                            <button onClick={() => setViewMode('artesanias')} className={`w-1/2 px-4 py-2 rounded-full font-semibold transition text-sm ${viewMode === 'artesanias' ? 'bg-orange-500 text-white shadow' : 'text-zinc-600 hover:bg-orange-50'}`}>
                                Ver Artesanías
                            </button>
                            <button onClick={() => setViewMode('artesanos')} className={`w-1/2 px-4 py-2 rounded-full font-semibold transition text-sm ${viewMode === 'artesanos' ? 'bg-orange-500 text-white shadow' : 'text-zinc-600 hover:bg-orange-50'}`}>
                                Ver Artesanos
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {viewMode === 'artesanias' && productosFiltrados.filter(p => ![12, 13, 14].includes(p.id)).map(producto => (
                            <div key={producto.id} className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                                <img src={producto.imagen} alt={producto.nombre} className="w-full object-cover aspect-video" />
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-lg font-bold text-zinc-800 mb-2">{producto.nombre}</h3>
                                    <p className="text-sm text-slate-600 mb-1">👤 {producto.artesano}</p>
                                    <p className="text-sm text-slate-600 mb-1">🕐 {producto.horario}</p>
                                    <p className="text-sm text-slate-600 mb-4">💰 {producto.precio}</p>
                                    <div className="mt-auto grid grid-cols-2 gap-3">
                                        <button type="button" onClick={() => toggleFavorite(producto.id)} aria-label={isFavorite(producto.id) ? "Quitar de favoritos" : "Agregar a favoritos"}
                                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border font-semibold text-sm transition ${isFavorite(producto.id) ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600' : 'bg-white text-zinc-700 border-slate-300 hover:bg-slate-50'}`}>
                                            <Heart size={16} className={isFavorite(producto.id) ? 'fill-current' : ''} />
                                            <span>Favorito</span>
                                        </button>
                                        <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-white font-semibold text-sm hover:bg-slate-900 transition" onClick={() => openTrade(producto)} type="button">
                                            Comerciar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {viewMode === 'artesanos' && artesanosParaMostrar.map(artesano => (
                            <div key={artesano.nombre} className="bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer" onClick={() => handleShowCatalog(artesano)}>
                                <img src={artesano.productoPerfil.imagen} alt={artesano.nombre} className="w-full h-72 object-cover" />
                                <div className="p-5 flex flex-col flex-grow">
                                    <h3 className="text-lg font-bold text-zinc-800 mb-2">{artesano.nombre}</h3>
                                    <p className="text-sm text-slate-600 mb-1">Ver las artesanías de <strong>{artesano.nombre.split(' ')[0]}</strong>.</p>
                                    <div className="mt-auto pt-3">
                                        <div className="w-full bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg text-center">Ver Catálogo</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {(viewMode === 'artesanias' && productosFiltrados.filter(p => ![12, 13, 14].includes(p.id)).length === 0 || viewMode === 'artesanos' && artesanosParaMostrar.length === 0) && (
                      <div className="text-center py-16 col-span-full bg-white rounded-lg shadow-md mt-6">
                          <p className="text-zinc-600 text-lg">No se encontraron resultados.</p>
                          <button onClick={clearAllFilters} className="mt-4 font-semibold text-orange-600 hover:underline">
                              Limpiar todos los filtros
                          </button>
                      </div>
                    )}
                </div>
            </div>
        </div>
      </main>
      
      {catalogProduct && (
        // --- INICIO DE CORRECCIÓN: z-index aumentado ---
        <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4" onClick={() => { setActiveCatalog(null); setCatalogProduct(null); }}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
              <h2 className="text-xl font-bold text-zinc-800">Catálogo de {catalogProduct.artesano || catalogProduct.nombre}</h2>
              <button className="p-2 rounded-full hover:bg-slate-100" onClick={() => { setActiveCatalog(null); setCatalogProduct(null); }}><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              {activeCatalog && activeCatalog.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeCatalog.map((item) => (
                    <div key={item.id} className="border border-slate-200 rounded-xl p-3 flex flex-col">
                      <img src={item.imagen} alt={item.nombre} className="w-full h-48 object-cover rounded-lg mb-3" />
                      <h3 className="font-semibold text-zinc-800">{item.nombre}</h3>
                      <p className="text-sm text-slate-600 mb-3">💰 {item.precio}</p>
                      <button type="button" onClick={() => toggleFavorite(item.id)} className={`w-full mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm transition ${isFavorite(item.id) ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600' : 'bg-white text-zinc-700 border-slate-300 hover:bg-slate-50'}`} aria-label={isFavorite(item.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}>
                        <Heart size={16} className={isFavorite(item.id) ? 'fill-current' : ''} />
                        {isFavorite(item.id) ? 'Favorito' : 'Favorito'}
                      </button>
                    </div>
                  ))}
                </div>
              ) : ( <p className="text-slate-600">Este artesano aún no tiene productos en el catálogo.</p> )}
            </div>
          </div>
        </div>
      )}
      {tradeProduct && (
        // --- INICIO DE CORRECCIÓN: z-index aumentado ---
        <div className="fixed inset-0 z-[999] bg-black/60 flex items-center justify-center p-4" onClick={() => setTradeProduct(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200 flex-shrink-0">
              <h2 className="text-xl font-bold text-zinc-800">Comerciar con {tradeProduct.artesano}</h2>
              <button className="p-2 rounded-full hover:bg-slate-100" onClick={() => setTradeProduct(null)} aria-label="Cerrar"><X size={20} /></button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <select className="border border-slate-300 rounded-lg p-2 w-full" value={fromLang} onChange={(e) => setFromLang(e.target.value)}>
                    <option>español</option>
                    <option>inglés</option>
                    <option>yokot'an (chontal)</option>
                  </select>
                  <button type="button" onClick={swapLangs} className="p-2 rounded-full border bg-white hover:bg-slate-100" aria-label="Intercambiar idiomas" title="Intercambiar idiomas">⇄</button>
                  <select className="border border-slate-300 rounded-lg p-2 w-full" value={toLang} onChange={(e) => setToLang(e.target.value)}>
                    <option>español</option>
                    <option>inglés</option>
                    <option>yokot'an (chontal)</option>
                  </select>
                </div>
                <div>
                  <textarea className="w-full h-32 border border-slate-300 rounded-lg p-3" placeholder="Escribe aquí tu mensaje..." value={sourceText} onChange={(e) => setSourceText(e.target.value)} />
                </div>
                <div>
                  <div className="w-full h-32 border border-slate-300 rounded-lg p-3 bg-slate-50 overflow-y-auto">{translate(sourceText, fromLang, toLang)}</div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-zinc-700">Frases útiles</h3>
                <div className="flex flex-wrap gap-2">
                  {['¿Cuánto cuesta?', 'Quiero comprar esto', '¿Tiene otros colores?', 'Gracias'].map((p) => (
                    <button key={p} type="button" onClick={() => setSourceText(p)} className="text-sm px-3 py-1 rounded-full border border-slate-300 bg-white hover:bg-slate-50">{p}</button>
                  ))}
                </div>
              </div>
            </div>
             <div className="flex justify-end gap-3 p-4 border-t border-slate-200 flex-shrink-0">
                <button className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 font-semibold" onClick={() => setSourceText('')} type="button">Limpiar</button>
                <button className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 font-semibold" onClick={() => navigator.clipboard?.writeText(translate(sourceText, fromLang, toLang))} type="button">Copiar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}