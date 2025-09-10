import React from 'react';
import { Link } from 'react-router-dom';
import jicaraImg from '../assets/jícara.gif';
import guayaberaImg from '../assets/guayabera.jpg';
import canastaImg from '../assets/canasta.mimbre.jpg';
import molcajeteImg from '../assets/molcajete.jpg';
import ceramicaImg from '../assets/ceramica.jpg';
import cabezaOlmecaImg from '../assets/cabeza-olmeca.jpg';

export default function PerfilUsuario() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-amber-200 to-lime-200 px-6 py-4 relative">
      {/* Botón superior derecho */}
<div className="absolute top-4 right-4 flex gap-2">
  <Link to="/mapa">
    <button className="bg-lime-300 hover:bg-lime-400 text-gray-800 font-semibold px-5 py-2 rounded-lg shadow-md transition">
      Ir al Mapa
    </button>
  </Link>
  <Link to="/">
    <button className="bg-rose-300 hover:bg-rose-400 text-gray-800 font-semibold px-5 py-2 rounded-lg shadow-md transition">
      Cerrar sesión
    </button>
  </Link>
</div>


      {/* Contenido principal */}
      <div className="flex justify-center items-start h-full mt-10">
        <div className="bg-white/90 shadow-2xl rounded-2xl p-8 w-full max-w-5xl border-2 border-pink-300">
          <h1 className="text-3xl font-extrabold text-pink-600 mb-6 text-center">
            👤 Bienvenido a tu perfil
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Itinerario e intereses */}
            <div>
              <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded-lg mb-4 flex justify-between items-center">
                <div>
                  <strong className="text-yellow-700">Itinerarios:</strong> Itinerario 30/05/2025
                </div>
                <Link to="/itinerario">
                  <button className="bg-blue-200 hover:bg-blue-300 text-blue-800 px-4 py-1 rounded-md transition">
                    Ver mi itinerario
                  </button>
                </Link>
              </div>

              <div className="bg-teal-100 border-l-4 border-teal-400 p-4 rounded-lg">
                <strong className="text-teal-700">Intereses:</strong> 🪅 Ferias Tradicionales, 🎉 Carnavales
              </div>
            </div>

            {/* Favoritos */}
            <div>
              <h2 className="text-xl font-bold text-pink-500 mb-2">⭐ Favoritos</h2>

              {/* Categoría Productos */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-yellow-600 mb-2">Productos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { src: jicaraImg, nombre: "Jícara decorada", artesano: "Doña Lupita" },
                    { src: guayaberaImg, nombre: "Guayabera bordada", artesano: "Tapijulapa" },
                    { src: canastaImg, nombre: "Canasta de mimbre", artesano: "Artesanías Don Pedro" },
                    { src: molcajeteImg, nombre: "Molcajete tallado", artesano: "Taller Ruiz" },
                    { src: ceramicaImg, nombre: "Cerámica pintada", artesano: "Artesanía del Usumacinta" }
                  ].map((item, i) => (
                    <Link to="/productos-tabasco" key={i}>
                      <div className="cursor-pointer bg-white border rounded-lg shadow-md p-2 text-center hover:shadow-lg transition">
                        <img src={item.src} alt={item.nombre} className="h-32 w-full object-cover rounded-md" />
                        <p className="text-sm mt-2 font-medium text-pink-700">{item.nombre}</p>
                        <p className="text-xs text-gray-500">{item.artesano}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categoría Puntos de interés */}
              <div>
                <h3 className="text-lg font-semibold text-rose-600 mb-2">Puntos de interés</h3>
                <Link to="/puntos-cercanos">
                  <div className="cursor-pointer bg-white border rounded-lg shadow-md p-2 text-center hover:shadow-lg transition">
                    <img src={cabezaOlmecaImg} alt="Cabeza Olmeca" className="h-32 w-full object-cover rounded-md" />
                    <p className="text-sm mt-2 font-medium text-pink-700">Cabeza Olmeca</p>
                    <p className="text-xs text-gray-500">Zona arqueológica</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
