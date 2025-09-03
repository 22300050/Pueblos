// Archivo: src/components/Topbar.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Mail } from 'lucide-react';

export default function Topbar() {
  const { i18n } = useTranslation();

  return (
    <div className="bg-gray-100 border-b border-gray-200 px-6 sm:px-8 py-2 text-sm text-gray-700">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Lado Izquierdo: Contacto y Puntos Cercanos */}
        <div className="flex items-center gap-6">
          <Link to="/puntos-cercanos" className="flex items-center gap-2 hover:text-black transition-colors">
            <MapPin size={16} className="text-[#F39106]" />
            <span className="hidden sm:inline">Puntos Cercanos</span>
          </Link>
          <a href="mailto:info@pueblosdeensueno.mx" className="hidden md:flex items-center gap-2 hover:text-black transition-colors">
            <Mail size={16} className="text-[#F39106]" />
            <span className="hidden lg:inline">info@pueblosdeensueno.mx</span>
          </a>
        </div>

        {/* Lado Derecho: Switch de Idioma */}
        <div className="flex bg-white border border-gray-300 rounded-full p-0.5">
          <button
            onClick={() => i18n.changeLanguage("es")}
            className={`px-3 py-0.5 rounded-full text-xs font-semibold transition-colors duration-200 ${
              i18n.language === 'es' 
                ? 'bg-[#1A2B3B] text-white' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            ES
          </button>
          <button
            onClick={() => i18n.changeLanguage("en")}
            className={`px-3 py-0.5 rounded-full text-xs font-semibold transition-colors duration-200 ${
              i18n.language === 'en' 
                ? 'bg-[#1A2B3B] text-white' 
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            EN
          </button>
        </div>
      </div>
    </div>
  );
}