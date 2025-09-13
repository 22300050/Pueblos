import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Share2, Bell, MapPin, ArrowLeft, AlertTriangle, Users, Building, Palette, Drama, Utensils, Music, Brush, Landmark, Mountain, School, Route as RouteIcon, Check } from 'lucide-react';
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { createClient } from "@supabase/supabase-js";

// --- CONFIGURACIÓN Y DATOS ---
// Asegúrate de que tus variables de entorno estén configuradas en tu archivo .env
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// --- DATOS DE EJEMPLO CON NUEVAS CATEGORÍAS ---
const ALL_PLACES = [
    { id: "la-venta", nombre: "Parque Museo La Venta", coords: [-92.9341, 18.0019], color: "#795548", description: "Escultura olmeca y museo al aire libre.", type: 'Zonas Arqueológicas' },
    { id: "maria", nombre: "María Luciano Cruz", coords: [-93.01, 18.2026667], color: "#2E7D32", description: "Cestería de palma en Nacajuca.", type: 'Artesanos' },
    { id: "matilde", nombre: "Matilde de la Cruz Esteban", coords: [-93.0121, 18.2114], color: "#2E7D32", description: "Sombreros y cestería en Nacajuca.", type: 'Artesanos' },
    { id: "feria-queso", nombre: "Feria del Queso", coords: [-92.9302, 17.9892], color: "#D81B60", description: "Evento gastronómico anual.", type: 'Festivales Gastronómicos' },
    { id: "taller-chocolate", nombre: "Taller de Chocolate", coords: [-92.9231, 17.9855], color: "#03A9F4", description: "Aprende sobre el cacao.", type: 'Centros Culturales' },
    { id: "carnaval-tenosique", nombre: "Carnaval de Tenosique", coords: [-91.4225, 17.4694], color: "#9C27B0", description: "Uno de los carnavales más antiguos de México.", type: 'Carnavales' },
];

const CATEGORIES = [
    { name: 'Artesanos', icon: <Users size={18} /> },
    { name: 'Zonas Arqueológicas', icon: <Landmark size={18} /> },
    { name: 'Festivales Gastronómicos', icon: <Utensils size={18} /> },
    { name: 'Carnavales', icon: <Drama size={18} /> },
    { name: 'Centros Culturales', icon: <School size={18} /> },
];

export default function PuntosCercanos() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const userMarker = useRef(null);
  const markersRef = useRef({});
  const userCoordsRef = useRef(null);
  
  const [geolocationError, setGeolocationError] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  // --- LÓGICA DE NOTIFICACIONES Y UBICACIÓN ---
  const notificar = async (titulo, cuerpo) => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      await Notification.requestPermission();
    }
    if (Notification.permission === "granted") {
      try {
        const reg = await navigator.serviceWorker.ready;
        await reg.showNotification(titulo, { body: cuerpo, icon: "/icon-192.png" });
      } catch (e) { console.error("Error en showNotification:", e); }
    }
  };

  const compartirUbicacion = async () => {
    const coords = userCoordsRef.current;
    if (!coords) {
      alert("Aún no se ha detectado tu ubicación. Por favor, concede los permisos necesarios.");
      return;
    }
    const [lng, lat] = coords;
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    const texto = `¡Hola! Esta es mi ubicación actual: ${mapsUrl}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Mi Ubicación", text: texto, url: mapsUrl });
      } else {
        await navigator.clipboard.writeText(texto);
        alert("Enlace de ubicación copiado al portapapeles.");
      }
    } catch (e) {
      console.error("Error al compartir:", e);
    }
  };
    
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-92.9302, 17.9892],
      zoom: 10,
      attributionControl: false,
    });
    
    const mapInstance = map.current;

    mapInstance.on('load', () => {
        mapInstance.resize(); 
        
        ALL_PLACES.forEach(place => {
            const markerElement = document.createElement('div');
            markerElement.innerHTML = `<svg viewBox="0 0 24 24" width="32" height="32" fill="${place.color}" style="filter: drop-shadow(0 2px 3px rgba(0,0,0,0.3));"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path></svg>`;
            
            const marker = new mapboxgl.Marker(markerElement)
                .setLngLat(place.coords)
                .setPopup(new mapboxgl.Popup().setText(place.nombre))
                .addTo(mapInstance);
            
            marker.getElement().addEventListener('click', () => {
                mapInstance.flyTo({ center: place.coords, zoom: 15 });
            });
            markersRef.current[place.id] = { marker, type: place.type };
        });

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setGeolocationError(null);
              const userCoords = [position.coords.longitude, position.coords.latitude];
              userCoordsRef.current = userCoords;
              
              if (!userMarker.current) {
                const userMarkerEl = document.createElement('div');
                userMarkerEl.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" fill="royalblue" stroke="white" stroke-width="2"></circle></svg>`;
                userMarker.current = new mapboxgl.Marker(userMarkerEl)
                  .setLngLat(userCoords)
                  .setPopup(new mapboxgl.Popup().setText("Tu ubicación"))
                  .addTo(mapInstance);
              } else {
                userMarker.current.setLngLat(userCoords);
              }
              
              mapInstance.flyTo({ center: userCoords, zoom: 14 });
            },
            (error) => {
                setGeolocationError("No se pudo obtener tu ubicación. Por favor, activa los permisos de localización.");
            },
            { enableHighAccuracy: true }
          );
        } else {
            setGeolocationError("La geolocalización no está soportada por tu navegador.");
        }
    });
    
    return () => {
        if (map.current) { map.current.remove(); map.current = null; }
    };
  }, []);

  // Efecto para manejar la visibilidad de los marcadores con los filtros
  useEffect(() => {
    Object.values(markersRef.current).forEach(({ marker, type }) => {
        const markerElement = marker.getElement();
        if (selectedFilters.length === 0 || selectedFilters.includes(type)) {
            markerElement.style.display = 'block';
        } else {
            markerElement.style.display = 'none';
        }
    });
  }, [selectedFilters]);

  const handleFilterToggle = (categoryName) => {
      setSelectedFilters(prevFilters => {
          if (prevFilters.includes(categoryName)) {
              return prevFilters.filter(f => f !== categoryName); // Deseleccionar
          } else {
              return [...prevFilters, categoryName]; // Seleccionar
          }
      });
  };

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="w-full h-full" /> {/* Altura del mapa restaurada a pantalla completa */}
      
      <Link to="/" className="absolute top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-white text-gray-800 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition-colors">
        <ArrowLeft size={20} />
        <span>Inicio</span>
      </Link>

      <div className="absolute top-4 right-4 z-10 w-full max-w-sm bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-4 border border-white/50">
        <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-zinc-800">Filtros</h2>
            <button
                onClick={() => setSelectedFilters([])}
                className="text-xs font-semibold text-orange-600 hover:underline"
                disabled={selectedFilters.length === 0}
            >
                Limpiar
            </button>
        </div>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {CATEGORIES.map(cat => {
                const isSelected = selectedFilters.includes(cat.name);
                return (
                    <button
                        key={cat.name}
                        onClick={() => handleFilterToggle(cat.name)}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                            isSelected ? 'bg-orange-100 text-orange-800' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <div className={`flex-shrink-0 w-5 h-5 border-2 rounded flex items-center justify-center ${isSelected ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`}>
                            {isSelected && <Check size={12} className="text-white" />}
                        </div>
                        <div className={`transition-colors ${isSelected ? 'text-orange-600' : 'text-slate-500'}`}>{cat.icon}</div>
                        <span className="font-semibold text-sm">{cat.name}</span>
                    </button>
                );
            })}
        </div>
      </div>
      
      {geolocationError && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-full max-w-md bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg shadow-lg">
              <div className="flex">
                  <div className="py-1"><AlertTriangle className="h-6 w-6 text-yellow-500 mr-4" /></div>
                  <div>
                      <p className="font-bold text-yellow-800">Permiso de Ubicación Denegado</p>
                      <p className="text-sm text-yellow-700">{geolocationError}</p>
                  </div>
              </div>
          </div>
      )}
      
      <div className="absolute bottom-6 left-6 z-10">
        <button 
          onClick={compartirUbicacion}
          className="flex items-center gap-3 px-5 py-3 bg-orange-500 text-white font-bold rounded-full shadow-2xl hover:bg-orange-600 transition-all transform hover:scale-105"
        >
          <Share2 size={22} />
          <span>Compartir Ubicación</span>
        </button>
      </div>
    </div>
  );
}