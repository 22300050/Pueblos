// Archivo: src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Tus componentes de animación
import WelcomeAnimation from './components/WelcomeAnimation';
import LoadingAnimation from './components/LoadingAnimation';

// --- 1. IMPORTAMOS NUESTRO NUEVO DETECTOR ---
import useIsDesktop from './hooks/useIsDesktop';

// El resto de tus componentes
import Register from './components/Register';
import Login from './components/Login';
import InterestsSelector from './components/InterestsSelector';
import MapaMexico from './components/MapaMexico';
import Home from './components/Home';
import PuntosCercanos from './components/PuntosCercanos';
import ProductosTabasco from './components/ProductosTabasco';
import PerfilUsuario from './components/PerfilUsuario';
import RealTimeMap from './components/RealTimeMap';
import HomeLogin from './components/HomeLogin';
import Itinerario from './components/Itinerario';
import MunicipioDetalle from './components/MunicipioDetalle';
import MapaTabasco from './components/MapaTabasco';
import './locales/i18n';
import Directorios from "./components/Directorios";
import Nosotros from './components/Nosotros';
import MonumentoCabezaOlmeca from "./components/MonumentoCabezaOlmeca";

function App() {
  // --- 2. USAMOS EL DETECTOR PARA SABER EL TAMAÑO DE LA PANTALLA ---
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


  // --- 3. ACTUALIZAMOS LA LÓGICA DE RENDERIZADO ---
  // Ahora la animación de bienvenida solo se mostrará si `showWelcome` es true Y si `isDesktop` es true.
  if (showWelcome && isDesktop) {
    return <WelcomeAnimation onAnimationComplete={handleWelcomeComplete} />;
  }

  // La lógica de la animación de carga no cambia.
  if (isLoading) {
    return <LoadingAnimation />;
  }

  // La aplicación principal.
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/InterestsSelector" element={<InterestsSelector />} />
          <Route path="/mapa" element={<MapaMexico />} />
          <Route path="/puntos-cercanos" element={<PuntosCercanos />} />
          <Route path="/productos-tabasco" element={<ProductosTabasco />} />
          <Route path="/perfil" element={<PerfilUsuario />} />
          <Route path="/real-time-map" element={<RealTimeMap />} />
          <Route path="/homelogin" element={<HomeLogin />} />
          <Route path="/itinerario" element={<Itinerario />} />
          <Route path="/municipio/:nombre" element={<MunicipioDetalle />} />
          <Route path="/mapa-tabasco" element={<MapaTabasco />} />
          <Route path="/directorios" element={<Directorios />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/monumento/cabeza-olmeca" element={<MonumentoCabezaOlmeca />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;