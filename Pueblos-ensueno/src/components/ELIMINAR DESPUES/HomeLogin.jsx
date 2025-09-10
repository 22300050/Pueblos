import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import logo from '../assets/Logo.png';

export default function HomeLogin() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-amber-200 to-lime-200 text-gray-800">
      <header className="w-full py-4 px-6 flex justify-between items-center bg-white/40 backdrop-blur-md shadow-md">
        <div className="flex items-center gap-4">
          <img src={logo} alt="Logo" className="h-10 sm:h-12 w-auto" />
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide drop-shadow-md text-black">
            Pueblos de Ensueño
          </h1>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-3 lg:gap-5 items-center">
          <Link to="/perfil">
            <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-br from-rose-200 via-amber-200 to-cyan-100 text-gray-800 rounded-lg font-semibold hover:brightness-105 transition text-sm sm:text-base border border-white/30">
              Perfil
            </button>
          </Link>
          <Link to="/mapa">
            <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-br from-rose-200 via-amber-200 to-green-100 text-gray-800 rounded-lg font-semibold hover:brightness-105 transition text-sm sm:text-base border border-white/30">
              Mapa Interactivo
            </button>
          </Link>
          <Link to="/puntos-cercanos">
            <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-br from-rose-200 via-amber-200 to-yellow-300 text-gray-800 rounded-lg font-semibold hover:brightness-105 transition text-sm sm:text-base border border-white/30">
              Puntos cercanos
            </button>
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button className="block md:hidden">
          <Menu size={24} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        </button>
      </header>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white/80 backdrop-blur-md shadow-md px-6 py-4 space-y-2">
          <Link to="/perfil">
            <button className="w-full px-4 py-2 bg-gradient-to-br from-rose-200 via-amber-200 to-cyan-100 text-gray-800 rounded-lg font-semibold hover:brightness-105 transition border border-white/30">
              Perfil
            </button>
          </Link>
          <Link to="/mapa">
            <button className="w-full px-4 py-2 bg-gradient-to-br from-rose-200 via-amber-200 to-green-100 text-gray-800 rounded-lg font-semibold hover:brightness-105 transition border border-white/30">
              Mapa Interactivo
            </button>
          </Link>
          <Link to="/puntos-cercanos">
            <button className="w-full px-4 py-2 bg-gradient-to-br from-rose-200 via-amber-200 to-yellow-300 text-gray-800 rounded-lg font-semibold hover:brightness-105 transition border border-white/30">
              Puntos cercanos
            </button>
          </Link>
        </nav>
      )}

      <main className="flex flex-col lg:flex-row justify-between items-center px-4 sm:px-8 lg:px-24 py-12 sm:py-20">
        <div className="max-w-full lg:max-w-xl text-center lg:text-left">
<h2 className="text-3xl ...">
  {t('hero.subtitle')}
  <br />
  <span className="text-yellow-600">{t('header.title')}</span>
</h2>
          <p className="text-base sm:text-lg text-gray-700 mb-6 font-medium">
            Vive una experiencia cultural única, descubre tradiciones, paisajes y eventos como nunca antes.
          </p>
        </div>

        <div className="w-full mt-8 lg:mt-0 lg:w-1/2">
          <video
            src="/video-mexico.mp4"
            className="w-full h-48 sm:h-64 md:h-80 lg:h-[480px] rounded-2xl shadow-2xl object-cover"
            controls
            autoPlay
            playsInline
          />
        </div>
      </main>
    </div>
  );
}
