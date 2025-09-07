// Archivo: src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes de Layout
import Topbar from './components/layouts/Topbar';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer'; 

// Componentes de Animación
import WelcomeAnimation from './components/animations/WelcomeAnimation';
import LoadingAnimation from './components/animations/LoadingAnimation';

// Hook de Detección de Escritorio
import useIsDesktop from './hooks/useIsDesktop';

// El resto de tus componentes de página
import Home from './components/pages/Home';
import Nosotros from './components/pages/Nosotros';
import Mantenimiento from './components/pages/Mantenimiento';
import Directorios from "./components/pages/Directorios";

import MapaMexico from './components/maps/MapaMexico';
import MapaTabasco from './components/maps/MapaTabasco';
import MapaChiapas from './components/maps/MapaChiapas';

import Register from './components/pages/Register';
import Login from './components/pages/Login';
import InterestsSelector from './components/pages/InterestsSelector';

import PuntosCercanos from './components/PuntosCercanos';
import ProductosTabasco from './components/ProductosTabasco';
import PerfilUsuario from './components/PerfilUsuario';
import HomeLogin from './components/HomeLogin';
import Itinerario from './components/Itinerario';
import MunicipioDetalle from './components/MunicipioDetalle';
import MunicipioDetalleChiapas from './components/MunicipioDetalleChiapas';
import './locales/i18n';

import MonumentoCabezaOlmeca from "./components/MonumentoCabezaOlmeca";

function App() {
  const isDesktop = useIsDesktop();
  const [showWelcome, setShowWelcome] = useState(!sessionStorage.getItem('hasSeenWelcome'));
  const [isLoading, setIsLoading] = useState(true);

  // useEffects (sin cambios)
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then(reg => console.log("SW registrado:", reg.scope))
        .catch(err => alert("Error registrando SW: " + (err?.message || err)));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleWelcomeComplete = () => {
    sessionStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
  };

  // Lógica de Renderizado de Animaciones
  if (showWelcome && isDesktop) {
    return <WelcomeAnimation onAnimationComplete={handleWelcomeComplete} />;
  }
  if (isLoading) {
    return <LoadingAnimation />;
  }

  // La aplicación principal con el layout completo
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Layout Persistente Superior */}
        <Topbar />
        <Navbar />

        {/* Contenido Principal de la Página */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/nosotros" element={<Nosotros />} />            
            <Route path="/Mantenimiento" element={<Mantenimiento />} />
            <Route path="/directorios" element={<Directorios />} />

            <Route path="/mapa" element={<MapaMexico />} />
            <Route path="/mapa-tabasco" element={<MapaTabasco />} />
            <Route path="/mapa-chiapas" element={<MapaChiapas />} />  
                      
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/InterestsSelector" element={<InterestsSelector />} />

            <Route path="/puntos-cercanos" element={<PuntosCercanos />} />
            <Route path="/productos-tabasco" element={<ProductosTabasco />} />
            <Route path="/perfil" element={<PerfilUsuario />} />
            <Route path="/homelogin" element={<HomeLogin />} />
            <Route path="/itinerario" element={<Itinerario />} />
            <Route path="/municipio/:nombre" element={<MunicipioDetalle />} />
            <Route path="/chiapas/municipio/:nombre" element={<MunicipioDetalleChiapas />} />


            <Route path="/monumento/cabeza-olmeca" element={<MonumentoCabezaOlmeca />} />
          </Routes>
        </main>

        {/* Layout Persistente Inferior */}
        <Footer />
      </div>
    </Router>
  )
}

export default App;