// Archivo: src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
// import { useTranslation } from 'react-i18next'; // Eliminado para la previsualización
import { Menu, X, MapPin, LogIn, UserPlus, Map } from 'lucide-react';
import logo from '../../assets/Logos/Logo.png';


export default function Navbar() {
  // Mock de la función de traducción para la previsualización
  const t = (key, fallback) => fallback || key;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Se agrupan los enlaces para una mejor organización y se añaden íconos distintivos
  const navLinks = [
    { path: '/puntos-cercanos', label: t('menu.nearby', 'Puntos Cercanos'), icon: <MapPin size={20} /> },
    { path: '/mapa', label: t('menu.map', 'Mapa Interactivo'), icon: <Map size={20} /> },
  ];

  const authLinks = [
    { path: '/login', label: t('menu.login', 'Iniciar sesión'), icon: <LogIn size={20} />, primary: false },
    { path: '/register', label: t('menu.register', 'Regístrate'), icon: <UserPlus size={20} />, primary: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-[60] w-full bg-gray-900 shadow-lg relative">
        <div className="flex justify-between items-center py-4 px-6">
          <Link to="/" className="flex items-center gap-4" aria-label="Volver a la página de inicio">
            <img src={logo} alt="Pueblos de Ensueño - Logotipo" className="h-10 sm:h-12 w-auto" />
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide text-white drop-shadow-lg">
              {t('header.title', 'Pueblos de Ensueño')}
            </h1>
          </Link>

          {/* Navegación de Escritorio */}
          <nav aria-label="Navegación principal" className="hidden md:flex gap-6 lg:gap-8 items-center">
            {navLinks.map(link => (
              <NavLink 
                key={link.path}
                to={link.path}
                className={({isActive}) => 
                    `font-semibold text-lg transition hover:text-white hover:scale-105 ${isActive ? 'text-white' : 'text-white/80'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="flex items-center gap-3">
              {authLinks.map(link => (
                <Link key={link.path} to={link.path}>
                  <button className={`px-5 py-2 rounded-full font-semibold shadow-md transition-all transform hover:scale-105 ${
                    link.primary
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-zinc-800'
                  }`}>
                    {link.label}
                  </button>
                </Link>
              ))}
            </div>
          </nav>

          {/* Botón de Menú Móvil */}
          <button
            className="block md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[linear-gradient(to_right,_#D92626,_#3A994A,_#F2B705,_#1C69A6)]"></div>
        
        {/* Panel de Navegación Móvil con Fondo Naranja de la marca */}
        <nav className={`absolute top-full left-0 right-0 bg-orange-500 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${mobileMenuOpen ? 'scale-y-100' : 'scale-y-0'} origin-top`}>
            <div className="p-4 space-y-2">
                {navLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-4 w-full p-3 rounded-lg font-semibold text-white/90 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </Link>
                ))}
                
                <hr className="border-white/20 my-2" />

                {authLinks.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <button className={`w-full flex items-center justify-center gap-3 p-3 rounded-lg font-semibold transition-colors ${
                            link.primary
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-md' // Botón rojito
                                : 'bg-white/10 text-white hover:bg-white/20'
                        }`}>
                            {link.icon}
                            <span>{link.label}</span>
                        </button>
                    </Link>
                ))}
            </div>
        </nav>
      </header>
    </>
  );
}

