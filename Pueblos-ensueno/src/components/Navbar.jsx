// Archivo: src/components/Navbar.jsx

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react';
import logo from '../assets/Logo.png'; 

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // NOTA: He añadido los enlaces y el switch de idioma de tu Home.jsx original aquí.
  const textLinks = [
    { path: '/mapa', label: t('menu.map') }
  ];

  const allLinks = [
    ...textLinks,
    { path: '/login', label: t('menu.login') }
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full py-4 px-6 flex justify-between items-center bg-gray-900 shadow-lg">
        <Link to="/" className="flex items-center gap-4" aria-label="Volver a la página de inicio">
          <img src={logo} alt="Pueblos de Ensueño - Logotipo" className="h-10 sm:h-12 w-auto" />
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide text-white drop-shadow-lg">
            {t('header.title')}
          </h1>
        </Link>

        <nav aria-label="Navegación principal" className="hidden md:flex gap-6 lg:gap-8 items-center">
          {textLinks.map((link) => (
            <NavLink 
              key={link.path} 
              to={link.path}
              className="font-semibold text-lg text-white/90 transition hover:text-white"
            >
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/login"
            className="px-5 py-2 bg-stone-100 hover:bg-stone-200 text-zinc-800 rounded-full font-semibold shadow-md transition-all"
          >
            {t('menu.login')}
          </Link>
          
          {/* Switch de Idioma */}
          <div className="flex bg-gray-700 rounded-full p-1">
            <button onClick={() => i18n.changeLanguage("es")} className={`px-3 py-1 text-sm rounded-full ${i18n.language === 'es' ? 'bg-stone-100 text-black' : 'text-white'}`}>ES</button>
            <button onClick={() => i18n.changeLanguage("en")} className={`px-3 py-1 text-sm rounded-full ${i18n.language === 'en' ? 'bg-stone-100 text-black' : 'text-white'}`}>EN</button>
          </div>
        </nav>

        <button
          className="block md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu size={28} />
        </button>
      </header>
      
      <div className="h-1.5 w-full bg-[linear-gradient(to_right,_#D92626,_#3A994A,_#F2B705,_#1C69A6)]"></div>

      {mobileMenuOpen && (
        <nav className="md:hidden bg-white shadow-lg px-6 py-4 space-y-2">
          {allLinks.map((link) => (
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