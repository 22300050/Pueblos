// Archivo: src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react';
import logo from '../../assets/Logos/Logo.png'; // Ruta de imagen actualizada

export default function Navbar() {
  const { t } = useTranslation(); // 'i18n' no se usaba, así que lo quité
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Definimos los enlaces aquí para reutilizarlos
  const navLinks = [
    { path: '/mapa', label: t('menu.map') },
    { path: '/login', label: t('menu.login') },
  ];

  return (
    // Usamos un Fragment <></> para devolver múltiples elementos a nivel raíz
    <>
      {/* El header ahora tiene una posición relativa para contener el listón */}
      <header className="sticky top-0 z-50 w-full bg-gray-900 shadow-lg relative">
        <div className="flex justify-between items-center py-4 px-6">
          <Link to="/" className="flex items-center gap-4" aria-label="Volver a la página de inicio">
            <img src={logo} alt="Pueblos de Ensueño - Logotipo" className="h-10 sm:h-12 w-auto" />
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide text-white drop-shadow-lg">
              {t('header.title')}
            </h1>
          </Link>

          {/* Navegación de Escritorio */}
          <nav aria-label="Navegación principal" className="hidden md:flex gap-6 lg:gap-8 items-center">
            {/* Filtramos el primer enlace para que sea texto */}
            <NavLink 
              to={navLinks[0].path}
              className="font-semibold text-lg text-white/90 transition hover:text-white"
            >
              {navLinks[0].label}
            </NavLink>
            {/* El segundo enlace es un botón */}
            <Link
              to={navLinks[1].path}
              className="px-5 py-2 bg-stone-100 hover:bg-stone-200 text-zinc-800 rounded-full font-semibold shadow-md transition-all"
            >
              {navLinks[1].label}
            </Link>
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
        
        {/* El "listón digital" ahora está dentro y posicionado en la parte inferior del header */}
        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-[linear-gradient(to_right,_#D92626,_#3A994A,_#F2B705,_#1C69A6)]"></div>
      </header>
      
      {/* Panel de Navegación Móvil */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white shadow-lg px-6 py-4 space-y-2">
          {navLinks.map((link) => (
             <Link key={link.path} to={link.path} onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full text-left px-4 py-3 rounded-lg font-semibold bg-gray-100 text-gray-800 hover:bg-gray-200">
                  {link.label}
                </button>
             </Link>
          ))}
        </nav>
      )}
    </>
  );
}