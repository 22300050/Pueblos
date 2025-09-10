import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Map, MapPin, LogOut, Compass, Sparkles } from 'lucide-react';

// En tu proyecto real, asegúrate de que la ruta al logo sea correcta.
// import logo from '../assets/Logo.png'; 

// Datos de usuario de ejemplo.
const userData = {
  name: 'Explorador', 
};

// Componente para cada botón de acción, para un código más limpio.
const ActionButton = ({ to, icon, title, description, isPrimary = false }) => (
    <Link to={to} className={`block p-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
        isPrimary 
        ? 'bg-orange-500 text-white shadow-orange-400/30' 
        : 'bg-slate-100 hover:bg-slate-200'
    }`}>
        <div className="flex items-center gap-4">
            <div className={`flex-shrink-0 grid place-items-center w-12 h-12 rounded-full ${
                isPrimary ? 'bg-white/20' : 'bg-white'
            }`}>
                {icon}
            </div>
            <div>
                <h3 className={`font-bold ${isPrimary ? 'text-white' : 'text-zinc-800'}`}>{title}</h3>
                <p className={`text-sm ${isPrimary ? 'text-white/80' : 'text-slate-500'}`}>{description}</p>
            </div>
        </div>
    </Link>
);

export default function HomeLogin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-amber-100">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
        
        {/* Columna de Video (Visible en pantallas grandes) */}
        <div className="hidden lg:block relative">
            <video 
                src="/video-mexico.mp4" 
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
            />
            <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Columna de Contenido */}
        <div className="p-8 md:p-12 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
                {/* <img src={logo} alt="Logo Pueblos de Ensueño" className="h-12"/> */}
                <div className="w-12 h-12 grid place-items-center bg-orange-100 rounded-full">
                    <Compass size={28} className="text-orange-500"/>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-zinc-800">Pueblos de Ensueño</h1>
                    <p className="text-slate-500">Plataforma de Viajes</p>
                </div>
            </div>

            <h2 className="text-3xl font-bold mb-2 text-zinc-800">
                ¡Hola de nuevo, {userData.name}!
            </h2>
            <p className="text-slate-500 mb-8">
                Tu próxima aventura te está esperando. ¿Qué te gustaría hacer hoy?
            </p>

            <div className="space-y-4 flex-grow">
                <ActionButton 
                    to="/mapa"
                    icon={<Map size={24} className="text-white"/>}
                    title="Explorar el Mapa"
                    description="Descubre rutas y lugares mágicos."
                    isPrimary={true}
                />
                <ActionButton 
                    to="/perfil"
                    icon={<User size={24} className="text-orange-500"/>}
                    title="Mi Perfil"
                    description="Consulta tus itinerarios guardados."
                />
                <ActionButton 
                    to="/puntos-cercanos"
                    icon={<MapPin size={24} className="text-orange-500"/>}
                    title="Puntos Cercanos"
                    description="Encuentra lugares de interés cerca de ti."
                />
                <ActionButton 
                    to="/InterestsSelector"
                    icon={<Sparkles size={24} className="text-orange-500"/>}
                    title="Ajustar Intereses"
                    description="Personaliza tus recomendaciones."
                />
            </div>

            <div className="pt-8 mt-auto">
                <button
                    onClick={handleLogout}
                    className="text-sm text-slate-500 hover:text-orange-600 hover:underline font-medium flex items-center justify-center gap-2 mx-auto transition-colors"
                >
                    <LogOut size={16} />
                    Cerrar sesión
                </button>
            </div>
        </div>
      </div>
    </div>
  );
}