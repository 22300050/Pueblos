// MapaChiapas.jsx — con Mapbox integrado
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 🔹 Mapbox
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

import chiapasSvg from '../../assets/svg/Chiapas.svg?raw';

export default function MapaChiapas({ onRegresar, estado = 'Chiapas' }) {
  const containerRef = useRef(null);
  const mapContainer = useRef(null);         // ⬅️ contenedor Mapbox
  const mapRef = useRef(null);               // ⬅️ instancia del mapa
  const [mostrarMapaMapbox, setMostrarMapaMapbox] = useState(false); // ⬅️ toggle
  const [clickCoords, setClickCoords] = useState(null);

  const [tooltip, setTooltip] = useState({ visible: false, name: '', x: 0, y: 0 });
  const [vistaMovil, setVistaMovil] = useState('mapa'); // 'mapa' | 'itinerario'
  const navigate = useNavigate();

  // -------------------- Estados auxiliares --------------------
  const [confirmacionDias, setConfirmacionDias] = useState('');
  const timeoutRef = useRef(null);

  // -------------------- Itinerario: borrador/persistencia --------------------
  const itinerarioPersistido = JSON.parse(localStorage.getItem("itinerario") || "{}");

  const [formData, setFormData] = useState({
    dias: '',
    tipo: '',
    lugarInicio: itinerarioPersistido?.lugarInicio || '',
    ultimoLugar: '',
    intereses: '',
    mes: itinerarioPersistido?.mes || '',
    email: '',
    modoDestino:
      itinerarioPersistido?.modoDestino === 'automatico'
        ? 'auto'
        : (itinerarioPersistido?.modoDestino || '')
  });

  const [errores, setErrores] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Picker Origen/Destino
  const [showODPicker, setShowODPicker] = useState(false);
  const [origenSel, setOrigenSel] = useState(formData.lugarInicio || "");
  const [destinoSel, setDestinoSel] = useState(formData.ultimoLugar || "");

  // -------------------- Helpers --------------------
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

  const clampFechaAlMes = (yyyy, mesNombre, dias) => {
    const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    const mIdx = Math.max(0, meses.indexOf(mesNombre));
    const inicio = new Date(yyyy, mIdx, 1);
    const finMes = new Date(yyyy, mIdx + 1, 0);
    const fin = new Date(inicio);
    fin.setDate(inicio.getDate() + Math.max(0, (parseInt(dias || "1",10) - 1)));
    return { inicio, fin: (fin > finMes ? finMes : fin) };
  };

  // Sugerencia simple si falta origen/destino en modo auto
  const sugerirRuta = ({ mes, intereses = [], tipo }) => {
    const inicio = "Tuxtla Gutiérrez";
    const fin = "San Cristóbal de las Casas";
    const actividades = ["Cañón del Sumidero", "Andador Eclesiástico", "Museo del Ámbar"];
    return { inicio, fin, actividades, eventosMes: [] };
  };

  // -------------------- Municipios (para markers y picker) --------------------
  // Coordenadas aproximadas [lng, lat]
  const municipiosChiapas = [
    { nombre: 'Tuxtla Gutiérrez',          coords: [-93.1150, 16.7539] },
    { nombre: 'San Cristóbal de las Casas',coords: [-92.6386, 16.7370] },
    { nombre: 'Palenque',                   coords: [-91.9840, 17.5092] },
    { nombre: 'Comitán de Domínguez',       coords: [-92.1386, 16.2521] },
    { nombre: 'Chiapa de Corzo',            coords: [-93.0073, 16.7071] },
    { nombre: 'Tapachula',                  coords: [-92.2570, 14.9018] },
    { nombre: 'Toniná',                     coords: [-92.0088, 16.9118] },
    { nombre: 'Ocosingo',                   coords: [-92.0951, 16.9063] },
    { nombre: 'Las Margaritas',             coords: [-91.9781, 16.3141] },
    { nombre: 'San Juan Chamula',           coords: [-92.7030, 16.7928] },
  ];

  const listaMunicipios = [...municipiosChiapas]
    .map(m => m.nombre)
    .sort((a,b) => a.localeCompare(b, 'es'));

  // -------------------- SVG: Dibuja y listeners (solo si no está Mapbox) --------------------
  useEffect(() => {
    if (vistaMovil !== 'mapa') return;
    if (mostrarMapaMapbox) return;            // ⬅️ si está Mapbox, NO pintes el SVG
    if (!containerRef.current) return;

    containerRef.current.innerHTML = chiapasSvg;

    const svg = containerRef.current.querySelector('svg');
    if (svg) {
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.style.display = 'block';
    }

    const paths = containerRef.current.querySelectorAll('path, polygon');
    const handlers = [];
    paths.forEach((path) => {
      path.classList.add('hoverable-state');
      if (!path.getAttribute('stroke')) path.setAttribute('stroke', '#000');
      if (!path.getAttribute('stroke-width')) path.setAttribute('stroke-width', '2');
      path.setAttribute('stroke-linejoin', 'round');

      const titleTag = path.querySelector('title');
      const name = (titleTag?.textContent || path.getAttribute('id') || 'Municipio').trim();
      if (titleTag) titleTag.remove();

      const onEnter = (e) => {
        const r = containerRef.current.getBoundingClientRect();
        setTooltip({ visible: true, name, x: e.clientX - r.left, y: e.clientY - r.top });
      };
      const onMove = (e) => {
        const r = containerRef.current.getBoundingClientRect();
        setTooltip((t) => (t.visible ? { ...t, x: e.clientX - r.left, y: e.clientY - r.top } : t));
      };
      const onLeave = () => setTooltip({ visible: false, name: '', x: 0, y: 0 });
      const onClick = () => navigate(`/municipio/${name}`);

      path.addEventListener('mouseenter', onEnter);
      path.addEventListener('mousemove', onMove);
      path.addEventListener('mouseleave', onLeave);
      path.addEventListener('click', onClick);
      handlers.push({ path, onEnter, onMove, onLeave, onClick });
    });

    return () => {
      handlers.forEach(({ path, onEnter, onMove, onLeave, onClick }) => {
        path.removeEventListener('mouseenter', onEnter);
        path.removeEventListener('mousemove', onMove);
        path.removeEventListener('mouseleave', onLeave);
        path.removeEventListener('click', onClick);
      });
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [vistaMovil, mostrarMapaMapbox, navigate, chiapasSvg]);

  // -------------------- MAPBOX: Inicialización (similar a Tabasco) --------------------
  useEffect(() => {
    if (vistaMovil !== 'mapa') return;
    if (!mostrarMapaMapbox || !mapContainer.current) return;

    // Evita recrear si ya existe
    if (mapRef.current) {
      mapRef.current.resize();
      return;
    }

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-92.5, 16.7],  // centro aproximado de Chiapas
      zoom: 6.5,
      pitch: 0,
      bearing: 0,
    });
    mapRef.current = map;

    map.once('load', () => map.resize());
    setTimeout(() => map.resize(), 0);

    map.dragRotate.disable();
    map.touchZoomRotate.disableRotation();
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Click para popup de coordenadas
    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      setClickCoords({ lng, lat });
      new mapboxgl.Popup({ closeOnClick: true, offset: 10 })
        .setLngLat([lng, lat])
        .setHTML(`
          <strong>📍 Coordenadas</strong><br>
          Lat: ${lat.toFixed(5)}<br>
          Lng: ${lng.toFixed(5)}
        `)
        .addTo(map);
    });

    // Marcadores de municipios
    municipiosChiapas.forEach((municipio) => {
      const el = document.createElement('div');
      el.style.width = '18px';
      el.style.height = '18px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#1E90FF';
      el.style.cursor = 'pointer';

      new mapboxgl.Marker(el)
        .setLngLat(municipio.coords)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<strong>${municipio.nombre}</strong><br>Municipio de Chiapas`
        ))
        .addTo(map);

      el.addEventListener('click', () => {
        // Soporta tu flujo de selección manual si lo activas aquí
        const seleccion = document.body.getAttribute("data-seleccionando");
        if (seleccion === 'inicio') {
          setFormData(prev => ({ ...prev, lugarInicio: municipio.nombre }));
          document.body.removeAttribute("data-seleccionando");
          return;
        }
        if (seleccion === 'fin') {
          setFormData(prev => ({ ...prev, ultimoLugar: municipio.nombre }));
          document.body.removeAttribute("data-seleccionando");
          return;
        }
        navigate(`/municipio/${municipio.nombre}`);
      });
    });

    const onResize = () => map.resize();
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mostrarMapaMapbox, vistaMovil]);

  // -------------------- Escucha cambios externos de localStorage --------------------
  useEffect(() => {
    const handleStorageChange = () => {
      const it = JSON.parse(localStorage.getItem("itinerario") || "null");
      if (it?.mes) {
        setFormData(prev => ({ ...prev, mes: it.mes }));
      }
      if (it?.lugarInicio) {
        setFormData(prev => ({
          ...prev,
          lugarInicio: it.lugarInicio,
          modoDestino: (it.modoDestino === 'automatico' ? 'auto' : (it.modoDestino || 'auto'))
        }));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // -------------------- Autocalcular fechas --------------------
  useEffect(() => {
    if (!formData.mes) return;
    const hoy = new Date();
    const yyyy = fechaInicio ? new Date(fechaInicio).getFullYear() : hoy.getFullYear();
    const { inicio, fin } = clampFechaAlMes(yyyy, formData.mes, formData.dias || 1);
    const iso = d => d.toISOString().split("T")[0];
    setFechaInicio(iso(inicio));
    setFechaFin(iso(fin));
  }, [formData.mes, formData.dias]);

  // -------------------- Formulario --------------------
  const ItinerarioForm = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const errs = [];
        if (!formData.dias) errs.push("📅 Indica los días de viaje");
        if (!formData.tipo) errs.push("💰 Elige un presupuesto estimado");
        if (!formData.mes) errs.push("📆 Elige un mes");
        if (!fechaInicio || !fechaFin) errs.push("🗓 Selecciona fechas de viaje");
        if (formData.modoDestino === "manual") {
          if (!formData.lugarInicio) errs.push("🏁 Elige el Origen (municipio)");
          if (!formData.ultimoLugar) errs.push("🎯 Elige el Destino (municipio)");
        }
        if (errs.length > 0) { setErrores(errs); return; }
        setErrores([]);

        const interesesArr = formData.intereses ? formData.intereses.split(", ").filter(Boolean) : [];
        const presupuestoMXN = tipoPresupuestoADinero(formData.tipo);
        const monedas = convertirMonedas(presupuestoMXN);

        let origen = formData.lugarInicio;
        let destino = formData.ultimoLugar;

        if (formData.modoDestino !== "manual") {
          const s = sugerirRuta({ mes: formData.mes, intereses: interesesArr, tipo: formData.tipo });
          origen = origen || s.inicio;
          destino = destino || s.fin;
        }

        const sugerencia = sugerirRuta({ mes: formData.mes, intereses: interesesArr, tipo: formData.tipo });

        const payload = {
          estado,
          dias: `${fechaInicio} a ${fechaFin}`,
          presupuesto: presupuestoMXN,
          monedas,
          email: formData.email || "",
          mes: formData.mes,
          interesesSeleccionados: interesesArr,
          origen,
          destino,
          eventosSeleccionados: [{
            nombre: formData.tipo,
            icono: "🎯",
            fechas: `${fechaInicio} a ${fechaFin}`,
            elementos: interesesArr.join(", "),
            actividades: sugerencia.actividades.join(", "),
            eventosMes: []
          }]
        };

        localStorage.setItem("itinerario", JSON.stringify(payload));
        navigate("/itinerario", { state: payload });
      }}
      className="flex flex-col gap-4 text-sm"
    >
      <label className="font-bold text-lg text-center">
        {mostrarMapaMapbox ? '📍 Explora los municipios de Chiapas' : '🐯 ITINERARIOS DE VIAJE'}
      </label>

      {errores.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
          <ul className="list-disc list-inside">
            {errores.map((m,i)=><li key={i}>{m}</li>)}
          </ul>
        </div>
      )}

      {/* Modo destino */}
      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-full px-3 py-1 mb-4 text-sm">
        <span className="text-gray-700 whitespace-nowrap">¿Sabes a dónde ir?</span>
        <div className="flex gap-2">
          <button
            type="button"
            className={`px-3 py-1 rounded-full transition text-xs ${formData.modoDestino === "manual" ? "bg-green-300 text-green-900" : "bg-gray-200 hover:bg-green-200"}`}
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
            className={`px-3 py-1 rounded-full transition text-xs ${formData.modoDestino === "auto" ? "bg-blue-300 text-blue-900" : "bg-gray-200 hover:bg-blue-200"}`}
            onClick={() => setFormData(prev => ({ ...prev, modoDestino: "auto" }))}
          >
            Automático
          </button>
        </div>
      </div>

      {formData.modoDestino === "manual" && (formData.lugarInicio || formData.ultimoLugar) && (
        <div className="mb-3 text-sm space-y-1">
          {formData.lugarInicio && (
            <span className="inline-block bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-full mr-2">
              Origen: <strong>{formData.lugarInicio}</strong>
            </span>
          )}
          {formData.ultimoLugar && (
            <span className="inline-block bg-sky-100 text-sky-900 border border-sky-300 px-3 py-1 rounded-full">
              Destino: <strong>{formData.ultimoLugar}</strong>
            </span>
          )}
        </div>
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

      {/* Presupuesto */}
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

      {/* Mes */}
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

      {/* Intereses */}
      <select
        value=""
        onChange={(e) => {
          const valor = e.target.value;
          if (valor === 'Cerrar') {
            setFormData({ ...formData, intereses: '' });
          } else if (valor) {
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

  // -------------------- Render --------------------
  return (
    <>

      {/* Toggle móvil Mapa / Itinerario */}
      <div className="md:hidden px-6 py-2">
        <div className="flex gap-2 rounded-full bg-white/80 p-1 shadow border">
          <button
            onClick={()=>setVistaMovil('mapa')}
            className={`flex-1 px-3 py-2 rounded-full ${vistaMovil==='mapa'?'bg-yellow-400 font-bold':''}`}
          >
            🗺️ Mapa
          </button>
          <button
            onClick={()=>setVistaMovil('itinerario')}
            className={`flex-1 px-3 py-2 rounded-full ${vistaMovil==='itinerario'?'bg-yellow-400 font-bold':''}`}
          >
            📋 Itinerario
          </button>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL: mapa + panel derecho */}
      <main className="relative min-h-[100dvh] p-6 overflow-hidden text-gray-800 bg-gradient-to-b from-[var(--color-cuatro)] to-[var(--color-verde)]">
        <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 xl:px-8">
          <div className="relative rounded-xl shadow-lg overflow-hidden h-[80vh] sm:h-[85vh] md:h-[90vh] lg:h-[100vh]">
            <div className="flex flex-col lg:flex-row h-full">
              {/* MAPA (izquierda) */}
              
              <div className={`${vistaMovil!=='mapa' ? 'hidden md:block' : ''} relative flex-1`}>
                {/* Botón para alternar SVG / Mapbox */}
                <div className="absolute top-2 left-2 z-20 flex gap-2">
                 <button onClick={() => setMostrarMapaMapbox(v => !v)}
                    className="bg-white border border-gray-300 px-4 py-2 rounded shadow hover:bg-gray-100 transition">
                      {mostrarMapaMapbox ? '🌐 Ver mapa SVG' : '🗺️ Ver mapa Mapbox'}
                        </button>
                         </div>
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
                  <>
                    <div
                      ref={containerRef}
                      className="absolute inset-0 w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                    />
                    {tooltip.visible && (
                      <div
                        className="absolute z-40 bg-yellow-200 text-gray-800 text-xs sm:text-sm font-bold px-3 py-2 rounded-xl shadow-lg border-2 border-amber-300"
                        style={{ top: Math.min(tooltip.y + 24, window.innerHeight - 56), left: Math.min(tooltip.x + 24, window.innerWidth - 160) }}
                      >
                        🌸 {tooltip.name}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* FORMULARIO (móvil) */}
              {vistaMovil === 'itinerario' && (
                <section className="md:hidden w-full h-full bg-white/95 backdrop-blur p-4 border-t border-gray-200 overflow-y-auto">
                  <ItinerarioForm />
                </section>
              )}

              {/* PANEL DERECHO (Itinerario) */}
              <aside className="hidden md:block md:w-[420px] h-full bg-white/90 backdrop-blur p-6 border-l border-gray-200 overflow-y-auto">
                <ItinerarioForm />
              </aside>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL Origen/Destino */}
      {showODPicker && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Elegir Origen y Destino</h3>
              <button
                onClick={() => setShowODPicker(false)}
                className="rounded-md px-2 py-1 border hover:bg-neutral-100"
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
                  className="w-full border rounded-lg px-3 py-2 bg-white"
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
                  className="w-full border rounded-lg px-3 py-2 bg-white"
                >
                  <option value="" disabled>Selecciona municipio…</option>
                  {listaMunicipios.map((nom) => (
                    <option key={nom} value={nom}>{nom}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-600">
              Consejo: puedes elegir el mismo municipio para un viaje local (origen = destino).
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowODPicker(false)}
                className="px-3 py-2 rounded-lg border hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!origenSel || !destinoSel) return;

                  setFormData(prev => ({
                    ...prev,
                    modoDestino: "manual",
                    lugarInicio: origenSel,
                    ultimoLugar: destinoSel
                  }));

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
