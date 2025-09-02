// Archivo: src/App.jsx

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- 1. IMPORTAMOS AMBAS ANIMACIONES ---
import WelcomeAnimation from './components/WelcomeAnimation';
import LoadingAnimation from './components/LoadingAnimation';

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

  // --- 2. NUEVO ESTADO PARA LA ANIMACIÓN DE BIENVENIDA ---
  // Revisa si el usuario ya vio la animación en esta sesión del navegador.
  const [showWelcome, setShowWelcome] = useState(!sessionStorage.getItem('hasSeenWelcome'));
  
  // Estado para la animación de carga (se mantiene igual)
  const [isLoading, setIsLoading] = useState(true);

  // Tu código para el Service Worker (se mantiene igual)
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then(reg => console.log("SW registrado:", reg.scope))
        .catch(err => alert("Error registrando SW: " + (err?.message || err)));
    }
  }, []);

  // Lógica para la animación de carga (se mantiene igual)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // --- 3. NUEVA FUNCIÓN PARA CUANDO LA BIENVENIDA TERMINE ---
  const handleWelcomeComplete = () => {
    // Guarda en la memoria de la sesión que la animación ya se vio.
    sessionStorage.setItem('hasSeenWelcome', 'true');
    // Oculta el componente de bienvenida.
    setShowWelcome(false);
  };

  // --- 4. LÓGICA DE RENDERIZADO ACTUALIZADA ---

  // Primero, revisa si hay que mostrar la animación de bienvenida.
  if (showWelcome) {
    return <WelcomeAnimation onAnimationComplete={handleWelcomeComplete} />;
  }

  // Si no, revisa si hay que mostrar la animación de carga.
  if (isLoading) {
    return <LoadingAnimation />;
  }

  // Si ninguna de las anteriores, muestra la aplicación.
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