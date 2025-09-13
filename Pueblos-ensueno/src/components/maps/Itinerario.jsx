import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import html2pdf from "html2pdf.js";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getSelecciones } from '../../utils/itinerarioStore';
import { FileDown, Save, Trash2, Edit, Plus, GripVertical, Trash, ArrowLeft, Calendar, Wallet, Sparkles, MapPin, BookOpen } from 'lucide-react';

// --- CONFIGURACIÓN DE MAPBOX ---
// Asegúrate de que tu variable de entorno esté configurada
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// --- COMPONENTES INTERNOS DE UI ---

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

const DayCard = ({ dia, actividades, onAdd, onDelete }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-orange-600 mb-4">Día {dia.dia}</h3>
        <div className="space-y-4">
            {actividades && actividades.length > 0 ? actividades.map((act, i) => (
                <div key={i} className="flex items-center gap-3 group">
                    <GripVertical size={16} className="text-slate-400 cursor-grab" />
                    <div className="flex-1">
                        <p className="font-semibold text-zinc-800">{act.titulo}</p>
                        <p className="text-xs text-slate-500 capitalize">{act.tipo ? act.tipo.replace(/_/g, ' ') : 'Actividad'}</p>
                    </div>
                    <button onClick={() => onDelete(dia.dia - 1, i)} className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash size={16} />
                    </button>
                </div>
            )) : (
                <p className="text-sm text-slate-500 italic">Día libre. ¡Añade alguna actividad!</p>
            )}
        </div>
        <button
            onClick={() => onAdd(dia.dia - 1)}
            className="w-full mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 p-2 rounded-lg transition-colors"
        >
            <Plus size={16} />
            <span>Añadir Actividad</span>
        </button>
    </div>
);

const SummaryItem = ({ icon, label, value }) => (
    <div className="flex items-start gap-3">
        <div className="text-slate-500 mt-1">{icon}</div>
        <div>
            <p className="text-sm font-semibold text-slate-600">{label}</p>
            <p className="text-sm text-zinc-800">{value}</p>
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
    const [mobileView, setMobileView] = useState('itinerario'); // 'itinerario' o 'mapa'

    // Carga inicial de datos
    useEffect(() => {
        const datosPersistidos = state || JSON.parse(localStorage.getItem("itinerario") || "null");
        if (!datosPersistidos) {
            navigate("/mapa");
            return;
        }
        setDatos(datosPersistidos);
        setDiasData(Array.isArray(datosPersistidos.diasData) ? datosPersistidos.diasData : []);
    }, [state, navigate]);

    // Inicialización y actualización del mapa
    useEffect(() => {
        if (!mapContainerRef.current || !datos) return;

        const allCoords = diasData
            .flatMap(dia => dia.actividades.map(act => act.meta?.coords))
            .filter(Boolean);
        
        const initializeMap = () => {
             mapRef.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: "mapbox://styles/mapbox/streets-v11",
                center: [-92.9475, 17.9895],
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
                map.removeLayer('route');
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
                    });
                
                const bounds = new mapboxgl.LngLatBounds();
                allCoords.forEach(coord => bounds.extend(coord));
                map.fitBounds(bounds, { padding: 80 });

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

    // Redimensionar mapa cuando cambia la vista móvil
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

    if (!datos) {
        return <div className="min-h-screen flex items-center justify-center"><p>Cargando itinerario...</p></div>;
    }

    return (
        <div className="w-full min-h-screen bg-slate-50 flex flex-col lg:grid lg:grid-cols-2">
            {/* INTERRUPTOR DE VISTA MÓVIL */}
            <div className="p-4 lg:hidden">
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
            <main ref={pdfRef} className={`p-6 md:p-10 ${mobileView === 'itinerario' ? 'block' : 'hidden'} lg:block`}>
                <div className="max-w-2xl mx-auto">
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
                        <ActionButton onClick={() => alert("Itinerario guardado (simulación)")} icon={<Save size={16} />} text="Guardar" />
                        <ActionButton onClick={handleReset} icon={<Trash2 size={16} />} text="Reiniciar Itinerario" isDestructive={true} />
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                            <SummaryItem icon={<Calendar size={18} />} label="Fechas" value={datos.dias || "No definidas"} />
                            <SummaryItem icon={<Wallet size={18} />} label="Presupuesto/día" value={`${datos.monedas?.MXN || datos.presupuesto} MXN`} />
                            <SummaryItem icon={<MapPin size={18} />} label="Ruta" value={`${datos.origen || 'N/A'} → ${datos.destino || 'N/A'}`} />
                            <SummaryItem icon={<Sparkles size={18} />} label="Intereses" value={(datos.interesesSeleccionados || []).join(', ') || "No definidos"} />
                         </div>
                    </div>

                    <div className="space-y-6">
                        {diasData.map((dia, index) => (
                            <DayCard 
                                key={index} 
                                dia={dia} 
                                actividades={dia.actividades || []} 
                                onAdd={() => alert("Añadir actividad (funcionalidad pendiente)")}
                                onDelete={() => alert("Eliminar actividad (funcionalidad pendiente)")}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Itinerario;