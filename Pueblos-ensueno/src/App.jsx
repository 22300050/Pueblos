import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import InterestsSelector from './components/InterestsSelector'
import MapaMexico from './components/MapaMexico'
import Home from './components/Home'
import PuntosCercanos from './components/PuntosCercanos'
import ProductosTabasco from './components/ProductosTabasco';
import PerfilUsuario from './components/PerfilUsuario';
import RealTimeMap from './components/RealTimeMap';
import HomeLogin from './components/HomeLogin';
import Itinerario from './components/Itinerario';
import MunicipioDetalle from './components/MunicipioDetalle';
import MapaTabasco from './components/MapaTabasco';
import { useEffect } from "react";
import './locales/i18n';
import Directorios from "./components/Directorios";
import Nosotros from './components/Nosotros';

function App() {

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then(reg => console.log("SW registrado:", reg.scope))
        .catch(err => alert("Error registrando SW: " + (err?.message || err)));
    }
  }, []);

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
        </Routes>
      </div>
    </Router>
  )
}

export default App
