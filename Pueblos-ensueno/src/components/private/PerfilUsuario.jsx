import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Map, Star, Settings, LogOut, ArrowRight, Sparkles, Calendar, Trash2, Edit, PlusCircle, Mail, Lock } from 'lucide-react';

import jicaraImg from '../../assets/img/tabasco/jícara.gif';
import guayaberaImg from '../../assets/img/tabasco/guayabera.jpg';
import canastaImg from '../../assets/img/tabasco/canasta.mimbre.jpg';
import cabezaOlmecaImg from '../../assets/img/tabasco/cabeza-olmeca.jpg';
import userAvatar from '../../assets/Integrantes/Fernando.jpg';


const userData = {
  name: 'Fernando Estrella',
  email: 'fernando.estrella@example.com',
  avatar: userAvatar,
};

const favoriteProducts = [
  { src: jicaraImg, nombre: "Jícara decorada", artesano: "Doña Lupita" },
  { src: guayaberaImg, nombre: "Guayabera bordada", artesano: "Tapijulapa" },
  { src: canastaImg, nombre: "Canasta de mimbre", artesano: "Artesanías D. Pedro" },
];

const favoritePlaces = [
  { src: cabezaOlmecaImg, nombre: "Cabeza Olmeca", tipo: "Zona arqueológica" },
];

const userItineraries = [
    { id: 1, name: "Ruta del Cacao", destination: "Tabasco, México", dates: "30/05/2025 - 02/06/2025", status: "Próximo" },
    { id: 2, name: "Aventura en la Selva", destination: "Chiapas, México", dates: "15/08/2024 - 20/08/2024", status: "Pasado" },
    { id: 3, name: "Explorando la Huasteca", destination: "San Luis Potosí", dates: "No planificado", status: "Borrador" },
];


// --- COMPONENTES INTERNOS PARA UN CÓDIGO MÁS LIMPIO ---

const ProfileSidebar = ({ activeSection, setActiveSection, onLogout }) => (
  <aside className="col-span-12 lg:col-span-3 bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-white">
    <div className="flex flex-col items-center text-center">
      <img src={userData.avatar} alt="Avatar" className="w-24 h-24 rounded-full mb-4 border-4 border-white shadow-md object-cover" />
      <h2 className="text-xl font-bold text-zinc-800">{userData.name}</h2>
      <p className="text-sm text-slate-500">{userData.email}</p>
    </div>
    <nav className="mt-8 space-y-2">
      <SidebarButton text="Resumen" icon={<User size={20} />} active={activeSection === 'resumen'} onClick={() => setActiveSection('resumen')} />
      <SidebarButton text="Mis Itinerarios" icon={<Map size={20} />} active={activeSection === 'itinerarios'} onClick={() => setActiveSection('itinerarios')} />
      <SidebarButton text="Favoritos" icon={<Star size={20} />} active={activeSection === 'favoritos'} onClick={() => setActiveSection('favoritos')} />
      <SidebarButton text="Ajustes" icon={<Settings size={20} />} active={activeSection === 'ajustes'} onClick={() => setActiveSection('ajustes')} />
    </nav>
    <div className="mt-8 pt-4 border-t border-slate-200">
        <SidebarButton text="Cerrar Sesión" icon={<LogOut size={20} />} isLogout={true} onClick={onLogout} />
    </div>
  </aside>
);

const SidebarButton = ({ text, icon, active = false, onClick = () => {}, isLogout = false }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-colors ${
        active 
        ? 'bg-orange-500 text-white shadow-md' 
        : `text-slate-600 hover:bg-slate-200 ${isLogout && 'hover:bg-red-100 hover:text-red-600'}`
    }`}>
        {icon}
        <span>{text}</span>
    </button>
);

const InfoCard = ({ icon, title, children, linkTo, linkText }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full grid place-items-center text-orange-500">{icon}</div>
            <h3 className="text-xl font-bold text-zinc-800">{title}</h3>
        </div>
        <div className="text-slate-600 mb-4">{children}</div>
         {linkTo && linkText && (
            <Link to={linkTo} className="flex items-center gap-2 font-semibold text-orange-600 hover:text-orange-700 transition-colors">
                <span>{linkText}</span>
                <ArrowRight size={16} />
            </Link>
        )}
    </div>
);

const FavoriteItem = ({ link, image, title, subtitle }) => (
    <Link to={link}>
        <div className="bg-white rounded-lg overflow-hidden shadow-md border border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <img src={image} alt={title} className="h-40 w-full object-cover" />
            <div className="p-4">
                <p className="font-semibold text-zinc-800">{title}</p>
                <p className="text-xs text-slate-500">{subtitle}</p>
            </div>
        </div>
    </Link>
);

const ItineraryCard = ({ itinerary }) => {
    const statusStyles = {
        'Próximo': 'bg-green-100 text-green-700',
        'Pasado': 'bg-slate-100 text-slate-600',
        'Borrador': 'bg-amber-100 text-amber-700',
    };
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusStyles[itinerary.status] || 'bg-gray-100'}`}>{itinerary.status}</span>
                <h4 className="text-lg font-bold text-zinc-800 mt-2">{itinerary.name}</h4>
                <p className="text-sm text-slate-500">{itinerary.destination} • {itinerary.dates}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                <Link to="/itinerario">
                    <button className="p-2 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"><Edit size={16} /></button>
                </Link>
                <button className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"><Trash2 size={16} /></button>
            </div>
        </div>
    );
};

const SettingsSection = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold text-zinc-800 mb-4 pb-4 border-b border-slate-200">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const SettingsInput = ({ label, type, id, value, icon, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                {icon}
            </div>
            <input 
                type={type} 
                id={id} 
                defaultValue={value}
                placeholder={placeholder} 
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
            />
        </div>
    </div>
);


// --- COMPONENTE PRINCIPAL ---

export default function PerfilUsuario() {
  const [activeSection, setActiveSection] = useState('resumen');
  const [activeTab, setActiveTab] = useState('productos');
  const navigate = useNavigate();

  const handleLogout = () => {
      console.log('Cerrando sesión...');
      navigate('/');
  };

  const renderContent = () => {
    switch (activeSection) {
        case 'resumen':
            return (
                <div className="space-y-6">
                    <InfoCard 
                        icon={<User size={24} />} 
                        title={`¡Bienvenido de nuevo, ${userData.name}!`}
                        linkTo="/mapa" 
                        linkText="Explorar el mapa ahora"
                    >
                        <p>
                            Aquí tienes un resumen de tu actividad. Tienes <strong>{userItineraries.length} itinerarios</strong> y <strong>{favoriteProducts.length + favoritePlaces.length} favoritos</strong> guardados. ¡Sigue explorando para descubrir más!
                        </p>
                    </InfoCard>
                    <InfoCard 
                        icon={<Sparkles size={24} />} 
                        title="Descubre Nuevas Aventuras" 
                        linkTo="/InterestsSelector" 
                        linkText="Ajustar mis intereses"
                    >
                        <p>
                           Personaliza tus <strong>intereses</strong> para recibir recomendaciones únicas en tu próximo viaje.
                        </p>
                    </InfoCard>
                </div>
            );
        case 'itinerarios':
            return (
                <div className="space-y-6">
                    <div className="flex justify-end">
                        <Link to="/mapa">
                             <button className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition">
                                <PlusCircle size={18} />
                                <span>Crear Nuevo Itinerario</span>
                            </button>
                        </Link>
                    </div>
                    {userItineraries.map(it => <ItineraryCard key={it.id} itinerary={it} />)}
                </div>
            );
        case 'favoritos':
            return (
                <div>
                    <div className="flex border-b border-slate-200 mb-6">
                        <button onClick={() => setActiveTab('productos')} className={`px-4 py-2 font-semibold ${activeTab === 'productos' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-slate-500'}`}>Productos</button>
                        <button onClick={() => setActiveTab('lugares')} className={`px-4 py-2 font-semibold ${activeTab === 'lugares' ? 'text-orange-600 border-b-2 border-orange-600' : 'text-slate-500'}`}>Puntos de Interés</button>
                    </div>
                    {activeTab === 'productos' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favoriteProducts.map(item => <FavoriteItem key={item.nombre} link="/productos-tabasco" image={item.src} title={item.nombre} subtitle={item.artesano} />)}
                        </div>
                    )}
                    {activeTab === 'lugares' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favoritePlaces.map(item => <FavoriteItem key={item.nombre} link="/puntos-cercanos" image={item.src} title={item.nombre} subtitle={item.tipo} />)}
                        </div>
                    )}
                </div>
            );
        case 'ajustes':
            return (
                 <div className="space-y-8">
                    <SettingsSection title="Información Personal">
                        <div className="flex items-center gap-4">
                            <img src={userData.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
                            <button className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm hover:bg-slate-300">Cambiar foto</button>
                        </div>
                        <SettingsInput label="Nombre Completo" type="text" id="name" value={userData.name} icon={<User size={16} />} />
                        <SettingsInput label="Correo Electrónico" type="email" id="email" value={userData.email} icon={<Mail size={16} />} />
                    </SettingsSection>

                    <SettingsSection title="Seguridad">
                         <SettingsInput label="Contraseña Actual" type="password" id="current-password" placeholder="••••••••" icon={<Lock size={16} />} />
                         <SettingsInput label="Nueva Contraseña" type="password" id="new-password" placeholder="••••••••" icon={<Lock size={16} />} />
                    </SettingsSection>
                    
                    <div className="flex justify-end">
                        <button className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition">
                            Guardar Cambios
                        </button>
                    </div>

                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                        <h4 className="font-bold text-red-800">Zona de Peligro</h4>
                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm text-red-700">Eliminar tu cuenta es una acción permanente.</p>
                            <button className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg text-sm hover:bg-red-700">
                                Eliminar Cuenta
                            </button>
                        </div>
                    </div>
                </div>
            );
        default:
            return <p className="text-center text-slate-500 py-10">Sección en construcción.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-100 px-4 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <ProfileSidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={handleLogout} />
        <main className="col-span-12 lg:col-span-9 bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-white">
            <h1 className="text-3xl font-bold text-zinc-800 mb-6 capitalize">{activeSection}</h1>
            {renderContent()}
        </main>
      </div>
    </div>
  );
}

