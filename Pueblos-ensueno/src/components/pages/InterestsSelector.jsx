import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, Landmark, Utensils, Music, Drama, Brush, Mountain, School, Map, Check } from 'lucide-react';

// --- CAMBIO DE DISEÑO: Se reestructuran los datos para incluir iconos ---
const culturalEvents = [
  { name: "Ferias Tradicionales", Icon: Palette },
  { name: "Carnavales", Icon: Drama },
  { name: "Festivales Gastronómicos", Icon: Utensils },
  { name: "Música y Danza", Icon: Music },
  { name: "Exposiciones y Arte", Icon: Brush },
];

const staticZones = [
  { name: "Zonas Arqueológicas", Icon: Landmark },
  { name: "Parques Naturales", Icon: Mountain },
  { name: "Museos de Historia", Icon: Landmark },
  { name: "Centros Culturales", Icon: School },
  { name: "Rutas Turísticas", Icon: Map },
];

export default function InterestsSelector() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [mensajeVisible, setMensajeVisible] = useState(false);
  const navigate = useNavigate();

  const toggleInterest = interestName => {
    setSelectedInterests(prev =>
      prev.includes(interestName)
        ? prev.filter(i => i !== interestName)
        : [...prev, interestName]
    );
  };

  const handleGuardar = () => {
    const culturales = selectedInterests.filter(item => culturalEvents.some(e => e.name === item));
    const estaticos = selectedInterests.filter(item => staticZones.some(z => z.name === item));

    localStorage.setItem(
      'interesesSeleccionados',
      JSON.stringify({ culturales, estaticos })
    );
    setMensajeVisible(true);
    setTimeout(() => navigate('/mapa'), 2000);
  };

  // --- CAMBIO DE DISEÑO: Componente de tarjeta reutilizable ---
  const InterestCard = ({ item, isSelected, onSelect }) => {
    const { name, Icon } = item;
    return (
      <div
        onClick={() => onSelect(name)}
        className={`relative flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 transform ${
          isSelected
            ? 'bg-orange-500 border-orange-600 text-white shadow-lg scale-105'
            : 'bg-white hover:bg-orange-50 border-gray-200 text-gray-800 hover:shadow-md'
        }`}
      >
        {isSelected && (
          <div className="absolute top-2 right-2 bg-white text-orange-500 rounded-full p-1">
            <Check size={16} strokeWidth={3} />
          </div>
        )}
        <Icon className={`w-10 h-10 mb-2 transition-colors ${isSelected ? 'text-white' : 'text-orange-500'}`} />
        <span className="text-center font-semibold text-sm">{name}</span>
      </div>
    );
  };

  return (
    // --- CAMBIO DE DISEÑO: Padding superior aumentado ---
    <div className="min-h-screen w-screen bg-slate-50 flex flex-col items-center px-4 pt-16 pb-28 text-gray-800">
      {mensajeVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white py-5 px-8 rounded-2xl shadow-2xl border-2 border-green-300 text-green-800 text-lg font-semibold text-center flex items-center gap-3">
            <Check size={24} />
            <span>Intereses guardados con éxito</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto">
        {/* --- CAMBIO DE DISEÑO: Encabezado --- */}
        <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-black text-zinc-800">¿Qué te apasiona?</h1>
            <p className="text-slate-600 mt-2 text-lg">Selecciona tus intereses para personalizar tu aventura.</p>
        </div>
        
        <div className="space-y-10">
            <div>
                <h3 className="text-2xl font-bold text-zinc-700 mb-4 flex items-center gap-3"><Palette /> Eventos Culturales</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {culturalEvents.map(item => (
                    <InterestCard
                        key={item.name}
                        item={item}
                        isSelected={selectedInterests.includes(item.name)}
                        onSelect={toggleInterest}
                    />
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-2xl font-bold text-zinc-700 mb-4 flex items-center gap-3"><Landmark /> Zonas y Lugares</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {staticZones.map(item => (
                    <InterestCard
                        key={item.name}
                        item={item}
                        isSelected={selectedInterests.includes(item.name)}
                        onSelect={toggleInterest}
                    />
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* --- CAMBIO DE DISEÑO: Botón de guardar fijo en la parte inferior --- */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
            <button
                onClick={handleGuardar}
                disabled={selectedInterests.length === 0}
                className="w-full bg-orange-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed transform hover:-translate-y-1 disabled:transform-none"
            >
                {selectedInterests.length === 0 
                ? "Selecciona al menos un interés"
                : `Guardar ${selectedInterests.length} ${selectedInterests.length === 1 ? 'interés' : 'intereses'}`
                }
            </button>
        </div>
      </div>
    </div>
  );
}