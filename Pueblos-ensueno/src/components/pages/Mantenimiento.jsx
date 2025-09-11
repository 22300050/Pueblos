import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// --- Icono SVG personalizado para un diseño más atractivo ---
const MaintenanceIcon = () => (
  <svg className="w-24 h-24 text-orange-500 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    <path d="M12 12l-2 2" />
    <path d="M16 8l-2 2" />
  </svg>
);

export default function Mantenimiento() {
  return (
    // --- FONDO DEGRADADO ACTUALIZADO ---
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-amber-100 text-center p-6 font-sans">
      
      <div className="bg-white p-10 md:p-12 rounded-2xl shadow-2xl border border-gray-200 max-w-lg w-full transform transition-all duration-300 hover:scale-[1.02]">
        
        <div className="mb-6">
          <MaintenanceIcon />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-zinc-800 mb-4 leading-tight">
          Actualización en Proceso
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Estamos realizando mejoras para ofrecerte una experiencia increíble. ¡Volveremos muy pronto!
        </p>
        
        <Link to="/">
          <button className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold bg-[#F39106] text-white shadow-lg hover:bg-opacity-90 transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F39106]">
            <ArrowLeft className="w-5 h-5" />
            <span>Regresar al Inicio</span>
          </button>
        </Link>
      </div>
      
    </div>
  );
}
