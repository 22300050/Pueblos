// Archivo: src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react';
import logo from '../../assets/Logos/Logo.png'; // Ruta de imagen actualizada

export default function Navbar() {
  // Mock de la función de traducción para la previsualización
  const t = (key, fallback) => fallback || key;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Se agrupan los enlaces para una mejor organización
  const navLinks = [
    { path: '/puntos-cercanos', label: t('menu.nearby', 'Puntos Cercanos') },
    { path: '/mapa', label: t('menu.map', 'Mapa Interactivo') },
  ];

  const authLinks = [
    { path: '/login', label: t('menu.login', 'Iniciar sesión'), primary: false },
    { path: '/register', label: t('menu.register', 'Regístrate'), primary: true },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-gray-900 shadow-lg relative">
        <div className="flex justify-between items-center py-4 px-6">
          <Link to="/" className="flex items-center gap-4" aria-label="Volver a la página de inicio">
            <img src={logo} alt="Pueblos de Ensueño - Logotipo" className="h-10 sm:h-12 w-auto" />
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide text-white drop-shadow-lg">
              {t('header.title', 'Pueblos de Ensueño')}
            </h1>
          </Link>

          {/* Navegación de Escritorio Actualizada */}
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
            <Menu size={28} />
          </button>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[linear-gradient(to_right,_#D92626,_#3A994A,_#F2B705,_#1C69A6)]"></div>
      </header>
      
      {/* Panel de Navegación Móvil Actualizado */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white shadow-lg px-6 py-4 space-y-2">
          {[...navLinks, ...authLinks].map((link) => (
             <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)}>
                <button className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-colors ${
                  link.primary
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}>
                  {link.label}
                </button>
             </Link>
          ))}
        </nav>
      )}
    </>
  );
}

