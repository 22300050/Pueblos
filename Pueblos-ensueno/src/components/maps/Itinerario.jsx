import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import html2pdf from "html2pdf.js";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getSelecciones, removeSeleccion } from '../../utils/itinerarioStore';
import { FileDown, Save, Trash2, Edit, Plus, GripVertical, Trash, ArrowLeft, Calendar, Wallet, Sparkles, MapPin, BookOpen, X } from 'lucide-react';

// --- CONFIGURACIÓN DE MAPBOX ---
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// --- COMPONENTES INTERNOS DE UI (DEL NUEVO DISEÑO) ---
const ActionButton = ({ onClick, icon, text, isDestructive = false }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
            isDestructive 
            ? 'text-red-600 bg-red-100 hover:bg-red-200' 
            : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
        }`}
    >
        {icon}
        <span>{text}</span>
    </button>
);

const SummaryItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="text-slate-500 mt-1">{icon}</div>
        <div>
            <p className="text-sm font-semibold text-slate-600">{label}</p>
            <p className="text-sm text-zinc-800">{value || "No definido"}</p>
        </div>
    </div>
);


// --- COMPONENTE PRINCIPAL ---

function Itinerario() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [diasData, setDiasData] = useState([]);
    const [datos, setDatos] = useState(null);
    const pdfRef = useRef(null);
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markerRefs = useRef([]);
    const [mobileView, setMobileView] = useState('itinerario');

    // --- ESTADOS PORTADOS DEL ARCHIVO ANTIGUO ---
    const [editDiaIdx, setEditDiaIdx] = useState(null);
    const [modalIndex, setModalIndex] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [selecciones, setSelecciones] = useState([]);
    const [imagenModalTransporte, setImagenModalTransporte] = useState(null);

    // --- LÓGICA PORTADA DEL ARCHIVO ANTIGUO ---
    const transportesSeleccionados = React.useMemo(() => (selecciones || []).filter(s => s.tipo === 'transporte'), [selecciones]);

    useEffect(() => {
        const datosPersistidos = state || JSON.parse(localStorage.getItem("itinerario") || "null");
        if (!datosPersistidos) {
            navigate("/mapa");
            return;
        }
        setDatos(datosPersistidos);
        setDiasData(Array.isArray(datosPersistidos.diasData) ? datosPersistidos.diasData : []);
        setSelecciones(getSelecciones() || []);
    }, [state, navigate]);

    useEffect(() => {
        if (!mapContainerRef.current || !datos) return;
    
        const allCoords = diasData
            .flatMap(dia => dia.actividades.map(act => act.meta?.coords))
            .filter(Boolean);
        
        const initializeMap = () => {
             mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/mapbox/streets-v11",
                center: allCoords.length > 0 ? allCoords[0] : [-92.9475, 17.9895],
                zoom: 10,
            });
            mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        };
    
        if (!mapRef.current) {
            initializeMap();
        }
        
        const map = mapRef.current;
        
        const updateMapContent = () => {
            map.resize();
            markerRefs.current.forEach(marker => marker.remove());
            markerRefs.current = [];
            if (map.getSource('route')) {
                if (map.getLayer('route')) map.removeLayer('route');
                map.removeSource('route');
            }
    
            allCoords.forEach(coords => {
                 const marker = new mapboxgl.Marker({color: '#F97316'}).setLngLat(coords).addTo(map);
                 markerRefs.current.push(marker);
            });
    
            if (allCoords.length > 1) {
                const coordinates = allCoords.map(c => c.join(',')).join(';');
                const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
    
                fetch(url)
                    .then(res => res.json())
                    .then(data => {
                        if (data.routes && data.routes.length > 0) {
                            const route = data.routes[0].geometry;
                            map.addSource('route', { type: 'geojson', data: { type: 'Feature', geometry: route } });
                            map.addLayer({
                                id: 'route',
                                type: 'line',
                                source: 'route',
                                layout: { 'line-join': 'round', 'line-cap': 'round' },
                                paint: { 'line-color': '#F97316', 'line-width': 5, 'line-opacity': 0.8 },
                            });
                        }
                    }).catch(err => console.error("Error fetching route:", err));
                
                const bounds = new mapboxgl.LngLatBounds();
                allCoords.forEach(coord => bounds.extend(coord));
                map.fitBounds(bounds, { padding: 80, duration: 1000 });
    
            } else if (allCoords.length === 1) {
                map.flyTo({ center: allCoords[0], zoom: 14 });
            }
        };
        
        if (map.isStyleLoaded()) {
            updateMapContent();
        } else {
            map.on('load', updateMapContent);
        }
        
    }, [diasData, datos]);

    useEffect(() => {
        if (mapRef.current) {
            setTimeout(() => mapRef.current.resize(), 10);
        }
    }, [mobileView]);

    const exportarPDF = () => {
        if (!pdfRef.current) return;
        const opt = {
            margin: [8, 8, 12, 8],
            filename: `itinerario-${datos?.estado || 'viaje'}.pdf`,
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        html2pdf().set(opt).from(pdfRef.current).save();
    };
    
    const handleReset = () => {
        if(window.confirm("¿Estás seguro de que quieres borrar este itinerario? Esta acción no se puede deshacer.")){
            localStorage.removeItem("itinerario");
            localStorage.removeItem("interesesMunicipios_Tabasco");
            localStorage.removeItem("interesesMunicipios_Chiapas");
            navigate("/mapa");
        }
    }

    // --- FUNCIONES DE MANEJO DE ACTIVIDADES (PORTADAS) ---
    const handleEdit = (diaIdx, actIdx, titulo) => {
        const nuevos = [...diasData];
        const actividadOriginal = selecciones.find(s => s.nombre === titulo) || {};
        nuevos[diaIdx].actividades[actIdx] = {
            ...actividadOriginal,
            titulo: titulo,
            icono: actividadOriginal.icono || '🎯',
        };
        setDiasData(nuevos);
        setModalIndex(null);
    };

    const handleAgregar = (diaIdx) => {
        const nuevos = [...diasData];
        nuevos[diaIdx].actividades.push({ titulo: "Nueva Actividad...", icono: "✍️", tipo: "personalizada" });
        setDiasData(nuevos);
        setModalIndex({ diaIdx, actIdx: nuevos[diaIdx].actividades.length - 1 });
    };

    const handleEliminar = (diaIdx, actIdx) => {
        const nuevos = [...diasData];
        const actividadEliminada = nuevos[diaIdx].actividades[actIdx];
        nuevos[diaIdx].actividades.splice(actIdx, 1);
        setDiasData(nuevos);
        // Opcional: si quieres que al eliminar se quite de la lista global de 'me interesa'
        // removeSeleccionByTitle(actividadEliminada.titulo); 
    };

    const moverActividad = (fromDia, actIdx, toDia) => {
        const nuevos = [...diasData];
        const [item] = nuevos[fromDia].actividades.splice(actIdx, 1);
        if (item) {
            nuevos[toDia].actividades.push(item);
            setDiasData(nuevos);
        }
    };
    
    if (!datos) {
        return <div className="min-h-screen flex items-center justify-center"><p>Cargando itinerario...</p></div>;
    }

    // Opciones para el modal de edición, basadas en las selecciones del usuario
    const opcionesModal = selecciones.filter(s => s.tipo !== 'transporte').map(s => s.nombre);

    return (
        <>
        <div className="w-full min-h-screen bg-slate-50 flex flex-col lg:grid lg:grid-cols-2">
            {/* INTERRUPTOR DE VISTA MÓVIL */}
            <div className="p-4 lg:hidden sticky top-0 bg-slate-50 z-10">
                <div className="flex w-full max-w-sm mx-auto p-1 bg-slate-200 rounded-full">
                    <button 
                        onClick={() => setMobileView('mapa')}
                        className={`w-1/2 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-semibold transition-colors ${
                            mobileView === 'mapa' ? 'bg-white text-zinc-800 shadow' : 'text-slate-500'
                        }`}
                    >
                        <MapPin size={16} /> Mapa
                    </button>
                    <button 
                        onClick={() => setMobileView('itinerario')}
                        className={`w-1/2 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-semibold transition-colors ${
                            mobileView === 'itinerario' ? 'bg-orange-500 text-white shadow' : 'text-slate-500'
                        }`}
                    >
                       <BookOpen size={16} /> Itinerario
                    </button>
                </div>
            </div>

            {/* --- MAPA A LA IZQUIERDA --- */}
            <aside className={`lg:sticky lg:top-0 h-96 lg:h-screen ${mobileView === 'mapa' ? 'block' : 'hidden'} lg:block`}>
                <div ref={mapContainerRef} className="w-full h-full" />
            </aside>

            {/* --- PANEL DE ITINERARIO A LA DERECHA --- */}
            <main className={`p-6 md:p-10 ${mobileView === 'itinerario' ? 'block' : 'hidden'} lg:block`}>
                <div ref={pdfRef} className="max-w-2xl mx-auto">
                    <Link to="/mapa" className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-600 mb-6">
                        <ArrowLeft size={16} />
                        <span>Volver al mapa</span>
                    </Link>

                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-800">
                           Tu viaje a {datos.estado || "un lugar increíble"}
                        </h1>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-8">
                        <ActionButton onClick={exportarPDF} icon={<FileDown size={16} />} text="Exportar a PDF" />
                        <ActionButton onClick={() => setMostrarModal(true)} icon={<Save size={16} />} text="Guardar" />
                        <ActionButton onClick={handleReset} icon={<Trash2 size={16} />} text="Reiniciar Itinerario" isDestructive={true} />
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            <SummaryItem icon={<Calendar size={18} />} label="Fechas" value={datos.dias} />
                            <SummaryItem icon={<Wallet size={18} />} label="Presupuesto/día" value={`${datos.monedas?.MXN || datos.presupuesto} MXN`} />
                            <SummaryItem icon={<MapPin size={18} />} label="Ruta" value={`${datos.origen} → ${datos.destino}`} />
                            <SummaryItem icon={<Sparkles size={18} />} label="Intereses" value={(datos.interesesSeleccionados || []).join(', ')} />
                            {transportesSeleccionados.length > 0 && (
                                <div className="col-span-1 sm:col-span-2">
                                    <div className="flex items-start gap-3">
                                        <div className="text-slate-500 mt-1"><i className="fas fa-bus"></i></div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-600">Transporte</p>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {transportesSeleccionados.map((transporte, idx) => (
                                                    <button
                                                    key={idx}
                                                    onClick={() => setImagenModalTransporte(transporte.imagen)}
                                                    className="text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-full px-3 py-1 text-xs font-medium border border-emerald-200 transition cursor-pointer"
                                                    >
                                                    {transporte.nombre} ℹ️
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                         </div>
                    </div>

                    <div className="space-y-6">
                        {diasData.map((dia, diaIdx) => (
                            <div key={diaIdx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                <h3 className="text-xl font-bold text-orange-600 mb-4">Día {dia.dia}</h3>
                                <div className="space-y-4">
                                    {(dia.actividades && dia.actividades.length > 0) ? dia.actividades.map((act, actIdx) => (
                                        <div key={actIdx} className="flex items-center gap-3 group">
                                            <GripVertical size={16} className="text-slate-400 cursor-grab" />
                                            <div className="flex-1">
                                                <p className="font-semibold text-zinc-800">{act.titulo}</p>
                                                <p className="text-xs text-slate-500 capitalize">{act.tipo ? act.tipo.replace(/_/g, ' ') : 'Actividad'}</p>
                                            </div>
                                            <button onClick={() => setModalIndex({ diaIdx, actIdx })} className="p-1 text-slate-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleEliminar(diaIdx, actIdx)} className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash size={16} />
                                            </button>
                                        </div>
                                    )) : (
                                        <p className="text-sm text-slate-500 italic">Día libre. ¡Añade alguna actividad!</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleAgregar(diaIdx)}
                                    className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors"
                                >
                                    <Plus size={16} />
                                    <span>Añadir Actividad</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>

        {/* --- MODALES PORTADOS DEL ARCHIVO ANTIGUO --- */}
        {mostrarModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-md">
                    <h2 className="text-xl font-bold text-orange-600 mb-4">
                        Para guardar tu itinerario debes registrarte
                    </h2>
                    <p className="text-gray-700 mb-6">¿Quieres hacerlo ahora?</p>
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <button onClick={() => setMostrarModal(false)} className="px-4 py-2 rounded-lg font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800">
                            En otro momento
                        </button>
                        <button onClick={() => navigate("/register")} className="px-4 py-2 rounded-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white">
                            Registrarme
                        </button>
                    </div>
                </div>
            </div>
        )}
        {imagenModalTransporte && (
            <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4" onClick={() => setImagenModalTransporte(null)}>
                <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto p-2 relative" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setImagenModalTransporte(null)} className="absolute top-2 right-2 bg-white/80 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:bg-gray-200 z-10" aria-label="Cerrar">
                        <X size={20} />
                    </button>
                    <img src={imagenModalTransporte} alt="Tarifas de Transporte" className="w-full h-auto rounded-md" />
                </div>
            </div>
        )}
        {modalIndex !== null && (
            <div className="fixed inset-0 bg-black/60 z-40 flex justify-center items-center p-4" onClick={() => setModalIndex(null)}>
                <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                    <h3 className="text-lg font-bold mb-4">Cambiar Actividad</h3>
                    <div className="max-h-64 overflow-y-auto space-y-2">
                        {opcionesModal.map((opcion, i) => (
                            <button
                                key={i}
                                onClick={() => handleEdit(modalIndex.diaIdx, modalIndex.actIdx, opcion)}
                                className="w-full text-left p-3 rounded-lg hover:bg-slate-100 transition"
                            >
                                {opcion}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        )}
        </>
    );
}

export default Itinerario;