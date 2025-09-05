import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const culturalEvents = [
  "🪅 Ferias Tradicionales",
  "🎉 Carnavales",
  "🍫 Festivales Gastronómicos",
  "🎶 Música y Danza",
  "🖼️ Exposiciones y Arte",
  "🎭 Teatro y Performance",
  "🐾 Cultura y Naturaleza",
  "👨‍🏫 Talleres y Cursos",
  "🧭 Rutas Turístico-Culturales"
];

const staticZones = [
  "🏺 Zonas Arqueológicas",
  "🏞️ Parques Naturales",
  "🐅 Museos de Historia y Cultura",
  "🖼️ Centros Culturales",
  "🐒 Parques Zoológicos",
  "🏡 Haciendas Cacaoteras",
  "⛪ Iglesias y Edificaciones Históricas",
  "🎨 Galerías y Espacios de Arte",
  "⛲ Plazas y Monumentos"
];

export default function InterestsSelector() {
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [mensajeVisible, setMensajeVisible] = useState(false);
  const navigate = useNavigate();

  const toggleInterest = interest => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const cleanName = interest => interest.replace(/^[^a-zA-Z0-9]+/, '').trim();

  const handleGuardar = () => {
    const culturales = selectedInterests
      .filter(item => culturalEvents.includes(item))
      .map(cleanName);
    const estaticos = selectedInterests
      .filter(item => staticZones.includes(item))
      .map(cleanName);

    localStorage.setItem(
      'interesesSeleccionados',
      JSON.stringify({ culturales, estaticos })
    );
    setMensajeVisible(true);
    setTimeout(() => navigate('/mapa'), 2000);
  };

  const renderOptions = (list, category) => (
    <div className="mb-6 w-full">
      <h3 className="text-xl font-bold text-pink-600 mb-3 text-center">
        {category}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {list.map(item => (
          <label
            key={item}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all w-full ${
              selectedInterests.includes(item)
                ? 'bg-pink-200 border-pink-400 text-pink-800 font-semibold'
                : 'bg-white hover:bg-pink-50 border-gray-300 text-gray-800'
            }`}
          >
            <input
              type="checkbox"
              checked={selectedInterests.includes(item)}
              onChange={() => toggleInterest(item)}
              className="mr-2 w-5 h-5 text-pink-600 focus:ring-pink-400 border-gray-300 rounded"
            />
            <span className="text-sm sm:text-base break-words">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-rose-200 via-amber-200 to-lime-200 flex flex-col items-center p-4 text-gray-800">
      {mensajeVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white py-5 px-8 rounded-2xl shadow-2xl border-2 border-pink-300 text-pink-800 text-lg font-semibold text-center">
            🎯 Intereses seleccionados correctamente
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl bg-white/90 p-6 rounded-2xl shadow-xl border-2 border-pink-200">
        <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-6 tracking-wide">
          Selecciona tus intereses
        </h2>

        {renderOptions(culturalEvents, '🪅 Eventos Culturales')}
        {renderOptions(staticZones, '🏛️ Zonas Culturales')}

        <div className="mt-4 text-center">
          <button
            onClick={handleGuardar}
            className="w-full sm:w-auto bg-pink-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-pink-500 transition shadow-md"
          >
            Guardar intereses
          </button>
        </div>
      </div>
    </div>
  );
}
