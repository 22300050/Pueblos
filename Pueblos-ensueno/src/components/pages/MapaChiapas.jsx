import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import mapboxgl from 'mapbox-gl';

// --- RUTAS DE ASSETS ---
import chiapasSvg from '../../assets/svg/Chiapas.svg?raw';
// Se asume que tendrás un archivo de audio para Chiapas, puedes cambiar la ruta
import musicaChiapas from '../../assets/img/tabasco/PopurriTabasco.mp3';
import { getSelecciones } from '../../utils/itinerarioStore';
import 'mapbox-gl/dist/mapbox-gl.css';


mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapaChiapas({ onRegresar, estado = 'Chiapas' }) {
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState({ visible: false, name: '', x: 0, y: 0 });

  // --- LÓGICA PARA MÚSICA DE FONDO ---
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.then(_ => {
        setIsPlaying(true);
      }).catch(error => {
        console.log("El autoplay de la música fue bloqueado.");
        setIsPlaying(false);
      });
    }
     return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  // --- FIN LÓGICA PARA MÚSICA DE FONDO ---


  const itinerarioPersistido = JSON.parse(localStorage.getItem("itinerario") || "{}");

  const [formData, setFormData] = useState({
    dias: '',
    tipo: '',
    lugarInicio: itinerarioPersistido?.lugarInicio || '',
    ultimoLugar: '',
    intereses: '',
    mes: itinerarioPersistido?.mes || '',
    email: '',
    modoDestino: (itinerarioPersistido?.modoDestino === 'automatico' ? 'auto' : (itinerarioPersistido?.modoDestino || ''))
  });


  const [errorEvento, setErrorEvento] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

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

  const [vistaMovil, setVistaMovil] = useState('mapa');
  const [mostrarMapaMapbox, setMostrarMapaMapbox] = useState(false);
  const [clickCoords, setClickCoords] = useState(null);
  
  const [showODPicker, setShowODPicker] = useState(false);
  const [origenSel, setOrigenSel] = useState(formData.lugarInicio || "");
  const [destinoSel, setDestinoSel] = useState(formData.ultimoLugar || "");

  const mapContainer = useRef(null);
  const navigate = useNavigate();

  const municipiosChiapas = [
    { nombre: 'Tuxtla Gutiérrez',          coords: [-93.1150, 16.7539] },
    { nombre: 'San Cristóbal de las Casas',coords: [-92.6386, 16.7370] },
    { nombre: 'Palenque',                   coords: [-91.9840, 17.5092] },
    { nombre: 'Comitán de Domínguez',       coords: [-92.1386, 16.2521] },
    { nombre: 'Chiapa de Corzo',            coords: [-93.0073, 16.7071] },
    { nombre: 'Tapachula',                  coords: [-92.2570, 14.9018] },
    { nombre: 'Ocosingo',                   coords: [-92.0951, 16.9063] },
  ];

  const listaMunicipios = [...municipiosChiapas]
    .map(m => m.nombre)
    .sort((a,b) => a.localeCompare(b, 'es'));

  const tipoPresupuestoADinero = (tipo) => {
    if (tipo === "Económico") return 800;
    if (tipo === "Moderado") return 1500;
    if (tipo === "Confort") return 2800;
    if (tipo === "Lujo") return 5000;
    return 1500;
  };

  const convertirMonedas = (mxn) => {
    const USD = (mxn / 17.5);
    const EUR = (mxn / 19);
    return { MXN: Math.round(mxn), USD: Math.round(USD), EUR: Math.round(EUR) };
  };
  
  const sugerirRuta = ({ mes, intereses = [], tipo }) => {
    const inicio = "Tuxtla Gutiérrez";
    const fin = "San Cristóbal de las Casas";
    const actividades = ["Cañón del Sumidero", "Andador Eclesiástico", "Museo del Ámbar"];
    return { inicio, fin, actividades, eventosMes: [] };
  };

  useEffect(() => {
    if (vistaMovil !== 'mapa' || mostrarMapaMapbox || !containerRef.current) return;
    containerRef.current.innerHTML = chiapasSvg;
    const svg = containerRef.current.querySelector('svg');
    if (svg) {
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.style.display = 'block';
    }

    const paths = containerRef.current.querySelectorAll('path, polygon');
    paths.forEach((path) => {
      const name = (path.getAttribute('id') || 'Municipio').replace(/_/g, ' ');
      path.addEventListener('mouseenter', (e) => {
        const r = containerRef.current.getBoundingClientRect();
        setTooltip({ visible: true, name, x: e.clientX - r.left, y: e.clientY - r.top });
      });
      path.addEventListener('mouseleave', () => setTooltip({ visible: false, name: '', x: 0, y: 0 }));
      path.addEventListener('mousemove', (e) => {
        const r = containerRef.current.getBoundingClientRect();
        setTooltip(prev => ({...prev, x: e.clientX - r.left, y: e.clientY - r.top }));
      });
      //SE EDITO LA RUTA PARA QUE EL USUARIO NO VAYA A UNA PÁGINA EN BLANCO
      //path.addEventListener('click', () => navigate(`/municipio/${name}`));
      path.addEventListener('click', () => navigate(`/Mantenimiento`));
    });
  }, [vistaMovil, mostrarMapaMapbox]);

  useEffect(() => {
    if (vistaMovil !== 'mapa' || !mostrarMapaMapbox || !mapContainer.current) return;
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-92.5, 16.7],
      zoom: 6.5,
    });
    
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        setClickCoords({ lng, lat });
        new mapboxgl.Popup({ closeOnClick: true, offset: 10, className: 'custom-popup' })
            .setLngLat([lng, lat])
            .setHTML(`<strong>📍 Coordenadas</strong><br>Lat: ${lat.toFixed(5)}<br>Lng: ${lng.toFixed(5)}`)
            .addTo(map);
    });

    municipiosChiapas.forEach((municipio) => {
        const el = document.createElement('div');
        el.className = 'custom-marker-municipio';
        new mapboxgl.Marker(el)
            .setLngLat(municipio.coords)
            .setPopup(new mapboxgl.Popup({ offset: 25, className: 'custom-popup' }).setHTML(`<h3>${municipio.nombre}</h3><p>Municipio de Chiapas</p>`))
            .addTo(map);
    });

    return () => map.remove();
  }, [mostrarMapaMapbox, vistaMovil]);

  const ItinerarioForm = () => {
    const interesesDisponibles = ["Naturaleza", "Compras", "Arte", "Museos", "Gastronomía", "Aventura"];

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const errores = [];
          if (!formData.dias) errores.push("Indica los días de viaje");
          if (!formData.tipo) errores.push("Elige un presupuesto estimado");
          if (!formData.mes) errores.push("Elige un mes");
          if (!fechaInicio || !fechaFin) errores.push("Selecciona fechas de viaje");
          if (formData.modoDestino === "manual" && (!formData.lugarInicio || !formData.ultimoLugar)) {
              errores.push("Elige origen y destino");
          }
          if (errores.length > 0) { setErrorEvento(errores); return; }
          setErrorEvento([]);

          const interesesArr = formData.intereses ? formData.intereses.split(", ").filter(Boolean) : [];
          const presupuestoMXN = tipoPresupuestoADinero(formData.tipo);
          
          let { lugarInicio, ultimoLugar } = formData;
          if (formData.modoDestino !== 'manual') {
              const sugerencia = sugerirRuta({});
              lugarInicio = lugarInicio || sugerencia.inicio;
              ultimoLugar = ultimoLugar || sugerencia.fin;
          }

          const payload = {
            estado,
            dias: `${fechaInicio} a ${fechaFin}`,
            presupuesto: presupuestoMXN,
            monedas: convertirMonedas(presupuestoMXN),
            email: formData.email || "",
            mes: formData.mes,
            interesesSeleccionados: interesesArr,
            origen: lugarInicio,
            destino: ultimoLugar,
            eventosSeleccionados: [{
              nombre: formData.tipo,
              actividades: sugerirRuta({}).actividades.join(', ')
            }],
          };
          localStorage.setItem("itinerario", JSON.stringify(payload));
          navigate("/itinerario", { state: payload });
        }}
        className="flex flex-col gap-6 text-sm"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Planea tu Aventura</h2>
          <p className="text-slate-500 text-sm">Completa los datos para crear tu ruta ideal por Chiapas</p>
        </div>
        {errorEvento.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
            <ul className="list-disc list-inside">
              {errorEvento.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          </div>
        )}
        <div className="space-y-4 rounded-lg border border-slate-200 p-4">
          <label className="block text-sm font-semibold text-slate-700">1. ¿Cuándo y por cuánto tiempo?</label>
          <div className="relative">
            <select
              value={formData.mes || ''}
              onChange={e => setFormData({ ...formData, mes: e.target.value })}
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
                if (!isNaN(parseInt(val)) && parseInt(val) > 0 && parseInt(val) <= 30) {
                  setFormData({ ...formData, dias: val });
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
        <div className="flex flex-col gap-3 pt-6 border-t border-slate-200">
          <button type="submit" className="w-full bg-orange-500 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-orange-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
            CREAR MI ITINERARIO
          </button>
          <button type="button" onClick={onRegresar} className="w-full bg-transparent text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
            Regresar
          </button>
        </div>
      </form>
    );
  };


  return (
    <>
      <audio ref={audioRef} src={musicaChiapas} loop />
      
      <style>{`
        .custom-marker-municipio {
          width: 18px; height: 18px; background-color: #1E90FF; border: 2px solid white;
          border-radius: 50%; cursor: pointer; box-shadow: 0 0 0 2px rgba(30, 144, 255, 0.5);
          transition: transform 0.1s ease-in-out;
        }
        .custom-marker-municipio:hover { transform: scale(1.2); }
        .custom-marker-zona {
          width: 28px; height: 28px; color: #FF5733; cursor: pointer;
          filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));
          transition: transform 0.1s ease-in-out;
        }
        .custom-marker-zona:hover { transform: scale(1.2); }
        .custom-popup .mapboxgl-popup-content {
          font-family: ui-sans-serif, system-ui, sans-serif; background-color: white;
          border-radius: 8px; padding: 1rem; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border: none;
        }
        .custom-popup .mapboxgl-popup-tip { display: none; }
        .custom-popup h3 {
          font-weight: 700; font-size: 1rem; color: #1e293b; margin-bottom: 0.25rem; margin-top: 0;
        }
        .custom-popup p { font-size: 0.875rem; color: #64748b; margin: 0; }
        .custom-popup .mapboxgl-popup-close-button {
          position: absolute; top: 8px; right: 8px; width: 24px; height: 24px;
          display: flex; justify-content: center; align-items: center; border: none;
          border-radius: 50%; background-color: transparent; cursor: pointer;
          font-size: 20px; line-height: 1; color: #9ca3af;
          transition: background-color 0.2s, color 0.2s;
        }
        .custom-popup .mapboxgl-popup-close-button:hover {
          background-color: #f3f4f6; color: #1f2937;
        }
      `}</style>

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
      <div className="relative min-h-[100dvh] p-6 overflow-hidden text-gray-800 bg-[#EAEAEA]">
        <div className={`${vistaMovil !== 'mapa' ? 'hidden md:block' : ''}`}>
          <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 xl:px-8">
            <div className="relative rounded-xl shadow-lg overflow-hidden h-[80vh] sm:h-[85vh] md:h-[90vh] lg:h-[100vh]">
              <div className="flex flex-col lg:flex-row h-full">
                <div className="relative flex-1 p-6">
                  <div className="absolute inset-0 bg-[#006A4E] rounded-3xl"></div> {/* Color verde para Chiapas */}
                  <div className="relative z-10 w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-800">
                        Mapa de <span className="text-[#006A4E]">Chiapas</span>
                      </h2>
                      <button
                        onClick={() => setMostrarMapaMapbox(v => !v)}
                        className="bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition text-sm font-medium"
                      >
                        {mostrarMapaMapbox ? '🗺️ Ver SVG' : '🌐 Ver Mapbox'}
                      </button>
                    </div>
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
                          {/* --- TOOLTIP PARA SVG AÑADIDO --- */}
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
                        </div>
                      )}
                    </div>
                  </div>
                </div>
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
        {vistaMovil === 'itinerario' && (
          <div className="md:hidden w-full max-w-screen-xl mx-auto px-4 sm:px-6 xl:px-8">
            <aside className="w-full bg-white/90 backdrop-blur p-6 border-t border-gray-200 overflow-y-auto rounded-xl shadow-lg">
              <ItinerarioForm />
            </aside>
          </div>
        )}

        <button
          onClick={toggleAudio}
          className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-green-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
          aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          )}
        </button>

      </div>
      {showODPicker && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Elegir Origen y Destino</h3>
              <button onClick={() => setShowODPicker(false)} className="rounded-md px-2 py-1 border hover:bg-neutral-100" aria-label="Cerrar">✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Origen</label>
                <select value={origenSel} onChange={(e) => setOrigenSel(e.target.value)} className="w-full border rounded-lg px-3 py-2 bg-white">
                  <option value="" disabled>Selecciona municipio…</option>
                  {listaMunicipios.map((nom) => <option key={nom} value={nom}>{nom}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Destino</label>
                <select value={destinoSel} onChange={(e) => setDestinoSel(e.target.value)} className="w-full border rounded-lg px-3 py-2 bg-white">
                  <option value="" disabled>Selecciona municipio…</option>
                  {listaMunicipios.map((nom) => <option key={nom} value={nom}>{nom}</option>)}
                </select>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-600">
              Consejo: puedes elegir el mismo municipio para un viaje local.
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowODPicker(false)} className="px-3 py-2 rounded-lg border hover:bg-neutral-50">Cancelar</button>
              <button
                onClick={() => {
                  if (!origenSel || !destinoSel) return;
                  setFormData(prev => ({ ...prev, modoDestino: "manual", lugarInicio: origenSel, ultimoLugar: destinoSel }));
                  try {
                    const it = JSON.parse(localStorage.getItem("itinerario") || "{}");
                    localStorage.setItem("itinerario", JSON.stringify({ ...it, modoDestino: "manual", origen: origenSel, destino: destinoSel, lugarInicio: origenSel }));
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